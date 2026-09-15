import { Clock, Lightbulb, LifeBuoy, Sparkles } from "lucide-react";

const SERVICES = [
  {
    icon: Lightbulb,
    title: "Rådgivning",
    text: "Vi lyssnar in era behov och hjälper er hitta rätt lösning innan vi sätter igång.",
  },
  {
    icon: Sparkles,
    title: "Skräddarsydda lösningar",
    text: "Inga färdiga standardpaket — vi anpassar oss efter er verksamhet och era mål.",
  },
  {
    icon: Clock,
    title: "Snabb leverans",
    text: "Vi sätter tydliga tidsramar tillsammans med er och levererar det vi lovar.",
  },
  {
    icon: LifeBuoy,
    title: "Support som finns kvar",
    text: "Efter leverans finns vi kvar och hjälper er löpande när behov uppstår.",
  },
];

export function Services() {
  return (
    <section id="tjanster" className="border-y border-slate-200 bg-slate-50 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Vad vi gör
          </div>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Tjänster anpassade efter er verksamhet
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="mb-4 grid size-10 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Icon className="size-5" />
                </div>
                <h3 className="mb-2 text-base font-bold text-slate-900">{s.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{s.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
