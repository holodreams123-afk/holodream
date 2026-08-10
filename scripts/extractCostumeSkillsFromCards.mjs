/**
 * Extract 衣裝技能 from 3.衣裝*.png (bottom-left) → 角色名片/card-catalog.json
 * Multi-page costumes (3.衣裝-2.png …) are concatenated in order.
 *
 * Usage:
 *   node scripts/extractCostumeSkillsFromCards.mjs           # update mismatches only
 *   node scripts/extractCostumeSkillsFromCards.mjs --all     # rewrite all from OCR
 *   node scripts/extractCostumeSkillsFromCards.mjs --dry-run
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CHARACTER_CARD_ROOT } from "./characterCardFolders.mjs";
import {
  normalizeSkillText,
  ocrCostumeSkillFromDir,
  terminateOcrWorker,
} from "./ocrCharacterCard.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(CHARACTER_CARD_ROOT, "card-catalog.json");

const dryRun = process.argv.includes("--dry-run");
const forceAll = process.argv.includes("--all");

function cardDir(row) {
  return path.join(CHARACTER_CARD_ROOT, `${row.no}_${row.member}`, row.card);
}

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
let updated = 0;
let unchanged = 0;
let skipped = 0;

for (const row of catalog) {
  const dir = cardDir(row);
  const ocrText = await ocrCostumeSkillFromDir(dir);
  if (!ocrText) {
    console.warn(`skip (no OCR): ${row.member} / ${row.card}`);
    skipped += 1;
    continue;
  }

  const prev = row.costumeSkill ?? "";
  const normPrev = normalizeSkillText(prev);
  const normOcr = normalizeSkillText(ocrText);

  if (normPrev === normOcr) {
    unchanged += 1;
    process.stderr.write(".");
    continue;
  }

  if (!forceAll && prev && normPrev !== normOcr) {
    console.log(`\nUPDATE ${row.member} / ${row.card}`);
    console.log(`  was: ${prev}`);
    console.log(`  ocr: ${ocrText}`);
  } else if (forceAll) {
    console.log(`set ${row.member} / ${row.card}`);
  }

  if (!dryRun) row.costumeSkill = ocrText;
  updated += 1;
  process.stderr.write("*");
}

await terminateOcrWorker();

if (!dryRun && updated > 0) {
  fs.writeFileSync(CATALOG_PATH, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  await import("./syncCardCatalog.mjs");
}

console.log(
  `\nDone: ${updated} updated, ${unchanged} unchanged, ${skipped} skipped${dryRun ? " (dry-run)" : ""}`,
);
