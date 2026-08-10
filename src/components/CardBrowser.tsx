import type { ReactNode } from "react";
import { useI18n } from "../i18n/LocaleContext";
import {
  displayActiveSkill,
  displayCardStats,
  displayCostumeSkill,
  displayPassiveSkill,
  displaySpecialSkill,
  displayStatNum,
} from "../lib/catalogDisplay";
import { costumeForCard, hasDisplayableCostumeSkill } from "../lib/costumes";
import { formatUnitBadge } from "../lib/groups";
import { MemberName } from "./MemberName";
import { CardArt } from "./CardArt";
import type { Attr, Card, Costume } from "../types";

type Props = {
  groups: { unit: string; cards: Card[]; isEvent?: boolean }[];
  compact: boolean;
  unitsOf: (member: string) => string[];
  onCardClick?: (card: Card) => void;
  selectedCardId?: string | null;
  memberLockedSet?: Set<string>;
  preferredByMember?: Record<string, string>;
  leaderMember?: string;
  emptyText?: string;
  /** When set, gallery cards show matching captain costume skills. */
  costumeLookup?: Map<string, Costume>;
};

export function CardGroupBrowser({
  groups,
  compact,
  unitsOf,
  onCardClick,
  selectedCardId,
  memberLockedSet,
  preferredByMember = {},
  leaderMember = "",
  emptyText,
  costumeLookup,
}: Props) {
  const { t, attrLabel, locale } = useI18n();
  const empty = emptyText ?? t.noMatchingCards;

  if (!groups.length) {
    return <div className="empty">{empty}</div>;
  }

  return (
    <div className={`card-groups ${compact ? "is-compact" : ""}`}>
      {groups.map((g) => (
        <div key={g.unit} className="group-block">
          <div className={`group-heading ${g.isEvent ? "event" : ""}`}>
            {g.isEvent ? t.eventPrefix(g.unit) : g.unit}
          </div>
          <div className="card-grid">
            {g.cards.map((card) => {
              const preferred = preferredByMember[card.member] === card.id;
              const memberLocked = memberLockedSet?.has(card.member) ?? false;
              const selected = selectedCardId
                ? selectedCardId === card.id
                : preferred;
              const costume = costumeLookup ? costumeForCard(costumeLookup, card) : undefined;
              const spText = displaySpecialSkill(card, locale);
              const activeText = displayActiveSkill(card, locale);
              const passiveText = displayPassiveSkill(card, locale);
              const costumeText =
                costume && hasDisplayableCostumeSkill(costume)
                  ? displayCostumeSkill(costume, locale, [card])
                  : "";
              const displayStats = displayCardStats(card, locale);
              const className = `card-item card-item--${card.type} ${selected ? "owned" : ""} ${
                memberLocked && !selected ? "member-locked" : ""
              } ${leaderMember === card.member ? "is-leader" : ""} ${
                compact ? "is-compact" : ""
              } ${onCardClick ? "" : "is-static"}`;
              const body = (
                <>
                  <div className="card-art-wrap">
                    <CardArt cardId={card.id} alt={card.costumeName} />
                  </div>
                  {!compact && (
                    <div className="card-body">
                      <div className="name">
                        <MemberName member={card.member} units={unitsOf(card.member)} />
                      </div>
                      <div className="meta">
                        <span className={`badge ${card.type}`}>{attrLabel(card.type)}</span>
                        <span className="badge star">★{card.rarity}</span>
                        <span className="badge unit">
                          {card.event
                            ? t.eventBadge
                            : formatUnitBadge(unitsOf(card.member), card.unit)}
                        </span>
                      </div>
                      <p className="card-sub">{card.costumeName}</p>
                      <div className="card-stats">
                        <div className="stat-cell">
                          <span className="stat-label">{t.performance}</span>
                          <span
                            className={`stat-val ${displayStats?.performance == null ? "is-missing" : ""}`}
                          >
                            {displayStatNum(displayStats?.performance)}
                          </span>
                        </div>
                        <div className="stat-cell">
                          <span className="stat-label">{t.technique}</span>
                          <span
                            className={`stat-val ${displayStats?.technique == null ? "is-missing" : ""}`}
                          >
                            {displayStatNum(displayStats?.technique)}
                          </span>
                        </div>
                        <div className="stat-cell">
                          <span className="stat-label">{t.sense}</span>
                          <span
                            className={`stat-val ${displayStats?.sense == null ? "is-missing" : ""}`}
                          >
                            {displayStatNum(displayStats?.sense)}
                          </span>
                        </div>
                        <div className="stat-cell total">
                          <span className="stat-label">{t.statTotal}</span>
                          <span
                            className={`stat-val ${displayStats?.total == null ? "is-missing" : ""}`}
                          >
                            {displayStatNum(displayStats?.total)}
                          </span>
                        </div>
                      </div>
                      <div className="card-skills">
                        <div className="skill-row">
                          <span className="skill-chip sp" aria-hidden>
                            SP
                          </span>
                          <p className="skill-text">{spText}</p>
                        </div>
                        <div className="skill-row">
                          <span className="skill-chip active" aria-hidden>
                            A
                          </span>
                          <p className="skill-text">{activeText}</p>
                        </div>
                        <div className="skill-row">
                          <span className="skill-chip passive" aria-hidden>
                            P
                          </span>
                          <p className="skill-text">{passiveText}</p>
                        </div>
                        {costumeText && (
                          <div className="skill-row costume">
                            <span className="skill-chip costume" aria-hidden>
                              ★
                            </span>
                            <p className="skill-text">{costumeText}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {compact && (
                    <div className="name compact-name">
                      <MemberName member={card.member} units={unitsOf(card.member)} />
                    </div>
                  )}
                </>
              );
              if (onCardClick) {
                return (
                  <button
                    key={card.id}
                    type="button"
                    className={className}
                    onClick={() => onCardClick(card)}
                    title={displayActiveSkill(card, locale)}
                  >
                    {body}
                  </button>
                );
              }
              return (
                <article
                  key={card.id}
                  className={className}
                  title={displayActiveSkill(card, locale)}
                >
                  {body}
                </article>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

type FilterBarProps = {
  filterOpen: boolean;
  onToggleOpen: () => void;
  compact: boolean;
  onToggleCompact: () => void;
  filterSummary: string;
  rarityFilters: number[];
  typeFilters: Attr[];
  unitFilters: string[];
  unitOptions: string[];
  query: string;
  onQuery: (v: string) => void;
  onClearRarity: () => void;
  onToggleRarity: (r: number) => void;
  onClearType: () => void;
  onToggleType: (t: Attr) => void;
  onClearUnit: () => void;
  onToggleUnit: (u: string) => void;
  extraActions?: ReactNode;
  /** Hide ★ rarity toggles (optimize tab uses fixed ★5 + event pool). */
  showRarityFilter?: boolean;
};

export function CardFilterToolbar({
  filterOpen,
  onToggleOpen,
  compact,
  onToggleCompact,
  filterSummary,
  rarityFilters,
  typeFilters,
  unitFilters,
  unitOptions,
  query,
  onQuery,
  onClearRarity,
  onToggleRarity,
  onClearType,
  onToggleType,
  onClearUnit,
  onToggleUnit,
  extraActions,
  showRarityFilter = true,
}: FilterBarProps) {
  const { t, attrLabel } = useI18n();

  return (
    <>
      <div className="toolbar">
        <div className="field grow">
          <label>{t.search}</label>
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
          />
        </div>
        <button
          className={`btn btn-ghost ${filterOpen ? "active-toggle" : ""}`}
          type="button"
          onClick={onToggleOpen}
          aria-expanded={filterOpen}
        >
          {t.filterSettings}
          <small className="btn-sub">{filterSummary}</small>
        </button>
        <button
          className={`btn btn-ghost ${compact ? "active-toggle" : ""}`}
          type="button"
          onClick={onToggleCompact}
        >
          {compact ? t.showFull : t.hideDetails}
          <small className="btn-sub">{compact ? t.compactOnly : t.fullDetails}</small>
        </button>
        {extraActions}
      </div>

      {filterOpen && (
        <div className="filter-panel">
          {showRarityFilter && (
            <div className="filter-group">
              <div className="filter-label">
                {t.rarity}
                <span className="filter-hint">{t.multiSelect}</span>
              </div>
              <div className="filters">
                <button
                  type="button"
                  className={`filter-btn ${rarityFilters.length === 0 ? "active" : ""}`}
                  onClick={onClearRarity}
                >
                  {t.all}
                </button>
                {([5, 4, 3] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`filter-btn ${rarityFilters.includes(r) ? "active" : ""}`}
                    onClick={() => onToggleRarity(r)}
                  >
                    ★{r}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="filter-group">
            <div className="filter-label">
              {t.attribute}
              <span className="filter-hint">{t.multiSelect}</span>
            </div>
            <div className="filters">
              <button
                type="button"
                className={`filter-btn ${typeFilters.length === 0 ? "active" : ""}`}
                onClick={onClearType}
              >
                {t.all}
              </button>
              {(["happy", "pure", "cute"] as const).map((attr) => (
                <button
                  key={attr}
                  type="button"
                  className={`filter-btn ${typeFilters.includes(attr) ? "active" : ""}`}
                  onClick={() => onToggleType(attr)}
                >
                  {attrLabel(attr)}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <div className="filter-label">
              {t.genGroup}
              <span className="filter-hint">{t.multiSelect}</span>
            </div>
            <div className="filters">
              <button
                type="button"
                className={`filter-btn ${unitFilters.length === 0 ? "active" : ""}`}
                onClick={onClearUnit}
              >
                {t.all}
              </button>
              {unitOptions.map((u) => (
                <button
                  key={u}
                  type="button"
                  className={`filter-btn ${unitFilters.includes(u) ? "active" : ""}`}
                  onClick={() => onToggleUnit(u)}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
