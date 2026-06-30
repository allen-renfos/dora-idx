/**
 * The blog API returns category as a free-form string with inconsistent
 * casing / pluralisation — e.g. "news", "article" (singular), "blog".
 * Match tolerantly so the sidebar lists don't silently render empty when the
 * value is "Article" or "articles".
 */
export function isInCategory(
  category: string | null | undefined,
  key: "news" | "article"
): boolean {
  return (category || "").trim().toLowerCase().startsWith(key);
}
