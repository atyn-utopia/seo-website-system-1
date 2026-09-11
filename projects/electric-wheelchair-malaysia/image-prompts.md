# Image prompts — electric-wheelchair-malaysia

Paste-ready prompts for every image the homepage revamp needs, and the exact folder
each finished file goes into.

| | |
|---|---|
| **Fleet rules** | `docs/image-generation-prompts.md` — read once; this file does not repeat it |
| **Design direction** | J — H's annotated hero + G's product display (see the revamp review artifact) |
| **This project's layout** | `public/brand/`, `public/products/`, `public/gallery/` — the `water-tank-malaysia` reference layout |
| **Current state of `public/`** | only `og-en.png`, `og-ms.png`, `og-zh.png`. Every folder below is new. |
| **Who generates** | the client, from these prompts. We resize, place, wire alt text and register the product rows. |

---

## Where to put finished images

Two folders, and the difference matters.

```
projects/electric-wheelchair-malaysia/
├── brand_assets/generated/     ← DROP EVERYTHING HERE FIRST (gitignored)
│   └── full-resolution originals, straight out of the generator
│
└── public/                     ← the web-ready copies, committed
    ├── brand/                  ← NEW — section backgrounds + the three process photos
    ├── products/               ← NEW — the chair, unfolded and folded
    ├── gallery/                ← NEW — real customer jobs, DO NOT GENERATE (see below)
    └── og-*.png                ← screenshots of the live hero, never generated
```

**Drop the raw generated files in `brand_assets/generated/`.** That folder is
gitignored (see `.gitignore`), so full-resolution originals never bloat the repo.
Say when they're there and we resize, name and place the web copies, wire the alt
text in `en`, `ms` and `zh`, and register the two product photos in webcore.

If you'd rather place them yourself: resize the long edge to the size in the
manifest and keep each file **under 300 KB**. **Photographs** (steps, backgrounds,
gallery, the daily-life set) are stored as **WebP** at quality 82 — approved on
11 Sep 2026, cutting `public/` from 16 MB to under 4 MB. **Cutouts and logos**
(`public/products/`, `public/brand/logo-*.png`) stay **PNG**: re-encoding them
flattens alpha and has broken live logos in this fleet before (`CLAUDE.md`,
Images). Deliver originals as PNG either way; the conversion happens here.

---

## House style — prepend this block to every prompt below

```
STYLE: Photorealistic editorial photography, natural daylight, shot on a
full-frame camera with a 35mm or 50mm lens, shallow-to-medium depth of field.
Colour-graded warm and slightly desaturated. No HDR, no over-sharpening, no
lens flare, no vignette.

SETTING: Malaysia. Tropical daylight, humid haze, dense green vegetation
(palm, banana, rain tree). Malaysian residential architecture — terrace houses
with window grilles, porch tiles and zinc awnings. Overcast-bright or
late-afternoon light.

PEOPLE (only where the slot asks): Malaysian — Malay, Chinese and Indian
Malaysians. Ordinary clothes, mid-action, absorbed in the task. Never posed at
camera, never smiling at the lens, faces turned away or out of frame.

VEHICLES (only where the slot asks): RIGHT-HAND DRIVE — steering wheel on the
right, traffic on the LEFT side of the road.

NEGATIVE: no text, no watermark, no logo, no signage in any language, no
readable number plate, no brand badges, no American or European suburbs, no
snow, no autumn foliage, no left-hand-drive vehicle, no US road markings, no
stock-photo handshake, no thumbs-up, no fake grin, no distorted hands, no
extra fingers, no plastic skin, no AI sheen, no fisheye distortion.
```

Three of those negatives matter more than the rest on this site. **No text** — a
generated sign or screen renders as garbled pseudo-language and is the clearest tell
an image is fake. **No faces at camera** — every person in these slots is
illustrating a process, not testifying, and the difference has to stay visible.
**Right-hand drive** — a left-hand-drive van in a Malaysian street reads as foreign
stock to the actual customer.

---

## Manifest

| # | Slot | File to write | Size | Format | Alt key | Status |
|---|---|---|---|---|---|---|
| 1 | Chair, unfolded | `public/products/electric-wheelchair.png` | 1600×1200 | PNG | `product_photos.alt_text` | **needed** |
| 2 | Chair, folded | `public/products/electric-wheelchair-folded.png` | 1600×1200 | PNG | `product_photos.alt_text` | **needed** |
| 3 | Step 1, before 2pm | `public/brand/step-1.webp` | 1600×1200 | WebP | `howItWorks.steps.0.imageAlt` (new) | **needed** |
| 4 | Step 2, within the hour | `public/brand/step-2.webp` | 1600×1200 | WebP | `howItWorks.steps.1.imageAlt` (new) | **needed** |
| 5 | Step 3, same evening | `public/brand/step-3.webp` | 1600×1200 | WebP | `howItWorks.steps.2.imageAlt` (new) | **needed** |
| 6 | Reviews band texture | `public/brand/reviews-bg.webp` | 2000×1200 | WebP | `reviews.bgAlt` (new) | **needed** |
| 7 | Final CTA background | `public/brand/final-cta.webp` | 2400×1200 | WebP | `finalCta.bgAlt` (exists) | **needed** |
| 8 | Folded in a car boot | `public/brand/context-boot.png` | 2000×1333 | PNG | `products.contextAlt` (new) | optional |
| 9–18 | Daily life ×10 | `public/brand/life-{1..10}.png` | 1600×1200 | PNG | `dailyLife.alts[]` + `dailyLife.captions[]` (new) | **needed** — see below |
| — | Customer gallery | `public/gallery/*.webp` | — | — | `gallery.alts[]` | **do not generate** |
| — | Logo + favicon | `app/icon.svg`, `public/brand/` | — | — | `nav.logoAlt` | client supplied |
| — | `public/og-*.png` | — | — | — | — | screenshots, not art |

Every new alt key needs a value in **all three** locales (`messages/en.json`,
`ms.json`, `zh.json`). `finalCta.bgAlt` already exists in all three and
`final-cta-bg-alt` is a blocking wizard check that reads `ms.json`.

### On the customer gallery — do not generate replacements

The gallery photos are the client's own completed jobs: a handover at a customer's
home, a driving lesson at a green-walled porch, a hand on the joystick. They are the
only images on the site that prove any of this happened, and they sit directly under
a 4.9 Google rating with named reviewers. **Generated people in that grid is
fabricated evidence** — it is the one image decision on this site that could
genuinely hurt the business, and no amount of photographic polish is worth it.

They currently carry the old Wix watermark and are **hotlinked from
`static.wixstatic.com` at 2.6–5.8 MB each**. The revamp pulls them local into
`public/gallery/` at a sane size. Clean, unwatermarked originals from the client
would improve them more than any generated image could; ask for those instead.

Reviews stay text-only for the same reason.

### On the product photos — files alone are not enough

`CLAUDE.md` (Dynamic Product Data) requires product imagery to come from
`product_photos.url`, not a hardcoded path. So slots 1 and 2 are a two-step job:
commit the file to `public/products/`, then register its public URL as a
`product_photos` row against the existing product in webcore, with `alt_text` set.
A file dropped in `public/` that nobody registers will not appear on the site.

---

## 1 · The chair, unfolded

**Appears:** the annotated hero — the four callout lines point at this photo — and
the main product photo further down. The callouts name the **reclining backrest**,
**folds for the car boot**, **joystick control** and **6-month warranty**, so the
backrest, the joystick on the right armrest and both wheels must all be visible in
this one view, or the labels point at nothing.

```
{HOUSE STYLE BLOCK}

Photorealistic studio product photograph of a single foldable lightweight
electric wheelchair.

THE CHAIR: black tubular aluminium frame with orange accents, padded black
seat, reclining backrest, two large rear drive wheels, two small front
castors, footplates down, a small joystick controller on the right armrest.
The complete chair, nothing cropped.

VIEW: three-quarter view from the front left, camera at seat height, so the
seat, the joystick on the right armrest, the backrest and both wheels are all
clearly visible.

BACKGROUND: pure white seamless studio background, product isolated, soft
contact shadow under the wheels only.

LIGHT: large softbox top left, soft fill from the right, even exposure, no
blown highlights on the frame, no harsh reflections.

FORMAT: 4:3, 1600x1200, sharp front to back.

NEGATIVE: no people, no room, no furniture, no props, no text, no logo, no
watermark, no brand badge, no floor pattern, no studio gear in shot, no
vignette, no HDR look, no plastic sheen.
```

→ `public/products/electric-wheelchair.png` · 1600×1200 · PNG · register in webcore

---

## 2 · The chair, folded

**Appears:** the second thumbnail under the product photo — tapping it swaps the
main image. This is the proof behind the spec row "folds for the car boot and for
travel", so it has to be obviously the *same chair* as slot 1: same frame, same
colours, same lighting.

```
{HOUSE STYLE BLOCK}

Photorealistic studio product photograph of the same foldable lightweight
electric wheelchair, now FULLY FOLDED — seat collapsed, backrest folded down,
frame closed flat — standing upright on its own wheels, the way it would be
wheeled to a car boot.

VIEW: straight side view, camera at chair height, whole object in frame.

BACKGROUND: pure white seamless studio background, isolated, soft contact
shadow under the wheels only.

LIGHT: identical to the unfolded shot — large softbox top left, soft fill from
the right, even exposure.

FORMAT: 4:3, 1600x1200.

NEGATIVE: no people, no room, no props, no text, no logo, no watermark, no
floor pattern, no studio gear, no vignette.
```

→ `public/products/electric-wheelchair-folded.png` · 1600×1200 · PNG · register in webcore

---

## 3 · Step 1 — "before 2pm"

**Appears:** first of the three photo cards in the delivery section, under a mono
chip reading *before 2pm*. Process illustration — never caption it as a customer.

```
{HOUSE STYLE BLOCK}

SUBJECT: An adult Malaysian woman's hands holding a phone, seen from over her
shoulder, sitting at a dining table in an ordinary Malaysian terrace house. The
phone screen is DARK and unreadable, turned slightly away from camera. Her face
is out of frame.

SETTING: Malaysian home interior — tiled floor, window grilles, soft daylight
from a window, a little everyday clutter on the table.

COMPOSITION: 4:3, 1600x1200, medium-close crop.

LIGHT: soft window daylight, overcast-bright, no hotspots.

NEGATIVE: no readable screen content, no app interface, no text, no logo, no
watermark, no face at camera, no posed smile, no distorted hands, no extra
fingers, no American or European interior, no stock-photo look.
```

→ `public/brand/step-1.png` · 1600×1200 · PNG · alt `howItWorks.steps.0.imageAlt`

---

## 4 · Step 2 — "within the hour"

**Appears:** second photo card, chip *within the hour*.

```
{HOUSE STYLE BLOCK}

SUBJECT: A Malaysian technician's hands checking an electric wheelchair before
delivery — one hand on the battery pack under the seat, the other steadying the
frame. Close crop on the hands and the chair. Face out of frame or turned away.

SETTING: a small Malaysian workshop or store room — plain painted wall, concrete
floor, a folded second chair leaning in the background, tools on a bench, no
signage.

COMPOSITION: 4:3, 1600x1200.

LIGHT: flat even daylight from a roller shutter door, no harsh shadows.

NEGATIVE: no text, no logo, no watermark, no brand badge, no face at camera, no
posed thumbs-up, no distorted hands, no extra fingers, no Western workshop, no
sparks, no dramatic lighting.
```

→ `public/brand/step-2.png` · 1600×1200 · PNG · alt `howItWorks.steps.1.imageAlt`

---

## 5 · Step 3 — "same evening"

**Appears:** third photo card, chip *same evening*. This is the one that has to feel
like a real delivery, so it carries the most weight of the three.

```
{HOUSE STYLE BLOCK}

SUBJECT: A delivery technician wheeling an unfolded electric wheelchair up the
driveway of a Malaysian terrace house towards the porch. Seen from behind and to
the side — no faces towards camera. A small van is parked at the kerb, out of
focus.

SETTING: Malaysian residential street — terrace houses with window grilles and
porch tiles, potted plants, a rain tree, overhead cables. Right-hand drive van,
traffic on the left side of the road.

COMPOSITION: 4:3, 1600x1200.

LIGHT: late afternoon golden light, long soft shadows.

NEGATIVE: no readable number plate, no text, no logo, no watermark, no signage
in any language, no face at camera, no posed handshake, no thumbs-up, no
left-hand-drive vehicle, no US road markings, no snow.
```

→ `public/brand/step-3.png` · 1600×1200 · PNG · alt `howItWorks.steps.2.imageAlt`

---

## 6 · Reviews band texture

**Appears:** behind the reviews band at about **10% opacity**. It is texture, not a
subject — if you can tell what it is at a glance, it is too strong and the quotes
stop being readable.

```
{HOUSE STYLE BLOCK}

SUBJECT: An empty electric wheelchair at rest on the tiled porch of a Malaysian
terrace house, seen at a distance, small in the frame. No people.

COMPOSITION: 5:3, 2000x1200, wide. Deliberately LOW CONTRAST and low detail —
this sits at 10% opacity behind text and must never compete with it. Think
texture and tone, not subject. Plenty of empty tiled floor and plain wall.

LIGHT: flat, even, overcast. No hotspots, no strong shadows.

NEGATIVE: no people, no text, no logo, no watermark, no signage, no strong
colours, no sharp focal point, no sun flare.
```

→ `public/brand/reviews-bg.png` · 2000×1200 · PNG · alt `reviews.bgAlt`

---

## 7 · Final CTA background

**Appears:** behind the closing "Get your electric wheelchair today" band, under a
dark navy overlay. The headline and the WhatsApp button sit dead centre, so **the
centre of the frame must be empty** — this is the most common failure in this slot
and no build step will warn about it.

```
{HOUSE STYLE BLOCK}

SUBJECT: An electric wheelchair parked on the porch of a Malaysian terrace house
at dusk, finished and in place. Quiet, resolved, end-of-day mood. No people, or
one person walking away from camera in the far background.

COMPOSITION: wide 2:1, 2400x1200. The chair sits LOW and to one SIDE of the
frame. The CENTRE is open and uncluttered — plain wall, dusk sky or floor tiles
— so centred white text sits clear of any detail.

LIGHT: blue hour, deep shadows, one warm porch light just switched on. Overall
exposure DARK — this image is used under a heavy ink overlay, so a bright
original turns muddy grey.

NEGATIVE: no people facing camera, no text, no logo, no watermark, no signage,
no readable number plate, no bright sky, no HDR, no lens flare.
```

→ `public/brand/final-cta.png` · 2400×1200 · PNG · alt `finalCta.bgAlt` (already in all three locales)

---

## 8 · Folded in a car boot — optional

**Appears:** supporting image beside the spec list, next to the "folds for the car
boot and for travel" row. Families ask *will it fit in my car?* more than almost
anything else, so this earns its place if there is budget for a ninth generation.

```
{HOUSE STYLE BLOCK}

SUBJECT: A folded electric wheelchair sitting inside the open boot of an ordinary
Malaysian family car (compact MPV or hatchback), boot lid raised. The chair fits
with room to spare. No people, or just a hand resting on the boot lid.

SETTING: the driveway of a Malaysian terrace house, porch tiles and window
grilles softly out of focus behind, tropical greenery.

COMPOSITION: 3:2, 2000x1333.

LIGHT: overcast-bright daylight, soft even light inside the boot, no flash.

NEGATIVE: no readable number plate, no car brand badge, no text, no logo, no
watermark, no faces, no left-hand-drive interior, no showroom, no American
parking lot.
```

→ `public/brand/context-boot.png` · 2000×1333 · PNG · alt `products.contextAlt`

---

## 9–18 · The chair in daily life — ten images for a NEW section

**Why this exists.** The client asked for ten more gallery images. The only gallery
on the page is "From our own deliveries", which is the proof section and keeps its
six real photos (see above). So the ten new images get **their own section**,
placed after the delivery gallery and before Locations, with an honest label:

> eyebrow *Everyday use* · h3 **The chair in daily life** · p *Where a foldable
> electric wheelchair goes once it's yours.*

Rules that make this section safe to ship:

- **No faces towards camera, no one posed as a customer.** A person may appear
  from behind, from the shoulders down, or as hands — the subject is the chair in
  a place, never a testimonial.
- **No logo, no watermark, no text.** A logo on a generated image says "we took
  this"; the honest label above says what the images are, and that is enough.
- **Ten images, columns that divide ten.** Two columns on phones, five on desktop
  (`CLAUDE.md`: a gallery grid never leaves a blank slot). Not three.
- **Same chair as slots 1–2** — black frame, orange accents — so the section
  matches the product photos.
- Alt keys `dailyLife.alts[0..9]` and captions `dailyLife.captions[0..9]` in all
  three locales; captions are two or three words in mono, like the delivery
  gallery.

Each prompt below takes the house style block first. Format for all ten:
**4:3, 1600×1200, PNG**, to `public/brand/life-N.png`.

### 9 · Condo lift lobby
```
{HOUSE STYLE BLOCK}
SUBJECT: A black foldable electric wheelchair with orange accents parked beside
the lift doors in a Malaysian condominium lobby. Empty — no people. Polished
tiled floor, a potted plant, brushed-steel lift doors, a notice board with no
readable text. COMPOSITION: 4:3, chair in the right half, lift doors behind.
LIGHT: cool even lobby light mixed with daylight from the entrance.
NEGATIVE: no people, no readable signage, no text, no logo, no watermark.
```
→ `public/brand/life-1.png` · caption *condo lobby*

### 10 · Terrace-house porch
```
{HOUSE STYLE BLOCK}
SUBJECT: The same electric wheelchair on the tiled porch of a Malaysian terrace
house, parked beside the front door, a pair of sandals on the step, potted
plants, window grilles. Empty. COMPOSITION: 4:3, chair left of centre, door and
grilles behind. LIGHT: soft morning daylight under the porch roof.
NEGATIVE: no people, no house number, no text, no logo, no watermark.
```
→ `public/brand/life-2.png` · caption *front porch*

### 11 · Park path
```
{HOUSE STYLE BLOCK}
SUBJECT: An elderly Malaysian man seen from BEHIND, seated in the electric
wheelchair, driving along a paved path in a Malaysian public park under rain
trees, a lake or open lawn ahead. Back of head and shoulders only. COMPOSITION:
4:3, chair and rider in the lower centre moving away from camera, path leading
into the frame. LIGHT: late afternoon, long soft shadows.
NEGATIVE: no face, no one turned to camera, no text, no logo, no watermark, no
park signage.
```
→ `public/brand/life-3.png` · caption *evening walk*

### 12 · Clinic ramp
```
{HOUSE STYLE BLOCK}
SUBJECT: The electric wheelchair at the foot of a concrete access ramp with a
steel handrail at the entrance of a Malaysian clinic or community building.
Empty. Plain painted wall, glass door reflecting greenery. COMPOSITION: 4:3,
ramp rising from left to right, chair at its base. LIGHT: overcast-bright.
NEGATIVE: no people, no signage, no text, no logo, no watermark, no medical
symbols.
```
→ `public/brand/life-4.png` · caption *clinic ramp*

### 13 · Shoplot five-foot way
```
{HOUSE STYLE BLOCK}
SUBJECT: A Malaysian woman seen from the shoulders down, seated in the electric
wheelchair, moving along the covered five-foot walkway (kaki lima) of a row of
old shoplots — tiled floor, square columns, a bicycle leaning on a pillar. Her
hand rests on the joystick. COMPOSITION: 4:3, walkway receding, chair in the
left third. LIGHT: dappled morning light between the columns.
NEGATIVE: no face, no shop signage, no text, no logo, no watermark.
```
→ `public/brand/life-5.png` · caption *morning errands*

### 14 · Apartment balcony
```
{HOUSE STYLE BLOCK}
SUBJECT: The electric wheelchair parked on a small apartment balcony with a
railing, a folding chair and a few plants, a Malaysian city skyline soft and
out of focus beyond. Empty. COMPOSITION: 4:3, chair in the right half, railing
and skyline behind. LIGHT: golden hour.
NEGATIVE: no people, no recognisable landmark, no text, no logo, no watermark.
```
→ `public/brand/life-6.png` · caption *balcony*

### 15 · Charging at home
```
{HOUSE STYLE BLOCK}
SUBJECT: Close crop of the electric wheelchair's battery pack on charge beside
a wall socket on a tiled living-room floor, the charger's small indicator light
on, the chair's rear wheel in the background. Malaysian home interior, rattan
furniture edge. COMPOSITION: 4:3, battery and cable in the lower left, wheel
softly out of focus behind. LIGHT: soft window daylight.
NEGATIVE: no people, no text on the charger, no logo, no watermark.
```
→ `public/brand/life-7.png` · caption *charging overnight*

### 16 · Lifting it into the car
```
{HOUSE STYLE BLOCK}
SUBJECT: A pair of hands lifting the FOLDED electric wheelchair into the open
boot of a Malaysian compact MPV, in the driveway of a terrace house. Hands and
forearms only. COMPOSITION: 4:3, folded chair mid-lift at the boot sill, house
and greenery soft behind. LIGHT: overcast-bright.
NEGATIVE: no face, no readable number plate, no car badge, no text, no logo, no
watermark, no left-hand-drive interior.
```
→ `public/brand/life-8.png` · caption *into the boot*

### 17 · Rain on the porch
```
{HOUSE STYLE BLOCK}
SUBJECT: The electric wheelchair parked under a Malaysian porch roof during an
afternoon rain shower — wet tiles reflecting light, rain streaking beyond the
roof edge, a folded umbrella against the wall. Empty. COMPOSITION: 4:3, chair
dry under the roof in the centre, rain visible at the right edge.
LIGHT: grey-blue rain light, warm porch bulb on.
NEGATIVE: no people, no text, no logo, no watermark.
```
→ `public/brand/life-9.png` · caption *monsoon afternoon*

### 18 · Kampung compound
```
{HOUSE STYLE BLOCK}
SUBJECT: An elderly Malaysian woman in a batik sarong seen from BEHIND, seated
in the electric wheelchair on the packed-earth compound of a wooden kampung
house, banana plants and a rain tree beyond, a cat on the steps. Back and
shoulders only. COMPOSITION: 4:3, chair and rider lower left facing the house.
LIGHT: late afternoon, warm and soft.
NEGATIVE: no face, no text, no logo, no watermark.
```
→ `public/brand/life-10.png` · caption *back home*

**Alt text** for each is written when the files arrive, from what the image
actually shows — never from the prompt — in en, ms and zh.

---

## When the files come back

1. Raw originals land in `brand_assets/generated/` (gitignored).
2. Resize to the manifest size, keep the extension, keep each under 300 KB.
3. Place into `public/brand/` and `public/products/`. The ten daily-life images
   need their section built first (a separate PR) — the files alone do nothing.
4. Add the new alt keys to `messages/en.json`, `ms.json` and `zh.json`.
5. Register slots 1 and 2 as `product_photos` rows in webcore with `alt_text` set,
   so the DB-driven product contract in `CLAUDE.md` still holds.
6. Re-shoot `public/og-*.png` with `scripts/og-shot.mjs` — they are screenshots of
   the live hero, one per locale, so a hero change makes them stale.
