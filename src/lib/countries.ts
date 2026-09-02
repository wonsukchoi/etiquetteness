export const COUNTRIES = [
  'japan',
  'china',
  'korea',
  'thailand',
  'india',
  'saudi-arabia',
  'france',
  'germany',
  'italy',
  'united-kingdom',
  'mexico',
  'guam',
  'philippines',
  'global',
] as const;

export type Country = (typeof COUNTRIES)[number];

// A 2-letter code badge, not a flag emoji — regional-indicator flag sequences
// don't render as flags on Windows (no flag glyphs shipped), they fall back
// to plain letter pairs. A text code sidesteps that instead of fighting it.
// "global" keeps its globe glyph since that's a single-codepoint symbol
// emoji, not a regional-indicator flag, so it renders consistently.
export const COUNTRY_META: Record<Country, { label: string; code: string }> = {
  japan: { label: 'Japan', code: 'JP' },
  china: { label: 'China', code: 'CN' },
  korea: { label: 'Korea', code: 'KR' },
  thailand: { label: 'Thailand', code: 'TH' },
  india: { label: 'India', code: 'IN' },
  'saudi-arabia': { label: 'Saudi Arabia', code: 'SA' },
  france: { label: 'France', code: 'FR' },
  germany: { label: 'Germany', code: 'DE' },
  italy: { label: 'Italy', code: 'IT' },
  'united-kingdom': { label: 'United Kingdom', code: 'GB' },
  mexico: { label: 'Mexico', code: 'MX' },
  guam: { label: 'Guam', code: 'GU' },
  philippines: { label: 'Philippines', code: 'PH' },
  global: { label: 'Global', code: '🌐' },
};
