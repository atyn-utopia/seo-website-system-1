// Close the ads readiness card in webcore — the last step of the Google flow.
//
// The three Google settings that gate a site running ads are the same three
// residual manual toggles this bundle hands back at the end of Phase 5. Until
// they are ticked in webcore, the performance marketers have no signal that the
// site is ready for them, so a finished setup still looks unfinished:
//
//   signals   google_signals       GA4 → Admin → Data collection → Google Signals ON
//   counting  conversion_counting  Ads → conversion action → Count → "One"
//   metrics   ga4_metrics_import   Ads → Data manager → GA4 → Import app and web metrics
//
// `signals` and `counting` are re-verified live by webcore on every read;
// `metrics` has no API that exposes it, so it can ONLY be confirmed by hand.
// Ticking an auto-verified item PINS it, so the live re-check stops overriding
// the answer — useful when a probe cannot see the account (`reason: refused`).
//
// Usage:
//   node ads-readiness.mjs --domain <domain>                       # read state, write nothing
//   node ads-readiness.mjs --domain <domain> --tick metrics
//   node ads-readiness.mjs --domain <domain> --tick all --yes
//   node ads-readiness.mjs --domain <domain> --pin-customer-id 123-456-7890
//
// Flags:
//   --domain <d>              the site's EXACT registered domain (never the *.vercel.app host)
//   --tick <a,b,c>            items to confirm: signals | counting | metrics | all
//   --untick <a,b,c>          set items back to not-done (mistaken tick)
//   --pin-customer-id <id>    pin the Ads customer id for the counting probe
//   --yes                     required when the tick COMPLETES the card (see below)
//   --json <path>             also write the final state as JSON
//
// ⚠️ Completing the last item notifies the performance marketers, ONCE. Only
// tick an item because the toggle is really on in the Google UI — never to tidy
// the card. That is why the completing tick needs an explicit --yes.
//
// Prerequisite: WEBCORE_API_KEY (scope `ads:write`) in the environment —
//   set -a && . ../../.env.local && set +a

import { writeFileSync } from 'node:fs';
import { parseArgs } from './lib/seo-plan.mjs';
import {
  ADS_READINESS_ITEMS, getAdsReadiness, tickAdsReadiness, pinAdsCustomerId, getApiKey,
} from './lib/webcore.mjs';

const args = parseArgs(process.argv.slice(2));

const DOMAIN = args.domain && args.domain !== true ? String(args.domain) : null;
if (!DOMAIN) {
  console.error('❌ --domain <domain> is required (the exact registered domain).');
  process.exit(1);
}
if (/\.vercel\.app$/.test(DOMAIN)) {
  console.error(`⚠️  "${DOMAIN}" is a deploy host. Most fleet sites are registered on their`);
  console.error('   paid domain — writing against the wrong key returns 2xx and orphans the row.');
  console.error('   Verify first: curl -s "https://webcore.utopiagroup.com.my/api/public/phone-numbers?website=<candidate>"');
}

const API_KEY = getApiKey();
if (!API_KEY) {
  console.error('❌ WEBCORE_API_KEY is not set (scope `ads:write`).');
  console.error('   set -a && . ../../.env.local && set +a    # server-only; never commit it');
  process.exit(1);
}

/** Accept the short names the runbook uses, plus the canonical ids. */
const ALIASES = {
  signals: 'google_signals',
  google_signals: 'google_signals',
  counting: 'conversion_counting',
  conversion_counting: 'conversion_counting',
  metrics: 'ga4_metrics_import',
  import: 'ga4_metrics_import',
  ga4_metrics_import: 'ga4_metrics_import',
};

function resolveItems(raw) {
  const list = String(raw).split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (list.includes('all')) return [...ADS_READINESS_ITEMS];
  return list.map((name) => {
    const id = ALIASES[name];
    if (!id) {
      console.error(`❌ unknown item "${name}" — use: signals | counting | metrics | all`);
      process.exit(1);
    }
    return id;
  });
}

const LABELS = {
  google_signals: 'GA4 → Google Signals ON',
  conversion_counting: 'Ads → conversion Count = "One"',
  ga4_metrics_import: 'Ads → Data manager → GA4 metrics import',
};

function printState(state) {
  const r = state.readiness ?? {};
  for (const item of ADS_READINESS_ITEMS) {
    const on = r[item] === true;
    const src = r[`${item}_source`];
    console.log(`   ${on ? '✅' : '⬜'} ${item.padEnd(20)} ${LABELS[item]}${src ? `  (${src})` : ''}`);
  }
  console.log(`   ${state.ready ? '🎉 ready — all three confirmed' : '⏳ not ready yet'}`);

  // A probe that cannot see the account reports why. Surfacing it stops the
  // "it says false but the toggle IS on" round trip — the fix is --pin-customer-id.
  const reasons = [
    ['signals', state.signalsProbe?.reason],
    ['counting', state.countingProbe?.reason],
    ['ads link', state.adsLink?.reason],
  ].filter(([, why]) => why);
  if (reasons.length) {
    console.log('   probe notes:');
    for (const [what, why] of reasons) console.log(`     · ${what}: ${why}`);
  }
}

// Resolve the item names BEFORE any network call — a typo should fail
// instantly, not after a round trip that prints a state we then discard.
const toTick = args.tick && args.tick !== true ? resolveItems(args.tick) : [];
const toUntick = args.untick && args.untick !== true ? resolveItems(args.untick) : [];

// ─── Read current state ───────────────────────────────────────────
console.log(`\n📋 Ads readiness — ${DOMAIN}\n`);
let state;
try {
  state = await getAdsReadiness(DOMAIN, API_KEY);
} catch (err) {
  console.error(`❌ ${err.message}`);
  process.exit(1);
}
console.log('   BEFORE:');
printState(state);

// ─── Pin the Ads customer id ──────────────────────────────────────
if (args['pin-customer-id'] && args['pin-customer-id'] !== true) {
  const customerId = String(args['pin-customer-id']);
  console.log(`\n📌 Pinning Ads customer id ${customerId} …`);
  try {
    await pinAdsCustomerId(DOMAIN, customerId, API_KEY);
    console.log('   ✅ pinned — the counting check will stop guessing.');
  } catch (err) {
    console.error(`   ❌ ${err.message}`);
    process.exit(1);
  }
}

// ─── Tick / untick ────────────────────────────────────────────────
if (toTick.length) {
  const current = state.readiness ?? {};
  const pending = toTick.filter((i) => current[i] !== true);
  const already = toTick.filter((i) => current[i] === true);
  for (const i of already) console.log(`\n   ↷ ${i} already confirmed — skipping.`);

  // Would this run leave all three done? That is the notification moment.
  const after = new Set([...ADS_READINESS_ITEMS.filter((i) => current[i] === true), ...toTick]);
  const completes = pending.length > 0 && ADS_READINESS_ITEMS.every((i) => after.has(i));

  if (completes && !args.yes) {
    console.error('\n⚠️  This would complete the card, which notifies the performance marketers ONCE.');
    console.error('   Confirm every toggle is genuinely ON in the Google UI, then re-run with --yes.');
    console.error('   Screenshots: https://websitebuilder.utopiaai.my/google (§04)');
    process.exit(1);
  }

  for (const item of pending) {
    console.log(`\n✅ Confirming ${item} — ${LABELS[item]}`);
    try {
      await tickAdsReadiness(DOMAIN, item, true, API_KEY);
      console.log('   done.');
    } catch (err) {
      console.error(`   ❌ ${err.message}`);
      process.exit(1);
    }
  }
  if (completes) console.log('\n📣 Card complete — the performance marketers have been notified.');
}

for (const item of toUntick) {
  console.log(`\n↩️  Un-confirming ${item} …`);
  try {
    await tickAdsReadiness(DOMAIN, item, false, API_KEY);
    console.log('   done.');
  } catch (err) {
    console.error(`   ❌ ${err.message}`);
    process.exit(1);
  }
}

// ─── Final state ──────────────────────────────────────────────────
if (toTick.length || toUntick.length || args['pin-customer-id']) {
  state = await getAdsReadiness(DOMAIN, API_KEY);
  console.log('\n   AFTER:');
  printState(state);
}

if (args.json && args.json !== true) {
  writeFileSync(String(args.json), JSON.stringify(state, null, 2));
  console.log(`\n   wrote ${args.json}`);
}

if (!state.ready) {
  const left = ADS_READINESS_ITEMS.filter((i) => state.readiness?.[i] !== true);
  console.log(`\n⏳ Still owed: ${left.join(', ')}`);
  console.log('   Flip the toggle in Google first, THEN tick it here.');
}
console.log('');
