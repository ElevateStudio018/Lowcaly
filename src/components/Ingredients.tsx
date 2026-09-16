import { Reveal } from "./Reveal";

const IN = [
  { title: "Riktig fruktsmak", text: "Grunden i varje sort, utan att smaken behöver bäras av socker." },
  { title: "Vitaminer", text: "Sex till åtta vitaminer i varje förpackning, beroende på sort." },
  { title: "Naturliga sötningsmedel", text: "Steviolglykosider från stevia ger sötman utan kalorierna." },
  { title: "Vatten", text: "Rent och enkelt — det som gör drycken lätt att dricka hela dagen." },
];

const OUT = ["Tillsatt socker", "Konserveringsmedel", "Artificiella färgämnen", "Tomma kalorier"];

export function Ingredients() {
  return (
    <section id="ingredienser" className="bg-forest px-6 py-28 text-cream md:px-12 md:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal
          as="p"
          className="font-body mb-6 text-[0.65rem] font-bold uppercase tracking-[0.42em] text-cream/50"
        >
          Ingredienser
        </Reveal>
        <Reveal
          as="h2"
          delay={80}
          className="font-display max-w-2xl text-[clamp(2.2rem,5.5vw,4rem)] leading-[0.98]"
        >
          Kort innehålls&shy;förteckning. Lång smak.
        </Reveal>

        <div className="mt-20 grid gap-16 md:grid-cols-[1.25fr_0.75fr]">
          <div className="grid gap-px overflow-hidden rounded-[1.75rem] bg-cream/10 sm:grid-cols-2">
            {IN.map((item, i) => (
              <Reveal key={item.title} delay={i * 90} className="bg-forest px-7 py-9">
                <p className="font-display text-2xl text-cream">{item.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-cream/60">{item.text}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={140}>
            <p className="font-body mb-6 text-[0.65rem] font-bold uppercase tracking-[0.32em] text-cream/45">
              Det du slipper
            </p>
            <ul className="space-y-4">
              {OUT.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-4 border-b border-cream/10 pb-4 text-lg text-cream/45"
                >
                  <span aria-hidden="true" className="text-lg leading-none text-cream/25">—</span>
                  <span className="line-through decoration-cream/30">{item}</span>
                </li>
              ))}
            </ul>
            <p className="font-serif mt-8 text-lg italic leading-relaxed text-cream/70">
              Allt som inte gör drycken godare har helt enkelt fått gå.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
