/**
 * Export 角色名片/card-catalog.json → card-catalog.xlsx
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const catalogPath = path.join(root, "角色名片", "card-catalog.json");
const outPath = path.join(root, "角色名片", "card-catalog.xlsx");

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));

const headers = [
  "#",
  "成員",
  "卡名",
  "總計",
  "表現力",
  "技巧",
  "品味",
  "特殊技能(SP)",
  "主動技能(A)",
  "被動技能(P)",
  "衣裝技能",
  "cardId",
];

const rows = catalog.map((r) => [
  r.no,
  r.member,
  r.card,
  r.stats.total,
  r.stats.performance,
  r.stats.technique,
  r.stats.sense,
  r.skills.sp,
  r.skills.active,
  r.skills.passive,
  r.costumeSkill,
  r.cardId ?? "",
]);

const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
ws["!cols"] = [
  { wch: 4 },
  { wch: 14 },
  { wch: 28 },
  { wch: 8 },
  { wch: 8 },
  { wch: 8 },
  { wch: 8 },
  { wch: 48 },
  { wch: 52 },
  { wch: 44 },
  { wch: 52 },
  { wch: 36 },
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "角色名片");

XLSX.writeFile(wb, outPath);
console.log(`Exported ${rows.length} cards → ${outPath}`);
