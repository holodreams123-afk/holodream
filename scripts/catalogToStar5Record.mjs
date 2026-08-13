/**
 * Build ★5 gameData record from 角色名片 catalog entry (structured parse).
 */
import {
  parseCatalogActive,
  parseCatalogCostume,
  parseCatalogPassive,
  parseCatalogSpecial,
} from "./catalogSkillParse.mjs";

function normalizePassiveEffects(passive) {
  const effects = (passive.effects ?? []).map((e) => {
    if (typeof e.targetGroup === "string" && /^\d$/.test(e.targetGroup)) {
      return { ...e, targetGroup: `${e.targetGroup}期生` };
    }
    return e;
  });
  let condition = passive.condition;
  if (!condition) {
    for (const e of effects) {
      if (e.target === "self") continue;
      if (e.targetGroup && ["happy", "pure", "cute"].includes(e.targetGroup)) {
        condition = { type: "typeCount", attr: e.targetGroup, min: e.targetCount ?? 1 };
        break;
      }
      if (e.targetGroup && e.targetCount) {
        condition = { type: "unitCount", unit: e.targetGroup, min: e.targetCount };
        break;
      }
    }
  }
  return { ...passive, condition, effects };
}

export function catalogEntryToStar5Record(entry, card) {
  const active = parseCatalogActive(entry.skills?.active ?? "");
  const passive = normalizePassiveEffects(parseCatalogPassive(entry.skills?.passive ?? ""));
  const special = parseCatalogSpecial(entry.skills?.sp ?? "");
  const costumeSkill = parseCatalogCostume(entry.costumeSkill ?? "");

  return {
    member: card.member,
    costumeName: card.costumeName,
    type: card.type,
    unit: card.unit,
    stats: {
      performance: entry.stats?.performance ?? 0,
      technique: entry.stats?.technique ?? 0,
      sense: entry.stats?.sense ?? 0,
      total: entry.stats?.total ?? 0,
    },
    special,
    active,
    passive,
    costumeSkill,
    cardId: entry.cardId,
  };
}
