import type { TeamEvaluation } from "../types";

export const COOLDOWN_REDUCTION_OPTIONS = [0, 4, 8, 12] as const;
export type CooldownReductionPct = (typeof COOLDOWN_REDUCTION_OPTIONS)[number];

export interface TeamTimelineSettings {
  reductions: number[];
}

export function teamTimelineKey(ev: TeamEvaluation): string {
  return `${ev.costume.id}|${ev.cards.map((c) => c.id).join(",")}`;
}

export function defaultTimelineSettings(cardCount = 5): TeamTimelineSettings {
  return {
    reductions: Array.from({ length: cardCount }, () => 0),
  };
}
