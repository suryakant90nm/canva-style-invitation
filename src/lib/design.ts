export type Align = "left" | "center" | "right";

export type BaseEl = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  opacity: number;
  locked?: boolean;
};

export type TextEl = BaseEl & {
  type: "text";
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  italic: boolean;
  underline: boolean;
  align: Align;
  color: string;
  letterSpacing: number;
  lineHeight: number;
  uppercase: boolean;
};

export type ShapeKind =
  | "rect"
  | "circle"
  | "ring"
  | "semi"
  | "quarter"
  | "leaf"
  | "wave"
  | "flower"
  | "triangle"
  | "diamond"
  | "star"
  | "heart"
  | "hexagon"
  | "arch"
  | "line";

export type ShapeEl = BaseEl & {
  type: "shape";
  shape: ShapeKind;
  fill: string;
  stroke: string;
  strokeWidth: number;
  radius: number;
};

export type ImageFrame = "rect" | "rounded" | "circle" | "arch";

export type ImageEl = BaseEl & {
  type: "image";
  src: string;
  frame: ImageFrame;
  radius: number;
  /** true = empty photo frame that the user fills with their own photo */
  placeholder?: boolean;
  label?: string;
  /** CSS mix-blend-mode, used so white-background artwork melts into the card */
  blend?: "normal" | "multiply" | "screen" | "luminosity";
  /** for pattern art that should repeat as a wallpaper */
  tile?: boolean;
};

export type El = TextEl | ShapeEl | ImageEl;

export type Doc = {
  width: number;
  height: number;
  background: string;
  elements: El[];
  /**
   * Multi-page "story invite": one card per event (Haldi → Mehendi → Shaadi →
   * Reception). Optional; when absent the doc is a single page.
   */
  pages?: Page[];
  /** UI language used while authoring, drives font defaults */
  lang?: string;
};

export type Page = {
  id: string;
  name: string;
  background: string;
  elements: El[];
};

/** Pages always exist — a single-page doc is just one page. */
export function pagesOf(doc: Doc): Page[] {
  if (doc.pages?.length) return doc.pages;
  return [{ id: "p1", name: "Page 1", background: doc.background, elements: doc.elements }];
}

export function withPages(doc: Doc, pages: Page[]): Doc {
  const [first, ...rest] = pages;
  return {
    ...doc,
    background: first?.background ?? doc.background,
    elements: first?.elements ?? [],
    pages: pages.length ? pages : undefined,
  };
}

export const uid = () => Math.random().toString(36).slice(2, 10);

export function makeText(text: string, o: Partial<TextEl> = {}): TextEl {
  return {
    id: uid(),
    type: "text",
    x: 100,
    y: 100,
    w: 400,
    h: 0,
    rotation: 0,
    opacity: 1,
    text,
    fontFamily: "Poppins",
    fontSize: 40,
    fontWeight: 400,
    italic: false,
    underline: false,
    align: "center",
    color: "#1f2937",
    letterSpacing: 0,
    lineHeight: 1.2,
    uppercase: false,
    ...o,
  };
}

export function makeShape(shape: ShapeKind, o: Partial<ShapeEl> = {}): ShapeEl {
  return {
    id: uid(),
    type: "shape",
    shape,
    x: 100,
    y: 100,
    w: 200,
    h: 200,
    rotation: 0,
    opacity: 1,
    fill: "#c9a24b",
    stroke: "#000000",
    strokeWidth: 0,
    radius: 0,
    ...o,
  };
}

export function makeImage(src: string, o: Partial<ImageEl> = {}): ImageEl {
  return {
    id: uid(),
    type: "image",
    src,
    x: 100,
    y: 100,
    w: 300,
    h: 300,
    rotation: 0,
    opacity: 1,
    frame: "rect",
    radius: 16,
    placeholder: !src,
    label: "Add photo",
    ...o,
    ...(src ? { placeholder: false } : {}),
  };
}

export function cloneDoc(doc: Doc): Doc {
  return JSON.parse(JSON.stringify(doc)) as Doc;
}

/** Resize canvas and scale all content uniformly so it fits and stays centered. */
export function resizeDoc(doc: Doc, nw: number, nh: number): Doc {
  const s = Math.min(nw / doc.width, nh / doc.height);
  const ox = (nw - doc.width * s) / 2;
  const oy = (nh - doc.height * s) / 2;
  return {
    ...doc,
    width: nw,
    height: nh,
    elements: doc.elements.map((el) => {
      const base = { ...el, x: el.x * s + ox, y: el.y * s + oy, w: el.w * s, h: el.h * s };
      if (el.type === "text") {
        return {
          ...base,
          fontSize: el.fontSize * s,
          letterSpacing: el.letterSpacing * s,
        } as TextEl;
      }
      if (el.type === "shape") {
        return {
          ...base,
          strokeWidth: el.strokeWidth * s,
          radius: el.radius * s,
        } as ShapeEl;
      }
      return { ...base, radius: el.radius * s } as ImageEl;
    }),
  };
}

export const SIZE_PRESETS = [
  { name: "Card Portrait (5×7)", w: 700, h: 1000 },
  { name: "Card Landscape (7×5)", w: 1000, h: 700 },
  { name: "Square Invite", w: 800, h: 800 },
  { name: "Instagram Post", w: 1080, h: 1080 },
  { name: "WhatsApp / Story", w: 720, h: 1280 },
  { name: "A5 Print", w: 840, h: 1190 },
];
