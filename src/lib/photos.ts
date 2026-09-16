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

/**
 * Wraps a product shot in the same shape the carton builder returns, so the
 * scroll stage drives a photo with exactly the code that drives the geometry.
 */
export function buildPhoto(url: string) {
  const group = new THREE.Group();

  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    // A shot carries its own lighting, so shading it again would muddy it.
    toneMapped: false,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  // Stand-in ratio until the file reports its own; swapped on load.
  let geometry = new THREE.PlaneGeometry(PRODUCT_H * 0.45, PRODUCT_H);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.visible = false;
  group.add(mesh);

  const loader = new THREE.TextureLoader();
  const texture = loader.load(url, (loaded) => {
    loaded.colorSpace = THREE.SRGBColorSpace;
    loaded.anisotropy = 4;
    const { width, height } = loaded.image as { width: number; height: number };
    const ratio = height > 0 ? width / height : 0.45;
    geometry.dispose();
    geometry = new THREE.PlaneGeometry(PRODUCT_H * ratio, PRODUCT_H);
    mesh.geometry = geometry;
    material.map = loaded;
    material.needsUpdate = true;
    mesh.visible = true;
  });

  return {
    group,
    // Nothing to repaint — the artwork is the file, not a canvas.
    redraw: () => {},
    materials: [material],
    textures: [texture],
    geometries: [geometry],
    /** A flat plane turns edge-on, so the stage damps its yaw. */
    flat: true,
  };
}
