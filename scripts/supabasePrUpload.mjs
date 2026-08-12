/**
 * Upload PR baseline top-8 rows to Supabase (Node / precompute helper).
 * Reads VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY from .env.local
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

export const PR_BASELINE_ALGO_VERSION = 4;

export function loadSupabaseEnv() {
  for (const name of [".env.local", ".env"]) {
    const p = path.join(ROOT, name);
    if (!fs.existsSync(p)) continue;
    const out = {};
    for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!m) continue;
      let v = m[2].trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      out[m[1]] = v;
    }
    const url = out.VITE_SUPABASE_URL;
    const key = out.VITE_SUPABASE_ANON_KEY;
    if (url && key) return { url, key };
  }
  return null;
}

export function prBaselineCacheKey(costumeId, songLength, poolCardCount) {
  return `${PR_BASELINE_ALGO_VERSION}\u001f${songLength}\u001f${poolCardCount}\u001f${costumeId}`;
}

function isMissingTeamsColumn(err) {
  const msg = JSON.stringify(err);
  return msg.includes("teams") && (msg.includes("column") || msg.includes("PGRST"));
}

/** @param {import("../src/lib/prBaselineStore.ts").PrTeamCacheEntry[]} teams */
export async function uploadPrBaselineTeams(
  costumeId,
  teams,
  { songLength, poolCardCount },
) {
  const env = loadSupabaseEnv();
  if (!env) {
    return { ok: false, reason: "no-env" };
  }
  if (!teams?.length) {
    return { ok: false, reason: "empty" };
  }

  const cacheKey = prBaselineCacheKey(costumeId, songLength, poolCardCount);
  const url = `${env.url.replace(/\/$/, "")}/rest/v1/pr_baselines?on_conflict=cache_key`;
  const teamPayload = teams.map((t) => ({
    leader_index: t.leaderIndex,
    card_ids: t.cardIds,
    effective_stat_total: t.effectiveStatTotal,
    coverage: t.coverage,
    avg_score_up: t.avgScoreUp,
    power_rating: t.powerRating ?? null,
    combat_power: t.combatPower ?? null,
    score_bonus_pct: t.scoreBonusPct ?? null,
  }));

  const body = {
    cache_key: cacheKey,
    costume_id: costumeId,
    song_length: songLength,
    pool_card_count: poolCardCount,
    teams: teamPayload,
    leader_index: teams[0].leaderIndex,
    card_ids: teams[0].cardIds,
    effective_stat_total: teams[0].effectiveStatTotal,
    coverage: teams[0].coverage,
    avg_score_up: teams[0].avgScoreUp,
    updated_at: new Date().toISOString(),
  };

  const headers = {
    apikey: env.key,
    Authorization: `Bearer ${env.key}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=minimal",
  };

  let res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (!isMissingTeamsColumn(err)) {
      return { ok: false, reason: `http-${res.status}`, detail: err };
    }
    const { teams: _t, ...legacyBody } = body;
    res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(legacyBody),
    });
  }
  return res.ok ? { ok: true } : { ok: false, reason: `http-${res.status}` };
}
