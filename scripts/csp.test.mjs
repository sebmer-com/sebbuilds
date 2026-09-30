import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));

async function moduleFromTsx(t, source) {
  await fs.mkdir(path.join(root, ".next"), { recursive: true });
  const directory = await fs.mkdtemp(path.join(root, ".next", "csp-tests-"));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const file = path.join(directory, "component.mjs");
  await fs.writeFile(file, ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
  }).outputText);
  return import(pathToFileURL(file).href);
}

test("site images retain their presentation and loading without inline styles", async (t) => {
  const cases = [
    { file: "src/components/publication-shell.tsx", className: "masthead__portrait", width: 32, height: 32, loading: "lazy", src: "/images/sebastian-mertens.png", alt: "Sebastian Mertens" },
    { file: "src/app/about/page.tsx", className: "about-portrait", width: 800, height: 800, loading: "eager", src: "/images/sebastian-mertens.png", alt: "Sebastian Mertens", priority: "high" },
    { file: "src/app/logs/page.tsx", className: "log-entry__image", width: 1400, height: 820, loading: "lazy", src: "/content/logs/example.svg", alt: "Example build visual" },
  ];
  for (const item of cases) {
    const source = await fs.readFile(path.join(root, item.file), "utf8");
    const ast = ts.createSourceFile(item.file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    let image;
    function visit(node) {
      if (ts.isJsxSelfClosingElement(node) && ["img", "Image"].includes(node.tagName.getText(ast))) image = node;
      ts.forEachChild(node, visit);
    }
    visit(ast);
    assert.ok(image, `image exists in ${item.file}`);
    assert.equal(image.tagName.getText(ast), "img", `${item.file} uses a CSP-compatible native image`);
    const { ImageProbe } = await moduleFromTsx(t, `export function ImageProbe({item}) {return (${image.getText(ast)});}`);
    const html = renderToStaticMarkup(createElement(ImageProbe, { item: { imageUrl: item.src, imageAlt: item.alt } }));
    const tag = html.match(/<img\b[^>]*>/)?.[0];
    assert.ok(tag);
    for (const [name, value] of Object.entries({ class: item.className, width: item.width, height: item.height, loading: item.loading, src: item.src, alt: item.alt, decoding: "async" })) {
      assert.ok(tag.includes(`${name}="${value}"`), `${item.file} keeps ${name}`);
    }
    if (item.priority) assert.ok(tag.includes(`fetchPriority="${item.priority}"`));
    assert.doesNotMatch(tag, /\sstyle=/);
    assert.doesNotMatch(source, /from\s+["']next\/image["']/);
  }
});

test("theme nonce is available before rendering next-themes, without waiting for an effect", async (t) => {
  const source = await fs.readFile(path.join(root, "src/components/theme-provider.tsx"), "utf8");
  const { ThemeProvider } = await moduleFromTsx(t, source);
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  t.after(() => {
    if (originalDocument) Object.defineProperty(globalThis, "document", originalDocument);
    else delete globalThis.document;
  });
  let reads = 0;
  globalThis.document = { head: { querySelector(selector) {
    assert.equal(selector, 'meta[property="csp-nonce"]');
    reads += 1;
    return { content: "trusted-response-nonce" };
  } } };
  const html = renderToStaticMarkup(createElement(ThemeProvider, { disableTransitionOnChange: true }, "content"));
  assert.equal(reads, 1);
  assert.match(html, /<script[^>]* nonce="trusted-response-nonce"/);
  assert.match(html, /content/);
  delete globalThis.document;
  assert.doesNotThrow(() => renderToStaticMarkup(createElement(ThemeProvider, {}, "server content")));
});
