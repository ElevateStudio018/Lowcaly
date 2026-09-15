import type { CSSProperties } from "react";
import type { Product } from "../lib/flavors";

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
  return (
    <div className={`relative aspect-[11/20] w-full ${className}`} style={style}>
      <div
        className="absolute left-1/2 top-0 h-[7%] w-[30%] -translate-x-1/2 rounded-t-md"
        style={{ background: "var(--color-forest)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 top-[5%] overflow-hidden rounded-[20px]"
        style={{
          background: `linear-gradient(150deg, rgba(255,255,255,0.65) 0%, ${product.accent} 34%, ${product.accentDeep} 100%)`,
          boxShadow: "0 30px 60px -20px rgba(8,42,31,0.45)",
        }}
      >
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white/40 to-transparent" />
        {showLabel && (
          <div
            className="absolute inset-x-[9%] top-[36%] flex flex-col items-center gap-1.5 rounded-xl py-3"
            style={{ background: "rgba(250, 240, 221, 0.95)" }}
          >
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
