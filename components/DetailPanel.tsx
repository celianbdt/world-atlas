"use client";

import type { AtlasPoint, Locale } from "@/lib/types";
import { CATEGORY_META, UI_TEXT } from "@/lib/types";
import CountryTag from "./CountryTag";

interface Props {
  point: AtlasPoint;
  locale: Locale;
  onClose: () => void;
}

export default function DetailPanel({ point, locale, onClose }: Props) {
  const meta = CATEGORY_META[point.category];
  const otherLocale: Locale = locale === "fr" ? "en" : "fr";

  return (
    <aside
      key={point.id}
      className="animate-panel glass-panel shadow-panel fixed inset-x-0 bottom-0 z-[600] flex h-[85vh] w-full flex-col overflow-hidden rounded-t-panel-lg md:absolute md:inset-auto md:right-0 md:top-0 md:h-full md:w-full md:max-w-[440px] md:rounded-t-none md:rounded-l-panel-lg md:border-y-0 md:border-r-0"
    >
      {/* mobile drag handle */}
      <div className="flex justify-center pt-2.5 md:hidden">
        <div className="h-1 w-10 rounded-full bg-linen-500/30" />
      </div>

      <header
        className={`relative flex-shrink-0 border-b border-ink-600 px-5 pb-4 pt-4 md:pt-6 ${
          point.image ? "flex min-h-[184px] flex-col justify-end" : ""
        }`}
        style={{
          background: `linear-gradient(165deg, ${meta.color}2e 0%, #171009 75%)`,
        }}
      >
        {point.image && (
          <>
            <img
              src={point.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "sepia(.18) saturate(.9)" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${meta.color}30 0%, rgba(23,16,9,.45) 40%, rgba(23,16,9,.94) 100%)`,
              }}
            />
          </>
        )}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-linen-500/25 bg-ink-900/70 text-lg leading-none text-linen-300 transition hover:border-linen-300/50 hover:text-linen-100"
          aria-label={UI_TEXT.close[locale]}
        >
          ×
        </button>

        <div className="relative">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.24em]"
            style={{ backgroundColor: `${meta.color}40`, color: point.image ? "#F4ECD8" : meta.color }}
          >
            {meta.label[locale]}
          </span>

          <h2 className="mt-3 font-display text-[32px] font-bold leading-[1.08] text-linen-100">
            {point.name[locale]}
          </h2>
          {point.name[locale] !== point.name[otherLocale] && (
            <p className="mt-0.5 font-display text-base italic text-linen-300">
              {point.name[otherLocale]}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-linen-200">
            <CountryTag countryCode={point.countryCode} />
            <span className="font-medium">{point.country[locale]}</span>
            <span className="text-linen-400">·</span>
            <span className="text-linen-300">{point.region}</span>
          </div>
        </div>
      </header>

      <div className="thin-scroll flex-1 overflow-y-auto px-5 py-5">
        <section>
          <h3 className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-linen-500">
            {UI_TEXT.description[locale]}
          </h3>
          <p className="text-[15px] leading-relaxed text-linen-200">{point.description[locale]}</p>
        </section>

        <section className="mt-5 border-l-2 border-ink-600 pl-3.5">
          <h3 className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-linen-500">
            {otherLocale === "fr" ? "Français" : "English"}
          </h3>
          <p className="font-display text-[15px] italic leading-relaxed text-linen-400">
            {point.description[otherLocale]}
          </p>
        </section>

        {point.tags && point.tags.length > 0 && (
          <section className="mt-6">
            <h3 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-linen-500">
              {UI_TEXT.tags[locale]}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {point.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-linen-500/20 bg-ink-900/60 px-2.5 py-1 text-[11px] text-linen-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="mt-6">
          <h3 className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-linen-500">
            {UI_TEXT.coordinates[locale]}
          </h3>
          <p className="font-mono text-xs text-linen-400">
            {Math.abs(point.coordinates[0]).toFixed(4)}° {point.coordinates[0] >= 0 ? "N" : "S"} ·{" "}
            {Math.abs(point.coordinates[1]).toFixed(4)}° {point.coordinates[1] >= 0 ? "E" : "W"}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${point.coordinates[0]},${point.coordinates[1]}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition"
              style={{ backgroundColor: meta.color, color: "#160F07" }}
            >
              Google Maps ↗
            </a>
            <a
              href={`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(point.name.en)}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-linen-500/25 px-3.5 py-1.5 text-xs font-semibold text-linen-200 transition hover:border-linen-300/50"
            >
              Wikipédia ↗
            </a>
          </div>
        </section>
      </div>
    </aside>
  );
}
