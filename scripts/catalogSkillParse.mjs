/**
 * Parse 角色名片 / card-catalog.json Traditional Chinese skill text → gameData structures.
 */
const PROB = { 高: 0.8, 中: 0.5, 低: 0.3 };
const PROB_LABEL = { 高: "高確率", 中: "中確率", 低: "低確率" };

const TYPE_ZH = {
  快樂類型: "happy",
  清純類型: "pure",
  可愛類型: "cute",
};

const PARAM_ZH = {
  全能力: "全パラメータ",
  表現力: "パフォーマンス",
  技巧: "テクニック",
  品味: "センス",
};

const UNIT_ALIASES = {
  GAMERS: "ゲーマーズ",
  Gamers: "ゲーマーズ",
};

function compact(text) {
  return String(text ?? "")
    .replace(/\s+/g, "")
    .replace(/％/g, "%");
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

function scoreCostume(effects) {
  let s = 0;
  for (const e of effects) {
    if (e.kind === "paramUp") s += e.value * (e.param === "全パラメータ" ? 3 : 1.2);
    if (e.kind === "scoreSupportPassive") s += e.value * 2.2;
  }
  return s;
}

function normalizeUnit(token) {
  return UNIT_ALIASES[token] ?? token;
}

function parseTypeAttr(token) {
  const t = token.replace(/\s+/g, "");
  return TYPE_ZH[t] ?? null;
}

/** @returns {{ type: string, attr?: string, unit?: string, min: number } | null} */
export function parseCatalogCondition(text) {
  const t = compact(text);
  let m = t.match(/若編入(\d+)名以上(快樂類型|清純類型|可愛類型)/);
  if (m) return { type: "typeCount", attr: TYPE_ZH[m[2]], min: +m[1] };
  m = t.match(/若編入(\d+)名以上(0|1|2|3|4|5)期生/);
  if (m) return { type: "unitCount", unit: `${m[2]}期生`, min: +m[1] };
  m = t.match(
    /若編入(\d+)名以上(ゲーマーズ|GAMERS|holoX|ID1期生|ID2期生|ID3期生|Myth|Promise|Advent|ReGLOSS)/i,
  );
  if (m) return { type: "unitCount", unit: normalizeUnit(m[2]), min: +m[1] };
  m = t.match(/(快樂類型|清純類型|可愛類型)(\d+)名以上/);
  if (m) return { type: "typeCount", attr: TYPE_ZH[m[1]], min: +m[2] };
  m = t.match(/(0|1|2|3|4|5)期生(\d+)名以上/);
  if (m) return { type: "unitCount", unit: `${m[1]}期生`, min: +m[2] };
  m = t.match(
    /(0|1|2|3|4|5)期生|ゲーマーズ|GAMERS|holoX|ID1期生|ID2期生|ID3期生|Myth|Promise|Advent|ReGLOSS/,
  );
  if (m) {
    const unit = normalizeUnit(m[0]);
    const count = t.match(new RegExp(`${unit.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\d+)名`));
    if (count) return { type: "unitCount", unit, min: +count[1] };
  }
  return null;
}

function parseActiveBonus(t) {
  let m = t.match(/(\d+)Combo以上時分數提升(\d+)%/i);
  if (m) {
    return {
      conditionText: `${m[1]}コンボ以上`,
      condition: { type: "misc", text: `${m[1]}コンボ以上` },
      scoreUp: +m[2],
    };
  }
  m = t.match(/生命值(\d+)以上時分數提升(\d+)%/);
  if (m) {
    return {
      conditionText: `ライフ${m[1]}以上`,
      condition: { type: "misc", text: `ライフ${m[1]}以上` },
      scoreUp: +m[2],
    };
  }
  m = t.match(/若編入(\d+)名以上(快樂類型|清純類型|可愛類型)的人物分數提升(\d+)%/);
  if (m) {
    const condText = `${TYPE_ZH[m[2]] === "happy" ? "ハッピータイプ" : TYPE_ZH[m[2]] === "pure" ? "ピュアタイプ" : "キュートタイプ"}${m[1]}人以上`;
    return {
      conditionText: condText,
      condition: { type: "typeCount", attr: TYPE_ZH[m[2]], min: +m[1] },
      scoreUp: +m[3],
    };
  }
  m = t.match(
    /若編入(\d+)名以上(0|1|2|3|4|5)期生分數提升(\d+)%/,
  );
  if (m) {
    const condText = `${m[2]}期生${m[1]}人以上`;
    return {
      conditionText: condText,
      condition: { type: "unitCount", unit: `${m[2]}期生`, min: +m[1] },
      scoreUp: +m[3],
    };
  }
  return null;
}

export function parseCatalogActive(text) {
  const raw = String(text ?? "").trim();
  const t = compact(raw);
  const m = t.match(/每(\d+)秒以(高|中|低)機率在(\d+)秒內分數提升(\d+)%/);
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
  const bonus = parseActiveBonus(t);
  return {
    interval: +m[1],
    probability: PROB[m[2]],
    probabilityLabel: PROB_LABEL[m[2]],
    duration: +m[3],
    scoreUp: +m[4],
    bonus,
    raw,
  };
}

export function parseCatalogSpecial(text) {
  const raw = String(text ?? "").trim();
  const t = compact(raw);
  const duration = +(t.match(/在(\d+)秒內/)?.[1] ?? 0);
  const scoreSupport = +(t.match(/分數加成效果(\d+)%/)?.[1] ?? 0);
  let skillRate = 0;
  let skillRateCondition = null;

  const comboRate = t.match(/(\d+)Combo以上時技能發動機率提升(\d+)%/i);
  const lifeRate = t.match(/生命值(\d+)以上時技能發動機率提升(\d+)%/);
  const unitRate = t.match(/若編入(\d+)名以上(0|1|2|3|4|5)期生技能發動機率提升(\d+)%/);
  const plainRate = t.match(/技能發動機率提升(\d+)%/);

  if (comboRate) {
    skillRate = +comboRate[2];
    skillRateCondition = `${comboRate[1]}コンボ以上`;
  } else if (lifeRate) {
    skillRate = +lifeRate[2];
    skillRateCondition = `ライフ${lifeRate[1]}以上`;
  } else if (unitRate) {
    skillRate = +unitRate[3];
    skillRateCondition = `${unitRate[2]}期生${unitRate[1]}人以上`;
  } else if (plainRate) {
    skillRate = +plainRate[1];
  }

  return { duration, scoreSupport, skillRate, skillRateCondition, raw };
}

function parseGroupPassive(t, raw) {
  const effects = [];
  let condition = parseCatalogCondition(raw);

  const self = t.match(/自己的(全能力|表現力|技巧|品味)提升(\d+)%/);
  if (self) {
    effects.push({
      kind: "paramUp",
      param: PARAM_ZH[self[1]],
      value: +self[2],
      target: "self",
    });
    return { condition, effects, raw, score: scorePassive(effects) };
  }

  const typeParam = /(\d+)名(快樂類型|清純類型|可愛類型)的(全能力|表現力|技巧|品味)提升(\d+)%/g;
  for (const m of t.matchAll(typeParam)) {
    effects.push({
      kind: "paramUp",
      param: PARAM_ZH[m[3]],
      value: +m[4],
      targetGroup: TYPE_ZH[m[2]],
      targetCount: +m[1],
    });
    if (!condition) condition = { type: "typeCount", attr: TYPE_ZH[m[2]], min: +m[1] };
  }
  const typeSupport = /(\d+)名(快樂類型|清純類型|可愛類型)的分數加成效果(\d+)%/g;
  for (const m of t.matchAll(typeSupport)) {
    effects.push({
      kind: "scoreSupportPassive",
      value: +m[3],
      targetGroup: TYPE_ZH[m[2]],
      targetCount: +m[1],
    });
    if (!condition) condition = { type: "typeCount", attr: TYPE_ZH[m[2]], min: +m[1] };
  }

  const unitPatterns = [
    /(\d+)名(0|1|2|3|4|5)期生的(全能力|表現力|技巧|品味)提升(\d+)%/g,
    /(\d+)名(0|1|2|3|4|5)期生的分數加成效果(\d+)%/g,
    /(\d+)名(ゲーマーズ|GAMERS|holoX|ID1期生|ID2期生|ID3期生|Myth|Promise|Advent|ReGLOSS)的(全能力|表現力|技巧|品味)提升(\d+)%/gi,
    /(\d+)名(ゲーマーズ|GAMERS|holoX|ID1期生|ID2期生|ID3期生|Myth|Promise|Advent|ReGLOSS)的分數加成效果(\d+)%/gi,
  ];
  for (const re of unitPatterns) {
    for (const m of t.matchAll(re)) {
      const unit =
        /^\d$/.test(m[2]) && re.source.includes("期生") ? `${m[2]}期生` : normalizeUnit(m[2]);
      if (re.source.includes("分數加成")) {
        effects.push({
          kind: "scoreSupportPassive",
          value: +m[3],
          targetGroup: unit,
          targetCount: +m[1],
        });
      } else {
        effects.push({
          kind: "paramUp",
          param: PARAM_ZH[m[3]],
          value: +m[4],
          targetGroup: unit,
          targetCount: +m[1],
        });
      }
      if (!condition) {
        condition =
          /期生/.test(unit) || ["ゲーマーズ", "holoX", "Myth", "Promise", "Advent", "ReGLOSS"].includes(unit) || unit.startsWith("ID")
            ? { type: "unitCount", unit, min: +m[1] }
            : null;
      }
    }
  }

  const dupGroup = t.match(
    /若編入(\d+)名以上(快樂類型|清純類型|可愛類型)的人物(\d+)名(快樂類型|清純類型|可愛類型)的(全能力|表現力|技巧|品味|分數加成效果)(?:提升)?(\d+)%/,
  );
  if (dupGroup && !effects.length) {
    const kind = dupGroup[5] === "分數加成效果" ? "scoreSupportPassive" : "paramUp";
    effects.push({
      kind,
      param: kind === "paramUp" ? PARAM_ZH[dupGroup[5]] : undefined,
      value: +dupGroup[6],
      targetGroup: TYPE_ZH[dupGroup[4]],
      targetCount: +dupGroup[3],
    });
    condition = { type: "typeCount", attr: TYPE_ZH[dupGroup[2]], min: +dupGroup[1] };
  }

  const dupUnit = t.match(
    /若編入(\d+)名以上(0|1|2|3|4|5)期生(?:(\d+)名(0|1|2|3|4|5)期生|(\d+)期生)的(分數加成效果|全能力|表現力|技巧|品味)(?:提升)?(\d+)%/,
  );
  if (dupUnit && !effects.length) {
    const unit = `${dupUnit[2]}期生`;
    const targetCount = +(dupUnit[3] || dupUnit[4] || dupUnit[2]);
    const stat = dupUnit[5];
    const kind = stat === "分數加成效果" ? "scoreSupportPassive" : "paramUp";
    effects.push({
      kind,
      param: kind === "paramUp" ? PARAM_ZH[stat] : undefined,
      value: +dupUnit[6],
      targetGroup: unit,
      targetCount,
    });
    condition = { type: "unitCount", unit, min: +dupUnit[1] };
  }

  const holoxDup = t.match(/若編入(\d+)名以上GAMERS(\d+)名GAMERS的分數加成效果(\d+)%/i);
  if (holoxDup && !effects.length) {
    effects.push({
      kind: "scoreSupportPassive",
      value: +holoxDup[3],
      targetGroup: "ゲーマーズ",
      targetCount: +holoxDup[2],
    });
    condition = { type: "unitCount", unit: "ゲーマーズ", min: +holoxDup[1] };
  }

  const holoxDup2 = t.match(/若編入(\d+)名以上holoX(\d+)名holoX的分數加成效果(\d+)%/i);
  if (holoxDup2 && !effects.length) {
    effects.push({
      kind: "scoreSupportPassive",
      value: +holoxDup2[3],
      targetGroup: "holoX",
      targetCount: +holoxDup2[2],
    });
    condition = { type: "unitCount", unit: "holoX", min: +holoxDup2[1] };
  }

  const reglossDup = t.match(/若編入(\d+)名以上ReGLOSS(\d+)名ReGLOSS的(分數加成效果|表現力|技巧|品味|全能力)(?:提升)?(\d+)%/i);
  if (reglossDup && !effects.length) {
    const kind = reglossDup[3] === "分數加成效果" ? "scoreSupportPassive" : "paramUp";
    effects.push({
      kind,
      param: kind === "paramUp" ? PARAM_ZH[reglossDup[3]] : undefined,
      value: +reglossDup[4],
      targetGroup: "ReGLOSS",
      targetCount: +reglossDup[2],
    });
    condition = { type: "unitCount", unit: "ReGLOSS", min: +reglossDup[1] };
  }

  const mythDup = t.match(/若編入(\d+)名以上Myth(\d+)名Myth的分數加成效果(\d+)%/i);
  if (mythDup && !effects.length) {
    effects.push({
      kind: "scoreSupportPassive",
      value: +mythDup[3],
      targetGroup: "Myth",
      targetCount: +mythDup[2],
    });
    condition = { type: "unitCount", unit: "Myth", min: +mythDup[1] };
  }

  const promiseDup = t.match(/(\d+)名Promise的(表現力|技巧|品味|全能力|分數加成效果)(?:提升)?(\d+)%/i);
  if (promiseDup && !effects.length) {
    const kind = promiseDup[2] === "分數加成效果" ? "scoreSupportPassive" : "paramUp";
    effects.push({
      kind,
      param: kind === "paramUp" ? PARAM_ZH[promiseDup[2]] : undefined,
      value: +promiseDup[3],
      targetGroup: "Promise",
      targetCount: +promiseDup[1],
    });
    condition = { type: "unitCount", unit: "Promise", min: +promiseDup[1] };
  }

  const adventPassive = t.match(/(\d+)名Advent的(表現力|技巧|品味|全能力|分數加成效果)(?:提升)?(\d+)%/i);
  if (adventPassive && !effects.length) {
    const kind = adventPassive[2] === "分數加成效果" ? "scoreSupportPassive" : "paramUp";
    effects.push({
      kind,
      param: kind === "paramUp" ? PARAM_ZH[adventPassive[2]] : undefined,
      value: +adventPassive[3],
      targetGroup: "Advent",
      targetCount: +adventPassive[1],
    });
    condition = { type: "unitCount", unit: "Advent", min: +adventPassive[1] };
  }

  const reglossSimple = t.match(/(\d+)名ReGLOSS的(表現力|技巧|品味|全能力|分數加成效果)(?:提升)?(\d+)%/i);
  if (reglossSimple && !effects.length) {
    const kind = reglossSimple[2] === "分數加成效果" ? "scoreSupportPassive" : "paramUp";
    effects.push({
      kind,
      param: kind === "paramUp" ? PARAM_ZH[reglossSimple[2]] : undefined,
      value: +reglossSimple[3],
      targetGroup: "ReGLOSS",
      targetCount: +reglossSimple[1],
    });
    condition = { type: "unitCount", unit: "ReGLOSS", min: +reglossSimple[1] };
  }

  return { condition, effects, raw, score: scorePassive(effects) };
}

export function parseCatalogPassive(text) {
  const raw = String(text ?? "").trim();
  return parseGroupPassive(compact(raw), raw);
}

function parseCostumeEffects(segment) {
  const t = compact(segment);
  const effects = [];
  for (const m of t.matchAll(/全體成員的(全能力|表現力|技巧|品味)提升(\d+)%/g)) {
    effects.push({ kind: "paramUp", param: PARAM_ZH[m[1]], value: +m[2], target: "all" });
  }
  for (const m of t.matchAll(/全體成員的分數加成效果提升(\d+)%/g)) {
    effects.push({ kind: "scoreSupportPassive", value: +m[1], target: "all" });
  }
  for (const m of t.matchAll(/全體成員的分數加成效果(\d+)%/g)) {
    effects.push({ kind: "scoreSupportPassive", value: +m[1], target: "all" });
  }
  return effects;
}

export function parseCatalogCostume(text) {
  const raw = String(text ?? "").trim();
  if (!raw) {
    return { condition: null, effects: [], raw, score: 0, unconditional: true };
  }

  const segments = raw.split(/(?=若編入)/).filter(Boolean);
  let condition = null;
  const effects = [];

  if (segments.length === 1 && !segments[0].startsWith("若編入")) {
    effects.push(...parseCostumeEffects(segments[0]));
    return {
      condition: null,
      effects,
      raw,
      score: scoreCostume(effects),
      unconditional: true,
    };
  }

  for (const segment of segments) {
    if (!condition) condition = parseCatalogCondition(segment);
    effects.push(...parseCostumeEffects(segment));
  }

  return {
    condition,
    effects,
    raw,
    score: scoreCostume(effects),
    unconditional: !condition,
  };
}
