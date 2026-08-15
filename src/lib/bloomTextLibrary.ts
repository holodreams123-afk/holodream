import bloomTextData from "../data/star5-bloom-text.json";
import { MAX_BLOOM } from "./bloom";

export type BloomStageSkills = {
  stats: {
    performance: number;
    technique: number;
    sense: number;
    total: number;
  } | null;
  sp: string;
  active: string;
  passive: string;
};

type BloomTextCard = {
  cardId: string;
  stages: Record<string, BloomStageSkills & { source?: string }>;
};

const byCardId = new Map<string, BloomTextCard>(
  (bloomTextData.cards as BloomTextCard[]).map((c) => [c.cardId, c]),
);

export function getBloomStageSkills(
  cardId: string,
  bloomStage: number,
): BloomStageSkills | null {
  const entry = byCardId.get(cardId);
  if (!entry) return null;
  const stage = Math.max(0, Math.min(MAX_BLOOM, Math.floor(bloomStage)));
  const row = entry.stages[String(stage)];
  if (!row) return null;
  return {
    stats: row.stats ?? null,
    sp: row.sp,
    active: row.active,
    passive: row.passive,
  };
}

export function hasBloomTextLibrary(cardId: string): boolean {
  return byCardId.has(cardId);
}
