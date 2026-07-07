#!/usr/bin/env node
/**
 * enrich-images.mjs
 *
 * Enriches atlas data files with an optional "image" field (Wikipedia thumbnail URL).
 *
 * Usage:
 *   node scripts/enrich-images.mjs [file1 file2 ...]
 *
 * Defaults to the six atlas data files (paths relative to project root).
 * Node 18+, ESM, zero dependencies.
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const DEFAULT_FILES = [
  'data/monuments.json',
  'data/ingredients.json',
  'data/dishes.json',
  'data/sports.json',
  'data/animals.json',
  'data/plants.json',
];

const USER_AGENT = 'AtlasVoyageur/1.0 (personal travel atlas)';
const CONCURRENCY = 3; // max 5 allowed; 3 keeps us under Wikipedia's burst limit
const BATCH_DELAY_MS = 350;
const RETRY_BACKOFF_MS = [2000, 5000, 10000];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Shared cooldown: when any request gets a 429, all requests pause until
// this timestamp so parallel requests don't keep hammering the API.
let cooldownUntil = 0;

async function respectCooldown() {
  const wait = cooldownUntil - Date.now();
  if (wait > 0) await sleep(wait);
}

/**
 * Fetch a Wikipedia REST summary. Returns the parsed JSON body, or null on
 * 404 / non-retryable errors. Retries on 429/5xx/network errors with
 * increasing backoff (2s, 5s, 10s), honoring Retry-After when present.
 */
async function fetchSummary(lang, title, attempt = 0) {
  await respectCooldown();
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  let res;
  try {
    res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      redirect: 'follow',
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err) {
    if (attempt < RETRY_BACKOFF_MS.length) {
      await sleep(RETRY_BACKOFF_MS[attempt]);
      return fetchSummary(lang, title, attempt + 1);
    }
    console.warn(`  ! network error for ${lang}:${title} — ${err.message}`);
    return null;
  }

  if (res.status === 404) return null;

  if (res.status === 429 || res.status >= 500) {
    if (attempt < RETRY_BACKOFF_MS.length) {
      const retryAfterSec = Number(res.headers.get('retry-after')) || 0;
      const backoff = Math.max(RETRY_BACKOFF_MS[attempt], retryAfterSec * 1000);
      if (res.status === 429) {
        cooldownUntil = Math.max(cooldownUntil, Date.now() + backoff);
      }
      await sleep(backoff);
      return fetchSummary(lang, title, attempt + 1);
    }
    console.warn(`  ! HTTP ${res.status} for ${lang}:${title} (after retries) — skipping`);
    return null;
  }

  if (!res.ok) {
    console.warn(`  ! HTTP ${res.status} for ${lang}:${title} — skipping`);
    return null;
  }

  try {
    return await res.json();
  } catch (err) {
    console.warn(`  ! bad JSON for ${lang}:${title} — ${err.message}`);
    return null;
  }
}

/** Extract a usable thumbnail URL from a summary response, or null. */
function thumbnailFrom(summary) {
  if (!summary) return null;
  if (summary.type === 'disambiguation') return null;
  return summary.thumbnail?.source ?? null;
}

/**
 * Find an image URL for one entry: en.wikipedia first (name.en),
 * fallback to fr.wikipedia (name.fr). Returns URL string or null.
 */
async function findImage(entry) {
  const nameEn = entry?.name?.en;
  const nameFr = entry?.name?.fr;

  if (nameEn) {
    const image = thumbnailFrom(await fetchSummary('en', nameEn));
    if (image) return image;
  }
  if (nameFr) {
    const image = thumbnailFrom(await fetchSummary('fr', nameFr));
    if (image) return image;
  }
  return null;
}

async function enrichFile(relPath) {
  const absPath = path.isAbsolute(relPath) ? relPath : path.join(PROJECT_ROOT, relPath);
  const raw = await readFile(absPath, 'utf8');
  const entries = JSON.parse(raw);

  if (!Array.isArray(entries)) {
    console.warn(`Skipping ${relPath}: not a JSON array`);
    return null;
  }

  const todo = entries.filter((e) => e && typeof e === 'object' && !e.image);
  console.log(`\n${relPath}: ${entries.length} entries, ${todo.length} to enrich`);

  let found = 0;
  let missed = 0;

  for (let i = 0; i < todo.length; i += CONCURRENCY) {
    const batch = todo.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (entry) => {
        try {
          return await findImage(entry);
        } catch (err) {
          console.warn(`  ! failed for ${entry.id ?? 'unknown'} — ${err.message}`);
          return null;
        }
      }),
    );

    batch.forEach((entry, j) => {
      const image = results[j];
      if (image) {
        entry.image = image;
        found += 1;
      } else {
        missed += 1;
        console.log(`  - no image: ${entry.id ?? entry?.name?.en ?? 'unknown'}`);
      }
    });

    if (i % 30 < CONCURRENCY) {
      console.log(`  … ${Math.min(i + CONCURRENCY, todo.length)}/${todo.length} processed (${found} found)`);
      // checkpoint so a crash doesn't lose everything
      await writeFile(absPath, JSON.stringify(entries, null, 2) + '\n', 'utf8');
    }
    if (i + CONCURRENCY < todo.length) await sleep(BATCH_DELAY_MS);
  }

  await writeFile(absPath, JSON.stringify(entries, null, 2) + '\n', 'utf8');

  const withImage = entries.filter((e) => e && e.image).length;
  return {
    file: relPath,
    total: entries.length,
    found,
    missed,
    withImage,
  };
}

async function main() {
  const files = process.argv.slice(2).length > 0 ? process.argv.slice(2) : DEFAULT_FILES;
  const stats = [];

  for (const file of files) {
    try {
      const result = await enrichFile(file);
      if (result) stats.push(result);
    } catch (err) {
      console.error(`Error processing ${file}: ${err.message}`);
    }
  }

  console.log('\n=== Stats ===');
  for (const s of stats) {
    const pct = ((s.withImage / s.total) * 100).toFixed(1);
    console.log(
      `${s.file}: total=${s.total}, images found (this run)=${s.found}, misses=${s.missed}, coverage=${s.withImage}/${s.total} (${pct}%)`,
    );
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
