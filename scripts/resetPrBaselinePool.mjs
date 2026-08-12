/**
 * Reset bundled PR baseline cache when ★5/event pool size changes.
 * New cards change PR 9999 references — baselines must be recomputed (exhaustive).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import gameData from "../src/data/gameData.json" with { type: "json" };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../src/data/prBaselines.json");
const PR_BASELINE_ALGO_VERSION = 4;

export function countOptimizerPoolCards(cards) {
  return cards.filter((c) => c.rarity === 5 || !!c.event).length;
}

export function readPrBaselinePoolCount() {
  try {
    const parsed = JSON.parse(fs.readFileSync(outPath, "utf8"));
    return typeof parsed.poolCardCount === "number" ? parsed.poolCardCount : null;
  } catch {
    return null;
  }
}

export function readPrBaselineAlgoVersion() {
  try {
    const parsed = JSON.parse(fs.readFileSync(outPath, "utf8"));
    return typeof parsed.algorithmVersion === "number" ? parsed.algorithmVersion : null;
  } catch {
    return null;
  }
}

export function readPrBaselineMeta() {
  try {
    return JSON.parse(fs.readFileSync(outPath, "utf8"));
  } catch {
    return null;
  }
}

/** True when bundled cache must not be reused (pool or algo bump). */
export function prBaselineCacheStale(meta = readPrBaselineMeta()) {
  if (!meta) return true;
  const currentPool = countOptimizerPoolCards(gameData.cards);
  if (meta.poolCardCount !== currentPool) return true;
  if (meta.algorithmVersion !== PR_BASELINE_ALGO_VERSION) return true;
  return false;
}

export function resetPrBaselinePool(poolCardCount, songLength = gameData.songLengthDefault ?? 160) {
  const next = {
    version: 2,
    algorithmVersion: PR_BASELINE_ALGO_VERSION,
    songLength,
    poolCardCount,
    generatedAt: null,
    costumes: {},
  };
  fs.writeFileSync(outPath, `${JSON.stringify(next)}\n`, "utf8");
  return next;
}

/** @returns {{ changed: boolean, previous: number|null, current: number, algoStale: boolean }} */
export function ensurePrBaselinePoolFresh({ write = true, force = false } = {}) {
  const current = countOptimizerPoolCards(gameData.cards);
  const previous = readPrBaselinePoolCount();
  const algoWas = readPrBaselineAlgoVersion();
  const algoStale = algoWas !== PR_BASELINE_ALGO_VERSION;
  const poolChanged = previous !== null && previous !== current;
  const changed = force || poolChanged || algoStale || previous === null;

  if (write && changed) {
    resetPrBaselinePool(current);
  }

  return { changed, previous, current, algoStale, poolChanged };
}

if (process.argv[1]?.endsWith("resetPrBaselinePool.mjs")) {
  const force = process.argv.includes("--force");
  const { changed, previous, current, algoStale, poolChanged } =
    ensurePrBaselinePoolFresh({ write: true, force });
  if (changed) {
    const reasons = [];
    if (poolChanged) reasons.push(`pool ${previous} → ${current}`);
    if (algoStale) reasons.push(`algo → v${PR_BASELINE_ALGO_VERSION}`);
    if (force) reasons.push("forced");
    if (previous === null && !poolChanged && !algoStale && !force) {
      reasons.push("initialized");
    }
    console.log(`PR baseline cleared (${reasons.join(", ")}): src/data/prBaselines.json`);
    console.log("");
    console.log("Next steps (calculation still exhaustive):");
    console.log("  1. npm run precompute-pr     # recompute PR 9999 top-8 per costume");
    console.log("  2. Supabase SQL editor: run scripts/supabase-pr-baselines-purge.sql");
    console.log("  3. git commit + push         # ship new prBaselines.json");
  } else {
    console.log(
      `PR baseline OK (pool ${current}, algo v${PR_BASELINE_ALGO_VERSION}). No reset needed.`,
    );
  }
}
