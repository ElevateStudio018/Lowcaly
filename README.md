# Lowcaly — hemsida

En ny, fristående hemsida byggd med Vite, React, TypeScript och Tailwind CSS.
Det mesta av textinnehållet (texter, kontaktuppgifter, statistik) är
platshållare som du byter ut mot er riktiga information.

## Kom igång

```bash
bun install
bun run dev
```

Sidan körs på http://localhost:5173.

## Bygg för produktion

```bash
bun run build
```

Den byggda sajten hamnar i `dist/` och kan driftsättas på t.ex. Vercel,
Netlify eller Cloudflare Pages.

## Vad du bör byta ut

- **Texter**: `src/components/Hero.tsx`, `About.tsx`, `Services.tsx`.
- **Kontaktuppgifter**: `src/components/Contact.tsx` och `Footer.tsx`.
- **Färger**: Tailwind-klasserna `indigo-*` och `slate-*` i respektive
  komponent.
- **Logotyp**: byt ut textlogotypen i `src/components/Header.tsx` mot en
  bild vid behov.

## Struktur

- `src/components/Header.tsx` – navigering
- `src/components/Hero.tsx` – hero-sektion
- `src/components/Services.tsx` – tjänster
- `src/components/About.tsx` – om oss + statistik
- `src/components/Contact.tsx` – kontaktsektion
- `src/components/Footer.tsx` – sidfot
