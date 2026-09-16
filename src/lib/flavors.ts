export type ProductShapeKind = "carton" | "bottle";

export interface Product {
  id: string;
  name: string;
  shape: ProductShapeKind;
  /** Pale page tint behind the product. */
  accent: string;
  /** Mid tone, used on the packaging gradient. */
  accentDeep: string;
  /** Saturated shape colour behind the product. */
  pop: string;
  tagline: string;
  specs: string[];
  /** Spec-rail rows: volume first, then three short lines. */
  rows: [string, string, string];
}

// The pinned scroll showcase — six chilled cartons.
export const FLAVORS: Product[] = [
  {
    id: "cherry",
    name: "Cherry",
    shape: "carton",
    accent: "#F6D3DE",
    accentDeep: "#E28AA5",
    pop: "#E3455E",
    tagline: "Solmogna körsbär i en fyllig, fruktig smak — helt utan tillsatt socker.",
    specs: ["1 L", "Zero Sugar", "6 vitaminer"],
    rows: ["Sockerfri fruktdryck", "Körsbärssmak", "6 vitaminer"],
  },
  {
    id: "mixed-berry",
    name: "Mixed Berry",
    shape: "carton",
    accent: "#DEE2F6",
    accentDeep: "#8B98D9",
    pop: "#5B69C4",
    tagline: "En balanserad mix av söta och syrliga bär, klunk efter klunk.",
    specs: ["1 L", "Zero Sugar", "6 vitaminer"],
    rows: ["Sockerfri fruktdryck", "Blandade bär", "6 vitaminer"],
  },
  {
    id: "pear",
    name: "Pear",
    shape: "carton",
    accent: "#E7F1D6",
    accentDeep: "#A9C97E",
    pop: "#8DBE4F",
    tagline: "Mogna päron med en mjuk, rund sötma som känns helt naturlig.",
    specs: ["1 L", "Zero Sugar", "7 vitaminer"],
    rows: ["Sockerfri fruktdryck", "Päronsmak", "7 vitaminer"],
  },
  {
    id: "white-peach",
    name: "White Peach",
    shape: "carton",
    accent: "#DCF1EC",
    accentDeep: "#7DC9BE",
    pop: "#3FB5A4",
    tagline: "Vit persika med en frisk, blommig ton som svalkar direkt.",
    specs: ["1 L", "Zero Sugar", "7 vitaminer"],
    rows: ["Sockerfri fruktdryck", "Vit persika", "7 vitaminer"],
  },
  {
    id: "strawberry",
    name: "Strawberry",
    shape: "carton",
    accent: "#FBDCD3",
    accentDeep: "#EF9683",
    pop: "#EF5B3C",
    tagline: "Solmogna jordgubbar, rakt igenom fruktig utan någon sockerkick.",
    specs: ["1 L", "Zero Sugar", "6 vitaminer"],
    rows: ["Sockerfri fruktdryck", "Jordgubbssmak", "6 vitaminer"],
  },
  {
    id: "mango",
    name: "Mango",
    shape: "carton",
    accent: "#FBE9C9",
    accentDeep: "#F0B65E",
    pop: "#F0A32A",
    tagline: "Solmogen mango med en tropisk sötma som känns som semester.",
    specs: ["1 L", "Zero Sugar", "8 vitaminer"],
    rows: ["Sockerfri fruktdryck", "Mangosmak", "8 vitaminer"],
  },
];

// The breakfast bottle range — used as a teaser row in the hero.
export const BOTTLES: Product[] = [
  {
    id: "apples-pear",
    name: "Apples & Pear",
    shape: "bottle",
    accent: "#E7F1D6",
    accentDeep: "#A9C97E",
    pop: "#8DBE4F",
    tagline: "Äpple och päron sida vid sida — en frisk frukostklassiker.",
    specs: ["500 ml", "Zero Sugar", "7 vitaminer"],
    rows: ["Sockerfri fruktdryck", "Äpple & päron", "7 vitaminer"],
  },
  {
    id: "tropical-bliss",
    name: "Tropical Bliss",
    shape: "bottle",
    accent: "#FBE9C9",
    accentDeep: "#F0B65E",
    pop: "#F0A32A",
    tagline: "En tropisk mix som tar dig till varmare breddgrader.",
    specs: ["500 ml", "Zero Sugar", "8 vitaminer"],
    rows: ["Sockerfri fruktdryck", "Tropisk mix", "8 vitaminer"],
  },
  {
    id: "sunny-orange",
    name: "Sunny Orange",
    shape: "bottle",
    accent: "#FCE4C4",
    accentDeep: "#EEA24C",
    pop: "#EE8B2A",
    tagline: "Solmogna apelsiner i sin renaste form, dag efter dag.",
    specs: ["500 ml", "Zero Sugar", "8 vitaminer"],
    rows: ["Sockerfri fruktdryck", "Apelsinsmak", "8 vitaminer"],
  },
];
