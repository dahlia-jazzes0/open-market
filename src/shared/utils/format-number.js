export function formatNumber(x) {
  const parts = String(x).split(".");
  parts[0] = parts[0].replaceAll(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}
