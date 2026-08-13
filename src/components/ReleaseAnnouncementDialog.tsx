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
        <div className="calc-rules-dialog-head">
          <h3 id="release-announcement-title" className="calc-rules-dialog-title">
            {t.releaseAnnouncementTitle}
          </h3>
        </div>
        <div className="release-announcement-body theme-scrollbar">
          {t.releaseAnnouncementParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <label className="site-notice-dismiss">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
          />
          <span>{t.releaseAnnouncementDontShow}</span>
        </label>
        <div className="calc-rules-footer">
          <button
            type="button"
            className="calc-rules-close"
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
