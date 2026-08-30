# Seb Editorial Design System

A reusable, monochrome publication system derived from the current Seb Builds design. It is intended for websites, HTML slide decks, PowerPoint generation, A4 reports, PDFs, diagrams, and agent-generated artifacts.

The system is not a collection of decorative components. It defines a shared visual grammar: serif ideas, sans-serif metadata, indexed sections, strong rules, quiet hairlines, neutral surfaces, and purposeful whitespace.

## Source of truth

- `../DESIGN.md`: canonical human-readable and agent-readable specification using Google's DESIGN.md format.
- `tokens.dtcg.json`: W3C Design Tokens Community Group export.
- `tailwind.theme.css`: generated Tailwind v4 `@theme` export.
- `tailwind.theme.json`: generated Tailwind v3-compatible theme export.
- `seb-editorial.css`: portable CSS implementation for web, slides, and print.
- `adapters/pptx-theme.mjs`: PowerPoint/PptxGenJS-safe colors, fonts, sizes, and layout coordinates.
- `templates/web.html`: responsive web starter and component specimen.
- `templates/slides.html`: 16:9 editorial slide master examples.
- `templates/document.html`: A4 report and PDF starter.
- `templates/document-flow.html`: continuous A4 report for automatically paginated long prose.
- `templates/artifact-chain.excalidraw`: editable source for the process diagram pattern.

Do not edit generated token exports by hand. Edit `../DESIGN.md`, lint it, then regenerate the exports.

## Quick start

### Agents and coding tools

Point an agent at `DESIGN.md` before asking it to create a page, deck, report, or visual artifact. The YAML front matter is normative. The Markdown body explains how and why to use the values.

```text
Read DESIGN.md and follow the Seb Editorial System. Use the appropriate web,
slide, or report layout. Preserve the monochrome palette and indexed editorial
structure. Do not introduce generic card grids, gradients, or accent colors.
```

### Web

Copy or import `seb-editorial.css`, then put `se-root` on the body and use the `se-` component classes.

```html
<link rel="stylesheet" href="./design-system/seb-editorial.css" />
<body class="se-root">
  <main class="se-publication">...</main>
</body>
```

Use `data-se-theme="dark"` on a wrapper for the dark semantic mapping. Print always defaults to light paper.

### HTML slides

Start with `templates/slides.html`. Each `.se-slide` is exactly `1600 × 900px` and prints as a 16:9 page. Keep repeated title, index, source, result, and folio positions unchanged within one slide class.

The HTML type sizes deliberately look larger in source than their PowerPoint point-size equivalents. Chrome scales the 1600px source canvas into a 13.333in print page. Use the CSS values as provided to preserve the documented 17pt body minimum after export.

To produce a PDF in Chrome:

```bash
open design-system/templates/slides.html
```

Then print with:

- Layout: Landscape
- Margins: None
- Scale: 100%
- Background graphics: On

For automated Chromium export:

```bash
chromium --headless --disable-gpu \
  --print-to-pdf=slides.pdf \
  --no-pdf-header-footer \
  "file://$PWD/design-system/templates/slides.html"
```

### PowerPoint

Import `adapters/pptx-theme.mjs` into a PptxGenJS generator. The adapter intentionally uses Office-safe Cambria, Arial, and Courier New so editable decks remain predictable.

```js
import pptxgen from "pptxgenjs";
import { configurePresentation, palette, type, masters } from "./design-system/adapters/pptx-theme.mjs";

const deck = new pptxgen();
configurePresentation(deck);
const slide = deck.addSlide();
slide.background = { color: palette.paper };
slide.addText("Editorial title", {
  ...masters.content.title,
  fontFace: type.serif,
  fontSize: type.slideTitle,
  color: palette.ink,
  margin: 0,
});
```

The repository does not add PptxGenJS as a site dependency. The adapter is a dependency-free token and layout module for whichever deck project consumes it.

### A4 reports and PDFs

Start with `templates/document.html`. Each `.se-document-page` is an A4 page with fixed editorial margins, running metadata, and print-safe page breaks.

For browser printing:

- Paper: A4
- Scale: 100%
- Margins: None
- Background graphics: On
- Browser headers and footers: Off

Use page breaks only for covers, section openers, or major figures. Let normal prose flow continuously in production documents when possible.

The included `document.html` starter uses fixed `.se-document-page` wrappers for deliberately composed short reports. Start from `document-flow.html` for long prose; sections may then continue naturally and simulated running headers and folios are disabled. Use a dedicated paged-media engine when automatic running headers and page counters are required.

The generated DTCG and Tailwind files are exact Google DESIGN.md CLI exports. The current CLI omits typography line-height from those exports. Treat `DESIGN.md` and `seb-editorial.css` as normative for line height and fallback stacks.

## Core decisions

### Palette

The system is neutral black, white, and equal-channel grays. Color is not a default accent. If a data visualization genuinely requires color, document its semantic meaning in the artifact and keep the rest of the system neutral.

### Typography

- Web and controlled PDF: Latin Modern where available, then Georgia/Cambria/Times.
- Editable Office slides: Cambria.
- Interface, labels, navigation, captions: Arial.
- Code and identifiers: Menlo/Consolas/Courier New depending on format.

### Components

Use rows, rules, indexed sections, tables, figures, and result bands. Avoid generic rounded cards. A component should express hierarchy, relation, status, evidence, or action.

### Diagrams

Presentation diagrams should be created in Excalidraw. Keep the `.excalidraw` source next to its SVG or PNG export.

Recommended Excalidraw styling:

- Stroke: `#111111`, 1.5–2px.
- Primary fill: `#FFFFFF`.
- Secondary fill: `#F3F3F3`.
- Secondary text or relationships: `#686868`.
- Roughness: low to medium, consistent across the diagram.
- Arrowheads only where direction matters.
- No colored sticky-note palette.
- No default card grid when a chain, loop, boundary, or timeline communicates the relation better.

Use `templates/artifact-chain.excalidraw` as the editable source for the process pattern in the sample deck.

## Slide masters

The HTML slide starter demonstrates the following classes:

1. Cover
2. Editorial content
3. Process / artifact chain
4. Evidence / metrics
5. Conclusion

A production deck may add section and appendix masters, but repeated slide classes must retain identical title, index, content top, result band, source, and folio positions.

## Accessibility

- The formal DESIGN.md passes the Google DESIGN.md linter with zero errors and zero warnings.
- Core text and component pairings meet WCAG AA contrast.
- Web targets should be at least 44px; primary buttons are 48px high.
- Keyboard focus uses a visible two-pixel outline with three-pixel offset.
- Do not rely on gray value alone to communicate chart series or state.
- Slides use at least 17pt body copy.
- Use `se-figure--evidence-color` only when retained figure color carries explicit evidence or data meaning.
- Long reading text never uses the muted token.

## Updating the system

1. Edit `DESIGN.md`.
2. Validate it:

```bash
npx -y @google/design.md lint DESIGN.md
```

3. Regenerate exports:

```bash
npx -y @google/design.md export --format dtcg DESIGN.md
npx -y @google/design.md export --format css-tailwind DESIGN.md
npx -y @google/design.md export --format json-tailwind DESIGN.md
```

4. Update `seb-editorial.css` only when implementation behavior changes.
5. Render the web, slides, fixed-report, and continuous-report templates.
6. Check web overflow at 320px, slide clipping at 1600 × 900, and A4 page boundaries.
7. Check dark mode on screen and light mode in print.
8. Commit the spec, exports, implementation, and templates together.

## Design QA checklist

### Web

- No horizontal overflow at 320px.
- Headings wrap without clipping.
- Row metadata moves above content on narrow screens.
- Focus indicators remain visible.
- Light and dark semantic mappings preserve hierarchy.

### Slides

- Every slide remains exactly 16:9.
- No body text below 17pt.
- Repeated title and folio positions align.
- Main content reaches the lower composition instead of leaving accidental empty space.
- Result bands and sources do not collide.
- Editable Excalidraw sources exist for diagrams.

### PDF

- A4 pages render without browser headers or margins.
- No orphaned section title at a page bottom.
- Figures, tables, and callouts avoid page breaks.
- URLs and code wrap or scroll in source without forcing print overflow.
- Print is light paper regardless of screen theme.

## Anti-patterns

Do not add:

- gradients, glow, glass, or shadows;
- traffic-light or browser chrome;
- terminal simulation;
- warm beige or tinted gray neutrals;
- decorative accent stripes;
- equal-weight dashboard cards as a default layout;
- tiny slide sources or body text;
- flattened relationship diagrams without editable source;
- color with no semantic job.
