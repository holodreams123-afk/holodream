/**
 * Verify PR9999 cache logic for one costume (exhaustive baseline vs byOverall[0]).
 * Usage: npx tsx scripts/verifyPrBaselineCache.ts [costumeId]
 */
import gameData from "../src/data/gameData.json";
import type { GameData } from "../src/types";

const data = gameData as GameData;
const poolCardCount = data.cards.filter((c) => c.rarity === 5 || c.event).length;
const songLength = data.songLengthDefault ?? 160;
const allCardIds = new Set(data.cards.map((c) => c.id));
const allCostumeIds = new Set(data.costumes.map((c) => c.id));

const costumeId =
  process.argv[2] ??
  data.costumes.find((c) => c.member === "風真いろは")?.id ??
  data.costumes[0].id;

const costume = data.costumes.find((c) => c.id === costumeId)!;

const { optimizeTeamAsync } = await import("../src/lib/optimizer.ts");

console.log(`Pool ${poolCardCount}, song ${songLength}s`);
console.log(`Costume: ${costume.member} / ${costume.costumeName}\n`);

const out = await optimizeTeamAsync(
  data,
  {
    ownedCardIds: allCardIds,
    ownedCostumeIds: allCostumeIds,
    songLength,
    fixedLeader: costume.member,
    fixedCostumeId: costume.id,
    fixedMembers: [],
    maxResults: 8,
    allowDuplicateSkills: true,
    exhaustive: true,
  },
  false,
);

const baseline = out.baselineTeam;
const top = out.byOverall[0] ?? null;

const combat = (t: typeof baseline) => t?.combatPower ?? t?.effectiveStatTotal ?? 0;

console.log("searched:", out.searched.toLocaleString());
console.log("baselineTeam combat:", combat(baseline), "PR:", baseline?.powerRating);
console.log("byOverall[0] combat:", combat(top), "PR:", top?.powerRating);

const sameTop =
  baseline && top && baseline.cards.map((c) => c.id).join() === top.cards.map((c) => c.id).join();

console.log("\nbaselineTeam === byOverall[0]:", sameTop ? "YES" : "NO");

const maxCombatInOverall = Math.max(...out.byOverall.map((t) => combat(t)));
console.log("byOverall[0] has max combat in top-8:", combat(top) >= maxCombatInOverall - 1e-6 ? "YES" : "NO");

const cacheEntry = {
  powerRating: out.byOverall[0]?.powerRating,
  combatPower: out.byOverall[0]?.combatPower,
};
console.log("\nWould cache entry[0] PR:", cacheEntry.powerRating, "combat:", cacheEntry.combatPower);

let ok = sameTop && top?.powerRating === 9999;
console.log("\n" + (ok ? "PASS" : "FAIL"));
