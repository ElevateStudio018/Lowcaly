import * as THREE from "three";
import type { Product } from "./flavors";

/**
 * Real product shots, if any have been dropped into assets/products. The file
 * name is the product id, so adding `cherry.png` is all it takes to swap that
 * flavour over from the drawn carton.
 */
const files = import.meta.glob("../assets/products/*.{png,webp,jpg,jpeg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export const PHOTOS: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [
    path.split("/").pop()!.replace(/\.[^.]+$/, ""),
    url,
  ]),
);

export const photoFor = (product: Product) => PHOTOS[product.id];

/** Matches the drawn carton's overall height so the stage framing carries over. */
const PRODUCT_H = 2.7;
/** Depth as a share of width, taken from the drawn carton's proportions. */
const DEPTH_RATIO = 0.62;
/** Every texture is supersampled to at least this many pixels of width, so a
 *  small source photo still gets a real mip chain instead of visible texels. */
const MIN_TEXTURE_W = 720;

function upscaleCanvas(source: HTMLCanvasElement, targetWidth: number) {
  const scale = Math.max(1, targetWidth / source.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(source.width * scale);
  canvas.height = Math.round(source.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return source;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

/**
 * Finds the first row (from the top) where the given column is solidly
 * opaque. A pack's cap sits narrower than its body, so a fixed inset column
 * is transparent for the rows above the shoulder — sampling those rows into
 * a side panel is what left a visible gap in the box as it turned.
 */
function firstOpaqueRow(data: ImageData, x: number) {
  const { width, height, data: px } = data;
  for (let y = 0; y < height; y++) {
    const a = px[(y * width + x) * 4 + 3];
    if (a > 235) return y;
  }
  return 0;
}

/** Average colour of a rectangular patch, used for the faces no photo covers. */
function averageColor(data: ImageData, x0: number, y0: number, x1: number, y1: number) {
  const { width, data: px } = data;
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * width + x) * 4;
      if (px[i + 3] < 200) continue;
      r += px[i];
      g += px[i + 1];
      b += px[i + 2];
      n++;
    }
  }
  if (n === 0) return "#e9e2d0";
  return `rgb(${Math.round(r / n)},${Math.round(g / n)},${Math.round(b / n)})`;
}

/**
 * Builds a side panel from a slice of the shot, taken only from the safe
 * vertical band below the shoulder so it can never carry a transparent row.
 * A carton's colour bands run all the way round, so a wide slice reads as
 * the real side — and it's how the real pack wraps its design round the
 * corner.
 */
function sidePanel(
  source: HTMLCanvasElement,
  x: number,
  width: number,
  safeTop: number,
  safeBottom: number,
  darken: number,
  flip: boolean,
) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(160, Math.round(width * 2));
  canvas.height = source.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  if (flip) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }
  // Stretch the safe band to cover the panel's full height, so the strip
  // never reaches into the cap's transparent margin above it.
  const safeHeight = safeBottom - safeTop;
  ctx.drawImage(
    source,
    x,
    safeTop,
    width,
    safeHeight,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // Nothing here is lit by the scene, so the fall-off away from the key light
  // is baked in. Without it the side reads as a second, paler pack standing
  // behind the first rather than as the same box turning.
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = `rgba(0,0,0,${darken})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return canvas;
}

function solidPanel(color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 8;
  canvas.height = 8;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 8, 8);
  }
  return canvas;
}

function makeTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/**
 * Wraps a product shot in the same shape the carton builder returns, so the
 * scroll stage drives a shot with exactly the code that drives the geometry.
 * The shot becomes a box rather than a plane so the pack can turn all the way
 * through without going edge-on and vanishing.
 */
export function buildPhoto(url: string) {
  const group = new THREE.Group();

  const face = (map: THREE.Texture | null) =>
    new THREE.MeshBasicMaterial({
      map,
      transparent: true,
      // The shot carries its own lighting; shading it again only muddies it.
      toneMapped: false,
      depthWrite: false,
      // Back faces are culled, so the box never overlaps itself and needs no
      // sorting between its own panels.
      side: THREE.FrontSide,
    });

  const front = face(null);
  const back = face(null);
  const left = face(null);
  const right = face(null);
  const top = face(null);
  const bottom = face(null);

  // BoxGeometry material order: +x, -x, +y, -y, +z, -z
  const materials = [right, left, top, bottom, front, back];
  let geometry = new THREE.BoxGeometry(PRODUCT_H * 0.4, PRODUCT_H, PRODUCT_H * 0.4 * DEPTH_RATIO);
  const mesh = new THREE.Mesh(geometry, materials);
  mesh.visible = false;
  group.add(mesh);

  const textures: THREE.Texture[] = [];

  const image = new Image();
  image.crossOrigin = "anonymous";
  image.onload = () => {
    const raw = document.createElement("canvas");
    raw.width = image.width;
    raw.height = image.height;
    const rawCtx = raw.getContext("2d");
    if (!rawCtx) return;
    rawCtx.drawImage(image, 0, 0);
    const data = rawCtx.getImageData(0, 0, raw.width, raw.height);

    // Supersample the source up front so every panel — including the ones
    // sliced from it below — draws from a real mip chain instead of the
    // handful of texels a ~150px source photo actually has.
    const source = upscaleCanvas(raw, Math.max(MIN_TEXTURE_W, raw.width));
    const scaleX = source.width / raw.width;

    const width = PRODUCT_H * (raw.width / raw.height);
    const depth = width * DEPTH_RATIO;
    geometry.dispose();
    geometry = new THREE.BoxGeometry(width, PRODUCT_H, depth);
    mesh.geometry = geometry;

    const strip = Math.round(raw.width * 0.34);
    const inset = Math.round(raw.width * 0.04);

    // The cap sits narrower than the body, so a fixed inset column is
    // transparent above the shoulder. Find where each side actually starts.
    const leftShoulder = firstOpaqueRow(data, inset + Math.round(strip / 2));
    const rightShoulder = firstOpaqueRow(data, raw.width - inset - Math.round(strip / 2));
    const safeTop = Math.round(Math.max(leftShoulder, rightShoulder) + raw.height * 0.03);
    const safeBottom = Math.round(raw.height * 0.97);

    const frontTexture = makeTexture(source);
    // The far side of the pack: the same shot, mirrored and dimmed.
    const backCanvas = document.createElement("canvas");
    backCanvas.width = source.width;
    backCanvas.height = source.height;
    const backCtx = backCanvas.getContext("2d");
    if (backCtx) {
      backCtx.translate(backCanvas.width, 0);
      backCtx.scale(-1, 1);
      backCtx.drawImage(source, 0, 0);
      backCtx.setTransform(1, 0, 0, 1, 0, 0);
      backCtx.globalCompositeOperation = "source-atop";
      backCtx.fillStyle = "rgba(0,0,0,0.2)";
      backCtx.fillRect(0, 0, backCanvas.width, backCanvas.height);
    }
    const backTexture = makeTexture(backCanvas);

    const rightTexture = makeTexture(
      sidePanel(
        source,
        (raw.width - inset - strip) * scaleX,
        strip * scaleX,
        safeTop * scaleX,
        safeBottom * scaleX,
        0.3,
        true,
      ),
    );
    const leftTexture = makeTexture(
      sidePanel(
        source,
        inset * scaleX,
        strip * scaleX,
        safeTop * scaleX,
        safeBottom * scaleX,
        0.42,
        false,
      ),
    );

    // The true top (cap) and base of the carton were never in frame, so
    // approximate them with a colour lifted from the pack rather than a
    // photo slice, which removes any risk of sampling a transparent row.
    const capColor = averageColor(
      data,
      Math.round(raw.width * 0.42),
      Math.round(raw.height * 0.02),
      Math.round(raw.width * 0.58),
      Math.round(raw.height * 0.08),
    );
    const baseColor = averageColor(
      data,
      inset,
      Math.round(raw.height * 0.9),
      inset + strip,
      Math.round(raw.height * 0.97),
    );
    const topTexture = makeTexture(solidPanel(capColor));
    const bottomTexture = makeTexture(solidPanel(baseColor));

    front.map = frontTexture;
    back.map = backTexture;
    right.map = rightTexture;
    left.map = leftTexture;
    top.map = topTexture;
    bottom.map = bottomTexture;
    [front, back, right, left, top, bottom].forEach((m) => (m.needsUpdate = true));
    textures.push(frontTexture, backTexture, rightTexture, leftTexture, topTexture, bottomTexture);
    mesh.visible = true;
  };
  image.src = url;

  return {
    group,
    // Nothing to repaint — the artwork is the file, not a canvas.
    redraw: () => {},
    materials,
    textures,
    geometries: [geometry],
  };
}
