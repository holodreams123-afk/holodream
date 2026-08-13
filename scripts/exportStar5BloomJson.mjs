/**
 * Export ★5 bloom stage data (wf-calc CardDataPage) → src/data/star5-bloom.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { canonicalTitle, ensureCardDataPage } from "./wfcalcImport.mjs";
import game from "../src/data/gameData.json" with { type: "json" };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../src/data/star5-bloom.json");

const GROUP_MAP = {
  "grp-regloss": "ReGLOSS",
  "grp-gen_0": "0期生",
  "grp-gen_1": "1期生",
  "grp-gen_2": "2期生",
  "grp-gen_3": "3期生",
  "grp-gen_4": "4期生",
  "grp-gen_5": "5期生",
  "grp-gamers": "ゲーマーズ",
  "grp-holox": "holoX",
  "grp-id_gen_1": "ID1期生",
  "grp-id_gen_2": "ID2期生",
  "grp-id_gen_3": "ID3期生",
  "grp-myth": "Myth",
  "grp-promise": "Promise",
  "grp-advent": "Advent",
};

const ATTR_MAP = { 1: "happy", 2: "cute", 3: "pure" };

function extractBlock(n) {
  const page = fs.readFileSync(path.join(__dirname, "_wfcalc_CardDataPage.js"), "utf8");
  let count = 0;
  let search = 0;
  while (true) {
    const start = page.indexOf("JSON.parse(`", search);
    if (start === -1) return null;
    let i = start + "JSON.parse(`".length;
    let buf = "";
    while (i < page.length) {
      const ch = page[i];
      if (ch === "`" && page[i - 1] !== "\\") break;
      buf += ch;
      i++;
    }
    if (count === n) return JSON.parse(buf);
    count++;
    search = i + 1;
  }
}

function mapGroup(id) {
  if (!id) return undefined;
  return GROUP_MAP[id] ?? id;
}

function convertEffect(e) {
  const value = Math.round(e.value / 10);
  const t = e.target ?? {};
  let target;
  let targetGroup;
  let targetCount;

  if (t.type === "self") target = "self";
  else if (t.type === "character_grouping") {
    targetGroup = mapGroup(t.character_grouping_id);
    targetCount = t.target_count;
  } else if (t.type === "attribute") {
    targetGroup = ATTR_MAP[t.card_attribute];
    targetCount = t.target_count;
  }

  if (e.type.includes("score_support") || e.type.includes("live_active_skill_effect")) {
    return { kind: "scoreSupportPassive", value, target, targetGroup, targetCount };
  }

  let param;
  if (e.type.includes("all_parameter")) param = "全パラメータ";
  else if (e.type.includes("performance")) param = "パフォーマンス";
  else if (e.type.includes("technique")) param = "テクニック";
  else if (e.type.includes("sense")) param = "センス";
  else return null;

  return { kind: "paramUp", param, value, target, targetGroup, targetCount };
}

function convertPassiveLevel(row) {
  return (row?.effects ?? []).map(convertEffect).filter(Boolean);
}

function extractScore(skillLevels, matchers) {
  const lv1 = skillLevels?.find((s) => s.level === 1);
  const lv2 = skillLevels?.find((s) => s.level === 2);
  if (!lv1) return { low: null, high: null };
  const e1 = lv1.effects?.find((e) => matchers.some((m) => e.type?.includes(m)));
  const e2 = lv2?.effects?.find((e) => matchers.some((m) => e.type?.includes(m)));
  if (!e1) return { low: null, high: null };
  return {
    low: Math.round(e1.value / 10),
    high: Math.round((e2?.value ?? e1.value) / 10),
  };
}

/** Active conditional bonus (additional_effects score_up). */
function extractActiveBonus(skillLevels) {
  const lv1 = skillLevels?.find((s) => s.level === 1);
  const lv2 = skillLevels?.find((s) => s.level === 2);
  const pick = (lv) => {
    const e = lv?.additional_effects?.find((x) => x.type?.includes("score_up"));
    return e ? Math.round(e.value / 10) : null;
  };
  const low = pick(lv1);
  const high = pick(lv2) ?? low;
  return { low, high };
}

/** SP skill activation rate (special additional_effects). */
function extractSpecialSkillRate(skillLevels) {
  const lv1 = skillLevels?.find((s) => s.level === 1);
  const lv2 = skillLevels?.find((s) => s.level === 2);
  const pick = (lv) => {
    const e = lv?.additional_effects?.find((x) =>
      x.type?.includes("activation_probability"),
    );
    return e ? Math.round(e.value / 10) : null;
  };
  const low = pick(lv1);
  const high = pick(lv2) ?? low;
  return { low, high };
}

function main() {
  ensureCardDataPage();
  const cards = (extractBlock(4) ?? []).filter((c) => c.rarity === 5);
  const gameIdByCanon = new Map(
    game.cards
      .filter((c) => c.rarity === 5)
      .map((c) => [`${c.member}\0${canonicalTitle(c.costumeName)}`, c.id]),
  );
  const out = {};

  for (const c of cards) {
    const cardId =
      gameIdByCanon.get(`${c.member}\0${canonicalTitle(c.title)}`) ??
      `${c.member}_5_${c.title}`;
    const active = extractScore(c.skills?.active, ["score_up"]);
    const activeBonus = extractActiveBonus(c.skills?.active);
    const special = extractScore(c.skills?.special, ["score_up", "score_support"]);
    const specialSkillRate = extractSpecialSkillRate(c.skills?.special);
    const passiveLow = convertPassiveLevel(c.skills?.passive?.find((p) => p.level === 1));
    const passiveHigh = convertPassiveLevel(c.skills?.passive?.find((p) => p.level === 2));

    out[cardId] = {
      activeLow: active.low,
      activeHigh: active.high,
      activeBonusLow: activeBonus.low,
      activeBonusHigh: activeBonus.high,
      specialLow: special.low,
      specialHigh: special.high,
      specialSkillRateLow: specialSkillRate.low,
      specialSkillRateHigh: specialSkillRate.high,
      passiveLow,
      passiveHigh: passiveHigh.length ? passiveHigh : passiveLow,
    };
  }

  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`Wrote ${Object.keys(out).length} ★5 bloom entries → ${outPath}`);
}

main();
