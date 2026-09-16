import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { FLAVORS } from "../lib/flavors";
import { buildCarton } from "../lib/carton";
import { StaticRange } from "./StaticRange";

const CREAM = "#faf0dd";
const COUNT = FLAVORS.length;
/**
 * One viewport for the hero, then one per product. The tail is clipped short
 * of a full stage so the last carton is still leaving as the sticky releases,
 * instead of the section ending on an empty screen.
 */
const STAGES = COUNT + 0.7;

/** World units spanned by the viewport at z = 0, for the camera below. */
const VIEW_UNITS = 2 * 6.2 * Math.tan((38 / 2) * (Math.PI / 180));
/** Idle float: a few pixels over a slow cycle, enough to feel alive. */
const FLOAT_PX = 3;
const FLOAT_PERIOD = 5;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};
const band = (v: number, from: number, to: number) => smooth((v - from) / (to - from));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Background colour for a point in the timeline, crossfading mid-transition. */
function stageColor(stage: number) {
  if (stage <= 1) {
    return gsap.utils.interpolate(CREAM, FLAVORS[0].accent, band(stage, 0.4, 1)) as string;
  }
  const index = Math.min(Math.floor(stage - 1), COUNT - 1);
  const local = stage - 1 - index;
  // The last product hands the page back to cream so the section below it
  // starts on the colour it already has.
  const next = index === COUNT - 1 ? CREAM : FLAVORS[index + 1].accent;
  return gsap.utils.interpolate(
    FLAVORS[index].accent,
    next,
    band(local, 0.45, 0.95),
  ) as string;
}

export function Cinematic() {
  const sectionRef = useRef<HTMLElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [reduced, setReduced] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const mount = mountRef.current;
    const section = sectionRef.current;
    if (!mount || !section) return;

    let width = mount.clientWidth || 1;
    let height = mount.clientHeight || 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      // No WebGL: fall back to the static range rather than a blank stage.
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd8c9ae, 1.55));
    const key = new THREE.DirectionalLight(0xffffff, 2.1);
    key.position.set(3.5, 5, 4);
    const fill = new THREE.DirectionalLight(0xffe9cf, 0.9);
    fill.position.set(-4, 1.5, 2.5);
    const rim = new THREE.DirectionalLight(0xffffff, 0.8);
    rim.position.set(-1, 2, -4);
    scene.add(key, fill, rim);

    const cartons = FLAVORS.map((flavor) => {
      const built = buildCarton(flavor);
      scene.add(built.group);
      return built;
    });

    // Repaint the labels once the display faces arrive so a cold load never
    // bakes fallback type into the textures.
    let disposed = false;
    document.fonts?.ready.then(() => {
      if (!disposed) cartons.forEach((carton) => carton.redraw());
    });

    const pointer = { x: 0, y: 0 };
    const pointerTarget = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      pointerTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerTarget.y = -((event.clientY / window.innerHeight) * 2 - 1);
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

    const clock = new THREE.Clock();
    let frame = 0;
    // Style writes are the expensive part of the frame, so skip the ones that
    // would not change anything — an idle page then costs almost nothing.
    let lastBg = "";
    const lastCopy = FLAVORS.map(() => -1);

    const draw = () => {
      const time = clock.elapsedTime;
      const narrow = width / height < 0.85;

      const rect = section.getBoundingClientRect();
      const viewport = stageRef.current?.clientHeight || window.innerHeight;
      const travel = rect.height - viewport;
      const progress = travel > 0 ? clamp01(-rect.top / travel) : 0;
      const stage = progress * STAGES;

      pointer.x += (pointerTarget.x - pointer.x) * 0.05;
      pointer.y += (pointerTarget.y - pointer.y) * 0.05;

      // 0 = the whole range fanned out behind the hero, 1 = one product on stage.
      const stepForward = band(stage, 0.3, 1);
      // The rest of the range parts and falls back so the first product is
      // alone on stage by the time the hand-off finishes.
      const parting = band(stage, 0.12, 0.62);
      const restX = narrow ? 0 : 0.62;
      const spread = narrow ? 0.26 : 0.62;
      const depth = narrow ? 0.5 : 0.3;
      const baseY = narrow ? -0.32 : -0.5;
      const baseScale = narrow ? 0.38 : 0.5;

      cartons.forEach((carton, i) => {
        const centred = i - (COUNT - 1) / 2;
        const part = i === 0 ? 0 : parting;

        // Hero arrangement: a shallow arc of the full range, sitting low enough
        // to leave the headline its own air.
        const heroX = centred * spread * (1 + part * 0.9);
        const heroY = baseY - part * 0.12;
        const heroZ = -Math.abs(centred) * depth - part * 1.4;
        const heroRotY = centred * 0.16 + part * centred * 0.24;
        const heroScale = baseScale;
        const heroFade = 1 - part;

        // Story arrangement: enters low and small, rises, leaves up and larger.
        const rel = stage - 1 - i;
        const enter = band(rel, -1, 0);
        const exit = band(rel, 0, 1);
        const storyX = restX + (narrow ? 0 : mix(-0.35, 0.35, (enter + exit) / 2));
        // Phones lift the product clear of the copy block beneath it.
        const storyY = mix(-0.95, 0, enter) + mix(0, 0.7, exit) + (narrow ? 0.42 : 0);
        const storyZ = mix(-1.1, 0, enter);
        const storyRotZ = (mix(-0.09, 0, enter) + mix(0, 0.09, exit)) * (narrow ? 0.6 : 1);
        const storyRotY = mix(0.5, 0, enter) + mix(0, -0.4, exit) + pointer.x * 0.22;
        const storyScale = (narrow ? 0.86 : 1) * mix(0.75, 1, enter) * mix(1, 1.15, exit);
        const storyFade = Math.min(band(rel, -1, -0.55), 1 - band(rel, 0.55, 1));

        const blend = stepForward;
        const floatY =
          Math.sin((time / FLOAT_PERIOD) * Math.PI * 2 + i) *
          ((FLOAT_PX / height) * VIEW_UNITS);

        carton.group.position.set(
          mix(heroX, storyX, blend),
          mix(heroY, storyY, blend) + floatY,
          mix(heroZ, storyZ, blend),
        );
        carton.group.rotation.set(
          pointer.y * 0.06,
          mix(heroRotY, storyRotY, blend),
          mix(0, storyRotZ, blend) + Math.sin((time / FLOAT_PERIOD) * Math.PI * 1.6 + i) * 0.005,
        );
        const scale = mix(heroScale, storyScale, blend);
        carton.group.scale.setScalar(scale);

        const fade = mix(heroFade, storyFade, blend);
        carton.group.visible = fade > 0.015;
        carton.materials.forEach((material) => {
          material.opacity = fade;
        });
      });

      const bg = stageColor(stage);
      if (bgRef.current && bg !== lastBg) {
        bgRef.current.style.backgroundColor = bg;
        lastBg = bg;
      }

      // Hero copy dissolves into the first product.
      if (heroRef.current) {
        const out = band(stage, 0.1, 0.72);
        heroRef.current.style.opacity = String(1 - out);
        heroRef.current.style.transform = `translate3d(0, ${-out * 46}px, 0)`;
        heroRef.current.style.filter = `blur(${out * 9}px)`;
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = String(1 - band(stage, 0.02, 0.3));
      }

      copyRefs.current.forEach((el, i) => {
        if (!el) return;
        const rel = stage - 1 - i;
        const appear = band(rel, -0.55, -0.2);
        const leave = band(rel, 0.24, 0.52);
        const shown = Math.round(Math.min(appear, 1 - leave) * 1000) / 1000;
        if (shown === lastCopy[i]) return;
        lastCopy[i] = shown;
        el.style.opacity = String(shown);
        el.style.transform = `translate3d(0, ${(1 - shown) * 26}px, 0)`;
        el.style.filter = `blur(${(1 - shown) * 7}px)`;
        el.style.visibility = shown > 0.01 ? "visible" : "hidden";
      });

      renderer.render(scene, camera);
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);

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
  }, [reduced]);

  if (reduced || failed) {
    return <StaticRange />;
  }

  return (
    <section
      id="produkter"
      ref={sectionRef}
      className="relative"
      style={{ height: `calc(${STAGES} * var(--stage-step, 100) * 1vh)` }}
    >
      <div ref={stageRef} className="sticky top-0 h-svh overflow-hidden">
        <div ref={bgRef} className="absolute inset-0" style={{ backgroundColor: CREAM }} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.5),transparent_62%)]" />
        <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />

        <div
          ref={heroRef}
          className="pointer-events-none absolute inset-x-0 top-[15%] px-6 text-center md:top-[16%] md:px-12"
        >
          <p className="font-body mb-5 text-[0.65rem] font-bold uppercase tracking-[0.42em] text-forest/55">
            Sockerfri fruktdryck
          </p>
          <h1 className="font-display mx-auto max-w-4xl text-[clamp(2.6rem,7.5vw,6rem)] leading-[0.92] text-forest">
            Zero Sugar.
            <br />
            Hero Taste.
          </h1>
        </div>

        {FLAVORS.map((flavor, i) => (
          <div
            key={flavor.id}
            ref={(el) => {
              copyRefs.current[i] = el;
            }}
            className="pointer-events-none absolute inset-x-0 bottom-20 px-6 md:bottom-0 md:top-0 md:flex md:items-center md:px-12"
            style={{ opacity: 0 }}
          >
            <div className="mx-auto w-full max-w-6xl">
              <div className="md:max-w-sm">
                <p className="font-body text-[0.65rem] font-bold uppercase tracking-[0.42em] text-forest/50">
                  Lowcaly
                </p>
                <h2 className="font-display mt-3 text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95] text-forest">
                  {flavor.name}
                </h2>
                <p className="font-serif mt-4 text-lg italic leading-relaxed text-forest/75">
                  {flavor.tagline}
                </p>
                <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-[0.18em] text-forest/55">
                  {flavor.specs.map((spec) => (
                    <li key={spec}>{spec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}

        <div
          ref={hintRef}
          className="pointer-events-none absolute inset-x-0 bottom-8 text-center font-body text-[0.6rem] font-bold uppercase tracking-[0.42em] text-forest/40"
        >
          Scrolla
        </div>
      </div>
    </section>
  );
}
