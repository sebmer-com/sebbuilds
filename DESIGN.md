---
version: alpha
name: Seb Editorial System
description: A monochrome publication system for web interfaces, editorial slides, printable reports, and agent-generated artifacts.
colors:
  primary: "#111111"
  secondary: "#3F3F3F"
  tertiary: "#686868"
  neutral: "#FFFFFF"
  paper: "#FFFFFF"
  paper-subtle: "#F3F3F3"
  ink: "#111111"
  ink-soft: "#3F3F3F"
  ink-muted: "#686868"
  rule: "#171717"
  hairline: "#C8C8C8"
  focus: "#000000"
  dark-paper: "#111111"
  dark-paper-subtle: "#1A1A1A"
  dark-ink: "#F2F2F2"
  dark-ink-soft: "#CCCCCC"
  dark-ink-muted: "#9C9C9C"
  dark-rule: "#F2F2F2"
  dark-hairline: "#414141"
typography:
  display:
    fontFamily: Latin Modern
    fontSize: 6rem
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "-0.06em"
  h1:
    fontFamily: Latin Modern
    fontSize: 4rem
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.045em"
  h2:
    fontFamily: Latin Modern
    fontSize: 2.25rem
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  h3:
    fontFamily: Latin Modern
    fontSize: 1.5rem
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body:
    fontFamily: Latin Modern
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0em"
  body-small:
    fontFamily: Latin Modern
    fontSize: 0.95rem
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0em"
  label:
    fontFamily: Arial
    fontSize: 0.75rem
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0.1em"
  metadata:
    fontFamily: Arial
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.08em"
  code:
    fontFamily: Menlo
    fontSize: 0.82rem
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0em"
  slide-title:
    fontFamily: Cambria
    fontSize: 4rem
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  slide-body:
    fontFamily: Cambria
    fontSize: 2rem
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0em"
  print-body:
    fontFamily: Latin Modern
    fontSize: 0.65625rem
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0em"
rounded:
  none: 0px
  sm: 2px
  md: 2px
  lg: 2px
spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 80px
  5xl: 96px
  6xl: 112px
components:
  surface-page:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: 24px
  surface-subtle:
    backgroundColor: "{colors.paper-subtle}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: 24px
  surface-dark:
    backgroundColor: "{colors.dark-paper}"
    textColor: "{colors.dark-ink}"
    rounded: "{rounded.none}"
    padding: 24px
  surface-dark-subtle:
    backgroundColor: "{colors.dark-paper-subtle}"
    textColor: "{colors.dark-ink}"
    rounded: "{rounded.none}"
    padding: 24px
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 16px
    height: 48px
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 16px
    height: 48px
  label:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: 4px
  body-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 4px
  divider-strong:
    backgroundColor: "{colors.rule}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    height: 2px
  divider-hairline:
    backgroundColor: "{colors.hairline}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: 1px
  surface-dark-secondary:
    backgroundColor: "{colors.dark-paper}"
    textColor: "{colors.dark-ink-soft}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 24px
  surface-dark-muted:
    backgroundColor: "{colors.dark-paper}"
    textColor: "{colors.dark-ink-muted}"
    typography: "{typography.metadata}"
    rounded: "{rounded.none}"
    padding: 4px
  divider-dark-strong:
    backgroundColor: "{colors.dark-rule}"
    textColor: "{colors.dark-paper}"
    rounded: "{rounded.none}"
    height: 2px
  divider-dark-hairline:
    backgroundColor: "{colors.dark-hairline}"
    textColor: "{colors.dark-ink}"
    rounded: "{rounded.none}"
    height: 1px
  code-block:
    backgroundColor: "{colors.paper-subtle}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "{rounded.sm}"
    padding: 16px
  focus-indicator:
    backgroundColor: "{colors.focus}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.none}"
    padding: 4px
---

## Overview

The Seb Editorial System treats every artifact as a publication rather than a decorated software surface. It is deliberately monochrome, typographic, spacious, and evidence-led. The system should feel equally native on a website, a 16:9 slide, an A4 report, or a generated PDF.

Its personality comes from five things:

1. Large, low-weight serif headlines.
2. Small uppercase sans-serif metadata.
3. Strong black rules and quiet gray hairlines.
4. Explicit indexing, dates, captions, and evidence labels.
5. Generous but purposeful whitespace around dense, useful content.

The system does not use color as decoration. Hierarchy comes from scale, weight, alignment, rules, and contrast. Imagery is normally grayscale. Data visualizations may use neutral hatching, line styles, direct labels, and value hierarchy before introducing color.

### Brand voice

- Precise, direct, and editorial.
- Confident without looking luxurious or ceremonial.
- Technical without imitating a terminal.
- Minimal without becoming empty.
- Structured without falling into generic card grids.

### Cross-format invariant

A person should recognize the same system even when the canvas changes. Preserve the type roles, neutral palette, rule hierarchy, indexed sections, caption style, and asymmetric editorial composition. Do not force identical dimensions across formats.

## Colors

The palette is strictly neutral. Every gray uses equal RGB channels.

### Light mode

| Role | Token | Value | Use |
|---|---|---:|---|
| Page | `paper` | `#FFFFFF` | Main canvas and printable paper |
| Subtle page | `paper-subtle` | `#F3F3F3` | Code, quiet bands, browser surround |
| Primary text | `ink` | `#111111` | Headlines, body, key data |
| Secondary text | `ink-soft` | `#3F3F3F` | Decks, descriptions, supporting prose |
| Muted text | `ink-muted` | `#686868` | Labels, captions, dates, folios |
| Strong rule | `rule` | `#171717` | Section boundaries and table caps |
| Hairline | `hairline` | `#C8C8C8` | Row dividers and quiet structure |
| Focus | `focus` | `#000000` | Keyboard focus and selected state |

### Dark mode

Dark mode is an inversion with preserved hierarchy, not a separate neon theme. Use `dark-paper`, `dark-paper-subtle`, `dark-ink`, `dark-ink-soft`, `dark-ink-muted`, `dark-rule`, and `dark-hairline` in the same semantic roles.

### Contrast rules

- Body text must meet WCAG AA against its canvas.
- Muted text is for labels and metadata, not long reading text below 16px.
- Never use gray text on a gray panel unless the measured contrast passes.
- Interactive focus is a two-pixel solid outline with a three-pixel offset.
- Print output uses pure white paper and near-black ink; dark mode is never the default for print.

### Images and diagrams

- Default images to grayscale for web, slides, and editorial PDFs.
- Retain color only when color carries evidence, status, or data meaning.
- In the portable CSS, add `se-figure--evidence-color` when retained color carries that meaning.
- Use a one-pixel ink border for screenshots and figures.
- Do not use duotones, gradients, glows, or tinted overlays.
- Excalidraw diagrams use black strokes, white or `paper-subtle` fills, and gray only for secondary relationships.

## Typography

Typography carries the identity. The serif voice owns ideas, narrative, and major hierarchy. The sans-serif voice owns navigation, controls, labels, metadata, and operational annotations. Monospace is reserved for code, dates in dense timelines, identifiers, and measured values.

### Font stacks

- Editorial serif: `Latin Modern`, then Georgia, Cambria, and Times New Roman.
- Interface sans: Arial, then Helvetica.
- Technical mono: Menlo, Monaco, Consolas, then Liberation Mono.
- PowerPoint-safe mapping: Cambria for serif and Arial for sans.

Latin Modern is preferred on the web and in controlled PDF generation. Cambria is the default for editable Office slides because it is dependable across PowerPoint environments.

### Scale rules

- Display titles can be very large but should remain low weight.
- H1 uses a tight line height near `0.98` and may wrap to two or three lines.
- H2 introduces a section and normally sits near a strong top rule.
- H3 names a local argument, step, or evidence block.
- Body copy is left aligned, never fully justified on screens or slides.
- Line length is 58–72 characters for reading prose.
- Labels are uppercase with visible tracking; never use them for paragraphs.
- Avoid more than three type sizes in one local composition.

### Slide typography

For a 16:9 slide:

| Role | PowerPoint size | 1600px HTML source |
|---|---:|---:|
| Cover title | 52–72pt | 87–120px |
| Slide title | 36–44pt | 60–73px |
| Section heading | 22–28pt | 37–47px |
| Body | 17–21pt | 29–35px |
| Label / folio | 9–11pt | 15–18px |
| Source | 9–10pt | 15–17px |

The HTML source sizes account for Chrome scaling the `1600 × 900px` canvas into a `13.333 × 7.5in` print page. Do not convert the PowerPoint point sizes directly to CSS pixels.

Titles use Cambria regular. Body copy may use Cambria or Arial, but one deck must choose one body voice and keep it. Labels and folios use Arial.

### PDF typography

A4 reports use a 10.5pt serif body at approximately 1.55 line height. Headings scale from 16pt to 32pt. Captions and folios use 8–9pt Arial. Code uses 8.5–9pt monospace.

## Layout

The system uses asymmetric editorial grids and visible alignment. Whitespace must separate meaning, not disguise a lack of content.

### Shared spacing

Use the token scale. Prefer `24`, `32`, `48`, `64`, `80`, `96`, and `112` for major composition. Use `4`, `8`, `12`, and `16` inside compact controls, metadata, and table rows. Do not invent one-off gaps unless the canvas requires optical correction.

### Web grid

- Maximum publication width: `1180px`.
- Responsive outer gutter: `clamp(20px, 5vw, 64px)`.
- Reading width: `72ch`; supporting prose often stops at `62–68ch`.
- Desktop composition: 12 conceptual columns with 24–32px gutters.
- Mobile floor: `320px`, with no horizontal document overflow.
- Hero compositions may use a `1.25fr / 0.75fr` split.
- Lists are rows separated by hairlines, not floating card collections.

### Slide grid

The canonical slide is 16:9 at `1600 × 900px` or PowerPoint `13.333 × 7.5in`.

- Safe edge: 80px, equivalent to roughly 0.67in.
- Conceptual grid: 12 columns with 24px gutters.
- Header baseline: 72–88px from the top.
- Main content begins between 180 and 220px.
- Folio and source baseline: 840px.
- Keep repeated title, index, source, and folio positions fixed by slide class.
- Main content plus result band should normally occupy 80–90% of usable height.

Use these slide masters:

1. Cover: label, large title, short deck, date or author.
2. Section: index, one statement, optional short context.
3. Editorial content: fixed title plus one or two columns.
4. Evidence: title, dominant chart/table/figure, direct takeaway.
5. Process: title, editable Excalidraw relationship graphic, result band.
6. Conclusion: decisive statement, evidence summary, next action.
7. Appendix: denser layout, same title and folio coordinates.

### PDF grid

The canonical report is A4 portrait.

- Page: `210 × 297mm`.
- Margins: top `20mm`, right `18mm`, bottom `22mm`, left `20mm`.
- Reading measure: 65–75 characters.
- Running header and folio use sans-serif metadata.
- Each major section begins with a strong top rule and explicit index.
- Avoid splitting figures, tables, callouts, and section headings across pages.
- Use manually paginated pages for fixed reports and the continuous-flow document mode for long prose. Continuous mode omits simulated running folios because browsers cannot reliably continue absolutely positioned page furniture.

### Density

- Web: let content breathe between sections, but keep rows compact.
- Slides: do not leave an accidental empty lower half. Increase the diagram, table, or evidence area instead of adding decorative furniture.
- PDF: favor continuous reading rhythm. Use full-page breaks only for cover, section openers, or major figures.

## Elevation & Depth

The system is flat by design.

- No drop shadows.
- No glow.
- No glass effects.
- No fake browser or terminal chrome.
- No gradients.
- Use page contrast, rules, spacing, and rare inverse surfaces to create depth.
- Overlays, if unavoidable, use a one-pixel border and solid paper background.

## Shapes

- Default corner radius is `0–2px`.
- Use rectangles, rules, circles for data points, and simple arrowheads.
- Do not use pill-shaped cards as a default container.
- Buttons may use a two-pixel radius only.
- Figure and screenshot frames are square.
- Diagram nodes should be simple enough to remain editable in Excalidraw.

Rule hierarchy:

- Strong rule: 2px on screen, 1.25pt on slides, 0.8pt in print.
- Standard rule: 1px on screen, 0.75pt on slides, 0.5pt in print.
- Hairline: 1px `hairline` on screen, 0.5pt neutral gray elsewhere.

## Components

Components are content patterns, not decorative cards. Their geometry should translate between web, slides, and print.

### Masthead

A masthead contains a serif brand title, optional italic tagline, one strong lower rule, and compact sans-serif navigation. Keep utility controls in the same row when space allows.

### Editorial label

Small uppercase sans-serif text with `0.08–0.11em` tracking. Use it for section type, artifact class, status, or correspondence labels. It precedes a title and never competes with it.

### Indexed section

A two-digit index sits on the same baseline as a serif heading. A strong top rule anchors the section. The body begins after 16–24px. On slides, the index may sit at the far left of the title baseline.

### Publication row

Use a hairline-separated row with metadata on the left, content in the middle, and an optional arrow or value on the right. On narrow canvases, metadata moves above the content.

### Buttons and links

- Primary action: ink background, paper text, one-pixel ink border.
- Secondary action: paper background, ink text, one-pixel ink border.
- Text action: underlined sans-serif uppercase label.
- Minimum web target: 44 × 44px; preferred button height: 48px.
- Hover adds underline or controlled inversion, not motion effects.

### Figures

A figure includes the visual, a one-pixel frame where useful, a numbered caption, and an optional source. Captions use sans-serif metadata. Keep caption and source aligned to the figure edge.

### Data visualizations

- Label data directly where possible.
- Use black for the primary series, medium gray for comparison, and hairline gray for context.
- Distinguish additional series through line style, point shape, or hatching.
- Grid lines use hairline gray and should be sparse.
- Avoid legends when direct labels fit.
- Never use 3D charts.

### Tables

Use a strong top and bottom rule, hairline row separators, no vertical grid unless structure demands it, uppercase sans-serif headers, and left-aligned labels. Numeric columns align right and use tabular figures.

### Callouts and result bands

A callout is a ruled editorial block, not a tinted card. Use a strong top rule and large serif statement. A slide result band stays in the same lower zone across all repeated slides.

### Code and technical evidence

Use the subtle paper surface, one-pixel rule, two-pixel radius, 16px padding, and the code type token. Long code belongs in appendices or linked artifacts, not body slides.

### Excalidraw diagrams

- Keep editable `.excalidraw` sources beside exports.
- Stroke: ink, 1.5–2px.
- Primary fill: paper; secondary fill: paper-subtle.
- Text: near-black, sentence case.
- Use arrows only for meaningful direction.
- Prefer artifact chains, loops, system boundaries, and annotated timelines over card grids.
- Start from `design-system/templates/artifact-chain.excalidraw` for the editable process pattern shown in the slide starter.

## Do's and Don'ts

### Do

- Start from the canvas and choose the appropriate master.
- Use hierarchy before decoration.
- Index sections and label evidence explicitly.
- Keep important diagrams editable.
- Use date-only public metadata unless time is genuinely required by the artifact.
- Use grayscale imagery and direct chart labels.
- Keep repeated slide classes spatially consistent.
- Verify mobile overflow, slide occupancy, and print page breaks.
- Preserve enough whitespace to show hierarchy while filling the usable canvas with meaningful content.

### Don't

- Do not introduce accent colors merely to make the artifact feel designed.
- Do not use generic equal-weight card grids.
- Do not use rounded dashboards, traffic-light chrome, scanlines, or terminal simulation.
- Do not place decorative lines under slide titles; use the grid and whitespace.
- Do not use em dashes in Sebastian-facing prose.
- Do not center long body copy.
- Do not shrink slide text below 17pt to make content fit.
- Do not put every slide on a unique layout.
- Do not use dark-mode PDFs by default.
- Do not flatten Excalidraw diagrams without keeping their editable source.
