# Riktiga produktbilder

Lägg en bild per smak här, så använder sajten den i stället för den
ritade 3D-kartongen — både i scrollscenen och i sortimentsrutnätet.
Ingen kodändring behövs.

## Filnamn

Filen måste heta exakt samma sak som produktens `id` i `src/lib/flavors.ts`:

| Fil | Produkt |
| --- | --- |
| `cherry.png` | Cherry, 1 L |
| `mixed-berry.png` | Mixed Berry, 1 L |
| `pear.png` | Pear, 1 L |
| `white-peach.png` | White Peach, 1 L |
| `strawberry.png` | Strawberry, 1 L |
| `mango.png` | Mango, 1 L |
| `apples-pear.png` | Apples & Pear, 500 ml |
| `tropical-bliss.png` | Tropical Bliss, 500 ml |
| `sunny-orange.png` | Sunny Orange, 500 ml |

`.png` eller `.webp` fungerar båda. Du behöver inte lägga in alla nio —
de smaker som saknar bild fortsätter använda 3D-kartongen.

## Krav på bilderna

- **Genomskinlig bakgrund.** Sidans bakgrundsfärg byts under scrollen, så
  en vit bakgrund syns som en vit ruta runt paketet.
- **Rakt framifrån, upprätt.** Scenen lutar och roterar paketet själv.
- **Beskuret tätt** runt paketet, utan luft i kanterna — scenen skalar
  utifrån bildens höjd.
- **Ca 900 × 2000 px** räcker. Större än 1400 px bredd är bortkastat.
- Håll varje fil under ~400 kB, annars blir sidan tung.

Bilderna ligger i git som vanliga filer — committa dem som vilken annan
resurs som helst.
