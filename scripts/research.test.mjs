import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import ts from "typescript";
import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);
test("CLI lists and reads research separately without project statuses", async () => {
  const server = createServer((req, res) => {
    const file = `public${req.url}`;
    if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
    res.end(fs.readFileSync(file));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const run = (...args) => exec(process.execPath, ["packages/cli/bin/seb-builds.mjs", ...args], {
      env: { ...process.env, SEB_BUILDS_BASE_URL: `http://127.0.0.1:${server.address().port}` },
    });
    const listing = (await run("ls", "./research", "--all")).stdout;
    assert.ok(listing.includes("/research/the-headless-product"));
    assert.ok(!listing.includes("shipped"));
    const all = (await run("ls", "./", "--all")).stdout;
    for (const slug of slugs) {
      assert.ok(all.includes(`./research/${slug}.md`));
      assert.ok(!all.includes(`./projects/${slug}.md`));
      const raw = JSON.parse(fs.readFileSync(`public/content/research/${slug}.json`, "utf8"));
      const article = (await run("cat", `./research/${slug}.md`)).stdout;
      assert.ok(article.includes(raw.body));
      assert.ok(article.includes(raw.description));
    }
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

const source = fs.readFileSync("src/lib/content.ts", "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const content = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const slugs = ["ai-engineering-vs-vibe-coding", "the-headless-product", "ai-frontier-acceleration-forecast", "how-do-i-build-an-aios"];
const relocatedSlugs = ["the-headless-product", "ai-frontier-acceleration-forecast"];

// Run after npm run build: RESEARCH_EXPORT_TEST=1 node --test scripts/research.test.mjs
if (process.env.RESEARCH_EXPORT_TEST === "1") {
  test("AIOS renders its original Markdown evaluation matrix as a table", () => {
    const file = "out/research/how-do-i-build-an-aios/index.html";
    assert.ok(fs.existsSync(file), "AIOS export exists");
    const html = fs.readFileSync(file, "utf8");
    assert.ok(html.includes("<table"));
    assert.ok(html.includes("<th>Component</th>"));
    assert.ok(html.includes("<td>Abstention</td>"));
  });
  test("static research pages, relocation pages, and discovery feeds use canonical research URLs", () => {
    const read = (name) => fs.readFileSync(`out/${name}`, "utf8");
    const archive = read("research/index.html");
    assert.ok(archive.includes("Research &amp; Essays"));
    assert.ok(!archive.includes("Status:"));
    for (const slug of slugs) {
      const href = `/research/${slug}`;
      const page = read(`research/${slug}/index.html`);
      const legacy = relocatedSlugs.includes(slug) ? read(`projects/${slug}/index.html`) : null;
      for (const html of [page, legacy].filter(Boolean)) {
        assert.ok(html.includes(`rel="canonical" href="https://sebmer.com${href}/"`) || html.includes(`rel="canonical" href="https://sebmer.com${href}"`));
        assert.ok(!html.includes("Status:"));
      }
      if (legacy) assert.ok(legacy.includes(`href="${href}/"`) || legacy.includes(`href="${href}"`));
      else assert.ok(!fs.existsSync(`out/projects/${slug}/index.html`));
      assert.ok(page.includes('&quot;Article&quot;') || page.includes('"@type":"Article"'));
      assert.ok(archive.includes(href));
      assert.ok(read("index.html").includes(href));
      assert.ok(!read("projects/index.html").includes(slug));
      for (const file of ["sitemap.xml", "rss.xml", "llms.txt", "llms-full.txt"]) {
        const text = read(file);
        assert.ok(text.includes(href), `${file} missing ${href}`);
        assert.ok(!text.includes(`https://sebmer.com/projects/${slug}`) && !text.includes(`](/projects/${slug}`), `${file} has old article URL`);
      }
      assert.ok(!fs.existsSync(`out/content/projects/${slug}.json`));
    }
  });
}

test("research has its own typed content collection, not project statuses", () => {
  assert.equal(typeof content.getResearch, "function");
  const research = content.getResearch();
  assert.deepEqual(research.map((entry) => entry.slug), slugs);
  for (const entry of research) {
    assert.equal(entry.kind, "research");
    assert.equal(entry.href, `/research/${entry.slug}`);
    assert.equal("status" in entry, false);
    assert.equal("featured" in entry, false);
    assert.deepEqual(content.getEntryBySlug("research", entry.slug), entry);
    assert.equal(content.getEntryBySlug("projects", entry.slug), undefined);
    assert.equal(fs.existsSync(`public/content/projects/${entry.slug}.json`), false);
    assert.equal(content.getAllEntries().filter((item) => item.slug === entry.slug).length, 1);
  }
});
