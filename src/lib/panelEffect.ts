import { cleanMemberUnits, primaryUnit } from "./groups";
import type { Card, GameData } from "../types";

/** Holo 總合力面板：依該期別在名冊中的總人數，每位上場成員貢獻固定值。 */
export const PANEL_VALUE_BY_ROSTER_SIZE: Readonly<Record<number, number>> = {
  5: 1500,
  4: 1200,
  3: 1350,
};

export type PanelEffectLine = {
  member: string;
  unit: string;
  rosterSize: number;
  value: number;
};

export type PanelEffectResult = {
  total: number;
  lines: PanelEffectLine[];
};

/** Count unique members per 期別／組別（含雙期別成員）。 */
export function buildUnitRosterSizes(
  members: GameData["members"],
): Map<string, number> {
  const sets = new Map<string, Set<string>>();
  for (const [name, meta] of Object.entries(members)) {
    for (const unit of cleanMemberUnits(meta.units)) {
      let set = sets.get(unit);
      if (!set) {
        set = new Set();
        sets.set(unit, set);
      }
      set.add(name);
    }
  }
  return new Map([...sets.entries()].map(([unit, names]) => [unit, names.size]));
}

export function panelValueForRosterSize(rosterSize: number): number {
  return PANEL_VALUE_BY_ROSTER_SIZE[rosterSize] ?? 0;
}

/**
 * Each lineup member adds one panel chunk from their primary 期別
 * (dual-unit members e.g. Fubuki use primaryUnit, not double-counted).
 */
export function calcPanelEffect(
  cards: Card[],
  data: GameData,
  rosterSizes = buildUnitRosterSizes(data.members),
): PanelEffectResult {
  const lines: PanelEffectLine[] = [];
  let total = 0;

  for (const card of cards) {
    const meta = data.members[card.member];
    const unit = primaryUnit(meta?.units, card.unit);
    const rosterSize = rosterSizes.get(unit) ?? 0;
    const value = panelValueForRosterSize(rosterSize);
    lines.push({ member: card.member, unit, rosterSize, value });
    total += value;
  }

  return { total, lines };
}
