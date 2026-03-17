# SEO Website System

# Project Overview

This project builds SEO-driven product websites using reusable architecture.

Primary example:
cpapmachine.my

Goals:

- Highlight products and services clearly
- Use strong SEO copywriting
- Generate dynamic location pages
- Store phone numbers in Supabase
- Allow multiple websites to share the same database
- Enable scalable generation of new SEO websites

The system should scale to:

- 100+ websites
- hundreds of location pages
- shared database infrastructure

## Directory Structure
- `agents/` — AI agent definitions and configurations
- `templates/` — Content and page templates
- `prompts/` — Prompt files for AI workflows
- `brand_assets/` — Brand assets (logos, colors, fonts, guidelines)
- `projects/` — Individual project files and outputs

## Conventions
- Keep prompts modular and reusable
- Store brand guidelines in `brand_assets/` before starting a project
- Each project gets its own subfolder under `projects/`


# Technology Stack

Frontend:
Next.js (App Router)

Styling:
Tailwind CSS

Database:
Supabase

Deployment:
Vercel


# Agent Team

Alpha — System Architect  
Designs the technical architecture.

Cyclops — Database Engineer  
Designs Supabase schema and database logic.

Sora — SEO Strategist  
Plans keyword structure, page hierarchy, and internal linking.

Nana — SEO Copywriter  
Writes website copy, product pages, and marketing content.

Fanny — Location Page Generator  
Generates location-based SEO pages.

Kimmy — Technical SEO Specialist
Handles metadata, schema markup, alt text, and SEO optimization.

Joy — Internationalisation (i18n) Specialist
Adds multilingual support, language switcher UI, and translated content. During architecture planning, Joy must ask which languages the website should support before proceeding.


# Agent Workflow

Always execute agents in this order:

1. Alpha — design system architecture
   → Joy joins here: asks user to confirm target languages before architecture is finalised
2. Cyclops — design Supabase database
3. Sora — plan SEO page structure
4. Nana — generate website copy
5. Fanny — generate location pages
6. Kimmy — apply technical SEO optimization
7. Joy — implement i18n, language switcher, and translated content (if multilingual)


# SEO Rules

Every page must include:

- clear H1 heading structure
- keyword placement in headings
- meta title
- meta description
- image alt text
- schema markup when relevant
- internal links

Avoid duplicate content.

Location pages must have unique copy.


# Dynamic Location Pages

Location pages follow this structure:

/product/location

Example:

/cpap-machine/kuala-lumpur
/cpap-machine/petaling-jaya
/cpap-machine/shah-alam

Each page must include:

- unique introduction
- location-specific keywords
- FAQs
- call-to-action
- dynamic phone number from database


# Supabase Database Logic

Phone numbers are stored in Supabase.

Phone numbers must be mapped to:

- website
- product
- location

Example query logic:

select phone_number
from phone_numbers
where product_slug = 'cpap-machine'
and location_slug = 'kuala-lumpur'


# Frontend Website Rules

## Always Do First
Invoke the `frontend-design` skill before writing any frontend code.

## Reference Images

If a reference image is provided:

- match layout exactly
- match spacing
- match typography
- match colors

Do not add or improve design.

If no reference image is provided:
design from scratch with high craft.

## Local Server

Always run the site on localhost.

Start the dev server:

node serve.mjs

Server runs at:

http://localhost:3000

Never screenshot file:/// URLs.

## Screenshot Workflow

Use Puppeteer to capture screenshots:

node screenshot.mjs http://localhost:3000

Screenshots are saved in:

temporary screenshots/

After screenshotting:

- compare with reference
- fix spacing differences
- fix typography differences
- fix color mismatches

Perform at least **two comparison rounds**.


# Output Defaults

Unless otherwise specified:

- Single index.html file
- Inline styles
- Tailwind CSS via CDN
- Placeholder images via https://placehold.co
- Mobile-first responsive


# Brand Assets

Always check the `brand_assets/` folder before designing.

If assets exist:

- use provided logos
- use provided color palettes
- use provided images

Do not replace real assets with placeholders.


# Anti-Generic Design Guardrails

## Colors
Never use default Tailwind blue or indigo.

Always choose custom brand colors.

## Shadows
Avoid flat shadows like shadow-md.

Use layered shadows with color tint.

## Typography

Do not use the same font for headings and body text.

Use:

display/serif font for headings  
clean sans font for body

Large headings should use tight tracking.

Body text should use generous line height.

## Gradients

Layer multiple gradients and depth effects.

## Animations

Animate only:

- transform
- opacity

Never use transition-all.

## Interactive States

Clickable elements must have:

- hover state
- focus state
- active state

## Images

Add gradient overlay to improve readability.

## Spacing

Use consistent spacing tokens.

## Depth

Design surfaces with layering:

base → elevated → floating