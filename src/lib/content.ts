import fs from "node:fs";
import path from "node:path";

const publicContentDirectory = path.join(process.cwd(), "public", "content");

export type ContentKind = "projects";

export type ProjectStatus = "shipped" | "building" | "idea";

export type BaseEntry = {
  kind: ContentKind;
  title: string;
  slug: string;
  description: string;
  date: string;
  tags: string[];
  body: string;
  content: string;
  readingTime: string;
  href: string;
};

export type ProjectEntry = BaseEntry & {
  kind: "projects";
  status: ProjectStatus;
  demoUrl?: string;
  repoUrl?: string;
  videoUrl?: string;
  featured: boolean;
};

export type ContentEntry = ProjectEntry;

export type LogEntry = {
  id: string;
  date: string;
  text: string;
  detail: string;
  imageUrl?: string;
  imageAlt?: string;
};

type Manifest = {
  items?: unknown;
};

type RawProject = {
  title?: unknown;
  slug?: unknown;
  description?: unknown;
  date?: unknown;
  tags?: unknown;
  status?: unknown;
  demoUrl?: unknown;
  repoUrl?: unknown;
  videoUrl?: unknown;
  featured?: unknown;
  body?: unknown;
};

type RawLog = {
  id?: unknown;
  date?: unknown;
  text?: unknown;
  detail?: unknown;
  imageUrl?: unknown;
  imageAlt?: unknown;
};

function readJson(filePath: string): unknown {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing JSON file: ${filePath}`);
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown JSON error";

    throw new Error(`Invalid JSON in ${filePath}: ${message}`);
  }
}

function readManifest(kind: "projects" | "logs") {
  const manifestPath = path.join(publicContentDirectory, kind, "index.json");
  const manifest = readJson(manifestPath) as Manifest;

  if (!Array.isArray(manifest.items)) {
    throw new Error(`Missing items array in ${manifestPath}`);
  }

  return manifest.items.map((item, index) => {
    if (typeof item !== "string" || item.trim() === "") {
      throw new Error(`Invalid manifest item ${index} in ${manifestPath}`);
    }

    return item.endsWith(".json") ? item : `${item}.json`;
  });
}

function requireString(value: unknown, field: string, filePath: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing ${field} in ${filePath}`);
  }

  return value;
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function readTags(value: unknown, filePath: string) {
  if (!Array.isArray(value)) {
    throw new Error(`Missing tags array in ${filePath}`);
  }

  return value.map((tag, index) => {
    if (typeof tag !== "string" || tag.trim() === "") {
      throw new Error(`Invalid tag ${index} in ${filePath}`);
    }

    return tag;
  });
}

function readProject(fileName: string): ProjectEntry {
  const filePath = path.join(publicContentDirectory, "projects", fileName);
  const raw = readJson(filePath) as RawProject;
  const status = requireString(raw.status, "status", filePath);
  const body = requireString(raw.body, "body", filePath);

  if (!isProjectStatus(status)) {
    throw new Error(`Invalid project status "${status}" in ${filePath}`);
  }

  const slug = requireString(raw.slug, "slug", filePath);

  return {
    kind: "projects",
    title: requireString(raw.title, "title", filePath),
    slug,
    description: requireString(raw.description, "description", filePath),
    date: requireString(raw.date, "date", filePath),
    tags: readTags(raw.tags, filePath),
    status,
    demoUrl: optionalString(raw.demoUrl),
    repoUrl: optionalString(raw.repoUrl),
    videoUrl: optionalString(raw.videoUrl),
    featured: raw.featured === true,
    body,
    content: body,
    readingTime: getReadingTime(body),
    href: `/projects/${slug}`,
  };
}

function readLog(fileName: string): LogEntry {
  const filePath = path.join(publicContentDirectory, "logs", fileName);
  const raw = readJson(filePath) as RawLog;

  return {
    id: requireString(raw.id, "id", filePath),
    date: requireString(raw.date, "date", filePath),
    text: requireString(raw.text, "text", filePath),
    detail: requireString(raw.detail, "detail", filePath),
    imageUrl: optionalString(raw.imageUrl),
    imageAlt: optionalString(raw.imageAlt),
  };
}

function isProjectStatus(status: string): status is ProjectStatus {
  return status === "shipped" || status === "building" || status === "idea";
}

function getReadingTime(content: string) {
  const words = content
    .replace(/`{1,3}[\s\S]*?`{1,3}/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));

  return `${minutes} min read`;
}

export function getProjects() {
  return readManifest("projects").map(readProject);
}

export function getFeaturedProjects() {
  return getProjects().filter((project) => project.featured);
}

export function getLogs() {
  return readManifest("logs").map(readLog);
}

export function getAllEntries() {
  return getProjects();
}

export function getEntryBySlug(kind: "projects", slug: string): ProjectEntry | undefined;
export function getEntryBySlug(kind: ContentKind, slug: string) {
  if (kind === "projects") {
    return getProjects().find((entry) => entry.slug === slug);
  }

  return undefined;
}

export function getAllTags(entries: ContentEntry[]) {
  return Array.from(new Set(entries.flatMap((entry) => entry.tags))).sort();
}
