'use client';

import { useMemo, useState } from 'react';

export interface FinderTown {
  slug: string;
  name: string;
  state: string;
  href: string;
}

export interface FinderLabels {
  placeholder: string;
  all: string;
  /** "{n} towns" — the count next to the search box. */
  count: string;
  /** "Showing {shown} of {n} — …" under the list when it is collapsed. */
  more: string;
  /** "Show all {n}" — the button that expands the collapsed list. */
  showAll: string;
  /** "No town called “{q}” yet — …" */
  empty: string;
}

const INITIAL = 12;

/**
 * Type-to-find over the town list. Every town link is rendered on the server
 * and stays in the DOM — filtering only toggles `hidden` — so crawlers see all
 * 84 internal links while a phone user sees twelve until they type or pick a
 * state.
 */
export default function LocationFinder({
  towns,
  states,
  labels,
}: {
  towns: FinderTown[];
  states: string[];
  labels: FinderLabels;
}) {
  const [query, setQuery] = useState('');
  const [state, setState] = useState('');
  const [expanded, setExpanded] = useState(false);

  const q = query.trim().toLowerCase();
  const filtering = q.length > 0 || state.length > 0;

  const matches = useMemo(
    () => towns.filter((t) => (!state || t.state === state) && (!q || t.name.toLowerCase().includes(q))),
    [towns, state, q],
  );
  const visible = new Set((filtering || expanded ? matches : matches.slice(0, INITIAL)).map((t) => t.slug));
  const fill = (s: string) => s.replace('{n}', String(matches.length)).replace('{shown}', String(INITIAL)).replace('{q}', query.trim());

  return (
    <div className="ew-find">
      <label className="ew-find__search">
        <input
          id="location-finder"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.placeholder}
          autoComplete="off"
          aria-label={labels.placeholder}
        />
        <span aria-live="polite">{fill(labels.count)}</span>
      </label>

      <div className="ew-find__filters" role="group">
        <button type="button" aria-pressed={state === ''} onClick={() => setState('')}>
          {labels.all}
        </button>
        {states.map((s) => (
          <button key={s} type="button" aria-pressed={state === s} onClick={() => setState(state === s ? '' : s)}>
            {s}
          </button>
        ))}
      </div>

      <div className="ew-find__list">
        {towns.map((t) => (
          <a key={t.slug} href={t.href} hidden={!visible.has(t.slug)}>
            <b>{t.name}</b>
            <small>{t.state}</small>
          </a>
        ))}
      </div>

      {matches.length === 0 && <p className="ew-find__empty">{fill(labels.empty)}</p>}

      {!filtering && !expanded && matches.length > INITIAL && (
        <p className="ew-find__more">
          {fill(labels.more)}{' '}
          <button type="button" onClick={() => setExpanded(true)}>
            {fill(labels.showAll)}
          </button>
        </p>
      )}
    </div>
  );
}
