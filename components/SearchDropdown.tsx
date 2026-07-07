"use client";

import { useMemo } from "react";
import { ALL_POINTS } from "@/lib/data";
import { COUNTRY_INFO } from "@/lib/countries";
import type { AtlasPoint, Category, Locale } from "@/lib/types";
import { CATEGORY_META, UI_TEXT } from "@/lib/types";
import CountryTag from "./CountryTag";

interface Props {
  query: string;
  locale: Locale;
  onPick: (p: AtlasPoint) => void;
}

const CATEGORY_ORDER: Category[] = ["monument", "ingredient", "dish", "sport", "animal", "plant"];
const MAX_PER_CATEGORY = 8;

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export default function SearchDropdown({ query, locale, onPick }: Props) {
  const q = norm(query.trim());

  const { grouped, total, countryCode, countryName, countryTotal } = useMemo(() => {
    const empty = {
      grouped: new Map<Category, AtlasPoint[]>(),
      total: 0,
      countryCode: null as string | null,
      countryName: "",
      countryTotal: 0,
    };
    if (q.length < 2) return empty;

    const matches = ALL_POINTS.filter(
      (p) =>
        norm(p.name.fr).includes(q) ||
        norm(p.name.en).includes(q) ||
        norm(p.region).includes(q) ||
        norm(p.country.fr).includes(q) ||
        norm(p.country.en).includes(q) ||
        (p.tags?.some((t) => norm(t).includes(q)) ?? false) ||
        norm(p.description.fr).includes(q) ||
        norm(p.description.en).includes(q),
    );

    // Country mode: query matches a country name → practical info card + full list
    let countryCode: string | null = null;
    let countryName = "";
    let countryTotal = 0;
    if (q.length >= 3) {
      const perCountry = new Map<string, { n: number; name: string }>();
      for (const p of ALL_POINTS) {
        if (norm(p.country.fr).includes(q) || norm(p.country.en).includes(q)) {
          const e = perCountry.get(p.countryCode) ?? { n: 0, name: p.country[locale] };
          e.n++;
          perCountry.set(p.countryCode, e);
        }
      }
      perCountry.forEach((v, k) => {
        if (v.n > countryTotal) {
          countryTotal = v.n;
          countryCode = k;
          countryName = v.name;
        }
      });
    }

    const grouped = new Map<Category, AtlasPoint[]>();
    for (const cat of CATEGORY_ORDER) {
      const items = matches.filter((p) => p.category === cat);
      if (items.length > 0) grouped.set(cat, items);
    }
    return { grouped, total: matches.length, countryCode, countryName, countryTotal };
  }, [q, locale]);

  if (q.length < 2) return null;

  const country = countryCode ? COUNTRY_INFO[countryCode] : undefined;

  return (
    <div className="glass-panel shadow-panel thin-scroll mt-2 max-h-[52vh] overflow-y-auto rounded-panel">
      {countryCode && (
        <div className="border-b border-ink-600 px-4 py-3.5">
          <div className="flex items-center gap-2">
            <CountryTag countryCode={countryCode} />
            <span className="font-display text-lg font-semibold text-linen-100">
              {country?.name?.[locale] ?? countryName}
            </span>
            <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-linen-500">
              {countryTotal} {UI_TEXT.points[locale]}
            </span>
          </div>
          {country && (
            <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] md:grid-cols-3">
              {(
                [
                  [UI_TEXT.safety, country.safety[locale]],
                  [UI_TEXT.internet, country.internet[locale]],
                  [UI_TEXT.bestSeason, country.bestSeason[locale]],
                  [UI_TEXT.currency, country.currency],
                  [UI_TEXT.language, country.language[locale]],
                  [UI_TEXT.plug, country.plug],
                ] as const
              ).map(([label, value]) => (
                <div key={label.en}>
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-linen-500">
                    {label[locale]}
                  </div>
                  <div className="text-linen-200">{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {total === 0 ? (
        <div className="px-4 py-5 text-center text-xs text-linen-400">
          {UI_TEXT.noResults[locale]}
        </div>
      ) : (
        <>
          {Array.from(grouped.entries()).map(([cat, items]) => {
            const meta = CATEGORY_META[cat];
            return (
              <div key={cat} className="border-b border-ink-600/60 last:border-b-0">
                <div className="flex items-center gap-2 px-4 pb-1 pt-3">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.color }} />
                  <span
                    className="font-mono text-[9px] font-bold uppercase tracking-[0.24em]"
                    style={{ color: meta.color }}
                  >
                    {meta.label[locale]}
                  </span>
                  <span className="font-mono text-[9px] text-linen-500">{items.length}</span>
                </div>
                {items.slice(0, MAX_PER_CATEGORY).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onPick(p)}
                    className="flex w-full items-baseline gap-2 px-4 py-1.5 text-left transition hover:bg-ink-700/60"
                  >
                    <span className="text-[13px] font-medium text-linen-100">{p.name[locale]}</span>
                    <span className="truncate text-[11px] text-linen-400">
                      {p.region} · {p.country[locale]}
                    </span>
                  </button>
                ))}
                {items.length > MAX_PER_CATEGORY && (
                  <div className="px-4 pb-2 font-mono text-[9px] uppercase tracking-widest text-linen-500">
                    +{items.length - MAX_PER_CATEGORY}
                  </div>
                )}
              </div>
            );
          })}
          <div className="px-4 py-2 font-mono text-[9px] uppercase tracking-widest text-linen-500">
            {total} {UI_TEXT.results[locale]}
          </div>
        </>
      )}
    </div>
  );
}
