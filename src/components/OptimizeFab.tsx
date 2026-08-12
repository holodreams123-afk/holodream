import { createPortal } from "react-dom";

type Props = {
  visible: boolean;
  busy: boolean;
  label: string;
  subLabel: string;
  busyLabel: string;
  busyProgress: string | null;
  busyEstimate: string | null;
  title: string;
  onClick: () => void;
};

export function OptimizeFab({
  visible,
  busy,
  label,
  subLabel,
  busyLabel,
  busyProgress,
  busyEstimate,
  title,
  onClick,
}: Props) {
  if (!visible) return null;

  function handleClick() {
    if (busy) return;
    onClick();
  }

  return createPortal(
    <button
      type="button"
      className={`fab-optimize${busy ? " is-busy" : ""}`}
      onClick={handleClick}
      title={title}
      aria-busy={busy}
      aria-disabled={busy}
    >
      <span className="fab-optimize-label">
        {busy ? (
          <>
            {busyLabel}
            {busyProgress ? (
              <span className="fab-optimize-progress" aria-live="polite">
                {busyProgress}
              </span>
            ) : null}
            {busyEstimate ? (
              <span className="fab-optimize-timer" aria-live="polite">
                {busyEstimate}
              </span>
            ) : null}
          </>
        ) : (
          label
        )}
      </span>
      <span className="fab-optimize-sub">
        {busy ? (busyProgress ?? subLabel) : subLabel}
      </span>
    </button>,
    document.body,
  );
}
