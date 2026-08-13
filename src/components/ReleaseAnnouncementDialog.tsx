import { useState } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "../i18n/LocaleContext";

interface ReleaseAnnouncementDialogProps {
  open: boolean;
  onClose: (dontShowAgain: boolean) => void;
}

export function ReleaseAnnouncementDialog({ open, onClose }: ReleaseAnnouncementDialogProps) {
  const { t } = useI18n();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!open) return null;

  return createPortal(
    <div
      className="calc-rules-backdrop site-notice-backdrop"
      role="presentation"
      onClick={() => onClose(dontShowAgain)}
    >
      <div
        className="calc-rules-dialog site-notice-dialog release-announcement-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="release-announcement-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="calc-rules-dialog-head release-announcement-head">
          <div className="release-announcement-head-main">
            <span className="release-announcement-tag">{t.rosterBloomTitle}</span>
            <h3 id="release-announcement-title" className="calc-rules-dialog-title">
              {t.releaseAnnouncementTitle}
            </h3>
          </div>
        </div>
        <p className="site-notice-lead">{t.releaseAnnouncementLead}</p>
        <ul className="calc-rules-list site-notice-list release-announcement-list">
          {t.releaseAnnouncementSections.map((section) => (
            <li key={section.title}>
              <strong>{section.title}</strong>
              <p>{section.body}</p>
            </li>
          ))}
        </ul>
        <div className="release-announcement-foot">
          <label className="site-notice-dismiss">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
            <span>{t.releaseAnnouncementDontShow}</span>
          </label>
          <button
            type="button"
            className="calc-rules-close release-announcement-confirm"
            onClick={() => onClose(dontShowAgain)}
          >
            {t.releaseAnnouncementConfirm}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
