/** Bump when a new release announcement should auto-show after the site notice. */
export const RELEASE_ANNOUNCEMENT_ID = "2026-08-12";

export const STORAGE_RELEASE_ANNOUNCEMENT = `holodream-release-${RELEASE_ANNOUNCEMENT_ID}`;

export function isReleaseAnnouncementDismissed(): boolean {
  try {
    return localStorage.getItem(STORAGE_RELEASE_ANNOUNCEMENT) === "1";
  } catch {
    return false;
  }
}

export function dismissReleaseAnnouncement(): void {
  try {
    localStorage.setItem(STORAGE_RELEASE_ANNOUNCEMENT, "1");
  } catch {
    /* ignore */
  }
}
