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
