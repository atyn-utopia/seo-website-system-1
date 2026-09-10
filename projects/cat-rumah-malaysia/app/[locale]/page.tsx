import type { Metadata } from 'next'
import { seoAlternates } from '@/lib/seoAlternates'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { siteConfig } from '@/config/site'
import { getPhoneNumber } from '@/lib/webcore'
import { OrganizationSchema } from '@/components/schema/OrganizationSchema'
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema'
import { ProductSchema } from '@/components/schema/ProductSchema'
import { FAQSchema } from '@/components/schema/FAQSchema'
import FomoBanner from '@/components/FomoBanner'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import PageStyles from '@/components/PageStyles'
import WhatsAppClickTracker from '@/components/tracking/WhatsAppClickTracker'
import HomePageClient from './HomePageClient'
import type { Locale } from '@/i18n/routing'
import { ogImages } from '@/lib/ogImage'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.meta' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: seoAlternates(locale),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${siteConfig.siteUrl}/${locale}`,
      siteName: siteConfig.brandName,
      locale: locale === 'zh' ? 'zh_MY' : locale === 'en' ? 'en_MY' : 'ms_MY',
      type: 'website',
      images: ogImages(locale),
    },
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const tMeta = await getTranslations({ locale, namespace: 'home.meta' })
  const tHero = await getTranslations({ locale, namespace: 'home.hero' })
  const tUsp = await getTranslations({ locale, namespace: 'home.usp' })
  const tFaq = await getTranslations({ locale, namespace: 'home.faq' })
  const tBrands = await getTranslations({ locale, namespace: 'home.paintBrands' })
  const tProducts = await getTranslations({ locale, namespace: 'home.products' })
  const tRoot = await getTranslations({ locale })
  const imageAlt = tRoot('imageAlt')

  const { phone } = await getPhoneNumber()
  const waHref = `/${locale}/redirect-whatsapp-1`

  const uspItems = [
    { title: tUsp('usp1Title'), sub: tUsp('usp1Sub'), icon: 'fast' as const },
    { title: tUsp('usp2Title'), sub: tUsp('usp2Sub'), icon: 'quality' as const },
    { title: tUsp('usp3Title'), sub: tUsp('usp3Sub'), icon: 'value' as const },
  ]

  const faqs = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    question: tFaq(`q${n}`),
    answer: tFaq(`a${n}`),
  }))

  return (
    <>
      <PageStyles />
      <OrganizationSchema />
      <LocalBusinessSchema locale={locale} />
      <ProductSchema name={tMeta('title')} description={tMeta('description')} locale={locale} />
      <FAQSchema faqs={faqs} />

      <FomoBanner locale={locale as Locale} />
      <SiteHeader />

      {/* HERO — magnolia paper, left-aligned type, the work photo held in a
          card. Deliberately neither dark nor centred: design-direction.md
          audits four neighbouring fleet sites and marks both treatments HIGH
          duplicate risk. The headline is one colour throughout — colouring a
          single phrase inside it is the commonest generated-page tell. */}
      <section style={{ background: 'var(--paper-2)' }}>
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-14 md:pt-14 md:pb-16">
          <div className="hero-grid">
            <div className="hero-copy">
              {/* The header chrome carries no logo, so the mark lives here. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/brand/logo-dark.png"
                alt={tHero('logoAlt')}
                className="hero-logo"
                style={{ width: 150, height: 'auto' }}
              />

              <h1 className="hero-h1" style={{ color: 'var(--brand-ink)' }}>
                {tHero('headline')} {tHero('headlineHighlight')}
              </h1>

              <h2 className="hero-sub" style={{ color: 'var(--muted)' }}>
                {tHero('subheadline')}
              </h2>

              <div className="hero-acts">
                <WhatsAppClickTracker
                  phoneNumber={phone}
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-wa btn-lg"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.839L.057 23.179c-.083.334.232.633.556.522l5.493-1.757A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9c-1.888 0-3.661-.519-5.175-1.425l-.371-.22-3.842 1.229 1.167-3.77-.242-.389A9.877 9.877 0 012.1 12C2.1 6.534 6.534 2.1 12 2.1S21.9 6.534 21.9 12 17.466 21.9 12 21.9z" />
                  </svg>
                  {tHero('cta')}
                </WhatsAppClickTracker>

                <span className="hero-price">
                  <span className="hero-price-label">{tProducts('fromLabel')}</span>
                  <b>{tProducts('priceFromSqft', { price: '3.50' }).replace(/^Dari\s+|^From\s+/i, '')}</b>
                </span>
              </div>

              <p className="hero-support hero-fine">{tHero('ctaSubtext')}</p>

              <p className="hero-trust">
                <span>{tHero('badgeCertified')}</span>
                <span className="hero-trust-rule" aria-hidden="true" />
                <span>{tHero('badgeCities')}</span>
              </p>
            </div>

            <div className="hero-media">
              {/* CSS background rather than an <img> so the announced element
                  is the one the fleet convention expects: role=img + label. */}
              <div
                className="hero-shot"
                role="img"
                aria-label={imageAlt}
                style={{ backgroundImage: 'url(/images/painters/painter-bg.jpg)' }}
              />
              {/* The colour key. Every service on this page is filed under one
                  of these three, and the same colour marks it wherever it
                  appears — so the key is read once and reused. */}
              <ul className="hero-key">
                <li><i style={{ background: 'var(--fam-dalam)' }} aria-hidden="true" />{tProducts('famDalam')}</li>
                <li><i style={{ background: 'var(--fam-luar)' }} aria-hidden="true" />{tProducts('famLuar')}</li>
                <li><i style={{ background: 'var(--fam-khas)' }} aria-hidden="true" />{tProducts('famKhas')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3-POINT USP BAR — one panel, three cells, divided by rules rather
          than by giving each cell its own card fill and border. */}
      <section
        className="px-6 py-10 md:py-12"
        style={{ background: 'var(--paper-1)', borderBottom: '1px solid var(--line)' }}
        aria-label={tUsp('usp1Title')}
      >
        <div className="max-w-6xl mx-auto">
          <div className="usp-panel">
            {uspItems.map((item, i) => (
              <div key={item.icon} className="usp-cell">
                <i
                  className="usp-tick"
                  style={{ background: [ 'var(--fam-dalam)', 'var(--fam-luar)', 'var(--fam-khas)' ][i] }}
                  aria-hidden="true"
                />
                <div>
                  <h5>{item.title}</h5>
                  <h5 className="usp-sub">{item.sub}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAINT BRANDS STRIP */}
      <section className="px-6 py-10" style={{ background: '#fff', borderBottom: '1px solid var(--line)' }} aria-labelledby="brands-heading">
        <div className="max-w-6xl mx-auto text-center">
          <h3 id="brands-heading" className="text-lg md:text-xl font-bold" style={{ color: 'var(--brand-ink)' }}>{tBrands('heading')}</h3>
          <h5 className="text-xs font-normal mt-2 max-w-2xl mx-auto" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{tBrands('subheading')}</h5>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {[
              { src: '/images/paint-brands/nippon.png', alt: 'Nippon Paint' },
              { src: '/images/paint-brands/jotun.png', alt: 'Jotun' },
              { src: '/images/paint-brands/dulux.png', alt: 'Dulux' },
              { src: '/images/paint-brands/kcc.png', alt: 'KCC Paint' },
              { src: '/images/paint-brands/sissons.png', alt: 'Sissons' },
            ].map((b) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={b.alt} src={b.src} alt={b.alt} style={{ height: 48, width: 'auto', objectFit: 'contain', filter: 'saturate(0.95)' }} loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      <HomePageClient phoneNumber={phone} />

      <SiteFooter locale={locale} />
    </>
  )
}
