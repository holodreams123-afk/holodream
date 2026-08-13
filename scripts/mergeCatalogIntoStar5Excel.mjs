/**
 * Append ★5 rows from 角色名片/card-catalog.json into hololive_Dreams_.xlsx
 * when Excel is missing cards that exist in the catalog + gameData.
 *
 * Usage: node scripts/mergeCatalogIntoStar5Excel.mjs [--dry-run]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";
import { catalogEntryToExcelRow } from "./catalogToExcelFormat.mjs";
import { col } from "./excelStar5Parse.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const xlsxPath = path.join(root, "hololive_Dreams_.xlsx");
const catalogPath = path.join(root, "角色名片", "card-catalog.json");
const dataPath = path.join(root, "src/data/gameData.json");

const dryRun = process.argv.includes("--dry-run");

if (!fs.existsSync(xlsxPath)) {
  console.error("Missing hololive_Dreams_.xlsx — download OneDrive Excel to repo root first.");
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const cardById = new Map(data.cards.map((c) => [c.id, c]));

const wb = XLSX.readFile(xlsxPath);
const sheetName = wb.SheetNames.find((n) => n.includes("5")) ?? wb.SheetNames[0];
const sheet = wb.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

const existingCostumes = new Set(rows.map((r) => String(col(r, "卡片名稱")).trim()));

/** @type {object[]} */
const toAdd = [];

for (const entry of catalog) {
  if (!entry.cardId) continue;
  const card = cardById.get(entry.cardId);
  if (!card || card.rarity !== 5) continue;
  if (existingCostumes.has(card.costumeName)) continue;

  const excelRow = catalogEntryToExcelRow(entry, card);
  const { _cardId, ...row } = excelRow;
  toAdd.push(row);
  existingCostumes.add(card.costumeName);
}

if (!toAdd.length) {
  console.log("Excel already has all catalog ★5 cards — nothing to merge.");
  process.exit(0);
}

console.log(`Merging ${toAdd.length} catalog row(s) into ${sheetName}:`);
for (const row of toAdd) {
  console.log(`  + ${row.角色名稱} / ${row.卡片名稱}`);
}

if (dryRun) {
  console.log("(dry-run — xlsx not written)");
  process.exit(0);
}

const headers = rows.length ? Object.keys(rows[0]) : Object.keys(toAdd[0]);
const merged = [...rows, ...toAdd];
const nextSheet = XLSX.utils.json_to_sheet(merged, { header: headers });
wb.Sheets[sheetName] = nextSheet;
XLSX.writeFile(wb, xlsxPath);
console.log(`Wrote ${merged.length} rows → ${xlsxPath}`);
