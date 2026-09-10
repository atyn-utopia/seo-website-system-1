'use client'

// The services grid, shared by the homepage and every location page so the two
// cannot drift apart again. Products arrive from webcore via the server page;
// see config/products.ts for what this component adds on top of them.
import { useLocale, useTranslations } from 'next-intl'
import type { Product } from '@/lib/webcore'
import { FALLBACK_PRODUCTS, FAMILY_ORDER, SERVICE_META, type Family } from '@/config/products'
import WhatsAppClickTracker from '@/components/tracking/WhatsAppClickTracker'
import ProductImpressionTracker from '@/components/tracking/ProductImpressionTracker'

const WAIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.839L.057 23.179c-.083.334.232.633.556.522l5.493-1.757A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9c-1.888 0-3.661-.519-5.175-1.425l-.371-.22-3.842 1.229 1.167-3.77-.242-.389A9.877 9.877 0 012.1 12C2.1 6.534 6.534 2.1 12 2.1S21.9 6.534 21.9 12 17.466 21.9 12 21.9z" />
  </svg>
)

// The label above the number already says "from", so the word comes off the
// rendered price — at the front in ms/en, at the end in zh (起).
const stripFromWord = (s: string) => s.replace(/^(?:Dari|From)\s+/i, '').replace(/\s*起$/, '')

// Per-sqft rates keep their cents (3.50); flat rates get thousands separators.
const formatPrice = (n: number) => (n < 100 ? n.toFixed(2) : n.toLocaleString('en-MY'))

type Props = {
  products: Product[]
  phoneNumber: string
  waHref: string
  headingId: string
}

export default function ServicesGrid({ products, phoneNumber, waHref, headingId }: Props) {
  const t = useTranslations('home.products')
  const locale = useLocale()
  const source = products.length > 0 ? products : FALLBACK_PRODUCTS

  const items = source.map((p) => {
    const meta = SERVICE_META[p.slug]
    const family: Family = meta?.family ?? 'khas'
    const unit = meta?.unit ?? ((p.sale_price ?? 0) < 100 ? 'sqft' : 'flat')
    // BM comes from webcore, so an edit there reaches the ms page; en/zh keep
    // their translations from messages/ for any service this file knows.
    const title = locale === 'ms' && p.name ? p.name : meta ? t(`${meta.key}.title`) : p.name
    const description =
      locale === 'ms' && p.description ? p.description : meta ? t(`${meta.key}.description`) : p.description ?? ''
    const price =
      p.sale_price != null
        ? stripFromWord(t(unit === 'sqft' ? 'priceFromSqft' : 'priceFromFlat', { price: formatPrice(p.sale_price) }))
        : null
    return { slug: p.slug, family, title, description, price, photo: p.product_photos[0]?.url ?? null }
  })

  return (
    <section id="products" className="py-16 px-6" style={{ background: 'var(--paper-2)' }} aria-labelledby={headingId}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 max-w-2xl mx-auto text-center">
          <h3 id={headingId} className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--brand-ink)' }}>{t('heading')}</h3>
          <p className="mt-3" style={{ color: 'var(--muted)', fontSize: 15.5 }}>{t('subheading')}</p>
        </div>

        {FAMILY_ORDER.map((fam) => {
          const group = items.filter((i) => i.family === fam.id)
          if (group.length === 0) return null
          return (
            <div key={fam.id} className="fam-group" style={{ ['--fam' as string]: fam.token }}>
              <header className="fam-head">
                <h4>{t(fam.labelKey)}</h4>
                <span>{group.length} {t('serviceUnit')}</span>
              </header>

              <div className="swatch-grid">
                {group.map((i) => (
                  <ProductImpressionTracker key={i.slug} slug={i.slug}>
                    <article className="swatch">
                      <div className="swatch-band" aria-hidden="true" />
                      {i.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="swatch-shot" src={i.photo} alt={i.title} loading="lazy" />
                      ) : (
                        <div className="swatch-shot" style={{ background: 'var(--paper-3)' }} aria-hidden="true" />
                      )}
                      <div className="swatch-body">
                        <h5>{i.title}</h5>
                        <p className="product-desc">{i.description}</p>
                        <div className="swatch-foot">
                          {i.price && (
                            <span className="swatch-price">
                              <span>{t('fromLabel')}</span>
                              <b>{i.price}</b>
                            </span>
                          )}
                          <WhatsAppClickTracker
                            phoneNumber={phoneNumber}
                            href={waHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={t('bookNow')}
                            className="shrink-0 inline-flex items-center justify-center rounded-full"
                            style={{ background: '#25D366', color: '#fff', width: 42, height: 42 }}
                          >
                            <WAIcon />
                          </WhatsAppClickTracker>
                        </div>
                      </div>
                    </article>
                  </ProductImpressionTracker>
                ))}
              </div>
            </div>
          )
        })}

        <p className="mt-10 text-xs max-w-2xl mx-auto text-center" style={{ color: 'var(--muted)' }}>{t('disclaimer')}</p>
      </div>
    </section>
  )
}
