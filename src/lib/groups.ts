import type { Locale } from "../i18n/messages";

/** Hololive generation / unit display order for member pickers. */
export const UNIT_ORDER: string[] = [
  "0期生",
  "1期生",
  "2期生",
  "ゲーマーズ",
  "3期生",
  "4期生",
  "5期生",
  "holoX",
  "ID1期生",
  "ID2期生",
  "ID3期生",
  "Myth",
  "Promise",
  "Advent",
  "ReGLOSS",
];

/** Event categories sort before permanent gens. */
export function isEventCategory(label: string): boolean {
  return !UNIT_ORDER.includes(label) && label !== "その他";
}

export function categorySortKey(label: string, currentEvent?: string): number {
  if (currentEvent && label === currentEvent) return -1000;
  if (isEventCategory(label)) return -100;
  return unitSortKey(label);
}

/** Group headers: current event first, then generations, then other events. */
export function orderedGroupKeys(
  regularKeys: string[],
  eventKeys: string[],
  currentEvent?: string,
): string[] {
  const currentKey = currentEvent && eventKeys.includes(currentEvent) ? currentEvent : null;
  const otherEventKeys = eventKeys
    .filter((k) => k !== currentEvent)
    .sort((a, b) => a.localeCompare(b, "ja"));
  return [...(currentKey ? [currentKey] : []), ...regularKeys, ...otherEventKeys];
}

/** Preferred debut order within each unit (when member exists). */
export const MEMBER_ORDER: string[] = [
  // 0期生
  "ときのそら",
  "ロボ子さん",
  "AZKi",
  "さくらみこ",
  "星街すいせい",
  // 1期生
  "夜空メル",
  "アキ・ローゼンタール",
  "赤井はあと",
  "白上フブキ",
  "夏色まつり",
  // 2期生
  "湊あくあ",
  "紫咲シオン",
  "百鬼あやめ",
  "癒月ちょこ",
  "大空スバル",
  // ゲーマーズ
  "大神ミオ",
  "猫又おかゆ",
  "戌神ころね",
  // 3期生
  "兎田ぺこら",
  "不知火フレア",
  "白銀ノエル",
  "宝鐘マリン",
  // 4期生
  "天音かなた",
  "角巻わため",
  "常闇トワ",
  "姫森ルーナ",
  // 5期生
  "雪花ラミィ",
  "桃鈴ねね",
  "獅白ぼたん",
  "尾丸ポルカ",
  // holoX
  "ラプラス・ダークネス",
  "鷹嶺ルイ",
  "博衣こより",
  "沙花叉クロヱ",
  "風真いろは",
  // ID1期生
  "アユンダ・リス",
  "ムーナ・ホシノヴァ",
  "アイラニ・イオフィフティーン",
  // ID2期生
  "クレイジー・オリー",
  "アーニャ・メルフィッサ",
  "パヴォリア・レイネ",
  // ID3期生
  "ベスティア・ゼータ",
  "カエラ・コヴァルスキア",
  "こぼ・かなえる",
  // EN
  "森カリオペ",
  "小鳥遊キアラ",
  "一伊那尓栖",
  "がうる・ぐら",
  "ワトソン・アメリア",
  "IRyS",
  "オーロ・クロニー",
  "ハコス・ベールズ",
  "シオリ・ノヴェラ",
  "古石ビジュー",
  "ネリッサ・レイヴンクロフト",
  "フワワ・アビスガード",
  "モココ・アビスガード",
  // ReGLOSS
  "音乃瀬奏",
  "一条莉々華",
  "儒烏風亭らでん",
  "轟はじめ",
];

/** Member units only (drops composite card.unit values like "ゲーマーズ:1期生"). */
export function cleanMemberUnits(units: string[] | undefined): string[] {
  if (!units?.length) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const u of units) {
    if (!u || u.includes(":")) continue;
    if (!seen.has(u)) {
      seen.add(u);
      out.push(u);
    }
  }
  return out.sort((a, b) => unitSortKey(a) - unitSortKey(b));
}

export function memberBelongsToUnit(units: string[] | undefined, unit: string): boolean {
  return cleanMemberUnits(units).includes(unit);
}

export function collectUnitOptions(
  members: Record<string, { units?: string[] }>,
): string[] {
  const present = new Set<string>();
  for (const meta of Object.values(members)) {
    for (const u of cleanMemberUnits(meta.units)) present.add(u);
  }
  return UNIT_ORDER.filter((u) => present.has(u));
}

export function cardMatchesUnitFilter(
  memberUnits: string[] | undefined,
  filters: string[],
): boolean {
  if (!filters.length) return true;
  const units = cleanMemberUnits(memberUnits);
  return filters.some((f) => units.includes(f));
}

export function formatUnitBadge(units: string[] | undefined, fallback = ""): string {
  const cleaned = cleanMemberUnits(units);
  if (cleaned.length) return cleaned.join(" · ");
  return fallback || "その他";
}

export function unitsForMemberGrouping(
  memberUnits: string[] | undefined,
  cardUnit?: string,
): string[] {
  const cleaned = cleanMemberUnits(memberUnits);
  if (cleaned.length) return cleaned;
  const fallback = primaryUnit(memberUnits, cardUnit);
  return fallback ? [fallback] : [];
}

export function orderedUnitKeys(map: Map<string, unknown>): string[] {
  return [
    ...UNIT_ORDER.filter((u) => map.has(u)),
    ...[...map.keys()]
      .filter((u) => !UNIT_ORDER.includes(u))
      .sort((a, b) => a.localeCompare(b, "ja")),
  ];
}

export function primaryUnit(units: string[] | undefined, fallback = ""): string {
  if (!units?.length) return fallback || "その他";
  const cleaned = units.filter((u) => u && !u.includes(":"));
  let best = cleaned[0] ?? units[0];
  let bestIdx = Infinity;
  for (const u of cleaned) {
    const idx = UNIT_ORDER.indexOf(u);
    if (idx >= 0 && idx < bestIdx) {
      bestIdx = idx;
      best = u;
    }
  }
  return best;
}

export function unitSortKey(unit: string): number {
  const idx = UNIT_ORDER.indexOf(unit);
  return idx >= 0 ? idx : UNIT_ORDER.length + unit.localeCompare(unit, "ja");
}

export function memberSortKey(member: string): number {
  const idx = MEMBER_ORDER.indexOf(member);
  return idx >= 0 ? idx : MEMBER_ORDER.length + 1000;
}

export function compareMembersByGroup(
  a: string,
  b: string,
  unitsOf: (name: string) => string[] | undefined,
): number {
  const ua = primaryUnit(unitsOf(a));
  const ub = primaryUnit(unitsOf(b));
  const byUnit = unitSortKey(ua) - unitSortKey(ub);
  if (byUnit !== 0) return byUnit;
  const byMember = memberSortKey(a) - memberSortKey(b);
  if (byMember !== 0) return byMember;
  return a.localeCompare(b, "ja");
}

export function groupLabel(unit: string): string {
  return unit || "その他";
}

const UNIT_LABEL_EN: Record<string, string> = {
  "0期生": "Gen 0",
  "1期生": "Gen 1",
  "2期生": "Gen 2",
  "3期生": "Gen 3",
  "4期生": "Gen 4",
  "5期生": "Gen 5",
  ゲーマーズ: "Gamers",
  holoX: "holoX",
  ID1期生: "ID Gen 1",
  ID2期生: "ID Gen 2",
  ID3期生: "ID Gen 3",
  Myth: "Myth",
  Promise: "Promise",
  Advent: "Advent",
  ReGLOSS: "ReGLOSS",
  その他: "Other",
};

/** Localized generation / unit label for skill text and condition UI. */
export function formatUnitLabel(unit: string, locale: Locale): string {
  if (locale === "en") return UNIT_LABEL_EN[unit] ?? unit;
  return unit;
}
