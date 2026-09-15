const FOOTER_LINKS = [
  { href: "#om", label: "Om oss" },
  { href: "#tjanster", label: "Tjänster" },
  { href: "#kontakt", label: "Kontakt" },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 px-6 pb-10 pt-4 text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
        <p className="text-sm">
          © {new Date().getFullYear()} Lowcaly. Alla rättigheter förbehållna.
        </p>
        <nav className="flex gap-6">
          {FOOTER_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
