import type { ActiveSkill, PassiveSkill, SpecialSkill } from "../types";

function swapFirstNum(text: string, pattern: RegExp, next: number): string {
  return text.replace(pattern, (match) => match.replace(/\d+/, String(next)));
}

function swapNthNum(text: string, pattern: RegExp, n: number, next: number): string {
  let hit = 0;
  return text.replace(pattern, (match) => {
    hit += 1;
    if (hit !== n) return match;
    return match.replace(/\d+/, String(next));
  });
}

function spNumbersInTemplate(template: string) {
  return {
    duration: +(template.match(/在\s*(\d+)\s*秒內/)?.[1] ?? NaN),
    scoreSupport: +(template.match(/分數加成效果\s*(\d+)\s*%/)?.[1] ?? NaN),
    skillRate: +(template.match(/技能發動機率提升\s*(\d+)\s*%/)?.[1] ?? NaN),
  };
}

function activeNumbersInTemplate(template: string) {
  const scoreUps = [...template.matchAll(/分數提升\s*(\d+)\s*%/g)].map((m) => +m[1]);
  return {
    interval: +(template.match(/每\s*(\d+)\s*秒/)?.[1] ?? NaN),
    duration: +(template.match(/在\s*(\d+)\s*秒內/)?.[1] ?? NaN),
    scoreUp: scoreUps[0] ?? NaN,
    bonusScoreUp: scoreUps[1] ?? NaN,
  };
}

function passiveValueInTemplate(template: string): number {
  for (const pattern of [
    /分數加成效果\s*(\d+)\s*%/,
    /表現力提升\s*(\d+)\s*%/,
    /技巧提升\s*(\d+)\s*%/,
    /品味提升\s*(\d+)\s*%/,
    /全能力提升\s*(\d+)\s*%/,
  ]) {
    const m = template.match(pattern);
    if (m) return +m[1];
  }
  const m = template.match(/(提升|效果)(\s*)(\d+)(\s*%)/);
  return m ? +m[3] : NaN;
}

/** 以滿綻角色名片原文為模板，只替換隨綻放變化的數值（基準數字取自模板本身）。 */
export function substituteSpCatalogText(template: string, bloomed: SpecialSkill): string {
  const base = spNumbersInTemplate(template);
  let t = template;
  if (!Number.isNaN(base.duration) && bloomed.duration !== base.duration) {
    t = swapFirstNum(t, /在\s*\d+\s*秒內/, bloomed.duration);
  }
  if (!Number.isNaN(base.scoreSupport) && bloomed.scoreSupport !== base.scoreSupport) {
    t = swapFirstNum(t, /分數加成效果\s*\d+\s*%/, bloomed.scoreSupport);
  }
  if (!Number.isNaN(base.skillRate) && bloomed.skillRate !== base.skillRate) {
    t = swapFirstNum(t, /技能發動機率提升\s*\d+\s*%/, bloomed.skillRate);
  }
  return t;
}

export function substituteActiveCatalogText(template: string, bloomed: ActiveSkill): string {
  const base = activeNumbersInTemplate(template);
  let t = template;
  if (!Number.isNaN(base.interval) && bloomed.interval !== base.interval) {
    t = swapFirstNum(t, /每\s*\d+\s*秒/, bloomed.interval);
  }
  if (!Number.isNaN(base.duration) && bloomed.duration !== base.duration) {
    t = swapFirstNum(t, /在\s*\d+\s*秒內/, bloomed.duration);
  }
  if (!Number.isNaN(base.scoreUp) && bloomed.scoreUp !== base.scoreUp) {
    t = swapNthNum(t, /分數提升\s*\d+\s*%/g, 1, bloomed.scoreUp);
  }
  const bonus = bloomed.bonus?.scoreUp;
  if (
    !Number.isNaN(base.bonusScoreUp) &&
    bonus != null &&
    !Number.isNaN(bonus) &&
    bonus !== base.bonusScoreUp
  ) {
    t = swapNthNum(t, /分數提升\s*\d+\s*%/g, 2, bonus);
  }
  return t;
}

const PASSIVE_VALUE_PATTERNS: RegExp[] = [
  /分數加成效果\s*\d+\s*%/,
  /表現力提升\s*\d+\s*%/,
  /技巧提升\s*\d+\s*%/,
  /品味提升\s*\d+\s*%/,
  /全能力提升\s*\d+\s*%/,
];

export function substitutePassiveCatalogText(template: string, bloomed: PassiveSkill): string {
  const baseVal = passiveValueInTemplate(template);
  const bloomedVal = bloomed.effects[0]?.value;
  if (Number.isNaN(baseVal) || bloomedVal == null || baseVal === bloomedVal) return template;

  for (const pattern of PASSIVE_VALUE_PATTERNS) {
    if (!pattern.test(template)) continue;
    return template.replace(pattern, (match) => match.replace(/\d+/, String(bloomedVal)));
  }

  return template.replace(/(提升|效果)(\s*)(\d+)(\s*%)/, (_m, p1, sp, _n, pct) => {
    return `${p1}${sp}${bloomedVal}${pct}`;
  });
}
