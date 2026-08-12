import { createPortal } from "react-dom";
import { useI18n } from "../i18n/LocaleContext";

interface AppAlertDialogProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export function AppAlertDialog({ open, message, onClose }: AppAlertDialogProps) {
  const { t } = useI18n();

  if (!open) return null;

  return createPortal(
    <div className="calc-rules-backdrop app-alert-backdrop" role="presentation" onClick={onClose}>
      <div
        className="calc-rules-dialog app-alert-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-live="assertive"
        aria-labelledby="app-alert-message"
        onClick={(e) => e.stopPropagation()}
      >
        <p id="app-alert-message" className="app-alert-message">
          {message}
        </p>
        <div className="calc-rules-footer">
          <button type="button" className="calc-rules-close" onClick={onClose}>
            {t.calcRulesClose}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
