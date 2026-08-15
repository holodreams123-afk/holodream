/**
 * Sync card skill raw + parsed fields from holodori wf-calc CardDataPage bundle.
 * Source: https://dreams.wf-calc.net/simulator (CardDataPage chunk)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dataPath = path.join(root, "src/data/gameData.json");
const pagePath = path.join(__dirname, "_wfcalc_CardDataPage.js");

const CARD_PAGE_URL = "https://dreams.wf-calc.net/assets/CardDataPage-B2zrArKy.js";

const PROB = { 高確率: 0.8, 中確率: 0.5, 低確率: 0.3 };
const TYPE_MAP = {
  ハッピー: "happy",
  ピュア: "pure",
  キュート: "cute",
  ハッピータイプ: "happy",
  ピュアタイプ: "pure",
  キュートタイプ: "cute",
};

function ensureCardDataPage() {
  if (!fs.existsSync(pagePath) || fs.statSync(pagePath).size < 100_000) {
    execSync(`curl.exe -sL "${CARD_PAGE_URL}" -o "${pagePath}"`, { stdio: "inherit" });
  }
}

function extractJsonBlock(index) {
  const page = fs.readFileSync(pagePath, "utf8");
  const blocks = [];
  let search = 0;
  while (true) {
    const start = page.indexOf("JSON.parse(`", search);
    if (start === -1) break;
    let i = start + "JSON.parse(`".length;
    let buf = "";
    while (i < page.length) {
      const ch = page[i];
      if (ch === "`" && page[i - 1] !== "\\") break;
      buf += ch;
      i++;
    }
    blocks.push(JSON.parse(buf));
    search = i + 1;
  }
  return blocks[index];
}

function normalizeTitle(s) {
  return String(s ?? "")
    .replace(/！/g, "!")
    .replace(/\s+/g, " ")
    .trim();
}

/** Match wf-calc titles to our costumeName despite minor typos / punctuation. */
function canonicalTitle(s) {
  return String(s ?? "")
    .normalize("NFKC")
    .replace(/！/g, "!")
    .replace(/％/g, "%")
    .replace(/\s+/g, "")
    .replace(/[''‛`´]/g, "")
    .replace(/パーティー/g, "パーティ")
    .replace(/nepholim/gi, "nephilim")
    .replace(/鍛冶場に匹敵/g, "鍛冶場に響く")
    .replace(/探求心/g, "探究心")
    .replace(/るんるん/g, "らんらん")
    .replace(/ふわゆる/g, "ゆるふわ")
    .replace(/ばっきゅん/g, "ぱっきゅん")
    .replace(/全快/g, "全開")
    .replace(/バンチライン/g, "パンチライン")
    .replace(/湧かす/g, "沸かす")
    .replace(/保険医/g, "保健医")
    .replace(/どこまでも/g, "どこでも")
    .replace(/lion.?s/gi, "lions")
    .replace(/let.?s/gi, "lets")
    .toLowerCase();
}

function normalizeJpSkillText(text) {
  return String(text ?? "")
    .normalize("NFKC")
    .replace(/％/g, "%")
    .replace(/アップ/gi, "UP")
    .trim();
}

function parseCondition(text) {
  const t = normalizeJpSkillText(text).replace(/\s+/g, "");
  let m = t.match(/(ハッピータイプ|ピュアタイプ|キュートタイプ)(\d+)人以上/);
  if (m) return { type: "typeCount", attr: TYPE_MAP[m[1]], min: +m[2] };
  m = t.match(
    /(0期生|1期生|2期生|3期生|4期生|5期生|ゲーマーズ|holoX|ID1期生|ID2期生|ID3期生|Myth|Promise|Advent|ReGLOSS)が(\d+)人以上/,
  );
  if (m) return { type: "unitCount", unit: m[1], min: +m[2] };
  m = t.match(
    /(0期生|1期生|2期生|3期生|4期生|5期生|ゲーマーズ|holoX|ID1期生|ID2期生|ID3期生|Myth|Promise|Advent|ReGLOSS)(\d+)人(?!以上)/,
  );
  if (m) return { type: "unitCount", unit: m[1], min: +m[2] };
  m = t.match(/(ハッピータイプ|ピュアタイプ|キュートタイプ)(\d+)人(?!以上)/);
  if (m) return { type: "typeCount", attr: TYPE_MAP[m[1]], min: +m[2] };
  return null;
}

function scorePassive(effects) {
  let s = 0;
  for (const e of effects) {
    if (e.kind === "paramUp")
      s += e.value * (e.param === "全パラメータ" ? 3 : 1) * (e.target === "self" ? 0.4 : 1);
    if (e.kind === "scoreSupportPassive") s += e.value * 2.5;
  }
  return s;
}

function parseActive(text) {
  const raw = normalizeJpSkillText(text);
  const t = raw.replace(/\s+/g, "");
  const m = t.match(/(\d+)秒(?:毎|ごと)に(高確率|中確率|低確率)で(\d+)秒間スコアが(\d+)%UP/i);
  if (!m) {
    return {
      interval: 0,
      probability: 0.8,
      probabilityLabel: "高確率",
      duration: 0,
      scoreUp: 0,
      bonus: null,
      raw,
    };
  }
  // Non-capturing inner groups so bonus score is always capture [2].
  const bonusMatch = t.match(
    /(ライフ\d+以上|\d+コンボ以上|(?:ハッピータイプ|ピュアタイプ|キュートタイプ)\d+人以上|(?:0|1|2|3|4|5)期生|ゲーマーズ|holoX|ID[123]期生|Myth|Promise|Advent|ReGLOSSが\d+人以上)でスコアが(\d+)%UP/i,
  );
  return {
    interval: +m[1],
    probability: PROB[m[2]],
    probabilityLabel: m[2],
    duration: +m[3],
    scoreUp: +m[4],
    bonus: bonusMatch
      ? {
          conditionText: bonusMatch[1],
          condition: parseCondition(bonusMatch[1]) || { type: "misc", text: bonusMatch[1] },
          scoreUp: +bonusMatch[2],
        }
      : null,
    raw,
  };
}

function parsePassive(text) {
  const raw = normalizeJpSkillText(text);
  const t = raw.replace(/\s+/g, "");
  let condition = parseCondition(raw);
  const effects = [];

  const selfParam = t.match(/自身の全パラメータが(\d+)%UP/);
  if (selfParam) {
    effects.push({
      kind: "paramUp",
      param: "全パラメータ",
      value: +selfParam[1],
      target: "self",
    });
  }

  const ssGroup = t.match(
    /(ハッピータイプ|ピュアタイプ|キュートタイプ|0期生|1期生|2期生|3期生|4期生|5期生|ゲーマーズ|holoX|ID1期生|ID2期生|ID3期生|Myth|Promise|Advent|ReGLOSS)(\d+)人のスコアサポート効果(\d+)%/,
  );
  if (ssGroup) {
    const tg = ssGroup[1];
    effects.push({
      kind: "scoreSupportPassive",
      value: +ssGroup[3],
      targetGroup: TYPE_MAP[tg] || tg,
      targetCount: +ssGroup[2],
    });
    if (!condition) {
      if (TYPE_MAP[tg]) condition = { type: "typeCount", attr: TYPE_MAP[tg], min: +ssGroup[2] };
      else condition = { type: "unitCount", unit: tg, min: +ssGroup[2] };
    }
  }

  const groupParam = !effects.length
    ? t.match(
        /(ハッピータイプ|ピュアタイプ|キュートタイプ|0期生|1期生|2期生|3期生|4期生|5期生|ゲーマーズ|holoX|ID1期生|ID2期生|ID3期生|Myth|Promise|Advent|ReGLOSS)(\d+)人の(センス|テクニック|パフォーマンス|全パラメータ)が(\d+)%UP/i,
      )
    : null;
  if (groupParam) {
    const tg = groupParam[1];
    effects.push({
      kind: "paramUp",
      param: groupParam[3],
      value: +groupParam[4],
      targetGroup: TYPE_MAP[tg] || tg,
      targetCount: +groupParam[2],
    });
    if (!condition) {
      if (TYPE_MAP[tg]) condition = { type: "typeCount", attr: TYPE_MAP[tg], min: +groupParam[2] };
      else condition = { type: "unitCount", unit: tg, min: +groupParam[2] };
    }
  }

  return { condition, effects, raw, score: scorePassive(effects) };
}

function parseSpecial(text) {
  const raw = normalizeJpSkillText(text);
  const t = raw.replace(/\s+/g, "");
  const durationMatch = t.match(/(\d+)秒間/);
  const support = t.match(/スコアサポート効果(\d+)%/);
  const condRate = t.match(
    /(ライフ\d+以上|\d+コンボ以上|(ハッピータイプ|ピュアタイプ|キュートタイプ)が\d+人以上|(0期生|1期生|2期生|3期生|4期生|5期生|ゲーマーズ|holoX|ID1期生|ID2期生|ID3期生|Myth|Promise|Advent|ReGLOSS)が\d+人以上)でスキル発動(?:率|確率)が(\d+)%UP/,
  );
  const rate = t.match(/スキル発動(?:率|確率)が(\d+)%UP/);
  return {
    duration: durationMatch ? +durationMatch[1] : 0,
    scoreSupport: support ? +support[1] : 0,
    skillRate: condRate ? +condRate[4] : rate ? +rate[1] : 0,
    skillRateCondition: condRate ? condRate[1] : null,
    raw,
  };
}

function parseCostumeSkill(text) {
  const raw = normalizeJpSkillText(text);
  if (!raw || raw === "なし") {
    return { condition: null, effects: [], raw, score: 0, unconditional: true };
  }
  const condition = parseCondition(raw);
  const effects = [];
  const t = raw.replace(/\s+/g, "");
  for (const x of t.matchAll(/全員の(全パラメータ|センス|テクニック|パフォーマンス)が(\d+)%UP/g)) {
    effects.push({ kind: "paramUp", param: x[1], value: +x[2], target: "all" });
  }
  for (const x of t.matchAll(/全員のスコアサポート効果(\d+)%/g)) {
    effects.push({ kind: "scoreSupportPassive", value: +x[1], target: "all" });
  }
  let score = 0;
  for (const e of effects) {
    if (e.kind === "paramUp") score += e.value * (e.param === "全パラメータ" ? 3 : 1.2);
    if (e.kind === "scoreSupportPassive") score += e.value * 2.2;
  }
  return { condition, effects, raw, score, unconditional: !condition };
}

function findOurCard(cards, wf) {
  const exact = cards.find(
    (c) =>
      c.member === wf.member &&
      normalizeTitle(c.costumeName) === normalizeTitle(wf.title) &&
      c.rarity === wf.rarity,
  );
  if (exact) return exact;

  const canon = canonicalTitle(wf.title);
  const fuzzy = cards.filter(
    (c) =>
      c.member === wf.member &&
      c.rarity === wf.rarity &&
      canonicalTitle(c.costumeName) === canon,
  );
  if (fuzzy.length === 1) return fuzzy[0];

  const byRarity = cards.filter((c) => c.member === wf.member && c.rarity === wf.rarity);
  if (byRarity.length === 1) return byRarity[0];

  return null;
}

function findOurCostume(costumes, member, title) {
  const exact = costumes.find(
    (c) =>
      c.member === member &&
      normalizeTitle(c.costumeName) === normalizeTitle(title),
  );
  if (exact) return exact;
  const canon = canonicalTitle(title);
  const fuzzy = costumes.filter(
    (c) => c.member === member && canonicalTitle(c.costumeName) === canon,
  );
  return fuzzy.length === 1 ? fuzzy[0] : null;
}

ensureCardDataPage();
const wfCards = extractJsonBlock(1);
const game = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const report = { updated: [], missing: [], outfitUpdated: [], outfitMissing: [] };

for (const wf of wfCards) {
  const card = findOurCard(game.cards, wf);
  if (!card) {
    report.missing.push({ member: wf.member, title: wf.title, rarity: wf.rarity });
    continue;
  }
  const before = JSON.stringify({
    special: card.special?.raw,
    active: card.active?.raw,
    passive: card.passive?.raw,
  });
  card.special = parseSpecial(wf.skills?.special ?? "");
  card.active = parseActive(wf.skills?.active ?? "");
  card.passive = parsePassive(wf.skills?.passive ?? "");
  const after = JSON.stringify({
    special: card.special.raw,
    active: card.active.raw,
    passive: card.passive.raw,
  });
  if (before !== after) {
    report.updated.push(card.id);
  }

  const outfitText = wf.skills?.outfit;
  if (outfitText) {
    const cos = findOurCostume(game.costumes, wf.member, wf.title);
    if (cos) {
      cos.skill = parseCostumeSkill(outfitText);
      report.outfitUpdated.push(cos.id);
    } else {
      report.outfitMissing.push(`${wf.member}::${wf.title}`);
    }
  }
}

fs.writeFileSync(dataPath, JSON.stringify(game));
fs.writeFileSync(path.join(__dirname, "_wfcalc_sync_report.json"), JSON.stringify(report, null, 2));

console.log(JSON.stringify({
  wfCards: wfCards.length,
  updatedCards: report.updated.length,
  missingCards: report.missing.length,
  outfitUpdated: report.outfitUpdated.length,
  outfitMissing: report.outfitMissing.length,
}, null, 2));

if (report.missing.length) {
  console.log("missing sample:", report.missing.slice(0, 10));
}
