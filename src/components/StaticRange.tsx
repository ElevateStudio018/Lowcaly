import { FLAVORS } from "../lib/flavors";
import { useThumbnails } from "../lib/useThumbnails";
import { ProductShape } from "./ProductShape";

/**
 * Stand-in for the scroll stage when motion is unwanted or WebGL is missing:
 * the same range, laid out as a plain grid with no animation.
 */
export function StaticRange() {
  const { ref, shots } = useThumbnails<HTMLElement>(FLAVORS);

  return (
    <section id="produkter" ref={ref} className="bg-cream px-6 pb-24 pt-32 md:px-12 md:pt-40">
      <div className="mx-auto max-w-6xl">
        <p className="font-body mb-5 text-[0.65rem] font-bold uppercase tracking-[0.42em] text-forest/55">
          Sockerfri fruktdryck
        </p>
        <h1 className="font-display text-[clamp(2.6rem,7.5vw,6rem)] leading-[0.92] text-forest">
          Zero Sugar.
          <br />
          Hero Taste.
        </h1>
        <p className="font-serif mt-6 max-w-md text-lg italic leading-relaxed text-forest/70">
          Fruktig smak, noll tillsatt socker och vitaminer i varje klunk.
        </p>

        <div className="mt-20 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {FLAVORS.map((flavor) => (
            <article key={flavor.id} className="flex flex-col items-center text-center">
              <div
                className="w-full rounded-[1.5rem] px-6 py-6"
                style={{ backgroundColor: flavor.accent }}
              >
                <div className="mx-auto w-40">
                  {shots?.get(flavor.id) ? (
                    <img
                      src={shots.get(flavor.id)}
                      alt={`Lowcaly ${flavor.name}`}
                      width={440}
                      height={760}
                      className="block h-auto w-full"
                    />
                  ) : (
                    <div className="mx-auto w-28 py-6">
                      <ProductShape product={flavor} />
                    </div>
                  )}
                </div>
              </div>
              <h2 className="font-display mt-7 text-3xl text-forest">{flavor.name}</h2>
              <p className="font-serif mt-2 max-w-[22ch] text-sm italic leading-relaxed text-forest/65">
                {flavor.tagline}
              </p>
              <ul className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-forest/45">
                {flavor.specs.map((spec) => (
                  <li key={spec}>{spec}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
