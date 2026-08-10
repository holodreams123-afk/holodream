export type FeedbackKind = "report" | "suggest";

export type FeedbackEntry = {
  id: string;
  kind: FeedbackKind;
  category: string;
  context: string;
  message: string;
  contact: string;
  locale: string;
  createdAt: string;
};

export type FeedbackSubmitResult = {
  entry: FeedbackEntry;
  cloudSaved: boolean;
  cloudError?: string;
};

const STORAGE_KEYS: Record<FeedbackKind, string> = {
  report: "holodream-feedback-reports",
  suggest: "holodream-feedback-suggestions",
};

const CLOUD_TABLES: Record<FeedbackKind, string> = {
  report: "feedback_reports",
  suggest: "feedback_suggestions",
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export function feedbackCloudEnabled(): boolean {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export function loadFeedback(kind?: FeedbackKind): FeedbackEntry[] {
  if (kind) return loadFeedbackKind(kind);
  return [...loadFeedbackKind("report"), ...loadFeedbackKind("suggest")].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt),
  );
}

function loadFeedbackKind(kind: FeedbackKind): FeedbackEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[kind]);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FeedbackEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFeedbackLocal(entry: Omit<FeedbackEntry, "id" | "createdAt">): FeedbackEntry {
  const full: FeedbackEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const list = loadFeedbackKind(entry.kind);
  list.unshift(full);
  localStorage.setItem(STORAGE_KEYS[entry.kind], JSON.stringify(list.slice(0, 50)));
  return full;
}

function supabaseRestUrl(table: string, query = ""): string {
  return `${SUPABASE_URL!.replace(/\/$/, "")}/rest/v1/${table}${query}`;
}

function remoteHeaders(): HeadersInit | null {
  if (!feedbackCloudEnabled()) return null;
  return {
    apikey: SUPABASE_ANON_KEY!,
    Authorization: `Bearer ${SUPABASE_ANON_KEY!}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };
}

export async function submitFeedback(
  entry: Omit<FeedbackEntry, "id" | "createdAt">,
): Promise<FeedbackSubmitResult> {
  const saved = saveFeedbackLocal(entry);
  const headers = remoteHeaders();
  if (!headers) {
    return { entry: saved, cloudSaved: false };
  }

  try {
    const res = await fetch(supabaseRestUrl(CLOUD_TABLES[entry.kind]), {
      method: "POST",
      headers,
      body: JSON.stringify({
        category: entry.category.slice(0, 120),
        context: entry.context.slice(0, 120),
        message: entry.message.slice(0, 4000),
        contact: entry.contact.slice(0, 120),
        locale: entry.locale.slice(0, 16),
      }),
    });
    if (!res.ok) {
      const err = await res.text().catch(() => "");
      return {
        entry: saved,
        cloudSaved: false,
        cloudError: err || `HTTP ${res.status}`,
      };
    }
    return { entry: saved, cloudSaved: true };
  } catch (e) {
    return {
      entry: saved,
      cloudSaved: false,
      cloudError: e instanceof Error ? e.message : "network",
    };
  }
}

/** @deprecated Use submitFeedback */
export function saveFeedback(entry: Omit<FeedbackEntry, "id" | "createdAt">): FeedbackEntry {
  return saveFeedbackLocal(entry);
}

export function formatFeedbackForCopy(
  entry: FeedbackEntry,
  labels: {
    kindReport: string;
    kindSuggest: string;
    category: string;
    context: string;
    message: string;
    contact: string;
    time: string;
  },
): string {
  const kind = entry.kind === "report" ? labels.kindReport : labels.kindSuggest;
  const lines = [
    `[Holodream ${kind}]`,
    `${labels.time}: ${entry.createdAt}`,
    entry.locale ? `Locale: ${entry.locale}` : "",
    entry.category ? `${labels.category}: ${entry.category}` : "",
    entry.context ? `${labels.context}: ${entry.context}` : "",
    `${labels.message}:`,
    entry.message,
    entry.contact ? `${labels.contact}: ${entry.contact}` : "",
  ].filter(Boolean);
  return lines.join("\n");
}

export const GITHUB_ISSUES_URL = "https://github.com/holodreams123-afk/holodream/issues/new";

export function githubIssueUrl(entry: FeedbackEntry, title: string): string {
  const body = [
    entry.category && `**Category:** ${entry.category}`,
    entry.context && `**Context:** ${entry.context}`,
    "",
    entry.message,
    entry.contact && `\n---\nContact: ${entry.contact}`,
  ]
    .filter(Boolean)
    .join("\n");
  const params = new URLSearchParams({
    title,
    body,
  });
  return `${GITHUB_ISSUES_URL}?${params.toString()}`;
}
