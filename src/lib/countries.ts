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
  'global',
] as const;

export type Country = (typeof COUNTRIES)[number];

// Flag emoji mirrors how CATEGORY_META gives each category a color dot —
// a quick visual identity for the pill, not decoration.
export const COUNTRY_META: Record<Country, { label: string; flag: string }> = {
  japan: { label: 'Japan', flag: '🇯🇵' },
  china: { label: 'China', flag: '🇨🇳' },
  korea: { label: 'Korea', flag: '🇰🇷' },
  thailand: { label: 'Thailand', flag: '🇹🇭' },
  india: { label: 'India', flag: '🇮🇳' },
  'saudi-arabia': { label: 'Saudi Arabia', flag: '🇸🇦' },
  france: { label: 'France', flag: '🇫🇷' },
  germany: { label: 'Germany', flag: '🇩🇪' },
  italy: { label: 'Italy', flag: '🇮🇹' },
  'united-kingdom': { label: 'United Kingdom', flag: '🇬🇧' },
  mexico: { label: 'Mexico', flag: '🇲🇽' },
  global: { label: 'Global', flag: '🌐' },
};
