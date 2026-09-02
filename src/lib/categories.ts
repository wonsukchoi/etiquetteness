export const CATEGORIES = ['dining', 'business', 'social', 'travel', 'gifts', 'home'] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_META: Record<Category, { label: string; gradient: string; emoji: string }> = {
  dining: { label: 'Dining', gradient: 'from-amber-400 to-orange-500', emoji: '🍽️' },
  business: { label: 'Business', gradient: 'from-slate-600 to-slate-800', emoji: '💼' },
  social: { label: 'Social', gradient: 'from-rose-400 to-pink-600', emoji: '👋' },
  travel: { label: 'Travel', gradient: 'from-sky-400 to-blue-600', emoji: '✈️' },
  gifts: { label: 'Gifts', gradient: 'from-violet-400 to-purple-600', emoji: '🎁' },
  home: { label: 'Home', gradient: 'from-emerald-400 to-teal-600', emoji: '🏠' },
};
