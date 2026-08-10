/** Bump when notice copy changes — shows again for users who dismissed an older version. */
export const SITE_NOTICE_VERSION = 2;

export const STORAGE_SITE_NOTICE = `holodream-site-notice-v${SITE_NOTICE_VERSION}`;

export function isSiteNoticeDismissed(): boolean {
  try {
    return localStorage.getItem(STORAGE_SITE_NOTICE) === "1";
  } catch {
    return false;
  }
}

export function dismissSiteNotice(): void {
  try {
    localStorage.setItem(STORAGE_SITE_NOTICE, "1");
  } catch {
    /* ignore */
  }
}
