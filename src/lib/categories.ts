export const CATEGORIES = ['dining', 'business', 'social', 'travel', 'gifts', 'home'] as const;
export type Category = (typeof CATEGORIES)[number];

// Each category gets one fixed accent color, used sparingly (a small dot,
// an active-tab underline) — not painted across the whole card.
export const CATEGORY_META: Record<Category, { label: string; color: string; description: string }> = {
  dining: {
    label: 'Dining',
    color: '#B5502A',
    description:
      "Meals are where etiquette gets tested in public, at the fastest pace. Whether it's where your rice bowl sits in Korea, when to decline food in Guam, or which side of the plate the bread lands on in France, dining customs everywhere encode the same thing: whether you're paying attention to the people you're sharing a table with.",
  },
  business: {
    label: 'Business',
    color: '#23395B',
    description:
      'Handing over a business card, greeting a colleague, walking into a meeting on time — each culture ties a slightly different ritual to the same idea: how you show up says something about how seriously you take the relationship, not just the transaction.',
  },
  social: {
    label: 'Social',
    color: '#B23A62',
    description:
      "Small physical gestures — a bow, a cheek kiss, a hand offered a certain way — carry outsized social weight. These entries cover how greetings and everyday courtesy signal respect from country to country, often in ways a visitor wouldn't guess from the outside.",
  },
  travel: {
    label: 'Travel',
    color: '#1F6F8B',
    description:
      "A handful of rules apply no matter which country you're flying to or through — this category collects the etiquette that isn't local at all.",
  },
  gifts: {
    label: 'Gifts',
    color: '#A8842C',
    description:
      'What you give, how you wrap it, even the number of stems in a bouquet, can carry unintended meaning: a color tied to funerals in one country, a homophone for bad luck in another. These entries cover the gift-giving mistakes that are easy to make with the best intentions.',
  },
  home: {
    label: 'Home',
    color: '#3F6B4B',
    description:
      "The unwritten rules of being a guest in someone's home: arriving, removing shoes, accepting food or tea, saying goodbye. Entries for this category are still being added.",
  },
};
