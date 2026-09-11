# Sora — SEO Plan: RevMove (`revmove.my`)

> Author: Sora (SEO Strategist). Status: Complete — written retroactively on 2026-09-11 for a site already live. Project: RevMove, the hub for six vehicle-rental categories (motor, kereta, van, bas, city tour, chauffeur) across 6 cities (Kuala Lumpur, Shah Alam, Pulau Pinang, Melaka, Johor Bahru, Langkawi), 2 locales (ms default at `/`, en at `/en`).
>
> Every figure below is measured. GSC clicks/impressions come from the sister sites' Search Console export in `_pipeline/gsc-keyword-data.txt` (17 properties, last 16 months). Monthly volumes come from Google Keyword Planner via `keyword-volume.mjs` (geo MY), run on 2026-09-11 — see §1.5.

## 1. Primary Keyword Strategy (per locale)

The sister sites already rank for the category head terms; RevMove's job is the
hub query ("sewa kenderaan") plus one category head term per hub page. The
category terms are the primary money keywords because each `/sewa-*` page
inherits one, and the location pages inherit that term plus the city name.

### 1.1 Bahasa Melayu — primary money keywords

| Keyword | Page | GSC clicks / impr (sister sites) | Planner vol/mo |
|---|---|---|---|
| sewa kereta | `/sewa-kereta` | 903 / 12,312 | 5,400 |
| sewa motor | `/sewa-motor` | 562 / 7,513 | 1,900 |
| sewa van | `/sewa-van` | 118 / 2,327 | 1,300 |
| sewa bas | `/sewa-bas` | 57 / 1,611 | 880 |
| sewa kenderaan | `/` | — (hub term; no sister site targets it) | 70 |

- Variants: kereta sewa, motor sewa, van sewa, bas sewa, sewa kereta murah, sewa van murah, sewa bas persiaran, sewa bas mini, sewa motosikal
- Intent long-tail: sewa kereta near me, sewa motor near me, kereta sewa near me, harga sewa bas, harga sewa bas sehari, sewa kereta bulanan, sewa motor bulanan, sewa van dengan pemandu, sewa kereta pandu sendiri
- Location pattern: `sewa kereta {Bandar}` / `sewa motor {Bandar}` / `sewa van {Bandar}` / `sewa bas {Bandar}` (e.g. sewa motor penang 370 clicks / 3,410 impr; sewa motor kl 238 / 1,866; sewa kereta melaka 287 / 3,449; sewa kereta shah alam 304 / 1,626; sewa van jb 75 / 587).

### 1.2 English — primary money keywords

| Keyword | Page | GSC clicks / impr (sister sites) | Planner vol/mo |
|---|---|---|---|
| car rental kuala lumpur | `/en/sewa-kereta`, `/en/sewa-kereta/kuala-lumpur` | — (sister sites rank BM) | 6,600 |
| motorcycle rental kuala lumpur | `/en/sewa-motor`, `/en/sewa-motor/kuala-lumpur` | motorbike rental kuala lumpur 36 / 654 | 720 |
| van rental malaysia | `/en/sewa-van` | van rental 9 / 971 | 90 |
| bus rental malaysia | `/en/sewa-bas` | — | 260 |
| kl city tour | `/en/city-tour` | 2 / 138 | 260 |

- Variants: car rental malaysia, motorbike rental kuala lumpur, scooter rental langkawi, bike rental penang, van rental kl, van rental kuala lumpur, bus rental kl, city tour kuala lumpur, vehicle rental malaysia
- Intent long-tail: car rental near me, motorcycle rental near me, monthly car rental kuala lumpur, van rental with driver, private car tour kuala lumpur, chauffeur service kuala lumpur
- Location pattern: `car rental {City}` / `motorcycle rental {City}` / `scooter rental {City}` (e.g. scooter rental langkawi 10 / 883; motorbike rental penang 39 / 418; van rental johor bahru 41 / 241).

### 1.3 City Tour and Chauffeur — secondary, not gated

These two categories carry no sister-site ranking to inherit (citytour.my's
best query is `kl city tour` at 2 clicks / 138 impressions; chauffeur has no
GSC data at all). They stay on the site as service pages and take the
long-tail below; they do not set a homepage heading.

- City tour (ms): city tour kl, city tour kuala lumpur, pakej city tour kl, city tour melaka, city tour penang
- City tour (en): kl city tour (see §1.2), city tour kuala lumpur, kuala lumpur day tour, private city tour kl
- Chauffeur (ms): sewa pemandu, pemandu peribadi kl, sewa kereta dengan pemandu
- Chauffeur (en): chauffeur service kuala lumpur, chauffeur kl, car with driver kuala lumpur

### 1.4 Do not chase

- `kereta sewa kota bharu`, `kereta sewa kuching`, `kereta sewa kuantan`, `sewa motor ipoh`, `sewa van kota kinabalu` — high sister-site impressions, but RevMove serves 6 cities only. A page for a city with no branch is a 0-branch claim.
- `sewa rental motorcycle, vespa, car & van - bukit bintang kuala lumpur rev move` — a Maps listing title, not a query.
- `cit tour`, `citi tour` — typos.

### 1.5 Gate result (keyword-volume.mjs, 2026-09-11)

Both runs passed with 0 head terms below the 10/mo threshold (`--lang ms --only ms`: 34 keywords, 29 above threshold; `--lang en --only en`: 18 keywords, 17 above). Volumes are Keyword Planner monthly averages for Malaysia and are recorded in the tables above.

- `sewa kenderaan` is the smallest head term (70/mo, trending +47%) and is kept because it is the only term that names the hub rather than one category.
- `kl city tour` is language-neutral to the extractor, so it was measured in the Malay run (260/mo). Its English variant `city tour kuala lumpur` measured 480/mo.
- Long-tail terms with no measurable volume: van sewa, bas sewa, pakej city tour kl, private city tour kl, pemandu peribadi kl, motorbike rental kuala lumpur. Kept as long-tail only; nothing inherits them.
- Notable long-tail above the head terms: kereta sewa near me 12,100; car rental near me 8,100; kereta sewa 6,600; sewa kereta near me 5,400; car rental malaysia 3,600; vehicle rental malaysia 3,600. These are "near me" and national intent, which the 6 location pages and the homepage catch; they do not set an H1.

## 2. Page Hierarchy & URL Structure

```
/                          → homepage, ms (hub: sewa kenderaan + 6 categories)
/en                        → homepage, en
/sewa-motor … /sewa-bas    → category hub pages (one primary term each)
/city-tour, /chauffeur     → service hub pages (secondary terms)
/{vehicle}/{city}          → location pages, ms — published rows only
/en/{vehicle}/{city}       → location pages, en (same Malay slugs under /en)
/blog, /blog/{slug}        → blog listing + article, both locales
/hubungi, /tentang-kami    → contact, about
/sitemap.xml, /robots.txt
```

- Vehicle slugs stay Malay in both locales (`/en/sewa-kereta`); `/en/car-rental` does not exist.
- Location pages exist only where `revmove_vehicle_locations` has a published row (10 today).

## 3. Heading Hierarchy Targets per Page

Sitewide: exactly one `<h1>` and one `<h2>`, both in the hero. All other section titles are `<h3>`–`<h6>`.

### Homepage `/`
- H1: "Sewa motor, kereta, van dan bas. Ambil kunci hari ini." (rotating category word)
- H2: "Motor dari RM18 sehari hingga bas persiaran — setiap kenderaan didaftarkan atas nama kami, bukan platform orang tengah."

### Category hub `/sewa-{kategori}`
- H1: "Sewa {Kategori}" — the primary term verbatim.
- H2: the category description from `revmove_vehicles`, else "Sewa {kategori} di {n} bandar seluruh Malaysia."

### Location page `/{vehicle}/{city}`
- H1: "Sewa {Kategori} {Bandar}" — primary term + city.
- H2: local availability line with the from-rate.

### English equivalents
- `/en`: H1 "Rent a motorcycle, car, van or bus. Keys in hand today."
- `/en/sewa-{kategori}`: H1 = `name_en` ("Car Rental"), H2 = `description_en`.
- `/en/{vehicle}/{city}`: H1 "{Category} Rental {City}".

## 4. Meta Titles & Meta Descriptions

- Homepage (ms): "Sewa Kenderaan Seluruh Malaysia — Motor, Kereta, Van & Bas | RevMove"
- Homepage (en): "Vehicle Rental Across Malaysia — Motorcycles, Cars, Vans & Buses | RevMove"
- Category hub (ms): "Sewa {Kategori} Seluruh Malaysia | RevMove"
- Category hub (en): "{Category} Rental Across Malaysia | RevMove"
- Location (ms): "Sewa {Kategori} {Bandar} | Dari RM{n}/hari | RevMove"
- Location (en): "{Category} Rental {City} | From RM{n}/day | RevMove"

The `[locale]` layout appends "| RevMove" through its title template; page titles must not add it again.

## 5. Internal Linking Pattern

- Header "Kenderaan" menu → the six category hubs (external categories go to their sister site in a new tab).
- Homepage fleet picker and comparison table → each category hub.
- Category hub → its location pages (location cards) and the sister site's full range.
- Location page → sibling cities for the same vehicle, and the other vehicles in the same city.
- Blog articles → the category hub they discuss.

## 6. Schema Markup Plan

- Organization + WebSite on every page.
- BreadcrumbList on category, location and blog pages.
- Product/Offer on category hubs with the from-rate.
- Article + BreadcrumbList on blog posts.

## 7. Hreflang Strategy

`ms-MY` → `/…`, `en-MY` → `/en/…`, `x-default` → `/…`, on every page that has both locales. Sitemap alternates carry the same pairs.

## 8. Blog Topics for Hanabi

Ranked by the sister sites' measured demand. Each topic links to one category hub.

1. Harga sewa bas sehari 2026 — bas mini vs bas VIP (`/sewa-bas`; "harga sewa bas sehari" 18 / 354)
2. Sewa motor bulanan: berapa jimat berbanding harian (`/sewa-motor`; monthly-hire rate is the sister site's headline)
3. Sewa kereta near me — cara pilih kereta sewa yang berdekatan (`/sewa-kereta`; "kereta sewa near me" 2,016 / 31,409)
4. Sewa van dengan pemandu atau pandu sendiri? (`/sewa-van`; "sewa van murah" 114 / 2,318)
5. Scooter rental Langkawi: what to bring and where to ride (`/en/sewa-motor/langkawi`; 10 / 883)
6. Motorbike rental Penang — licence, deposit, helmet (`/en/sewa-motor/penang`; 39 / 418)
7. Sewa bas persiaran untuk lawatan sekolah (`/sewa-bas`; "sewa bas persiaran" 73 / 1,414)
8. KL city tour: join a group or take a private car (`/en/city-tour`)
9. Sewa kereta Melaka untuk hujung minggu (`/sewa-kereta/melaka`; 287 / 3,449)
10. Van rental Johor Bahru for a family trip (`/en/sewa-van/johor-bahru`; 41 / 241)

## 9. Blog Post Heading Hierarchy

H1 (title) → H2 (sections, 3–5) → H3 (sub-points) → H4 where a step list needs it → paragraph copy. Every article ends with one WhatsApp CTA to its category hub.
