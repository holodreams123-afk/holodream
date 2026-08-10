/**
 * Build 角色名片/card-catalog.json from verified screenshot extractions.
 * Stats cross-checked against gameData.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import gameData from "../src/data/gameData.json" with { type: "json" };
import zhTitles from "../tools/card-organizer/data/zhTitles.json" with { type: "json" };
import { CHARACTER_CARD_ROOT } from "./characterCardFolders.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_JSON = path.join(CHARACTER_CARD_ROOT, "card-catalog.json");
const OUT_MD = path.join(CHARACTER_CARD_ROOT, "card-catalog.md");

/** @type {import('../src/types.ts').CardStats} */
function statsFromGame(cardId) {
  const card = gameData.cards.find((c) => c.id === cardId);
  return card?.stats ?? null;
}

function cardIdFromZh(zhName) {
  return Object.entries(zhTitles).find(([, v]) => v === zhName)?.[0] ?? null;
}

/** @type {object[]} */
const catalog = [
  { no: "01", member: "時乃空", card: "一心描繪的彩虹之歌", skills: { sp: "在 10 秒內分數加成效果160%", active: "每 24 秒以中機率在 10 秒內分數提升100%", passive: "若編入2名以上0期生自己的全能力提升33%" }, costumeSkill: "若編入2名以上0期生全體成員的全能力提升50%" },
  { no: "02", member: "蘿蔔子", card: "高性能的勝利手勢", skills: { sp: "在 10 秒內分數加成效果145%且生命值1000以上時技能發動機率提升55%", active: "每 18 秒以高機率在 8 秒內分數提升90%", passive: "2名 快樂類型 的分數加成效果11%" }, costumeSkill: "若編入2名以上 快樂類型 的人物全體成員的表現力提升130%" },
  { no: "03", member: "AZKi", card: "盛開綻放的專情之花", skills: { sp: "在 10 秒內分數加成效果145%技能發動機率提升50%", active: "每 20 秒以高機率在 7 秒內分數提升60% 生命值600以上時分數提升120%", passive: "2名0期生的品味提升43%" }, costumeSkill: "全體成員的品味提升120%" },
  { no: "04", member: "櫻巫女", card: "在海灘上炸裂的閃耀射擊！", skills: { sp: "在 11 秒內分數加成效果145%", active: "每 27 秒以中機率在 10 秒內分數提升115%", passive: "若編入2名以上 清純類型 的人物2名 清純類型 的表現力提升43%" }, costumeSkill: "若編入2名以上 清純類型 的人物全體成員的表現力提升80% 若編入2名以上 清純類型 的人物全體成員的分數加成效果25%" },
  { no: "04", member: "櫻巫女", card: "櫻花Bloom", skills: { sp: "在 10 秒內分數加成效果145%技能發動機率提升50%", active: "每 15 秒以中機率在 6 秒內分數提升55% 40Combo以上時分數提升110%", passive: "2名 快樂類型 的分數加成效果11%" }, costumeSkill: "全體成員的品味提升120%" },
  { no: "05", member: "星街彗星", card: "劃過夏天的閃光！水槍演奏的琶音", skills: { sp: "在 12 秒內分數加成效果120%且若編入2名以上0期生技能發動機率提升45%", active: "每 23 秒以中機率在 8 秒內分數提升120%", passive: "若編入2名以上0期生2名0期生的分數加成效果12%" }, costumeSkill: "若編入2名以上0期生全體成員的品味提升135%" },
  { no: "05", member: "星街彗星", card: "擄獲人心的Comet Tune", skills: { sp: "在 10 秒內分數加成效果145%技能發動機率提升50%", active: "每 29 秒以高機率在 10 秒內分數提升60% 生命值600以上時分數提升120%", passive: "2名 清純類型 的技巧提升41%" }, costumeSkill: "全體成員的技巧提升120%" },
  { no: "06", member: "亞綺・羅森塔爾", card: "帶有豔麗氣質的半精靈", skills: { sp: "在 10 秒內分數加成效果145%技能發動機率提升50%", active: "每 21 秒以中機率在 8 秒內分數提升55% 生命值600以上時分數提升115%", passive: "2名1期生的品味提升43%" }, costumeSkill: "全體成員的品味提升120%" },
  { no: "07", member: "赤井心", card: "let's freestyle 點心時間", skills: { sp: "在 12 秒內分數加成效果135%", active: "每 19 秒以中機率在 7 秒內分數提升60% 40Combo以上時分數提升120%", passive: "2名 清純類型 的分數加成效果11%" }, costumeSkill: "全體成員的技巧提升120%" },
  { no: "08", member: "白上吹雪", card: "在狐狸神社咚咚咚", skills: { sp: "在 14 秒內分數加成效果115%", active: "每 30 秒以高機率在 11 秒內分數提升110%", passive: "若編入2名以上1期生1期生的表現力提升45%" }, costumeSkill: "若編入2名以上1期生全體成員的全能力提升50%" },
  { no: "09", member: "夏色祭", card: "活力滿滿的開朗啦啦隊隊長", skills: { sp: "在 11 秒內分數加成效果145%", active: "每 23 秒以高機率在 8 秒內分數提升60% 生命值600以上時分數提升120%", passive: "2名1期生的表現力提升43%" }, costumeSkill: "全體成員的表現力提升120%" },
  { no: "10", member: "百鬼綾目", card: "隱世中的悠哉自在、隨心所欲的提燈", skills: { sp: "在 10 秒內分數加成效果160%", active: "每 29 秒以高機率在 10 秒內分數提升60% 若編入2名以上 清純類型 的人物分數提升120%", passive: "2名 清純類型 的表現力提升41%" }, costumeSkill: "全體成員的分數加成效果60%" },
  { no: "11", member: "癒月巧可", card: "被惡魔般的魅惑玩弄於股掌之中", skills: { sp: "在 10 秒內分數加成效果160%", active: "每 20 秒以中機率在 7 秒內分數提升120%", passive: "2名 快樂類型 的分數加成效果11%" }, costumeSkill: "若編入2名以上 快樂類型 的人物全體成員的全能力提升30% 若編入2名以上 快樂類型 的人物全體成員的分數加成效果25%" },
  { no: "12", member: "大空昴", card: "Energetic水花！", skills: { sp: "在 10 秒內分數加成效果160%", active: "每 17 秒以中機率在 7 秒內分數提升55% 40Combo以上時分數提升105%", passive: "2名 清純類型 的全能力提升15%" }, costumeSkill: "全體成員的分數加成效果60%" },
  { no: "12", member: "大空昴", card: "呱呱嬉鬧的鴨鴨午後", skills: { sp: "在 12 秒內分數加成效果120%技能發動機率提升40%", active: "每 34 秒以高機率在 12 秒內分數提升115%", passive: "若編入2名以上2期生2名2期生的表現力提升45%" }, costumeSkill: "若編入2名以上2期生全體成員的全能力提升50%" },
  { no: "13", member: "大神澪", card: "放鬆沉醉的nightscape", skills: { sp: "在 14 秒內分數加成效果115%", active: "每 27 秒以高機率在 9 秒內分數提升120%", passive: "若編入2名以上GAMERS2名GAMERS的分數加成效果12%" }, costumeSkill: "若編入2名以上GAMERS全體成員的全能力提升50%" },
  { no: "14", member: "貓又小粥", card: "宴會結束後的秘密嬉戲", skills: { sp: "在 10 秒內分數加成效果160%", active: "每 25 秒以中機率在 10 秒內分數提升55% 生命值600以上時分數提升110%", passive: "2名 可愛類型 的技巧提升41%" }, costumeSkill: "全體成員的技巧提升120%" },
  { no: "15", member: "戌神沁音", card: "Go！Go！Laughing Skater", skills: { sp: "在 10 秒內分數加成效果145%且100Combo以上時技能發動機率提升55%", active: "每 17 秒以中機率在 6 秒內分數提升120%", passive: "2名 快樂類型 的分數加成效果11%" }, costumeSkill: "若編入2名以上 快樂類型 的人物全體成員的品味提升130%" },
  { no: "16", member: "兔田佩克拉", card: "魅力滿溢的兔子領域", skills: { sp: "在 14 秒內分數加成效果115%", active: "每 30 秒以中機率在 12 秒內分數提升105%", passive: "若編入2名以上 可愛類型 的人物自己的全能力提升32%" }, costumeSkill: "若編入2名以上 可愛類型 的人物全體成員的全能力提升30% 若編入2名以上 可愛類型 的人物全體成員的分數加成效果25%" },
  { no: "17", member: "不知火芙蕾雅", card: "sparks sunset", skills: { sp: "在 12 秒內分數加成效果120%技能發動機率提升40%", active: "每 33 秒以高機率在 11 秒內分數提升60% 若編入2名以上 快樂類型 的人物分數提升125%", passive: "2名 快樂類型 的分數加成效果11%" }, costumeSkill: "若編入2名以上 快樂類型 的人物全體成員的技巧提升80% 若編入2名以上 快樂類型 的人物全體成員的分數加成效果25%" },
  { no: "17", member: "不知火芙蕾雅", card: "半精靈隨風擺動的座艙", skills: { sp: "在 10 秒內分數加成效果145%技能發動機率提升50%", active: "每 26 秒以高機率在 9 秒內分數提升60% 40Combo以上時分數提升120%", passive: "2名3期生的表現力提升43%" }, costumeSkill: "全體成員的表現力提升120%" },
  { no: "18", member: "白銀諾艾爾", card: "帶著清新氣息的溫和騎士", skills: { sp: "在 10 秒內分數加成效果160%", active: "每 19 秒以中機率在 7 秒內分數提升60% 若編入2名以上 快樂類型 的人物分數提升120%", passive: "若編入2名以上 快樂類型 的人物自己的全能力提升32%" }, costumeSkill: "全體成員的分數加成效果60%" },
  { no: "18", member: "白銀諾艾爾", card: "披著浪花的慵懶愜意Knight", skills: { sp: "在 12 秒內分數加成效果120%且若編入2名以上3期生技能發動機率提升45%", active: "每 21 秒以高機率在 7 秒內分數提升120%", passive: "若編入2名以上3期生2名3期生的分數加成效果12%" }, costumeSkill: "若編入2名以上3期生全體成員的表現力提升135%" },
  { no: "19", member: "寶鐘瑪琳", card: "充滿妖豔氣息的海洋藍", skills: { sp: "在 12 秒內分數加成效果120%技能發動機率提升40%", active: "每 23 秒以高機率在 8 秒內分數提升115%", passive: "若編入2名以上3期生2名3期生的分數加成效果12%" }, costumeSkill: "若編入2名以上3期生全體成員的全能力提升50%" },
  { no: "20", member: "角卷綿芽", card: "Woolly Smile Festival", skills: { sp: "在 11 秒內分數加成效果145%", active: "每 15 秒以中機率在 6 秒內分數提升55% 若編入2名以上 可愛類型 的人物分數提升110%", passive: "2名 可愛類型 的分數加成效果11%" }, costumeSkill: "全體成員的全能力提升45%" },
  { no: "20", member: "角卷綿芽", card: "盛夏的毛茸茸漂浮時光", skills: { sp: "在 11 秒內分數加成效果130%技能發動機率提升45%", active: "每 35 秒以高機率在 12 秒內分數提升60% 若編入2名以上 快樂類型 的人物分數提升120%", passive: "2名 快樂類型 的分數加成效果11%" }, costumeSkill: "若編入2名以上 快樂類型 的人物全體成員的品味提升80% 若編入2名以上 快樂類型 的人物全體成員的分數加成效果25%" },
  { no: "21", member: "常闇永遠", card: "玩到根本停不下來的放鬆夜遊", skills: { sp: "在 10 秒內分數加成效果145%技能發動機率提升50%", active: "每 19 秒以高機率在 8 秒內分數提升95%", passive: "若編入2名以上4期生2名4期生的品味提升45%" }, costumeSkill: "若編入2名以上4期生全體成員的全能力提升50%" },
  { no: "22", member: "姬森璐娜", card: "向公主效忠的午後", skills: { sp: "在 14 秒內分數加成效果115%", active: "每 29 秒以高機率在 10 秒內分數提升60% 40Combo以上時分數提升120%", passive: "2名4期生的技巧提升43%" }, costumeSkill: "全體成員的技巧提升120%" },
  { no: "23", member: "雪花菈米", card: "害怕寂寞的雪夜千金", skills: { sp: "在 12 秒內分數加成效果120%技能發動機率提升40%", active: "每 23 秒以高機率在 8 秒內分數提升115%", passive: "若編入2名以上5期生自己的全能力提升33%" }, costumeSkill: "若編入2名以上5期生全體成員的全能力提升50%" },
  { no: "24", member: "桃鈴音音", card: "一起唱吧！純真節奏", skills: { sp: "在 11 秒內分數加成效果145%", active: "每 26 秒以高機率在 9 秒內分數提升60% 生命值600以上時分數提升120%", passive: "2名 可愛類型 的分數加成效果11%" }, costumeSkill: "全體成員的表現力提升120%" },
  { no: "25", member: "獅白牡丹", card: "奪人目光的神級瞄準！lion's hunt", skills: { sp: "在 10 秒內分數加成效果160%", active: "每 27 秒以高機率在 9 秒內分數提升60% 若編入2名以上 快樂類型 的人物分數提升125%", passive: "若編入2名以上 快樂類型 的人物2名 快樂類型 的表現力提升43%" }, costumeSkill: "全體成員的全能力提升45%" },
  { no: "26", member: "尾丸波爾卡", card: "變幻自如！波爾卡馬戲團開演！", skills: { sp: "在 10 秒內分數加成效果145%技能發動機率提升50%", active: "每 21 秒以中機率在 8 秒內分數提升55% 若編入2名以上 快樂類型 的人物分數提升115%", passive: "2名 快樂類型 的分數加成效果11%" }, costumeSkill: "全體成員的全能力提升45%" },
  { no: "27", member: "拉普拉斯·達克尼斯", card: "作戰開始！展現總帥的能力", skills: { sp: "在 12 秒內分數加成效果135%", active: "每 18 秒以中機率在 6 秒內分數提升125%", passive: "若編入2名以上holoX自己的全能力提升33%" }, costumeSkill: "若編入2名以上holoX全體成員的全能力提升50%" },
  { no: "28", member: "鷹嶺琉依", card: "支撐組織的超強幹練幹部", skills: { sp: "在 14 秒內分數加成效果115%", active: "每 21 秒以中機率在 8 秒內分數提升55% 若編入2名以上 可愛類型 的人物分數提升115%", passive: "若編入2名以上 可愛類型 的人物自己的全能力提升32%" }, costumeSkill: "全體成員的全能力提升45%" },
  { no: "29", member: "博衣小夜璃", card: "緊緊抓住助手君內心的LIVE", skills: { sp: "在 10 秒內分數加成效果145%且生命值1000以上時技能發動機率提升55%", active: "每 23 秒以高機率在 8 秒內分數提升115%", passive: "若編入2名以上 清純類型 的人物2名 清純類型 的品味提升43%" }, costumeSkill: "若編入2名以上 清純類型 的人物全體成員的全能力提升30% 若編入2名以上 清純類型 的人物全體成員的分數加成效果25%" },
  { no: "30", member: "風真伊呂波", card: "竹林鏗鏘！一刀兩斷", skills: { sp: "在 10 秒內分數加成效果145%且生命值1000以上時技能發動機率提升55%", active: "每 30 秒以高機率在 11 秒內分數提升110%", passive: "2名 可愛類型 的分數加成效果11%" }, costumeSkill: "若編入2名以上 可愛類型 的人物全體成員的技巧提升130%" },
  { no: "31", member: "Ayunda Risu", card: "策劃惡作劇的斑駁光影之森", skills: { sp: "在 12 秒內分數加成效果120%且生命值1000以上時技能發動機率提升45%", active: "每 34 秒以高機率在 15 秒內分數提升90%", passive: "2名 快樂類型 的分數加成效果11%" }, costumeSkill: "若編入2名以上 快樂類型 的人物全體成員的技巧提升130%" },
  { no: "32", member: "Moona Hoshinova", card: "Lunar Songstress", skills: { sp: "在 12 秒內分數加成效果120%技能發動機率提升40%", active: "每 30 秒以高機率在 11 秒內分數提升110%", passive: "若編入2名以上ID1期生2名ID1期生的品味提升45%" }, costumeSkill: "若編入2名以上ID1期生全體成員的全能力提升50%" },
  { no: "33", member: "Airani Iofifteen", card: "陽光灑落的Cosmos Palette", skills: { sp: "在 10 秒內分數加成效果145%且100Combo以上時技能發動機率提升55%", active: "每 17 秒以中機率在 6 秒內分數提升120%", passive: "2名 清純類型 的技巧提升41%" }, costumeSkill: "若編入2名以上 清純類型 的人物全體成員的技巧提升130%" },
  { no: "34", member: "Kureiji Ollie", card: "Z nonstop talker", skills: { sp: "在 12 秒內分數加成效果135%", active: "每 25 秒以中機率在 10 秒內分數提升55% 若編入2名以上 清純類型 的人物分數提升110%", passive: "2名 清純類型 的分數加成效果11%" }, costumeSkill: "全體成員的全能力提升45%" },
  { no: "35", member: "Anya Melfissa", card: "窩在沙發上放鬆玩遊戲", skills: { sp: "在 14 秒內分數加成效果115%", active: "每 24 秒以中機率在 10 秒內分數提升100%", passive: "若編入2名以上ID2期生自己的全能力提升33%" }, costumeSkill: "若編入2名以上ID2期生全體成員的全能力提升50%" },
  { no: "36", member: "Pavolia Reine", card: "與假正經孔雀細品一杯", skills: { sp: "在 10 秒內分數加成效果160%", active: "每 29 秒以高機率在 10 秒內分數提升60% 若編入2名以上 快樂類型 的人物分數提升120%", passive: "2名 快樂類型 的技巧提升41%" }, costumeSkill: "全體成員的分數加成效果60%" },
  { no: "37", member: "Vestia Zeta", card: "向陽處、貓咪與成員們", skills: { sp: "在 14 秒內分數加成效果115%", active: "每 25 秒以高機率在 11 秒內分數提升90%", passive: "若編入2名以上ID3期生自己的全能力提升33%" }, costumeSkill: "若編入2名以上ID3期生全體成員的全能力提升50%" },
  { no: "38", member: "Kaela Kovalskia", card: "在鍛造場磨練堅強內心", skills: { sp: "在 12 秒內分數加成效果135%", active: "每 19 秒以中機率在 7 秒內分數提升60% 若編入2名以上 可愛類型 的人物分數提升120%", passive: "2名 可愛類型 的技巧提升41%" }, costumeSkill: "全體成員的分數加成效果60%" },
  { no: "39", member: "Kobo Kanaeru", card: "雨過天晴的歡喜薩滿", skills: { sp: "在 12 秒內分數加成效果135%", active: "每 15 秒以中機率在 6 秒內分數提升55% 若編入2名以上 清純類型 的人物分數提升110%", passive: "若編入2名以上 清純類型 的人物自己的全能力提升32%" }, costumeSkill: "全體成員的全能力提升45%" },
  { no: "40", member: "Mori Calliope", card: "Reaper's death flow", skills: { sp: "在 12 秒內分數加成效果120%技能發動機率提升40%", active: "每 33 秒以高機率在 11 秒內分數提升120%", passive: "若編入2名以上Myth2名Myth的分數加成效果12%" }, costumeSkill: "若編入2名以上Myth全體成員的全能力提升50%" },
  { no: "41", member: "Takanashi Kiara", card: "Lovely Phoenix小餐車", skills: { sp: "在 10 秒內分數加成效果145%且100Combo以上時技能發動機率提升55%", active: "每 23 秒以高機率在 8 秒內分數提升115%", passive: "2名 可愛類型 的分數加成效果11%" }, costumeSkill: "若編入2名以上 可愛類型 的人物全體成員的表現力提升130%" },
  { no: "42", member: "Ninomae Ina'nis", card: "暖暖補充能量的片刻", skills: { sp: "在 14 秒內分數加成效果115%", active: "每 32 秒以高機率在 14 秒內分數提升45% 若編入2名以上 清純類型 的人物分數提升95%", passive: "若編入2名以上 清純類型 的人物自己的全能力提升32%" }, costumeSkill: "全體成員的分數加成效果60%" },
  { no: "43", member: "IRyS", card: "nephilim sonority", skills: { sp: "在 10 秒內分數加成效果145%且生命值1000以上時技能發動機率提升55%", active: "每 25 秒以中機率在 11 秒內分數提升95%", passive: "2名Promise的技巧提升43%" }, costumeSkill: "若編入2名以上Promise全體成員的全能力提升50%" },
  { no: "44", member: "Ouro Kronii", card: "典獄長低語的Clock Tower", skills: { sp: "在 14 秒內分數加成效果115%", active: "每 33 秒以高機率在 12 秒內分數提升55% 若編入2名以上 可愛類型 的人物分數提升115%", passive: "2名 可愛類型 的品味提升41%" }, costumeSkill: "全體成員的分數加成效果60%" },
  { no: "45", member: "Hakos Baelz", card: "Chaotic Powerful Rat", skills: { sp: "在 12 秒內分數加成效果135%", active: "每 25 秒以高機率在 11 秒內分數提升90%", passive: "2名 清純類型 的分數加成效果11%" }, costumeSkill: "若編入2名以上 清純類型 的人物全體成員的表現力提升130%" },
  { no: "46", member: "Shiori Novella", card: "在書庫中孕育的探究心", skills: { sp: "在 10 秒內分數加成效果145%技能發動機率提升50%", active: "每 32 秒以高機率在 11 秒內分數提升60% 40Combo以上時分數提升120%", passive: "2名Advent的表現力提升43%" }, costumeSkill: "全體成員的表現力提升120%" },
  { no: "47", member: "Koseki Bijou", card: "亮晶晶的Crystal place", skills: { sp: "在 10 秒內分數加成效果145%技能發動機率提升50%", active: "每 27 秒以中機率在 9 秒內分數提升65% 40Combo以上時分數提升130%", passive: "2名 清純類型 的分數加成效果11%" }, costumeSkill: "全體成員的品味提升120%" },
  { no: "48", member: "Nerissa Ravencroft", card: "在歌聲中搖曳的夜曲", skills: { sp: "在 12 秒內分數加成效果135%", active: "每 15 秒以中機率在 7 秒內分數提升90%", passive: "若編入2名以上Advent自己的全能力提升33%" }, costumeSkill: "若編入2名以上Advent全體成員的全能力提升50%" },
  { no: "49", member: "Fuwawa Abyssgard", card: "蓬鬆甜甜圈派對 ♪", skills: { sp: "在 10 秒內分數加成效果145%技能發動機率提升50%", active: "每 20 秒以中機率在 8 秒內分數提升55% 40Combo以上時分數提升110%", passive: "2名 可愛類型 的技巧提升41%" }, costumeSkill: "全體成員的技巧提升120%" },
  { no: "50", member: "Mococo Abyssgard", card: "悠閒愜意的甜甜圈派對 ♪", skills: { sp: "在 11 秒內分數加成效果130%且100Combo以上時技能發動機率提升50%", active: "每 25 秒以高機率在 8 秒內分數提升125%", passive: "2名 可愛類型 的分數加成效果11%" }, costumeSkill: "若編入2名以上 可愛類型 的人物全體成員的品味提升130%" },
  { no: "51", member: "音乃瀨奏", card: "在遊行中傳遞笑容", skills: { sp: "在 10 秒內分數加成效果145%且100Combo以上時技能發動機率提升55%", active: "每 27 秒以高機率在 12 秒內分數提升90%", passive: "2名ReGLOSS的品味提升43%" }, costumeSkill: "若編入2名以上 清純類型 的人物全體成員的品味提升130%" },
  { no: "51", member: "音乃瀨奏", card: "笑容交織的旋律乘海風飛揚", skills: { sp: "在 14 秒內分數加成效果115%", active: "每 23 秒以中機率在 8 秒內分數提升120%", passive: "若編入2名以上 快樂類型 的人物2名 快樂類型 的表現力提升43%" }, costumeSkill: "若編入2名以上 快樂類型 的人物全體成員的表現力提升130%" },
  { no: "52", member: "一條莉莉華", card: "深夜喘口氣，CEO的極限料理", skills: { sp: "在 12 秒內分數加成效果135%", active: "每 30 秒以高機率在 11 秒內分數提升110%", passive: "若編入2名以上ReGLOSS2名ReGLOSS的表現力提升45%" }, costumeSkill: "若編入2名以上ReGLOSS全體成員的全能力提升50%" },
  { no: "53", member: "儒烏風亭螺鈿", card: "點亮智慧，走進藝術", skills: { sp: "在 10 秒內分數加成效果145%技能發動機率提升50%", active: "每 22 秒以高機率在 8 秒內分數提升55% 生命值600以上時分數提升115%", passive: "2名ReGLOSS的品味提升43%" }, costumeSkill: "全體成員的品味提升120%" },
  { no: "54", member: "轟一", card: "少女感番長的分享", skills: { sp: "在 10 秒內分數加成效果145%技能發動機率提升50%", active: "每 26 秒以高機率在 9 秒內分數提升60% 40Combo以上時分數提升120%", passive: "2名 可愛類型 的表現力提升41%" }, costumeSkill: "全體成員的表現力提升120%" },
];

for (const row of catalog) {
  row.cardId = cardIdFromZh(row.card);
  row.stats = statsFromGame(row.cardId);
  if (!row.stats) console.warn("Missing stats:", row.card);
}

if (catalog.length !== 61) throw new Error(`Expected 61 cards, got ${catalog.length}`);

fs.writeFileSync(OUT_JSON, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");

const lines = [
  "# 角色名片完整資料表",
  "",
  "共 **61** 張 ★5 卡（54 常駐 + 7 活動第二卡）。三圍為 Lv80／特訓4／綻放滿狀態最大值。",
  "",
  "| # | 成員 | 卡名 | 總計 | 表現力 | 技巧 | 品味 | SP | Active | Passive | 衣裝技能 |",
  "|---|------|------|-----:|-------:|-----:|-----:|----|--------|---------|----------|",
];

for (const r of catalog) {
  const s = r.stats;
  lines.push(
    `| ${r.no} | ${r.member} | ${r.card} | ${s.total} | ${s.performance} | ${s.technique} | ${s.sense} | ${r.skills.sp} | ${r.skills.active} | ${r.skills.passive} | ${r.costumeSkill} |`,
  );
}

lines.push("", "## 備註", "", "- 屬性類型圖示（快樂／清純／可愛）在遊戲中以 icon 顯示，表中僅保留文字。", "");

fs.writeFileSync(OUT_MD, lines.join("\n"), "utf8");
console.log("Wrote", OUT_JSON);
console.log("Wrote", OUT_MD);

await import("./syncCardCatalog.mjs");
