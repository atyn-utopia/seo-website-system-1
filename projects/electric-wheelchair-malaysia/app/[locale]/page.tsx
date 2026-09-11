import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { seoAlternates } from '@/lib/seoAlternates';
import { siteConfig } from '@/config/site';
import { getProducts } from '@/lib/webcore';
import { waRedirect } from '@/lib/waRedirect';
import { ogImages } from '@/lib/ogImage';
import { regionOrder, getLocationsByRegion } from '@/config/locations';
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema';
import { ProductSchema } from '@/components/schema/ProductSchema';
import { FAQSchema } from '@/components/schema/FAQSchema';
import FomoBanner from '@/components/FomoBanner';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ContactNumber from '@/components/ContactNumber';
import ProductShowcase, { type ShowcasePhoto } from '@/components/ProductShowcase';
import PageStyles from '@/components/PageStyles';

/**
 * Product photos live in `product_photos` (CLAUDE.md, Dynamic Product Data), so
 * the DB is read first. These two files are the fallback for the window before
 * the rows are registered, and for a webcore outage — the same role
 * `config/products.ts` is allowed to play. They are never the source of truth.
 */
const PHOTO_FALLBACK = ['/products/electric-wheelchair.png', '/products/electric-wheelchair-folded.png'];

/**
 * A DB photo URL on our own domain is served from `public/`, so hand
 * next/image the path rather than the absolute URL: a local src is optimised
 * without `images.remotePatterns`, which would be a build-config change.
 * A foreign URL (the old Wix CDN, a stock host) is left for the fallback.
 */
function toLocalSrc(url: string): string | null {
  if (url.startsWith('/')) return url;
  try {
    const parsed = new URL(url);
    return parsed.origin === siteConfig.siteUrl ? parsed.pathname : null;
  } catch {
    return null;
  }
}

function formatRM(amount: number): string {
  return `RM${amount.toLocaleString('en-MY')}`;
}

function Stars({ label }: { label: string }) {
  return (
    <span className="ew-stars" role="img" aria-label={label}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
          <path
            fill="#FBBC04"
            stroke="#C99300"
            strokeWidth="0.7"
            d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.7l5.34-.78L10 1z"
          />
        </svg>
      ))}
    </span>
  );
}

/** The four-colour Google "G" — marks where the rating comes from. */
function GoogleMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="Google">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/** One stroke-icon set for the USP bar and the spec list, so both read as
 *  the same family. Feather-style, 1.8 stroke, currentColor. */
const ICONS: Record<string, React.ReactNode> = {
  shield: (<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>),
  award: (<><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></>),
  truck: (<><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>),
  fold: (<><polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" /><line x1="14" y1="10" x2="21" y2="3" /><line x1="3" y1="21" x2="10" y2="14" /></>),
  recline: (<><path d="M4 20h13" /><path d="M6 20v-7" /><path d="M6 13l4-9" /><path d="M6 13h9l3 7" /></>),
  joystick: (<><circle cx="12" cy="6" r="3" /><line x1="12" y1="9" x2="12" y2="15" /><rect x="4" y="15" width="16" height="5" rx="1.5" /></>),
  wrench: (<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />),
};

function Icon({ name, size = 22 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const url = `${siteConfig.siteUrl}/${locale}`;

  return {
    title: t('title'),
    description: t('description'),
    alternates: seoAlternates(locale),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url,
      siteName: siteConfig.brandName,
      type: 'website',
      locale: locale === 'ms' ? 'ms_MY' : locale === 'zh' ? 'zh_CN' : 'en_MY',
      images: ogImages(locale),
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const tMeta = await getTranslations({ locale, namespace: 'metadata' });
  const tHero = await getTranslations({ locale, namespace: 'hero' });
  const tProducts = await getTranslations({ locale, namespace: 'products' });
  const tSteps = await getTranslations({ locale, namespace: 'howItWorks' });
  const tGallery = await getTranslations({ locale, namespace: 'gallery' });
  const tReviews = await getTranslations({ locale, namespace: 'reviews' });
  const tFaq = await getTranslations({ locale, namespace: 'faq' });
  const tLocations = await getTranslations({ locale, namespace: 'locations' });
  const tFinal = await getTranslations({ locale, namespace: 'finalCta' });

  const waHref = waRedirect(locale);
  const products = await getProducts();
  const product = products[0] ?? null;

  const rentPrice = product?.rental_price ?? 400;
  const buyPrice = product?.sale_price ?? 2400;
  const productName = product?.name ?? tProducts('name');
  const productBlurb = product?.description ?? tProducts('description');

  const dbPhotos: ShowcasePhoto[] = (product?.photos ?? [])
    .map((photo, i) => {
      const src = toLocalSrc(photo.url);
      if (!src) return null;
      return {
        src,
        alt: photo.alt_text ?? (i === 0 ? tProducts('photoAltUnfolded') : tProducts('photoAltFolded')),
        label: i === 0 ? tProducts('thumbUnfolded') : tProducts('thumbFolded'),
      };
    })
    .filter((p): p is ShowcasePhoto => p !== null);

  const photos: ShowcasePhoto[] =
    dbPhotos.length > 0
      ? dbPhotos
      : [
          { src: PHOTO_FALLBACK[0], alt: tProducts('photoAltUnfolded'), label: tProducts('thumbUnfolded') },
          { src: PHOTO_FALLBACK[1], alt: tProducts('photoAltFolded'), label: tProducts('thumbFolded') },
        ];

  const callouts = [0, 1, 2, 3].map((i) => tHero(`callouts.${i}`));
  const USP_ICONS = ['shield', 'award', 'truck'] as const;
  const uspItems = [0, 1, 2].map((i) => ({
    eyebrow: t(`usp.items.${i}.eyebrow`),
    label: t(`usp.items.${i}.label`),
    icon: USP_ICONS[i],
  }));
  const SPEC_ICONS = ['fold', 'recline', 'joystick', 'award', 'wrench'] as const;
  const steps = [0, 1, 2].map((i) => ({
    title: tSteps(`steps.${i}.title`),
    description: tSteps(`steps.${i}.description`),
    when: tSteps(`steps.${i}.when`),
    imageAlt: tSteps(`steps.${i}.imageAlt`),
    src: `/brand/step-${i + 1}.png`,
  }));
  const galleryItems = [0, 1, 2, 3, 4, 5].map((i) => ({
    src: `/gallery/${i + 1}.png`,
    alt: tGallery(`alts.${i}`),
    caption: tGallery(`captions.${i}`),
  }));
  const faqs = [0, 1, 2, 3, 4, 5].map((i) => ({
    question: tFaq(`items.${i}.question`),
    answer: tFaq(`items.${i}.answer`),
  }));
  const locationsByRegion = getLocationsByRegion();
  const starLabel = `${tReviews('rating')} / 5`;

  return (
    <>
      <PageStyles />
      <LocalBusinessSchema locale={locale} />
      <ProductSchema name={tMeta('title')} description={tMeta('description')} locale={locale} />
      <FAQSchema faqs={faqs} />

      <FomoBanner locale={locale as 'en' | 'ms' | 'zh'} />
      <SiteHeader contact={<ContactNumber locale={locale} page="/" />} />

      {/* ── Hero: the chair, annotated ─────────────────────────────────── */}
      <section className="ew-hero">
        <div className="ew-wrap ew-hero__inner">
          <div className="ew-hero__copy">
            <span className="ew-eyebrow">{tHero('badge')}</span>
            <h1>
              {tHero('h1')} {tHero('h1Highlight')} {tHero('h1Suffix')}
            </h1>
            <h2>{tHero('subheadline')}</h2>
            <div className="ew-hero__ctas">
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="wa-btn">
                <WhatsAppIcon size={18} />
                {tHero('ctaPrimary')}
              </a>
              <a href="#products" className="ghost-btn">
                {tHero('ctaSecondary')}
              </a>
            </div>
          </div>

          <div className="ew-diagram">
            <Image
              className="ew-diagram__chair"
              src={photos[0].src}
              alt={photos[0].alt}
              width={1100}
              height={825}
              sizes="(min-width: 900px) 520px, 88vw"
              priority
            />
            {/* Desktop: fine lines from the label to a dot on the chair.
                Below 900px there is no room for them, so the same four facts
                render as the list underneath. The chair is photographed from
                the front, so its right armrest — where the joystick sits — is
                on the viewer's LEFT; the joystick callout goes on that side. */}
            <span className="ew-callout ew-callout--l ew-callout--1">
              <span>{callouts[2]}</span>
              <span className="ew-callout__line" />
              <span className="ew-callout__dot" />
            </span>
            <span className="ew-callout ew-callout--l ew-callout--2">
              <span>{callouts[1]}</span>
              <span className="ew-callout__line" />
              <span className="ew-callout__dot" />
            </span>
            <span className="ew-callout ew-callout--r ew-callout--3">
              <span>{callouts[0]}</span>
              <span className="ew-callout__line" />
              <span className="ew-callout__dot" />
            </span>
            <span className="ew-callout ew-callout--r ew-callout--4">
              <span>{callouts[3]}</span>
              <span className="ew-callout__line" />
              <span className="ew-callout__dot" />
            </span>
            <ul className="ew-spec-list">
              {callouts.map((line) => (
                <li key={line}>
                  <i aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 3-point USP bar ────────────────────────────────────────────── */}
      <div className="ew-usp">
        <div className="ew-wrap ew-usp__grid">
          {uspItems.map((item) => (
            <div className="ew-usp__item" key={item.label}>
              <span className="ew-usp__icon"><Icon name={item.icon} /></span>
              <span className="ew-mono">{item.eyebrow}</span>
              <b>{item.label}</b>
            </div>
          ))}
        </div>
      </div>

      {/* ── Product ────────────────────────────────────────────────────── */}
      <section className="ew-sec" id="products">
        <div className="ew-wrap">
          <div className="ew-head">
            <span className="ew-eyebrow">{tProducts('eyebrow')}</span>
            <h3>{tProducts('sectionHeading')}</h3>
            <p>{tProducts('sectionSubheading')}</p>
          </div>

          <div className="ew-prod__grid">
            <ProductShowcase photos={photos} />

            <div className="ew-prod__info">
              <h4>{productName}</h4>
              <p className="ew-prod__blurb">{productBlurb}</p>

              <div className="ew-rates">
                <div className="ew-rate">
                  <span className="ew-mono">{tProducts('rentLabel')}</span>
                  <b>{formatRM(rentPrice)}</b>
                  <small>{tProducts('perMonth')}</small>
                </div>
                <div className="ew-rate">
                  <span className="ew-mono">{tProducts('buyLabel')}</span>
                  <b>{formatRM(buyPrice)}</b>
                  <small>
                    {tProducts('wasPrefix')} {tProducts('rrp')}
                  </small>
                </div>
              </div>

              <dl className="ew-specs">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <dt>
                      <span className="ew-specs__icon"><Icon name={SPEC_ICONS[i]} size={18} /></span>
                      <span className="ew-mono">{tProducts(`specs.${i}.label`)}</span>
                    </dt>
                    <dd>{tProducts(`specs.${i}.value`)}</dd>
                  </div>
                ))}
              </dl>

              <a href={waHref} target="_blank" rel="noopener noreferrer" className="wa-btn">
                <WhatsAppIcon size={18} />
                {tProducts('cta')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Delivery steps ─────────────────────────────────────────────── */}
      <section className="ew-sec ew-steps" id="how-it-works">
        <div className="ew-wrap">
          <div className="ew-head">
            <span className="ew-eyebrow">{tSteps('eyebrow')}</span>
            <h3>{tSteps('heading')}</h3>
            <p>{tSteps('subheading')}</p>
          </div>

          <ol className="ew-steps__list">
            {steps.map((step) => (
              <li className="ew-step" key={step.src}>
                <figure className="ew-step__figure">
                  <Image
                    src={step.src}
                    alt={step.imageAlt}
                    width={1100}
                    height={825}
                    sizes="(min-width: 900px) 370px, 92vw"
                  />
                  <figcaption className="ew-step__when ew-mono">{step.when}</figcaption>
                </figure>
                <div className="ew-step__body">
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* CLAUDE.md: the numbered process section must close with a CTA —
              step one is "WhatsApp us", so this is the highest-intent moment
              on the page. */}
          <div className="ew-steps__cta">
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="wa-btn">
              <WhatsAppIcon size={18} />
              {tProducts('cta')}
            </a>
            <p>{tSteps('ctaNote')}</p>
          </div>
        </div>
      </section>

      {/* ── Gallery: the client's own jobs ─────────────────────────────── */}
      <section className="ew-sec">
        <div className="ew-wrap">
          <div className="ew-head">
            <span className="ew-eyebrow">{tGallery('eyebrow')}</span>
            <h3>{tGallery('heading')}</h3>
            <p>{tGallery('subheading')}</p>
          </div>
          <div className="ew-gal">
            {galleryItems.map((item) => (
              <figure key={item.src}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={800}
                  height={800}
                  sizes="(min-width: 900px) 370px, 45vw"
                />
                <figcaption className="ew-mono">{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Locations ──────────────────────────────────────────────────── */}
      <section className="ew-sec ew-sec--paper" id="locations">
        <div className="ew-wrap">
          <div className="ew-head">
            <span className="ew-eyebrow">{tLocations('eyebrow')}</span>
            <h3>{tLocations('heading')}</h3>
            <p>{tLocations('subheading')}</p>
          </div>
          <div className="ew-locs">
            {regionOrder.map((region) => {
              const regionLocations = locationsByRegion[region] ?? [];
              if (regionLocations.length === 0) return null;
              return (
                <div className="ew-locs__region" key={region}>
                  <h4>{region}</h4>
                  <div className="ew-locs__chips">
                    {regionLocations.map((loc) => (
                      <a key={loc.slug} href={`/${locale}/${siteConfig.productSlug}/${loc.slug}`}>
                        {loc.name}
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section className="ew-sec" id="faq">
        <div className="ew-wrap">
          <div className="ew-head">
            <span className="ew-eyebrow">{tFaq('eyebrow')}</span>
            <h3>{tFaq('heading')}</h3>
          </div>
          <div className="ew-faq">
            {faqs.map((faq, i) => (
              <details key={faq.question} open={i === 0}>
                <summary>
                  <h4>{faq.question}</h4>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ────────────────────────────────────────────────────── */}
      <section className="ew-sec ew-rev" id="reviews">
        <div className="ew-rev__bg">
          <Image src="/brand/reviews-bg.png" alt={tReviews('bgAlt')} fill sizes="100vw" />
        </div>
        <div className="ew-wrap">
          <figure className="ew-rev__quote">
            <span className="ew-eyebrow">{tReviews('eyebrow')}</span>
            <div className="ew-rating">
              <span className="ew-rating__g">
                <GoogleMark />
              </span>
              <b>{tReviews('rating')}</b>
              <Stars label={starLabel} />
              <span>{tReviews('ratingSuffix')}</span>
            </div>
            <blockquote>&ldquo;{tReviews('items.0.text')}&rdquo;</blockquote>
            <figcaption>
              {tReviews('items.0.name')}, {tReviews('items.0.location')}
            </figcaption>
          </figure>

          <div className="ew-rev__more">
            {[1, 2].map((i) => (
              <div key={i}>
                <p>&ldquo;{tReviews(`items.${i}.text`)}&rdquo;</p>
                <span>
                  {tReviews(`items.${i}.name`)}, {tReviews(`items.${i}.location`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────── */}
      {/* The dusk photo sits full-bleed BEHIND the copy under a navy overlay —
          it was generated dark with an empty centre for exactly this. */}
      <section className="ew-sec ew-fcta">
        <div className="ew-fcta__bg">
          <Image src="/brand/final-cta.png" alt={tFinal('bgAlt')} fill sizes="100vw" />
        </div>
        <div className="ew-wrap ew-fcta__body">
          <span className="ew-eyebrow ew-eyebrow--on-dark">{tFinal('eyebrow')}</span>
          <h3>{tFinal('heading')}</h3>
          <p>{tFinal('subheading')}</p>
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="wa-btn">
            <WhatsAppIcon size={18} />
            {tFinal('cta')}
          </a>
        </div>
      </section>

      <SiteFooter locale={locale as 'en' | 'ms' | 'zh'} page="/" />
    </>
  );
}
