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
  'brazil',
  'vietnam',
  'global',
] as const;

export type Country = (typeof COUNTRIES)[number];

// A 2-letter code badge, not a flag emoji — regional-indicator flag sequences
// don't render as flags on Windows (no flag glyphs shipped), they fall back
// to plain letter pairs. A text code sidesteps that instead of fighting it.
// "global" keeps its globe glyph since that's a single-codepoint symbol
// emoji, not a regional-indicator flag, so it renders consistently.
//
// `description` synthesizes the actual entries filed under that country —
// it doesn't introduce new claims, just ties together facts already
// verified and sourced on the individual entry pages.
export const COUNTRY_META: Record<Country, { label: string; code: string; description: string }> = {
  japan: {
    label: 'Japan',
    code: 'JP',
    description:
      "Japanese etiquette runs on precise small rituals — presenting a business card with both hands, never planting chopsticks upright in rice, removing your shoes at the genkan — each one a compact signal of respect that's easy to miss if you don't know to look for it.",
  },
  china: {
    label: 'China',
    code: 'CN',
    description:
      "Chinese etiquette carries real symbolic weight: a homophone can turn an ordinary gift into a bad-luck one, and even how you eat a whole fish can read as tempting fate. Business and dining customs here reward attention to detail most visitors don't expect.",
  },
  korea: {
    label: 'Korea',
    code: 'KR',
    description:
      "Korean etiquette is built around a clear sense of age and rank (nunchi), from how you bow and hand over a business card to how you drink with someone older than you. Getting the hierarchy right matters more here than in most cultures on this list.",
  },
  thailand: {
    label: 'Thailand',
    code: 'TH',
    description:
      'Thai etiquette centers on the body: the head is treated as sacred, the feet as the opposite, and the wai greeting itself scales in formality by exactly who you\'re greeting. Buddhist tradition runs quietly under most of these customs.',
  },
  india: {
    label: 'India',
    code: 'IN',
    description:
      'Etiquette across India varies by region and religion, but a few norms hold broadly: the right hand for eating and giving, namaste as a contact-free default greeting, and real color and material associations (white, leather) worth knowing before you gift something.',
  },
  'saudi-arabia': {
    label: 'Saudi Arabia',
    code: 'SA',
    description:
      "Etiquette in Saudi Arabia is shaped directly by Islamic practice — the workweek runs Friday–Saturday, business pauses for daily prayers, and social norms around dress and greeting are more conservative than in much of the West, though they've loosened in recent years.",
  },
  france: {
    label: 'France',
    code: 'FR',
    description:
      'French etiquette draws sharp lines: a handshake for business, la bise for friends, never the two crossed. It also has firmer opinions than most cultures about the literal table — where your hands go, where your bread goes, and what you say before you say anything else.',
  },
  germany: {
    label: 'Germany',
    code: 'DE',
    description:
      'German etiquette treats punctuality and directness as forms of respect, not coldness — arriving a few minutes early for a business meeting, holding eye contact during a toast, and saying what you mean plainly are all read as taking the other person seriously.',
  },
  italy: {
    label: 'Italy',
    code: 'IT',
    description:
      "Italian etiquette has firm, specific opinions — no cappuccino after a meal, no cheese on seafood pasta, and dressing with intention even for a quick errand (bella figura). These aren't old-fashioned rules; they're actively enforced by how Italians actually behave.",
  },
  'united-kingdom': {
    label: 'United Kingdom',
    code: 'GB',
    description:
      'British etiquette runs on fairness and understatement: queue and wait your turn, take your turn buying a round at the pub, and use the weather as safe, low-stakes small talk with a stranger. None of it is written down; all of it is closely watched.',
  },
  mexico: {
    label: 'Mexico',
    code: 'MX',
    description:
      'Mexican etiquette prioritizes relationship over efficiency: expect small talk before business, warmth in greetings that scales with familiarity, and real seasonal meaning behind gifts like marigolds, reserved specifically for Día de los Muertos.',
  },
  guam: {
    label: 'Guam',
    code: 'GU',
    description:
      "Chamorro etiquette on Guam centers on reciprocity and respect for elders: chenchule' keeps gifts and favors circulating through the community, fiestas expect a polite back-and-forth before you accept food, and the nginge' greeting is a real physical gesture of deference, not just a nod.",
  },
  philippines: {
    label: 'Philippines',
    code: 'PH',
    description:
      "Filipino etiquette builds respect directly into the language: adding \"po\" or \"opo\" when speaking to someone older or in authority is a small habit that signals real deference — dropping it can read as overly familiar even when nothing else about the exchange is impolite.",
  },
  brazil: {
    label: 'Brazil',
    code: 'BR',
    description:
      "Brazilian etiquette runs warm and physical — a handshake gives way to a cheek kiss once you know someone, personal space runs closer than most Western visitors expect, and showing up exactly on time to a dinner can actually catch your host off guard (hora brasileira). Gift-giving carries real symbolic weight too: purple reads as funeral colors, and anything sharp suggests you want to cut the relationship off.",
  },
  vietnam: {
    label: 'Vietnam',
    code: 'VN',
    description:
      "Vietnamese etiquette runs on Confucian-rooted respect for age and hierarchy — greeting elders first, addressing people with kinship terms instead of names, exchanging business cards with both hands. The same taboos around chopsticks upright in rice and funeral-colored gift wrap show up in China and Japan too, but they're taken just as seriously here.",
  },
  global: {
    label: 'Global',
    code: '🌐',
    description:
      "A handful of rules apply no matter which country you're flying to or through — not local custom, just the baseline expected of every passenger.",
  },
};

function countryLabel(country: string): string {
  return COUNTRY_META[country as Country]?.label ?? country.replace(/-/g, ' ');
}

/** The country page's H1 and Article headline. */
export function countryHeading(country: string): string {
  return country === 'global' ? 'Etiquette That Applies Everywhere' : `${countryLabel(country)} Etiquette`;
}

// The layout appends " · Etiquetteness" (16 characters); the full <title>
// should stay within 80.
const MAX_COUNTRY_TITLE = 64;

/**
 * The country page's <title>, e.g. "Japan Etiquette: 14 Unwritten Rules for
 * Visitors". Fails the build rather than ship a title that runs past the budget.
 */
export function countryPageTitle(country: string, ruleCount: number): string {
  const title =
    country === 'global'
      ? 'Etiquette Rules That Apply in Every Country'
      : `${countryLabel(country)} Etiquette: ${ruleCount} Unwritten Rule${ruleCount === 1 ? '' : 's'} for Visitors`;
  if (title.length > MAX_COUNTRY_TITLE) {
    throw new Error(`Country page title for "${country}" is ${title.length} chars (max ${MAX_COUNTRY_TITLE}): ${title}`);
  }
  return title;
}

// Words that already tie a title to its country, so the <title> doesn't need
// the "Country: " prefix (e.g. "Do the Thai wai" on a Thailand entry).
const COUNTRY_TERMS: Record<Exclude<Country, 'global'>, string[]> = {
  japan: ['japan', 'japanese'],
  china: ['china', 'chinese'],
  korea: ['korea', 'korean'],
  thailand: ['thailand', 'thai'],
  india: ['india', 'indian'],
  'saudi-arabia': ['saudi'],
  france: ['france', 'french'],
  germany: ['germany', 'german'],
  italy: ['italy', 'italian'],
  'united-kingdom': ['united kingdom', 'uk', 'british', 'britain', 'england', 'english'],
  mexico: ['mexico', 'mexican'],
  guam: ['guam', 'chamorro'],
  philippines: ['philippines', 'filipino'],
  brazil: ['brazil', 'brazilian'],
  vietnam: ['vietnam', 'vietnamese'],
};

// Same budget as the seoTitle schema: the layout appends " · Etiquetteness"
// (16 characters) and the full <title> should stay within 80.
const MAX_ENTRY_TITLE = 64;

/**
 * The <title> text for an entry. Many rules read the same across countries
 * ("Take your shoes off indoors" exists for Japan and Vietnam), so the country
 * leads the title, in the "Brazil: …" form the hand-written seoTitles use.
 * Left as-is for global entries, titles that already name the country or its
 * people, and when the prefix would push it past the title budget.
 */
export function entryPageTitle(country: string, title: string): string {
  if (country === 'global' || !(country in COUNTRY_TERMS)) return title;
  const terms = COUNTRY_TERMS[country as Exclude<Country, 'global'>];
  const lower = title.toLowerCase();
  if (terms.some((term) => new RegExp(`\\b${term}\\b`).test(lower))) return title;
  const prefixed = `${COUNTRY_META[country as Country].label}: ${title}`;
  return prefixed.length <= MAX_ENTRY_TITLE ? prefixed : title;
}
