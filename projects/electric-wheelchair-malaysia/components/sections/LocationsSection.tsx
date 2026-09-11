import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { regionOrder, getLocationsByRegion } from '@/config/locations';

/** Every location page, grouped by region — the site's internal-link spine. */
export default async function LocationsSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'locations' });
  const byRegion = getLocationsByRegion();

  return (
    <section className="ew-sec ew-sec--paper" id="locations">
      <div className="ew-wrap">
        <div className="ew-head">
          <span className="ew-eyebrow">{t('eyebrow')}</span>
          <h3>{t('heading')}</h3>
          <p>{t('subheading')}</p>
        </div>
        <div className="ew-locs">
          {regionOrder.map((region) => {
            const regionLocations = byRegion[region] ?? [];
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
  );
}
