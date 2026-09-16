import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FLAVORS, type Product } from "../lib/flavors";

const BODY_W = 1.0;
const BODY_H = 2.45;
const BODY_D = 0.62;

/**
 * Draws a carton label on a canvas: cream brand panel up top, flavour-coloured
 * body below. Everything is drawn here rather than loaded as artwork.
 */
function drawLabel(flavor: Product, kind: "front" | "side"): HTMLCanvasElement {
  const width = kind === "front" ? 384 : 248;
  const height = 944;
  const canvas = document.createElement("canvas");
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
    ctx.font = `700 ${fitFontSize(ctx, ["LOWCALY"], width * 0.78, width * 0.17, "Anton, Impact, sans-serif")}px Anton, Impact, sans-serif`;
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
    const words = flavor.name.split(" ");
    ctx.fillStyle = cream;
    const nameSize = fitFontSize(
      ctx,
      words,
      width * 0.82,
      words.length > 1 ? width * 0.2 : width * 0.26,
      "Anton, Impact, sans-serif",
    );
    ctx.font = `700 ${nameSize}px Anton, Impact, sans-serif`;
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
    ctx.font = `700 ${Math.round(width * 0.16)}px Anton, Impact, sans-serif`;
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
) {
  let size = start;
  while (size > 8) {
    ctx.font = `700 ${Math.round(size)}px ${family}`;
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

function buildCarton(flavor: Product) {
  const group = new THREE.Group();

  const front = makeTexture(drawLabel(flavor, "front"));
  const side = makeTexture(drawLabel(flavor, "side"));

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
    materials: [...materials, capMaterial, ring.material as THREE.MeshStandardMaterial],
    textures: [front, side],
    geometries: [body.geometry, cap.geometry, ring.geometry],
  };
}

export function CartonScene({ progressRef }: { progressRef: { current: number } }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || 1;
    let height = mount.clientHeight || 1;
    let disposed = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.15, 6.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd8c9ae, 1.5));

    const key = new THREE.DirectionalLight(0xffffff, 2.1);
    key.position.set(3.5, 5, 4);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xffe9cf, 0.9);
    fill.position.set(-4, 1.5, 2.5);
    scene.add(fill);

    const back = new THREE.DirectionalLight(0xffffff, 0.8);
    back.position.set(-1, 2, -4);
    scene.add(back);

    const cartons = FLAVORS.map((flavor) => {
      const built = buildCarton(flavor);
      scene.add(built.group);
      return built;
    });

    const pointer = { x: 0, y: 0 };
    const pointerTarget = { x: 0, y: 0 };

    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointerTarget.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerTarget.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const resize = () => {
      width = mount.clientWidth || 1;
      height = mount.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clock = new THREE.Clock();
    let frame = 0;
    let shown = 0;

    const layout = (time: number, delta: number) => {
      const narrow = width / height < 0.85;
      const target = progressRef.current * (FLAVORS.length - 1);
      // Frame-rate independent damping, so the queue keeps up on slow GPUs.
      shown += (target - shown) * (1 - Math.exp(-7 * delta));

      // Wide layouts keep the packs in the right half, clear of the copy.
      const baseX = narrow ? 0 : 1.15;
      const lift = narrow ? 0.62 : 0.14;

      cartons.forEach((carton, i) => {
        const rel = i - shown;
        const queued = rel >= 0;

        // Queued packs wait behind and to the side; the one just handed over
        // drifts up and toward the viewer as it fades, so the next takes over.
        const z = queued ? -rel * 2.5 : -rel * 1.6;
        const x = baseX + (queued ? rel * 0.95 : rel * 0.45) * (narrow ? 0.62 : 1);
        const y = lift + (queued ? rel * -0.1 : -rel * 0.85);

        const fade = queued
          ? Math.max(0, Math.min(1, 1 - rel / 2.4))
          : Math.max(0, Math.min(1, 1 + rel / 0.65));

        carton.group.position.set(x, y, z);
        carton.group.rotation.y =
          rel * 0.42 + Math.sin(time * 0.35) * 0.12 + pointer.x * 0.28;
        carton.group.rotation.x = -0.04 + pointer.y * 0.09;
        carton.group.rotation.z = rel * -0.04;

        const scale = (narrow ? 0.82 : 1) * (1 - Math.abs(rel) * 0.04);
        carton.group.scale.setScalar(Math.max(scale, 0.4));
        carton.group.visible = fade > 0.01;

        carton.materials.forEach((material) => {
          material.opacity = fade;
        });
      });
    };

    const render = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      pointer.x += (pointerTarget.x - pointer.x) * 0.05;
      pointer.y += (pointerTarget.y - pointer.y) * 0.05;
      layout(clock.elapsedTime, delta);
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };

    const start = () => {
      if (disposed) return;
      // Regenerate labels once webfonts are in, so the canvas text isn't
      // rendered in a fallback face.
      cartons.forEach((carton, i) => {
        const flavor = FLAVORS[i];
        carton.textures[0].image = drawLabel(flavor, "front");
        carton.textures[0].needsUpdate = true;
        carton.textures[1].image = drawLabel(flavor, "side");
        carton.textures[1].needsUpdate = true;
      });
      if (reduced) {
        layout(0, 1);
        renderer.render(scene, camera);
      }
    };

    if (document.fonts && document.fonts.status !== "loaded") {
      document.fonts.ready.then(start);
    } else {
      start();
    }

    if (reduced) {
      layout(0, 1);
      renderer.render(scene, camera);
    } else {
      frame = requestAnimationFrame(render);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      cartons.forEach((carton) => {
        carton.geometries.forEach((geometry) => geometry.dispose());
        carton.materials.forEach((material) => material.dispose());
        carton.textures.forEach((texture) => texture.dispose());
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [progressRef]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
