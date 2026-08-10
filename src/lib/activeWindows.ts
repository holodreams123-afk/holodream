import { isConditionMet } from "./conditions";
import type { ActiveWindow } from "./coverage";
import type { ActiveSkill, Attr, Card, Condition } from "../types";

/** Parse the bonus score-up % from JP active raw (second 「スコアが…%UP」). */
export function parseActiveBonusScoreUp(raw: string): number | null {
  const matches = [...raw.replace(/\s+/g, "").matchAll(/スコアが(\d+)%UP/gi)];
  if (matches.length < 2) return null;
  const v = +matches[matches.length - 1][1];
  return Number.isFinite(v) && v > 0 ? v : null;
}

export function isActiveBonusRuntimeCondition(
  condition: Condition | null | undefined,
): boolean {
  return condition?.type === "misc";
}

/** Team-composition bonus met (misc life/combo assumed achievable). */
export function isActiveBonusMet(
  active: ActiveSkill,
  typeCounts: Record<Attr, number>,
  unitCounts: Record<string, number>,
): boolean {
  if (!active.bonus) return false;
  return isConditionMet(active.bonus.condition, typeCounts, unitCounts);
}

/** Score UP % used for coverage / timeline (bonus replaces base when met). */
export function resolveActiveScoreUp(active: ActiveSkill, bonusOk: boolean): number {
  const base = active.scoreUp ?? 0;
  if (!bonusOk || !active.bonus) return base;

  let bonusVal: number | null = active.bonus.scoreUp ?? null;
  if (bonusVal == null || Number.isNaN(bonusVal) || bonusVal <= 0) {
    bonusVal = parseActiveBonusScoreUp(active.raw);
  }
  if (bonusVal != null && bonusVal > 0) return bonusVal;
  return base;
}

/** Build active Score UP windows for coverage (bonus conditions from team context). */
export function buildActiveWindows(
  cards: Card[],
  typeCounts: Record<Attr, number>,
  unitCounts: Record<string, number>,
): ActiveWindow[] {
  return cards.map((c) => {
    const bonusOk =
      !!c.active.bonus &&
      isConditionMet(c.active.bonus.condition, typeCounts, unitCounts);
    return {
      interval: c.active.interval,
      duration: c.active.duration,
      scoreUp: resolveActiveScoreUp(c.active, bonusOk),
    };
  });
}
