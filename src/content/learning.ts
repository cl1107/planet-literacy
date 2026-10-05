import type { Character, LiteracyLevel, PlanetKind } from './types';

export type LevelFilter = 'all' | LiteracyLevel;
export const lessonSize = 3;
export const levels: { id: LevelFilter; label: string; description: string }[] = [
  { id: 'all', label: '全部汉字', description: '自由选择感兴趣的字' },
  { id: 'starter', label: '初识汉字', description: '从生活里常见的字开始' },
  { id: 'growing', label: '进阶练习', description: '在词语和短句里认识字' },
  { id: 'exploring', label: '继续探索', description: '和家长一起发现更多字' },
];

export function filterCharacters({ items, level, themeId, query = '' }: {
  items: Character[];
  level: LevelFilter;
  themeId?: PlanetKind;
  query?: string;
}): Character[] {
  const normalizedQuery = normalizeSearch(query.trim());
  return items.filter((entry) =>
    (level === 'all' || entry.level === level) &&
    (themeId === undefined || entry.themeId === themeId) &&
    (!normalizedQuery || normalizeSearch(`${entry.hanzi} ${entry.word} ${entry.pinyin}`).includes(normalizedQuery)),
  );
}

function normalizeSearch(text: string): string {
  return text.toLocaleLowerCase('zh-CN').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function lessonBatch({ items, index }: { items: Character[]; index: number }) {
  const start = Math.floor(index / lessonSize) * lessonSize;
  return { start, items: items.slice(start, start + lessonSize) };
}

export function nextBatchIndex({ index, total }: { index: number; total: number }): number {
  const next = (Math.floor(index / lessonSize) + 1) * lessonSize;
  return next < total ? next : 0;
}
