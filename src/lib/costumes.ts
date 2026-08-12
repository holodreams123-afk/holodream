import type { Card, Costume } from "../types";

const costumeKey = (member: string, costumeName: string) => `${member}\0${costumeName}`;

/** Normalize costume/card titles for fuzzy matching (mirrors scripts/wfcalcImport.mjs). */
function canonicalCostumeTitle(s: string): string {
  return String(s ?? "")
    .normalize("NFKC")
    .replace(/！/g, "!")
    .replace(/％/g, "%")
    .replace(/\s+/g, "")
    .replace(/[''‛`´]/g, "")
    .replace(/パーティー/g, "パーティ")
    .replace(/nepholim/gi, "nephilim")
    .replace(/鍛冶場に匹敵/g, "鍛冶場に響く")
    .replace(/探求心/g, "探究心")
    .replace(/るんるん/g, "らんらん")
    .replace(/ふわゆる/g, "ゆるふわ")
    .replace(/ばっきゅん/g, "ぱっきゅん")
    .replace(/全快/g, "全開")
    .replace(/バンチライン/g, "パンチライン")
    .replace(/湧かす/g, "沸かす")
    .replace(/保険医/g, "保健医")
    .replace(/どこまでも/g, "どこでも")
    .replace(/lion.?s/gi, "lions")
    .replace(/let.?s/gi, "lets")
    .replace(/ホット/g, "ホッと")
    .replace(/フワワ/g, "フワフワ")
    .toLowerCase();
}

/** Lookup table: member + costumeName → captain costume skill. */
export function buildCostumeLookup(costumes: Costume[]): Map<string, Costume> {
  const map = new Map<string, Costume>();
  for (const c of costumes) {
    map.set(costumeKey(c.member, c.costumeName), c);
  }
  return map;
}

export function costumeForCard(lookup: Map<string, Costume>, card: Card): Costume | undefined {
  const exact = lookup.get(costumeKey(card.member, card.costumeName));
  if (exact) return exact;
  const canon = canonicalCostumeTitle(card.costumeName);
  for (const cos of lookup.values()) {
    if (cos.member === card.member && canonicalCostumeTitle(cos.costumeName) === canon) {
      return cos;
    }
  }
  return undefined;
}

/** Card art source for a captain costume (exact or canonical title match). */
export function cardForCostume(cards: Card[], costume: Costume): Card | undefined {
  const exact = cards.find(
    (c) => c.member === costume.member && c.costumeName === costume.costumeName,
  );
  if (exact) return exact;
  const canon = canonicalCostumeTitle(costume.costumeName);
  return cards.find(
    (c) => c.member === costume.member && canonicalCostumeTitle(c.costumeName) === canon,
  );
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
