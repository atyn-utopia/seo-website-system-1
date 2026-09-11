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
manifest, keep each file **under 300 KB**, and **never change the file extension**.
PNG stays PNG — re-encoding PNG→JPEG flattens alpha and has broken live logos in
this fleet before (`CLAUDE.md`, Images).

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
| 3 | Step 1, before 2pm | `public/brand/step-1.png` | 1600×1200 | PNG | `howItWorks.steps.0.imageAlt` (new) | **needed** |
| 4 | Step 2, within the hour | `public/brand/step-2.png` | 1600×1200 | PNG | `howItWorks.steps.1.imageAlt` (new) | **needed** |
| 5 | Step 3, same evening | `public/brand/step-3.png` | 1600×1200 | PNG | `howItWorks.steps.2.imageAlt` (new) | **needed** |
| 6 | Reviews band texture | `public/brand/reviews-bg.png` | 2000×1200 | PNG | `reviews.bgAlt` (new) | **needed** |
| 7 | Final CTA background | `public/brand/final-cta.png` | 2400×1200 | PNG | `finalCta.bgAlt` (exists) | **needed** |
| 8 | Folded in a car boot | `public/brand/context-boot.png` | 2000×1333 | PNG | `products.contextAlt` (new) | optional |
| — | Customer gallery | `public/gallery/*.png` | — | — | `gallery.alts[]` | **do not generate** |
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

## When the files come back

1. Raw originals land in `brand_assets/generated/` (gitignored).
2. Resize to the manifest size, keep the extension, keep each under 300 KB.
3. Place into `public/brand/` and `public/products/`.
4. Add the new alt keys to `messages/en.json`, `ms.json` and `zh.json`.
5. Register slots 1 and 2 as `product_photos` rows in webcore with `alt_text` set,
   so the DB-driven product contract in `CLAUDE.md` still holds.
6. Re-shoot `public/og-*.png` with `scripts/og-shot.mjs` — they are screenshots of
   the live hero, one per locale, so a hero change makes them stale.
