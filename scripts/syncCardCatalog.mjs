/**
 * Copy 角色名片/card-catalog.json → src/data/cardCatalog.json for the web app.
 * Adds costumeId (gameData captain costume key) for strict 衣裝 display lookup.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import gameData from "../src/data/gameData.json" with { type: "json" };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "角色名片", "card-catalog.json");
const dest = path.join(root, "src", "data", "cardCatalog.json");

const catalog = JSON.parse(fs.readFileSync(src, "utf8"));
const cardById = new Map(gameData.cards.map((c) => [c.id, c]));

for (const entry of catalog) {
  const card = cardById.get(entry.cardId);
  if (!card) {
    console.warn(`sync: missing gameData card ${entry.cardId}`);
    continue;
  }
  const costume = gameData.costumes.find(
    (c) => c.member === card.member && c.costumeName === card.costumeName,
  );
  entry.costumeId = costume?.id ?? null;
}

const missingCostume = catalog.filter((e) => !e.costumeId);
if (missingCostume.length) {
  console.warn(
    `sync: ${missingCostume.length} catalog rows without costumeId:`,
    missingCostume.map((e) => e.cardId).join(", "),
  );
}

fs.writeFileSync(dest, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
console.log(`Synced ${catalog.length} cards → ${dest}`);
