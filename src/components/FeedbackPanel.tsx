import { useRef, useState, type ClipboardEvent, type FormEvent } from "react";
import { useI18n } from "../i18n/LocaleContext";
import type { FeedbackKind } from "../lib/feedbackStore";
import {
  formatFeedbackForCopy,
  githubIssueUrl,
  submitFeedback,
  type FeedbackSubmitResult,
} from "../lib/feedbackStore";
import {
  FEEDBACK_MAX_IMAGES,
  fileToFeedbackAttachment,
  revokeFeedbackAttachment,
  type FeedbackAttachment,
} from "../lib/feedbackImages";

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
  const [attachments, setAttachments] = useState<FeedbackAttachment[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState<FeedbackSubmitResult | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function clearAttachments(list: FeedbackAttachment[]) {
    for (const att of list) revokeFeedbackAttachment(att);
  }

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

  async function addImageFiles(files: FileList | File[]) {
    const list = [...files];
    if (!list.length) return;
    const room = FEEDBACK_MAX_IMAGES - attachments.length;
    if (room <= 0) {
      setSubmitError(t.feedbackImagesTooMany);
      return;
    }
    setSubmitError("");
    const next = [...attachments];
    for (const file of list.slice(0, room)) {
      try {
        next.push(await fileToFeedbackAttachment(file));
      } catch {
        setSubmitError(t.feedbackImagesInvalid);
      }
    }
    setAttachments(next);
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target) revokeFeedbackAttachment(target);
      return prev.filter((a) => a.id !== id);
    });
  }

  function handlePaste(e: ClipboardEvent) {
    const items = e.clipboardData?.items;
    if (!items) return;
    const imageFiles: File[] = [];
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) imageFiles.push(file);
      }
    }
    if (!imageFiles.length) return;
    e.preventDefault();
    void addImageFiles(imageFiles);
  }

  function handleClose() {
    clearAttachments(attachments);
    setAttachments([]);
    onClose();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || submitting) return;
    const catLabel = categories.find((c) => c.id === category)?.label ?? category;
    const ctxLabel = contexts.find((c) => c.id === context)?.label ?? context;
    setSubmitting(true);
    setSubmitError("");
    try {
      const out = await submitFeedback(
        {
          kind,
          category: catLabel,
          context: ctxLabel,
          message: trimmed,
          contact: contact.trim(),
          locale,
        },
        attachments,
      );
      setResult(out);
      clearAttachments(attachments);
      setAttachments([]);
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
      images: t.feedbackLabelImages,
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

  const previewImages = submitted?.imageUrls ?? [];

  return (
    <div className="feedback-overlay" role="presentation" onClick={handleClose}>
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
          <button type="button" className="btn btn-ghost feedback-close" onClick={handleClose}>
            {t.feedbackClose}
          </button>
        </header>

        {!submitted ? (
          <form className="feedback-form" onSubmit={handleSubmit} onPaste={handlePaste}>
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
              <span className="feedback-images-label">{t.feedbackLabelImages}</span>
              <p className="feedback-images-hint">{t.feedbackImagesHint}</p>
              {attachments.length > 0 ? (
                <ul className="feedback-images">
                  {attachments.map((att) => (
                    <li key={att.id}>
                      <img src={att.previewUrl} alt="" />
                      <button
                        type="button"
                        className="feedback-image-remove"
                        aria-label={t.feedbackImagesRemove(att.name)}
                        onClick={() => removeAttachment(att.id)}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => {
                  if (e.target.files?.length) void addImageFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              {attachments.length < FEEDBACK_MAX_IMAGES ? (
                <button
                  type="button"
                  className="btn btn-ghost feedback-images-add"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {t.feedbackImagesAdd}
                </button>
              ) : null}
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
              <button type="button" className="btn btn-ghost" onClick={handleClose} disabled={submitting}>
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
            {previewImages.length > 0 ? (
              <ul className="feedback-images feedback-images--readonly">
                {previewImages.map((url, i) => (
                  <li key={`${url}-${i}`}>
                    <a href={url} target="_blank" rel="noreferrer">
                      <img src={url} alt="" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
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
              <button type="button" className="btn btn-ghost" onClick={handleClose}>
                {t.feedbackDone}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
