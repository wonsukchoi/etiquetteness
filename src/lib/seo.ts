const META_DESCRIPTION_MAX = 155;

/**
 * Clamps a description for use in <meta name="description">/og/twitter tags.
 * Category and country descriptions are written as full narrative paragraphs
 * for the visible on-page <p> — this only shortens the copy used in meta
 * tags, ending on a sentence, clause (dash/semicolon) or word boundary rather
 * than mid-word.
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

  // Most entry summaries are one long sentence, so there is no sentence end to
  // stop at. A dash or semicolon usually separates the rule from its reason
  // ("…give the cup a gentle shake when you've had enough — that's the
  // recognized way…"), so ending there keeps the whole rule and lets the
  // snippet close with a period instead of "…". Commas are not used: they
  // often sit inside lists.
  const lastClauseEnd = Math.max(truncated.lastIndexOf(' — '), truncated.lastIndexOf('; '));
  if (lastClauseEnd > max * 0.4) {
    const clause = truncated.slice(0, lastClauseEnd).replace(/[\s,;:—]+$/, '');
    return /[.!?]$/.test(clause) ? clause : `${clause}.`;
  }

  const lastSpace = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
}
