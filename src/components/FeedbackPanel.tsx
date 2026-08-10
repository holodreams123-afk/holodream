import { useState, type FormEvent } from "react";
import { useI18n } from "../i18n/LocaleContext";
import type { FeedbackKind } from "../lib/feedbackStore";
import {
  formatFeedbackForCopy,
  githubIssueUrl,
  submitFeedback,
  type FeedbackSubmitResult,
} from "../lib/feedbackStore";

type Props = {
  kind: FeedbackKind;
  onClose: () => void;
};

export function FeedbackPanel({ kind, onClose }: Props) {
  const { t, locale } = useI18n();
  const [category, setCategory] = useState("");
  const [context, setContext] = useState("");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState<FeedbackSubmitResult | null>(null);
  const [copied, setCopied] = useState(false);

  const categories =
    kind === "report"
      ? [
          { id: "stats", label: t.feedbackCatStats },
          { id: "skills", label: t.feedbackCatSkills },
          { id: "ui", label: t.feedbackCatUi },
          { id: "optimize", label: t.feedbackCatOptimize },
          { id: "other", label: t.feedbackCatOther },
        ]
      : [
          { id: "feature", label: t.feedbackCatFeature },
          { id: "ui", label: t.feedbackCatUi },
          { id: "data", label: t.feedbackCatData },
          { id: "other", label: t.feedbackCatOther },
        ];

  const contexts = [
    { id: "gallery", label: t.themeGallery },
    { id: "optimize", label: t.themeOptimize },
    { id: "roster", label: t.themeRoster },
    { id: "general", label: t.feedbackContextGeneral },
  ];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || submitting) return;
    const catLabel = categories.find((c) => c.id === category)?.label ?? category;
    const ctxLabel = contexts.find((c) => c.id === context)?.label ?? context;
    setSubmitting(true);
    setSubmitError("");
    try {
      const out = await submitFeedback({
        kind,
        category: catLabel,
        context: ctxLabel,
        message: trimmed,
        contact: contact.trim(),
        locale,
      });
      setResult(out);
    } catch {
      setSubmitError(t.feedbackSubmitError);
    } finally {
      setSubmitting(false);
    }
  }

  async function copyText() {
    if (!result?.entry) return;
    const text = formatFeedbackForCopy(result.entry, {
      kindReport: t.feedbackReportTitle,
      kindSuggest: t.feedbackSuggestTitle,
      category: t.feedbackLabelCategory,
      context: t.feedbackLabelContext,
      message: t.feedbackLabelMessage,
      contact: t.feedbackLabelContact,
      time: t.feedbackLabelTime,
    });
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  const submitted = result?.entry ?? null;
  const title = kind === "report" ? t.feedbackReportTitle : t.feedbackSuggestTitle;
  const issueTitle =
    kind === "report"
      ? `[Bug] ${submitted?.category || t.feedbackReportTitle}`
      : `[Suggestion] ${submitted?.message.slice(0, 48) || t.feedbackSuggestTitle}`;

  const successNote = result?.cloudSaved
    ? t.feedbackSuccessNoteCloud
    : result?.cloudError
      ? t.feedbackSuccessNoteFallback
      : t.feedbackSuccessNoteLocal;

  return (
    <div className="feedback-overlay" role="presentation" onClick={onClose}>
      <section
        className="feedback-panel panel"
        role="dialog"
        aria-labelledby="feedback-title"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="feedback-head">
          <div>
            <p className="feedback-kicker">
              {kind === "report" ? t.feedbackReportKicker : t.feedbackSuggestKicker}
            </p>
            <h2 id="feedback-title">{title}</h2>
            <p className="feedback-desc">
              {kind === "report" ? t.feedbackReportDesc : t.feedbackSuggestDesc}
            </p>
          </div>
          <button type="button" className="btn btn-ghost feedback-close" onClick={onClose}>
            {t.feedbackClose}
          </button>
        </header>

        {!submitted ? (
          <form className="feedback-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="feedback-category">{t.feedbackLabelCategory}</label>
              <select
                id="feedback-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">{t.feedbackSelectPlaceholder}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="feedback-context">{t.feedbackLabelContext}</label>
              <select
                id="feedback-context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              >
                <option value="">{t.feedbackSelectPlaceholder}</option>
                {contexts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="feedback-message">{t.feedbackLabelMessage}</label>
              <textarea
                id="feedback-message"
                rows={6}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  kind === "report" ? t.feedbackReportPlaceholder : t.feedbackSuggestPlaceholder
                }
              />
            </div>
            <div className="field">
              <label htmlFor="feedback-contact">{t.feedbackLabelContact}</label>
              <input
                id="feedback-contact"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder={t.feedbackContactPlaceholder}
                maxLength={80}
              />
            </div>
            {submitError ? <p className="feedback-error">{submitError}</p> : null}
            <div className="feedback-actions">
              <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>
                {t.feedbackCancel}
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? t.feedbackSubmitting : t.feedbackSubmit}
              </button>
            </div>
          </form>
        ) : (
          <div className="feedback-success">
            <p className="feedback-success-msg">{t.feedbackSuccess}</p>
            <p className="feedback-success-note">{successNote}</p>
            <div className="feedback-preview">
              <pre>{submitted.message}</pre>
            </div>
            <div className="feedback-actions">
              <button type="button" className="btn btn-ghost" onClick={copyText}>
                {copied ? t.feedbackCopied : t.feedbackCopy}
              </button>
              {!result?.cloudSaved ? (
                <a
                  className="btn btn-primary"
                  href={githubIssueUrl(submitted, issueTitle)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.feedbackGithub}
                </a>
              ) : null}
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                {t.feedbackDone}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
