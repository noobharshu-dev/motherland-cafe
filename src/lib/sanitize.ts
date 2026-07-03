/**
 * Input sanitization utilities.
 * Strips HTML tags and trims whitespace from user-submitted text
 * before it is written to the database.
 */

/** Remove HTML/script tags and trim whitespace */
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // strip all HTML tags
    .replace(/&[a-z]+;/gi, ' ') // decode common HTML entities to space
    .trim();
}

/** Sanitize an object's string values (one level deep) */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key in result) {
    if (typeof result[key] === 'string') {
      (result as Record<string, unknown>)[key] = sanitizeText(result[key] as string);
    }
  }
  return result;
}
