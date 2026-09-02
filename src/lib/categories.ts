export const CATEGORIES = ['dining', 'business', 'social', 'travel', 'gifts', 'home'] as const;
export type Category = (typeof CATEGORIES)[number];

// Each category gets one fixed accent color, used sparingly (a small dot,
// an active-tab underline) — not painted across the whole card.
export const CATEGORY_META: Record<Category, { label: string; color: string }> = {
  dining: { label: 'Dining', color: '#B5502A' },
  business: { label: 'Business', color: '#23395B' },
  social: { label: 'Social', color: '#B23A62' },
  travel: { label: 'Travel', color: '#1F6F8B' },
  gifts: { label: 'Gifts', color: '#A8842C' },
  home: { label: 'Home', color: '#3F6B4B' },
};
