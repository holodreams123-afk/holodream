/**
 * Process new 角色名片 folders (1.名片 + 2.技能 + 3.衣裝) into catalog + gameData.
 *
 * Usage:
 *   node scripts/processNewCharacterCards.mjs           # new / changed folders only
 *   node scripts/processNewCharacterCards.mjs --all   # refresh OCR for every folder
 *   node scripts/processNewCharacterCards.mjs --dry-run
 *
 * You only need to drop screenshots into:
 *   角色名片/{NN}_{member}/{卡名}/1.名片.png
 *   角色名片/{NN}_{member}/{卡名}/2.技能.png
 *   角色名片/{NN}_{member}/{卡名}/3.衣裝.png
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import gameData from "../src/data/gameData.json" with { type: "json" };
import {
  CHARACTER_CARD_ROOT,
  folderNameToJp,
} from "./characterCardFolders.mjs";
import {
  detectCardFromPortrait,
  saveZhTitle,
  shutdownWorker,
} from "../tools/card-organizer/detectCardName.mjs";
import {
  findCostumeImages,
  normalizeSkillText,
  ocrCostumeSkillFromDir,
  ocrSkillRegions,
  terminateOcrWorker,
} from "./ocrCharacterCard.mjs";
import {
  addWfCardToGameData,
  findWfCard,
  loadWfStar5Cards,
  wfCardId,
} from "./wfcalcImport.mjs";
import {
  countOptimizerPoolCards,
  ensurePrBaselinePoolFresh,
} from "./resetPrBaselinePool.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(CHARACTER_CARD_ROOT, "card-catalog.json");
const DATA_PATH = path.join(__dirname, "../src/data/gameData.json");

const dryRun = process.argv.includes("--dry-run");
const forceAll = process.argv.includes("--all");

function loadCatalog() {
  return JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
}

function catalogKey(row) {
  return `${row.no}\t${row.member}\t${row.card}`;
}

function isCompleteCardDir(cardDir) {
  return (
    fs.existsSync(path.join(cardDir, "1.名片.png")) &&
    fs.existsSync(path.join(cardDir, "2.技能.png")) &&
    findCostumeImages(cardDir).length > 0
  );
}

function listCardFolders() {
  /** @type {Array<{no:string,memberLabel:string,memberFolder:string,cardName:string,cardDir:string,jp:string|null}>} */
  const out = [];
  if (!fs.existsSync(CHARACTER_CARD_ROOT)) return out;

  for (const memberFolder of fs.readdirSync(CHARACTER_CARD_ROOT)) {
    if (!/^\d+_/.test(memberFolder)) continue;
    const memberPath = path.join(CHARACTER_CARD_ROOT, memberFolder);
    if (!fs.statSync(memberPath).isDirectory()) continue;
    const no = memberFolder.slice(0, 2);
    const memberLabel = memberFolder.replace(/^\d+_/, "");
    const jp = folderNameToJp(memberFolder);

    for (const cardName of fs.readdirSync(memberPath)) {
      const cardDir = path.join(memberPath, cardName);
      if (!fs.statSync(cardDir).isDirectory()) continue;
      if (!isCompleteCardDir(cardDir)) continue;
      out.push({ no, memberLabel, memberFolder, cardName, cardDir, jp });
    }
  }
  return out;
}

function mergeStats(ocrStats, gameStats) {
  if (!ocrStats?.total && gameStats) return { ...gameStats };
  if (!gameStats) return ocrStats;
  return {
    total: ocrStats.total ?? gameStats.total,
    performance: ocrStats.performance ?? gameStats.performance,
    technique: ocrStats.technique ?? gameStats.technique,
    sense: ocrStats.sense ?? gameStats.sense,
  };
}

function writeCatalogMd(catalog) {
  const lines = [
    "# 角色名片完整資料表",
    "",
    `共 ${catalog.length} 張 ★5 卡（自動產生 ${new Date().toISOString().slice(0, 10)}）`,
    "",
    "| # | 成員 | 卡名 | 總計 |",
    "|---|------|------|------|",
  ];
  for (const row of catalog) {
    lines.push(
      `| ${row.no} | ${row.member} | ${row.card} | ${row.stats?.total ?? "—"} |`,
    );
  }
  fs.writeFileSync(
    path.join(CHARACTER_CARD_ROOT, "card-catalog.md"),
    lines.join("\n") + "\n",
    "utf8",
  );
}

const catalog = loadCatalog();
const catalogByKey = new Map(catalog.map((row) => [catalogKey(row), row]));
const game = JSON.parse(JSON.stringify(gameData));
const poolBefore = countOptimizerPoolCards(gameData.cards);
let wfCards = null;

/** @type {string[]} */
const added = [];
/** @type {string[]} */
const updated = [];
/** @type {string[]} */
const skipped = [];
/** @type {string[]} */
const needsManual = [];

for (const folder of listCardFolders()) {
  const key = `${folder.no}\t${folder.memberLabel}\t${folder.cardName}`;
  const existing = catalogByKey.get(key);
  if (existing && !forceAll) {
    skipped.push(`${folder.memberLabel} / ${folder.cardName} (catalog exists)`);
    continue;
  }

  console.log(`\n→ ${folder.memberLabel} / ${folder.cardName}`);

  const portraitBuf = fs.readFileSync(path.join(folder.cardDir, "1.名片.png"));
  const detect = await detectCardFromPortrait(portraitBuf, folder.memberFolder);
  const skillPath = path.join(folder.cardDir, "2.技能.png");
  const skillsOcr = await ocrSkillRegions(skillPath);
  const costumeSkill = await ocrCostumeSkillFromDir(folder.cardDir);

  const skills = {
    sp: normalizeSkillText(skillsOcr.sp ?? ""),
    active: normalizeSkillText(skillsOcr.active ?? ""),
    passive: normalizeSkillText(skillsOcr.passive ?? ""),
  };

  let cardId = detect.card?.id ?? existing?.cardId ?? null;
  let stats = mergeStats(detect.stats, detect.card?.stats ?? existing?.stats);

  if (!cardId && folder.jp) {
    if (!wfCards) wfCards = loadWfStar5Cards();
    const missingWf = wfCards.filter((wf) => !game.cards.some((c) => c.id === wfCardId(wf)));
    const wf =
      findWfCard(missingWf.length ? missingWf : wfCards, {
        member: folder.jp,
        costumeName: detect.card?.costumeName,
        stats,
      }) ?? null;
    if (wf && stats?.total) {
      if (!dryRun) {
        const result = addWfCardToGameData(game, wf, stats);
        cardId = result.cardId;
        if (result.added) {
          console.log(`  + gameData from wf-calc: ${cardId}`);
          added.push(cardId);
        }
      } else {
        cardId = wfCardId(wf);
        console.log(`  (dry-run) would add gameData: ${cardId}`);
      }
    }
  }

  if (!cardId) {
    needsManual.push(
      `${folder.memberLabel} / ${folder.cardName} — 無法比對 gameData；請確認 wf-calc 已收錄此卡，或手動加入 gameData.json`,
    );
    console.warn(`  ! skip catalog write (no cardId)`);
    continue;
  }

  if (cardId) saveZhTitle(cardId, folder.cardName);

  const row = {
    no: folder.no,
    member: folder.memberLabel,
    card: folder.cardName,
    skills,
    costumeSkill: costumeSkill ?? existing?.costumeSkill ?? "",
    cardId,
    stats,
  };

  if (existing) {
    Object.assign(existing, row);
    updated.push(key);
    console.log(`  ~ updated catalog`);
  } else {
    catalog.push(row);
    catalogByKey.set(key, row);
    updated.push(key);
    console.log(`  + added catalog (${cardId})`);
  }
}

await shutdownWorker();
await terminateOcrWorker();

if (!dryRun && updated.length > 0) {
  catalog.sort(
    (a, b) =>
      a.no.localeCompare(b.no) ||
      a.member.localeCompare(b.member, "zh-Hant") ||
      a.card.localeCompare(b.card, "zh-Hant"),
  );
  fs.writeFileSync(CATALOG_PATH, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  fs.writeFileSync(DATA_PATH, JSON.stringify(game));
  writeCatalogMd(catalog);

  console.log("\nSyncing app data…");
  await import("./syncCardCatalog.mjs");
  if (!dryRun) {
    try {
      await import("./mergeCatalogIntoStar5Excel.mjs");
    } catch (e) {
      console.warn("Excel merge skipped:", e.message);
    }
  }
  await import("./syncStar5FromExcel.mjs");
  await import("./fixGameData.mjs");

  const poolAfter = countOptimizerPoolCards(
    JSON.parse(fs.readFileSync(DATA_PATH, "utf8")).cards,
  );
  if (poolAfter !== poolBefore || added.length > 0) {
    const stale = ensurePrBaselinePoolFresh({ write: false });
    if (stale.changed || stale.poolChanged || stale.algoStale) {
      ensurePrBaselinePoolFresh({ write: true });
      const reason = stale.algoStale
        ? "算法版本"
        : "卡池 " + (stale.previous ?? poolBefore) + " → " + poolAfter;
      console.log("\n⚠ PR 9999 基準已失效（" + reason + "）");
      console.log("  計算方式不變：仍為全池窮舉。");
      console.log("  請接著執行：");
      console.log("    npm run precompute-pr");
      console.log("  Supabase 執行：scripts/supabase-pr-baselines-purge.sql");
      console.log("  完成後 commit prBaselines.json 再發布。");
    }
  }
}

console.log("\n--- Summary ---");
console.log(`catalog updated: ${updated.length}`);
console.log(`gameData added: ${added.length}`);
console.log(`skipped: ${skipped.length}`);
if (needsManual.length) {
  console.log("\nNeeds manual gameData / wf-calc:");
  for (const line of needsManual) console.log(`  • ${line}`);
}
if (dryRun) console.log("(dry-run — no files written)");
