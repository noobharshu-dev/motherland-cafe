/**
 * Injects Cloudinary transformation parameters into a Cloudinary image URL
 * to produce a server-side auto-cropped 4:3 image.
 *
 * Non-Cloudinary URLs (e.g. unsplash) are returned unchanged.
 *
 * @param url   The raw image URL (Cloudinary or external)
 * @param opts  Optional override for the transformation string
 */
export function getCloudinaryUrl(
  url: string,
  opts = 'c_fill,ar_4:3,g_auto,q_auto,f_auto'
): string {
  if (!url) return url;

  // Only transform Cloudinary URLs
  if (!url.includes('res.cloudinary.com')) return url;

  // Already has a transform segment — return as-is to avoid double-injection
  if (url.includes('/c_fill')) return url;

  // Insert transform before the version segment (v12345...) or before the filename
  // Cloudinary URL pattern: https://res.cloudinary.com/<cloud>/image/upload/<transforms>/<version>/<public_id>
  return url.replace('/image/upload/', `/image/upload/${opts}/`);
}
