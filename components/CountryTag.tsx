interface Props {
  countryCode: string;
  className?: string;
}

export default function CountryTag({ countryCode, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-[4px] border border-linen-500/40 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-linen-300 ${className}`}
    >
      {countryCode}
    </span>
  );
}
