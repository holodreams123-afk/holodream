/**
 * Organize user-provided reference screenshots into 角色名片/{NN}_{name}/.
 * Skips non-character UI screenshots. Not wired into the website.
 */
import fs from "fs";
import path from "path";
import {
  CHARACTER_CARD_ROOT,
  memberFolderPath,
  sortedMembers,
} from "./characterCardFolders.mjs";

const assetsDir =
  process.env.CHARACTER_CARD_ASSETS ??
  "C:\\Users\\User\\.cursor\\projects\\c-holodream\\assets";

const memberIndex = new Map(
  sortedMembers().map((jp, i) => [jp, i + 1]),
);

/** @type {Record<string, { member: string; name: string }[]>} */
const PLAN = {
  "image-35f31213-1a77-4be8-9a0b-0f45ededb2c1.png": [
    { member: "常闇トワ", name: "卡面_玩到根本停不下來的放鬆夜遊.png" },
  ],
  "image-69c950b2-3693-4228-8aec-951dbf9029d8.png": [
    { member: "星街すいせい", name: "卡面_擄獲人心的Comet Tune.png" },
  ],
  "image-737b7e32-a2d6-477a-90ef-fafffcd6df43.png": [
    { member: "ロボ子さん", name: "卡面_高性能的勝利手勢.png" },
  ],
  "image-f5507e90-9489-4871-a572-40e3bc688278.png": [
    { member: "角巻わため", name: "卡面_盛夏的毛茸茸漂浮時光.png" },
  ],
  "image-11219e84-74df-485c-b70d-992e05536e70.png": [
    { member: "こぼ・かなえる", name: "卡面_雨過天晴的歡喜薩滿.png" },
  ],
  "image-0b4b4f83-c938-4cf3-99b7-213f73348e28.png": [
    { member: "常闇トワ", name: "技能詳情_ガチで終わらんチルい夜遊び.png" },
  ],
  "image-06d087d4-369b-447f-9da3-4aee950d5872.png": [
    { member: "儒烏風亭らでん", name: "技能詳情_叡智を灯し、アートに導く.png" },
  ],
  "image-c2a5e16d-f379-48b0-9dc1-f250f49674e3.png": [
    { member: "ときのそら", name: "技能詳情_ひたむきに描く虹のうた.png" },
  ],
  "image-27fd767c-d801-4203-bfb3-cf85af5c4439.png": [
    { member: "ロボ子さん", name: "技能詳情_高性能なVサイン.png" },
  ],
  "image-e8822975-2d53-41cb-8207-c61f21ccfa86.png": [
    { member: "常闇トワ", name: "頭像_常闇トワ.png" },
  ],
};

function findAsset(shortName) {
  if (!fs.existsSync(assetsDir)) return null;
  const hit = fs
    .readdirSync(assetsDir)
    .find((f) => f.endsWith(shortName) || f.includes(shortName));
  return hit ? path.join(assetsDir, hit) : null;
}

const report = { copied: [], missing: [], skipped: [] };

for (const [shortName, targets] of Object.entries(PLAN)) {
  const src = findAsset(shortName);
  if (!src) {
    report.missing.push(shortName);
    continue;
  }
  for (const { member, name } of targets) {
    const idx = memberIndex.get(member);
    if (!idx) {
      report.missing.push(`${shortName}:${member}`);
      continue;
    }
    const dir = memberFolderPath(member, idx);
    fs.mkdirSync(dir, { recursive: true });
    const dest = path.join(dir, name);
    if (fs.existsSync(dest)) {
      report.skipped.push(`${path.basename(dir)}/${name}`);
      continue;
    }
    fs.copyFileSync(src, dest);
    report.copied.push(`${path.basename(dir)}/${name}`);
  }
}

console.log(
  JSON.stringify(
    {
      outRoot: CHARACTER_CARD_ROOT,
      copied: report.copied.length,
      missing: report.missing.length,
      skipped: report.skipped.length,
    },
    null,
    2,
  ),
);
console.log("copied:", report.copied);
if (report.missing.length) console.log("missing:", report.missing);
