export type ProductShapeKind = "carton" | "bottle";

export interface Product {
  id: string;
  name: string;
  shape: ProductShapeKind;
  accent: string;
  accentDeep: string;
  tagline: string;
  specs: string[];
}

// The pinned scroll showcase — six chilled cartons.
export const FLAVORS: Product[] = [
  {
    id: "cherry",
    name: "Cherry",
    shape: "carton",
    accent: "#F6D3DE",
    accentDeep: "#E28AA5",
    tagline: "Solmogna körsbär i en fyllig, fruktig smak — helt utan tillsatt socker.",
    specs: ["1 L", "Zero Sugar", "6 vitaminer"],
  },
  {
    id: "mixed-berry",
    name: "Mixed Berry",
    shape: "carton",
    accent: "#DEE2F6",
    accentDeep: "#8B98D9",
    tagline: "En balanserad mix av söta och syrliga bär, klunk efter klunk.",
    specs: ["1 L", "Zero Sugar", "6 vitaminer"],
  },
  {
    id: "pear",
    name: "Pear",
    shape: "carton",
    accent: "#E7F1D6",
    accentDeep: "#A9C97E",
    tagline: "Mogna päron med en mjuk, rund sötma som känns helt naturlig.",
    specs: ["1 L", "Zero Sugar", "7 vitaminer"],
  },
  {
    id: "white-peach",
    name: "White Peach",
    shape: "carton",
    accent: "#DCF1EC",
    accentDeep: "#7DC9BE",
    tagline: "Vit persika med en frisk, blommig ton som svalkar direkt.",
    specs: ["1 L", "Zero Sugar", "7 vitaminer"],
  },
  {
    id: "strawberry",
    name: "Strawberry",
    shape: "carton",
    accent: "#FBDCD3",
    accentDeep: "#EF9683",
    tagline: "Solmogna jordgubbar, rakt igenom fruktig utan någon sockerkick.",
    specs: ["1 L", "Zero Sugar", "6 vitaminer"],
  },
  {
    id: "mango",
    name: "Mango",
    shape: "carton",
    accent: "#FBE9C9",
    accentDeep: "#F0B65E",
    tagline: "Solmogen mango med en tropisk sötma som känns som semester.",
    specs: ["1 L", "Zero Sugar", "8 vitaminer"],
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
    tagline: "Äpple och päron sida vid sida — en frisk frukostklassiker.",
    specs: ["500 ml", "Zero Sugar", "7 vitaminer"],
  },
  {
    id: "tropical-bliss",
    name: "Tropical Bliss",
    shape: "bottle",
    accent: "#FBE9C9",
    accentDeep: "#F0B65E",
    tagline: "En tropisk mix som tar dig till varmare breddgrader.",
    specs: ["500 ml", "Zero Sugar", "8 vitaminer"],
  },
  {
    id: "sunny-orange",
    name: "Sunny Orange",
    shape: "bottle",
    accent: "#FCE4C4",
    accentDeep: "#EEA24C",
    tagline: "Solmogna apelsiner i sin renaste form, dag efter dag.",
    specs: ["500 ml", "Zero Sugar", "8 vitaminer"],
  },
];
