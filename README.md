# 🧩 Claude Code Skills — by Ting Jia

一些我自己在用、覺得挺實用的 [Claude Code](https://claude.com/claude-code) skill，整理出來開源分享，希望對你也有點幫助 🙂

有做出還算順手的，會再陸續補上。目前收錄：

| Skill | 一句話 |
|---|---|
| **study-notes** | 做完作業/專案後，自動整理成結構化複習筆記（四檔資料夾 or HackMD 單檔） |
| **zh-typography** | 校對繁體中文文件的標點與排版：全形/半形、盤古之白、引號、破折號的一致性 |

## 這是什麼

Claude Code 的 **skill** 是一份寫給 Claude 的「什麼情境、該怎麼做某件事」的說明書。裝好後，只要講到對應情境，Claude 就會自動照著做，不用每次重講。

## 安裝

每個 skill 就是一個資料夾。把想要的那個複製到你的個人 skills 目錄即可：

```bash
git clone https://github.com/builtbyjia/jia-skills.git
cp -R jia-skills/study-notes ~/.claude/skills/
cp -R jia-skills/zh-typography ~/.claude/skills/
```

重開 Claude Code 就生效。想確認，輸入 `/` 看 skill 清單裡有沒有它。

> 只想要其中一兩個？複製那幾個資料夾就好，不必全裝。

## Skill 說明

### study-notes

做完一份作業/專案後，把它整理成可長期回顧的結構化筆記，避免「寫完就忘」。

- **觸發**：講「作業寫完了/幫我建複習筆記/整理這份作業重點/做成 HackMD」之類就會啟動。
- **會先問你要哪種格式**：
  - **四檔資料夾** — README 索引 + 總覽流程圖 + 知識點速查 + 錯誤筆記，適合在 VS Code / GitHub 看。
  - **HackMD 單檔** — 一份可貼進 HackMD 的合併 `.md`，自帶 `[TOC]` 目錄，可搭配書本目錄。
  - **兩者都建**。
- **通用**：不限技術，任何課程/語言/框架的作業都能用。

### zh-typography

校對與修正繁體中文文件的標點與排版。核心是一條容易搞錯的原則：標點的全形/半形由「句子的主體語言」決定，中文句子的句讀一律全形，即使緊鄰英文詞或程式碼。

- **觸發**：寫或改繁中 README、文件、自傳、履歷、作品集文案，或講「幫我檢查標點」「全形半形」「排版跑掉了」「中英文之間要不要空格」之類就會啟動。
- **管什麼**：全形/半形標點、盤古之白（中英數之間的半形空格）、引號「」、破折號——、刪節號……的一致性。
- **附一支選用腳本** `scripts/convert_punctuation.py`，能批次把緊鄰中文的半形句讀粗轉全形（會跳過程式碼區塊，仍需人工複查）。

## 🔒 安全說明（給要安裝的你）

skill 只是「給 Claude 的文字指示」，你隨時打開 `SKILL.md` 就看得到全部內容——**裝之前先讀一遍**是好習慣。

本 repo 的 skill 以 **markdown** 為主（study-notes、zh-typography 另含 `references/` 說明文件）。其中 **zh-typography 附一支選用的 Python 腳本**（`scripts/convert_punctuation.py`）——它**只在你或 Claude 明確呼叫時才執行**，不會自動跑、也不是 hook，用途是批次粗轉標點；裝之前一樣可以先讀它一遍。除此之外**不含**任何會自動執行的腳本或 hooks。

## 貢獻

歡迎！請看 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 授權

[MIT](./LICENSE) — 自由使用、修改、分享。
