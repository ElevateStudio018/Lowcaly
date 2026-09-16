/**
 * Hand-authored decoration for the product stage: one organic shape and a
 * couple of line marks per flavour, so no two beats look identical.
 */

/** Organic shapes drawn on a 200x200 box. */
export const BLOBS = [
  "M28 104c-10-42 20-80 66-84 44-4 82 18 86 54 4 34-14 60-46 72-20 8-40 6-56 14-20 10-42-8-50-56z",
  "M24 88c4-40 44-70 88-66 40 4 66 30 66 62 0 30-20 54-50 66-24 10-48 12-66 2-24-14-42-32-38-64z",
  "M36 70c18-34 62-52 100-40 34 10 50 40 44 74-6 32-30 54-64 60-28 5-58-4-72-24-16-24-22-44-8-70z",
  "M22 112c-6-46 28-86 74-92 42-6 76 16 82 52 5 32-10 58-38 74-26 15-58 20-82 8-22-11-34-24-36-42z",
  "M40 58c26-24 72-26 104 0 26 21 30 60 12 90-16 26-48 38-80 32-30-6-54-26-58-52-5-28 2-50 22-70z",
  "M26 92c-2-40 30-72 74-74 46-2 80 24 80 60 0 32-22 58-56 70-26 9-56 8-74-6-16-12-22-28-24-50z",
];

export type DoodleKind = "sprig" | "drops" | "waves" | "bloom";

/** Line marks, drawn on a 100x100 box and stroked, never filled. */
export const DOODLES: Record<DoodleKind, string[]> = {
  sprig: [
    "M12 88C30 70 52 46 84 16",
    "M84 16c-24 2-38 12-44 26-2 6 2 12 9 12 14 0 27-14 35-38z",
    "M46 50c-18-6-31-3-38 8-3 5 0 12 7 13 13 3 26-6 31-21z",
  ],
  drops: [
    "M30 22c10 12 15 21 15 28a15 15 0 0 1-30 0c0-7 5-16 15-28z",
    "M66 48c8 10 12 17 12 23a12 12 0 0 1-24 0c0-6 4-13 12-23z",
    "M40 68c6 8 9 14 9 18a9 9 0 0 1-18 0c0-4 3-10 9-18z",
  ],
  waves: [
    "M18 14c14 10-14 22 0 32s-14 22 0 32",
    "M50 8c14 10-14 22 0 32s-14 22 0 32",
    "M82 16c14 10-14 22 0 32s-14 22 0 32",
  ],
  bloom: [
    "M50 50c-16-16-30-26-22-34s22 6 22 22c0-16 14-30 22-22s-6 22-22 22c16 0 30 14 22 22s-22-6-22-22c0 16-14 30-22 22s6-22 22-22z",
  ],
};

/** Which marks sit on which beat, and where they land in the frame. */
export interface Ornament {
  kind: DoodleKind;
  /** Percentages of the stage box. */
  x: number;
  y: number;
  size: number;
  rotate: number;
}

export const ORNAMENTS: Ornament[][] = [
  [
    { kind: "sprig", x: 16, y: 16, size: 9.5, rotate: -12 },
    { kind: "drops", x: 33, y: 70, size: 8, rotate: 6 },
  ],
  [
    { kind: "bloom", x: 18, y: 17, size: 8, rotate: 0 },
    { kind: "waves", x: 32, y: 68, size: 8.5, rotate: -8 },
  ],
  [
    { kind: "sprig", x: 19, y: 15, size: 9, rotate: 28 },
    { kind: "drops", x: 31, y: 71, size: 8, rotate: -10 },
  ],
  [
    { kind: "waves", x: 17, y: 18, size: 8.5, rotate: 10 },
    { kind: "bloom", x: 34, y: 70, size: 7.5, rotate: 18 },
  ],
  [
    { kind: "sprig", x: 15, y: 17, size: 10, rotate: -22 },
    { kind: "drops", x: 34, y: 72, size: 8.5, rotate: 0 },
  ],
  [
    { kind: "bloom", x: 18, y: 16, size: 8, rotate: -14 },
    { kind: "waves", x: 33, y: 69, size: 8.5, rotate: 14 },
  ],
];
