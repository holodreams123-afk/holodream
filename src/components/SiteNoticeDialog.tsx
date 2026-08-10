import { useState } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "../i18n/LocaleContext";

interface SiteNoticeDialogProps {
  open: boolean;
  onClose: (dontShowAgain: boolean) => void;
}

export function SiteNoticeDialog({ open, onClose }: SiteNoticeDialogProps) {
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
        className="calc-rules-dialog site-notice-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="site-notice-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="calc-rules-dialog-head">
          <h3 id="site-notice-title" className="calc-rules-dialog-title">
            {t.siteNoticeTitle}
          </h3>
        </div>
        <p className="site-notice-lead">{t.siteNoticeLead}</p>
        <ul className="calc-rules-list site-notice-list">
          {t.siteNoticeSections.map((section) => (
            <li key={section.title}>
              <strong>{section.title}</strong>
              <p>{section.body}</p>
            </li>
          ))}
        </ul>
        <label className="site-notice-dismiss">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
          />
          <span>{t.siteNoticeDontShow}</span>
        </label>
        <div className="calc-rules-footer">
          <button
            type="button"
            className="calc-rules-close"
            onClick={() => onClose(dontShowAgain)}
          >
            {t.siteNoticeConfirm}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
