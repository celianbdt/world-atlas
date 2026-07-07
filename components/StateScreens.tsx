import type { Locale } from "@/lib/types";
import { UI_TEXT } from "@/lib/types";
import AtlasLogo from "./AtlasLogo";

export function LoadingScreen({ locale = "fr" as Locale }: { locale?: Locale }) {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-ink-900">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="spinner-ring absolute inset-0" />
        <AtlasLogo size="md" />
      </div>
      <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-linen-400">
        {UI_TEXT.loading[locale]}
      </div>
    </div>
  );
}

export function EmptyResultsCard({ locale }: { locale: Locale }) {
  return (
    <div className="glass-panel shadow-panel pointer-events-auto flex max-w-xs flex-col items-center gap-3 rounded-panel px-6 py-8 text-center">
      <div
        className="atlas-marker-empty h-11 w-11 rounded-full border-2 border-dashed border-linen-500/40"
        aria-hidden
      />
      <h3 className="font-display text-xl font-semibold text-linen-100">
        {UI_TEXT.emptyTitle[locale]}
      </h3>
      <p className="text-xs leading-relaxed text-linen-400">{UI_TEXT.emptyBody[locale]}</p>
    </div>
  );
}
