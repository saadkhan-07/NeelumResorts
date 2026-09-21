/** "PKR 14,000 – 16,000", or "PKR 14,000" for a single figure. Per jeep, always. */
export function formatFare(priceMin: number, priceMax: number | null) {
  const min = priceMin.toLocaleString("en-PK");
  if (priceMax == null) return `PKR ${min}`;
  return `PKR ${min} – ${priceMax.toLocaleString("en-PK")}`;
}
