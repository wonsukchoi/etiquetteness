const META_DESCRIPTION_MAX = 155;

/**
 * Clamps a description for use in <meta name="description">/og/twitter tags.
 * Category and country descriptions are written as full narrative paragraphs
 * for the visible on-page <p> — this only shortens the copy used in meta
 * tags, ending on a sentence or word boundary rather than mid-word.
 */
export function toMetaDesc(text: string, max = META_DESCRIPTION_MAX): string {
  if (text.length <= max) return text;

  const truncated = text.slice(0, max);
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('. '),
    truncated.lastIndexOf('! '),
    truncated.lastIndexOf('? ')
  );
  if (lastSentenceEnd > max * 0.4) {
    return truncated.slice(0, lastSentenceEnd + 1);
  }

  const lastSpace = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
}
