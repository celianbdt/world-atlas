export function flagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "🏳️";
  const cc = countryCode.toUpperCase();
  const A = 0x1f1e6;
  const codePoints = [cc.charCodeAt(0) - 65 + A, cc.charCodeAt(1) - 65 + A];
  return String.fromCodePoint(...codePoints);
}
