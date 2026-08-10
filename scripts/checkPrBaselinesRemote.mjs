/**
 * List Supabase pr_baselines rows (cache_key prefix = algo version).
 * Usage: node scripts/checkPrBaselinesRemote.mjs [--purge]
 * Loads .env from repo root if present (does not print secrets).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const k = trimmed.slice(0, eq).trim();
    const v = trimmed.slice(eq + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}

const url = process.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const key = process.env.VITE_SUPABASE_ANON_KEY;
const purge = process.argv.includes("--purge");

if (!url || !key) {
  console.log("NO_ENV: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
  process.exit(0);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
};

const listUrl = `${url}/rest/v1/pr_baselines?select=cache_key,costume_id,song_length,pool_card_count,updated_at&order=updated_at.desc&limit=500`;

const res = await fetch(listUrl, { headers });
if (!res.ok) {
  console.log("FETCH_FAIL:", res.status, await res.text());
  process.exit(1);
}

const rows = await res.json();
console.log("ROW_COUNT:", rows.length);

const byPrefix = new Map();
for (const row of rows) {
  const prefix = String(row.cache_key ?? "").split("\u001f")[0] || "?";
  byPrefix.set(prefix, (byPrefix.get(prefix) ?? 0) + 1);
}

console.log("BY_ALGO_PREFIX:", Object.fromEntries(byPrefix));

const stale = rows.filter((r) => !String(r.cache_key ?? "").startsWith("3\u001f"));
console.log("STALE_NOT_V3:", stale.length);
if (stale.length) {
  for (const r of stale.slice(0, 10)) {
    console.log(" ", r.cache_key, r.costume_id);
  }
}

if (purge) {
  const del = await fetch(`${url}/rest/v1/pr_baselines?cache_key=not.is.null`, {
    method: "DELETE",
    headers: { ...headers, Prefer: "return=minimal" },
  });
  console.log("PURGE:", del.ok ? "OK" : `FAIL ${del.status}`);
}
