import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FLAVORS } from "../lib/flavors";
import { ProductShape } from "./ProductShape";

gsap.registerPlugin(ScrollTrigger);

// Text crossfades in a narrow band around the midpoint of each segment (while
// the product is turned edge-on and least visible), instead of the full
// segment, so outgoing/incoming copy never visibly overlaps.
const TEXT_BAND_START = 0.44;
const TEXT_BAND_WIDTH = 0.08;

function textProgress(t: number) {
  return Math.min(Math.max((t - TEXT_BAND_START) / TEXT_BAND_WIDTH, 0), 1);
}

export function FlavorScroll() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const slides = slideRefs.current;
    const products = productRefs.current;
    const total = FLAVORS.length;
    const segments = total - 1;

    gsap.set(slides[0], { opacity: 1, y: 0 });
    gsap.set(slides.slice(1), { opacity: 0, y: 24 });
    gsap.set(products[0], { rotateY: 0, z: 0, scale: 1 });
    gsap.set(products.slice(1), { rotateY: 65, z: -480, scale: 0.78 });
    if (bgRef.current) bgRef.current.style.backgroundColor = FLAVORS[0].accent;

    const st = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4,
      onUpdate: (self) => {
        const raw = self.progress * segments;
        const index = Math.min(Math.floor(raw), segments - 1);
        const t = raw - index;

        const textT = textProgress(t);

        slides.forEach((el, i) => {
          if (!el) return;
          if (i === index) {
            el.style.opacity = String(1 - textT);
            el.style.transform = `translateY(${-textT * 14}px) scale(${1 + textT * 0.04})`;
            el.style.filter = `blur(${textT * 5}px)`;
          } else if (i === index + 1) {
            el.style.opacity = String(textT);
            el.style.transform = `translateY(${(1 - textT) * 14}px) scale(${0.97 + textT * 0.03})`;
            el.style.filter = `blur(${(1 - textT) * 5}px)`;
          } else {
            el.style.opacity = "0";
          }
        });

        products.forEach((el, i) => {
          if (!el) return;
          if (i === index) {
            gsap.set(el, { rotateY: -t * 65, z: -t * 480, scale: 1 - t * 0.22 });
          } else if (i === index + 1) {
            gsap.set(el, { rotateY: 65 - t * 65, z: -480 + t * 480, scale: 0.78 + t * 0.22 });
          } else {
            gsap.set(el, { rotateY: 65, z: -480, scale: 0.78 });
          }
        });

        if (bgRef.current) {
          bgRef.current.style.backgroundColor = gsap.utils.interpolate(
            FLAVORS[index].accent,
            FLAVORS[index + 1].accent,
            t,
          ) as string;
        }

        dotRefs.current.forEach((d, i) => {
          if (!d) return;
          const active = i === index ? t < 0.5 : i === index + 1 ? t >= 0.5 : false;
          d.style.width = active ? "2rem" : "0.75rem";
          d.style.opacity = active ? "1" : "0.35";
        });
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section id="produkter" ref={wrapperRef} className="relative" style={{ height: `${FLAVORS.length * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ perspective: "1600px" }}>
        <div ref={bgRef} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.35),transparent_55%)]" />

        {FLAVORS.map((f, i) => (
          <div
            key={f.id}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-10 px-6 md:flex-row md:gap-24"
          >
            <div
              ref={(el) => {
                productRefs.current[i] = el;
              }}
              className="w-[46vw] max-w-[220px]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <ProductShape product={f} />
            </div>
            <div className="max-w-sm text-center md:text-left">
              <p className="font-body mb-3 text-xs font-bold uppercase tracking-[0.3em] text-forest/60">
                {String(i + 1).padStart(2, "0")} / {String(FLAVORS.length).padStart(2, "0")}
              </p>
              <h3 className="font-display text-5xl text-forest md:text-6xl">{f.name}</h3>
              <p className="font-serif mt-4 text-lg italic text-forest/75">{f.tagline}</p>
              <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold uppercase tracking-wide text-forest/60 md:justify-start">
                {f.specs.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          {FLAVORS.map((f, i) => (
            <div
              key={f.id}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              className="h-1.5 w-3 rounded-full bg-forest opacity-35 transition-[width,opacity] duration-200"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
