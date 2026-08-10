import type { Card, Costume, GameData, TeamEvaluation } from "../types";
import { calcEffectiveStats } from "./stats";

/**
 * Rhythm-game strength model (exclusions per design):
 * - 總合力: 成員能力 + 服裝技能 + 被動技能（三圍）；不含 Holo 成員面板、回憶卡、成員強化
 * - 分數加成: no Holo 成員面板
 */

export interface ScoreBonusBreakdown {
  /** Active Score UP uptime average (%). */
  activePct: number;
  /** Sum of passive score-support buffs on recipients (%). */
  passiveScoreSupportPct: number;
  /** SP score-support averaged over song length (%). */
  specialPct: number;
  /** active + passive + special */
  totalPct: number;
}

export interface TotalStrengthBreakdown {
  /** 成員能力 — base card stats. */
  memberAbility: number;
  /** 服裝技能 — param buff from captain costume. */
  costumeSkill: number;
  /** 被動技能 — param buff from passives (not score support). */
  passiveSkill: number;
  total: number;
}

/** Game 總合力 = ①~③; excludes Holo 成員面板、回憶卡效果 & 成員強化加成. */
export function calcTotalStrengthBreakdown(
  cards: Card[],
  costume: Costume,
  costumeSatisfied: boolean,
  passiveSatisfied: boolean[],
  data: GameData,
): TotalStrengthBreakdown {
  const noPassives = cards.map(() => false);
  const baseOnly = calcEffectiveStats(cards, costume, false, noPassives, data);
  const withCostume = calcEffectiveStats(
    cards,
    costume,
    costumeSatisfied,
    noPassives,
    data,
  );
  const full = calcEffectiveStats(cards, costume, costumeSatisfied, passiveSatisfied, data);

  const memberAbility = baseOnly.baseTotal;
  const costumeSkill = Math.max(0, withCostume.teamTotal - baseOnly.baseTotal);
  const passiveSkill = Math.max(0, full.teamTotal - withCostume.teamTotal);

  return {
    memberAbility,
    costumeSkill,
    passiveSkill,
    total: full.teamTotal,
  };
}

/** Member stats + costume + passive param buffs. */
export function calcTotalStrength(effectiveStatTotal: number): number {
  return effectiveStatTotal;
}

/** SP score-support treated as active for `duration` once per song. */
export function calcSpEquivalentPct(cards: Card[], songLength: number): number {
  if (songLength <= 0) return 0;
  let sum = 0;
  for (const c of cards) {
    const { scoreSupport, duration } = c.special;
    if (scoreSupport > 0 && duration > 0) {
      sum += scoreSupport * (duration / songLength);
    }
  }
  return sum;
}

export function calcScoreBonusBreakdown(
  cards: Card[],
  avgScoreUp: number,
  teamScoreSupportPct: number,
  songLength: number,
): ScoreBonusBreakdown {
  const specialPct = calcSpEquivalentPct(cards, songLength);
  const activePct = avgScoreUp;
  const passiveScoreSupportPct = teamScoreSupportPct;
  return {
    activePct,
    passiveScoreSupportPct,
    specialPct,
    totalPct: activePct + passiveScoreSupportPct + specialPct,
  };
}

export function calcScoreBonusPct(breakdown: ScoreBonusBreakdown): number {
  return breakdown.totalPct;
}

/** Expected combat score proxy: 總合力 × (1 + 分數加成%). */
export function calcCombatPower(totalStrength: number, scoreBonusPct: number): number {
  return totalStrength * (1 + scoreBonusPct / 100);
}

export function attachCombatMetrics(
  ev: TeamEvaluation,
  songLength: number,
  data: GameData,
): TeamEvaluation {
  const totalStrengthBreakdown = calcTotalStrengthBreakdown(
    ev.cards,
    ev.costume,
    ev.costumeSatisfied,
    ev.passiveDetails.map((p) => p.satisfied),
    data,
  );
  const totalStrength = totalStrengthBreakdown.total;
  const scoreBonus = calcScoreBonusBreakdown(
    ev.cards,
    ev.avgScoreUp,
    ev.teamScoreSupportPct,
    songLength,
  );
  const scoreBonusPct = calcScoreBonusPct(scoreBonus);
  const combatPower = calcCombatPower(totalStrength, scoreBonusPct);
  return {
    ...ev,
    songLength,
    totalStrengthBreakdown,
    totalStrength,
    scoreBonusPct,
    scoreBonus,
    combatPower,
  };
}
