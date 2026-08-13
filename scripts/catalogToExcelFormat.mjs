/**
 * Convert 角色名片/card-catalog.json zh skill text → hololive_Dreams_.xlsx column format.
 */
const TYPE_ZH_TO_EN = { 快樂類型: "Happy", 清純類型: "Pure", 可愛類型: "Cute" };
const PARAM_ZH_TO_EN = {
  全能力: "全參數",
  表現力: "Perf",
  技巧: "Tech",
  品味: "Sense",
};

function compact(text) {
  return String(text ?? "").replace(/\s+/g, "");
}

export function catalogActiveToExcel(text) {
  const t = compact(text);
  const m = t.match(/每(\d+)秒以(高|中|低)機率在(\d+)秒內分數提升(\d+)%/);
  if (!m) return String(text ?? "").trim();

  let out = `每${m[1]}秒（${m[2]}）：${m[3]}秒 Score +${m[4]}%`;
  const combo = t.match(/(\d+)Combo以上時分數提升(\d+)%/i);
  const life = t.match(/生命值(\d+)以上時分數提升(\d+)%/);
  const typeBonus = t.match(
    /若編入(\d+)名以上(快樂類型|清純類型|可愛類型).*?分數提升(\d+)%/,
  );
  if (combo) out += `；Combo ${combo[1]}+ 時 +${combo[2]}%`;
  if (life) out += `；Life ${life[1]}+ 時 +${life[2]}%`;
  if (typeBonus) {
    const en = TYPE_ZH_TO_EN[typeBonus[2]];
    out += `；${en} ${typeBonus[1]}人以上 +${typeBonus[3]}%`;
  }
  return out;
}

export function catalogSpecialToExcel(text) {
  const t = compact(text);
  const dur = t.match(/在(\d+)秒內/)?.[1] ?? t.match(/(\d+)秒/)?.[1];
  const support = t.match(/分數加成效果(\d+)%/)?.[1];
  const rate = t.match(/技能發動機率提升(\d+)%/)?.[1];
  const lifeRate = t.match(/生命值(\d+)以上時技能發動機率提升(\d+)%/);
  const comboRate = t.match(/(\d+)Combo以上時技能發動機率提升(\d+)%/i);

  if (!dur && !support) return String(text ?? "").trim();

  let out = `${dur ?? 10}秒`;
  if (support) out += ` Support +${support}%`;
  if (lifeRate) out += `；Life ${lifeRate[1]}+ 時 Skill Rate +${lifeRate[2]}%`;
  else if (comboRate) out += `；Combo ${comboRate[1]}+ 時 Skill Rate +${comboRate[2]}%`;
  else if (rate) out += ` + Skill Rate +${rate}%`;
  return out;
}

export function catalogPassiveToExcel(text) {
  const raw = String(text ?? "").trim();
  const t = compact(raw);

  const selfUnit = t.match(
    /若編入(\d+)名以上(0|1|2|3|4|5)期生自己的(全能力|表現力|技巧|品味)提升(\d+)%/,
  );
  if (selfUnit) {
    const param = selfUnit[3] === "全能力" ? "全參數" : PARAM_ZH_TO_EN[selfUnit[3]];
    return `${selfUnit[2]}期生${selfUnit[1]}人以上：自身 ${param} +${selfUnit[4]}%`;
  }

  const selfType = t.match(
    /若編入(\d+)名以上(快樂類型|清純類型|可愛類型)自己的(全能力|表現力|技巧|品味)提升(\d+)%/,
  );
  if (selfType) {
    const param = selfType[3] === "全能力" ? "全參數" : PARAM_ZH_TO_EN[selfType[3]];
    return `${TYPE_ZH_TO_EN[selfType[2]]} ${selfType[1]}人以上：自身 ${param} +${selfType[4]}%`;
  }

  const groupType = t.match(
    /若編入(\d+)名以上(快樂類型|清純類型|可愛類型).*?(\d+)名\s*\2的(全能力|表現力|技巧|品味)提升(\d+)%/,
  );
  if (groupType) {
    const en = TYPE_ZH_TO_EN[groupType[2]];
    const param = groupType[4] === "全能力" ? "全參數" : PARAM_ZH_TO_EN[groupType[4]];
    return `${en} ${groupType[1]}人以上：${en} ${groupType[3]}人 ${param} +${groupType[5]}%`;
  }

  const groupUnitSupport = t.match(
    /若編入(\d+)名以上(0|1|2|3|4|5)期生(\d+)名(0|1|2|3|4|5)期生的分數加成效果(\d+)%/,
  );
  if (groupUnitSupport && groupUnitSupport[2] === groupUnitSupport[4]) {
    const u = groupUnitSupport[2];
    return `${u}期生${groupUnitSupport[1]}人以上：${u}期生${groupUnitSupport[3]}人 Support +${groupUnitSupport[5]}%`;
  }

  const groupUnit = t.match(
    /若編入(\d+)名以上(0|1|2|3|4|5)期生(\d+)名(0|1|2|3|4|5)期生的(全能力|表現力|技巧|品味)提升(\d+)%/,
  );
  if (groupUnit && groupUnit[2] === groupUnit[4]) {
    const u = groupUnit[2];
    const param = groupUnit[5] === "全能力" ? "全參數" : PARAM_ZH_TO_EN[groupUnit[5]];
    return `${u}期生${groupUnit[1]}人以上：${u}期生${groupUnit[3]}人 ${param} +${groupUnit[6]}%`;
  }

  const simpleSupport = t.match(/(\d+)名(快樂類型|清純類型|可愛類型)的分數加成效果(\d+)%/);
  if (simpleSupport) {
    return `${TYPE_ZH_TO_EN[simpleSupport[2]]} ${simpleSupport[1]}人 Support +${simpleSupport[3]}%`;
  }

  const simpleUnit = t.match(/(\d+)名(0|1|2|3|4|5)期生的(全能力|表現力|技巧|品味)提升(\d+)%/);
  if (simpleUnit) {
    const param = simpleUnit[3] === "全能力" ? "全參數" : PARAM_ZH_TO_EN[simpleUnit[3]];
    return `${simpleUnit[2]}期生${simpleUnit[1]}人 ${param} +${simpleUnit[4]}%`;
  }

  return raw;
}

export function catalogOutfitToExcel(text) {
  const raw = String(text ?? "").trim();
  const t = compact(raw);

  const dual = t.match(
    /若編入(\d+)名以上(快樂類型|清純類型|可愛類型).*?(全能力|表現力|技巧|品味)提升(\d+)%.*?分數加成效果(\d+)%/,
  );
  if (dual) {
    const en = TYPE_ZH_TO_EN[dual[2]];
    const param = dual[3] === "全能力" ? "全參數" : PARAM_ZH_TO_EN[dual[3]];
    return `${en} ${dual[1]}人以上：全員 ${param} +${dual[4]}% + Support +${dual[5]}%`;
  }

  const m = t.match(
    /若編入(\d+)名以上(快樂類型|清純類型|可愛類型|0|1|2|3|4|5)期生?(全體成員的)?(全能力|表現力|技巧|品味)提升(\d+)%(?:全體成員的分數加成效果(\d+)%)?/,
  );
  if (m) {
    const unit =
      TYPE_ZH_TO_EN[m[2]] ??
      (/^\d$/.test(m[2]) ? `${m[2]}期生` : m[2]);
    const param = m[4] === "全能力" ? "全參數" : PARAM_ZH_TO_EN[m[4]];
    let out = `${unit}${m[1]}人以上：全員 ${param} +${m[5]}%`;
    if (m[6]) out += ` + Support +${m[6]}%`;
    return out;
  }

  if (t.includes("全體成員") && !t.includes("若編入")) {
    const param = t.match(/(全能力|表現力|技巧|品味)提升(\d+)%/);
    if (param) {
      const p = param[1] === "全能力" ? "全參數" : PARAM_ZH_TO_EN[param[1]];
      return `全員 ${p} +${param[2]}%`;
    }
  }

  return raw;
}

export const UNIT_TO_GEN = {
  "0期生": "Gen 0",
  "1期生": "Gen 1",
  "2期生": "Gen 2",
  "3期生": "Gen 3",
  "4期生": "Gen 4",
  "5期生": "Gen 5",
  ゲーマーズ: "GAMERS",
  holoX: "holoX",
  ID1期生: "ID Gen 1",
  ID2期生: "ID Gen 2",
  ID3期生: "ID Gen 3",
  Myth: "Myth",
  Promise: "Promise",
  Advent: "Advent",
  ReGLOSS: "ReGLOSS",
};

export const TYPE_TO_EN = { happy: "Happy", pure: "Pure", cute: "Cute" };

/** Build one Excel sheet row from catalog + gameData card. */
export function catalogEntryToExcelRow(entry, card) {
  const gen = UNIT_TO_GEN[card.unit] ?? card.unit ?? "";
  const memberLabel =
    entry.member && entry.member !== card.member
      ? `${entry.member} / ${card.member}`
      : `${entry.member} / ${card.member}`;

  return {
    序號: +entry.no || "",
    "世代/團體": gen,
    角色名稱: memberLabel,
    卡片名稱: card.costumeName,
    類型: TYPE_TO_EN[card.type] ?? "",
    Performance: entry.stats?.performance ?? 0,
    Technique: entry.stats?.technique ?? 0,
    Sense: entry.stats?.sense ?? 0,
    總分: entry.stats?.total ?? 0,
    "Outfit（隊長Live服裝效果）": catalogOutfitToExcel(entry.costumeSkill ?? ""),
    "Special（特殊技能）": catalogSpecialToExcel(entry.skills?.sp ?? ""),
    "Active（主動技能）": catalogActiveToExcel(entry.skills?.active ?? ""),
    "Passive（被動技能）": catalogPassiveToExcel(entry.skills?.passive ?? ""),
    備註: "角色名片同步",
    _cardId: entry.cardId,
  };
}
