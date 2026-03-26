# New Website Launch Workflow

Use this prompt as your starting point when spinning up a new SEO website project.

## Step 0 — Gather inputs

Before spawning any agents, collect the following from the user:

```
Project inputs checklist:
[ ] Product name (e.g. "CPAP Machine")
[ ] Product slug (e.g. "cpap-machine")
[ ] Domain (e.g. "cpapmachine.my")
[ ] Brand name (e.g. "CPAP Malaysia")
[ ] Target country (e.g. Malaysia)
[ ] Target locations list (city names + slugs)
[ ] Languages (ask: "English only, or also Bahasa Melayu and/or Mandarin?")
[ ] Special requirements (e.g. rental system, phone routing, multiple products)
[ ] Brand assets available? (logo, colors, fonts, reference images)
[ ] Competitor URLs to analyse? (optional)
```

Do not start the agent pipeline until all checked items are confirmed.

## Step 1 — Create project folder

```
projects/{project-slug}/
  inputs.md      ← paste collected inputs here
```

## Step 2 — Spawn Alpha (System Architect)

Prompt: contents of `agents/alpha.md` + all inputs from Step 0.

Wait for Alpha's architecture document before proceeding.

Save output to: `projects/{project-slug}/architecture.md`

## Step 3 — Spawn Cyclops + Sora in parallel

Both need Alpha's output. Spawn simultaneously.

**Cyclops** (Database Engineer):
- Prompt: `agents/cyclops.md` + Alpha's architecture + locations list

**Sora** (SEO Strategist):
- Prompt: `agents/sora.md` + Alpha's architecture + product info + locations + languages

Save outputs to:
- `projects/{project-slug}/database.md`
- `projects/{project-slug}/seo-plan.md`

## Step 4 — Spawn Nana (SEO Copywriter)

Needs: Sora's SEO plan + product description + brand tone.

Prompt: `agents/nana.md` + Sora's plan + product inputs.

Save output to: `projects/{project-slug}/copy-homepage.md`

## Step 5 — Spawn Fanny + Kimmy in parallel

Both need Nana's output. Spawn simultaneously.

**Fanny** (Location Page Generator):
- Prompt: `agents/fanny.md` + Alpha's doc + Sora's plan + Nana's templates + locations list

**Kimmy** (Technical SEO):
- Prompt: `agents/kimmy.md` + Alpha's doc + Sora's plan + Nana's copy + domain

Save outputs to:
- `projects/{project-slug}/copy-locations.md`
- `projects/{project-slug}/technical-seo.md`

## Step 6 — Spawn Joy (i18n Specialist) — if multilingual

Only run if more than one language was confirmed in Step 0.

Prompt: `agents/joy.md` + Alpha's doc + confirmed languages + Nana's English copy + current codebase state.

Save output to: `projects/{project-slug}/i18n-implementation.md`

## Step 7 — Apply outputs to codebase

Work through each agent's output document and implement it:

1. **Cyclops** → Run schema SQL in Supabase → seed with test data
2. **Alpha** → Scaffold Next.js folder structure
3. **Nana** → Write homepage copy into `app/[locale]/page.tsx` and message files
4. **Fanny** → Populate `lib/locationCopy.ts` with location templates
5. **Kimmy** → Add `generateMetadata()`, schema JSON-LD, sitemap, robots.txt
6. **Joy** → Write `i18n/routing.ts`, `i18n/request.ts`, `middleware.ts`, `messages/*.json`, `LanguageSwitcher.tsx`

## Step 8 — Dev server + screenshot review

```bash
cd projects/{project-slug}
npm run dev
```

Screenshot: `node screenshot.mjs http://localhost:3000`

Compare against reference images. Fix spacing, typography, color mismatches. Run at least 2 comparison rounds.

## Step 9 — Deploy to Vercel

After review passes:
- Push to GitHub
- Connect repo to Vercel
- Set environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Deploy

## Reusing this system for a new product

To launch a second website (e.g. `wheelchairmalaysia.my`):
1. Create `projects/wheelchair/` folder
2. Follow Steps 0–9 with new inputs
3. Cyclops reuses the same Supabase instance — add rows to `phone_numbers` with `website = 'wheelchairmalaysia.my'`
4. All agent prompts are reusable as-is — just change the inputs
