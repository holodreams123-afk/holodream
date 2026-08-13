import type { Attr, Card, Condition, GameData, MemberMeta, PassiveSkill } from "../types";

export function memberUnits(meta: MemberMeta | undefined, card: Card): string[] {
  const units = new Set<string>(meta?.units ?? []);
  if (card.unit) units.add(card.unit);
  return [...units];
}

export function countTypes(cards: Card[]): Record<Attr, number> {
  const counts: Record<Attr, number> = { happy: 0, pure: 0, cute: 0 };
  for (const c of cards) counts[c.type] += 1;
  return counts;
}

export function countUnits(cards: Card[], data: GameData): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const c of cards) {
    for (const u of memberUnits(data.members[c.member], c)) {
      counts[u] = (counts[u] ?? 0) + 1;
    }
  }
  return counts;
}

const TYPE_ATTRS: Attr[] = ["happy", "pure", "cute"];

/** Fix legacy parse bugs (e.g. targetGroup "0" instead of "0期生"). */
export function normalizePassiveSkill(passive: PassiveSkill): PassiveSkill {
  let condition = passive.condition;
  const effects = passive.effects.map((e) => {
    if (typeof e.targetGroup === "string" && /^\d$/.test(e.targetGroup)) {
      return { ...e, targetGroup: `${e.targetGroup}期生` };
    }
    return e;
  });

  if (!condition) {
    for (const e of effects) {
      if (e.target === "self") continue;
      if (e.targetGroup && TYPE_ATTRS.includes(e.targetGroup as Attr)) {
        condition = {
          type: "typeCount",
          attr: e.targetGroup as Attr,
          min: e.targetCount ?? 1,
        };
        break;
      }
      if (e.targetGroup && e.targetCount) {
        condition = { type: "unitCount", unit: e.targetGroup, min: e.targetCount };
        break;
      }
    }
  }

  if (condition === passive.condition && effects === passive.effects) return passive;
  return { ...passive, condition, effects };
}

/** Passive trigger condition after normalizing legacy data quirks. */
export function passiveCondition(passive: PassiveSkill): Condition | null {
  return normalizePassiveSkill(passive).condition;
}

export function isPassiveConditionMet(
  passive: PassiveSkill,
  typeCounts: Record<Attr, number>,
  unitCounts: Record<string, number>,
): boolean {
  const normalized = normalizePassiveSkill(passive);
  if (normalized.condition) {
    return isConditionMet(normalized.condition, typeCounts, unitCounts);
  }
  const needsTeam = normalized.effects.some(
    (e) => e.targetGroup && e.target !== "self",
  );
  if (needsTeam) return false;
  return true;
}

/** Life / combo etc. are assumed achievable during a clean play. */
export function isConditionMet(
  condition: Condition | null | undefined,
  typeCounts: Record<Attr, number>,
  unitCounts: Record<string, number>,
): boolean {
  if (!condition) return true;
  if (condition.type === "misc") return true;
  if (condition.type === "typeCount") {
    return (typeCounts[condition.attr] ?? 0) >= condition.min;
  }
  if (condition.type === "unitCount") {
    return (unitCounts[condition.unit] ?? 0) >= condition.min;
  }
  return false;
}

export const ATTR_LABEL: Record<Attr, string> = {
  happy: "快樂類型",
  pure: "清純類型",
  cute: "可愛類型",
};

export const ATTR_JP: Record<Attr, string> = {
  happy: "快樂類型",
  pure: "清純類型",
  cute: "可愛類型",
};
