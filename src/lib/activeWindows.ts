import { isConditionMet } from "./conditions";
import type { ActiveWindow } from "./coverage";
import type { ActiveSkill, Attr, Card } from "../types";

/** Score UP % used for coverage / timeline (bonus only when it has a numeric value). */
export function resolveActiveScoreUp(active: ActiveSkill, bonusOk: boolean): number {
  const base = active.scoreUp ?? 0;
  const bonusVal = active.bonus?.scoreUp;
  if (
    bonusOk &&
    bonusVal != null &&
    !Number.isNaN(bonusVal) &&
    bonusVal > 0
  ) {
    return bonusVal;
  }
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
