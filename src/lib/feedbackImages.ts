export const FEEDBACK_MAX_IMAGES = 3;
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.85;
const MAX_BLOB_BYTES = 900_000;

export type FeedbackAttachment = {
  id: string;
  previewUrl: string;
  blob: Blob;
  name: string;
};

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("decode"));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("encode"))),
      "image/jpeg",
      quality,
    );
  });
}

/** Resize and compress for upload / local storage. */
export async function compressFeedbackImage(file: File): Promise<Blob> {
  const img = await loadImageFromFile(file);
  let { width, height } = img;
  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
  width = Math.max(1, Math.round(width * scale));
  height = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(img, 0, 0, width, height);

  let quality = JPEG_QUALITY;
  let blob = await canvasToBlob(canvas, quality);
  while (blob.size > MAX_BLOB_BYTES && quality > 0.45) {
    quality -= 0.08;
    blob = await canvasToBlob(canvas, quality);
  }
  return blob;
}

export async function fileToFeedbackAttachment(file: File): Promise<FeedbackAttachment> {
  if (!file.type.startsWith("image/")) {
    throw new Error("type");
  }
  const blob = await compressFeedbackImage(file);
  return {
    id: crypto.randomUUID(),
    previewUrl: URL.createObjectURL(blob),
    blob,
    name: file.name.replace(/[^\w.\-()\u3000-\u9fff]+/g, "_").slice(0, 80) || "image.jpg",
  };
}

export function revokeFeedbackAttachment(att: FeedbackAttachment) {
  URL.revokeObjectURL(att.previewUrl);
}

export async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
