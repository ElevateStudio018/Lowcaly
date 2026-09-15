import { ArrowRight, Clock, HeartHandshake, ShieldCheck } from "lucide-react";

const VALUE_PROPS = [
  { icon: ShieldCheck, label: "Hög kvalitet i varje steg" },
  { icon: Clock, label: "Vi håller det vi lovar" },
  { icon: HeartHandshake, label: "Personlig kontakt hela vägen" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pb-20 pt-28 md:pt-36">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#e0e7ff,transparent_60%)]" />
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Er bransch · Er ort
        </p>
        <h1 className="mb-8 text-balance text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-900 md:text-6xl">
          Vi hjälper er verksamhet att växa
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-slate-600">
          En tydlig, snabb och professionell hemsida som visar vad ni gör, varför kunder ska
          välja er och hur de enkelt kommer i kontakt.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#kontakt"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-4 font-bold text-white shadow-lg shadow-slate-900/10 transition-transform hover:-translate-y-0.5"
          >
            Kontakta oss <ArrowRight className="size-4" />
          </a>
          <a
            href="#tjanster"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-4 font-bold text-slate-900 transition-colors hover:bg-slate-50"
          >
            Se vad vi gör
          </a>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl gap-4 sm:grid-cols-3">
          {VALUE_PROPS.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.label}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/60 p-4 text-left"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Icon className="size-4" />
                </span>
                <span className="text-sm font-medium text-slate-700">{v.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
