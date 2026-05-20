/** Parse #rgb / #rrggbb to "r, g, b" for rgba(). */
export function hexToRgbString(hex: string): string | null {
  const h = hex.trim().replace(/^#/, "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h.length >= 6
        ? h.slice(0, 6)
        : null;
  if (!full) return null;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

export function colorWithAlpha(hex: string, alpha: number): string {
  const rgb = hexToRgbString(hex);
  return rgb ? `rgba(${rgb}, ${alpha})` : hex;
}
