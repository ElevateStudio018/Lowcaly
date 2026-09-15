import { Mail, MapPin, Phone } from "lucide-react";

const CONTACT_DETAILS = [
  { icon: Mail, label: "info@lowcaly.se", href: "mailto:info@lowcaly.se" },
  { icon: Phone, label: "010-123 45 67", href: "tel:+46101234567" },
  { icon: MapPin, label: "Stadsgatan 1, 111 22 Stockholm", href: undefined },
];

export function Contact() {
  return (
    <section
      id="kontakt"
      className="rounded-t-[48px] bg-slate-900 px-6 py-24 text-white md:rounded-t-[64px]"
    >
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-400">
          Kontakt
        </div>
        <h2 className="mb-4 text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
          Hör av er så pratar vi vidare
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-slate-300">
          Har ni frågor eller vill veta mer om vad vi kan hjälpa er med? Vi svarar så snart vi
          kan.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {CONTACT_DETAILS.map((c) => {
            const Icon = c.icon;
            const content = (
              <>
                <span className="grid size-10 place-items-center rounded-lg bg-white/10 text-indigo-300">
                  <Icon className="size-4" />
                </span>
                <span className="text-sm font-medium text-white">{c.label}</span>
              </>
            );
            return c.href ? (
              <a
                key={c.label}
                href={c.href}
                className="flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
              >
                {content}
              </a>
            ) : (
              <div
                key={c.label}
                className="flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-6"
              >
                {content}
              </div>
            );
          })}
        </div>

        <a
          href="mailto:info@lowcaly.se"
          className="mt-12 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-slate-900 shadow-xl transition-transform hover:-translate-y-0.5"
        >
          Skicka e-post
        </a>
      </div>
    </section>
  );
}
