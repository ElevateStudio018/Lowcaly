import { useEffect, useRef, useState } from "react";
import type { Product } from "./flavors";
import { renderProductThumbnails } from "./thumbnails";

/**
 * Renders product thumbnails the first time the given element scrolls near the
 * viewport, so the work never competes with the hero for the main thread.
 */
export function useThumbnails<T extends HTMLElement>(products: Product[]) {
  const ref = useRef<T>(null);
  const [shots, setShots] = useState<Map<string, string> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    let urls: string[] = [];

    const start = () => {
      renderProductThumbnails(products).then((map) => {
        if (cancelled) {
          map.forEach((url) => URL.revokeObjectURL(url));
          return;
        }
        urls = [...map.values()];
        setShots(map);
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          start();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [products]);

  return { ref, shots };
}
