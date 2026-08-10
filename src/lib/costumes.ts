import type { Card, Costume } from "../types";

const costumeKey = (member: string, costumeName: string) => `${member}\0${costumeName}`;

/** Lookup table: member + costumeName → captain costume skill. */
export function buildCostumeLookup(costumes: Costume[]): Map<string, Costume> {
  const map = new Map<string, Costume>();
  for (const c of costumes) {
    map.set(costumeKey(c.member, c.costumeName), c);
  }
  return map;
}

export function costumeForCard(lookup: Map<string, Costume>, card: Card): Costume | undefined {
  return lookup.get(costumeKey(card.member, card.costumeName));
}

export function hasDisplayableCostumeSkill(costume: Costume): boolean {
  const raw = costume.skill.raw?.trim();
  if (!raw || raw === "なし") return false;
  return costume.skill.effects.length > 0 || raw.length > 0;
}

/** Costume tied to a ★5 permanent or event-tagged card. */
export function isStar5OrEventCostume(costume: Costume, cards: Card[]): boolean {
  return cards.some(
    (c) =>
      c.member === costume.member &&
      c.costumeName === costume.costumeName &&
      (c.rarity === 5 || !!c.event),
  );
}

/** All captain costumes for a member, strongest skill first. */
export function captainCostumesForMember(costumes: Costume[], member: string): Costume[] {
  return costumes
    .filter((c) => c.member === member)
    .sort((a, b) => b.skill.score - a.skill.score);
}
