import type { Card, Costume } from "../types";
import { catalogByCardId, catalogByCostumeId, type CardCatalogEntry } from "./cardCatalog";
import type { Locale } from "../i18n/messages";
import {
  formatActiveSkill,
  formatCostumeSkillText,
  formatPassiveSkill,
  formatSpecialSkill,
} from "./skillText";

/** ★5 / event card matching this captain costume (if any). */
export function catalogEntryForCostume(
  costume: Costume,
  cards: Card[],
): CardCatalogEntry | undefined {
  const byCostumeId = cardCatalogEntryByCostumeId(costume.id);
  if (byCostumeId) return byCostumeId;
  const card = cards.find(
    (c) =>
      c.member === costume.member &&
      c.costumeName === costume.costumeName &&
      (c.rarity === 5 || !!c.event),
  );
  return card ? catalogByCardId.get(card.id) : undefined;
}

function cardCatalogEntryByCostumeId(costumeId: string): CardCatalogEntry | undefined {
  for (const entry of catalogByCardId.values()) {
    if (entry.costumeId === costumeId) return entry;
  }
  return undefined;
}

/** 角色名片 3.衣裝（含 3.衣裝-2…）verified zh text for a captain costume. */
export function catalogCostumeSkillText(costume: Costume): string | undefined {
  return catalogByCostumeId.get(costume.id);
}

export function catalogEntryForCard(cardId: string): CardCatalogEntry | undefined {
  return catalogByCardId.get(cardId);
}

/** Verified 角色名片 text in zh; ja/en fall back to structured gameData formatters. */
export function displaySpecialSkill(card: Card, locale: Locale): string {
  if (locale === "zh") {
    const t = catalogByCardId.get(card.id)?.skills.sp;
    if (t) return t;
  }
  return formatSpecialSkill(card.special, locale) || "—";
}

export function displayActiveSkill(card: Card, locale: Locale): string {
  if (locale === "zh") {
    const t = catalogByCardId.get(card.id)?.skills.active;
    if (t) return t;
  }
  return formatActiveSkill(card.active, locale) || "—";
}

export function displayPassiveSkill(card: Card, locale: Locale): string {
  if (locale === "zh") {
    const t = catalogByCardId.get(card.id)?.skills.passive;
    if (t) return t;
  }
  return formatPassiveSkill(card.passive, locale) || "—";
}

export function displayCostumeSkill(
  costume: Costume,
  locale: Locale,
  cards: Card[] = [],
): string {
  if (locale === "zh") {
    const fromCatalog =
      catalogCostumeSkillText(costume) ??
      catalogEntryForCostume(costume, cards)?.costumeSkill;
    if (fromCatalog) return fromCatalog;
    // No 角色名片 → show JP raw, never auto-translated zh from gameData
    return costume.skill.raw?.trim() || "—";
  }
  return formatCostumeSkillText(costume.skill, locale) || "—";
}

export function displayCardStats(
  card: Card,
  locale: Locale,
): Card["stats"] | null | undefined {
  if (locale === "zh") {
    return catalogByCardId.get(card.id)?.stats ?? card.stats;
  }
  return card.stats;
}

/** Format a stat cell; missing values show "-". */
export function displayStatNum(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "-";
  return value.toLocaleString();
}
