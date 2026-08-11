import type { FeedbackAttachment } from "./feedbackImages";
import { blobToDataUrl } from "./feedbackImages";

export type FeedbackKind = "report" | "suggest";

export type FeedbackEntry = {
  id: string;
  kind: FeedbackKind;
  category: string;
  context: string;
  message: string;
  contact: string;
  locale: string;
  imageUrls: string[];
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

const STORAGE_BUCKET = "feedback-images";

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

function normalizeEntry(raw: FeedbackEntry): FeedbackEntry {
  return { ...raw, imageUrls: raw.imageUrls ?? [] };
}

function loadFeedbackKind(kind: FeedbackKind): FeedbackEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[kind]);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FeedbackEntry[];
    return Array.isArray(parsed) ? parsed.map(normalizeEntry) : [];
  } catch {
    return [];
  }
}

export function saveFeedbackLocal(
  entry: Omit<FeedbackEntry, "id" | "createdAt"> & { id?: string },
): FeedbackEntry {
  const full: FeedbackEntry = normalizeEntry({
    ...entry,
    id: entry.id ?? crypto.randomUUID(),
    imageUrls: entry.imageUrls ?? [],
    createdAt: new Date().toISOString(),
  });
  const list = loadFeedbackKind(entry.kind);
  list.unshift(full);
  localStorage.setItem(STORAGE_KEYS[entry.kind], JSON.stringify(list.slice(0, 50)));
  return full;
}

function supabaseRestUrl(table: string, query = ""): string {
  return `${SUPABASE_URL!.replace(/\/$/, "")}/rest/v1/${table}${query}`;
}

function storageObjectUrl(path: string): string {
  return `${SUPABASE_URL!.replace(/\/$/, "")}/storage/v1/object/${STORAGE_BUCKET}/${path}`;
}

function remoteHeaders(contentType = "application/json"): HeadersInit | null {
  if (!feedbackCloudEnabled()) return null;
  return {
    apikey: SUPABASE_ANON_KEY!,
    Authorization: `Bearer ${SUPABASE_ANON_KEY!}`,
    "Content-Type": contentType,
    Prefer: "return=minimal",
  };
}

async function uploadFeedbackImages(
  kind: FeedbackKind,
  feedbackId: string,
  attachments: FeedbackAttachment[],
): Promise<string[]> {
  const headers = remoteHeaders("image/jpeg");
  if (!headers || !attachments.length) return [];

  const urls: string[] = [];
  for (let i = 0; i < attachments.length; i++) {
    const att = attachments[i];
    const path = `${kind}/${feedbackId}/${i}.jpg`;
    const res = await fetch(storageObjectUrl(path), {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": att.blob.type || "image/jpeg",
        "x-upsert": "true",
      },
      body: att.blob,
    });
    if (!res.ok) {
      const err = await res.text().catch(() => "");
      throw new Error(err || `upload HTTP ${res.status}`);
    }
    urls.push(storageObjectUrl(path));
  }
  return urls;
}

async function localImageUrls(attachments: FeedbackAttachment[]): Promise<string[]> {
  const urls: string[] = [];
  for (const att of attachments) {
    urls.push(await blobToDataUrl(att.blob));
  }
  return urls;
}

export async function submitFeedback(
  entry: Omit<FeedbackEntry, "id" | "createdAt" | "imageUrls">,
  attachments: FeedbackAttachment[] = [],
): Promise<FeedbackSubmitResult> {
  const id = crypto.randomUUID();
  let imageUrls: string[] = [];

  if (attachments.length) {
    if (feedbackCloudEnabled()) {
      try {
        imageUrls = await uploadFeedbackImages(entry.kind, id, attachments);
      } catch (e) {
        imageUrls = await localImageUrls(attachments);
        const saved = saveFeedbackLocal({ ...entry, id, imageUrls });
        return {
          entry: saved,
          cloudSaved: false,
          cloudError: e instanceof Error ? e.message : "upload",
        };
      }
    } else {
      imageUrls = await localImageUrls(attachments);
    }
  }

  const saved = saveFeedbackLocal({ ...entry, id, imageUrls });
  const headers = remoteHeaders();
  if (!headers) {
    return { entry: saved, cloudSaved: false };
  }

  try {
    const res = await fetch(supabaseRestUrl(CLOUD_TABLES[entry.kind]), {
      method: "POST",
      headers,
      body: JSON.stringify({
        id,
        category: entry.category.slice(0, 120),
        context: entry.context.slice(0, 120),
        message: entry.message.slice(0, 4000),
        contact: entry.contact.slice(0, 120),
        locale: entry.locale.slice(0, 16),
        image_urls: imageUrls.filter((u) => !u.startsWith("data:")),
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
export function saveFeedback(
  entry: Omit<FeedbackEntry, "id" | "createdAt" | "imageUrls"> & { imageUrls?: string[] },
): FeedbackEntry {
  return saveFeedbackLocal({ ...entry, imageUrls: entry.imageUrls ?? [] });
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
    images?: string;
  },
): string {
  const kind = entry.kind === "report" ? labels.kindReport : labels.kindSuggest;
  const httpImages = entry.imageUrls.filter((u) => !u.startsWith("data:"));
  const lines = [
    `[Holodream ${kind}]`,
    `${labels.time}: ${entry.createdAt}`,
    entry.locale ? `Locale: ${entry.locale}` : "",
    entry.category ? `${labels.category}: ${entry.category}` : "",
    entry.context ? `${labels.context}: ${entry.context}` : "",
    `${labels.message}:`,
    entry.message,
    entry.contact ? `${labels.contact}: ${entry.contact}` : "",
    httpImages.length && labels.images
      ? `${labels.images}:\n${httpImages.join("\n")}`
      : httpImages.length
        ? `Images:\n${httpImages.join("\n")}`
        : "",
  ].filter(Boolean);
  return lines.join("\n");
}

export const GITHUB_ISSUES_URL = "https://github.com/holodreams123-afk/holodream/issues/new";

export function githubIssueUrl(entry: FeedbackEntry, title: string): string {
  const httpImages = entry.imageUrls.filter((u) => !u.startsWith("data:"));
  const body = [
    entry.category && `**Category:** ${entry.category}`,
    entry.context && `**Context:** ${entry.context}`,
    "",
    entry.message,
    httpImages.length
      ? `\n**Screenshots:**\n${httpImages.map((u) => `- ${u}`).join("\n")}`
      : entry.imageUrls.length
        ? "\n*(Images attached locally — please add screenshots manually if needed.)*"
        : "",
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
