/**
 * Extract the leading emoji from a category display string.
 * Examples:
 * - "😂笑脸和情感" -> "😂"
 * - "👌People & Body" -> "👌"
 * - "Component" -> null (no leading emoji)
 */
export function extractLeadingEmoji(s: string): string | null {
  if (!s) return null;
  // Iterate by code points to avoid splitting surrogate pairs
  const first = Array.from(s)[0];
  if (!first) return null;
  // If the first char is ASCII letter/number, likely no emoji prefix
  if (/^[A-Za-z0-9]$/.test(first)) return null;
  return first;
}

