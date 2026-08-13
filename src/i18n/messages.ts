export type Locale = "zh" | "en" | "ja";

export const LOCALES: { id: Locale; label: string; htmlLang: string }[] = [
  { id: "zh", label: "中文", htmlLang: "zh-Hant" },
  { id: "en", label: "English", htmlLang: "en" },
  { id: "ja", label: "日本語", htmlLang: "ja" },
];

export const DEFAULT_LOCALE: Locale = "zh";
export const STORAGE_LOCALE = "holodream-locale";

export type Messages = {
  brand: string;
  brandSub: string;
  heroMascotSub: string;
  lastUpdated: (date: string) => string;
  updateNotesBtn: string;
  updateNotesTitle: string;
  updateNotesClose: string;
  updateNotesItems: string[];
  releaseAnnouncementTitle: string;
  releaseAnnouncementLead: string;
  releaseAnnouncementSections: Array<{ title: string; body: string }>;
  releaseAnnouncementDontShow: string;
  releaseAnnouncementConfirm: string;
  footer: string;
  langAria: string;
  themeAria: string;
  themeGallery: string;
  themeGallerySub: string;
  themeOptimize: string;
  themeOptimizeSub: string;
  themeRoster: string;
  themeRosterSub: string;
  rosterTitle: (n: number) => string;
  rosterNote: string;
  rosterCardPickTitle: string;
  rosterCardPickNote: string;
  rosterBloomTitle: string;
  rosterBloomNote: string;
  bloomStage: (n: number) => string;
  bloomBadge: (n: number) => string;
  rosterNeedFive: string;
  rosterClear: string;
  alertRosterMin: string;
  alertRosterCardMin: string;
  alertRosterWantedNeedOwned: (name: string) => string;
  fabRosterRun: string;
  galleryTitle: string;
  dataNoticeBefore: string;
  dataNoticeStrong: string;
  dataNoticeAfter: string;
  tagline: string;
  priority1: string;
  priority2: string;
  priority3: (sec: number) => string;
  priority4: string;
  captainTitle: string;
  labelGen: string;
  pickGenFirst: string;
  labelMember: string;
  pickMember: string;
  pickGenFirstShort: string;
  currentCaptain: string;
  songLength: string;
  costumePick: string;
  noCostumeData: string;
  conditionLabel: string;
  conditionUnitHint: (list: string, min: number) => string;
  conditionTypeHint: (list: string, min: number) => string;
  conditionNone: string;
  wantedTitle: (n: number) => string;
  wantedWithLeader: (n: number) => string;
  wantedLocked: (n: number) => string;
  captainOffTeam: string;
  wantedNote: string;
  rosterWantedNote: string;
  rosterWantedEmpty: string;
  rosterWantedCollapsedHint: string;
  clearWanted: string;
  removeWantedAria: (name: string) => string;
  resultsTitle: string;
  resultsEmptyWithLeader: (name: string) => string;
  resultsEmpty: string;
  trackAria: string;
  trackOverall: string;
  trackOverallDesc: string;
  prBaselineNote: string;
  prBaselineBtn: string;
  prBaselineBtnTitle: string;
  prBaselineBtnUnavailable: string;
  prBaselineBtnNeedCostume: string;
  prBaselineBtnLoading: string;
  prBaselineViewBanner: string;
  calcRulesBtn: string;
  calcRulesTitle: string;
  calcRulesClose: string;
  calcRulesPrTitle: string;
  calcRulesPrBody: string;
  calcRulesCombatTitle: string;
  calcRulesCombatBody: string;
  calcRulesStrengthTitle: string;
  calcRulesStrengthBody: string;
  calcRulesBonusTitle: string;
  calcRulesBonusBody: string;
  calcRulesPanelTitle: string;
  calcRulesPanelBody: string;
  siteNoticeBtn: string;
  siteNoticeTitle: string;
  siteNoticeLead: string;
  siteNoticeSections: Array<{ title: string; body: string }>;
  siteNoticeDontShow: string;
  siteNoticeConfirm: string;
  allowDupSkills: string;
  allowDupSkillsHint: string;
  skillDupWarn: string;
  skillDupPair: (a: string, b: string) => string;
  trackStats: string;
  trackStatsDesc: string;
  trackCoverage: string;
  trackCoverageDesc: string;
  trackScore: string;
  trackScoreDesc: string;
  noTrackTeams: string;
  pickTeamDetail: string;
  costumeSkill: string;
  activated: string;
  notActivated: string;
  activeBonusOn: string;
  activeBonusOff: string;
  activeBonusAssumed: string;
  allPassives: string;
  satisfied: string;
  notAllSatisfied: string;
  avgScoreUp: string;
  coveragePct: (n: string) => string;
  buffedStats: string;
  totalStrength: string;
  totalStrengthNote: string;
  strengthMember: string;
  strengthCostume: string;
  strengthHoloPanel: string;
  strengthPassive: string;
  strengthPassiveScoreOnly: string;
  panelEffect: string;
  panelLine: (unit: string, roster: number, value: number) => string;
  scoreBonus: string;
  scoreBonusActive: string;
  scoreBonusPassive: string;
  scoreBonusSpecial: string;
  scoreBonusNote: string;
  combatPower: string;
  baseStats: (n: string) => string;
  activeSkillCoverage: string;
  activeSkillGap: string;
  timelineCoverageHint: string;
  activeIntervalMeta: (interval: number, duration: number) => string;
  activeCoverageGapTotal: (sec: string) => string;
  activeCoverageSummary: (pct: string, sec: string) => string;
  timelineMemberSettings: string;
  cooldownReduction: string;
  spStart: string;
  optimizeReductions: string;
  optimizeReductionsRestore: string;
  spTimelineLabel: string;
  spBarTitle: (start: number, duration: number, pct: number) => string;
  timelineGapRow: string;
  timelineSpRow: string;
  timelineGapDur: (sec: number) => string;
  timelineActiveBar: (scoreUp: number) => string;
  leaderCostume: string;
  leader: string;
  memberN: (n: number) => string;
  forced: string;
  costumeColon: (name: string) => string;
  activeLine: (interval: number, duration: number, scoreUp: number) => string;
  passivePrefix: string;
  scoreSupport: (n: number) => string;
  timelineLabel: string;
  typeCounts: (h: number, p: number, c: number) => string;
  searchMeta: (searched: string, ms: number) => string;
  costumeNeed: (min: number) => string;
  fabTitleNeedLeader: string;
  fabTitleReady: string;
  fabBusy: string;
  fabBusyEstimate: (min: number) => string;
  fabBusyProgress: (searched: number, phase: "baseline" | "search") => string;
  fabRun: string;
  fabPickLeader: string;
  alertWantedMax: string;
  alertNeedLeader: string;
  alertOptimizeFailed: string;
  alertTooMany: string;
  filterAllStars: string;
  filterAllAttrs: string;
  filterAttrCount: (n: number) => string;
  filterAllGens: string;
  filterGenCount: (n: number) => string;
  metricPr: (n: string) => string;
  metricStats: (n: string) => string;
  metricCoverage: (n: string) => string;
  metricAvgUp: (n: string) => string;
  metricScoreBonus: (n: string) => string;
  search: string;
  searchPlaceholder: string;
  filterSettings: string;
  showFull: string;
  hideDetails: string;
  compactOnly: string;
  fullDetails: string;
  rarity: string;
  attribute: string;
  genGroup: string;
  multiSelect: string;
  all: string;
  noMatchingCards: string;
  eventPrefix: (name: string) => string;
  eventBadge: string;
  performance: string;
  technique: string;
  sense: string;
  total: (n: number | string) => string;
  statTotal: string;
  statsMissing: string;
  special: string;
  active: string;
  passive: string;
  attrHappy: string;
  attrPure: string;
  attrCute: string;
  condNone: string;
  condTypeCount: (attr: string, min: number) => string;
  condUnitCount: (unit: string, min: number) => string;
  explainParamUp: (param: string, value: number) => string;
  explainScoreSupport: (value: number) => string;
  explainWhen: (cond: string, effects: string) => string;
  gapsNone: string;
  gapRange: (a: number, b: number, dur: number) => string;
  gapsJoin: string;
  paramPerf: string;
  paramTech: string;
  paramSense: string;
  flagCostumeOn: string;
  flagCostumeOff: string;
  flagPassiveAll: string;
  flagPassiveMiss: string;
  flagStats: (n: string) => string;
  flagCoverage: (n: string) => string;
  flagUp: (n: string) => string;
  feedbackReport: string;
  feedbackSuggest: string;
  feedbackReportTitle: string;
  feedbackSuggestTitle: string;
  feedbackReportKicker: string;
  feedbackSuggestKicker: string;
  feedbackReportDesc: string;
  feedbackSuggestDesc: string;
  feedbackClose: string;
  feedbackCancel: string;
  feedbackSubmit: string;
  feedbackSubmitting: string;
  feedbackSubmitError: string;
  feedbackDone: string;
  feedbackSuccess: string;
  feedbackSuccessNoteCloud: string;
  feedbackSuccessNoteLocal: string;
  feedbackSuccessNoteFallback: string;
  feedbackCopy: string;
  feedbackCopied: string;
  feedbackGithub: string;
  feedbackLabelCategory: string;
  feedbackLabelContext: string;
  feedbackLabelMessage: string;
  feedbackLabelContact: string;
  feedbackLabelTime: string;
  feedbackSelectPlaceholder: string;
  feedbackReportPlaceholder: string;
  feedbackSuggestPlaceholder: string;
  feedbackContactPlaceholder: string;
  feedbackContextGeneral: string;
  feedbackCatStats: string;
  feedbackCatSkills: string;
  feedbackCatUi: string;
  feedbackCatOptimize: string;
  feedbackCatFeature: string;
  feedbackCatData: string;
  feedbackCatOther: string;
  feedbackLabelImages: string;
  feedbackImagesHint: string;
  feedbackImagesAdd: string;
  feedbackImagesRemove: (name: string) => string;
  feedbackImagesTooMany: string;
  feedbackImagesInvalid: string;
};

const zh: Messages = {
  brand: "Hololive Dreams 小工具",
  brandSub: "製作者 108_虎太郎 · ホロドリ便利ツール",
  heroMascotSub: "小惡魔",
  lastUpdated: (date) => `最近更新 ${date}`,
  updateNotesBtn: "更新說明",
  updateNotesTitle: "2026年8月14日 更新內容",
  updateNotesClose: "知道了",
  updateNotesItems: [
    "現有編隊新增 ★5 綻放設定（預設 0，可逐卡調 0–5）；優化與詳情依 wf-calc 開花表",
    "修正低綻放仍顯示滿綻角色名片技能文案（SP／A／P）的問題",
    "修正 A 技條件加碼、SP 技能發動率在低綻放未降級的問題",
    "綻 0–1 三圍比滿綻少 10%；綻 2 起三圍不扣（與遊戲一致）",
    "修正現有隊員編隊重新整理後無法計算的問題（持有卡面資料儲存衝突）",
    "修正回報錯誤附圖後無法按送出的問題",
    "未選隊長就按計算編隊時，會在畫面正中間彈出提示",
    "編隊改為全窮舉（全池約 600 萬組），移除 32 人快速路徑",
    "PR 9999 基準必須窮舉；有快取直接使用，不再重算",
    "最強編隊／現有編隊皆可從快取查看 PR 9999 基準",
    "計算中顯示已試幾組，避免以為當掉",
    "新增進站使用須知公告（使用須知可再開）",
    "修正第 5 位成員技能頻率無法顯示",
    "PR 算法 v3：戰力公式、文案與快取一致性修正",
    "修正分數加乘計算：被動分數加成改為三圍加權等效 %，不再錯誤加總五人百分比（PR 算法 v4）",
    "結果榜「分數加乘」標籤改顯示主動＋被動＋SP 總和",
    "修正部分 ★4 隊長衣裝未顯示或卡面圖缺失",
    "修正部分角色主動技能未計入時間軸的問題（資料解析錯誤導致空白）",
    "★5 計算改以角色名片資料為準（三圍、技能、隊長衣裝）",
    "修正被動條件判定：期生／類型人數不足時不再誤顯示「發動」（如菈米需 2 名 5 期生）",
    "修正被動分數加成有時顯示 0% 但全員被動顯示滿足的計算錯誤",
    "修正轟はじめ等主動技能未出現在時間軸的問題（秒ごとに解析）",
  ],
  releaseAnnouncementTitle: "8/14 更新",
  releaseAnnouncementLead:
    "「現有隊員編隊」新增 ★5 綻放設定，可依照你實際持有的開花程度調整每張 ★5 卡。",
  releaseAnnouncementSections: [
    {
      title: "用法",
      body: "選好隊員與持有卡面後，在下方「★5 綻放」逐張選 0–5（預設 0）。改完按「從現有隊員配對」重新計算，結果會依你設的綻放顯示技能與三圍。",
    },
  ],
  releaseAnnouncementDontShow: "不再顯示此公告",
  releaseAnnouncementConfirm: "知道了",
  footer: "製作者 108_虎太郎 · 資料對照 Game8 / AppMedia / Gamerch",
  langAria: "介面語言",
  themeAria: "功能主題",
  themeGallery: "角色一覽",
  themeGallerySub: "依期數瀏覽卡面",
  themeOptimize: "最強編隊",
  themeOptimizeSub: "隊長＋想要隊員優化",
  themeRoster: "現有隊員編隊",
  themeRosterSub: "從已擁有★5配對",
  rosterTitle: (n) => `① 已擁有隊員（${n} 人）`,
  rosterNote:
    "點選你持有的★5角色（含活動卡）。至少 5 人後選隊長；有多張★5者可在下方勾選持有卡面。PR 仍與最強編隊同基準（9999）。",
  rosterCardPickTitle: "★5 持有卡面",
  rosterCardPickNote: "勾選你持有的★5卡面（可多選）；編隊時會從中自動挑最適合的組合。",
  rosterBloomTitle: "★5 綻放",
  rosterBloomNote:
    "預設綻放 0（未滿綻放基準）。可逐卡調至 5；A／SP／P 與三圍依 wf-calc 開花表換算。",
  bloomStage: (n) => `綻放 ${n}`,
  bloomBadge: (n) => `綻${n}`,
  rosterNeedFive: "至少選 5 人",
  rosterClear: "清空已選",
  alertRosterMin: "請至少選擇 5 位已擁有隊員。",
  alertRosterCardMin: "每位成員至少需勾選一張★5卡面。",
  alertRosterWantedNeedOwned: (name) =>
    `${name} 尚未在「① 已擁有隊員」中勾選。請先在上方勾選該成員，再加入想要的隊員。`,
  fabRosterRun: "從現有隊員配對",
  galleryTitle: "角色一覽",
  dataNoticeBefore: "數值與技能皆為",
  dataNoticeStrong: "滿綻放・滿等",
  dataNoticeAfter: "狀態。部分 ★3／★4 可能尚未收錄三圍。",
  tagline:
    "隊長僅決定衣裝技能，編成五員不必包含隊長。指定隊員固定入隊，其餘由系統補齊。",
  priority1: "隊長衣裝技能",
  priority2: "被動全部滿足",
  priority3: (sec) => `戰力 / PR 優先（輔：平均 Score UP、覆蓋率 · ${sec}s 曲）`,
  priority4: "加成後三圍總和",
  captainTitle: "① 選擇隊長",
  labelGen: "期數 / 分組",
  pickGenFirst: "先選期數",
  labelMember: "成員",
  pickMember: "選擇該期成員",
  pickGenFirstShort: "請先選期數",
  currentCaptain: "目前隊長",
  songLength: "曲長（秒）",
  costumePick: "選擇隊長衣裝技能",
  noCostumeData: "此成員尚無衣裝技能資料。",
  conditionLabel: "發動條件",
  conditionUnitHint: (list, min) =>
    `編成五員中，${list || "（無）"} 至少 ${min} 人（隊長本人不計入也可）。`,
  conditionTypeHint: (list, min) =>
    `對應屬性卡成員：${list || "（無）"}。目標至少 ${min} 人。`,
  conditionNone: "此衣裝無人數條件，系統會依被動與技能覆蓋率優化隊員。",
  wantedTitle: (n) => `② 想要的隊員（${n} / 5）`,
  wantedWithLeader: (n) => `｜含隊長共鎖定 ${n} 人`,
  wantedLocked: (n) => `｜已鎖定 ${n} 人`,
  captainOffTeam: "（不在編成內）",
  wantedNote:
    "點選卡面加入想要隊員（最多 5）。隊長只決定衣裝，不必佔編成名額；鎖定隊員固定入隊，其餘空位由最佳化補齊。",
  rosterWantedNote:
    "從已擁有隊員中點選卡面加入想要隊員（最多 5）。隊長只決定衣裝，不必佔編成名額；鎖定隊員固定入隊，其餘空位由持有池補齊。",
  rosterWantedEmpty: "請先在上方選擇已擁有隊員，或勾選要使用的★5卡面。",
  rosterWantedCollapsedHint: "（選填）點擊展開",
  clearWanted: "清空想要隊員",
  removeWantedAria: (name) => `取消 ${name}`,
  resultsTitle: "③ 最佳編成結果",
  resultsEmptyWithLeader: (name) => `已選隊長 ${name}，按下右下角「計算編隊」。`,
  resultsEmpty: "請先在上方選擇隊長與衣裝。",
  trackAria: "推薦導向",
  trackOverall: "最強隊伍",
  trackOverallDesc:
    "衣裝＋被動前提下，總合力×分數加成（戰力）相對「同衣裝無指定隊員最強隊」PR 前 8",
  prBaselineNote:
    "PR＝戰力相對基準（9999）。總合力＝成員能力＋服裝技能＋被動（三圍 buff）；分數加成＝主動＋被動分數加成＋SP。皆不含 Holo 面板、回憶卡、成員強化。",
  prBaselineBtn: "PR 9999",
  prBaselineBtnTitle: "查看同衣裝、無指定隊員時的最強編隊（PR 基準）",
  prBaselineBtnUnavailable: "此衣裝尚無 PR 基準快取",
  prBaselineBtnNeedCostume: "請先選定隊長衣裝",
  prBaselineBtnLoading: "載入 PR 基準快取…",
  prBaselineViewBanner: "PR 9999 基準編隊 — 同衣裝、無指定隊員、全池 ★5＋活動最強",
  calcRulesBtn: "計算規則",
  calcRulesTitle: "PR 與戰力怎麼算？",
  calcRulesClose: "知道了",
  calcRulesPrTitle: "PR 是什麼？",
  calcRulesPrBody:
    "跟「同一套隊長衣裝、沒有指定任何隊員」時，系統能排出的最強編隊比。那組的 PR 固定是 9999，其他編隊依戰力比例換算（最高 9998）。",
  calcRulesCombatTitle: "戰力（算 PR 用）",
  calcRulesCombatBody: "戰力 ＝ 總合力 ×（1 ＋ 分數加成% ÷ 100）",
  calcRulesStrengthTitle: "總合力",
  calcRulesStrengthBody:
    "與遊戲「隊伍分數詳情」相近，取三項相加：\n①成員能力\n②服裝技能\n③被動（三圍 buff）\n不含 Holo 成員面板、回憶卡、成員強化。被動「分數加成」算在右欄分數加成，不計入此處。",
  calcRulesBonusTitle: "分數加成",
  calcRulesBonusBody:
    "主動平均 Score UP（計算必發、不計機率；體力／連擊加碼假定達成）＋被動分數加成（依受加成者三圍加權換算成隊伍等效 %，非五人百分比相加）＋ SP。短縮率僅影響下方時間軸，不影響 PR。不含 Holo 分數面板。",
  calcRulesPanelTitle: "Holo 總合力面板",
  calcRulesPanelBody: "依期別在隊人數：5 人期每人 +1500、4 人期 +1200、3 人期 +1350。",
  siteNoticeBtn: "使用須知",
  siteNoticeTitle: "使用須知（請先讀）",
  siteNoticeLead:
    "本工具供編隊參考；下列事項已多次說明，使用前請務必閱讀，以免重複詢問。",
  siteNoticeSections: [
    {
      title: "使用初衷",
      body: "在指定隊長衣裝下窮舉搜尋高 PR 編隊。PR 9999 為同衣裝、無指定隊員、全池 ★5＋活動的最強基準（每衣裝一組）。",
    },
    {
      title: "隊員順序 ≠ 推薦擺位",
      body: "每首歌得分點不同，本工具不計算場上先後順序。結果 1～5 僅供辨識成員，不是遊戲內推薦站位，請依該曲得分點自行調整。",
    },
    {
      title: "未納入 PR 計算",
      body: "Holo 成員藍色面板（預設視為全員點滿且加成相同）、回憶卡、成員強化。欄位放誰對三圍專精向編隊影響較大，請自行斟酌。",
    },
    {
      title: "PR 與時間軸",
      body: "戰力＝總合力×分數加成。CDR（技能短縮）只影響下方時間軸，不影響 PR。",
    },
    {
      title: "「X 期 2 名以上」類技能",
      body: "以該隊符合條件、該能力數值最高的前 2 名計加成；即使超過 2 人符合，仍是數值高者受益。",
    },
    {
      title: "計算為何較久",
      body: "全池窮舉約 600 萬組編隊，在瀏覽器本機運算，速度受 CPU 影響；手機或舊電腦可能更慢。按鈕會顯示已試幾組，有 PR 快取會快很多。計算中請保持分頁在前景。",
    },
  ],
  siteNoticeDontShow: "不再顯示此公告",
  siteNoticeConfirm: "我已閱讀",
  allowDupSkills: "允許主動技能重複",
  allowDupSkillsHint: "關閉後排除主動 Score UP 時程／倍率相同的編成",
  skillDupWarn: "主動技能重複",
  skillDupPair: (a, b) => `${a} 與 ${b} 主動 Score UP 時程相同（重疊不疊加）`,
  trackStats: "三圍總和",
  trackStatsDesc: "衣裝＋被動優先，加成後三圍前 8",
  trackCoverage: "技能覆蓋率",
  trackCoverageDesc: "衣裝＋被動優先，覆蓋率前 8",
  trackScore: "分數加乘",
  trackScoreDesc: "衣裝＋被動前提下，分數加乘%（主動＋被動分數加成＋SP）前 8",
  noTrackTeams: "此導向沒有可用編成。",
  pickTeamDetail: "請選擇左側其中一組編成查看詳情。",
  costumeSkill: "衣裝技能",
  activated: "發動",
  notActivated: "未發動",
  activeBonusOn: "加碼：發動",
  activeBonusOff: "加碼：未發動",
  activeBonusAssumed: "加碼：假定達成（體力／連擊）",
  allPassives: "被動全部",
  satisfied: "滿足",
  notAllSatisfied: "未全滿",
  avgScoreUp: "平均 Score UP",
  coveragePct: (n) => `覆蓋 ${n}%`,
  buffedStats: "加成後三圍",
  totalStrength: "總合力",
  totalStrengthNote: "不含 Holo 成員面板、回憶卡、成員強化",
  strengthMember: "成員能力",
  strengthCostume: "服裝技能",
  strengthHoloPanel: "Holo 成員面板",
  strengthPassive: "被動（三圍）",
  strengthPassiveScoreOnly: "此隊被動皆為分數加成 → 見「分數加成・被動」",
  panelEffect: "Holo 面板",
  panelLine: (unit, roster, value) => `${unit}（${roster}人）+${value}`,
  scoreBonus: "分數加成",
  scoreBonusActive: "主動",
  scoreBonusPassive: "被動",
  scoreBonusSpecial: "SP",
  scoreBonusNote: "不含 Holo 面板",
  combatPower: "戰力",
  baseStats: (n) => `基礎 ${n}`,
  activeSkillCoverage: "主動技能覆蓋率",
  activeSkillGap: "技能空窗期",
  timelineCoverageHint: "含短縮率 · 不影響 PR",
  activeIntervalMeta: (interval, duration) => `每${interval}秒 · ${duration}秒`,
  activeCoverageGapTotal: (sec) => `${sec} 秒`,
  timelineMemberSettings: "時間軸設定",
  cooldownReduction: "短縮",
  spStart: "SP 開始",
  optimizeReductions: "推薦短縮率",
  optimizeReductionsRestore: "還原短縮率",
  spTimelineLabel: "SP 技能時間軸（1 秒刻み）",
  spBarTitle: (start, duration, pct) =>
    `${start}s 起 ${duration}s · 分數 +${pct}%`,
  timelineGapRow: "技能空窗",
  timelineSpRow: "SP 技能",
  timelineGapDur: (sec) => `${sec.toFixed(1)}秒`,
  timelineActiveBar: (scoreUp) => `Score UP ${scoreUp}%`,
  leaderCostume: "隊長衣裝",
  leader: "隊長",
  memberN: (n) => `隊員 ${n}`,
  forced: "指定",
  costumeColon: (name) => `｜衣裝：${name}`,
  activeLine: (interval, duration, scoreUp) =>
    `Active：每 ${interval}s 發動 / 持續 ${duration}s / ${scoreUp}%（計算時視為必發動）`,
  passivePrefix: "Passive：",
  scoreSupport: (n) => ` · 分數加成 +${n}%`,
  timelineLabel: "有效 Score UP 時間軸（每秒取最高加成％，技能預設全部發動）",
  activeCoverageSummary: (pct, sec) => `${pct}% 覆蓋 · 空窗 ${sec} 秒`,
  typeCounts: (h, p, c) => `類型：快樂 ${h} / 清純 ${p} / 可愛 ${c}`,
  searchMeta: (searched, ms) => `｜ 搜尋 ${searched} 組｜耗時 ${ms} ms`,
  costumeNeed: (min) => `（衣裝條件需 ≥ ${min}）`,
  fabTitleNeedLeader: "請先選擇隊長",
  fabTitleReady: "計算最佳配對",
  fabBusy: "計算中…",
  fabBusyEstimate: (min) => `預估約 ${min} 分鐘`,
  fabBusyProgress: (searched, phase) =>
    `${phase === "baseline" ? "PR 基準" : "編隊"}：已試 ${searched.toLocaleString()} 組`,
  fabRun: "計算編隊",
  fabPickLeader: "先選隊長",
  alertWantedMax: "想要的隊員最多 5 位",
  alertNeedLeader: "請先選擇隊長",
  alertOptimizeFailed: "編隊計算失敗，請重新整理後再試。",
  alertTooMany: "隊長 + 想要的隊員合計不能超過 5 人，請減少想要隊員",
  filterAllStars: "全部星級",
  filterAllAttrs: "全部屬性",
  filterAttrCount: (n) => `屬性×${n}`,
  filterAllGens: "全部期數",
  filterGenCount: (n) => `期數×${n}`,
  metricPr: (n) => `PR ${n}`,
  metricStats: (n) => `三圍 ${n}`,
  metricCoverage: (n) => `覆蓋 ${n}%`,
  metricAvgUp: (n) => `平均 UP ${n}%`,
  metricScoreBonus: (n) => `分數加乘 ${n}%`,
  search: "搜尋",
  searchPlaceholder: "成員 / 衣裝 / 快樂類型…",
  filterSettings: "篩選設定",
  showFull: "顯示完整",
  hideDetails: "隱藏詳情",
  compactOnly: "僅卡面＋名字",
  fullDetails: "卡面／技能全顯示",
  rarity: "稀有度",
  attribute: "屬性",
  genGroup: "期數 / 分組",
  multiSelect: "可多選",
  all: "全部",
  noMatchingCards: "沒有符合篩選的卡片。",
  eventPrefix: (name) => `活動｜${name}`,
  eventBadge: "活動",
  performance: "表現力",
  technique: "技巧",
  sense: "品味",
  total: (n) => `合計 ${n}`,
  statTotal: "合計",
  statsMissing: "數值資料未收錄",
  special: "特殊技能",
  active: "主動技能",
  passive: "被動技能",
  attrHappy: "快樂類型",
  attrPure: "清純類型",
  attrCute: "可愛類型",
  condNone: "無條件（入場即發動）",
  condTypeCount: (attr, min) => `編入${min}名以上${attr}`,
  condUnitCount: (unit, min) => `編入${min}名以上${unit}`,
  explainParamUp: (param, value) => `全員${param}提升${value}%`,
  explainScoreSupport: (value) => `全員分數加成效果${value}%`,
  explainWhen: (cond, effects) => `若${cond}${effects}`,
  gapsNone: "無（全程有技能）",
  gapRange: (a, b, dur) => `${a}–${b}秒（${dur}秒）`,
  gapsJoin: "、",
  paramPerf: "表現力",
  paramTech: "技巧",
  paramSense: "品味",
  flagCostumeOn: "衣裝○",
  flagCostumeOff: "衣裝×",
  flagPassiveAll: "被動全○",
  flagPassiveMiss: "被動缺",
  flagStats: (n) => `三圍 ${n}`,
  flagCoverage: (n) => `覆蓋 ${n}%`,
  flagUp: (n) => `UP ${n}%`,
  feedbackReport: "回報錯誤",
  feedbackSuggest: "提供建議",
  feedbackReportTitle: "回報錯誤",
  feedbackSuggestTitle: "提供建議",
  feedbackReportKicker: "發現資料或功能有問題？",
  feedbackSuggestKicker: "想讓工具更好用？",
  feedbackReportDesc: "請盡量描述卡名、頁面與錯誤內容；可附上截圖，方便製作者修正。",
  feedbackSuggestDesc: "歡迎提出新功能、介面或資料方面的想法；可附上示意截圖。",
  feedbackClose: "關閉",
  feedbackCancel: "取消",
  feedbackSubmit: "送出",
  feedbackSubmitting: "送出中…",
  feedbackSubmitError: "送出失敗，請稍後再試。",
  feedbackDone: "完成",
  feedbackSuccess: "已收到，謝謝你的回報！",
  feedbackSuccessNoteCloud: "已同步至雲端，製作者可在後台查看。",
  feedbackSuccessNoteLocal:
    "未設定雲端儲存時僅存於本機；可複製內容或開 GitHub Issue 給製作者。",
  feedbackSuccessNoteFallback:
    "雲端同步失敗，內容已存於本機。請複製或開 GitHub Issue 以確保製作者收到。",
  feedbackCopy: "複製內容",
  feedbackCopied: "已複製",
  feedbackGithub: "GitHub Issue",
  feedbackLabelCategory: "類型",
  feedbackLabelContext: "相關頁面",
  feedbackLabelMessage: "內容",
  feedbackLabelContact: "聯絡方式（選填）",
  feedbackLabelTime: "時間",
  feedbackSelectPlaceholder: "請選擇…",
  feedbackReportPlaceholder: "例：櫻巫女「在海灘上炸裂…」被動技能文字與遊戲不符…",
  feedbackSuggestPlaceholder: "例：希望最強編隊結果可以匯出成圖片…",
  feedbackContactPlaceholder: "Discord / X @handle（選填）",
  feedbackContextGeneral: "全站／其他",
  feedbackCatStats: "三圍數值",
  feedbackCatSkills: "技能文字",
  feedbackCatUi: "介面／顯示",
  feedbackCatOptimize: "編隊／PR 計算",
  feedbackCatFeature: "新功能",
  feedbackCatData: "資料／卡面",
  feedbackCatOther: "其他",
  feedbackLabelImages: "附圖（選填）",
  feedbackImagesHint: "最多 3 張。可選擇檔案，或在表單內 Ctrl+V 貼上截圖。",
  feedbackImagesAdd: "加入圖片",
  feedbackImagesRemove: (name) => `移除 ${name}`,
  feedbackImagesTooMany: "最多只能附加 3 張圖片。",
  feedbackImagesInvalid: "無法讀取該圖片，請改用 JPG／PNG／WebP。",
};

const en: Messages = {
  brand: "Hololive Dreams Tools",
  brandSub: "by 108_虎太郎 · Holodori utility",
  heroMascotSub: "Devil Princess",
  lastUpdated: (date) => `Last updated ${date}`,
  updateNotesBtn: "What's new",
  updateNotesTitle: "Aug 14, 2026 update",
  updateNotesClose: "Got it",
  updateNotesItems: [
    "Owned roster: ★5 bloom (0–5) per card, default 0; optimize & detail use wf-calc bloom table",
    "Fixed low-bloom teams still showing max-bloom catalog skill text (SP / A / P)",
    "Fixed A conditional bonus & SP skill rate not downgrading at low bloom",
    "Bloom 0–1 stats −10% vs max; bloom 2+ uses full stats (matches game)",
    "Fixed owned-roster mode failing after page reload (localStorage key collision)",
    "Fixed feedback form submit button hidden after attaching screenshots",
    "Centered prompt when running optimize without choosing a captain",
    "Team search is fully exhaustive (~6M combos full pool); fast path removed",
    "PR 9999 baseline is always exhaustive; uses cache when available",
    "PR 9999 baseline readable from cache in both optimize & roster modes",
    "Progress counter while calculating (teams tried)",
    "First-visit usage notice (reopen via Notice button)",
    "Fixed skill frequency display for 5th member on timeline",
    "PR algo v3: combat power formula, copy & cache consistency fixes",
    "Fixed score bonus calc: passive score support uses stat-weighted team %, not summed per member (PR algo v4)",
    "Score bonus track tab shows active + passive + SP total",
    "Fixed some ★4 captain costumes missing or without card art",
    "Fixed active skills missing from timeline for some characters (parse error)",
    "★5 computation now sourced from verified character-card catalog (stats, skills, outfits)",
    "Fixed passive condition checks: no false \"activated\" when unit/type count is insufficient (e.g. Lamy needs 2× 5th gen)",
    "Fixed passive score bonus sometimes 0% while all passives showed satisfied",
    "Fixed active skills missing from timeline for some characters (e.g. Hajime — 秒ごとに parse)",
  ],
  releaseAnnouncementTitle: "Aug 14 update",
  releaseAnnouncementLead:
    "Owned roster now supports ★5 bloom — set each card to match how far you've bloomed it.",
  releaseAnnouncementSections: [
    {
      title: "How to use",
      body: "After picking members and owned cards, use the \"★5 Bloom\" section (0–5 per card, default 0). Tap \"Build from owned roster\" to recalculate with your bloom settings.",
    },
  ],
  releaseAnnouncementDontShow: "Don't show again",
  releaseAnnouncementConfirm: "Got it",
  footer: "Created by 108_虎太郎 · Data cross-checked with Game8 / AppMedia / Gamerch",
  langAria: "Interface language",
  themeAria: "Features",
  themeGallery: "Card Gallery",
  themeGallerySub: "Browse by generation",
  themeOptimize: "Best Team",
  themeOptimizeSub: "Captain + locked picks",
  themeRoster: "Owned Roster",
  themeRosterSub: "Build from your ★5",
  rosterTitle: (n) => `① Owned members (${n})`,
  rosterNote:
    "Select owned ★5 members (incl. event). Need 5+, then captain; check owned cards below if they have multiple ★5s. PR uses Best Team 9999 baseline.",
  rosterCardPickTitle: "★5 owned cards",
  rosterCardPickNote: "Check every ★5 you own (multi-select). The optimizer picks the best mix for each team.",
  rosterBloomTitle: "★5 Bloom",
  rosterBloomNote:
    "Default bloom 0 (pre-max baseline). Set per card up to 5; stats/skills follow wf-calc bloom table.",
  bloomStage: (n) => `Bloom ${n}`,
  bloomBadge: (n) => `B${n}`,
  rosterNeedFive: "Need at least 5",
  rosterClear: "Clear selection",
  alertRosterMin: "Select at least 5 owned members.",
  alertRosterCardMin: "Each member needs at least one ★5 card selected.",
  alertRosterWantedNeedOwned: (name) =>
    `${name} is not selected in Owned members (section ①). Select them above before locking as wanted.`,
  fabRosterRun: "Match from roster",
  galleryTitle: "Card Gallery",
  dataNoticeBefore: "All stats and skills shown are at ",
  dataNoticeStrong: "max bloom / max level",
  dataNoticeAfter: ". Some ★3 / ★4 cards may not have stats yet.",
  tagline:
    "Pick a captain for the costume skill. The 5 lineup members need not include the captain—lock up to 5 wanted picks; the rest are filled automatically.",
  priority1: "Captain costume skill",
  priority2: "All passives met",
  priority3: (sec) => `Combat power / PR first (tie: avg Score UP, coverage · ${sec}s)`,
  priority4: "Buffed total stats",
  captainTitle: "① Choose captain",
  labelGen: "Generation / group",
  pickGenFirst: "Select a generation",
  labelMember: "Member",
  pickMember: "Select a member",
  pickGenFirstShort: "Pick a generation first",
  currentCaptain: "Captain",
  songLength: "Song length (sec)",
  costumePick: "Captain costume skill",
  noCostumeData: "No costume skill data for this member yet.",
  conditionLabel: "Activation condition",
  conditionUnitHint: (list, min) =>
    `Among the 5 members, need at least ${min} from: ${list || "(none)"} (captain need not be included).`,
  conditionTypeHint: (list, min) =>
    `Members with matching attribute cards: ${list || "(none)"}. Need at least ${min}.`,
  conditionNone:
    "No member-count condition. Teammates are optimized for passives and skill coverage.",
  wantedTitle: (n) => `② Wanted members (${n} / 5)`,
  wantedWithLeader: (n) => `｜ ${n} locked including captain`,
  wantedLocked: (n) => `｜ ${n} locked`,
  captainOffTeam: " (not in lineup)",
  wantedNote:
    "Tap a card to lock a member (max 5). Captain sets the costume only; locked members stay in the team; other slots are optimized.",
  rosterWantedNote:
    "From your owned roster, tap a card to lock a member (max 5). Captain sets the costume only; locked members stay in the team; other slots are filled from your roster.",
  rosterWantedEmpty: "Select owned members above, or check which ★5 cards you hold.",
  rosterWantedCollapsedHint: "(Optional) Tap to expand",
  clearWanted: "Clear wanted",
  removeWantedAria: (name) => `Remove ${name}`,
  resultsTitle: "③ Best team results",
  resultsEmptyWithLeader: (name) =>
    `Captain set to ${name}. Tap “Build team” at the bottom right.`,
  resultsEmpty: "Choose a captain and costume above first.",
  trackAria: "Ranking focus",
  trackOverall: "Best overall",
  trackOverallDesc:
    "Costume + all passives; PR top 8 by combat power (strength × score bonus) vs unconstrained baseline",
  prBaselineNote:
    "PR = combat power vs baseline (9999). Total strength = member + costume + passive stat buffs; score bonus = active + passive score support + SP. Excl. Holo panels, memory cards, enhancement.",
  prBaselineBtn: "PR 9999",
  prBaselineBtnTitle: "View the unconstrained strongest team for this costume (PR baseline)",
  prBaselineBtnUnavailable: "No PR baseline cache for this costume",
  prBaselineBtnNeedCostume: "Choose captain costume first",
  prBaselineBtnLoading: "Loading PR baseline cache…",
  prBaselineViewBanner:
    "PR 9999 baseline — strongest team for this costume with no locked members (full ★5 + event pool)",
  calcRulesBtn: "How PR works",
  calcRulesTitle: "PR & combat power",
  calcRulesClose: "Got it",
  calcRulesPrTitle: "What is PR?",
  calcRulesPrBody:
    "Compared to the strongest team for the same captain costume with no locked members. That baseline is PR 9999; others scale by combat power (max 9998).",
  calcRulesCombatTitle: "Combat power",
  calcRulesCombatBody: "Combat power = total strength × (1 + score bonus% ÷ 100)",
  calcRulesStrengthTitle: "Total strength",
  calcRulesStrengthBody:
    "Close to in-game team score details:\n① member ability\n② costume skill\n③ passive (stat buffs only)\nExcl. Holo member panel, memory, enhancement. Passive score support counts under Score bonus, not here.",
  calcRulesBonusTitle: "Score bonus",
  calcRulesBonusBody:
    "Avg active Score UP (always proc, no probability; life/combo bonus assumed) + passive score support (team-equivalent % weighted by recipient stats, not summed per member) + SP. CDR affects timeline only, not PR. Excl. Holo score panel.",
  calcRulesPanelTitle: "Holo strength panel",
  calcRulesPanelBody: "Per member on team by generation size: 5-member +1500, 4-member +1200, 3-member +1350.",
  siteNoticeBtn: "Notice",
  siteNoticeTitle: "Please read first",
  siteNoticeLead:
    "Team-building reference only. These points are documented here — please read before asking.",
  siteNoticeSections: [
    {
      title: "Purpose",
      body: "Exhaustive search for high-PR teams under a captain costume. PR 9999 = strongest baseline per costume (full ★5 + event pool, no locked members).",
    },
    {
      title: "Member order ≠ recommended slots",
      body: "Score beats differ per song. We do not compute in-game slot order. List numbers 1–5 are labels only — arrange slots yourself per song.",
    },
    {
      title: "Excluded from PR",
      body: "Holo member blue panels (assumed maxed, equal bonus), memory cards, member enhancement. Slot placement matters for stat-focused teams — use your judgment.",
    },
    {
      title: "PR vs timeline",
      body: "Combat power = total strength × score bonus. CDR affects the timeline only, not PR.",
    },
    {
      title: "“2+ from generation” skills",
      body: "Bonus applies to the top 2 qualifying members by that stat; extra qualifying members do not stack beyond the best two.",
    },
    {
      title: "Why calculation takes time",
      body: "Full-pool exhaustive search tries ~6 million team combos in your browser. Speed depends on CPU; phones and older PCs may be slower. The button shows progress; PR cache helps a lot. Keep the tab in foreground while calculating.",
    },
  ],
  siteNoticeDontShow: "Don't show again",
  siteNoticeConfirm: "I've read this",
  allowDupSkills: "Allow duplicate active skills",
  allowDupSkillsHint: "Off excludes teams whose active Score UP timing/potency match",
  skillDupWarn: "Duplicate active skills",
  skillDupPair: (a, b) =>
    `${a} and ${b} share the same active Score UP timing (overlaps do not stack)`,
  trackStats: "Total stats",
  trackStatsDesc: "Costume + passives first, then buffed stats — top 8",
  trackCoverage: "Skill coverage",
  trackCoverageDesc: "Costume + passives first, then coverage — top 8",
  trackScore: "Score bonus",
  trackScoreDesc: "Costume + passives first, total score bonus % (active + passive + SP) top 8",
  noTrackTeams: "No teams for this ranking focus.",
  pickTeamDetail: "Select a team on the left to see details.",
  costumeSkill: "Costume skill",
  activated: "On",
  notActivated: "Off",
  activeBonusOn: "Bonus: on",
  activeBonusOff: "Bonus: off",
  activeBonusAssumed: "Bonus: assumed (life/combo)",
  allPassives: "All passives",
  satisfied: "Met",
  notAllSatisfied: "Incomplete",
  avgScoreUp: "Avg Score UP",
  coveragePct: (n) => `Coverage ${n}%`,
  buffedStats: "Buffed stats",
  totalStrength: "Total strength",
  totalStrengthNote: "Excl. Holo member panel, memory cards, enhancement",
  strengthMember: "Member ability",
  strengthCostume: "Costume skill",
  strengthHoloPanel: "Holo member panel",
  strengthPassive: "Passive (stats)",
  strengthPassiveScoreOnly: "Passives here are score bonus only → see Score bonus · Passive",
  panelEffect: "Holo panel",
  panelLine: (unit, roster, value) => `${unit} (${roster}) +${value}`,
  scoreBonus: "Score bonus",
  scoreBonusActive: "Active",
  scoreBonusPassive: "Passive",
  scoreBonusSpecial: "SP",
  scoreBonusNote: "Excl. Holo panel",
  combatPower: "Combat power",
  baseStats: (n) => `Base ${n}`,
  activeSkillCoverage: "Active skill coverage",
  activeSkillGap: "Skill gaps",
  timelineCoverageHint: "Includes CDR · does not affect PR",
  activeIntervalMeta: (interval, duration) => `${interval}s / ${duration}s`,
  activeCoverageGapTotal: (sec) => `${sec}s`,
  timelineMemberSettings: "Timeline settings",
  cooldownReduction: "CDR",
  spStart: "SP at",
  optimizeReductions: "Recommend CDR",
  optimizeReductionsRestore: "Restore CDR",
  spTimelineLabel: "SP skill timeline (1s steps)",
  spBarTitle: (start, duration, pct) => `${start}s +${duration}s · score +${pct}%`,
  timelineGapRow: "Skill gaps",
  timelineSpRow: "SP skills",
  timelineGapDur: (sec) => `${sec.toFixed(1)}s`,
  timelineActiveBar: (scoreUp) => `Score UP ${scoreUp}%`,
  leaderCostume: "Captain costume",
  leader: "Captain",
  memberN: (n) => `Member ${n}`,
  forced: "Locked",
  costumeColon: (name) => `｜Costume: ${name}`,
  activeLine: (interval, duration, scoreUp) =>
    `Active: every ${interval}s / lasts ${duration}s / ${scoreUp}% (treated as always triggering)`,
  passivePrefix: "Passive: ",
  scoreSupport: (n) => ` · Score Support +${n}%`,
  timelineLabel:
    "Effective Score UP timeline (per-second max %, skills assumed always on)",
  activeCoverageSummary: (pct, sec) => `${pct}% covered · ${sec}s gaps`,
  typeCounts: (h, p, c) => `Types: Happy ${h} / Pure ${p} / Cute ${c}`,
  searchMeta: (searched, ms) => `｜ Searched ${searched} teams｜${ms} ms`,
  costumeNeed: (min) => `(costume needs ≥ ${min})`,
  fabTitleNeedLeader: "Choose a captain first",
  fabTitleReady: "Find the best team",
  fabBusy: "Working…",
  fabBusyEstimate: (min) => `Est. ~${min} min`,
  fabBusyProgress: (searched, phase) =>
    `${phase === "baseline" ? "PR baseline" : "Teams"}: ${searched.toLocaleString()} tried`,
  fabRun: "Build team",
  fabPickLeader: "Pick captain",
  alertWantedMax: "You can lock at most 5 wanted members",
  alertNeedLeader: "Please choose a captain first",
  alertOptimizeFailed: "Team optimization failed. Please refresh and try again.",
  alertTooMany: "Captain + wanted members cannot exceed 5. Remove some wanted members.",
  filterAllStars: "All rarities",
  filterAllAttrs: "All attributes",
  filterAttrCount: (n) => `Attrs ×${n}`,
  filterAllGens: "All gens",
  filterGenCount: (n) => `Gens ×${n}`,
  metricPr: (n) => `PR ${n}`,
  metricStats: (n) => `Stats ${n}`,
  metricCoverage: (n) => `Coverage ${n}%`,
  metricAvgUp: (n) => `Avg UP ${n}%`,
  metricScoreBonus: (n) => `Bonus ${n}%`,
  search: "Search",
  searchPlaceholder: "Member / costume / Happy…",
  filterSettings: "Filters",
  showFull: "Show details",
  hideDetails: "Compact",
  compactOnly: "Art + name only",
  fullDetails: "Full card info",
  rarity: "Rarity",
  attribute: "Attribute",
  genGroup: "Generation / group",
  multiSelect: "Multi-select",
  all: "All",
  noMatchingCards: "No cards match these filters.",
  eventPrefix: (name) => `Event｜${name}`,
  eventBadge: "Event",
  performance: "Performance",
  technique: "Technique",
  sense: "Sense",
  total: (n) => `Total ${n}`,
  statTotal: "Total",
  statsMissing: "Stats not listed yet",
  special: "Special",
  active: "Active",
  passive: "Passive",
  attrHappy: "Happy",
  attrPure: "Pure",
  attrCute: "Cute",
  condNone: "No condition (always on)",
  condTypeCount: (attr, min) => `${attr} ≥ ${min}`,
  condUnitCount: (unit, min) => `${unit} ≥ ${min}`,
  explainParamUp: (param, value) => `All ${param} +${value}%`,
  explainScoreSupport: (value) => `All Score Support +${value}%`,
  explainWhen: (cond, effects) => `When ${cond}: ${effects}`,
  gapsNone: "None (full coverage)",
  gapRange: (a, b, dur) => `${a}–${b}s (${dur}s)`,
  gapsJoin: ", ",
  paramPerf: "Performance",
  paramTech: "Technique",
  paramSense: "Sense",
  flagCostumeOn: "Costume ✓",
  flagCostumeOff: "Costume ✗",
  flagPassiveAll: "Passives ✓",
  flagPassiveMiss: "Passives ✗",
  flagStats: (n) => `Stats ${n}`,
  flagCoverage: (n) => `Cover ${n}%`,
  flagUp: (n) => `UP ${n}%`,
  feedbackReport: "Report issue",
  feedbackSuggest: "Suggestion",
  feedbackReportTitle: "Report an issue",
  feedbackSuggestTitle: "Send a suggestion",
  feedbackReportKicker: "Found wrong data or a bug?",
  feedbackSuggestKicker: "Ideas to improve the tool?",
  feedbackReportDesc: "Include card name, page, and what looks wrong. Screenshots help.",
  feedbackSuggestDesc: "Feature, UI, or data ideas are welcome. You can attach screenshots.",
  feedbackClose: "Close",
  feedbackCancel: "Cancel",
  feedbackSubmit: "Submit",
  feedbackSubmitting: "Sending…",
  feedbackSubmitError: "Could not send. Please try again.",
  feedbackDone: "Done",
  feedbackSuccess: "Thanks — we got your message!",
  feedbackSuccessNoteCloud: "Synced to cloud. The author can review it in Supabase.",
  feedbackSuccessNoteLocal:
    "Cloud storage is not configured; saved locally only. Copy or open a GitHub Issue if needed.",
  feedbackSuccessNoteFallback:
    "Cloud sync failed; saved locally. Copy or open a GitHub Issue so the author receives it.",
  feedbackCopy: "Copy text",
  feedbackCopied: "Copied",
  feedbackGithub: "GitHub Issue",
  feedbackLabelCategory: "Category",
  feedbackLabelContext: "Page",
  feedbackLabelMessage: "Message",
  feedbackLabelContact: "Contact (optional)",
  feedbackLabelTime: "Time",
  feedbackSelectPlaceholder: "Select…",
  feedbackReportPlaceholder: "e.g. Wrong passive text on Miko's summer card…",
  feedbackSuggestPlaceholder: "e.g. Export team results as an image…",
  feedbackContactPlaceholder: "Discord / X @handle (optional)",
  feedbackContextGeneral: "Site / other",
  feedbackCatStats: "Stats",
  feedbackCatSkills: "Skill text",
  feedbackCatUi: "UI / display",
  feedbackCatOptimize: "Teams / PR",
  feedbackCatFeature: "New feature",
  feedbackCatData: "Data / art",
  feedbackCatOther: "Other",
  feedbackLabelImages: "Screenshots (optional)",
  feedbackImagesHint: "Up to 3 images. Pick files or paste (Ctrl+V) inside the form.",
  feedbackImagesAdd: "Add image",
  feedbackImagesRemove: (name) => `Remove ${name}`,
  feedbackImagesTooMany: "You can attach at most 3 images.",
  feedbackImagesInvalid: "Could not read that image. Try JPG, PNG, or WebP.",
};

const ja: Messages = {
  brand: "Hololive Dreams 便利ツール",
  brandSub: "制作 108_虎太郎 · ホロドリ補助ツール",
  heroMascotSub: "小悪魔",
  lastUpdated: (date) => `最終更新 ${date}`,
  updateNotesBtn: "更新内容",
  updateNotesTitle: "2026年8月14日 更新",
  updateNotesClose: "閉じる",
  updateNotesItems: [
    "所持編成：★5開花0–5をカードごとに設定（初期0）、wf-calc開花表で最適化・詳細表示",
    "低開花でも満開名片テキスト（SP／A／P）が出る問題を修正",
    "A条件ボーナス・SP発動率が低開花で下がらない問題を修正",
    "開花0–1はステ−10%、開花2以降は満開ステ（ゲーム準拠）",
    "所持メン編成が再読み込み後に計算できない問題を修正（保存データの衝突）",
    "報告フォームで画像添付後に送信ボタンが隠れる問題を修正",
    "キャプテン未選択で計算すると中央に案内を表示",
    "編成を全探索に（全池約600万）、高速パス削除",
    "PR9999基準は必ず全探索、キャッシュがあれば再利用",
    "最強／所持編成どちらもPR9999をキャッシュから表示可能",
    "計算中に試行数を表示",
    "初回利用須知を追加（利用須知から再表示）",
    "5人目のスキル頻度表示を修正",
    "PR算法v3：戦力・文言・キャッシュ整合",
    "分数加乘計算を修正：パッ分数はステ加重のチーム等效%に（5人分の%合算を廃止・PR算法v4）",
    "結果タブ「分数加乘」にアク＋パッ＋SP合計を表示",
    "一部★4キャプ衣装の未表示・カード画像欠落を修正",
    "一部キャラのアクティブスキルが時間軸に反映されない問題を修正（解析ミス）",
    "★5計算を角色名片カタログ準拠に（ステ・スキル・衣装）",
    "パッ条件判定を修正：期生／タイプ人数不足で誤って「発動」表示しない（例：ラミィは5期生2名必要）",
    "パッ分数が0%なのに全員発動表示になる計算ミスを修正",
    "轟はじめ等のアクティブが時間軸に出ない問題を修正（秒ごとに解析）",
  ],
  releaseAnnouncementTitle: "8/14 更新",
  releaseAnnouncementLead:
    "「所持メン編成」に★5開花設定を追加。各★5カードの開花段階に合わせて調整できます。",
  releaseAnnouncementSections: [
    {
      title: "使い方",
      body: "メンバーと所持カードを選んだあと、下の「★5 開花」で0–5を設定（初期0）。「所持メンから編成」で再計算してください。",
    },
  ],
  releaseAnnouncementDontShow: "今後表示しない",
  releaseAnnouncementConfirm: "了解",
  footer: "制作 108_虎太郎 · データ照合：Game8 / AppMedia / Gamerch",
  langAria: "表示言語",
  themeAria: "機能メニュー",
  themeGallery: "キャラ一覧",
  themeGallerySub: "期生ごとにカードを見る",
  themeOptimize: "最強編成",
  themeOptimizeSub: "キャプテン＋固定メンバー最適化",
  themeRoster: "所持メン編成",
  themeRosterSub: "所持★5から編成",
  rosterTitle: (n) => `① 所持メンバー（${n}人）`,
  rosterNote:
    "所持の★5メンバー（イベント含む）を選択。5人以上＋キャプテン。★5が複数いる場合は下で所持分をチェック。PRは最強編成と同じ9999基準。",
  rosterCardPickTitle: "★5所持カード",
  rosterCardPickNote: "所持している★5をすべてチェック（複数可）。編成時に最適な組み合わせを自動選択します。",
  rosterBloomTitle: "★5 開花",
  rosterBloomNote:
    "既定は開花 0（未満開花基準）。カードごとに 5 まで指定。A／SP／P と三围は wf-calc 開花表に準拠。",
  bloomStage: (n) => `開花 ${n}`,
  bloomBadge: (n) => `開${n}`,
  rosterNeedFive: "5人以上必要",
  rosterClear: "選択をクリア",
  alertRosterMin: "所持メンバーを5人以上選んでください。",
  alertRosterCardMin: "各メンバーは★5を1枚以上選んでください。",
  alertRosterWantedNeedOwned: (name) =>
    `${name} は「① 所持メンバー」に未選択です。先に上で選択してから、入れたいメンバーに追加してください。`,
  fabRosterRun: "所持から編成",
  galleryTitle: "キャラ一覧",
  dataNoticeBefore: "表示している数値・スキルはすべて",
  dataNoticeStrong: "満開花・最大レベル",
  dataNoticeAfter: "です。一部の★3／★4はステータス未収録の場合があります。",
  tagline:
    "キャプテンは衣装スキル用。編成5人にキャプテン本人は不要。入れたいメンバーを最大5人まで固定し、残りは自動で埋めます。",
  priority1: "キャプテン衣装スキル",
  priority2: "パッシブ全達成",
  priority3: (sec) => `戦力／PR優先（補助：平均 Score UP・カバー率 · ${sec}秒）`,
  priority4: "バフ後ステータス合計",
  captainTitle: "① キャプテン選択",
  labelGen: "期生 / グループ",
  pickGenFirst: "期生を選ぶ",
  labelMember: "メンバー",
  pickMember: "メンバーを選ぶ",
  pickGenFirstShort: "先に期生を選んでください",
  currentCaptain: "現在のキャプテン",
  songLength: "曲の長さ（秒）",
  costumePick: "キャプテン衣装スキル",
  noCostumeData: "このメンバーの衣装スキルデータはまだありません。",
  conditionLabel: "発動条件",
  conditionUnitHint: (list, min) =>
    `編成5人のうち、${list || "（なし）"} から ${min} 人以上（キャプテン本人は含めなくて可）。`,
  conditionTypeHint: (list, min) =>
    `該当属性カードを持つメンバー：${list || "（なし）"}。必要人数 ${min} 以上。`,
  conditionNone:
    "人数条件はありません。パッシブとスキルカバー率を優先してメンバーを最適化します。",
  wantedTitle: (n) => `② 入れたいメンバー（${n} / 5）`,
  wantedWithLeader: (n) => `｜キャプテン込みで固定 ${n} 人`,
  wantedLocked: (n) => `｜固定 ${n} 人`,
  captainOffTeam: "（編成外）",
  wantedNote:
    "カードをタップして固定（最大5）。キャプテンは衣装のみで編成枠を使いません。固定メンバーは必ず入り、残りを最適化します。",
  rosterWantedNote:
    "所持メンバーからカードをタップして固定（最大5）。キャプテンは衣装のみで編成枠を使いません。固定メンバーは必ず入り、残りは所持プールから補充します。",
  rosterWantedEmpty: "上で所持メンバーを選ぶか、所持★5カードにチェックを入れてください。",
  rosterWantedCollapsedHint: "（任意）タップで展開",
  clearWanted: "固定をクリア",
  removeWantedAria: (name) => `${name} を外す`,
  resultsTitle: "③ 最適編成結果",
  resultsEmptyWithLeader: (name) =>
    `キャプテンは ${name} です。右下の「編成を計算」を押してください。`,
  resultsEmpty: "上でキャプテンと衣装を選んでください。",
  trackAria: "ランキング観点",
  trackOverall: "総合最強",
  trackOverallDesc:
    "衣装＋パッシブ成立時、総合力×分数ボーナス（戦力）を同衣装・指名なし最強編成と比較したPR上位8",
  prBaselineNote:
    "PR＝基準に対する戦力（9999）。総合力＝メンバー能力＋衣装＋パッシブ（ステバフ）；分数ボーナス＝アク＋パッ分数＋SP。Holoパネル・思い出・強化は含まない。",
  prBaselineBtn: "PR 9999",
  prBaselineBtnTitle: "同衣装・指名なし最強編成（PR基準）を表示",
  prBaselineBtnUnavailable: "この衣装のPR基準キャッシュがありません",
  prBaselineBtnNeedCostume: "先にキャプテン衣装を選んでください",
  prBaselineBtnLoading: "PR基準キャッシュを読込中…",
  prBaselineViewBanner:
    "PR9999基準編成 — 同衣装・指名なし・★5＋イベント全池最強",
  calcRulesBtn: "計算ルール",
  calcRulesTitle: "PRと戦力の計算",
  calcRulesClose: "閉じる",
  calcRulesPrTitle: "PRとは？",
  calcRulesPrBody:
    "同じキャプテン衣装で指名なしの最強編成を基準（PR9999）に、他編成の戦力を比例換算（最大9998）。",
  calcRulesCombatTitle: "戦力",
  calcRulesCombatBody: "戦力 ＝ 総合力 ×（1 ＋ 分数ボーナス% ÷ 100）",
  calcRulesStrengthTitle: "総合力",
  calcRulesStrengthBody:
    "ゲーム「隊伍分數詳情」に近い3項目：\n①メンバー能力\n②衣装スキル\n③パッシブ（ステバフのみ）\nHoloメンバーパネル・思い出・強化は含まない。パッ分数サポートは分数ボーナス側。",
  calcRulesBonusTitle: "分数ボーナス",
  calcRulesBonusBody:
    "アク平均 Score UP（必発・確率なし；ライフ／コンボ加碼は達成想定）＋パッ分数＋SP。短縮は時間軸のみ、PRに影響しない。Holo分数パネル除く。",
  calcRulesPanelTitle: "Holo総合力パネル",
  calcRulesPanelBody: "期生人数：5人期 +1500/人、4人期 +1200、3人期 +1350。",
  siteNoticeBtn: "利用須知",
  siteNoticeTitle: "利用須知（必読）",
  siteNoticeLead:
    "編成参考ツールです。以下は度々説明している内容なので、使用前にご確認ください。",
  siteNoticeSections: [
    {
      title: "目的",
      body: "キャプテン衣装指定でPRの高い編成を全探索。PR9999は同衣装・指名なし・★5＋イベント全池の基準（衣装ごとに1組）。",
    },
    {
      title: "並び順 ≠ おすすめ配置",
      body: "曲ごとに得点箇所が異なります。場内順序は計算しません。1～5は識別用で、ゲーム内の推奨位置ではありません。",
    },
    {
      title: "PRに含めないもの",
      body: "Holo青パネル（全員MAX・同加成想定）、思い出カード、メンバー強化。枠配置は三圍特化に影響するため自己判断を。",
    },
    {
      title: "PRとタイムライン",
      body: "戦力＝総合力×分数ボーナス。CDRはタイムラインのみでPRに影響しません。",
    },
    {
      title: "「○期2名以上」系スキル",
      body: "条件を満たす中で該当ステータス上位2名に加成。2名超えても高い方が優先されます。",
    },
    {
      title: "計算が長い理由",
      body: "全池全探索は約600万編成をブラウザで計算します。CPU依存でスマホ・古いPCは遅くなりがち。試行数を表示します。PRキャッシュがあれば高速。計算中はタブを前面に。",
    },
  ],
  siteNoticeDontShow: "今後表示しない",
  siteNoticeConfirm: "読みました",
  allowDupSkills: "同一アクティブスキルを許可",
  allowDupSkillsHint: "OFFにすると Score UP の間隔・倍率などが同じ編成を除外",
  skillDupWarn: "アクティブスキル重複",
  skillDupPair: (a, b) =>
    `${a} と ${b} はアクティブ Score UP のタイミングが同じ（重複は加算されない）`,
  trackStats: "ステータス合計",
  trackStatsDesc: "衣装＋パッシブ優先、バフ後ステ上位8",
  trackCoverage: "スキルカバー率",
  trackCoverageDesc: "衣装＋パッシブ優先、カバー率上位8",
  trackScore: "分数加乘",
  trackScoreDesc: "衣装＋パッシブ前提、分数加乘%（アク＋パッ分数＋SP）上位8",
  noTrackTeams: "この観点の編成はありません。",
  pickTeamDetail: "左の編成を選ぶと詳細を表示します。",
  costumeSkill: "衣装スキル",
  activated: "発動",
  notActivated: "未発動",
  activeBonusOn: "ボーナス：発動",
  activeBonusOff: "ボーナス：未発動",
  activeBonusAssumed: "ボーナス：達成想定（ライフ／コンボ）",
  allPassives: "パッシブ全体",
  satisfied: "達成",
  notAllSatisfied: "未達",
  avgScoreUp: "平均 Score UP",
  coveragePct: (n) => `カバー ${n}%`,
  buffedStats: "バフ後ステ",
  totalStrength: "総合力",
  totalStrengthNote: "Holoメンバーパネル・思い出・強化は含まない",
  strengthMember: "メンバー能力",
  strengthCostume: "衣装スキル",
  strengthHoloPanel: "Holoメンバーパネル",
  strengthPassive: "パッシブ（ステ）",
  strengthPassiveScoreOnly: "分数のみのパッ → 「分数ボーナス・パッ」参照",
  panelEffect: "Holoパネル",
  panelLine: (unit, roster, value) => `${unit}（${roster}人）+${value}`,
  scoreBonus: "分数ボーナス",
  scoreBonusActive: "アク",
  scoreBonusPassive: "パッ",
  scoreBonusSpecial: "SP",
  scoreBonusNote: "Holoパネル除く",
  combatPower: "戦力",
  baseStats: (n) => `基礎 ${n}`,
  activeSkillCoverage: "アクティブカバー率",
  activeSkillGap: "スキル空白期",
  timelineCoverageHint: "短縮込 · PRに影響しない",
  activeIntervalMeta: (interval, duration) => `${interval}秒 / ${duration}秒`,
  activeCoverageGapTotal: (sec) => `${sec} 秒`,
  timelineMemberSettings: "タイムライン設定",
  cooldownReduction: "短縮",
  spStart: "SP開始",
  optimizeReductions: "短縮率おすすめ",
  optimizeReductionsRestore: "短縮率を戻す",
  spTimelineLabel: "SPスキルタイムライン（1秒刻み）",
  spBarTitle: (start, duration, pct) =>
    `${start}秒〜${duration}秒 · スコア +${pct}%`,
  timelineGapRow: "スキル空白",
  timelineSpRow: "SPスキル",
  timelineGapDur: (sec) => `${sec.toFixed(1)}秒`,
  timelineActiveBar: (scoreUp) => `Score UP ${scoreUp}%`,
  leaderCostume: "キャプテン衣装",
  leader: "キャプテン",
  memberN: (n) => `メンバー ${n}`,
  forced: "固定",
  costumeColon: (name) => `｜衣装：${name}`,
  activeLine: (interval, duration, scoreUp) =>
    `Active：${interval}秒ごと / 持続 ${duration}秒 / ${scoreUp}%（計算上は必ず発動）`,
  passivePrefix: "Passive：",
  scoreSupport: (n) => ` · スコアサポート +${n}%`,
  timelineLabel: "有効 Score UP タイムライン（秒ごとに最大％、スキルは常時発動想定）",
  activeCoverageSummary: (pct, sec) => `${pct}% カバー · 空白 ${sec} 秒`,
  typeCounts: (h, p, c) => `タイプ：ハッピー ${h} / ピュア ${p} / キュート ${c}`,
  searchMeta: (searched, ms) => `｜ 探索 ${searched} 組｜所要 ${ms} ms`,
  costumeNeed: (min) => `（衣装条件 ≥ ${min}）`,
  fabTitleNeedLeader: "先にキャプテンを選んでください",
  fabTitleReady: "最適編成を計算",
  fabBusy: "計算中…",
  fabBusyEstimate: (min) => `約${min}分`,
  fabBusyProgress: (searched, phase) =>
    `${phase === "baseline" ? "PR基準" : "編成"}：${searched.toLocaleString()}通り試行`,
  fabRun: "編成を計算",
  fabPickLeader: "キャプテンを選ぶ",
  alertWantedMax: "入れたいメンバーは最大5人までです",
  alertNeedLeader: "先にキャプテンを選んでください",
  alertOptimizeFailed: "編成計算に失敗しました。再読み込みしてお試しください。",
  alertTooMany:
    "キャプテン＋入れたいメンバーは合計5人までです。人数を減らしてください。",
  filterAllStars: "全レアリティ",
  filterAllAttrs: "全属性",
  filterAttrCount: (n) => `属性×${n}`,
  filterAllGens: "全期生",
  filterGenCount: (n) => `期生×${n}`,
  metricPr: (n) => `PR ${n}`,
  metricStats: (n) => `ステ ${n}`,
  metricCoverage: (n) => `カバー ${n}%`,
  metricAvgUp: (n) => `平均UP ${n}%`,
  metricScoreBonus: (n) => `分数加乘 ${n}%`,
  search: "検索",
  searchPlaceholder: "メンバー / 衣装 / ハッピー…",
  filterSettings: "絞り込み",
  showFull: "詳細を表示",
  hideDetails: "簡易表示",
  compactOnly: "カード＋名前のみ",
  fullDetails: "カード情報を全部表示",
  rarity: "レアリティ",
  attribute: "属性",
  genGroup: "期生 / グループ",
  multiSelect: "複数選択可",
  all: "すべて",
  noMatchingCards: "条件に合うカードがありません。",
  eventPrefix: (name) => `イベント｜${name}`,
  eventBadge: "イベント",
  performance: "パフォーマンス",
  technique: "テクニック",
  sense: "センス",
  total: (n) => `合計 ${n}`,
  statTotal: "合計",
  statsMissing: "ステータス未収録",
  special: "スペシャル",
  active: "アクティブ",
  passive: "パッシブ",
  attrHappy: "ハッピー型",
  attrPure: "ピュア型",
  attrCute: "キュート型",
  condNone: "条件なし（入場で発動）",
  condTypeCount: (attr, min) => `${attr} ≥ ${min} 人`,
  condUnitCount: (unit, min) => `${unit} ≥ ${min} 人`,
  explainParamUp: (param, value) => `全員${param} +${value}%`,
  explainScoreSupport: (value) => `全員スコアサポート +${value}%`,
  explainWhen: (cond, effects) => `${cond} のとき：${effects}`,
  gapsNone: "なし（全程カバー）",
  gapRange: (a, b, dur) => `${a}–${b}秒（${dur}秒）`,
  gapsJoin: "、",
  paramPerf: "パフォーマンス",
  paramTech: "テクニック",
  paramSense: "センス",
  flagCostumeOn: "衣装○",
  flagCostumeOff: "衣装×",
  flagPassiveAll: "パッシブ全○",
  flagPassiveMiss: "パッシブ欠",
  flagStats: (n) => `ステ ${n}`,
  flagCoverage: (n) => `カバー ${n}%`,
  flagUp: (n) => `UP ${n}%`,
  feedbackReport: "不具合報告",
  feedbackSuggest: "提案",
  feedbackReportTitle: "不具合報告",
  feedbackSuggestTitle: "提案を送る",
  feedbackReportKicker: "データや機能の問題？",
  feedbackSuggestKicker: "改善のアイデアは？",
  feedbackReportDesc: "カード名・ページ・内容を具体的に。スクショ添付可。",
  feedbackSuggestDesc: "機能・UI・データの提案を歓迎します。スクショ添付可。",
  feedbackClose: "閉じる",
  feedbackCancel: "キャンセル",
  feedbackSubmit: "送信",
  feedbackSubmitting: "送信中…",
  feedbackSubmitError: "送信に失敗しました。もう一度お試しください。",
  feedbackDone: "完了",
  feedbackSuccess: "ありがとうございます。受け付けました。",
  feedbackSuccessNoteCloud: "クラウドに保存しました。作者が Supabase で確認できます。",
  feedbackSuccessNoteLocal:
    "クラウド未設定のため端末内のみ保存。必要ならコピーまたは GitHub Issue をご利用ください。",
  feedbackSuccessNoteFallback:
    "クラウド同期に失敗しました。端末内に保存済み。Issue またはコピーで作者にお知らせください。",
  feedbackCopy: "コピー",
  feedbackCopied: "コピー済み",
  feedbackGithub: "GitHub Issue",
  feedbackLabelCategory: "種類",
  feedbackLabelContext: "ページ",
  feedbackLabelMessage: "内容",
  feedbackLabelContact: "連絡先（任意）",
  feedbackLabelTime: "日時",
  feedbackSelectPlaceholder: "選択…",
  feedbackReportPlaceholder: "例：〇〇のパッシブ文言がゲームと違う…",
  feedbackSuggestPlaceholder: "例：編成結果を画像で出力してほしい…",
  feedbackContactPlaceholder: "Discord / X @handle（任意）",
  feedbackContextGeneral: "全体／その他",
  feedbackCatStats: "ステータス",
  feedbackCatSkills: "スキル文",
  feedbackCatUi: "UI／表示",
  feedbackCatOptimize: "編成／PR",
  feedbackCatFeature: "新機能",
  feedbackCatData: "データ／カード",
  feedbackCatOther: "その他",
  feedbackLabelImages: "画像（任意）",
  feedbackImagesHint: "最大3枚。ファイル選択、またはフォーム内で Ctrl+V 貼り付け。",
  feedbackImagesAdd: "画像を追加",
  feedbackImagesRemove: (name) => `${name} を削除`,
  feedbackImagesTooMany: "画像は最大3枚までです。",
  feedbackImagesInvalid: "画像を読み込めません。JPG／PNG／WebP をお試しください。",
};

export const MESSAGES: Record<Locale, Messages> = { zh, en, ja };

export function isLocale(v: string | null | undefined): v is Locale {
  return v === "zh" || v === "en" || v === "ja";
}
