/**
 * Precompute PR top-8 per captain costume (★5 + event pool, unconstrained members).
 * Usage:
 *   npx tsx scripts/precomputePrBaselines.ts              # ★5 + event costumes only
 *   npx tsx scripts/precomputePrBaselines.ts --all        # all costumes incl. ★3/★4
 *   npx tsx scripts/precomputePrBaselines.ts --from=N
 * Writes src/data/prBaselines.json (resumable — skips costumes with 8 entries).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import gameData from "../src/data/gameData.json";
import { isStar5OrEventCostume } from "../src/lib/costumes";
import { optimizeTeamAsync } from "../src/lib/optimizer";
import {
  countOptimizerPoolCards,
  entryFromTeam,
  PR_BASELINE_ALGO_VERSION,
  SHARED_TOP_N,
  type PrTeamCacheEntry,
} from "../src/lib/prBaselineStore";
import type { Costume, GameData } from "../src/types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = gameData as GameData;
const outPath = path.join(__dirname, "../src/data/prBaselines.json");
const SONG_LENGTH = data.songLengthDefault ?? 160;

const allCardIds = new Set(data.cards.map((c) => c.id));
const allCostumeIds = new Set(data.costumes.map((c) => c.id));
const poolCardCount = countOptimizerPoolCards(data.cards);

const runAll = process.argv.includes("--all");
const fromArg = process.argv.find((a) => a.startsWith("--from="));
const fromIndex = fromArg ? Math.max(0, parseInt(fromArg.split("=")[1], 10) || 0) : 0;

type CacheFile = {
  version: number;
  algorithmVersion: number;
  songLength: number;
  poolCardCount: number;
  generatedAt: string | null;
  costumes: Record<string, PrTeamCacheEntry[]>;
};

function loadCache(): CacheFile {
  try {
    const raw = fs.readFileSync(outPath, "utf8");
    const parsed = JSON.parse(raw) as CacheFile & {
      baselines?: Record<string, PrTeamCacheEntry>;
      algorithmVersion?: number;
    };
    if (
      parsed.songLength === SONG_LENGTH &&
      parsed.poolCardCount === poolCardCount &&
      parsed.algorithmVersion === PR_BASELINE_ALGO_VERSION
    ) {
      if (parsed.version === 2 && parsed.costumes) return parsed;
      if (parsed.baselines) {
        const costumes: Record<string, PrTeamCacheEntry[]> = {};
        for (const [id, entry] of Object.entries(parsed.baselines)) {
          costumes[id] = [entry];
        }
        return {
          version: 2,
          algorithmVersion: PR_BASELINE_ALGO_VERSION,
          songLength: SONG_LENGTH,
          poolCardCount,
          generatedAt: parsed.generatedAt ?? null,
          costumes,
        };
      }
    }
  } catch {
    /* fresh run */
  }
  return {
    version: 2,
    algorithmVersion: PR_BASELINE_ALGO_VERSION,
    songLength: SONG_LENGTH,
    poolCardCount,
    generatedAt: null,
    costumes: {},
  };
}

function saveCache(cache: CacheFile) {
  fs.writeFileSync(outPath, JSON.stringify(cache));
}

function shouldPrecompute(costume: Costume): boolean {
  if (runAll) return true;
  return isStar5OrEventCostume(costume, data.cards);
}

function isFullyCached(cache: CacheFile, costumeId: string): boolean {
  return (cache.costumes[costumeId]?.length ?? 0) >= SHARED_TOP_N;
}

const cache = loadCache();
const queue = data.costumes.filter(shouldPrecompute).slice(fromIndex);
const skippedTier = runAll ? 0 : data.costumes.filter((c) => !shouldPrecompute(c)).length;
const total = queue.length;
let done = queue.filter((c) => isFullyCached(cache, c.id)).length;
const started = performance.now();

console.log(`Pool: ${poolCardCount} ★5/event cards, song ${SONG_LENGTH}s, algo v${PR_BASELINE_ALGO_VERSION}`);
console.log(
  runAll
    ? `Mode: all costumes (${data.costumes.length})`
    : `Mode: ★5 permanent + event only (${total} costumes, skipping ${skippedTier} ★3/★4)`,
);
console.log(`${done} fully cached (top ${SHARED_TOP_N}), ${total - done} remaining${fromIndex ? ` (from #${fromIndex})` : ""}\n`);

for (let i = 0; i < queue.length; i++) {
  const costume = queue[i];
  if (isFullyCached(cache, costume.id)) {
    console.log(`[${i + 1}/${total}] skip (cached) ${costume.member} / ${costume.costumeName}`);
    continue;
  }

  const t0 = performance.now();
  const out = await optimizeTeamAsync(
    data,
    {
      ownedCardIds: allCardIds,
      ownedCostumeIds: allCostumeIds,
      songLength: SONG_LENGTH,
      fixedLeader: costume.member,
      fixedCostumeId: costume.id,
      fixedMembers: [],
      maxResults: SHARED_TOP_N,
      allowDuplicateSkills: true,
      exhaustive: true,
    },
    false,
  );

  const teams = out.byOverall.slice(0, SHARED_TOP_N).map(entryFromTeam);
  if (!teams.length) {
    console.warn(`[${i + 1}/${total}] NO TEAMS ${costume.id}`);
    continue;
  }

  cache.costumes[costume.id] = teams;
  cache.generatedAt = new Date().toISOString();
  saveCache(cache);
  done += 1;

  const ref = out.baselineTeam ?? out.byOverall[0];
  const ms = performance.now() - t0;
  console.log(
    `[${i + 1}/${total}] ${costume.member} / ${costume.costumeName} — ${(ms / 1000).toFixed(1)}s (${out.searched.toLocaleString()} teams) ref combat ${Math.round(ref?.combatPower ?? 0)} PR ${ref?.powerRating ?? "—"}`,
  );
}

const elapsed = ((performance.now() - started) / 1000).toFixed(0);
console.log(`\nDone: ${done}/${total} costumes cached (top ${SHARED_TOP_N}) in ${elapsed}s`);
console.log(`Saved: ${outPath}`);
