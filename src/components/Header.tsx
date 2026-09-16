import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#om", label: "Om oss" },
  { href: "#ingredienser", label: "Ingredienser" },
  { href: "#sortiment", label: "Sortiment" },
  { href: "#kop", label: "Köp" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid || open ? "bg-forest/92 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-12">
        <a
          href="#top"
          className={`font-display text-2xl tracking-wide transition-colors duration-500 ${
            solid || open ? "text-cream" : "text-forest"
          }`}
        >
          Lowcaly
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-body text-[0.7rem] font-bold uppercase tracking-[0.22em] transition-colors duration-500 ${
                solid ? "text-cream/70 hover:text-cream" : "text-forest/60 hover:text-forest"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`grid size-9 place-items-center rounded-md transition-colors duration-500 md:hidden ${
            solid || open ? "text-cream" : "text-forest"
          }`}
          aria-label="Öppna meny"
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-cream/10 px-6 pb-5 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-body rounded-lg px-2 py-3 text-xs font-bold uppercase tracking-[0.22em] text-cream/85"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
