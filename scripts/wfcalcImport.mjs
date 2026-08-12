/**
 * Load wf-calc card data and build gameData card/costume entries.
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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

export function normalizeTitle(s) {
  return String(s ?? "")
    .replace(/！/g, "!")
    .replace(/\s+/g, " ")
    .trim();
}

export function canonicalTitle(s) {
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
    .replace(/ホット/g, "ホッと")
    .replace(/フワワ/g, "フワフワ")
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

export function parseActive(text) {
  const raw = normalizeJpSkillText(text);
  const t = raw.replace(/\s+/g, "");
  const m = t.match(/(\d+)秒毎に(高確率|中確率|低確率)で(\d+)秒間スコアが(\d+)%UP/i);
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

export function parsePassive(text) {
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

export function parseSpecial(text) {
  const raw = normalizeJpSkillText(text);
  const t = raw.replace(/\s+/g, "");
  const durationMatch = t.match(/(\d+)秒間/);
  const support = t.match(/スコアサポート効果(\d+)%/);
  const condRate = t.match(/(ライフ\d+以上|\d+コンボ以上)でスキル発動(?:率|確率)が(\d+)%UP/);
  const rate = t.match(/スキル発動(?:率|確率)が(\d+)%UP/);
  return {
    duration: durationMatch ? +durationMatch[1] : 0,
    scoreSupport: support ? +support[1] : 0,
    skillRate: condRate ? +condRate[2] : rate ? +rate[1] : 0,
    skillRateCondition: condRate ? condRate[1] : null,
    raw,
  };
}

export function parseCostumeSkill(text) {
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

export function loadWfStar5Cards() {
  ensureCardDataPage();
  return extractJsonBlock(1).filter((c) => c.rarity === 5);
}

/** All wf-calc cards (★3–★5) from CardDataPage JSON blocks. */
export function loadWfAllCards() {
  ensureCardDataPage();
  const page = fs.readFileSync(pagePath, "utf8");
  const seen = new Set();
  const out = [];
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
    search = i + 1;
    let block;
    try {
      block = JSON.parse(buf);
    } catch {
      continue;
    }
    if (!Array.isArray(block)) continue;
    for (const wf of block) {
      if (!wf?.member || !wf?.title) continue;
      const key = `${wf.member}\0${wf.rarity}\0${canonicalTitle(wf.title)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(wf);
    }
  }
  return out;
}

export function wfCardId(wf) {
  return `${wf.member}_5_${wf.title}`.replace(/[\\|/]/g, "_");
}

export function wfUnit(wf) {
  const tag = wf.tags?.[0];
  if (!tag) return "";
  if (tag.includes("期生") || tag === "ゲーマーズ" || tag === "holoX") return tag;
  if (["Myth", "Promise", "Advent", "ReGLOSS"].includes(tag)) return tag;
  if (tag.startsWith("ID") && tag.includes("期生")) return tag;
  return tag;
}

export function wfType(wf) {
  return TYPE_MAP[wf.attribute] ?? "happy";
}

export function buildGameDataCardFromWf(wf, stats) {
  return {
    id: wfCardId(wf),
    member: wf.member,
    costumeName: wf.title,
    rarity: wf.rarity,
    type: wfType(wf),
    unit: wfUnit(wf),
    stats,
    special: parseSpecial(wf.skills?.special ?? ""),
    active: parseActive(wf.skills?.active ?? ""),
    passive: parsePassive(wf.skills?.passive ?? ""),
  };
}

export function buildGameDataCostumeFromWf(wf) {
  const outfitText = wf.skills?.outfit ?? "";
  return {
    id: `${wf.member}_${wf.title}`.replace(/[\\|/]/g, "_"),
    member: wf.member,
    costumeName: wf.title,
    skill: parseCostumeSkill(outfitText),
  };
}

export function findWfCard(wfCards, { member, costumeName, stats }) {
  const pool = wfCards.filter((wf) => wf.member === member);
  if (!pool.length) return null;

  if (costumeName) {
    const canon = canonicalTitle(costumeName);
    const byTitle = pool.filter(
      (wf) =>
        normalizeTitle(wf.title) === normalizeTitle(costumeName) ||
        canonicalTitle(wf.title) === canon,
    );
    if (byTitle.length === 1) return byTitle[0];
  }

  if (pool.length === 1) return pool[0];
  return null;
}

export function addWfCardToGameData(game, wf, stats) {
  const cardId = wfCardId(wf);
  if (game.cards.some((c) => c.id === cardId)) return { added: false, cardId };

  const card = buildGameDataCardFromWf(wf, stats);
  game.cards.push(card);

  const cos = buildGameDataCostumeFromWf(wf);
  if (!game.costumes.some((c) => c.id === cos.id)) {
    game.costumes.push(cos);
  }

  if (!game.members[wf.member]) {
    game.members[wf.member] = { name: wf.member, units: [card.unit].filter(Boolean) };
  } else if (card.unit && !game.members[wf.member].units.includes(card.unit)) {
    game.members[wf.member].units.push(card.unit);
  }

  return { added: true, cardId };
}
