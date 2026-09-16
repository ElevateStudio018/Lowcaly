import { BOTTLES, FLAVORS } from "../lib/flavors";
import { useThumbnails } from "../lib/useThumbnails";
import { ProductShape } from "./ProductShape";
import { Reveal } from "./Reveal";

const ALL = [...FLAVORS, ...BOTTLES];

export function ProductGrid() {
  const { ref, shots } = useThumbnails<HTMLElement>(ALL);

  return (
    <section
      id="sortiment"
      ref={ref}
      className="bg-cream-soft px-6 py-28 md:px-12 md:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal
              as="p"
              className="font-body mb-6 text-[0.65rem] font-bold uppercase tracking-[0.42em] text-forest/50"
            >
              Sortimentet
            </Reveal>
            <Reveal
              as="h2"
              delay={80}
              className="font-display text-[clamp(2.2rem,5.5vw,4rem)] leading-[0.98] text-forest"
            >
              Nio sorter. Noll socker.
            </Reveal>
          </div>
          <Reveal
            as="p"
            delay={140}
            className="font-serif max-w-xs text-lg italic leading-relaxed text-forest/65"
          >
            Sex literförpackningar för kylen och tre flaskor för vägen.
          </Reveal>
        </div>

        <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {ALL.map((product, i) => (
            <Reveal
              key={product.id}
              delay={(i % 3) * 90}
              className="group flex flex-col items-center rounded-[1.75rem] px-6 pb-8 pt-10 text-center transition-colors duration-500"
            >
              <div
                className="w-full rounded-[1.5rem] px-6 py-6 transition-transform duration-700 ease-out group-hover:-translate-y-2"
                style={{ backgroundColor: product.accent }}
              >
                <div className="mx-auto w-40">
                  {shots?.get(product.id) ? (
                    <img
                      src={shots.get(product.id)}
                      alt={`Lowcaly ${product.name}`}
                      width={440}
                      height={760}
                      className="block h-auto w-full"
                    />
                  ) : (
                    <div className="mx-auto w-28 py-6">
                      <ProductShape product={product} />
                    </div>
                  )}
                </div>
              </div>
              <h3 className="font-display mt-7 text-3xl text-forest">{product.name}</h3>
              <p className="font-serif mt-2 max-w-[22ch] text-sm italic leading-relaxed text-forest/65">
                {product.tagline}
              </p>
              <ul className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-forest/45">
                {product.specs.map((spec) => (
                  <li key={spec}>{spec}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
