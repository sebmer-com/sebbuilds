import { spawn } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { socialFormats } from "../src/lib/brand.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const assets = join(root, "public/brand/assets");
const chrome = process.env.CHROME_BIN ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const temporary = mkdtempSync(join(tmpdir(), "seb-builds-brand-"));
const fonts = [
  ["LM-regular.woff2", "normal", 400],
  ["LM-italic.woff2", "italic", 400],
  ["LM-bold.woff2", "normal", 700],
];
const fontCss = fonts.map(([file, style, weight]) =>
  `@font-face{font-family:"Latin Modern";font-style:${style};font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${readFileSync(join(root, "node_modules/latex.css/fonts", file)).toString("base64")})}`,
).join("");

let browser;
let client;

async function startRenderer() {
  const profile = join(temporary, "chrome-profile");
  browser = spawn(chrome, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
    "--disable-background-networking", "--remote-debugging-port=0",
    `--user-data-dir=${profile}`, "about:blank",
  ], { stdio: "ignore" });
  let port;
  for (let attempt = 0; attempt < 200; attempt++) {
    try { port = readFileSync(join(profile, "DevToolsActivePort"), "utf8").split("\n")[0]; } catch { /* Chrome is starting. */ }
    if (port) break;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  if (!port || !/^\d+$/u.test(port)) throw new Error("The temporary renderer did not start");
  const target = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" }).then((response) => response.json());
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
  let sequence = 0;
  const pending = new Map();
  const events = new Map();
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.id && pending.has(message.id)) {
      const request = pending.get(message.id); pending.delete(message.id); clearTimeout(request.timer);
      if (message.error) request.reject(new Error(message.error.message)); else request.resolve(message.result);
    } else if (message.method && events.has(message.method)) {
      const event = events.get(message.method); events.delete(message.method); clearTimeout(event.timer); event.resolve(message.params);
    }
  });
  socket.addEventListener("close", () => {
    for (const request of pending.values()) { clearTimeout(request.timer); request.reject(new Error("Renderer closed")); }
    pending.clear();
  });
  client = {
    call(method, params = {}) {
      const id = ++sequence;
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Renderer timeout: ${method}`)); }, 20_000);
        pending.set(id, { resolve, reject, timer }); socket.send(JSON.stringify({ id, method, params }));
      });
    },
    event(method) {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => { events.delete(method); reject(new Error(`Renderer event timeout: ${method}`)); }, 20_000);
        events.set(method, { resolve, timer });
      });
    },
    close() { socket.close(); },
  };
  await client.call("Page.enable");
}

function card({ width, height, theme, square = false }) {
  const paper = theme === "dark" ? "#111111" : "#ffffff";
  const ink = theme === "dark" ? "#f2f2f2" : "#111111";
  const soft = theme === "dark" ? "#cccccc" : "#3f3f3f";
  const muted = theme === "dark" ? "#9c9c9c" : "#686868";
  const hairline = theme === "dark" ? "#414141" : "#d6d6d6";
  const canvasHeight = height * 1200 / width;
  const short = canvasHeight < 460;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Seb Builds — products in public.</title><style>${fontCss}
    *{box-sizing:border-box;margin:0}html,body{width:${width}px;height:${height}px;overflow:hidden;background:${paper}}
    .card{position:relative;width:1200px;height:${canvasHeight}px;transform:scale(${width / 1200});transform-origin:top left;background:${paper};color:${ink};font-family:"Latin Modern",Georgia,serif}
    .masthead{position:absolute;top:${short ? 28 : 40}px;left:72px;right:72px;display:flex;align-items:baseline;justify-content:space-between;border-bottom:1px solid ${hairline};padding-bottom:18px;font-size:26px}
    .wordmark{font-weight:700;letter-spacing:-.02em}.tagline{font-size:25px;font-style:italic;color:${soft}}
    .chapter{position:absolute;top:${short ? 98 : 114}px;left:72px;right:72px;padding-bottom:17px;border-bottom:2px solid ${ink};display:flex;justify-content:space-between;font:12px Arial,Helvetica,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:${muted}}
    .hero{position:absolute;left:72px;top:${square ? 222 : short ? 149 : 206}px;width:${square ? 1056 : short ? 670 : 580}px}
    h1{font-size:${square ? 196 : short ? 101 : 150}px;font-weight:400;line-height:${short ? 1 : .86};letter-spacing:-.05em}.claim{margin-top:${square ? 34 : 26}px;font-size:${square ? 49 : short ? 32 : 39}px;line-height:1.1;font-style:italic;color:${soft}}
    .context{position:absolute;left:${square ? 72 : short ? 800 : 748}px;right:72px;top:${square ? 795 : short ? 151 : 236}px;border-top:2px solid ${ink};padding-top:20px}
    .label{font:12px Arial,Helvetica,sans-serif;letter-spacing:.09em;text-transform:uppercase}.context p{font-size:${square ? 34 : short ? 23 : 28}px;line-height:1.42;color:${soft};margin-top:25px}.author{margin-top:26px;font-size:${square ? 30 : short ? 21 : 23}px;color:${ink}}
    .footer{position:absolute;left:72px;right:72px;bottom:28px;border-top:1px solid ${hairline};padding-top:19px;display:flex;justify-content:space-between;font:12px Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:${muted}}
    </style></head><body><main class="card"><header class="masthead"><span class="wordmark">Seb Builds</span><span class="tagline">products in public.</span></header>
    <div class="chapter"><span>A public builder journal</span><span>Sebastian Mertens</span></div>
    <section class="hero"><h1>${short ? "Seb Builds" : "Seb<br>Builds"}</h1><p class="claim">products in public.</p></section>
    <section class="context"><div class="label">${short ? "The work" : "Products / Research / Build logs"}</div><p>${short ? "Projects, research<br>and build logs." : "Useful products,<br>research and lessons<br>from building in public."}</p><div class="author">Sebastian Mertens</div></section>
    <footer class="footer"><span>Products. Research. Work in public.</span><span>sebmer.com</span></footer></main></body></html>`;
}

async function render(html, name, width, height) {
  const input = join(temporary, `${name}.html`);
  const output = join(assets, `${name}.png`);
  writeFileSync(input, html);
  await client.call("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
  const loaded = client.event("Page.loadEventFired");
  await client.call("Page.navigate", { url: pathToFileURL(input).href });
  await loaded;
  await client.call("Runtime.evaluate", { expression: "document.fonts.ready", awaitPromise: true });
  const screenshot = await client.call("Page.captureScreenshot", { format: "png", captureBeyondViewport: false, clip: { x: 0, y: 0, width, height, scale: 1 } });
  writeFileSync(output, Buffer.from(screenshot.data, "base64"));
  const png = readFileSync(output);
  if (png.readUInt32BE(16) !== width || png.readUInt32BE(20) !== height) {
    throw new Error(`Unexpected rendered dimensions: ${name}`);
  }
  console.log(`${name}: ${width} × ${height}, ${png.length} bytes`);
}

function presentation() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Seb Builds — editorial presentation template</title><style>${fontCss}
    :root{--paper:#111111;--ink:#f2f2f2;--soft:#cccccc;--muted:#9c9c9c;--hairline:#414141}*{box-sizing:border-box;margin:0}body{background:var(--paper);color:var(--ink);font-family:"Latin Modern",Georgia,serif}.deck{display:grid;gap:40px;justify-content:center;padding:40px}.slide{position:relative;width:1600px;height:900px;background:var(--paper);overflow:hidden}
    .masthead{position:absolute;top:44px;left:112px;right:112px;display:flex;justify-content:space-between;border-bottom:1px solid var(--hairline);padding-bottom:18px;font-size:25px}.brand{font-weight:700;letter-spacing:-.02em}.tagline{font-size:21px;font-style:italic;color:var(--soft)}
    .chapter{position:absolute;top:108px;left:112px;right:112px;border-bottom:2px solid var(--ink);padding-bottom:20px;display:flex;justify-content:space-between;font:14px Arial,Helvetica,sans-serif;letter-spacing:.09em;text-transform:uppercase;color:var(--muted)}
    h1{font-size:80px;line-height:.98;letter-spacing:-.055em;font-weight:400}h2{font-size:52px;line-height:1.05;letter-spacing:-.035em;font-weight:400}.heading{position:absolute;top:212px;left:112px;right:112px}.cover .heading{top:376px;max-width:740px}.abstract{position:absolute;top:330px;left:1012px;right:112px;border-top:2px solid var(--ink);padding-top:22px;font-size:28px;line-height:1.5;color:var(--soft)}.label{font:14px Arial,Helvetica,sans-serif;letter-spacing:.09em;text-transform:uppercase;color:var(--ink);margin-bottom:24px}
    .columns{position:absolute;top:334px;left:112px;right:112px;display:grid;grid-template-columns:600px 600px;gap:176px}.column{border-top:2px solid var(--ink);padding-top:22px;font-size:28px;line-height:1.5;color:var(--soft)}h3{font-size:32px;font-weight:400;margin-bottom:24px;color:var(--ink)}.column p+p,.abstract p+p{margin-top:24px}
    .bottom{position:absolute;top:782px;left:112px;right:112px;border-top:1px solid var(--hairline);padding-top:22px;color:var(--soft);font-size:25px;font-style:italic}.footer{position:absolute;top:862px;left:112px;right:112px;display:flex;justify-content:space-between;color:var(--muted);font:12px Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase}
    @page{size:1600px 900px;margin:0}@media print{.deck{display:block;padding:0}.slide{break-after:page;break-inside:avoid}.slide:last-child{break-after:auto}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
    </style></head><body><main class="deck">
    <section class="slide cover"><header class="masthead"><span class="brand">Seb Builds</span><span class="tagline">products in public.</span></header><div class="chapter"><span>01 / [Topic]</span><span>[Audience]</span></div><div class="heading"><h1>[Your headline.]<br>[One clear point.]</h1></div><div class="abstract"><p class="label">Context</p><p>[Explain what you are building, who it is for, and why it matters.]</p><p>[Use your own verified facts and examples.]</p></div><p class="bottom">[A short takeaway in one sentence.]</p><footer class="footer"><span>sebmer.com</span><span>01 / 03</span></footer></section>
    <section class="slide"><header class="masthead"><span class="brand">Seb Builds</span><span class="tagline">products in public.</span></header><div class="chapter"><span>02 / [Section]</span><span>[Topic]</span></div><div class="heading"><h2>[One clear point.]</h2></div><div class="columns"><div class="column"><p class="label">[First perspective]</p><h3>[What happens today.]</h3><p>[Describe the current situation with a concrete example.]</p><p>[Add only facts you can support.]</p></div><div class="column"><p class="label">[Second perspective]</p><h3>[What changes.]</h3><p>[Describe the next step and its practical result.]</p><p>[Keep this readable from the back of the room.]</p></div></div><p class="bottom">[The takeaway that connects both columns.]</p><footer class="footer"><span>sebmer.com</span><span>02 / 03</span></footer></section>
    <section class="slide cover"><header class="masthead"><span class="brand">Seb Builds</span><span class="tagline">products in public.</span></header><div class="chapter"><span>03 / Next step</span><span>[Topic]</span></div><div class="heading"><h1>[Build.]<br>[Learn. Share.]</h1></div><div class="abstract"><p class="label">Continue the work</p><p>[Name the next action and who it is for.]</p><p>sebmer.com</p></div><p class="bottom">[End with one useful next step.]</p><footer class="footer"><span>products in public.</span><span>03 / 03</span></footer></section>
    </main></body></html>`;
}

mkdirSync(assets, { recursive: true });
try {
  await startRenderer();
  for (const format of socialFormats) {
    for (const theme of ["dark", "light"]) {
      const name = `${format.file}-${theme}${format.file === "open-graph" && theme === "dark" ? "-v1" : ""}`;
      await render(card({ ...format, theme, square: format.file === "square" }), name, format.width, format.height);
    }
  }
  copyFileSync(join(assets, "open-graph-dark-v1.png"), join(root, "public/og-image.png"));
  for (const [theme, ink, soft] of [["dark", "#111111", "#3f3f3f"], ["light", "#f2f2f2", "#cccccc"]]) {
    writeFileSync(join(assets, `seb-builds-wordmark-${theme}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 136" role="img" aria-labelledby="title"><title id="title">Seb Builds — products in public.</title><defs><style>${fontCss}</style></defs><text x="12" y="68" font-family="Latin Modern,Georgia,serif" font-size="64" font-weight="700" letter-spacing="-1.2" fill="${ink}">Seb Builds</text><text x="14" y="112" font-family="Latin Modern,Georgia,serif" font-size="28" font-style="italic" fill="${soft}">products in public.</text></svg>\n`);
  }
  writeFileSync(join(assets, "seb-builds-presentation-template.html"), presentation());
  // The committed FONT-LICENSE.txt retains the fonts' GUST licence and distributor credits.
  writeFileSync(join(dirname(assets), "brand.json"), JSON.stringify({
    name: "Seb Builds", tagline: "products in public.", website: "https://sebmer.com",
    colours: { ink: "#111111", paper: "#FFFFFF", textOnInk: "#F2F2F2", softOnInk: "#CCCCCC", mutedOnInk: "#9C9C9C", ruleOnInk: "#414141" },
    typography: { editorial: "Latin Modern", fallback: "Georgia", utility: "Arial", titleWeight: 400 },
    presentation: { width: 1600, height: 900, margin: 112, file: "assets/seb-builds-presentation-template.html" },
    social: socialFormats, defaultSocialImage: "assets/open-graph-dark-v1.png",
    usage: ["Keep the wordmark proportions.", "Use large regular serif titles and italic claims.", "Use thin rules and uppercase utility labels.", "Do not invent results or figures."],
  }, null, 2) + "\n");
} finally {
  if (client) { await client.call("Browser.close").catch(() => {}); client.close(); }
  if (browser?.exitCode === null) browser.kill("SIGTERM");
  rmSync(temporary, { recursive: true, force: true });
}
