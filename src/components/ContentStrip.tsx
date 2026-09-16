const ITEMS = [
  {
    tag: "Recept",
    title: "Morning Smoothie",
    text: "En fruktig start på dagen med jordgubbar, banan och Sunny Orange.",
  },
  {
    tag: "Recept",
    title: "Tropical Cooler",
    text: "Iskall, krämig och lite exotisk — perfekt när det är dags att koppla av.",
  },
  {
    tag: "Artikel",
    title: "Varför noll socker inte betyder noll smak",
    text: "Så jobbar vi för att varje förpackning ska smaka lika mycket frukt som den ser ut.",
  },
];

export function ContentStrip() {
  return (
    <section id="inspiration" className="bg-cream-soft px-6 py-28 md:px-12 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl text-forest md:text-5xl">Recept &amp; inspiration</h2>
          <a
            href="#"
            className="font-body text-sm font-bold uppercase tracking-widest text-forest underline underline-offset-4"
          >
            Se mer inspiration
          </a>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {ITEMS.map((item) => (
            <article key={item.title} className="rounded-3xl bg-cream p-7">
              <p className="font-body mb-3 text-xs font-bold uppercase tracking-widest text-forest/50">
                {item.tag}
              </p>
              <h3 className="font-display text-2xl text-forest">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-forest/70">{item.text}</p>
              <span className="mt-4 inline-block text-sm font-bold text-forest underline underline-offset-4">
                Läs mer →
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
