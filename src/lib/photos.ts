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

/**
 * Builds a side panel by taking a slice a thin column of the shot across the
 * face. A carton's colour bands run all the way round, so a sampled column
 * reads as the real side — and it keeps the pack's own silhouette, including
 * the gap either side of the cap.
 */
function panelFrom(
  source: HTMLCanvasElement,
  x: number,
  width: number,
  darken: number,
  flip: boolean,
) {
  const canvas = document.createElement("canvas");
  canvas.width = 96;
  canvas.height = source.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.imageSmoothingEnabled = true;
  if (flip) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(source, x, 0, width, source.height, 0, 0, canvas.width, canvas.height);
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // Nothing here is lit by the scene, so the fall-off away from the key light
  // is baked in. Without it the side reads as a second, paler pack standing
  // behind the first rather than as the same box turning.
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = `rgba(0,0,0,${darken})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return canvas;
}

function makeTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
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
    const source = document.createElement("canvas");
    source.width = image.width;
    source.height = image.height;
    const ctx = source.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(image, 0, 0);

    const width = PRODUCT_H * (image.width / image.height);
    const depth = width * DEPTH_RATIO;
    geometry.dispose();
    geometry = new THREE.BoxGeometry(width, PRODUCT_H, depth);
    mesh.geometry = geometry;

    // A hair-thin column stretched across the panel reads as smeared stripes.
    // Taking a wide slice of the artwork instead keeps the fruit recognisable,
    // which is also how the real pack wraps its design around the corner.
    const strip = Math.round(image.width * 0.34);
    const inset = Math.round(image.width * 0.04);

    const frontTexture = makeTexture(panelFrom(source, 0, image.width, 0, false));
    // The far side of the pack: the same shot, mirrored and dimmed.
    const backTexture = makeTexture(panelFrom(source, 0, image.width, 0.2, true));
    const rightTexture = makeTexture(
      panelFrom(source, image.width - inset - strip, strip, 0.3, true),
    );
    const leftTexture = makeTexture(panelFrom(source, inset, strip, 0.42, false));
    const topTexture = makeTexture(panelFrom(source, inset, strip, 0.12, false));
    const bottomTexture = makeTexture(panelFrom(source, inset, strip, 0.3, false));

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
