import { ChevronDown } from "lucide-react";
import { BOTTLES, FLAVORS } from "../lib/flavors";
import { ProductShape } from "./ProductShape";

const TEASER = [...BOTTLES, ...FLAVORS];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-cream px-6 pb-16 pt-20 text-center">
      <p className="font-body mb-4 text-xs font-bold uppercase tracking-[0.3em] text-forest/70">
        Sockerfri frukt- &amp; frukostdryck
      </p>
      <h1 className="font-display mx-auto max-w-4xl text-6xl leading-[0.92] text-forest md:text-8xl">
        Zero Sugar
        <br />
        Hero Taste
      </h1>
      <p className="font-serif mx-auto mt-6 max-w-xl text-lg italic text-forest/70">
        Fruktig smak, noll tillsatt socker och vitaminer i varje klunk — hela familjen Lowcaly,
        samlad.
      </p>

      <div className="mt-16 flex items-end justify-center overflow-x-auto px-4 pb-6 [&>*]:shrink-0">
        {TEASER.map((p, i) => {
          const tilt = (i % 2 === 0 ? -1 : 1) * (3 + (i % 3) * 3);
          return (
            <div
              key={p.id}
              className="w-[86px] origin-bottom transition-transform duration-500 hover:-translate-y-3 hover:rotate-0 md:w-[104px]"
              style={{ transform: `rotate(${tilt}deg)`, marginLeft: i === 0 ? 0 : "-16px" }}
            >
              <ProductShape product={p} showLabel={false} />
            </div>
          );
        })}
      </div>

      <div className="font-body mt-6 flex flex-col items-center gap-1 text-xs font-bold uppercase tracking-widest text-forest/50">
        Scrolla för att utforska smakerna
        <ChevronDown className="size-4 animate-bounce" />
      </div>
    </section>
  );
}
