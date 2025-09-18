/**
 * Format numbers for display in UI components
 * Compacts large numbers to prevent layout expansion
 */
export function formatNumber(num: number): string {
  if (num === 0) return '0';
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
}



