interface Props {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: { box: "h-7 w-7", text: "text-[10px]" },
  md: { box: "h-9 w-9", text: "text-xs" },
  lg: { box: "h-14 w-14", text: "text-base" },
};

export default function AtlasLogo({ size = "md", className = "" }: Props) {
  const s = SIZES[size];
  return (
    <div
      className={`flex ${s.box} flex-shrink-0 items-center justify-center rounded-full border border-cat-monument/50 bg-ink-800 font-display ${s.text} font-semibold tracking-wide text-linen-100 ${className}`}
    >
      AV
    </div>
  );
}
