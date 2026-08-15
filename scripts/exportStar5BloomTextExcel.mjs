/**
 * Build ★5 per-bloom-stage skill text library:
 * - Bloom 5: 角色名片 catalog (verbatim)
 * - Bloom 0–4: bloom table numbers + formatter (catalog-style zh)
 *
 * Outputs:
 *   src/data/star5-bloom-text.json
 *   角色名片/5星绽放文案库.xlsx
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";
import game from "../src/data/gameData.json" with { type: "json" };
import { catalogByCardId } from "../src/lib/cardCatalog.ts";
import {
  substituteActiveCatalogText,
  substitutePassiveCatalogText,
  substituteSpCatalogText,
} from "../src/lib/bloomSkillText.ts";
import { applyBloomToCard, MAX_BLOOM } from "../src/lib/bloom.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const jsonOut = path.join(root, "src/data/star5-bloom-text.json");
const xlsxOut = path.join(root, "角色名片", "5星绽放文案库.xlsx");

const catalogList = [...catalogByCardId.values()].sort((a, b) =>
  String(a.no ?? "").localeCompare(String(b.no ?? ""), undefined, { numeric: true }),
);

const cardById = new Map(game.cards.filter((c) => c.rarity === 5).map((c) => [c.id, c]));

function statsForStage(card, catalog, stage) {
  if (stage >= MAX_BLOOM && catalog?.stats) {
    return { ...catalog.stats };
  }
  const bloomed = applyBloomToCard(card, stage);
  return bloomed.stats
    ? {
        performance: bloomed.stats.performance,
        technique: bloomed.stats.technique,
        sense: bloomed.stats.sense,
        total: bloomed.stats.total,
      }
    : null;
}

function skillsForStage(card, catalog, stage) {
  const bloomed = applyBloomToCard(card, stage);
  if (stage >= MAX_BLOOM) {
    return {
      sp: catalog.skills.sp ?? "",
      active: catalog.skills.active ?? "",
      passive: catalog.skills.passive ?? "",
      source: "角色名片",
    };
  }
  return {
    sp: catalog.skills.sp
      ? substituteSpCatalogText(catalog.skills.sp, bloomed.special)
      : "",
    active: catalog.skills.active
      ? substituteActiveCatalogText(catalog.skills.active, bloomed.active)
      : "",
    passive: catalog.skills.passive
      ? substitutePassiveCatalogText(catalog.skills.passive, bloomed.passive)
      : "",
    source: "角色名片模板+綻放數值",
  };
}

const library = {
  generatedAt: new Date().toISOString(),
  note: "满绽(5)文案来自角色名片 OCR；绽0–4以满绽中文为模板，仅替换绽放表数值",
  cards: [],
};

const wideHeaders = ["#", "成員", "卡名", "cardId"];
for (let s = 0; s <= MAX_BLOOM; s++) {
  wideHeaders.push(
    `綻${s}_表現力`,
    `綻${s}_技巧`,
    `綻${s}_品味`,
    `綻${s}_總計`,
    `綻${s}_SP`,
    `綻${s}_A`,
    `綻${s}_P`,
  );
}
wideHeaders.push("衣裝技能(滿綻)");

const wideRows = [];
const longHeaders = [
  "#",
  "成員",
  "卡名",
  "cardId",
  "綻放",
  "表現力",
  "技巧",
  "品味",
  "總計",
  "SP",
  "A",
  "P",
  "文案來源",
];
const longRows = [];

let missing = 0;

for (const cat of catalogList) {
  const card = cardById.get(cat.cardId);
  if (!card) {
    console.warn("Missing gameData card:", cat.cardId);
    missing += 1;
    continue;
  }

  const entry = {
    cardId: cat.cardId,
    no: cat.no,
    member: cat.member,
    card: cat.card,
    costumeSkill: cat.costumeSkill ?? "",
    stages: {},
  };

  const wideRow = [cat.no, cat.member, cat.card, cat.cardId];

  for (let stage = 0; stage <= MAX_BLOOM; stage++) {
    const stats = statsForStage(card, cat, stage);
    const skills = skillsForStage(card, cat, stage);
    entry.stages[String(stage)] = { stats, ...skills };

    wideRow.push(
      stats?.performance ?? "",
      stats?.technique ?? "",
      stats?.sense ?? "",
      stats?.total ?? "",
      skills.sp,
      skills.active,
      skills.passive,
    );

    longRows.push([
      cat.no,
      cat.member,
      cat.card,
      cat.cardId,
      stage,
      stats?.performance ?? "",
      stats?.technique ?? "",
      stats?.sense ?? "",
      stats?.total ?? "",
      skills.sp,
      skills.active,
      skills.passive,
      skills.source,
    ]);
  }

  wideRow.push(cat.costumeSkill ?? "");
  wideRows.push(wideRow);
  library.cards.push(entry);
}

fs.mkdirSync(path.dirname(jsonOut), { recursive: true });
fs.writeFileSync(jsonOut, JSON.stringify(library, null, 2) + "\n");

const wsWide = XLSX.utils.aoa_to_sheet([wideHeaders, ...wideRows]);
wsWide["!cols"] = wideHeaders.map((h) => ({
  wch: h.includes("_SP") || h.includes("_A") || h.includes("_P") ? 52 : h === "cardId" ? 36 : 12,
}));

const wsLong = XLSX.utils.aoa_to_sheet([longHeaders, ...longRows]);
wsLong["!cols"] = [
  { wch: 4 },
  { wch: 12 },
  { wch: 28 },
  { wch: 36 },
  { wch: 6 },
  { wch: 8 },
  { wch: 8 },
  { wch: 8 },
  { wch: 8 },
  { wch: 52 },
  { wch: 56 },
  { wch: 48 },
  { wch: 14 },
];

const legend = [
  ["綻放", "數值來源", "文案來源"],
  [0, "star5-bloom.json 低綻", "滿綻名片中文模板，只換數值"],
  [1, "A 升級（含條件加碼）", "同上"],
  [2, "三圍 +10%", "同上；三圍綻2+為滿綻值"],
  [3, "SP 升級（含發動率）", "同上"],
  [4, "P 升級", "同上"],
  [5, "Connect（技能同4）", "角色名片 OCR 原文"],
  ["", "", ""],
  ["工作表", "說明", ""],
  ["綻放文案(寬)", "每卡一行，綻0–5 各欄 SP/A/P", ""],
  ["綻放文案(長)", "每卡每綻一行，方便篩選", ""],
  ["star5-bloom-text.json", "同上結構，供網站讀取", ""],
];
const wsLegend = XLSX.utils.aoa_to_sheet(legend);

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, wsWide, "綻放文案(寬)");
XLSX.utils.book_append_sheet(wb, wsLong, "綻放文案(長)");
XLSX.utils.book_append_sheet(wb, wsLegend, "說明");

fs.mkdirSync(path.dirname(xlsxOut), { recursive: true });
XLSX.writeFile(wb, xlsxOut);

console.log({
  cards: library.cards.length,
  missing,
  json: jsonOut,
  xlsx: xlsxOut,
});
