#!/usr/bin/env node

const DEFAULT_BASE_URL = "https://sebmer.com";
const baseUrl = (process.env.SEB_BUILDS_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
const contactUrl = "https://tally.so/r/3jeJVa";

const args = process.argv.slice(2);
const virtualTextFiles = {
  "./about/sebastian.md": "/content/about/sebastian.md",
  "./about/sebastian.json": "/about/sebastian.json",
  "./context/llms.txt": "/llms.txt",
  "./context/llms-full.txt": "/llms-full.txt",
};

async function main() {
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    printHelp();
    return;
  }

  const [command, target, flag] = args;

  if (command === "ls" && target === "./" && flag === "--all") {
    await listAll();
    return;
  }

  if (command === "ls" && target === "./projects" && flag === "--all") {
    await listProjects();
    return;
  }

  if (command === "cat" && target?.startsWith("./projects/") && target.endsWith(".md")) {
    await printProject(target);
    return;
  }

  if (command === "ls" && target === "./research" && flag === "--all") {
    const research = await getResearch();
    console.log("SEB BUILDS / research & essays\n");
    for (const entry of research) console.log(`${entry.title}  ${entry.href}`);
    return;
  }

  if (command === "cat" && target?.startsWith("./research/") && target.endsWith(".md")) {
    const slug = target.slice("./research/".length, -3);
    const entry = (await getResearch()).find((item) => item.slug === slug);
    if (!entry) throw new Error(`Research not found: ${slug}`);
    console.log(`# ${entry.title}\n\n${entry.description}\n`);
    if (entry.demoUrl) console.log(`Related post: ${entry.demoUrl}\n`);
    console.log(entry.body);
    return;
  }

  if (command === "tail" && target === "-f" && flag === "./build.log") {
    await printLogs();
    return;
  }

  if (command === "cat" && target && target in virtualTextFiles) {
    await printText(virtualTextFiles[target]);
    return;
  }

  if (command === "open" && target === "contact.txt") {
    console.log(contactUrl);
    return;
  }

  console.error(`Unknown command: ${args.join(" ")}`);
  console.error("");
  printHelp();
  process.exitCode = 1;
}

async function listAll() {
  const [projects, research, logs] = await Promise.all([getProjects(), getResearch(), getLogs()]);

  console.log("SEB BUILDS / virtual files");
  console.log("");
  console.log("./about/sebastian.md");
  console.log("./about/sebastian.json");
  console.log("./context/llms.txt");
  console.log("./context/llms-full.txt");
  console.log("./build.log");
  console.log("./contact.txt");
  console.log("./projects/");

  for (const project of projects) {
    console.log(`./projects/${project.slug}.md`);
  }

  console.log("./research/");
  for (const entry of research) console.log(`./research/${entry.slug}.md`);
  console.log("./content/research/index.json");
  for (const entry of research) console.log(`./content/research/${entry.slug}.json`);

  console.log("./content/about/sebastian.md");
  console.log("./content/projects/index.json");

  for (const project of projects) {
    console.log(`./content/projects/${project.slug}.json`);
  }

  console.log("./content/logs/index.json");

  for (const log of logs) {
    console.log(`./content/logs/${log.id}.json`);
  }
}

async function listProjects() {
  const projects = await getProjects();

  console.log("SEB BUILDS / projects");
  console.log("");

  for (const project of projects) {
    console.log(`${project.status.padEnd(8)} ${project.title}  ${project.href}`);
  }
}

async function printProject(target) {
  const slug = target.replace("./projects/", "").replace(/\.md$/, "");
  const projects = await getProjects();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    throw new Error(`Project not found: ${slug}`);
  }

  console.log(`# ${project.title}`);
  console.log("");
  console.log(project.description);
  console.log("");
  const projectLinks = getProjectLinks(project);

  for (const link of projectLinks) {
    console.log(`${link.label}: ${link.href}`);
  }

  if (projectLinks.length > 0) {
    console.log("");
  }

  console.log(project.body);
}

async function printLogs() {
  const logs = await getLogs();

  console.log("SEB BUILDS / build.log");
  console.log("");

  for (const log of logs) {
    console.log(`${log.date}  ${log.text}`);
    console.log(`  ${log.detail}`);

    if (log.imageUrl) {
      console.log(`  image: ${baseUrl}${log.imageUrl}`);
    }
  }
}

async function printText(pathname) {
  const text = await fetchText(pathname);

  console.log(text.trimEnd());
}

function printHelp() {
  console.log("SEB BUILDS");
  console.log("products in public.");
  console.log("");
  console.log("Usage:");
  console.log("  npx github:sebmer-com/sebbuilds ls ./ --all");
  console.log("  npx github:sebmer-com/sebbuilds ls ./projects --all");
  console.log("  npx github:sebmer-com/sebbuilds ls ./research --all");
  console.log("  npx github:sebmer-com/sebbuilds cat ./research/the-headless-product.md");
  console.log("  npx github:sebmer-com/sebbuilds cat ./projects/elson-ai.md");
  console.log("  npx github:sebmer-com/sebbuilds tail -f ./build.log");
  console.log("  npx github:sebmer-com/sebbuilds cat ./about/sebastian.md");
  console.log("  npx github:sebmer-com/sebbuilds cat ./about/sebastian.json");
  console.log("  npx github:sebmer-com/sebbuilds cat ./context/llms.txt");
  console.log("  npx github:sebmer-com/sebbuilds cat ./context/llms-full.txt");
  console.log("  npx github:sebmer-com/sebbuilds open contact.txt");
}

async function getProjects() {
  const manifest = await fetchJson("/content/projects/index.json");
  const files = normalizeManifest(manifest, "projects");
  const projects = await Promise.all(
    files.map((file) => fetchJson(`/content/projects/${file}`)),
  );

  return projects.map((project) => ({
    ...project,
    href: `/projects/${project.slug}`,
  }));
}

async function getResearch() {
  const manifest = await fetchJson("/content/research/index.json");
  const files = normalizeManifest(manifest, "research");
  const entries = await Promise.all(files.map((file) => fetchJson(`/content/research/${file}`)));
  return entries.map((entry) => ({ ...entry, href: `/research/${entry.slug}` }));
}

async function getLogs() {
  const manifest = await fetchJson("/content/logs/index.json");
  const files = normalizeManifest(manifest, "logs");

  return Promise.all(files.map((file) => fetchJson(`/content/logs/${file}`)));
}

function normalizeManifest(manifest, label) {
  if (!manifest || !Array.isArray(manifest.items)) {
    throw new Error(`Invalid ${label} manifest: expected items array`);
  }

  return manifest.items.map((item) => (item.endsWith(".json") ? item : `${item}.json`));
}

function getProjectLinks(project) {
  return [
    { label: "Demo", href: project.demoUrl },
    { label: "Repo", href: project.repoUrl },
    { label: "Video", href: project.videoUrl },
  ].filter((link) => Boolean(link.href));
}

async function fetchJson(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${pathname}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function fetchText(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${pathname}: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
