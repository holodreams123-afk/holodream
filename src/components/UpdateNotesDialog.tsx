import { createPortal } from "react-dom";
import { useI18n } from "../i18n/LocaleContext";

interface UpdateNotesDialogProps {
  open: boolean;
  onClose: () => void;
}

export function UpdateNotesDialog({ open, onClose }: UpdateNotesDialogProps) {
  const { t } = useI18n();

  if (!open) return null;

  return createPortal(
    <div
      className="calc-rules-backdrop site-notice-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="calc-rules-dialog update-notes-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-notes-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="calc-rules-dialog-head">
          <h3 id="update-notes-title" className="calc-rules-dialog-title">
            {t.updateNotesTitle}
          </h3>
          <button
            type="button"
            className="calc-rules-x"
            aria-label={t.feedbackClose}
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <ul className="update-notes-list theme-scrollbar">
          {t.updateNotesItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="calc-rules-footer">
          <button type="button" className="calc-rules-close" onClick={onClose}>
            {t.updateNotesClose}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
