import { Reveal } from "./Reveal";

const FACTS = [
  { value: "0 g", label: "Tillsatt socker" },
  { value: "5 kcal", label: "Per 100 ml" },
  { value: "6–8", label: "Vitaminer per sort" },
];

export function About() {
  return (
    <section id="om" className="bg-cream px-6 py-28 md:px-12 md:py-36">
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-[1.1fr_0.9fr] md:items-end">
        <div>
          <Reveal
            as="p"
            className="font-body mb-6 text-[0.65rem] font-bold uppercase tracking-[0.42em] text-forest/50"
          >
            Om Lowcaly
          </Reveal>
          <Reveal
            as="h2"
            delay={80}
            className="font-display max-w-xl text-[clamp(2.2rem,5.5vw,4rem)] leading-[0.98] text-forest"
          >
            Vi tog bort sockret.
            <br />
            Inte smaken.
          </Reveal>
        </div>

        <Reveal delay={160} className="space-y-5 text-forest/70">
          <p className="font-serif text-xl italic leading-relaxed text-forest/80">
            En fruktdryck ska smaka frukt — inte socker.
          </p>
          <p className="text-[0.95rem] leading-relaxed">
            Lowcaly bygger varje sort på riktig fruktsmak och låter naturliga sötningsmedel
            göra resten. Resultatet är en dryck med under 0,5 g socker per 100 ml, som
            fortfarande smakar som en solmogen frukt och inte som ett kompromissat
            light-alternativ.
          </p>
          <p className="text-[0.95rem] leading-relaxed">
            Varje förpackning är dessutom berikad med vitaminer, så att det enkla valet i
            kylen också blir det bättre.
          </p>
        </Reveal>
      </div>

      <div className="mx-auto mt-20 grid max-w-6xl gap-px overflow-hidden rounded-[2rem] border border-forest/10 bg-forest/10 sm:grid-cols-3">
        {FACTS.map((fact, i) => (
          <Reveal key={fact.label} delay={i * 110} className="bg-cream px-8 py-12 text-center">
            <p className="font-display text-[clamp(2.4rem,6vw,3.6rem)] leading-none text-forest">
              {fact.value}
            </p>
            <p className="font-body mt-4 text-[0.65rem] font-bold uppercase tracking-[0.32em] text-forest/50">
              {fact.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
