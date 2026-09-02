import { execSync } from 'node:child_process';

// Real datePublished per entry, derived from the commit that first added the
// file — rather than a frontmatter field authors would have to backfill by
// hand. Falls back to undefined (callers should fall back to updatedAt) if
// git isn't available or the repo history is shallow (e.g. some CI clones).
let cache: Map<string, string> | null = null;

export function getPublishedDates(): Map<string, string> {
  if (cache) return cache;
  cache = new Map();

  try {
    const log = execSync('git log --diff-filter=A --name-only --pretty=format:"@@%aI"', {
      cwd: process.cwd(),
      encoding: 'utf-8',
      maxBuffer: 20 * 1024 * 1024,
    });

    let currentDate = '';
    for (const line of log.split('\n')) {
      if (line.startsWith('@@')) {
        currentDate = line.slice(2);
      } else if (line.startsWith('src/content/etiquette/') && line.endsWith('.mdx')) {
        // Log is newest-first; keep overwriting so the last (oldest) commit
        // that added this path wins.
        cache.set(line.trim(), currentDate);
      }
    }
  } catch {
    // No git available at build time — leave the cache empty.
  }

  return cache;
}
