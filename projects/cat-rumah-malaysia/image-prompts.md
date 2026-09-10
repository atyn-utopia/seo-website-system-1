# Image prompts — cat-rumah-malaysia

Paste-ready prompts for every image this site still needs, and the exact folder each
finished file goes into.

| | |
|---|---|
| **Fleet rules** | `docs/image-generation-prompts.md` — read once; this file does not repeat it |
| **Design direction** | A — "Kad Warna" (see `design-direction.md` and the hero review artifact) |
| **Public folder budget** | `public/` is at **11 MB** of a 20 MB advisory cap (`public-folder-size`) |
| **This project's layout** | `public/images/{category}/` — **not** `public/{category}/` like the fleet reference |

---

## Where to put finished images

Two folders, and the difference matters.

```
projects/cat-rumah-malaysia/
├── brand_assets/generated/     ← DROP EVERYTHING HERE FIRST (gitignored)
│   └── full-resolution originals, straight out of the generator
│
└── public/images/              ← the web-ready copies, committed
    ├── hero/                   ← NEW folder — hero card photo
    ├── products/               ← the 9 service tiles
    ├── painters/               ← section background photography
    ├── gallery/                ← real customer work — DO NOT GENERATE
    ├── brand/                  ← logo + favicon — already done
    └── paint-brands/           ← Nippon/Jotun/Dulux marks — real trademarks, never generate
```

**Drop the raw generated files in `brand_assets/generated/`.** That folder is
gitignored, so full-resolution originals never bloat the repo. Tell me when they're
there and I'll resize, name and place the web copies into `public/images/`, wire the
alt text in all three locales, and commit.

If you'd rather place them yourself: resize the long edge to the size in the
manifest, keep each file **under 300 KB**, and **never change the file extension** —
a `.jpg` slot stays JPEG, a `.png` slot stays PNG. Re-encoding PNG→JPEG flattens
alpha and has broken live logos in this fleet before.

---

## House style — prepend this block to every prompt below

```
STYLE: Photorealistic interior and architectural photography, natural daylight,
full-frame camera, 35mm or 50mm lens, medium depth of field. Colour-graded clean
and slightly warm. No HDR, no over-sharpening, no lens flare, no vignette.

SETTING: Malaysia. Malaysian residential architecture — terrace and semi-D houses
with window grilles, porches and zinc awnings; condominium interiors with tiled or
laminate floors and sliding balcony doors. Tropical daylight, humid bright-overcast
or late-afternoon light. Where greenery appears: palm, banana, frangipani.

PEOPLE (only where the slot asks): Malaysian — Malay, Chinese and Indian Malaysians.
Working clothes, mid-action, absorbed in the task. Not posed at camera, not smiling
at the lens.

NEGATIVE: no text, no watermark, no logo, no signage in any language, no brand names
on paint tins, no American or European suburbs, no snow, no autumn foliage, no
stock-photo handshake, no thumbs-up, no fake grin, no distorted hands, no extra
fingers, no plastic skin, no AI sheen, no fisheye distortion.
```

Two of those negatives are here for a specific reason. **No text** — a generated
sign or paint-tin label always renders as garbled pseudo-language and is the single
clearest tell that an image is fake. **No brand names** — the site claims Nippon,
Jotun and Dulux; an invented tin that looks almost like a Dulux tin is worse than a
plain one.

---

## Manifest

| # | Slot | File to write | Size | Format | Alt key | Status |
|---|---|---|---|---|---|---|
| 1 | Hero card | `public/images/hero/hero-card.jpg` | 2000×1500 | JPEG | `home.hero.heroAlt` | **needed** |
| 2 | Service tiles ×9 | `public/images/products/*.jpg` | 1600×1200 | JPEG | `products.imageAltTemplate` | **needed** |
| 3 | Reviews band | `public/images/painters/painter-bg.jpg` | 2400×1400 | JPEG | `home.reviews.bgAlt` (new) | **needed** |
| 4 | Final CTA band | `public/images/painters/final-cta.jpg` | 2400×1200 | JPEG | `finalCta.bgAlt` | **needed** |
| 5 | Painter cutout | `public/images/painters/painter-roller.png` | 1400w | PNG + alpha | in JSX | optional |
| — | Customer gallery | `public/images/gallery/job-*.jpg` | — | — | `home.gallery.alts[]` | **do not generate** |
| — | Logo + favicon | `public/images/brand/`, `app/icon.svg` | — | — | `nav.logoAlt` | already done |
| — | Paint brand marks | `public/images/paint-brands/` | — | — | in JSX | never generate |
| — | `public/og-*.png` | — | — | — | — | screenshots, not art |

**On the gallery.** Those 13 watermarked photos are the client's own completed jobs.
They are the only images on the site that prove the work is real, and a generated
"customer job" presented as a real one is a lie told to a buying customer. They stay
as they are. If more are wanted, the client photographs more.

**On `og-*.png`.** Those are 1200×630 screenshots of the live hero, one per locale,
produced by `scripts/og-shot.mjs`. Hand-made ones make the share card disagree with
the page.

---

## 1 · Hero card

The one image the whole page rests on. In direction A it sits in a rounded card on
the right of the hero, on magnolia paper `#F7F4E8`, beside deep blue `#002E8A`
headline type — so it needs to hold its own **as an object**, not as a backdrop.
Nothing sits on top of it, so there is no "keep the left third empty" constraint
here. What it must do is make the product visible, and the product is **colour**.

```
{HOUSE STYLE BLOCK}

SUBJECT: A freshly repainted Malaysian living room. One wall carries a deep,
saturated accent colour — forest green or deep clay — and the adjoining walls and
ceiling are a clean flat white. Sparse furniture: a single armchair, a low side
table, a plant. Laminate or tiled floor. Empty of clutter, recently finished, not
yet lived in.

COMPOSITION: 4:3 landscape. Shot square-on to the accent wall from a low-ish eye
level, so the colour field occupies the left two-thirds of the frame and reads as a
flat plane. Furniture sits small against it. No wide-angle distortion of the corners.

LIGHT: Bright diffuse daylight from an unseen window on the right. Soft shadows,
no hard sun patches on the accent wall — the colour must read true and even.

MOOD: Calm, finished, a room handed back to its owner.
```

→ `public/images/hero/hero-card.jpg` · 2000×1500 · JPEG

Two variations worth generating so there's a choice: one with the accent wall in
**deep forest green**, one in **deep terracotta clay**. Green sits closer to the
site's `#6BAF23` service colour; clay is warmer against magnolia paper. Generate
both, we compare on the real page.

---

## 2 · Service tiles (nine)

Nine services grouped into three colour-coded families. Each tile shows the
**finished result of that specific service** — the current set is generic interior
stock, which is why a bathroom tile is a photograph of a toilet.

Fill `{SUBJECT}` from the table and keep everything else identical, so the nine
tiles read as one set rather than nine unrelated stock photos.

```
{HOUSE STYLE BLOCK}

SUBJECT: {SUBJECT}

COMPOSITION: 4:3 landscape, shot square-on or at a shallow angle. The painted
surface fills most of the frame. One or two pieces of furniture for scale, no more.
No people. No clutter, no styling props, no coffee cups, no open books.

LIGHT: Even diffuse daylight. Flat enough that the wall colour and finish read
accurately across the whole surface.

FINISH: The paint finish itself must be visible — matt, satin or textured as the
subject states. Clean cut-in lines at ceiling, skirting and corners.
```

| File to write | Family | `{SUBJECT}` |
|---|---|---|
| `interior-1.jpg` | Dalaman `#DB3E77` | A repainted living room, plain white walls with one soft grey-blue accent wall, matt finish, clean cut-in line where wall meets ceiling |
| `bedroom-1.jpg` | Dalaman | A repainted bedroom, walls in a muted warm sage, bed against the accent wall, matt finish, calm and low-contrast |
| `kitchen-1.jpg` | Dalaman | A repainted kitchen, walls in a wipeable satin off-white above tiled splashback, cabinets untouched, bright and hard-wearing |
| `bathroom-1.jpg` | Dalaman | A repainted bathroom ceiling and upper walls in anti-fungal white satin above wall tiles, dry and bright — the painted surface is the subject, not the sanitaryware |
| `exterior-1.jpg` | Luar `#1E96DC` | The exterior wall of a Malaysian terrace house freshly painted in warm off-white, window grilles and porch visible, tropical planting at the base |
| `exterior-2.jpg` | Luar | A double-storey Malaysian semi-D exterior in two tones — pale body, darker trim — under bright overcast light, weather-clean render |
| `marble-1.jpg` | Khas `#6BAF23` | An interior feature wall in a marble-effect decorative paint finish, soft grey veining on warm white, satin sheen, one armchair for scale |
| `texture-1.jpg` | Khas | An interior feature wall in a fine concrete-effect texture paint, matt mineral grey, raking light showing the surface grain |
| `decor3d-1.jpg` | Khas | An interior feature wall in a sculpted 3D relief panel finish painted uniform white, geometric or organic pattern, side light casting shallow shadows |

→ all nine to `public/images/products/` · 1600×1200 · JPEG · **keep the exact filenames**

Keeping the filenames means the swap needs no code change — the paths are already
wired in `HomePageClient.tsx`.

> **Flag, separate from this task.** These paths are hardcoded in the page, while
> `CLAUDE.md` requires product data and photos to come from Supabase
> (`products` + `product_photos`). `config/products.ts` also still points 18 image
> URLs at `static.wixstatic.com` — the reference site's CDN, which can disappear
> without notice. Worth its own issue; it does not block generating these.

---

## 3 · Reviews band background

A dark band with reviews on top of it, so the **image is a backdrop and the text
must survive it**. Currently a real painter photo; a generated replacement needs the
same job but cleaner.

```
{HOUSE STYLE BLOCK}

SUBJECT: A Malaysian painter mid-stroke on an interior wall, roller on an extension
pole, seen from behind or in three-quarter profile. Absorbed in the work. Drop
sheets on the floor. No eye contact with camera.

COMPOSITION: Wide 16:9. The painter sits in the RIGHT third. The LEFT half of the
frame is an uncluttered painted wall — an even mid-tone plane with nothing crossing
it, so white text laid over it stays readable.

LIGHT: Soft indoor daylight, slightly underexposed overall — this image sits under a
dark blue overlay and must not fight it.
```

→ `public/images/painters/painter-bg.jpg` · 2400×1400 · JPEG

Needs a new alt key `home.reviews.bgAlt` in `en`/`ms`/`zh` — the
`bg-role-img-aria-label` check is blocking and I'll wire it with the image.

---

## 4 · Final CTA band background

The last thing on the page, text centred over it — so the **centre** must be calm,
the exact inverse of the reviews band.

```
{HOUSE STYLE BLOCK}

SUBJECT: A Malaysian terrace house exterior at late afternoon, freshly painted and
finished. Ladders down, sheets folded, nobody working. Quiet end-of-job mood. No
people, or one figure walking away from camera at the edge of the frame.

COMPOSITION: Wide 2:1. The house sits LOW in the frame and towards the edges. The
CENTRE and upper half are open — sky, or a plain painted wall — so centred white
text sits clear of detail.

LIGHT: Late afternoon, warm low sun, long soft shadows. Rich but not orange-graded.
```

→ `public/images/painters/final-cta.jpg` · 2400×1200 · JPEG · alt key `finalCta.bgAlt` (exists)

Replaces the current final-CTA background, which is `job-84.jpg` — a watermarked
gallery photo with the logo burned into the middle of it, directly behind the
centred headline.

---

## 5 · Painter cutout (optional)

Only needed if the cutout is reused in the revamp. Direction A doesn't use it;
direction B did.

```
{HOUSE STYLE BLOCK}

SUBJECT: A Malaysian painter in clean navy overalls and a cap, holding a paint
roller on an extension pole across one shoulder. Relaxed, confident, three-quarter
turn to camera. Full body from mid-thigh up.

COMPOSITION: Vertical portrait, subject centred, generous margin so nothing is
clipped at the edges. Isolated on a plain flat background for cutting out.

BACKGROUND: Pure white seamless, evenly lit, no shadow cast on the background.
```

→ cut out the background yourself, save with **transparent alpha** →
`public/images/painters/painter-roller.png` · 1400px wide · **PNG, never JPEG**

Saving this one as JPEG puts a white box behind the painter on every coloured
section. It has happened on this project before.

---

## Checklist before these go live

- [ ] Originals in `brand_assets/generated/`, web copies in `public/images/`
- [ ] Every new file under 300 KB, `public/` still under 20 MB
- [ ] Extensions unchanged — `.jpg` slots JPEG, `.png` slots PNG with alpha intact
- [ ] Alt text written in `en`, `ms` **and** `zh` (`alt-keys-all-locales`, blocking)
- [ ] No empty `alt=""` anywhere (`no-empty-img-alt`, blocking)
- [ ] Background images carry `role="img"` + `aria-label` (`bg-role-img-aria-label`, blocking)
- [ ] `public-assets-exist` passes — no path in the code pointing at a missing file
- [ ] Looked at every generated image at full size for garbled text, six-fingered
      hands and melted furniture legs before committing
