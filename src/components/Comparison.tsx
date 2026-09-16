import { useEffect, useRef, useState } from "react";

interface Stat {
  label: string;
  traditional: number;
  lowcaly: number;
  unit: string;
  lowcalyPrefix?: string;
  decimals?: number;
}

const STATS: Stat[] = [
  {
    label: "Socker per 100 ml",
    traditional: 8,
    lowcaly: 0.5,
    unit: "g",
    lowcalyPrefix: "<",
    decimals: 1,
  },
  {
    label: "Kalorier per 100 ml",
    traditional: 39,
    lowcaly: 5,
    unit: "kcal",
    decimals: 0,
  },
];

function useCountUp(target: number, active: boolean, duration = 1100) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return value;
}

function StatCard({ stat, active }: { stat: Stat; active: boolean }) {
  const traditional = useCountUp(stat.traditional, active);
  const lowcaly = useCountUp(stat.lowcaly, active);
  const decimals = stat.decimals ?? 0;

  return (
    <div className="rounded-3xl border border-forest/10 bg-cream-soft p-8">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="font-body mb-2 text-[0.65rem] font-bold uppercase tracking-widest text-forest/45">
            Traditionell juice
          </p>
          <p className="font-display text-4xl text-forest/35 md:text-5xl">
            {traditional.toFixed(decimals)}
            <span className="text-lg">{stat.unit}</span>
          </p>
        </div>
        <div className="text-center">
          <p className="font-body mb-2 text-[0.65rem] font-bold uppercase tracking-widest text-forest">Lowcaly</p>
          <p className="font-display text-4xl text-forest md:text-5xl">
            {stat.lowcalyPrefix ?? ""}
            {lowcaly.toFixed(decimals)}
            <span className="text-lg">{stat.unit}</span>
          </p>
        </div>
      </div>
      <p className="mt-5 text-center text-sm font-semibold text-forest/60">{stat.label}</p>
    </div>
  );
}

export function Comparison() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="jamfor" ref={ref} className="bg-cream px-6 py-28 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-body mb-3 text-xs font-bold uppercase tracking-widest text-forest/60">
          Varför Lowcaly
        </p>
        <h2 className="font-display text-4xl text-forest md:text-5xl">Samma smak. Noll socker.</h2>
        <p className="font-serif mx-auto mt-4 max-w-lg italic text-forest/70">
          Så mycket mindre socker och kalorier får du jämfört med en vanlig apelsinjuice.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {STATS.map((s) => (
            <StatCard key={s.label} stat={s} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
