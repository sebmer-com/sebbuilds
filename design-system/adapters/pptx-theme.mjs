export const palette = Object.freeze({
  paper: "FFFFFF",
  paperSubtle: "F3F3F3",
  ink: "111111",
  inkSoft: "3F3F3F",
  inkMuted: "686868",
  rule: "171717",
  hairline: "C8C8C8",
  darkPaper: "111111",
  darkPaperSubtle: "1A1A1A",
  darkInk: "F2F2F2",
  darkInkSoft: "CCCCCC",
  darkInkMuted: "9C9C9C",
  darkRule: "F2F2F2",
  darkHairline: "414141",
});

export const type = Object.freeze({
  serif: "Cambria",
  sans: "Arial",
  mono: "Courier New",
  coverTitle: 72,
  slideTitle: 42,
  sectionHeading: 26,
  body: 19,
  bodySmall: 17,
  label: 10,
  source: 9,
  folio: 10,
  metric: 64,
});

export const spacing = Object.freeze({
  xxs: 0.03,
  xs: 0.07,
  sm: 0.1,
  md: 0.14,
  lg: 0.2,
  xl: 0.27,
  twoXl: 0.4,
  threeXl: 0.53,
  fourXl: 0.67,
  fiveXl: 0.8,
  sixXl: 0.93,
});

export const lines = Object.freeze({
  strong: Object.freeze({ color: palette.rule, width: 1.25 }),
  standard: Object.freeze({ color: palette.rule, width: 0.75 }),
  hairline: Object.freeze({ color: palette.hairline, width: 0.5 }),
  darkStrong: Object.freeze({ color: palette.darkRule, width: 1.25 }),
  darkHairline: Object.freeze({ color: palette.darkHairline, width: 0.5 }),
});

export const canvas = Object.freeze({
  width: 13.333,
  height: 7.5,
  safe: Object.freeze({ x: 0.67, y: 0.53, w: 11.99, h: 6.57 }),
  contentTop: 1.72,
  footerY: 7.0,
});

export const masters = Object.freeze({
  cover: Object.freeze({
    label: Object.freeze({ x: 0.67, y: 0.58, w: 6.4, h: 0.24 }),
    title: Object.freeze({ x: 0.67, y: 3.1, w: 8.7, h: 2.05 }),
    deck: Object.freeze({ x: 0.67, y: 5.45, w: 7.2, h: 0.78 }),
    footer: Object.freeze({ x: 0.67, y: 6.86, w: 11.99, h: 0.22 }),
  }),
  content: Object.freeze({
    index: Object.freeze({ x: 0.67, y: 0.72, w: 0.56, h: 0.2 }),
    title: Object.freeze({ x: 1.42, y: 0.58, w: 9.25, h: 0.78 }),
    eyebrow: Object.freeze({ x: 10.9, y: 0.72, w: 1.76, h: 0.2 }),
    body: Object.freeze({ x: 1.42, y: 1.76, w: 10.75, h: 3.82 }),
    result: Object.freeze({ x: 1.42, y: 5.85, w: 10.75, h: 0.68 }),
    source: Object.freeze({ x: 0.67, y: 6.91, w: 10.7, h: 0.2 }),
    folio: Object.freeze({ x: 11.95, y: 6.91, w: 0.71, h: 0.2 }),
  }),
  twoColumn: Object.freeze({
    left: Object.freeze({ x: 1.42, y: 1.76, w: 4.55, h: 3.82 }),
    right: Object.freeze({ x: 6.55, y: 1.76, w: 5.62, h: 3.82 }),
  }),
  threeColumn: Object.freeze({
    first: Object.freeze({ x: 1.42, y: 1.76, w: 3.23, h: 3.82 }),
    second: Object.freeze({ x: 4.95, y: 1.76, w: 3.23, h: 3.82 }),
    third: Object.freeze({ x: 8.48, y: 1.76, w: 3.69, h: 3.82 }),
  }),
});

export const textStyles = Object.freeze({
  label: Object.freeze({
    fontFace: type.sans,
    fontSize: type.label,
    bold: true,
    color: palette.inkMuted,
    charSpacing: 1.6,
    margin: 0,
    breakLine: false,
  }),
  title: Object.freeze({
    fontFace: type.serif,
    fontSize: type.slideTitle,
    bold: false,
    color: palette.ink,
    margin: 0,
    breakLine: false,
  }),
  body: Object.freeze({
    fontFace: type.serif,
    fontSize: type.body,
    bold: false,
    color: palette.inkSoft,
    margin: 0,
    breakLine: false,
  }),
  source: Object.freeze({
    fontFace: type.sans,
    fontSize: type.source,
    bold: false,
    color: palette.inkMuted,
    margin: 0,
    breakLine: false,
  }),
});

export function configurePresentation(presentation, metadata = {}) {
  presentation.layout = "LAYOUT_WIDE";
  presentation.author = metadata.author ?? "Sebastian Mertens";
  presentation.company = metadata.company ?? "Seb Builds";
  presentation.subject = metadata.subject ?? "Seb Editorial System";
  presentation.title = metadata.title ?? "Seb Editorial Deck";
  presentation.lang = metadata.lang ?? "en-US";
  presentation.theme = {
    headFontFace: type.serif,
    bodyFontFace: type.serif,
    lang: presentation.lang,
  };
  return presentation;
}

export function lightSurface() {
  return {
    background: palette.paper,
    text: palette.ink,
    secondaryText: palette.inkSoft,
    mutedText: palette.inkMuted,
    rule: palette.rule,
    hairline: palette.hairline,
  };
}

export function darkSurface() {
  return {
    background: palette.darkPaper,
    text: palette.darkInk,
    secondaryText: palette.darkInkSoft,
    mutedText: palette.darkInkMuted,
    rule: palette.darkRule,
    hairline: palette.darkHairline,
  };
}
