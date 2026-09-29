import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const repositoryDirectory = fileURLToPath(new URL("../", import.meta.url));
const compilerUrl = new URL("./compile-content-mdx.mjs", import.meta.url);
const hashBody = (body) => createHash("sha256").update(body).digest("hex");
const exec = promisify(execFile);

async function compile(options) {
  const { compileContentMdx } = await import(compilerUrl.href);
  assert.equal(typeof compileContentMdx, "function");
  return compileContentMdx(options);
}

async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

async function fixture(t, collections = {}) {
  const temporaryParent = path.join(repositoryDirectory, ".next");
  await fs.mkdir(temporaryParent, { recursive: true });
  const rootDirectory = await fs.mkdtemp(path.join(temporaryParent, "mdx-tests-"));
  t.after(() => fs.rm(rootDirectory, { recursive: true, force: true }));
  const outputDirectory = path.join(rootDirectory, "src/generated/mdx");
  const defaults = {
    projects: [{ slug: "alpha", body: "## Project\n\nThe project body." }],
    research: [{ slug: "beta", body: "## Research\n\nThe research body." }],
  };
  const entries = { ...defaults, ...collections };
  for (const kind of ["projects", "research"]) {
    const directory = path.join(rootDirectory, "public/content", kind);
    await writeJson(path.join(directory, "index.json"), {
      items: entries[kind].map((entry) => entry.file ?? `${entry.slug}.json`),
    });
    for (const entry of entries[kind]) {
      await writeJson(path.join(directory, entry.file ?? `${entry.slug}.json`), {
        slug: entry.slug,
        body: entry.body,
      });
    }
  }
  return { rootDirectory, outputDirectory, entries };
}

async function fileBytes(directory) {
  const files = {};
  async function visit(current, prefix = "") {
    let entries;
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch (error) {
      if (error.code === "ENOENT") return;
      throw error;
    }
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) await visit(file, relative);
      else files[relative] = (await fs.readFile(file)).toString("base64");
    }
  }
  await visit(directory);
  return files;
}

async function renderedContent(outputDirectory, kind, slug, components = {}) {
  const { compiledMdx } = await import(pathToFileURL(path.join(outputDirectory, "index.mjs")).href);
  const Content = compiledMdx[kind][slug];
  assert.equal(typeof Content, "function", `${kind}/${slug} has a statically importable component`);
  return renderToStaticMarkup(createElement(Content, { components }));
}

test("compilation is deterministic, leaves canonical JSON unchanged, and does no work on a second run", async (t) => {
  const firstFixture = await fixture(t);
  const canonicalDirectory = path.join(firstFixture.rootDirectory, "public/content");
  const canonicalBefore = await fileBytes(canonicalDirectory);
  const first = await compile(firstFixture);
  assert.equal(first.changed, true);
  assert.equal(first.entries.length, 2);
  for (const entry of first.entries) {
    const source = firstFixture.entries[entry.kind]?.find((item) => item.slug === entry.slug);
    assert.ok(source, "returned entries identify the canonical collection and slug");
    assert.equal(entry.bodySha256, hashBody(source.body));
    assert.equal(typeof entry.modulePath, "string");
    const moduleFile = path.isAbsolute(entry.modulePath)
      ? entry.modulePath
      : path.resolve(firstFixture.outputDirectory, entry.modulePath);
    assert.ok((await fs.stat(moduleFile)).isFile(), "returned module path exists");
  }
  const bytesAfterFirst = await fileBytes(firstFixture.outputDirectory);
  assert.ok(bytesAfterFirst["index.mjs"], "generated collection index exists");
  const second = await compile(firstFixture);
  assert.equal(second.changed, false);
  assert.deepEqual(second.entries, first.entries);
  assert.deepEqual(await fileBytes(firstFixture.outputDirectory), bytesAfterFirst);
  assert.deepEqual(await fileBytes(canonicalDirectory), canonicalBefore);

  const independentFixture = await fixture(t);
  await compile(independentFixture);
  assert.deepEqual(await fileBytes(independentFixture.outputDirectory), bytesAfterFirst);
});

test("removing a manifest entry removes its generated module and preserves declarations", async (t) => {
  const options = await fixture(t, {
    projects: [
      { slug: "keep", body: "# Keep this project" },
      { slug: "remove", body: "# Remove this project" },
    ],
  });
  await fs.mkdir(options.outputDirectory, { recursive: true });
  const declarations = "export declare const compiledMdx: object;\n";
  await fs.writeFile(path.join(options.outputDirectory, "index.d.mts"), declarations);
  const first = await compile(options);
  const removed = first.entries.find((entry) => entry.kind === "projects" && entry.slug === "remove");
  assert.ok(removed);
  const removedModule = path.isAbsolute(removed.modulePath)
    ? removed.modulePath
    : path.resolve(options.outputDirectory, removed.modulePath);
  await writeJson(path.join(options.rootDirectory, "public/content/projects/index.json"), { items: ["keep.json"] });
  const second = await compile(options);
  assert.equal(second.changed, true);
  assert.equal(second.entries.some((entry) => entry.slug === "remove"), false);
  await assert.rejects(fs.stat(removedModule), { code: "ENOENT" });
  assert.equal(await fs.readFile(path.join(options.outputDirectory, "index.d.mts"), "utf8"), declarations);
  const { compiledMdx } = await import(pathToFileURL(path.join(options.outputDirectory, "index.mjs")).href);
  assert.deepEqual(Object.keys(compiledMdx.projects), ["keep"]);
  assert.match(await renderedContent(options.outputDirectory, "projects", "keep"), /Keep this project/);
  assert.equal((await compile(options)).changed, false);
});

test("GFM tables, strikethrough, and task lists are enabled only for research", async (t) => {
  const body = [
    "| Component | Result |",
    "| --- | --- |",
    "| Runtime | Works |",
    "",
    "~~old claim~~",
    "",
    "- [x] Checked",
  ].join("\n");
  const options = await fixture(t, {
    projects: [{ slug: "same-body", body }],
    research: [{ slug: "same-body", body }],
  });
  await compile(options);
  const project = await renderedContent(options.outputDirectory, "projects", "same-body");
  const research = await renderedContent(options.outputDirectory, "research", "same-body");
  assert.doesNotMatch(project, /<table|<del>|type="checkbox"/);
  assert.match(project, /\| Component \| Result \|/);
  assert.match(research, /<table>/);
  assert.match(research, /<th>Component<\/th>/);
  assert.match(research, /<td>Works<\/td>/);
  assert.match(research, /<del>old claim<\/del>/);
  assert.match(research, /type="checkbox"/);
  assert.match(research, /checked=""/);
});

test("statically imported components render custom mappings, literal HTML, SVG, images, and fenced code through React SSR", async (t) => {
  const body = [
    "## Portability",
    "",
    "[Read the docs](https://example.com/docs)",
    "",
    "| Layer | Status |",
    "| --- | --- |",
    "| Worker | Ready |",
    "",
    '<div className="literal-panel"><strong>Literal HTML</strong></div>',
    "",
    '<svg viewBox="0 0 20 20" aria-label="Literal SVG"><path d="M1 1L19 19" stroke="currentColor" /></svg>',
    "",
    "![Diagram](/images/diagram.png)",
    "",
    "```js",
    'const example = { value: "<literal>" };',
    "```",
  ].join("\n");
  const options = await fixture(t, { research: [{ slug: "render", body }] });
  await compile(options);
  const components = {
    a: ({ children, href, ...props }) => createElement("a", { ...props, href, rel: "noreferrer", target: "_blank" }, children),
    table: ({ children, ...props }) => createElement("div", { className: "mdx-table-wrap" }, createElement("table", props, children)),
    h2: ({ children, ...props }) => createElement("h2", { ...props, "data-mapping": "heading" }, children),
  };
  const html = await renderedContent(options.outputDirectory, "research", "render", components);
  assert.match(html, /<h2 data-mapping="heading">Portability<\/h2>/);
  assert.match(html, /<a href="https:\/\/example.com\/docs" rel="noreferrer" target="_blank">Read the docs<\/a>/);
  assert.match(html, /<div class="mdx-table-wrap"><table>/);
  assert.match(html, /<td>Ready<\/td>/);
  assert.match(html, /<div class="literal-panel"><strong>Literal HTML<\/strong><\/div>/);
  assert.match(html, /<svg viewBox="0 0 20 20" aria-label="Literal SVG">/);
  assert.match(html, /<path d="M1 1L19 19" stroke="currentColor"><\/path>/);
  assert.match(html, /<img src="\/images\/diagram.png" alt="Diagram"\/>/);
  assert.match(html, /<pre><code class="language-js">/);
  assert.match(html, /const example = \{ value: &quot;&lt;literal&gt;&quot; \};/);
});

test("generated components render when JavaScript string code generation is disabled", async (t) => {
  const options = await fixture(t);
  const { entries } = await compile(options);
  const entry = entries.find((item) => item.kind === "projects" && item.slug === "alpha");
  assert.ok(entry, "compiler returns the generated project component");
  const componentFile = path.isAbsolute(entry.modulePath)
    ? entry.modulePath
    : path.resolve(options.outputDirectory, entry.modulePath);
  const script = [
    'import assert from "node:assert/strict";',
    'import { readFile } from "node:fs/promises";',
    'import vm from "node:vm";',
    'import { createElement } from "react";',
    'import { renderToStaticMarkup } from "react-dom/server";',
    'import jsxRuntime from "react/jsx-runtime";',
    "const context = vm.createContext({}, { codeGeneration: { strings: false, wasm: false } });",
    "assert.throws(() => vm.runInContext('new Function(\"return 1\")', context), /Code generation from strings disallowed/);",
    "const runtime = new vm.SyntheticModule(Object.keys(jsxRuntime), function () {",
    "  for (const [name, value] of Object.entries(jsxRuntime)) this.setExport(name, value);",
    "}, { context });",
    `const component = new vm.SourceTextModule(await readFile(${JSON.stringify(componentFile)}, "utf8"), { context });`,
    "await component.link((specifier) => {",
    '  assert.equal(specifier, "react/jsx-runtime");',
    "  return runtime;",
    "});",
    "await component.evaluate();",
    "process.stdout.write(renderToStaticMarkup(createElement(component.namespace.default)));",
  ].join("\n");
  const { stdout } = await exec(process.execPath, ["--experimental-vm-modules", "--input-type=module", "--eval", script], {
    cwd: repositoryDirectory,
    env: { NODE_ENV: "test" },
    timeout: 5_000,
  });
  assert.match(stdout, /<h2>Project<\/h2>/);
  assert.match(stdout, /The project body\./);
});

test("malformed MDX rejects atomically before replacing an existing successful output", async (t) => {
  const options = await fixture(t);
  await compile(options);
  const outputBefore = await fileBytes(options.outputDirectory);
  await writeJson(path.join(options.rootDirectory, "public/content/projects/alpha.json"), {
    slug: "alpha",
    body: "# A valid changed project",
  });
  await writeJson(path.join(options.rootDirectory, "public/content/research/beta.json"), {
    slug: "beta",
    body: "<div>Unclosed MDX",
  });
  const canonicalBefore = await fileBytes(path.join(options.rootDirectory, "public/content"));
  await assert.rejects(compile(options));
  assert.deepEqual(await fileBytes(options.outputDirectory), outputBefore);
  assert.deepEqual(await fileBytes(path.join(options.rootDirectory, "public/content")), canonicalBefore);
});

test("development watching regenerates modules when canonical JSON bodies change", { timeout: 10_000 }, async (t) => {
  const options = await fixture(t);
  await compile(options);
  const { watchContentMdx } = await import(compilerUrl.href);
  assert.equal(typeof watchContentMdx, "function");
  const watcher = await watchContentMdx(options);
  assert.equal(typeof watcher.close, "function");
  try {
    const outputBefore = await fileBytes(options.outputDirectory);
    await writeJson(path.join(options.rootDirectory, "public/content/projects/alpha.json"), {
      slug: "alpha",
      body: "## Updated while developing\n\nThe edited canonical body.",
    });
    const deadline = Date.now() + 5_000;
    let changed = false;
    while (Date.now() < deadline) {
      if (JSON.stringify(await fileBytes(options.outputDirectory)) !== JSON.stringify(outputBefore)) {
        changed = true;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
    assert.equal(changed, true, "watching updates generated output within five seconds");
    assert.match(await renderedContent(options.outputDirectory, "projects", "alpha"), /Updated while developing/);
    assert.equal((await compile(options)).changed, false);
  } finally {
    await watcher.close();
  }
});

for (const [name, body] of [
  ["JavaScript expressions", "# Heading\n\n{1 + 2}"],
  ["imports", "import Widget from './widget.mjs'\n\n# Heading"],
  ["exports", "export const value = 1\n\n# Heading"],
  ["spread attributes", "<div {...props} />"],
  ["expression attributes", "<div title={value} />"],
]) {
  test(`authored ${name} reject without changing previously generated files`, async (t) => {
    const options = await fixture(t);
    await compile(options);
    const outputBefore = await fileBytes(options.outputDirectory);
    await writeJson(path.join(options.rootDirectory, "public/content/projects/alpha.json"), { slug: "alpha", body });
    await assert.rejects(compile(options), /Authored JavaScript/);
    assert.deepEqual(await fileBytes(options.outputDirectory), outputBefore);
  });
}

test("duplicate slugs reject before any generated output is written", async (t) => {
  const options = await fixture(t, {
    projects: [
      { file: "first.json", slug: "duplicate", body: "# First" },
      { file: "second.json", slug: "duplicate", body: "# Second" },
    ],
  });
  await assert.rejects(compile(options), /duplicate/i);
  assert.deepEqual(await fileBytes(options.outputDirectory), {});
});

test("repeated manifest files reject before any generated output is written", async (t) => {
  const options = await fixture(t);
  await writeJson(path.join(options.rootDirectory, "public/content/projects/index.json"), { items: ["alpha.json", "alpha.json"] });
  await assert.rejects(compile(options), /duplicate|repeated/i);
  assert.deepEqual(await fileBytes(options.outputDirectory), {});
});

test("manifest paths cannot traverse outside their canonical collection", async (t) => {
  const options = await fixture(t);
  await writeJson(path.join(options.rootDirectory, "public/content/outside.json"), { slug: "outside", body: "# Outside" });
  await writeJson(path.join(options.rootDirectory, "public/content/projects/index.json"), { items: ["../outside.json"] });
  await assert.rejects(compile(options), /path|manifest|filename|traversal|invalid/i);
  assert.deepEqual(await fileBytes(options.outputDirectory), {});
});

for (const slug of ["../escape", "/absolute", "nested/path", "nested\\path"]) {
  test(`slug ${JSON.stringify(slug)} cannot escape generated output`, async (t) => {
    const options = await fixture(t);
    await writeJson(path.join(options.rootDirectory, "public/content/projects/alpha.json"), { slug, body: "# Unsafe slug" });
    await assert.rejects(compile(options), /slug|path|invalid/i);
    assert.deepEqual(await fileBytes(options.outputDirectory), {});
  });
}
