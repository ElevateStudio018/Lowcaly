import { Facebook, Instagram, Linkedin, Send } from "lucide-react";

const FOOTER_LINKS = [
  { href: "#om", label: "Om Lowcaly" },
  { href: "#ingredienser", label: "Ingredienser" },
  { href: "#sortiment", label: "Sortiment" },
  { href: "#kop", label: "Var du hittar oss" },
  { href: "#inspiration", label: "Recept" },
];

const SOCIALS = [
  { Icon: Instagram, label: "Instagram" },
  { Icon: Facebook, label: "Facebook" },
  { Icon: Linkedin, label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="bg-forest px-6 pb-12 pt-20 text-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <span className="font-display text-4xl tracking-wide">Lowcaly</span>
        <span className="font-body mt-2 text-xs font-bold uppercase tracking-[0.3em] text-cream/60">
          Zero Sugar · Hero Taste
        </span>

        <div className="mt-12 grid w-full gap-10 border-t border-cream/10 pt-10 md:grid-cols-3 md:items-start md:text-left">
          <div>
            <p className="font-body mb-3 text-xs font-bold uppercase tracking-widest text-cream/60">
              Prenumerera på vårt nyhetsbrev
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2 rounded-full border border-cream/30 bg-cream/5 p-1.5 pl-4"
            >
              <input
                type="email"
                required
                placeholder="namn@email.com"
                className="w-full bg-transparent text-sm text-cream placeholder:text-cream/40 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Prenumerera"
                className="grid size-8 shrink-0 place-items-center rounded-full bg-cream text-forest"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>

          <nav className="flex flex-col gap-2 md:mx-auto">
            {FOOTER_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="font-body text-sm font-semibold text-cream/80 hover:text-cream"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex justify-center gap-4 md:justify-end">
            {SOCIALS.map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="grid size-10 place-items-center rounded-full border border-cream/20 text-cream/80 transition-colors hover:border-cream hover:text-cream"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <p className="mt-12 text-xs text-cream/40">
          © {new Date().getFullYear()} Lowcaly. Alla rättigheter förbehållna.
        </p>
      </div>
    </footer>
  );
}
