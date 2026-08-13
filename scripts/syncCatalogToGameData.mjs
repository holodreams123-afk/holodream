/**
 * Push verified 角色名片 data into gameData.json for computation.
 * Catalog is source of truth for ★5 stats, card skills, and captain costume skills.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
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

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(root, "角色名片/card-catalog.json");
const dataPath = path.join(root, "src/data/gameData.json");

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const byId = new Map(catalog.map((e) => [e.cardId, e]));
const cardById = new Map(data.cards.map((c) => [c.id, c]));

let statsUpdated = 0;
let skillsUpdated = 0;
let costumesUpdated = 0;
const warnings = [];

function sameJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function sameActive(a, b) {
  return (
    a.interval === b.interval &&
    a.duration === b.duration &&
    a.scoreUp === b.scoreUp &&
    a.probability === b.probability &&
    sameJson(a.bonus, b.bonus)
  );
}

function samePassive(a, b) {
  return (
    sameJson(a.condition, b.condition) &&
    sameJson(a.effects, b.effects)
  );
}

function sameSpecial(a, b) {
  return (
    a.duration === b.duration &&
    a.scoreSupport === b.scoreSupport &&
    a.skillRate === b.skillRate &&
    a.skillRateCondition === b.skillRateCondition
  );
}

function sameCostumeSkill(a, b) {
  return (
    sameJson(a.condition, b.condition) &&
    sameJson(a.effects, b.effects) &&
    a.unconditional === b.unconditional
  );
}

for (const entry of catalog) {
  const card = cardById.get(entry.cardId);
  if (!card) {
    warnings.push(`missing gameData card: ${entry.cardId}`);
    continue;
  }
  if (card.rarity !== 5) continue;

  if (entry.stats) {
    const next = { ...entry.stats };
    if (!sameJson(card.stats, next)) {
      card.stats = next;
      statsUpdated += 1;
    }
  }

  const active = parseCatalogActive(entry.skills?.active ?? "");
  const passive = normalizePassiveEffects(parseCatalogPassive(entry.skills?.passive ?? ""));
  const special = parseCatalogSpecial(entry.skills?.sp ?? "");

  if (!active.interval) {
    warnings.push(`active parse failed: ${entry.cardId}`);
  } else if (!sameActive(card.active, active)) {
    card.active = active;
    skillsUpdated += 1;
  }

  if (!passive.effects.length) {
    warnings.push(`passive parse failed: ${entry.cardId}`);
  } else if (!samePassive(card.passive, passive)) {
    card.passive = passive;
    skillsUpdated += 1;
  }

  if (!special.duration && !special.scoreSupport) {
    warnings.push(`special parse failed: ${entry.cardId}`);
  } else if (!sameSpecial(card.special, special)) {
    card.special = special;
    skillsUpdated += 1;
  }

  const costume = data.costumes.find(
    (c) => c.member === card.member && c.costumeName === card.costumeName,
  );
  if (!costume) {
    warnings.push(`missing costume: ${card.member} / ${card.costumeName}`);
    continue;
  }

  const costumeSkill = parseCatalogCostume(entry.costumeSkill ?? "");
  if (!costumeSkill.effects.length) {
    warnings.push(`costume parse failed: ${entry.cardId}`);
    continue;
  }
  if (!sameCostumeSkill(costume.skill, costumeSkill)) {
    costume.skill = costumeSkill;
    costumesUpdated += 1;
  }
}

fs.writeFileSync(dataPath, JSON.stringify(data));

console.log(
  `Catalog → gameData: ${statsUpdated} stats, ${skillsUpdated} skill blocks, ${costumesUpdated} costumes (${catalog.length} entries).`,
);
if (warnings.length) {
  console.warn(`Warnings (${warnings.length}):`);
  for (const w of warnings.slice(0, 20)) console.warn(`  ${w}`);
  if (warnings.length > 20) console.warn(`  … and ${warnings.length - 20} more`);
}
