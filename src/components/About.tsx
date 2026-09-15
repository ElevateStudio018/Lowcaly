const STATS = [
  { value: "10+", label: "års erfarenhet" },
  { value: "500+", label: "nöjda kunder" },
  { value: "100%", label: "levererade i tid" },
];

export function About() {
  return (
    <section id="om" className="px-6 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Om oss
          </div>
          <h2 className="mb-6 text-balance text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Om Lowcaly
          </h2>
          <div className="space-y-4 text-slate-600">
            <p className="text-lg leading-relaxed">
              Vi är ett företag som brinner för att hjälpa våra kunder lyckas. Byt ut den här
              texten mot en kort beskrivning av vad ni gör, vilka ni hjälper och vad som gör er
              annorlunda.
            </p>
            <p className="leading-relaxed">
              Lägg gärna till bakgrund, arbetssätt eller värderingar här — det som gör att en ny
              besökare känner sig trygg med att höra av sig.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center"
            >
              <p className="text-3xl font-extrabold tracking-tight text-slate-900">{s.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
