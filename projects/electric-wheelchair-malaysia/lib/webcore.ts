// Unified data layer for phone numbers / leads routing.
// Every read goes through fetch() against the Supabase REST API with a
// next.tags entry, so revalidateTag('webcore-phones') invalidates the cache
// on demand without redeploys.

import { headers } from 'next/headers'
import { siteConfig } from '@/config/site'

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

if (!SUPABASE_URL || !SUPABASE_KEY) {
  // eslint-disable-next-line no-console
  console.warn(
    '[webcore] Missing SUPABASE_URL / SUPABASE_ANON_KEY. Fallback values will be used.',
  )
}

export type WebcoreTag = 'webcore-products' | 'webcore-phones' | 'webcore-blog'

// Public webcore API — used only by getDisplayPhone(), which needs webcore's
// own /display precedence rather than a raw table read.
const WEBCORE_PUBLIC_BASE = 'https://webcore.utopiaai.my'
const WEBCORE_FETCH_TIMEOUT_MS = 4000

async function webcoreFetch<T>(path: string, tag: WebcoreTag): Promise<T | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: 'application/json',
        'Accept-Profile': 'webcore',
      },
      cache: 'force-cache',
      next: { tags: [tag] },
    })
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error(`[webcore] ${tag} ${res.status} ${res.statusText} :: ${path}`)
      return null
    }
    return (await res.json()) as T
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[webcore] ${tag} fetch error:`, err)
    return null
  }
}

/* ============================================================
 * Phone numbers / leads routing
 * ============================================================ */

// Default to siteConfig.fallbackPhone (60174287801) instead of a placeholder
// — the live site falls back here when Supabase has no matching phone row,
// and the placeholder was getting served verbatim to real customers.
const FALLBACK_PHONE = process.env.PHONE_FALLBACK ?? siteConfig.fallbackPhone
const FALLBACK_WA_TEXT = "Hi, I'd like to ask about an electric wheelchair."

type LeadsMode = 'single' | 'rotation' | 'location' | 'hybrid'

interface PhoneRow {
  phone_number: string
  whatsapp_text: string | null
  percentage: number | null
  label: string | null
  location_slug: string | null
  page_slug: string | null
  // Nominates the number this page PRINTS. Unique per (website, page_slug),
  // not per site — see getDisplayPhone().
  is_display: boolean | null
}

// A row is "site-wide" when it isn't pinned to a specific page. Rows that
// predate the page_slug column (null) are treated as site-wide too.
function isSiteWide(row: PhoneRow): boolean {
  return !row.page_slug || row.page_slug === 'all'
}

export interface PhoneResult {
  phone: string
  whatsappText: string
  source: 'database' | 'fallback'
  mode: LeadsMode | 'fallback'
}

function pickWeighted(rows: PhoneRow[]): PhoneRow | undefined {
  if (rows.length === 0) return undefined
  if (rows.length === 1) return rows[0]
  const total = rows.reduce((sum, r) => sum + (r.percentage || 1), 0)
  let roll = Math.random() * total
  for (const row of rows) {
    roll -= row.percentage || 1
    if (roll <= 0) return row
  }
  return rows[rows.length - 1]
}

function findDefaultRow(rows: PhoneRow[]): PhoneRow | undefined {
  return rows.find((r) => r.label === 'default')
}

async function getHostDomain(): Promise<string> {
  try {
    const h = await headers()
    const host = h.get('host') || h.get('x-forwarded-host') || ''
    return host.replace(/:\d+$/, '').replace(/^www\./, '')
  } catch {
    return ''
  }
}

async function getLeadsMode(domain: string): Promise<LeadsMode> {
  if (!domain) return 'single'
  const path =
    `company_websites?select=leads_mode` +
    `&domain=eq.${encodeURIComponent(domain)}` +
    `&limit=1`
  const data = await webcoreFetch<{ leads_mode: LeadsMode | null }[]>(path, 'webcore-phones')
  return data?.[0]?.leads_mode ?? 'single'
}

async function getPhoneRows(domain: string): Promise<PhoneRow[]> {
  if (!domain) return []
  const path =
    `phone_numbers?select=phone_number,whatsapp_text,percentage,label,location_slug,page_slug,is_display` +
    `&website=eq.${encodeURIComponent(domain)}` +
    `&is_active=eq.true`
  const data = await webcoreFetch<PhoneRow[]>(path, 'webcore-phones')
  return data ?? []
}

function fallbackResult(): PhoneResult {
  return {
    phone: FALLBACK_PHONE,
    whatsappText: FALLBACK_WA_TEXT,
    source: 'fallback',
    mode: 'fallback',
  }
}

function toResult(row: PhoneRow | undefined, mode: LeadsMode, domain: string): PhoneResult {
  if (!row) return fallbackResult()
  // Always prefix the domain the lead came from, so an operator running several
  // sites (or one number registered against several domains) can tell which site
  // produced the enquiry. Any greeting already stored in whatsapp_text is dropped
  // first, otherwise the message double-greets ("Hi domain.my, Hi Brand, ...").
  const raw = row.whatsapp_text || FALLBACK_WA_TEXT
  const body = raw.replace(/^\s*(hi|hello|hai|salam|assalamualaikum)\b[^,]{0,40},\s*/i, '')
  return {
    phone: row.phone_number,
    whatsappText: `Hi ${domain}, ${body}`,
    source: 'database',
    mode,
  }
}

export async function getPhoneNumber(
  locationSlug?: string,
  pageSlug?: string,
): Promise<PhoneResult> {
  try {
    const domain = await getHostDomain()
    const [mode, allRows] = await Promise.all([getLeadsMode(domain), getPhoneRows(domain)])
    if (allRows.length === 0) return fallbackResult()

    // Resolution order (mirrors webcore /phone-numbers/resolve):
    //   page  →  location  →  all  →  default.
    // A page-pinned number wins first when we know the originating page, and
    // never leaks into the site-wide leads_mode pool below.
    if (pageSlug && pageSlug !== 'all') {
      const pageRows = allRows.filter((r) => r.page_slug === pageSlug)
      if (pageRows.length > 0) return toResult(pickWeighted(pageRows), mode, domain)
    }

    // leads_mode logic runs only over site-wide rows so per-page numbers
    // don't dilute the homepage rotation.
    const rows = allRows.filter(isSiteWide)
    if (rows.length === 0) return fallbackResult()

    const defaultRow = findDefaultRow(rows)

    switch (mode) {
      case 'single':
        return toResult(defaultRow ?? rows[0], mode, domain)

      case 'rotation':
        return toResult(pickWeighted(rows), mode, domain)

      case 'location': {
        if (locationSlug) {
          const locRows = rows.filter((r) => r.location_slug === locationSlug)
          if (locRows.length > 0) return toResult(pickWeighted(locRows), mode, domain)
        }
        return toResult(defaultRow, mode, domain)
      }

      case 'hybrid': {
        if (locationSlug && locationSlug !== 'all') {
          const locRows = rows.filter((r) => r.location_slug === locationSlug)
          if (locRows.length > 0) return toResult(pickWeighted(locRows), mode, domain)
        }
        return toResult(defaultRow, mode, domain)
      }

      default:
        return toResult(defaultRow, mode, domain)
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[getPhoneNumber] Unexpected error:', err)
    return fallbackResult()
  }
}

export function waLink(phone: string, message?: string): string {
  const query = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${phone}${query}`
}

export async function getWhatsAppLink(
  locationSlug?: string,
  messageOverride?: string,
): Promise<string> {
  const { phone, whatsappText } = await getPhoneNumber(locationSlug)
  return waLink(phone, messageOverride || whatsappText)
}

/* ============================================================
 * Blog posts
 * ============================================================ */

export interface BlogPost {
  id: string
  slug: string
  cover_image_url: string
  published_at: string
  title: string
  content: string
  excerpt: string
  meta_title: string
  meta_description: string
}

interface BlogPostRow {
  id: string
  slug: string
  cover_image_url: string | null
  published_at: string | null
  created_at: string | null
  blog_translations:
    | {
        title: string | null
        content: string | null
        excerpt: string | null
        meta_title: string | null
        meta_description: string | null
      }[]
    | null
}

function flattenBlogRow(row: BlogPostRow): BlogPost {
  const translations = Array.isArray(row.blog_translations) ? row.blog_translations : []
  const t = translations[0] ?? {
    title: '',
    content: '',
    excerpt: '',
    meta_title: '',
    meta_description: '',
  }
  return {
    id: row.id,
    slug: row.slug,
    cover_image_url: row.cover_image_url ?? '',
    published_at: row.published_at || row.created_at || '',
    title: t.title || '',
    content: t.content || '',
    excerpt: t.excerpt || '',
    meta_title: t.meta_title || '',
    meta_description: t.meta_description || '',
  }
}

export async function getBlogPosts(language: string = 'en'): Promise<BlogPost[]> {
  const path =
    `blog_posts?select=id,slug,cover_image_url,published_at,created_at,blog_translations!inner(title,content,excerpt,meta_title,meta_description)` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&status=eq.published` +
    `&blog_translations.language=eq.${encodeURIComponent(language)}` +
    `&order=created_at.desc`

  const data = await webcoreFetch<BlogPostRow[]>(path, 'webcore-blog')
  if (!data) return []
  return data.map(flattenBlogRow)
}

export async function getBlogPostBySlug(
  slug: string,
  language: string = 'en',
): Promise<BlogPost | null> {
  const path =
    `blog_posts?select=id,slug,cover_image_url,published_at,created_at,blog_translations!inner(title,content,excerpt,meta_title,meta_description)` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&slug=eq.${encodeURIComponent(slug)}` +
    `&status=eq.published` +
    `&blog_translations.language=eq.${encodeURIComponent(language)}` +
    `&limit=1`

  const data = await webcoreFetch<BlogPostRow[]>(path, 'webcore-blog')
  if (!data || data.length === 0) return null
  return flattenBlogRow(data[0])
}

/* ============================================================
 * Products
 *
 * CLAUDE.md, Dynamic Product Data: the homepage and location pages read
 * products from webcore, never from a config file. Adding a row in /admin puts
 * a product on the site as soon as the webcore-products tag is purged.
 * ============================================================ */

export interface ProductPhoto {
  url: string
  alt_text: string | null
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  sale_price: number | null
  rental_price: number | null
  sort_order: number
  photos: ProductPhoto[]
}

type ProductRow = Omit<Product, 'photos'> & {
  product_photos: ProductPhoto[] | null
}

export async function getProducts(): Promise<Product[]> {
  const path =
    `products?select=id,name,slug,description,sale_price,rental_price,sort_order,product_photos(url,alt_text)` +
    `&website=eq.${encodeURIComponent(siteConfig.domain)}` +
    `&is_active=eq.true` +
    `&order=sort_order.asc`

  const rows = await webcoreFetch<ProductRow[]>(path, 'webcore-products')
  if (!rows) return []

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    sale_price: row.sale_price,
    rental_price: row.rental_price,
    sort_order: row.sort_order,
    photos: row.product_photos ?? [],
  }))
}

/* ============================================================
 * The number a page PRINTS
 *
 * Two different questions, deliberately two different functions:
 *
 *   who RECEIVES this lead  -> getPhoneNumber() / the redirect page (rotates)
 *   what this page SHOWS    -> getDisplayPhone() (deterministic)
 *
 * Printing a rotating number would change the digits between page loads.
 * ============================================================ */

/**
 * webcore's /display endpoint: page display number -> site-wide display number
 * -> admin default. `is_display` is unique per (website, page_slug), not per
 * site, so the page is part of the question.
 */
async function fetchDisplayPhone(page?: string): Promise<string | null> {
  const url =
    `${WEBCORE_PUBLIC_BASE}/api/public/phone-numbers/display` +
    `?website=${encodeURIComponent(siteConfig.domain)}` +
    (page ? `&page=${encodeURIComponent(page)}` : '')

  // Cacheable + tagged so a webcore-phones purge refreshes it, and raced
  // against a timeout rather than an AbortSignal — a signal opts the response
  // out of the Data Cache and breaks tag purging.
  const request = fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'force-cache',
    next: { tags: ['webcore-phones'] },
  }).catch(() => null)

  const res = await Promise.race([
    request,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), WEBCORE_FETCH_TIMEOUT_MS)),
  ])
  if (!res || !res.ok) return null

  const data = (await res.json().catch(() => null)) as { phone_number?: string } | null
  return data?.phone_number || null
}

export async function getDisplayPhone(page?: string): Promise<string> {
  const viaApi = await fetchDisplayPhone(page)
  if (viaApi) return viaApi

  // Fallback when the public API is unreachable: read the rows and reproduce
  // its precedence. Page-scoped display row -> site-wide display row -> the
  // 'default' label -> any site-wide row.
  try {
    const rows = await getPhoneRows(siteConfig.domain)
    if (rows.length === 0) return FALLBACK_PHONE
    const pageSlug = page ? page.replace(/^\/+|\/+$/g, '') : ''
    const row =
      (pageSlug
        ? rows.find((r) => r.is_display === true && (r.page_slug ?? 'all') === pageSlug)
        : undefined) ??
      rows.find((r) => r.is_display === true && (r.page_slug ?? 'all') === 'all') ??
      findDefaultRow(rows) ??
      rows.find((r) => (r.location_slug ?? 'all') === 'all') ??
      rows[0]
    return row.phone_number || FALLBACK_PHONE
  } catch {
    return FALLBACK_PHONE
  }
}

/**
 * `60108889849` -> `010-888 9849`. Malaysian mobile convention: drop the 60,
 * restore the leading 0, then split the subscriber part. Anything unexpected
 * falls back to the raw digits rather than mangling an unknown format.
 */
export function formatPhoneDisplay(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '')
  const local = digits.startsWith('60') ? '0' + digits.slice(2) : digits
  const m10 = local.match(/^(01\d)(\d{3})(\d{4})$/)
  if (m10) return `${m10[1]}-${m10[2]} ${m10[3]}`
  const m11 = local.match(/^(01\d)(\d{4})(\d{4})$/)
  if (m11) return `${m11[1]}-${m11[2]} ${m11[3]}`
  const fixed = local.match(/^(0\d)(\d{4})(\d{4})$/)
  if (fixed) return `${fixed[1]}-${fixed[2]} ${fixed[3]}`
  return local || raw
}
