import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FLAVORS } from "../lib/flavors";
import { buildCarton } from "../lib/carton";
import { buildPhoto, photoFor } from "../lib/photos";
import { BLOBS, DOODLES, ORNAMENTS } from "../lib/art";
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

const rgbCache = new Map<string, [number, number, number]>();
function rgb(hex: string): [number, number, number] {
  let parsed = rgbCache.get(hex);
  if (!parsed) {
    const v = parseInt(hex.slice(1), 16);
    parsed = [(v >> 16) & 255, (v >> 8) & 255, v & 255];
    rgbCache.set(hex, parsed);
  }
  return parsed;
}

/** sRGB blend between two hex colours, as a CSS colour string. */
function mixHex(from: string, to: string, t: number) {
  const a = rgb(from);
  const b = rgb(to);
  return `rgb(${Math.round(mix(a[0], b[0], t))},${Math.round(mix(a[1], b[1], t))},${Math.round(mix(a[2], b[2], t))})`;
}

/** Background colour for a point in the timeline, crossfading mid-transition. */
function stageColor(stage: number) {
  if (stage <= 1) {
    return mixHex(CREAM, FLAVORS[0].accent, band(stage, 0.4, 1));
  }
  const index = Math.min(Math.floor(stage - 1), COUNT - 1);
  const local = stage - 1 - index;
  // The last product hands the page back to cream so the section below it
  // starts on the colour it already has.
  const next = index === COUNT - 1 ? CREAM : FLAVORS[index + 1].accent;
  return mixHex(FLAVORS[index].accent, next, band(local, 0.45, 0.95));
}

/** Cartons alternate which way they lean, the way the reference tumbles. */
const restTilt = (i: number) => (i % 2 === 0 ? 0.3 : -0.14);

export function Cinematic() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const nameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const paraRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRefs = useRef<(HTMLDivElement | null)[]>([]);
  const decorRefs = useRef<(SVGSVGElement | null)[]>([]);
  const ornRefs = useRef<(HTMLDivElement | null)[]>([]);
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
      const photo = photoFor(flavor);
      const built = photo ? buildPhoto(photo) : buildCarton(flavor);
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
    const lastBeat = FLAVORS.map(() => -1);

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
      const spread = narrow ? 0.26 : 0.7;
      const depth = narrow ? 0.5 : 0.3;
      const baseY = narrow ? -0.32 : -0.5;
      const baseScale = narrow ? 0.38 : 0.5;

      // Where a product rests while it holds the stage.
      const restX = narrow ? 0 : 0.1;
      const restY = narrow ? -0.06 : 0;
      const restScale = narrow ? 0.8 : 1.06;

      cartons.forEach((carton, i) => {
        const centred = i - (COUNT - 1) / 2;
        const part = i === 0 ? 0 : parting;

        // Hero arrangement: a shallow arc of the full range, sitting low enough
        // to leave the headline its own air.
        const heroX = centred * spread * (1 + part * 0.9);
        const heroY = baseY - part * 0.12;
        const heroZ = -Math.abs(centred) * depth - part * 1.4;
        const heroRotY = centred * 0.035 + part * centred * 0.24;
        const heroFade = 1 - part;

        // Story arrangement: the product tumbles in, settles at its lean, then
        // tumbles out larger — the beat the reference cuts on.
        const rel = stage - 1 - i;
        const enter = band(rel, -1, 0);
        const exit = band(rel, 0, 1);
        const tilt = restTilt(i) * (narrow ? 0.55 : 1);
        const storyX = restX + mix(-0.55, 0.45, (enter + exit) / 2) * (narrow ? 0.2 : 1);
        const storyY = mix(-1.25, 0, enter) + mix(0, 1.05, exit) + restY;
        const storyZ = mix(-1.4, 0, enter);
        const storyRotZ = tilt + mix(-1, 0, enter) + mix(0, 0.9, exit);
        // The pack screws round into the frame and keeps turning on its way
        // out — one continuous rotation, not a nudge and a nudge back. The
        // swing is sized so the steepest angles land while it is still fading,
        // and it reads near side-on at most while fully visible.
        const storyRotY = mix(1.3, 0, enter) + mix(0, -1.1, exit) + pointer.x * 0.2;
        const storyScale = restScale * mix(0.7, 1, enter) * mix(1, 1.3, exit);
        const storyFade = Math.min(band(rel, -1, -0.58), 1 - band(rel, 0.58, 1));

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
          mix(0, storyRotZ, blend),
        );
        carton.group.scale.setScalar(mix(baseScale, storyScale, blend));

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

      FLAVORS.forEach((_, i) => {
        const rel = stage - 1 - i;
        // Complementary bands: the outgoing copy is gone by the midpoint,
        // where the incoming copy starts, so two names never overlap.
        const shown = Math.round(
          Math.min(band(rel, -0.5, -0.12), 1 - band(rel, 0.12, 0.5)) * 1000,
        ) / 1000;
        if (shown === lastBeat[i]) return;
        lastBeat[i] = shown;
        const hidden = 1 - shown;
        const vis = shown > 0.01 ? "visible" : "hidden";

        const name = nameRefs.current[i];
        if (name) {
          // The name slides against the product, the way the reference does.
          name.style.opacity = String(shown);
          name.style.transform = `translate3d(${hidden * (rel > 0 ? -90 : 90)}px, 0, 0)`;
          name.style.visibility = vis;
        }
        const para = paraRefs.current[i];
        if (para) {
          para.style.opacity = String(shown);
          para.style.transform = `translate3d(0, ${hidden * 24}px, 0)`;
          para.style.filter = `blur(${hidden * 7}px)`;
          para.style.visibility = vis;
        }
        const rail = railRefs.current[i];
        if (rail) {
          rail.style.opacity = String(shown);
          rail.style.transform = `translate3d(0, ${hidden * 24}px, 0)`;
          rail.style.filter = `blur(${hidden * 7}px)`;
          rail.style.visibility = vis;
        }
        const decor = decorRefs.current[i];
        if (decor) {
          decor.style.opacity = String(shown);
          decor.style.transform = `scale(${mix(0.88, 1, shown)}) rotate(${hidden * (rel > 0 ? -6 : 6)}deg)`;
          decor.style.visibility = vis;
        }
        const orn = ornRefs.current[i];
        if (orn) {
          orn.style.opacity = String(shown * 0.85);
          orn.style.transform = `translate3d(0, ${hidden * (rel > 0 ? -18 : 18)}px, 0)`;
          orn.style.visibility = vis;
        }
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

        {/* Shape and line marks, behind everything the product sits on. */}
        {FLAVORS.map((flavor, i) => (
          <svg
            key={`decor-${flavor.id}`}
            ref={(el) => {
              decorRefs.current[i] = el;
            }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{ opacity: 0, visibility: "hidden" }}
          >
            <path
              className="md:hidden"
              d={BLOBS[i % BLOBS.length]}
              fill={flavor.pop}
              transform="translate(6.25 25) scale(0.4375 0.2)"
            />
            <path
              className="hidden md:block"
              d={BLOBS[i % BLOBS.length]}
              fill={flavor.pop}
              transform="translate(10.6 17.7) scale(0.27 0.33)"
            />
          </svg>
        ))}

        {/* Line marks keep their own square boxes so the stretched shape
            behind them never squashes the drawing. */}
        {FLAVORS.map((flavor, i) => (
          <div
            key={`orn-${flavor.id}`}
            ref={(el) => {
              ornRefs.current[i] = el;
            }}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden md:block"
            style={{ opacity: 0, visibility: "hidden" }}
          >
            {ORNAMENTS[i % ORNAMENTS.length].map((orn, j) => (
              <svg
                key={j}
                viewBox="0 0 100 100"
                className="absolute h-auto"
                style={{
                  left: `${orn.x}%`,
                  top: `${orn.y}%`,
                  width: `${orn.size}%`,
                  transform: `rotate(${orn.rotate}deg)`,
                }}
              >
                {DOODLES[orn.kind].map((d, k) => (
                  <path
                    key={k}
                    d={d}
                    fill="none"
                    stroke="#0e3b2c"
                    strokeWidth={2.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>
            ))}
          </div>
        ))}

        {/* Flavour name — the product passes in front of it. */}
        {FLAVORS.map((flavor, i) => (
          <div
            key={`name-${flavor.id}`}
            ref={(el) => {
              nameRefs.current[i] = el;
            }}
            className="pointer-events-none absolute inset-x-0 top-[9%] px-6 md:inset-x-auto md:left-[7%] md:top-[31%] md:px-0"
            style={{ opacity: 0, visibility: "hidden" }}
          >
            <h2 className="font-grotesk whitespace-nowrap text-[12vw] font-extrabold leading-[0.9] tracking-[-0.045em] text-forest-deep md:text-[12vw]">
              {flavor.name}
            </h2>
          </div>
        ))}

        <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />

        {/* Blurb, top right. */}
        {FLAVORS.map((flavor, i) => (
          <div
            key={`para-${flavor.id}`}
            ref={(el) => {
              paraRefs.current[i] = el;
            }}
            className="pointer-events-none absolute inset-x-6 top-[17.5%] md:inset-x-auto md:right-[7%] md:top-[21%] md:w-[26%] md:max-w-xs"
            style={{ opacity: 0, visibility: "hidden" }}
          >
            <p className="font-grotesk max-w-[34ch] text-[0.84rem] leading-[1.5] text-forest-deep md:max-w-none md:text-[clamp(0.9rem,1.15vw,1.05rem)]">
              {flavor.tagline}
            </p>
          </div>
        ))}

        {/* Volume and spec rail, bottom left. */}
        {FLAVORS.map((flavor, i) => (
          <div
            key={`rail-${flavor.id}`}
            ref={(el) => {
              railRefs.current[i] = el;
            }}
            className="pointer-events-none absolute bottom-[5%] left-6 w-[62%] max-w-[16rem] md:bottom-[11%] md:left-[7%] md:w-[17%]"
            style={{ opacity: 0, visibility: "hidden" }}
          >
            <p className="font-grotesk text-[1.15rem] font-bold leading-none text-forest-deep md:text-[clamp(1.25rem,2.1vw,1.9rem)]">
              {flavor.specs[0]}
            </p>
            <ul className="mt-3 md:mt-5">
              {flavor.rows.map((row) => (
                <li
                  key={row}
                  className="font-grotesk border-t border-forest-deep/25 py-2 text-[0.78rem] leading-[1.35] text-forest-deep md:py-3 md:text-[clamp(0.78rem,1.05vw,0.95rem)]"
                >
                  {row}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div
          ref={heroRef}
          className="pointer-events-none absolute inset-x-0 top-[15%] px-6 text-center md:top-[16%] md:px-12"
        >
          <p className="font-grotesk mb-5 text-[0.65rem] font-bold uppercase tracking-[0.42em] text-forest/55">
            Sockerfri fruktdryck
          </p>
          <h1 className="font-display mx-auto max-w-4xl text-[clamp(2.6rem,7.5vw,6rem)] leading-[0.92] text-forest">
            Zero Sugar.
            <br />
            Hero Taste.
          </h1>
        </div>

        <div
          ref={hintRef}
          className="font-grotesk pointer-events-none absolute inset-x-0 bottom-8 text-center text-[0.6rem] font-bold uppercase tracking-[0.42em] text-forest/40"
        >
          Scrolla
        </div>
      </div>
    </section>
  );
}
