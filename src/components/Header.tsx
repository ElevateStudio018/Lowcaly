import { useState } from "react";
import { Globe, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#produkter", label: "Produkter" },
  { href: "#jamfor", label: "Zero Sugar" },
  { href: "#inspiration", label: "Inspiration" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50">
      <div className="bg-cream-soft py-2 text-center">
        <p className="font-body text-[0.7rem] font-bold uppercase tracking-[0.25em] text-forest-deep">
          Zero Sugar · Hero Taste
        </p>
      </div>
      <header className="bg-forest">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#top" className="font-display text-2xl tracking-wide text-cream">
            Lowcaly
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-body text-sm font-semibold text-cream/80 transition-colors hover:text-cream"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Globe className="hidden size-4 text-cream/70 md:block" />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid size-9 place-items-center rounded-md text-cream md:hidden"
              aria-label="Öppna meny"
              aria-expanded={open}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="flex flex-col gap-1 border-t border-cream/10 px-6 py-4 md:hidden">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm font-semibold text-cream/90"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>
    </div>
  );
}
