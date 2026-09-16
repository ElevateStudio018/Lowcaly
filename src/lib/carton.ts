import * as THREE from "three";
import type { Product } from "./flavors";

const BODY_W = 1.0;
const BODY_H = 2.45;
const BODY_D = 0.62;

/**
 * Splits a flavour name into at most two label lines, keeping a lone
 * ampersand attached to the word after it.
 */
export function nameLines(name: string): string[] {
  const words = name.split(" ");
  const lines: string[] = [];
  for (const word of words) {
    if (lines.length && lines[lines.length - 1].endsWith("&")) {
      lines[lines.length - 1] += ` ${word}`;
    } else if (lines.length === 2) {
      lines[1] += ` ${word}`;
    } else {
      lines.push(word);
    }
  }
  return lines;
}

/**
 * Draws a carton label on a canvas: cream brand panel up top, flavour-coloured
 * body below. Everything is drawn here rather than loaded as artwork.
 */
export function drawLabel(
  flavor: Product,
  kind: "front" | "side",
  target?: HTMLCanvasElement,
): HTMLCanvasElement {
  const width = kind === "front" ? 384 : 248;
  const height = 944;
  const canvas = target ?? document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const cream = "#faf0dd";
  const forest = "#0e3b2c";
  const panelBottom = height * 0.33;

  const body = ctx.createLinearGradient(0, panelBottom, width, height);
  body.addColorStop(0, flavor.accent);
  body.addColorStop(1, flavor.accentDeep);
  ctx.fillStyle = body;
  ctx.fillRect(0, 0, width, height);

  // Cream brand panel with a soft dip along its lower edge.
  ctx.fillStyle = cream;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(width, 0);
  ctx.lineTo(width, panelBottom - 40);
  ctx.quadraticCurveTo(width / 2, panelBottom + 60, 0, panelBottom - 40);
  ctx.closePath();
  ctx.fill();

  ctx.textAlign = "center";

  if (kind === "front") {
    ctx.fillStyle = forest;
    ctx.font = `400 ${fitFontSize(ctx, ["LOWCALY"], width * 0.78, width * 0.17, "Anton, Impact, sans-serif", 400)}px Anton, Impact, sans-serif`;
    ctx.fillText("LOWCALY", width / 2, height * 0.115);

    ctx.font = `600 ${Math.round(width * 0.045)}px Manrope, Arial, sans-serif`;
    ctx.letterSpacing = `${Math.round(width * 0.022)}px`;
    ctx.fillText("FRUIT DRINK", width / 2, height * 0.152);
    ctx.letterSpacing = "0px";

    // Zero sugar pill
    const pillW = width * 0.6;
    const pillH = height * 0.043;
    const pillX = (width - pillW) / 2;
    const pillY = height * 0.178;
    ctx.fillStyle = forest;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fill();

    ctx.fillStyle = cream;
    ctx.font = `700 ${fitFontSize(ctx, ["ZERO SUGAR"], pillW * 0.84, width * 0.062, "Manrope, Arial, sans-serif")}px Manrope, Arial, sans-serif`;
    ctx.fillText("ZERO SUGAR", width / 2, pillY + pillH * 0.72);

    ctx.fillStyle = forest;
    ctx.font = `600 ${Math.round(width * 0.038)}px Manrope, Arial, sans-serif`;
    const vitamins = flavor.specs.find((s) => s.includes("vitamin")) ?? "";
    ctx.fillText(vitamins.toUpperCase(), width / 2, height * 0.247);

    // Flavour name across the coloured body
    const words = nameLines(flavor.name);
    ctx.fillStyle = cream;
    const nameSize = fitFontSize(
      ctx,
      words,
      width * 0.82,
      words.length > 1 ? width * 0.2 : width * 0.26,
      "Anton, Impact, sans-serif",
      400,
    );
    ctx.font = `400 ${nameSize}px Anton, Impact, sans-serif`;
    ctx.shadowColor = "rgba(0,0,0,0.18)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    words.forEach((word, i) => {
      ctx.fillText(word, width / 2, height * 0.52 + i * nameSize * 1.05);
    });
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    ctx.font = `700 ${Math.round(width * 0.055)}px Manrope, Arial, sans-serif`;
    ctx.textAlign = "right";
    ctx.fillText("1 L", width - width * 0.09, height * 0.95);
  } else {
    ctx.fillStyle = forest;
    ctx.font = `400 ${Math.round(width * 0.16)}px Anton, Impact, sans-serif`;
    ctx.fillText("LOWCALY", width / 2, height * 0.12);

    ctx.fillStyle = cream;
    ctx.font = `600 ${Math.round(width * 0.062)}px Manrope, Arial, sans-serif`;
    ctx.letterSpacing = `${Math.round(width * 0.03)}px`;
    ctx.fillText("ZERO SUGAR", width / 2, height * 0.62);
    ctx.letterSpacing = "0px";
  }

  return canvas;
}

/** Largest size at or below `start` that keeps every line inside `maxWidth`. */
function fitFontSize(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  maxWidth: number,
  start: number,
  family: string,
  weight = 700,
) {
  let size = start;
  while (size > 8) {
    ctx.font = `${weight} ${Math.round(size)}px ${family}`;
    if (lines.every((line) => ctx.measureText(line).width <= maxWidth)) break;
    size -= 2;
  }
  return Math.round(size);
}

function makeTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function buildCarton(flavor: Product) {
  const group = new THREE.Group();

  const frontCanvas = drawLabel(flavor, "front");
  const sideCanvas = drawLabel(flavor, "side");
  const front = makeTexture(frontCanvas);
  const side = makeTexture(sideCanvas);

  /**
   * Labels are baked into a texture, so a first visit that draws them before
   * the webfonts land would keep the fallback type forever. Call this once
   * `document.fonts.ready` resolves.
   */
  const redraw = () => {
    drawLabel(flavor, "front", frontCanvas);
    drawLabel(flavor, "side", sideCanvas);
    front.needsUpdate = true;
    side.needsUpdate = true;
  };

  const panel = (map: THREE.Texture) =>
    new THREE.MeshStandardMaterial({
      map,
      roughness: 0.62,
      metalness: 0.02,
      transparent: true,
    });

  const plain = (color: string) =>
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.62,
      metalness: 0.02,
      transparent: true,
    });

  // BoxGeometry material order: +x, -x, +y, -y, +z, -z
  const materials = [
    panel(side),
    panel(side),
    plain("#f3e3c8"),
    plain(flavor.accentDeep),
    panel(front),
    panel(front),
  ];

  const body = new THREE.Mesh(new THREE.BoxGeometry(BODY_W, BODY_H, BODY_D), materials);
  group.add(body);

  const capMaterial = plain("#f7f3ea");
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.125, 0.17, 24), capMaterial);
  cap.position.set(BODY_W * 0.22, BODY_H / 2 + 0.08, 0);
  group.add(cap);

  const ring = new THREE.Mesh(
    new THREE.CylinderGeometry(0.135, 0.135, 0.04, 24),
    plain("#e8e0d2"),
  );
  ring.position.set(BODY_W * 0.22, BODY_H / 2 + 0.01, 0);
  group.add(ring);

  return {
    group,
    redraw,
    materials: [...materials, capMaterial, ring.material as THREE.MeshStandardMaterial],
    textures: [front, side],
    geometries: [body.geometry, cap.geometry, ring.geometry],
  };
}
