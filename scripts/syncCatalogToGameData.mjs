/**
 * Push verified 角色名片 stats into gameData.json (catalog = source of truth for ★5 stats).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(root, "角色名片/card-catalog.json");
const dataPath = path.join(root, "src/data/gameData.json");

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const byId = new Map(catalog.map((e) => [e.cardId, e]));
let updated = 0;

for (const card of data.cards) {
  const entry = byId.get(card.id);
  if (!entry?.stats) continue;
  if (card.rarity !== 5) continue;
  const next = { ...entry.stats };
  const prev = card.stats;
  if (
    !prev ||
    prev.performance !== next.performance ||
    prev.technique !== next.technique ||
    prev.sense !== next.sense ||
    prev.total !== next.total
  ) {
    card.stats = next;
    updated += 1;
    console.log(`stats ← catalog: ${card.id}`);
  }
}

fs.writeFileSync(dataPath, JSON.stringify(data));
console.log(`Synced ${updated} card stat blocks from catalog (${catalog.length} entries).`);
