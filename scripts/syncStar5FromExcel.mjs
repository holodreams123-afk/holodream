/**
 * ★5 single source of truth: hololive_Dreams_.xlsx (OneDrive).
 * - Local dev: reads xlsx, updates gameData, writes committed snapshot for CI.
 * - CI (no xlsx): applies src/data/star5-excel.snapshot.json.
 * Does NOT use 角色名片 OCR / wf-calc for ★5 computation.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";
import {
  EN_TO_JP,
  parseStar5Rows,
} from "./excelStar5Parse.mjs";
import { catalogEntryToStar5Record } from "./catalogToStar5Record.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const xlsxPath = path.join(root, "hololive_Dreams_.xlsx");
const dataPath = path.join(root, "src/data/gameData.json");
const snapshotPath = path.join(root, "src/data/star5-excel.snapshot.json");
const catalogPath = path.join(root, "角色名片", "card-catalog.json");

function cardKey(member, costumeName) {
  return `${member}\0${costumeName}`;
}

function loadSnapshot() {
  if (!fs.existsSync(snapshotPath)) return null;
  return JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
}

function saveSnapshot(payload) {
  fs.writeFileSync(snapshotPath, JSON.stringify(payload, null, 2) + "\n");
}

function loadSourceRecords(data) {
  const knownMembers = new Set([
    ...Object.keys(data.members),
    ...Object.values(EN_TO_JP),
    ...data.cards.map((c) => c.member),
  ]);

  if (fs.existsSync(xlsxPath)) {
    const wb = XLSX.readFile(xlsxPath);
    const sheet = wb.SheetNames.find((n) => n.includes("5")) ?? wb.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheet], { defval: "" });
    const { records, warnings } = parseStar5Rows(rows, knownMembers);
    return {
      source: "hololive_Dreams_.xlsx",
      sheet,
      syncedAt: new Date().toISOString(),
      records,
      warnings,
    };
  }

  const snap = loadSnapshot();
  if (snap?.records?.length) {
    return {
      source: "star5-excel.snapshot.json",
      sheet: snap.sheet ?? "?",
      syncedAt: snap.syncedAt ?? "?",
      records: snap.records,
      warnings: [],
    };
  }

  throw new Error(
    "No hololive_Dreams_.xlsx and no star5-excel.snapshot.json — cannot sync ★5 data.",
  );
}

/** Fill gaps from 角色名片 when Excel row not yet added (e.g. new summer cards). */
function supplementFromCatalog(data, records) {
  if (!fs.existsSync(catalogPath)) return { records, added: 0 };

  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const covered = new Set(records.map((r) => cardKey(r.member, r.costumeName)));
  const cardById = new Map(data.cards.map((c) => [c.id, c]));
  const extra = [];

  for (const entry of catalog) {
    if (!entry.cardId) continue;
    const card = cardById.get(entry.cardId);
    if (!card || card.rarity !== 5) continue;
    const key = cardKey(card.member, card.costumeName);
    if (covered.has(key)) continue;

    const rec = catalogEntryToStar5Record(entry, card);
    extra.push(rec);
    covered.add(key);
  }

  if (extra.length) {
    console.log(`★5 catalog supplement: ${extra.length} card(s) not yet in Excel`);
    for (const r of extra) console.log(`  + ${r.member} / ${r.costumeName}`);
  }

  return { records: [...records, ...extra], added: extra.length };
}

function applyRecords(data, records) {
  const byKey = new Map(records.map((r) => [cardKey(r.member, r.costumeName), r]));
  let updated = 0;
  const missingInExcel = [];

  for (const card of data.cards) {
    if (card.rarity !== 5) continue;
    const rec = byKey.get(cardKey(card.member, card.costumeName));
    if (!rec) {
      missingInExcel.push(`${card.member} / ${card.costumeName}`);
      continue;
    }

    card.type = rec.type;
    card.unit = rec.unit;
    card.stats = rec.stats;
    card.special = rec.special;
    card.active = rec.active;
    card.passive = rec.passive;
    updated += 1;

    const costume = data.costumes.find(
      (c) => c.member === card.member && c.costumeName === card.costumeName,
    );
    if (costume) {
      costume.skill = rec.costumeSkill;
    }
  }

  // Member units from excel records
  for (const rec of records) {
    if (!data.members[rec.member]) {
      data.members[rec.member] = { name: rec.member, units: [] };
    }
    const units = new Set(data.members[rec.member].units ?? []);
    if (rec.unit && rec.unit !== "その他") units.add(rec.unit);
    data.members[rec.member].units = [...units];
  }

  if (data.members["白上フブキ"]) {
    data.members["白上フブキ"].units = ["1期生", "ゲーマーズ"];
  }

  return { updated, missingInExcel };
}

function verifyRecords(records) {
  const errors = [];
  for (const rec of records) {
    const label = `${rec.member} / ${rec.costumeName}`;
    if (!rec.stats?.total) errors.push(`${label}: missing stats`);
    if (!rec.active?.interval) errors.push(`${label}: active interval=0`);
    if (!rec.passive?.effects?.length) errors.push(`${label}: passive effects empty`);
    if (!rec.costumeSkill?.effects?.length) errors.push(`${label}: outfit effects empty`);
    if (rec.passive?.effects?.some((e) => e.targetGroup && !rec.passive.condition)) {
      errors.push(`${label}: passive has group effect but no condition`);
    }
  }
  return errors;
}

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const bundle = loadSourceRecords(data);
const supplemented = supplementFromCatalog(data, bundle.records);
bundle.records = supplemented.records;

if (bundle.warnings.length) {
  console.warn(`Excel parse warnings (${bundle.warnings.length}):`);
  for (const w of bundle.warnings.slice(0, 15)) console.warn(`  ${w}`);
}

const verifyErrors = verifyRecords(bundle.records);
if (verifyErrors.length) {
  console.error("★5 verification failed:");
  for (const e of verifyErrors) console.error(`  ${e}`);
  process.exit(1);
}

const { updated, missingInExcel } = applyRecords(data, bundle.records);
fs.writeFileSync(dataPath, JSON.stringify(data));

if (fs.existsSync(xlsxPath)) {
  saveSnapshot({
    source: bundle.source,
    sheet: bundle.sheet,
    syncedAt: bundle.syncedAt,
    rowCount: bundle.records.length,
    records: bundle.records,
  });
}

console.log(
  `★5 Excel sync (${bundle.source}): ${updated} cards updated, ${bundle.records.length} excel rows.`,
);
if (missingInExcel.length) {
  console.warn(
    `★5 in gameData but not in Excel (${missingInExcel.length}): ${missingInExcel.slice(0, 5).join("; ")}${missingInExcel.length > 5 ? "…" : ""}`,
  );
}
