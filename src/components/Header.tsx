import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#om", label: "Om oss" },
  { href: "#tjanster", label: "Tjänster" },
  { href: "#kontakt", label: "Kontakt" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="text-lg font-extrabold tracking-tight text-slate-900">
          Lowcaly<span className="text-indigo-600">.</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#kontakt"
          className="hidden items-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-600 md:inline-flex"
        >
          Kontakta oss
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-lg text-slate-700 md:hidden"
          aria-label="Öppna meny"
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-slate-200 bg-white px-6 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#kontakt"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-lg bg-slate-900 px-3 py-2.5 text-center text-sm font-semibold text-white"
          >
            Kontakta oss
          </a>
        </nav>
      )}
    </header>
  );
}
