# 角色名片

遊戲內截圖參考資料，依 **期生順序** 分類（資料夾名前綴 01–54）。
之後網站資料可從這裡整理匯入。

## 資料夾命名

`{序號}_{顯示名}`，例如 `01_時乃空`、`21_常闇永遠`。

- 日本成員：繁中顯示名
- 海外成員：英文顯示名

## 期生順序（54 人）

| # | 資料夾 | 期生 |
|---|--------|------|
| 01 | 時乃空 | 0期生 |
| 02 | 蘿蔔子 | 0期生 |
| 03 | AZKi | 0期生 |
| 04 | 櫻巫女 | 0期生 |
| 05 | 星街彗星 | 0期生 |
| 06 | 亞綺・羅森塔爾 | 1期生 |
| 07 | 赤井心 | 1期生 |
| 08 | 白上吹雪 | 1期生 |
| 09 | 夏色祭 | 1期生 |
| 10 | 百鬼綾目 | 2期生 |
| 11 | 癒月巧可 | 2期生 |
| 12 | 大空昴 | 2期生 |
| 13 | 大神澪 | ゲーマーズ |
| 14 | 貓又小粥 | ゲーマーズ |
| 15 | 戌神沁音 | ゲーマーズ |
| 16 | 兔田佩克拉 | 3期生 |
| 17 | 不知火芙蕾雅 | 3期生 |
| 18 | 白銀諾艾爾 | 3期生 |
| 19 | 寶鐘瑪琳 | 3期生 |
| 20 | 角卷綿芽 | 4期生 |
| 21 | 常闇永遠 | 4期生 |
| 22 | 姬森璐娜 | 4期生 |
| 23 | 雪花菈米 | 5期生 |
| 24 | 桃鈴音音 | 5期生 |
| 25 | 獅白牡丹 | 5期生 |
| 26 | 尾丸波爾卡 | 5期生 |
| 27 | 拉普拉斯·達克尼斯 | holoX |
| 28 | 鷹嶺琉依 | holoX |
| 29 | 博衣小夜璃 | holoX |
| 30 | 風真伊呂波 | holoX |
| 31 | Ayunda Risu | ID1期生 |
| 32 | Moona Hoshinova | ID1期生 |
| 33 | Airani Iofifteen | ID1期生 |
| 34 | Kureiji Ollie | ID2期生 |
| 35 | Anya Melfissa | ID2期生 |
| 36 | Pavolia Reine | ID2期生 |
| 37 | Vestia Zeta | ID3期生 |
| 38 | Kaela Kovalskia | ID3期生 |
| 39 | Kobo Kanaeru | ID3期生 |
| 40 | Mori Calliope | Myth |
| 41 | Takanashi Kiara | Myth |
| 42 | Ninomae Ina'nis | Myth |
| 43 | IRyS | Promise |
| 44 | Ouro Kronii | Promise |
| 45 | Hakos Baelz | Promise |
| 46 | Shiori Novella | Advent |
| 47 | Koseki Bijou | Advent |
| 48 | Nerissa Ravencroft | Advent |
| 49 | Fuwawa Abyssgard | Advent |
| 50 | Mococo Abyssgard | Advent |
| 51 | 音乃瀨奏 | ReGLOSS |
| 52 | 一條莉莉華 | ReGLOSS |
| 53 | 儒烏風亭螺鈿 | ReGLOSS |
| 54 | 轟一 | ReGLOSS |

## 每張卡資料結構

在 `{序號}_{成員}/` 底下，以 **名片左上角卡名** 建子資料夾，固定三張圖：

```
02_蘿蔔子/高性能的勝利手勢/
  1.名片.png   ← 角色卡面三圍／育成畫面
  2.技能.png   ← SP / Active / Passive 技能詳情
  3.衣裝.png   ← 隊長衣裝／服裝技能效果
  3.衣裝-2.png ← 衣裝技能太長時的第 2 張（可繼續 -3、-4…）
```

範例：`01_時乃空/一心描繪的彩虹之歌/`（同上三檔）。

## 一鍵整理（本機）

**推薦：圖形介面**

雙擊 `角色名片/開啟整理工具.bat` → 瀏覽器會開啟整理頁面。

或終端機：`npm run card-organizer`

**進階：收件匣模式**

1. 截圖放進 `_待整理/{成員}/{卡名}/`，命名 `1.png`、`2.png`、`3.png`
2. 執行 `npm run organize-cards`（或整理工具裡的「整理收件匣」）

詳見 `_待整理/README.txt`。

重建空資料夾（**會清空此目錄全部內容**）：

```bash
node scripts/initCharacterCardFolders.mjs
```
