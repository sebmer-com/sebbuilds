# Seb Builds

Seb Builds is Sebastian Mertens' public builder site at `https://sebmer.com`.

It contains public project pages, research and essays, short build logs, agent-readable context files, and a GitHub-sourced CLI for inspecting the same content from a terminal.

## Who Seb Is

Sebastian Mertens builds AI products, automation systems, and public software experiments. He is an AI product leader, speaker, and trainer based in the Netherlands.

The canonical editable bio lives in:

```bash
public/content/about/sebastian.md
```

That Markdown file is the source for the website about page, LLM context files, JSON output, and CLI output.

## Public Content

Content is public and folder-based:

- About Sebastian: `public/content/about/sebastian.md`
- Projects: `public/content/projects/index.json` plus one JSON file per project
- Research & Essays: `public/content/research/index.json` plus one JSON file per essay (no project status or featured fields)
- Logs: `public/content/logs/index.json` plus one JSON file per build log

Projects render as long-form Markdown pages at `/projects/[slug]`. Research and essays render at `/research/[slug]`, with an archive at `/research`. The two original essay URLs under `/projects/` remain static relocation pages with canonical links to their research URLs. Logs stay short and render on `/logs`.

### Build-log content rule

Build logs use a calendar date only (`YYYY-MM-DD`). Do not add a time field to log JSON, expose time data in public JSON/LLM endpoints, or render times in the UI. When several logs share one date, order them deliberately in `public/content/logs/index.json` without adding chronological metadata.

## Static Endpoints

Agents and scripts can read the public site without scraping UI pages:

```text
https://sebmer.com/content/about/sebastian.md
https://sebmer.com/about/sebastian.json
https://sebmer.com/llms.txt
https://sebmer.com/llms-full.txt
https://sebmer.com/content/projects/index.json
https://sebmer.com/content/research/index.json
https://sebmer.com/content/logs/index.json
```

`/about/sebastian.json` returns:

```json
{
  "markdown": "...",
  "sections": []
}
```

The sections are parsed from the Markdown headings, so agents can choose between raw Markdown and structured section data.

## GitHub-Sourced CLI

This is not an npm package. The clean command uses `npx` with GitHub as the source:

```bash
npx github:sebmer-com/sebbuilds ls ./ --all
npx github:sebmer-com/sebbuilds cat ./about/sebastian.md
npx github:sebmer-com/sebbuilds cat ./about/sebastian.json
npx github:sebmer-com/sebbuilds cat ./context/llms.txt
npx github:sebmer-com/sebbuilds cat ./context/llms-full.txt
npx github:sebmer-com/sebbuilds ls ./research --all
npx github:sebmer-com/sebbuilds cat ./research/the-headless-product.md
npx github:sebmer-com/sebbuilds ls ./projects --all
npx github:sebmer-com/sebbuilds cat ./projects/elson-ai.md
npx github:sebmer-com/sebbuilds tail -f ./build.log
npx github:sebmer-com/sebbuilds open contact.txt
```

For local testing, point the CLI at a running local site:

```bash
SEB_BUILDS_BASE_URL=http://127.0.0.1:3000 node packages/cli/bin/seb-builds.mjs ls ./ --all
```

## Development

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
GITHUB_ACTIONS=true npm run build
RESEARCH_EXPORT_TEST=1 npm test
```

Project and research JSON bodies are the editable source. The development server
and build compile them into static React modules; generated `.mjs` files are not
committed. Content edits refresh during development. Markdown, literal HTML/SVG
and the existing component mappings are supported; research also supports GFM
tables and lists. MDX JavaScript expressions, imports and exports fail compilation.
Pages render the compiled modules without evaluating source code at request time.

## Design System

The cross-format Seb Editorial System is documented in [`DESIGN.md`](./DESIGN.md).
Reusable implementation assets live in [`design-system/`](./design-system/README.md),
including DTCG and Tailwind token exports, portable CSS, a PowerPoint adapter, and
renderable starters for responsive web pages, 16:9 slides, and A4 PDFs.

The GitHub Pages workflow exports the site to `out/`. Content changes become live after pushing to `main` and that workflow deploys the artifact. Other hosts use the standard Next.js build from the same `npm run build` command.

## License

MIT © 2026 Sebastian Mertens
