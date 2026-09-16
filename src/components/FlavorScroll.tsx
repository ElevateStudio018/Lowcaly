import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FLAVORS } from "../lib/flavors";
import { CartonScene } from "./CartonScene";

gsap.registerPlugin(ScrollTrigger);

// Copy swaps in a narrow band around the midpoint of each step, so two
// flavours' text never sit on screen together.
const TEXT_BAND_START = 0.44;
const TEXT_BAND_WIDTH = 0.08;

function textProgress(t: number) {
  return Math.min(Math.max((t - TEXT_BAND_START) / TEXT_BAND_WIDTH, 0), 1);
}

export function FlavorScroll() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef(0);

  useEffect(() => {
    const slides = slideRefs.current;
    const total = FLAVORS.length;
    const segments = total - 1;

    gsap.set(slides[0], { opacity: 1 });
    gsap.set(slides.slice(1), { opacity: 0 });
    if (bgRef.current) bgRef.current.style.backgroundColor = FLAVORS[0].accent;

    const st = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4,
      onUpdate: (self) => {
        progressRef.current = self.progress;

        const raw = self.progress * segments;
        const index = Math.min(Math.floor(raw), segments - 1);
        const t = raw - index;
        const textT = textProgress(t);

        slides.forEach((el, i) => {
          if (!el) return;
          if (i === index) {
            el.style.opacity = String(1 - textT);
            el.style.transform = `translateY(${-textT * 14}px)`;
          } else if (i === index + 1) {
            el.style.opacity = String(textT);
            el.style.transform = `translateY(${(1 - textT) * 14}px)`;
          } else {
            el.style.opacity = "0";
          }
        });

        if (bgRef.current) {
          bgRef.current.style.backgroundColor = gsap.utils.interpolate(
            FLAVORS[index].accent,
            FLAVORS[index + 1].accent,
            t,
          ) as string;
        }

        dotRefs.current.forEach((dot, i) => {
          if (!dot) return;
          const active = i === index ? t < 0.5 : i === index + 1 ? t >= 0.5 : false;
          dot.style.width = active ? "2rem" : "0.75rem";
          dot.style.opacity = active ? "1" : "0.35";
        });
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section
      id="produkter"
      ref={wrapperRef}
      className="relative"
      style={{ height: `${FLAVORS.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div ref={bgRef} className="absolute inset-0 transition-none" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.45),transparent_60%)]" />

        <CartonScene progressRef={progressRef} />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/10 to-transparent md:hidden" />

        {FLAVORS.map((flavor, i) => (
          <div
            key={flavor.id}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="pointer-events-none absolute inset-x-0 bottom-24 px-6 md:bottom-0 md:top-0 md:flex md:items-center md:px-12"
          >
            <div className="mx-auto w-full max-w-6xl">
              <div className="md:max-w-md">
                <p className="font-body mb-3 text-xs font-bold uppercase tracking-[0.3em] text-forest/55">
                  {String(i + 1).padStart(2, "0")} / {String(FLAVORS.length).padStart(2, "0")}
                </p>
                <h3 className="font-display text-5xl text-forest md:text-7xl">{flavor.name}</h3>
                <p className="font-serif mt-3 text-lg italic text-forest/75">{flavor.tagline}</p>
                <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold uppercase tracking-wide text-forest/55">
                  {flavor.specs.map((spec) => (
                    <li key={spec}>{spec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-2">
          {FLAVORS.map((flavor, i) => (
            <div
              key={flavor.id}
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
