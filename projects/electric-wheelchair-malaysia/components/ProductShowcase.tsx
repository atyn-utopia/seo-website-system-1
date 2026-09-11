'use client';

import Image from 'next/image';
import { useState } from 'react';

export interface ShowcasePhoto {
  src: string;
  alt: string;
  /** Short mono label under the thumbnail, e.g. "unfolded". */
  label: string;
}

/**
 * Product photo with thumbnails under it. One photo shows the chair open, the
 * other folded — the folded shot is the only proof of the "folds for the car
 * boot" spec row, so it is worth a click rather than a second section.
 *
 * A client component purely for the thumbnail state; the photos themselves are
 * chosen on the server from the webcore product row.
 */
export default function ProductShowcase({ photos }: { photos: ShowcasePhoto[] }) {
  const [active, setActive] = useState(0);
  const current = photos[active] ?? photos[0];

  return (
    <div className="ew-prod-media">
      <figure className="ew-prod-figure">
        <Image
          src={current.src}
          alt={current.alt}
          width={1100}
          height={825}
          sizes="(min-width: 900px) 520px, 92vw"
          priority
        />
      </figure>

      {photos.length > 1 && (
        <div className="ew-prod-thumbs">
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              className="ew-prod-thumb"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
            >
              <Image src={photo.src} alt={photo.alt} width={220} height={165} sizes="180px" />
              <span>{photo.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
