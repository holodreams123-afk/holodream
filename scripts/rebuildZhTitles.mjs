/**
 * Rebuild tools/card-organizer/data/zhTitles.json from 角色名片 folders.
 * Matches each 1.名片.png to gameData via stats OCR.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  detectCardFromPortrait,
  saveZhTitle,
  shutdownWorker,
} from "../tools/card-organizer/detectCardName.mjs";
import { CHARACTER_CARD_ROOT } from "./characterCardFolders.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "tools", "card-organizer", "data", "zhTitles.json");

/** @type {Record<string, string>} */
const map = {};

for (const member of fs.readdirSync(CHARACTER_CARD_ROOT, { withFileTypes: true })) {
  if (!member.isDirectory() || member.name.startsWith("_")) continue;
  const memberPath = path.join(CHARACTER_CARD_ROOT, member.name);
  for (const card of fs.readdirSync(memberPath, { withFileTypes: true })) {
    if (!card.isDirectory()) continue;
    const portrait = path.join(memberPath, card.name, "1.名片.png");
    if (!fs.existsSync(portrait)) continue;
    const r = await detectCardFromPortrait(fs.readFileSync(portrait), member.name);
    if (r.card?.id) {
      map[r.card.id] = card.name;
      console.log(r.card.id, "→", card.name);
    } else {
      console.warn("skip (no stats match):", member.name, card.name);
    }
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(map, null, 2) + "\n");
console.log("wrote", Object.keys(map).length, "titles →", OUT);
await shutdownWorker();
