import type { CSSProperties } from "react";
import type { Product } from "../lib/flavors";

const BOTTLE_CLIP =
  "polygon(38% 0%, 62% 0%, 62% 7%, 80% 19%, 100% 32%, 100% 100%, 0% 100%, 0% 32%, 20% 19%, 38% 7%)";
const CARTON_CLIP = "polygon(0% 9%, 50% 0%, 100% 9%, 100% 100%, 0% 100%)";

export function ProductShape({
  product,
  showLabel = true,
  className = "",
  style,
}: {
  product: Product;
  showLabel?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const isBottle = product.shape === "bottle";

  return (
    <div className={`relative aspect-[11/20] w-full ${className}`} style={style}>
      {/* ambient, colour-matched contact shadow */}
      <div
        className="absolute inset-x-[14%] bottom-[-5%] h-[14%] rounded-full blur-lg"
        style={{ background: product.accentDeep, opacity: 0.4 }}
      />

      {/* cap */}
      <div
        className={
          isBottle
            ? "absolute left-1/2 top-0 h-[9%] w-[22%] -translate-x-1/2 rounded-[3px_3px_1px_1px]"
            : "absolute left-1/2 top-[-3%] h-[7%] w-[15%] -translate-x-1/2 rounded-[2px]"
        }
        style={{
          background: `linear-gradient(100deg, ${product.accentDeep} 0%, var(--color-forest) 40%, var(--color-forest-deep) 100%)`,
        }}
      >
        <div className="absolute inset-x-[18%] top-[12%] h-[22%] rounded-full bg-white/25" />
      </div>

      {/* body */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: isBottle ? BOTTLE_CLIP : CARTON_CLIP,
          background: `linear-gradient(158deg, rgba(255,255,255,0.9) 0%, ${product.accent} 20%, ${product.accent} 48%, ${product.accentDeep} 90%, ${product.accentDeep} 100%)`,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.3)",
        }}
      >
        {/* specular highlight streak */}
        <div
          className="absolute inset-y-0 left-[13%] w-[10%] rounded-full blur-[3px]"
          style={{ background: "linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,0.05) 70%)" }}
        />
        {/* soft core shadow along the right edge for roundness */}
        <div className="absolute inset-y-0 right-0 w-[20%] bg-gradient-to-l from-black/15 to-transparent" />
        {/* gable fold line for cartons */}
        {!isBottle && <div className="absolute inset-x-0 top-[9%] h-px bg-black/10" />}

        {showLabel && (
          <div
            className="absolute inset-x-[10%] top-[38%] flex flex-col items-center gap-1.5 rounded-2xl py-3.5"
            style={{
              background: "rgba(250, 240, 221, 0.97)",
              boxShadow: "0 6px 16px -6px rgba(8,42,31,0.35)",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-forest/60">
              <path
                d="M12 3c4.2 2.1 7 5.7 7 10a7 7 0 1 1-14 0c0-4.3 2.8-7.9 7-10Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-body text-[0.5rem] font-bold uppercase tracking-[0.25em] text-forest/60">
              Lowcaly
            </span>
            <span className="font-display px-1 text-center text-lg leading-none text-forest md:text-xl">
              {product.name}
            </span>
            <span className="font-body text-[0.45rem] font-semibold uppercase tracking-widest text-forest/50">
              Zero Sugar
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
