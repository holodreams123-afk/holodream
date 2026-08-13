/**
 * Parse ★5 rows from hololive_Dreams_.xlsx (OneDrive canonical table).
 * Excel uses structured zh-TW skill strings — no OCR / catalog parsing.
 */
export const PROB = { 高: 0.8, 中: 0.5, 低: 0.3 };
export const TYPE_MAP = { Happy: "happy", Pure: "pure", Cute: "cute" };

export const GEN_TO_UNIT = {
  "Gen 0": "0期生",
  "Gen 1": "1期生",
  "Gen 2": "2期生",
  GAMERS: "ゲーマーズ",
  Gamers: "ゲーマーズ",
  "Gen 3": "3期生",
  "Gen 4": "4期生",
  "Gen 5": "5期生",
  holoX: "holoX",
  "ID Gen 1": "ID1期生",
  "ID Gen 2": "ID2期生",
  "ID Gen 3": "ID3期生",
  Myth: "Myth",
  Promise: "Promise",
  Advent: "Advent",
  ReGLOSS: "ReGLOSS",
};

export const EN_TO_JP = {
  "Ayunda Risu": "アユンダ・リス",
  "Moona Hoshinova": "ムーナ・ホシノヴァ",
  "Airani Iofifteen": "アイラニ・イオフィフティーン",
  "Kureiji Ollie": "クレイジー・オリー",
  "Anya Melfissa": "アーニャ・メルフィッサ",
  "Pavolia Reine": "パヴォリア・レイネ",
  "Vestia Zeta": "ベスティア・ゼータ",
  "Kaela Kovalskia": "カエラ・コヴァルスキア",
  "Kobo Kanaeru": "こぼ・かなえる",
  "Mori Calliope": "森カリオペ",
  "Takanashi Kiara": "小鳥遊キアラ",
  "Ninomae Ina'nis": "一伊那尓栖",
  "Ouro Kronii": "オーロ・クロニー",
  "Hakos Baelz": "ハコス・ベールズ",
  "Shiori Novella": "シオリ・ノヴェラ",
  "Koseki Bijou": "古石ビジュー",
  "Nerissa Ravencroft": "ネリッサ・レイヴンクロフト",
  "Fuwawa Abyssgard": "フワワ・アビスガード",
  "Mococo Abyssgard": "モココ・アビスガード",
  "Otonose Kanade": "音乃瀬奏",
  "Ichijou Ririka": "一条莉々華",
  "Juufuutei Raden": "儒烏風亭らでん",
  "Todoroki Hajime": "轟はじめ",
};

/** Incomplete Excel rows → verified fills */
export const MANUAL_OVERRIDES = {
  "角巻わため|真夏のもふもふフロートタイム": {
    active: "每35秒（高）：12秒 Score +60%；Happy 2人以上 +120%",
    passive: "Happy 2人 Support +11%",
    outfit: "Happy 2人以上：全員 Sense +80% + Support +25%",
  },
};

export function splitName(cell) {
  const s = String(cell ?? "").trim();
  if (!s) return { left: "", right: "" };
  if (s.includes(" / ")) {
    const [left, right] = s.split(" / ").map((x) => x.trim());
    return { left, right };
  }
  return { left: s, right: s };
}

export function resolveMember(nameCell, knownMembers) {
  const { left, right } = splitName(nameCell);
  const candidates = [left, right, EN_TO_JP[right], EN_TO_JP[left]].filter(Boolean);
  for (const c of candidates) {
    if (knownMembers.has(c)) return c;
  }
  for (const c of candidates) {
    if (EN_TO_JP[c]) return EN_TO_JP[c];
  }
  const jpLike = (s) => /[\u3040-\u30ff\u4e00-\u9fff]/.test(s);
  if (jpLike(left)) return left;
  if (jpLike(right)) return right;
  return right || left;
}

export function normalizeUnitToken(tok) {
  const map = {
    Happy: "ハッピータイプ",
    Pure: "ピュアタイプ",
    Cute: "キュートタイプ",
    Gamers: "ゲーマーズ",
    GAMERS: "ゲーマーズ",
  };
  return map[tok] ?? tok;
}

function paramJp(p) {
  return (
    {
      Perf: "パフォーマンス",
      Tech: "テクニック",
      Sense: "センス",
      全參數: "全パラメータ",
      Support: "スコアサポート効果",
    }[p] ?? p
  );
}

export function parseConditionFromZh(text) {
  if (!text) return null;
  const t = text.replace(/\s+/g, "");
  let m;
  m = t.match(/(Happy|Pure|Cute|ハッピータイプ|ピュアタイプ|キュートタイプ)(\d+)人以上/);
  if (m) {
    const attr = {
      Happy: "happy",
      Pure: "pure",
      Cute: "cute",
      ハッピータイプ: "happy",
      ピュアタイプ: "pure",
      キュートタイプ: "cute",
    }[m[1]];
    return { type: "typeCount", attr, min: +m[2] };
  }
  m = t.match(/(Happy|Pure|Cute)(\d+)人(?!以上)/);
  if (m) return { type: "typeCount", attr: TYPE_MAP[m[1]], min: +m[2] };
  m = t.match(
    /(0期生|1期生|2期生|3期生|4期生|5期生|ゲーマーズ|Gamers|GAMERS|holoX|ID1期生|ID2期生|ID3期生|Myth|Promise|Advent|ReGLOSS)(\d+)人以上/,
  );
  if (m) return { type: "unitCount", unit: normalizeUnitToken(m[1]), min: +m[2] };
  m = t.match(
    /(0期生|1期生|2期生|3期生|4期生|5期生|ゲーマーズ|holoX|ID1期生|ID2期生|ID3期生|Myth|Promise|Advent|ReGLOSS)(\d+)人/,
  );
  if (m) return { type: "unitCount", unit: normalizeUnitToken(m[1]), min: +m[2] };
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

export function parseOutfit(text) {
  const raw = String(text ?? "").trim();
  if (!raw) return { condition: null, effects: [], raw, score: 0, unconditional: true };
  const effects = [];
  for (const m of raw.matchAll(/全員\s*(全參數|Perf|Tech|Sense)\s*\+(\d+)%/g)) {
    effects.push({ kind: "paramUp", param: paramJp(m[1]), value: +m[2], target: "all" });
  }
  for (const m of raw.matchAll(/Support\s*\+(\d+)%/g)) {
    effects.push({ kind: "scoreSupportPassive", value: +m[1], target: "all" });
  }
  if (!effects.length) {
    const m = raw.match(/(全參數|Perf|Tech|Sense)\s*\+(\d+)%/);
    if (m) effects.push({ kind: "paramUp", param: paramJp(m[1]), value: +m[2], target: "all" });
  }
  const condition = parseConditionFromZh(raw);
  let score = 0;
  for (const e of effects) {
    if (e.kind === "paramUp") score += e.value * (e.param === "全パラメータ" ? 3 : 1.2);
    if (e.kind === "scoreSupportPassive") score += e.value * 2.2;
  }
  return { condition, effects, raw, score, unconditional: !condition };
}

export function parseSpecial(text) {
  const raw = String(text ?? "").trim();
  const duration = +(raw.match(/(\d+)秒/)?.[1] ?? 0);
  const support = +(raw.match(/Support\s*\+(\d+)%/)?.[1] ?? 0);
  const condRate = raw.match(/(Life\s*\d+\+|Combo\s*\d+\+)\s*時\s*Skill Rate\s*\+(\d+)%/i);
  const rate = +(condRate?.[2] ?? raw.match(/Skill Rate\s*\+(\d+)%/i)?.[1] ?? 0);
  return {
    duration,
    scoreSupport: support,
    skillRate: rate,
    skillRateCondition: condRate ? condRate[1].replace(/\s+/g, "") : null,
    raw,
  };
}

export function parseActive(text) {
  const raw = String(text ?? "").trim();
  const m = raw.match(/每(\d+)秒[（(](高|中|低)[）)]：(\d+)(?:\/\d+)?秒\s*Score\s*\+(\d+)%/);
  if (!m) {
    return {
      interval: 0,
      probability: 1,
      probabilityLabel: "高確率",
      duration: 0,
      scoreUp: 0,
      bonus: null,
      raw,
    };
  }

  let baseScore = +m[4];
  const slash = raw.match(/Score\s*\+(\d+)%\/(\d+)%/);
  if (slash) baseScore = +slash[1];

  let bonus = null;
  const bonusCombo = raw.match(/Combo\s*(\d+)\+\s*時\s*\+(\d+)%/i);
  const bonusLife = raw.match(/Life\s*(\d+)\+\s*時\s*\+(\d+)%/i);
  const bonusType = raw.match(
    /(Happy|Pure|Cute|0期生|1期生|2期生|3期生|4期生|5期生|ゲーマーズ|holoX|Myth|Promise|Advent|ReGLOSS|ID\d期生)\s*(\d+)人以上[^；;]*?(?:時)?\s*\+(\d+)%/,
  );

  if (bonusCombo) {
    bonus = {
      conditionText: `${bonusCombo[1]}コンボ以上`,
      condition: { type: "misc", text: `${bonusCombo[1]}コンボ以上` },
      scoreUp: +bonusCombo[2],
    };
  } else if (bonusLife) {
    bonus = {
      conditionText: `ライフ${bonusLife[1]}以上`,
      condition: { type: "misc", text: `ライフ${bonusLife[1]}以上` },
      scoreUp: +bonusLife[2],
    };
  } else if (bonusType) {
    const condText = `${normalizeUnitToken(bonusType[1])}${bonusType[2]}人以上`;
    bonus = {
      conditionText: condText,
      condition: parseConditionFromZh(condText) || { type: "misc", text: condText },
      scoreUp: +bonusType[3],
    };
  }

  const label = { 高: "高確率", 中: "中確率", 低: "低確率" }[m[2]];
  return {
    interval: +m[1],
    probability: PROB[m[2]],
    probabilityLabel: label,
    duration: +m[3],
    scoreUp: baseScore,
    bonus,
    raw,
  };
}

export function parsePassive(text) {
  const raw = String(text ?? "").trim();
  const condition = parseConditionFromZh(raw);
  const effects = [];

  const self = raw.match(/自身\s*(全參數|Perf|Tech|Sense)\s*\+(\d+)%/);
  if (self) {
    effects.push({
      kind: "paramUp",
      param: paramJp(self[1]),
      value: +self[2],
      target: "self",
    });
  }

  const compact = raw.replace(/\s+/g, "");
  const group = compact.match(
    /(Happy|Pure|Cute|0期生|1期生|2期生|3期生|4期生|5期生|ゲーマーズ|Gamers|GAMERS|holoX|Myth|Promise|Advent|ReGLOSS|ID\d期生)(\d+)人(?:以上)?(?::|：)?(?:\1(\d+)人)?(全參數|Perf|Tech|Sense|Support)\+(\d+)%/,
  );
  if (group && !self) {
    const tg = group[1];
    const kind = group[4] === "Support" ? "scoreSupportPassive" : "paramUp";
    effects.push({
      kind,
      param: kind === "paramUp" ? paramJp(group[4]) : undefined,
      value: +group[5],
      targetGroup: TYPE_MAP[tg] || normalizeUnitToken(tg),
      targetCount: +(group[3] || group[2]),
    });
  } else if (!effects.length) {
    const simple = compact.match(
      /(Happy|Pure|Cute|0期生|1期生|2期生|3期生|4期生|5期生|ゲーマーズ|Gamers|GAMERS|holoX|Myth|Promise|Advent|ReGLOSS)(\d+)人(Support|Perf|Tech|Sense|全參數)\+(\d+)%/,
    );
    if (simple) {
      const kind = simple[3] === "Support" ? "scoreSupportPassive" : "paramUp";
      effects.push({
        kind,
        param: kind === "paramUp" ? paramJp(simple[3]) : undefined,
        value: +simple[4],
        targetGroup: TYPE_MAP[simple[1]] || normalizeUnitToken(simple[1]),
        targetCount: +simple[2],
      });
    }
  }

  return { condition, effects, raw, score: scorePassive(effects) };
}

export function col(row, ...needles) {
  for (const k of Object.keys(row)) {
    for (const n of needles) if (k === n || k.includes(n)) return row[k];
  }
  return "";
}

/** Parse workbook rows → canonical ★5 records for gameData merge. */
export function parseStar5Rows(rows, knownMembers) {
  const records = [];
  const warnings = [];
  const memberUnit = {};

  for (const row of rows) {
    const gen = String(col(row, "世代/團體", "世代")).trim();
    const nameCell = String(col(row, "角色名稱")).trim();
    const cardName = String(col(row, "卡片名稱")).trim();
    const typeEn = String(col(row, "類型")).trim();
    let outfit = String(col(row, "Outfit")).trim();
    const special = String(col(row, "Special")).trim();
    let active = String(col(row, "Active")).trim();
    let passive = String(col(row, "Passive")).trim();
    if (!nameCell || !cardName) continue;

    const member = resolveMember(nameCell, knownMembers);
    knownMembers.add(member);

    let unit = GEN_TO_UNIT[gen];
    if (!unit || gen === "泳裝限定") {
      unit = memberUnit[member] || "その他";
    } else {
      memberUnit[member] = unit;
    }

    const override = MANUAL_OVERRIDES[`${member}|${cardName}`];
    if (override) {
      active = override.active ?? active;
      passive = override.passive ?? passive;
      outfit = override.outfit ?? outfit;
    }

    const type = TYPE_MAP[typeEn];
    if (!type) {
      warnings.push(`Bad type: ${member} ${cardName} (${typeEn})`);
      continue;
    }

    const perf = +col(row, "Performance") || 0;
    const tech = +col(row, "Technique") || 0;
    const sense = +col(row, "Sense") || 0;
    const total = +col(row, "總分") || perf + tech + sense;

    const activeParsed = parseActive(active);
    const passiveParsed = parsePassive(passive);
    const specialParsed = parseSpecial(special);
    const outfitParsed = parseOutfit(outfit);

    if (!activeParsed.interval) warnings.push(`Active parse fail: ${member} / ${cardName}`);
    if (!passiveParsed.effects.length) warnings.push(`Passive parse fail: ${member} / ${cardName}`);
    if (!outfitParsed.effects.length) warnings.push(`Outfit parse fail: ${member} / ${cardName}`);

    records.push({
      member,
      costumeName: cardName,
      type,
      unit,
      stats: { performance: perf, technique: tech, sense, total },
      special: specialParsed,
      active: activeParsed,
      passive: passiveParsed,
      costumeSkill: outfitParsed,
    });
  }

  return { records, warnings };
}
