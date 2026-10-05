import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { pinyin } from 'pinyin-pro';
import { characters, themes } from './themes';
import { filterCharacters, lessonBatch, nextBatchIndex } from './learning';
import type { Character } from './types';

describe('可选常用字库的内容完整性', () => {
  it('提供600个唯一汉字，各分级200字并覆盖维护清单', () => {
    expect(characters).toHaveLength(600);
    expect(new Set(characters.map((entry) => entry.hanzi)).size).toBe(600);
    expect(new Set(characters.map((entry) => entry.id)).size).toBe(600);
    for (const level of ['starter', 'growing', 'exploring']) {
      const entries = characters.filter((entry) => entry.level === level);
      const manifest = readFileSync(new URL(`../../scripts/${level}-characters.txt`, import.meta.url), 'utf8').trim().split(/\s+/);
      expect(entries).toHaveLength(200);
      expect(new Set(entries.map((entry) => entry.hanzi))).toEqual(new Set(manifest));
    }
  });

  it('每个字都有词语、词境拼音和包含该词的真实例句', () => {
    for (const entry of characters) {
      expect(entry.hanzi, entry.id).toMatch(/^\p{Script=Han}$/u);
      expect(entry.pinyin, entry.hanzi).toMatch(/^[a-zāáǎàēéěèīíǐìōóǒòūúǔùüǖǘǚǜêńňǹ]+$/u);
      expect(entry.word.length, entry.hanzi).toBeGreaterThanOrEqual(2);
      expect(entry.word, entry.hanzi).toContain(entry.hanzi);
      expect(entry.sentence, entry.hanzi).toContain(entry.word);
      expect(entry.sentence.length, entry.hanzi).toBeGreaterThan(entry.word.length);
      expect(entry.sentence, entry.hanzi).toMatch(/[。？！][”’」』]?$/u);
      expect(entry.word + entry.sentence, entry.hanzi).not.toMatch(/待补|占位|示例文字|TODO/);
    }
  });

  it('所有字都能从主题和分级进入，主题拥有各分级的内容', () => {
    expect(themes).toHaveLength(6);
    expect(themes.flatMap((theme) => theme.characters).map((entry) => entry.id).sort()).toEqual(characters.map((entry) => entry.id).sort());
    for (const theme of themes) {
      for (const level of ['starter', 'growing', 'exploring']) {
        expect(theme.characters.filter((entry) => entry.level === level).length, `${theme.name}/${level}`).toBeGreaterThan(0);
      }
    }
  });

  it('标注读音与例词中的读音一致，覆盖多音字和轻声', () => {
    const differences = characters.flatMap((entry) => {
      // 工具把结果补语“跑得快”的助词误读为 dé，按词典的语法释义核对为轻声 de。
      // https://dict.concised.moe.edu.tw/dictView.jsp?ID=7458&la=0&powerMode=0
      const pronunciation = entry.hanzi === '得' && entry.word === '跑得快'
        ? 'de'
        : pinyin(entry.word, { type: 'array', toneSandhi: false })[entry.word.indexOf(entry.hanzi)];
      return pronunciation === entry.pinyin ? [] : [{ hanzi: entry.hanzi, word: entry.word, actual: entry.pinyin, expected: pronunciation }];
    });
    expect(differences).toEqual([]);
  });
});

describe('字库查找和浏览', () => {
  it('汉字、例词、无声调拼音和带声调拼音均可找到目标字', () => {
    const target = characters.find((entry) => entry.hanzi === '月');
    expect(target).toBeDefined();
    for (const query of ['月', '月亮', ' YUE ', 'yuè']) {
      expect(filterCharacters({ items: characters, level: 'all', query }).some((entry) => entry.hanzi === '月')).toBe(true);
    }
    expect(filterCharacters({ items: characters, level: 'all', query: '不存在的词语xyz' })).toHaveLength(0);
  });

  it('主题、分级和搜索同时生效，不改变原字库', () => {
    const result = filterCharacters({ items: characters, level: 'starter', themeId: 'moon' });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((entry) => entry.level === 'starter' && entry.themeId === 'moon')).toBe(true);
    expect(characters).toHaveLength(600);
  });
});

describe('少量多组的识字浏览', () => {
  const items: Character[] = Array.from({ length: 7 }, (_, index) => ({ id: String(index), hanzi: '字', pinyin: 'zì', word: '汉字', sentence: '一起认识汉字。', themeId: 'galaxy', level: 'starter' }));

  it('每组最多3字，最后一组可少于3字，不丢弃余数', () => {
    const visited: string[] = [];
    let index = 0;
    do {
      const batch = lessonBatch({ items, index });
      expect(batch.items.length).toBeLessThanOrEqual(3);
      visited.push(...batch.items.map((entry) => entry.id));
      index = nextBatchIndex({ index, total: items.length });
    } while (index !== 0);
    expect(visited).toEqual(items.map((entry) => entry.id));
    expect(lessonBatch({ items, index: 6 }).items).toHaveLength(1);
  });

  it('从组内任意位置换组，都去下一组首字，最后一组循环到开头', () => {
    expect(nextBatchIndex({ index: 1, total: 7 })).toBe(3);
    expect(nextBatchIndex({ index: 5, total: 7 })).toBe(6);
    expect(nextBatchIndex({ index: 6, total: 7 })).toBe(0);
    expect(nextBatchIndex({ index: 1, total: 2 })).toBe(0);
    expect(lessonBatch({ items: [], index: 0 }).items).toEqual([]);
  });

  it('所有主题和分级的组能遍历完整字集', () => {
    for (const theme of themes) {
      for (const level of ['all', 'starter', 'growing', 'exploring'] satisfies ('all' | Character['level'])[]) {
        const pool = filterCharacters({ items: theme.characters, level });
        const visited: string[] = [];
        let index = 0;
        do {
          visited.push(...lessonBatch({ items: pool, index }).items.map((entry) => entry.id));
          index = nextBatchIndex({ index, total: pool.length });
        } while (index !== 0);
        expect(visited).toEqual(pool.map((entry) => entry.id));
      }
    }
  });
});
