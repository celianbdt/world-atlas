"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import FilterBar from "@/components/FilterBar";
import DetailPanel from "@/components/DetailPanel";
import SearchDropdown from "@/components/SearchDropdown";
import { LoadingScreen, EmptyResultsCard } from "@/components/StateScreens";
import { ALL_POINTS, countByCategory } from "@/lib/data";
import type { FlyTarget } from "@/components/AtlasMap";
import type { AtlasPoint, Category, Locale } from "@/lib/types";
import { UI_TEXT } from "@/lib/types";

const AtlasMap = dynamic(() => import("@/components/AtlasMap"), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

export default function HomePage() {
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(
    new Set(["monument", "ingredient", "dish", "sport", "animal", "plant"] as Category[]),
  );
  const [locale, setLocale] = useState<Locale>("fr");
  const [selected, setSelected] = useState<AtlasPoint | null>(null);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [flyTarget, setFlyTarget] = useState<FlyTarget | null>(null);

  const counts = useMemo(() => countByCategory(ALL_POINTS), []);

  const filteredPoints = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_POINTS.filter((p) => {
      if (!activeCategories.has(p.category)) return false;
      if (!q) return true;
      return (
        p.name.fr.toLowerCase().includes(q) ||
        p.name.en.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.country.fr.toLowerCase().includes(q) ||
        p.country.en.toLowerCase().includes(q) ||
        (p.tags?.some((t) => t.toLowerCase().includes(q)) ?? false)
      );
    });
  }, [activeCategories, query]);

  const setQueryAndOpen: Dispatch<SetStateAction<string>> = useCallback((value) => {
    setQuery(value);
    setSearchOpen(true);
  }, []);

  const handlePick = useCallback((p: AtlasPoint) => {
    setSelected(p);
    setFlyTarget({ coords: p.coordinates, ts: Date.now() });
    setSearchOpen(false);
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-ink-900">
      <AtlasMap
        points={filteredPoints}
        locale={locale}
        onSelect={setSelected}
        flyTarget={flyTarget}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] flex justify-center p-3 md:p-4">
        <div className="pointer-events-auto w-full max-w-5xl">
          <FilterBar
            activeCategories={activeCategories}
            setActiveCategories={setActiveCategories}
            locale={locale}
            setLocale={setLocale}
            counts={counts}
            query={query}
            setQuery={setQueryAndOpen}
            total={filteredPoints.length}
          />
          {searchOpen && (
            <SearchDropdown query={query} locale={locale} onPick={handlePick} />
          )}
        </div>
      </div>

      {filteredPoints.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-[400] flex items-center justify-center">
          <EmptyResultsCard locale={locale} />
        </div>
      )}

      {selected && (
        <DetailPanel point={selected} locale={locale} onClose={() => setSelected(null)} />
      )}

      <div className="pointer-events-none absolute bottom-3 left-1/2 z-[500] -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.24em] text-linen-500">
        {UI_TEXT.title[locale]} · {filteredPoints.length} {UI_TEXT.points[locale]}
      </div>
    </main>
  );
}
