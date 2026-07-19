#!/usr/bin/env node
/**
 * 繁中標點粗轉工具：把「緊鄰中文字的半形句讀」批次轉全形。
 *
 * 這是加速器，不是判斷者。純規則無法理解「句子的主體語言」，只能用
 * 「符號緊鄰中文字」這個近似條件，因此有兩個已知侷限，跑完務必人工複查：
 *
 *   1. 夾在行內 `code` 兩側的正文標點（左右是反引號、不是中文字）會被漏掉，
 *      例如 `合併 `.md`,自帶` 的那個逗號，需手動改成全形。
 *   2. 它不判斷主體語言，只看鄰接字元；極少數「中文句子裡整段英文」的個案
 *      可能誤轉，需人工回退。
 *
 * 程式碼區塊（``` 圍住）整段跳過，不會動到程式碼。
 *
 * 用法：
 *     node convert_punctuation.js file.md
 *     node convert_punctuation.js "docs/*.md"        # 記得加引號，讓程式自己展開 glob
 *     node convert_punctuation.js file.md --dry-run   # 只報告不寫入
 */

const fs = require('node:fs');

// 涵蓋常見中日韓字元與全形標點，作為「這是中文字」的判斷依據
const CJK = '一-鿿㐀-䶿＀-￯　-〿「」『』、，。：；？！（）';

// 半形 → 全形的句讀對照（不含括號，括號需成對處理，另行判斷風險較高，交給人工）
const PAIRS = [
  [',', '，'],
  [';', '；'],
  [':', '：'],
  ['?', '？'],
  ['!', '！'],
];

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** 把一行裡緊鄰中文字的半形句讀轉全形。 */
function convertLine(line) {
  for (const [half, full] of PAIRS) {
    const h = escapeRegExp(half);
    // 前面是中文字
    line = line.replace(new RegExp(`(?<=[${CJK}])${h}`, 'g'), full);
    // 後面是中文字
    line = line.replace(new RegExp(`${h}(?=[${CJK}])`, 'g'), full);
  }
  return line;
}

/** 回傳 [轉換後文字, 變更的行數]。程式碼區塊整段跳過。 */
function process_(text) {
  const out = [];
  let inFence = false;
  let changed = 0;
  for (const raw of text.split('\n')) {
    if (raw.trimStart().startsWith('```')) {
      inFence = !inFence;
      out.push(raw);
      continue;
    }
    const line = inFence ? raw : convertLine(raw);
    if (line !== raw) changed += 1;
    out.push(line);
  }
  return [out.join('\n'), changed];
}

function main() {
  const argv = process.argv.slice(2);
  const dryRun = argv.includes('--dry-run');
  const patterns = argv.filter((a) => a !== '--dry-run');

  if (patterns.length === 0) {
    console.error('用法：node convert_punctuation.js <檔案或 glob> [--dry-run]');
    return 1;
  }

  const files = [];
  for (const p of patterns) {
    // glob 記得用引號包住，讓本程式自己展開；單一檔名也能直接命中
    files.push(...fs.globSync(p));
  }
  if (files.length === 0) {
    console.error('找不到符合的檔案');
    return 1;
  }

  let total = 0;
  for (const fn of files) {
    const text = fs.readFileSync(fn, 'utf-8');
    const [next, changed] = process_(text);
    total += changed;
    if (dryRun) {
      console.log(`${fn}: 會改 ${changed} 行`);
    } else {
      if (changed) fs.writeFileSync(fn, next, 'utf-8');
      console.log(`${fn}: 已改 ${changed} 行`);
    }
  }

  console.log(
    `\n共 ${total} 行有變更。提醒：行內 code 兩側的標點可能漏轉，請再人工複查一遍。`,
  );
  return 0;
}

process.exit(main());
