import catalogJson from "../data/cardCatalog.json";

export interface CardCatalogEntry {
  no: string;
  member: string;
  card: string;
  skills: { sp: string; active: string; passive: string };
  costumeSkill: string;
  cardId: string;
  /** gameData costumes[].id — captain 衣裝 keyed to 3.衣裝 screenshot */
  costumeId: string | null;
  stats: {
    performance: number;
    technique: number;
    sense: number;
    total: number;
  };
}

export const cardCatalog = catalogJson as CardCatalogEntry[];

export const catalogByCardId = new Map(cardCatalog.map((e) => [e.cardId, e]));

/** Verified 角色名片 3.衣裝 text keyed by captain costume id. */
export const catalogByCostumeId = new Map(
  cardCatalog
    .filter((e) => e.costumeId && e.costumeSkill)
    .map((e) => [e.costumeId!, e.costumeSkill]),
);
