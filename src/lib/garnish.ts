/**
 * Fruit, ice and water that drop in beside the pack once it has landed.
 * Drawn here as flat vector shapes rather than cut from the packaging, and
 * tinted from each flavour's own palette.
 */

export type Tone =
  | "fill"
  | "light"
  | "dark"
  | "leaf"
  | "ice"
  | "iceMid"
  | "iceLight"
  | "iceEdge"
  | "line";

export interface Stroke {
  d: string;
  tone: Tone;
  /** Draw as a line instead of a filled shape. */
  stroke?: boolean;
  /** Line weight on the 100-unit box; defaults to 3.5. */
  width?: number;
}

export type GarnishKind =
  | "mango"
  | "cherry"
  | "raspberry"
  | "blueberry"
  | "pear"
  | "peach"
  | "strawberry"
  | "ice"
  | "drop";

/** Every shape is drawn on a 100x100 box. */
export const SHAPES: Record<GarnishKind, Stroke[]> = {
  mango: [
    { d: "M50 4C72 4 88 20 88 42 88 66 70 96 50 96 30 96 12 66 12 42 12 20 28 4 50 4Z", tone: "fill" },
    { d: "M50 13C68 13 80 26 80 44 80 64 66 87 50 87 34 87 20 64 20 44 20 26 32 13 50 13Z", tone: "light" },
    { d: "M34 26L66 58", tone: "dark", stroke: true, width: 2.4 },
    { d: "M26 42L58 74", tone: "dark", stroke: true, width: 2.4 },
    { d: "M46 18L74 46", tone: "dark", stroke: true, width: 2.4 },
    { d: "M34 58L66 26", tone: "dark", stroke: true, width: 2.4 },
    { d: "M26 46L52 20", tone: "dark", stroke: true, width: 2.4 },
    { d: "M48 78L76 50", tone: "dark", stroke: true, width: 2.4 },
  ],
  cherry: [
    { d: "M35 50C48 26 58 14 66 8", tone: "leaf", stroke: true },
    { d: "M71 58C71 38 69 20 66 8", tone: "leaf", stroke: true },
    { d: "M66 9C79 2 92 8 92 19 82 26 69 22 66 9Z", tone: "leaf" },
    { d: "M13 66a20 20 0 1 0 40 0a20 20 0 1 0 -40 0Z", tone: "fill" },
    { d: "M56 70a16 16 0 1 0 32 0a16 16 0 1 0 -32 0Z", tone: "dark" },
    { d: "M20 58a6 4 0 1 0 12 0a6 4 0 1 0 -12 0Z", tone: "light" },
  ],
  raspberry: [
    { d: "M50 16C44 8 56 8 50 16Z", tone: "leaf" },
    { d: "M26 40a10 10 0 1 0 20 0a10 10 0 1 0 -20 0ZM54 40a10 10 0 1 0 20 0a10 10 0 1 0 -20 0ZM40 31a10 10 0 1 0 20 0a10 10 0 1 0 -20 0Z", tone: "fill" },
    { d: "M33 58a10 10 0 1 0 20 0a10 10 0 1 0 -20 0ZM47 58a10 10 0 1 0 20 0a10 10 0 1 0 -20 0ZM40 75a10 10 0 1 0 20 0a10 10 0 1 0 -20 0Z", tone: "dark" },
    { d: "M30 20C38 26 44 26 50 24 56 26 62 26 70 20 64 32 56 34 50 34 44 34 36 32 30 20Z", tone: "leaf" },
  ],
  blueberry: [
    { d: "M20 58a30 30 0 1 0 60 0a30 30 0 1 0 -60 0Z", tone: "fill" },
    { d: "M50 28l5 11 12-2-6 11 6 11-12-2-5 11-5-11-12 2 6-11-6-11 12 2Z", tone: "dark" },
    { d: "M31 50a7 5 0 1 0 14 0a7 5 0 1 0 -14 0Z", tone: "light" },
  ],
  pear: [
    { d: "M50 18C58 18 63 25 63 33 63 39 60 43 60 47 71 52 78 63 78 73 78 85 66 94 50 94 34 94 22 85 22 73 22 63 29 52 40 47 40 43 37 39 37 33 37 25 42 18 50 18Z", tone: "fill" },
    { d: "M50 18C51 13 52 10 54 7", tone: "leaf", stroke: true },
    { d: "M35 62C31 69 30 76 32 84", tone: "light", stroke: true },
    { d: "M54 8C64 1 78 5 78 15 68 21 56 18 54 8Z", tone: "leaf" },
  ],
  peach: [
    { d: "M16 56a34 34 0 1 0 68 0a34 34 0 1 0 -68 0Z", tone: "fill" },
    { d: "M50 26C42 46 44 72 53 88", tone: "dark", stroke: true },
    { d: "M50 24C60 12 76 14 78 24 68 32 54 32 50 24Z", tone: "leaf" },
  ],
  strawberry: [
    { d: "M50 94C29 79 17 58 19 42 21 28 34 21 50 26 66 21 79 28 81 42 83 58 71 79 50 94Z", tone: "fill" },
    { d: "M50 26C44 14 32 10 24 14 26 24 36 30 50 30 64 30 74 24 76 14 68 10 56 14 50 26Z", tone: "leaf" },
    { d: "M35 44a3 4 0 1 0 6 0a3 4 0 1 0 -6 0ZM55 42a3 4 0 1 0 6 0a3 4 0 1 0 -6 0ZM45 57a3 4 0 1 0 6 0a3 4 0 1 0 -6 0ZM61 59a3 4 0 1 0 6 0a3 4 0 1 0 -6 0ZM33 63a3 4 0 1 0 6 0a3 4 0 1 0 -6 0ZM47 75a3 4 0 1 0 6 0a3 4 0 1 0 -6 0Z", tone: "light" },
  ],
  ice: [
    { d: "M20 36L58 36 58 82 20 82Z", tone: "ice" },
    { d: "M20 36L40 21 78 21 58 36Z", tone: "iceLight" },
    { d: "M58 36L78 21 78 67 58 82Z", tone: "iceMid" },
    { d: "M26 43L34 43 34 59 26 59Z", tone: "iceLight" },
    { d: "M20 36L40 21 78 21 78 67 58 82 20 82Z", tone: "iceEdge", stroke: true },
    { d: "M20 36L58 36 58 82M58 36L78 21", tone: "iceEdge", stroke: true },
  ],
  drop: [
    { d: "M50 12C64 35 74 52 74 62a24 24 0 0 1-48 0C26 52 36 35 50 12Z", tone: "ice" },
    { d: "M40 58a5 7 0 1 0 0.1 0Z", tone: "iceLight" },
  ],
};

export interface GarnishPiece {
  kind: GarnishKind;
  /** Percentages of the stage box. */
  x: number;
  y: number;
  size: number;
  rotate: number;
  /** 0 lands with the pack, 1 lands last. */
  delay: number;
}

/**
 * Placed beside the pack, clear of the blurb top right and the spec rail
 * bottom left. The pack itself occupies roughly 38-65% across.
 */
export const GARNISH: GarnishPiece[][] = [
  [
    { kind: "cherry", x: 68, y: 43, size: 13, rotate: -8, delay: 0.15 },
    { kind: "cherry", x: 29, y: 12, size: 9, rotate: 22, delay: 0.55 },
    { kind: "ice", x: 65, y: 70, size: 10, rotate: 6, delay: 0.85 },
    { kind: "drop", x: 34, y: 83, size: 5, rotate: -10, delay: 1 },
  ],
  [
    { kind: "raspberry", x: 69, y: 44, size: 12, rotate: 6, delay: 0.15 },
    { kind: "blueberry", x: 30, y: 13, size: 9, rotate: -12, delay: 0.55 },
    { kind: "ice", x: 66, y: 71, size: 10, rotate: -8, delay: 0.85 },
    { kind: "drop", x: 35, y: 84, size: 5, rotate: 12, delay: 1 },
  ],
  [
    { kind: "pear", x: 69, y: 42, size: 13, rotate: 10, delay: 0.15 },
    { kind: "ice", x: 30, y: 12, size: 10, rotate: 10, delay: 0.55 },
    { kind: "drop", x: 66, y: 72, size: 6, rotate: -6, delay: 0.85 },
    { kind: "drop", x: 34, y: 83, size: 4.5, rotate: 14, delay: 1 },
  ],
  [
    { kind: "peach", x: 68, y: 43, size: 13, rotate: -6, delay: 0.15 },
    { kind: "ice", x: 29, y: 12, size: 10, rotate: -12, delay: 0.55 },
    { kind: "drop", x: 65, y: 71, size: 6, rotate: 8, delay: 0.85 },
    { kind: "drop", x: 34, y: 84, size: 4.5, rotate: -14, delay: 1 },
  ],
  [
    { kind: "strawberry", x: 69, y: 43, size: 13, rotate: 8, delay: 0.15 },
    { kind: "strawberry", x: 29, y: 12, size: 9, rotate: -20, delay: 0.55 },
    { kind: "ice", x: 65, y: 71, size: 10, rotate: 8, delay: 0.85 },
    { kind: "drop", x: 34, y: 83, size: 5, rotate: 10, delay: 1 },
  ],
  [
    { kind: "mango", x: 68, y: 42, size: 15, rotate: -12, delay: 0.15 },
    { kind: "ice", x: 30, y: 12, size: 10, rotate: 12, delay: 0.55 },
    { kind: "ice", x: 65, y: 72, size: 8, rotate: -6, delay: 0.85 },
    { kind: "drop", x: 34, y: 84, size: 5, rotate: -8, delay: 1 },
  ],
];
