// Services grid metadata, keyed by webcore product slug.
//
// Webcore (`products` + `product_photos` for this domain) is the source of
// truth for which services exist, their order, names, prices and photos —
// CLAUDE.md. This file only adds what webcore has no field for:
//
//   - the colour family a service is filed under (the hero's colour key)
//   - whether its price is per sqft or a flat rate
//   - the message key its en/zh copy lives under — webcore stores one
//     language, BM, so the other two locales still come from messages/
//
// A product added in webcore without an entry here still renders: it takes
// its BM name in every locale, files under Khas, and infers its unit from the
// price.
import type { Product } from '@/lib/webcore'

export type Family = 'dalam' | 'luar' | 'khas'

export interface ServiceMeta {
  key: string
  family: Family
  unit: 'sqft' | 'flat'
}

export const SERVICE_META: Record<string, ServiceMeta> = {
  'cat-dinding-rumah': { key: 'interior', family: 'dalam', unit: 'sqft' },
  'cat-bilik-tidur': { key: 'bedroom', family: 'dalam', unit: 'sqft' },
  'cat-dapur': { key: 'kitchen', family: 'dalam', unit: 'sqft' },
  'cat-bilik-mandi': { key: 'bathroom', family: 'dalam', unit: 'sqft' },
  'cat-luar-rumah': { key: 'exterior', family: 'luar', unit: 'sqft' },
  'weathershield-paint': { key: 'weathershield', family: 'luar', unit: 'sqft' },
  'marble-painting': { key: 'marble', family: 'khas', unit: 'flat' },
  'texture-painting': { key: 'texture', family: 'khas', unit: 'flat' },
  'dinding-hiasan-3d': { key: 'decor3d', family: 'khas', unit: 'flat' },
}

export const FAMILY_ORDER: { id: Family; token: string; labelKey: string }[] = [
  { id: 'dalam', token: 'var(--fam-dalam)', labelKey: 'famDalam' },
  { id: 'luar', token: 'var(--fam-luar)', labelKey: 'famLuar' },
  { id: 'khas', token: 'var(--fam-khas)', labelKey: 'famKhas' },
]

// Rendered only when webcore is unreachable or returns no active products —
// CLAUDE.md allows a config fallback for exactly that case and nothing else.
// Name and description are left empty so every locale resolves them from
// messages/ rather than duplicating copy here.
const fallback = (slug: string, sort: number, price: number, photo: string): Product => ({
  id: `fallback-${slug}`,
  slug,
  name: '',
  description: null,
  sale_price: price,
  rental_price: null,
  sort_order: sort,
  product_photos: [{ url: `/images/products/${photo}` }],
  prices: [],
})

export const FALLBACK_PRODUCTS: Product[] = [
  fallback('cat-dinding-rumah', 1, 3.5, 'interior-1.jpg'),
  fallback('cat-bilik-tidur', 2, 3.5, 'bedroom-1.jpg'),
  fallback('cat-dapur', 3, 3.5, 'kitchen-1.jpg'),
  fallback('cat-bilik-mandi', 4, 3.5, 'bathroom-1.jpg'),
  fallback('cat-luar-rumah', 5, 3.5, 'exterior-1.jpg'),
  fallback('weathershield-paint', 6, 4.5, 'exterior-2.jpg'),
  fallback('marble-painting', 7, 2250, 'marble-1.jpg'),
  fallback('texture-painting', 8, 2500, 'texture-1.jpg'),
  fallback('dinding-hiasan-3d', 9, 3500, 'decor3d-1.jpg'),
]
