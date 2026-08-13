/**
 * Export all ★5 bloom stage changes from wf-calc CardDataPage → Excel.
 * Source: https://dreams.wf-calc.net/simulator
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";
import { ensureCardDataPage } from "./wfcalcImport.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const pagePath = path.join(__dirname, "_wfcalc_CardDataPage.js");
const outPath = path.join(root, "角色名片", "5星开花变化.xlsx");
const catalogPath = path.join(root, "角色名片", "card-catalog.json");

function extractAllBlocks() {
  const page = fs.readFileSync(pagePath, "utf8");
  const blocks = [];
  let search = 0;
  while (true) {
    const start = page.indexOf("JSON.parse(`", search);
    if (start === -1) break;
    let i = start + "JSON.parse(`".length;
    let buf = "";
    while (i < page.length) {
      const ch = page[i];
      if (ch === "`" && page[i - 1] !== "\\") break;
      buf += ch;
      i++;
    }
    try {
      blocks.push(JSON.parse(buf));
    } catch {
      blocks.push(null);
    }
    search = i + 1;
  }
  return blocks;
}

function permilToPct(v) {
  return v / 10;
}

function effectLabel(type) {
  if (type.includes("all_parameter")) return "全能力";
  if (type.includes("performance")) return "表現力";
  if (type.includes("technique")) return "技巧";
  if (type.includes("sense")) return "品味";
  if (type.includes("score_support")) return "分數支援";
  if (type.includes("live_active_skill_effect")) return "分數加成效果";
  return type;
}

function extractScoreEffect(skillLevels, typeMatchers) {
  const lv1 = skillLevels?.find((s) => s.level === 1);
  const lv2 = skillLevels?.find((s) => s.level === 2);
  if (!lv1 || !lv2) return { before: null, after: null };
  const e1 = lv1.effects?.find((e) => typeMatchers.some((m) => e.type?.includes(m)));
  const e2 = lv2.effects?.find((e) => typeMatchers.some((m) => e.type?.includes(m)));
  if (!e1) return { before: null, after: null };
  return {
    before: permilToPct(e1.value),
    after: e2 && e2.value !== e1.value ? permilToPct(e2.value) : permilToPct(e1.value),
  };
}

function formatPassive(passive, level) {
  const row = passive?.find((s) => s.level === level);
  if (!row?.effects?.length) return "";
  return row.effects
    .map((e) => `${effectLabel(e.type)} ${permilToPct(e.value)}%`)
    .join("；");
}

function buildCatalogIndex() {
  const index = new Map();
  if (!fs.existsSync(catalogPath)) return index;
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  for (const row of catalog) {
    if (row.cardId) index.set(row.cardId, row);
    index.set(`${row.card}`, row);
  }
  return index;
}

function main() {
  ensureCardDataPage();
  const blocks = extractAllBlocks();
  const titles = blocks[0] ?? {};
  const cards = (blocks[4] ?? []).filter((c) => c.rarity === 5);
  const catalogIndex = buildCatalogIndex();

  const headers = [
    "#",
    "成員",
    "卡名",
    "日文卡名",
    "開花0 A%",
    "開花1 A%",
    "開花2 三圍",
    "開花2 SP%",
    "開花3 SP%",
    "開花3 P",
    "開花4 P",
    "開花5",
    "等級上限(開花0)",
    "等級上限(開花1)",
    "等級上限(開花2)",
    "等級上限(開花3)",
    "等級上限(開花4)",
    "cardId",
  ];

  const rows = cards.map((c, idx) => {
    const cardId = `${c.member}_5_${c.title}`;
    const meta = titles[c.member]?.[c.title];
    const zhTitle = meta?.["zh-Hant"] ?? c.title;
    const catalog = catalogIndex.get(cardId) ?? catalogIndex.get(zhTitle);
    const memberZh = catalog?.member ?? c.member;

    const active = extractScoreEffect(c.skills?.active, ["score_up"]);
    const special = extractScoreEffect(c.skills?.special, ["score_up", "score_support"]);
    const caps = c.level_limits_by_limit_break ?? {};

    return [
      catalog?.no ?? String(idx + 1).padStart(2, "0"),
      memberZh,
      zhTitle,
      c.title,
      active.before ?? "",
      active.after ?? "",
      "+10%",
      special.before ?? "",
      special.after ?? "",
      formatPassive(c.skills?.passive, 1),
      formatPassive(c.skills?.passive, 2),
      "Connect 升級（技能同開花4）",
      caps["0"] ?? "",
      caps["1"] ?? "",
      caps["2"] ?? "",
      caps["3"] ?? "",
      caps["4"] ?? "",
      cardId,
    ];
  });

  rows.sort((a, b) => String(a[0]).localeCompare(String(b[0]), undefined, { numeric: true }));

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  ws["!cols"] = [
    { wch: 4 },
    { wch: 12 },
    { wch: 28 },
    { wch: 24 },
    { wch: 10 },
    { wch: 10 },
    { wch: 12 },
    { wch: 10 },
    { wch: 10 },
    { wch: 28 },
    { wch: 28 },
    { wch: 24 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 36 },
  ];

  const legendHeaders = ["開花", "效果", "說明"];
  const legendRows = [
    [0, "基準", "A / SP / P 為 skill level 1；三圍為基礎值"],
    [1, "主動技升級", "A 技能 % 從 level 1 → level 2"],
    [2, "三圍 +10%", "全卡固定 +10%（permil 100）"],
    [3, "SP 升級", "SP 技能 % 從 level 1 → level 2"],
    [4, "被動升級", "P 技能 % 從 level 1 → level 2"],
    [5, "Connect 升級", "右欄技能同開花 4；Connect／衣裝連結效果升級"],
  ];
  const wsLegend = XLSX.utils.aoa_to_sheet([legendHeaders, ...legendRows]);
  wsLegend["!cols"] = [{ wch: 8 }, { wch: 16 }, { wch: 52 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "5星開花");
  XLSX.utils.book_append_sheet(wb, wsLegend, "開花規律");

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  XLSX.writeFile(wb, outPath);
  console.log(`Exported ${rows.length} ★5 cards → ${outPath}`);
}

main();
