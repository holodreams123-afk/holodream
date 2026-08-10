import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import gameData from "../src/data/gameData.json" with { type: "json" };
import { compareMembersByGroup } from "../src/lib/groups.ts";
import { EN_NAME, ZH_NAME, isOverseasMember } from "../src/lib/names.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const CHARACTER_CARD_ROOT = path.join(__dirname, "..", "角色名片");

export function displayFolderName(jp, units) {
  if (ZH_NAME[jp]) return ZH_NAME[jp];
  if (isOverseasMember(units) || EN_NAME[jp]) return EN_NAME[jp] ?? jp;
  return jp;
}

export function sortedMembers() {
  const unitsOf = (member) => gameData.members[member]?.units;
  return Object.keys(gameData.members).sort((a, b) =>
    compareMembersByGroup(a, b, unitsOf),
  );
}

/** Folder name with numeric prefix for 期生 order in Explorer. */
export function memberFolderName(jp, index) {
  const label = displayFolderName(jp, gameData.members[jp].units);
  return `${String(index).padStart(2, "0")}_${label}`;
}

export function memberFolderPath(jp, index) {
  return path.join(CHARACTER_CARD_ROOT, memberFolderName(jp, index));
}

export function folderNameToJp(folderName) {
  const stripped = folderName.replace(/^\d+_/, "");
  for (const jp of Object.keys(gameData.members)) {
    if (displayFolderName(jp, gameData.members[jp].units) === stripped) return jp;
  }
  return null;
}

export function wipeCharacterCardRoot() {
  if (!fs.existsSync(CHARACTER_CARD_ROOT)) {
    fs.mkdirSync(CHARACTER_CARD_ROOT, { recursive: true });
    return;
  }
  for (const entry of fs.readdirSync(CHARACTER_CARD_ROOT, { withFileTypes: true })) {
    fs.rmSync(path.join(CHARACTER_CARD_ROOT, entry.name), {
      recursive: true,
      force: true,
    });
  }
}

export function initCharacterCardFolders({ wipe = false } = {}) {
  if (wipe) wipeCharacterCardRoot();
  fs.mkdirSync(CHARACTER_CARD_ROOT, { recursive: true });

  const members = sortedMembers();
  const folders = members.map((jp, i) => {
    const name = memberFolderName(jp, i + 1);
    fs.mkdirSync(path.join(CHARACTER_CARD_ROOT, name), { recursive: true });
    return { jp, name, unit: gameData.members[jp].units[0] ?? "" };
  });

  return folders;
}
