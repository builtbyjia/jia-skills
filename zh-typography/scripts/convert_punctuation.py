#!/usr/bin/env python3
"""繁中標點粗轉工具：把「緊鄰中文字的半形句讀」批次轉全形。

這是加速器，不是判斷者。純規則無法理解「句子的主體語言」，只能用
「符號緊鄰中文字」這個近似條件，因此有兩個已知侷限，跑完務必人工複查：

  1. 夾在行內 `code` 兩側的正文標點（左右是反引號、不是中文字）會被漏掉，
     例如 `合併 `.md`,自帶` 的那個逗號，需手動改成全形。
  2. 它不判斷主體語言，只看鄰接字元；極少數「中文句子裡整段英文」的個案
     可能誤轉，需人工回退。

程式碼區塊（``` 圍住）整段跳過，不會動到程式碼。

用法：
    python convert_punctuation.py file.md
    python convert_punctuation.py "docs/*.md"        # 記得加引號，讓程式自己展開 glob
    python convert_punctuation.py file.md --dry-run   # 只報告不寫入
"""

import argparse
import glob
import re
import sys

# 涵蓋常見中日韓字元與全形標點，作為「這是中文字」的判斷依據
CJK = r'一-鿿㐀-䶿＀-￯　-〿「」『』、，。：；？！（）'

# 半形 → 全形的句讀對照（不含括號，括號需成對處理，另行判斷風險較高，交給人工）
PAIRS = [(',', '，'), (';', '；'), (':', '：'), ('?', '？'), ('!', '！')]


def convert_line(line: str) -> str:
    """把一行裡緊鄰中文字的半形句讀轉全形。"""
    for half, full in PAIRS:
        h = re.escape(half)
        # 前面是中文字
        line = re.sub(rf'(?<=[{CJK}]){h}', full, line)
        # 後面是中文字
        line = re.sub(rf'{h}(?=[{CJK}])', full, line)
    return line


def process(text: str) -> tuple[str, int]:
    """回傳 (轉換後文字, 變更的行數)。程式碼區塊整段跳過。"""
    out, in_fence, changed = [], False, 0
    for raw in text.split('\n'):
        if raw.lstrip().startswith('```'):
            in_fence = not in_fence
            out.append(raw)
            continue
        new = raw if in_fence else convert_line(raw)
        if new != raw:
            changed += 1
        out.append(new)
    return '\n'.join(out), changed


def main() -> int:
    ap = argparse.ArgumentParser(description='繁中標點粗轉：緊鄰中文字的半形句讀轉全形')
    ap.add_argument('patterns', nargs='+', help='檔案路徑或 glob（glob 記得用引號包住）')
    ap.add_argument('--dry-run', action='store_true', help='只報告會改幾行，不寫入')
    args = ap.parse_args()

    files = []
    for p in args.patterns:
        files.extend(glob.glob(p))
    if not files:
        print('找不到符合的檔案', file=sys.stderr)
        return 1

    total = 0
    for fn in files:
        with open(fn, encoding='utf-8') as f:
            text = f.read()
        new, changed = process(text)
        total += changed
        if args.dry_run:
            print(f'{fn}: 會改 {changed} 行')
        else:
            if changed:
                with open(fn, 'w', encoding='utf-8') as f:
                    f.write(new)
            print(f'{fn}: 已改 {changed} 行')

    print(f'\n共 {total} 行有變更。提醒：行內 code 兩側的標點可能漏轉，請再人工複查一遍。')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
