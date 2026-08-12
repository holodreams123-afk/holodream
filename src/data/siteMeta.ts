import type { Locale } from "../i18n/messages";

/** Bump when publishing site content updates (YYYY-MM-DD). */
export const LAST_UPDATED = "2026-08-12";

export function formatSiteDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (locale === "en") {
    const mm = String(m).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  }
  return `${y}年${m}月${d}日`;
}
