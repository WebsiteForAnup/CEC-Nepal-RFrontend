/** Leaflet paths and canvas drawing need a resolved color, not a CSS variable. */
export function resolveCssColor(value: string): string {
  const token = /^var\((--[\w-]+)\)$/.exec(value)?.[1];
  if (!token || typeof document === 'undefined') return value;
  const palette = getComputedStyle(document.documentElement);
  return palette.getPropertyValue(token).trim() || palette.getPropertyValue('--cec-color-accent').trim();
}
