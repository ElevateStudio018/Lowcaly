import * as THREE from "three";
import type { Product } from "./flavors";
import { buildCarton } from "./carton";
import { buildBottle } from "./bottle";

const WIDTH = 440;
const HEIGHT = 760;

/**
 * Renders every product once through the same geometry and lighting the
 * scroll stage uses, so the grid shows the real product rather than a second,
 * flatter drawing of it. One context is created, reused and thrown away.
 */
export async function renderProductThumbnails(
  products: Product[],
): Promise<Map<string, string>> {
  const out = new Map<string, string>();

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
  } catch {
    return out;
  }

  renderer.setPixelRatio(1);
  renderer.setSize(WIDTH, HEIGHT);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, WIDTH / HEIGHT, 0.1, 100);
  camera.position.set(0, 0, 5);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8c9ae, 1.55));
  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(3.5, 5, 4);
  const fill = new THREE.DirectionalLight(0xffe9cf, 0.9);
  fill.position.set(-4, 1.5, 2.5);
  const rim = new THREE.DirectionalLight(0xffffff, 0.8);
  rim.position.set(-1, 2, -4);
  scene.add(key, fill, rim);

  // Labels are baked into textures, so wait for the display faces.
  await document.fonts?.ready;

  for (const product of products) {
    const built = product.shape === "bottle" ? buildBottle(product) : buildCarton(product);
    // Bottles are shorter than the litre cartons; match their on-card presence.
    built.group.scale.setScalar(product.shape === "bottle" ? 1.02 : 1);
    built.group.rotation.y = -0.26;
    built.group.rotation.x = 0.035;
    scene.add(built.group);
    renderer.render(scene, camera);

    const blob = await new Promise<Blob | null>((resolve) =>
      renderer.domElement.toBlob(resolve, "image/png"),
    );
    if (blob) out.set(product.id, URL.createObjectURL(blob));

    scene.remove(built.group);
    built.geometries.forEach((geometry) => geometry.dispose());
    built.materials.forEach((material) => material.dispose());
    built.textures.forEach((texture) => texture.dispose());
  }

  renderer.dispose();
  renderer.forceContextLoss();
  return out;
}
