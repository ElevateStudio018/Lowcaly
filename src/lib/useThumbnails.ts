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
  const [done, setDone] = useState(false);

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
        // Only the rendered ones are object URLs; product shots are plain
        // asset URLs and must not be revoked.
        urls = [...map.values()].filter((url) => url.startsWith("blob:"));
        setShots(map);
        setDone(true);
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

  return { ref, shots, done };
}
