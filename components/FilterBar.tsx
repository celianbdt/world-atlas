"use client";

import { Dispatch, SetStateAction } from "react";
import type { Category, Locale } from "@/lib/types";
import { CATEGORY_META, ALL_CATEGORY_COLOR, UI_TEXT } from "@/lib/types";
import AtlasLogo from "./AtlasLogo";

interface Props {
  activeCategories: Set<Category>;
  setActiveCategories: Dispatch<SetStateAction<Set<Category>>>;
  locale: Locale;
  setLocale: Dispatch<SetStateAction<Locale>>;
  counts: Record<string, number>;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  total: number;
}

const CATEGORIES: Category[] = ["monument", "ingredient", "dish", "sport", "animal", "plant"];

export default function FilterBar({
  activeCategories,
  setActiveCategories,
  locale,
  setLocale,
  counts,
  query,
  setQuery,
  total,
}: Props) {
  function toggleCategory(cat: Category) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function allOn() {
    setActiveCategories(new Set(CATEGORIES));
  }

  function onlyOne(cat: Category) {
    setActiveCategories(new Set([cat]));
  }

  const allActive = activeCategories.size === CATEGORIES.length;
  const grandTotal = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="glass-panel rounded-panel p-3 shadow-panel">
      {/* Row 1 — lockup + language toggle */}
      <div className="flex items-center gap-2.5">
        <AtlasLogo size="sm" />
        <span className="font-display text-[15px] font-semibold tracking-wide text-linen-100">
          {UI_TEXT.title[locale]}
        </span>

        <div className="flex-1" />

        <div className="flex items-center rounded-full border border-linen-500/25 bg-ink-900/60 p-0.5 text-[11px] font-mono">
          <button
            onClick={() => setLocale("fr")}
            className={`rounded-full px-2.5 py-1 font-bold tracking-wide transition ${
              locale === "fr" ? "bg-cat-monument text-ink-900" : "text-linen-400 hover:text-linen-200"
            }`}
          >
            FR
          </button>
          <button
            onClick={() => setLocale("en")}
            className={`rounded-full px-2.5 py-1 font-bold tracking-wide transition ${
              locale === "en" ? "bg-cat-monument text-ink-900" : "text-linen-400 hover:text-linen-200"
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Row 2 — category chips, horizontal scroll on mobile */}
      <div className="no-scrollbar mt-2.5 flex items-center gap-1.5 overflow-x-auto md:flex-wrap">
        <button
          onClick={allOn}
          className="flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition"
          style={
            allActive
              ? { backgroundColor: ALL_CATEGORY_COLOR, borderColor: ALL_CATEGORY_COLOR, color: "#160F07" }
              : { borderColor: "rgba(224,207,168,.16)", background: "rgba(255,255,255,.03)", color: "#C9B78D" }
          }
        >
          <span>{UI_TEXT.filterAll[locale]}</span>
          <span className="font-mono text-[10px] opacity-80">{grandTotal}</span>
        </button>

        {CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat];
          const active = activeCategories.has(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              onDoubleClick={() => onlyOne(cat)}
              title={UI_TEXT.isolateHint[locale]}
              className="group flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition"
              style={
                active
                  ? { backgroundColor: meta.color, borderColor: meta.color, color: "#160F07" }
                  : { borderColor: "rgba(224,207,168,.16)", background: "rgba(255,255,255,.03)", color: "#C9B78D" }
              }
            >
              <span
                className="h-2 w-2 flex-shrink-0 rounded-full"
                style={{ backgroundColor: active ? "#160F07" : meta.color }}
              />
              <span>{meta.label[locale]}</span>
              <span className="font-mono text-[10px] opacity-80">{counts[cat] ?? 0}</span>
            </button>
          );
        })}
      </div>

      {/* Row 3 — search */}
      <div className="mt-2.5 flex items-center gap-2">
        <div className="relative flex-1 md:max-w-xs">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={UI_TEXT.searchPlaceholder[locale]}
            className="w-full rounded-full border border-linen-500/20 bg-ink-900/60 px-3 py-1.5 text-xs text-linen-100 placeholder-linen-500 outline-none transition focus:border-cat-monument/60"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-linen-500 hover:text-linen-200"
              aria-label="clear"
            >
              ×
            </button>
          )}
        </div>
        <div className="hidden font-mono text-[10px] uppercase tracking-widest text-linen-500 md:block">
          {total} {UI_TEXT.points[locale]}
        </div>
      </div>
    </div>
  );
}
