import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

/** The client's own job photos — the proof section. Six real images, never generated. */
export default async function GallerySection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'gallery' });
  const items = [0, 1, 2, 3, 4, 5].map((i) => ({
    src: `/gallery/${i + 1}.webp`,
    alt: t(`alts.${i}`),
    caption: t(`captions.${i}`),
  }));

  return (
    <section className="ew-sec">
      <div className="ew-wrap">
        <div className="ew-head">
          <span className="ew-eyebrow">{t('eyebrow')}</span>
          <h3>{t('heading')}</h3>
          <p>{t('subheading')}</p>
        </div>
        <div className="ew-gal">
          {items.map((item) => (
            <figure key={item.src}>
              <Image src={item.src} alt={item.alt} width={800} height={800} sizes="(min-width: 900px) 370px, 45vw" />
              <figcaption className="ew-mono">{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
