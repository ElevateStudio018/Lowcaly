import { Reveal } from "./Reveal";

const STORES = ["ICA", "Coop", "Willys", "Hemköp", "City Gross", "Mathem"];

export function WhereToBuy() {
  return (
    <section id="kop" className="bg-cream px-6 py-28 md:px-12 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <Reveal
              as="p"
              className="font-body mb-6 text-[0.65rem] font-bold uppercase tracking-[0.42em] text-forest/50"
            >
              Var du hittar oss
            </Reveal>
            <Reveal
              as="h2"
              delay={80}
              className="font-display text-[clamp(2.2rem,5.5vw,4rem)] leading-[0.98] text-forest"
            >
              I kylen, nära dig.
            </Reveal>
            <Reveal as="p" delay={140} className="mt-6 max-w-sm leading-relaxed text-forest/70">
              Lowcaly finns i kyldisken hos de flesta större livsmedelskedjor i Sverige — och
              hemlevererat om du hellre stannar kvar i soffan.
            </Reveal>
            <Reveal delay={200}>
              <a
                href="#sortiment"
                className="font-body mt-9 inline-flex items-center gap-3 rounded-full bg-forest px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-cream transition-transform duration-300 hover:-translate-y-0.5"
              >
                Se hela sortimentet
              </a>
            </Reveal>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[1.75rem] border border-forest/10 bg-forest/10 sm:grid-cols-3">
            {STORES.map((store, i) => (
              <Reveal
                key={store}
                delay={(i % 3) * 80}
                className="flex items-center justify-center bg-cream px-6 py-10"
              >
                <span className="font-display text-xl tracking-wide text-forest/70">{store}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
