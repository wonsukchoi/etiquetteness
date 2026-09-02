export const CATEGORIES = ['dining', 'business', 'social', 'travel', 'gifts', 'home'] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_META: Record<Category, { label: string; emoji: string }> = {
  dining: { label: 'Dining', emoji: '🍽️' },
  business: { label: 'Business', emoji: '💼' },
  social: { label: 'Social', emoji: '👋' },
  travel: { label: 'Travel', emoji: '✈️' },
  gifts: { label: 'Gifts', emoji: '🎁' },
  home: { label: 'Home', emoji: '🏠' },
};
