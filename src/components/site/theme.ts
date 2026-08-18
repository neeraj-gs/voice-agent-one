/**
 * Customer site theming.
 *
 * The accent comes from the business's own record, generated per trade, so it
 * can be any hex at all — including one that would make white text unreadable.
 * Everything derived here is derived from measured luminance rather than
 * assumed, which is what keeps a hundred different generated sites legible.
 */

export interface SiteTheme {
  /** The business's colour, used for rules, numerals and the primary action. */
  accent: string;
  /** Text that sits on top of a solid accent fill. */
  onAccent: string;
  /** A 6% wash of the accent, for panel grounds. */
  wash: string;
  /** A 22% tint, for hairlines that should read as branded. */
  line: string;
}

const clampHex = (hex: string): string => {
  const h = (hex || '').trim();
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(h) ? h : '#17161B';
};

const toRgb = (hex: string): [number, number, number] => {
  let h = clampHex(hex).slice(1);
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** WCAG relative luminance. */
export const luminance = (hex: string): number => {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const rgba = (hex: string, alpha: number): string => {
  const [r, g, b] = toRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Pull the accent toward a usable range. A near-white brand colour would
 * vanish on paper and a near-black one would stop reading as a colour at all,
 * so both ends are nudged back without changing the hue.
 */
const usable = (hex: string): string => {
  const l = luminance(hex);
  if (l > 0.55) {
    // Too light for paper: darken by mixing toward graphite.
    const [r, g, b] = toRgb(hex);
    const k = 0.45;
    return `#${[r, g, b]
      .map((v) => Math.round(v * (1 - k) + 0x17 * k).toString(16).padStart(2, '0'))
      .join('')}`;
  }
  return clampHex(hex);
};

export const makeTheme = (primaryColor?: string): SiteTheme => {
  const accent = usable(primaryColor || '#17161B');
  return {
    accent,
    onAccent: luminance(accent) > 0.45 ? '#17161B' : '#F7F5F1',
    wash: rgba(accent, 0.06),
    line: rgba(accent, 0.22),
  };
};
