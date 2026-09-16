import * as THREE from "three";
import type { Product } from "./flavors";
import { nameLines } from "./carton";

const BODY_R = 0.42;
const LABEL_H = 1.15;

/** Half-profile of a 500 ml juice bottle, revolved into the body. */
function profile() {
  return [
    new THREE.Vector2(0, -1.05),
    new THREE.Vector2(0.3, -1.05),
    new THREE.Vector2(0.39, -1.0),
    new THREE.Vector2(BODY_R, -0.9),
    new THREE.Vector2(BODY_R, 0.34),
    new THREE.Vector2(0.41, 0.48),
    new THREE.Vector2(0.36, 0.63),
    new THREE.Vector2(0.26, 0.76),
    new THREE.Vector2(0.18, 0.86),
    new THREE.Vector2(0.155, 0.95),
    new THREE.Vector2(0.155, 1.05),
    new THREE.Vector2(0, 1.05),
  ];
}

/**
 * Wrap-around bottle label. The artwork is drawn once in the middle of the
 * strip so it faces the camera, with the flavour colour carrying the rest.
 */
export function drawBottleLabel(product: Product, target?: HTMLCanvasElement) {
  const width = 1024;
  const height = 420;
  const canvas = target ?? document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const cream = "#faf0dd";
  const forest = "#0e3b2c";

  const wash = ctx.createLinearGradient(0, 0, 0, height);
  wash.addColorStop(0, product.accent);
  wash.addColorStop(1, product.accentDeep);
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, width, height);

  // Cream brand band across the top third of the label.
  ctx.fillStyle = cream;
  ctx.fillRect(0, 0, width, height * 0.34);

  const cx = width / 2;
  ctx.textAlign = "center";

  ctx.fillStyle = forest;
  ctx.font = `400 ${Math.round(height * 0.17)}px Anton, Impact, sans-serif`;
  ctx.fillText("LOWCALY", cx, height * 0.2);

  ctx.font = `600 ${Math.round(height * 0.045)}px Manrope, Arial, sans-serif`;
  ctx.letterSpacing = `${Math.round(height * 0.022)}px`;
  ctx.fillText("FRUIT DRINK", cx, height * 0.28);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = cream;
  const words = nameLines(product.name);
  let nameSize = Math.round(height * (words.length > 1 ? 0.13 : 0.18));
  while (nameSize > 10) {
    ctx.font = `400 ${nameSize}px Anton, Impact, sans-serif`;
    if (words.every((w) => ctx.measureText(w).width <= width * 0.3)) break;
    nameSize -= 2;
  }
  ctx.font = `400 ${nameSize}px Anton, Impact, sans-serif`;
  const nameTop = height * (words.length > 1 ? 0.52 : 0.6);
  words.forEach((word, i) => {
    ctx.fillText(word, cx, nameTop + i * nameSize * 1.02);
  });

  // Zero sugar pill below the flavour name.
  const pillW = width * 0.2;
  const pillH = height * 0.1;
  ctx.fillStyle = forest;
  ctx.beginPath();
  ctx.roundRect(cx - pillW / 2, height * 0.8, pillW, pillH, pillH / 2);
  ctx.fill();
  ctx.fillStyle = cream;
  ctx.font = `700 ${Math.round(height * 0.05)}px Manrope, Arial, sans-serif`;
  ctx.fillText("ZERO SUGAR", cx, height * 0.87);

  // Volume marks on the shoulders of the wrap, where the label curves away.
  ctx.fillStyle = forest;
  ctx.font = `700 ${Math.round(height * 0.06)}px Manrope, Arial, sans-serif`;
  ctx.fillText("500 ML", width * 0.12, height * 0.2);
  ctx.fillText("500 ML", width * 0.88, height * 0.2);

  return canvas;
}

export function buildBottle(product: Product) {
  const group = new THREE.Group();

  const glass = new THREE.MeshStandardMaterial({
    color: new THREE.Color(product.accentDeep),
    roughness: 0.2,
    metalness: 0.02,
    transparent: true,
    opacity: 0.93,
  });

  const bodyGeometry = new THREE.LatheGeometry(profile(), 56);
  const body = new THREE.Mesh(bodyGeometry, glass);
  group.add(body);

  const labelCanvas = drawBottleLabel(product);
  const labelTexture = new THREE.CanvasTexture(labelCanvas);
  labelTexture.colorSpace = THREE.SRGBColorSpace;
  labelTexture.anisotropy = 4;
  // CylinderGeometry starts its u axis at the +z face, so shifting the strip
  // by half a turn (less the group's yaw) points the artwork at the camera.
  labelTexture.wrapS = THREE.RepeatWrapping;
  labelTexture.offset.x = 0.5 - 0.26 / (Math.PI * 2);

  const labelMaterial = new THREE.MeshStandardMaterial({
    map: labelTexture,
    roughness: 0.62,
    metalness: 0.01,
    transparent: true,
  });
  const labelGeometry = new THREE.CylinderGeometry(
    BODY_R + 0.004,
    BODY_R + 0.004,
    LABEL_H,
    56,
    1,
    true,
  );
  const label = new THREE.Mesh(labelGeometry, labelMaterial);
  label.position.y = -0.25;
  group.add(label);

  const capMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#0e3b2c"),
    roughness: 0.42,
    metalness: 0.04,
    transparent: true,
  });
  const capGeometry = new THREE.CylinderGeometry(0.175, 0.175, 0.2, 40);
  const cap = new THREE.Mesh(capGeometry, capMaterial);
  cap.position.y = 1.12;
  group.add(cap);

  const collarMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#e8e0d2"),
    roughness: 0.5,
    metalness: 0.02,
    transparent: true,
  });
  const collarGeometry = new THREE.CylinderGeometry(0.168, 0.168, 0.05, 40);
  const collar = new THREE.Mesh(collarGeometry, collarMaterial);
  collar.position.y = 0.99;
  group.add(collar);

  const redraw = () => {
    drawBottleLabel(product, labelCanvas);
    labelTexture.needsUpdate = true;
  };

  return {
    group,
    redraw,
    materials: [glass, labelMaterial, capMaterial, collarMaterial],
    textures: [labelTexture],
    geometries: [bodyGeometry, labelGeometry, capGeometry, collarGeometry],
  };
}
