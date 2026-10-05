import { starterSeeds } from './starter';
import { growingSeeds } from './growing';
import { exploringSeeds } from './exploring';
import type { Character, PlanetKind } from './types';

export type { Character, PlanetKind } from './types';

export interface ExplorationTheme {
  id: PlanetKind;
  name: string;
  subtitle: string;
  characters: Character[];
}

// 作者整理的可选素材池；分级属于产品设计，不代表官方学前必学字表。
export const characters: Character[] = [
  ...starterSeeds.map((seed): Character => ({ ...seed, id: seed.hanzi, level: 'starter' })),
  ...growingSeeds.map((seed): Character => ({ ...seed, id: seed.hanzi, level: 'growing' })),
  ...exploringSeeds.map((seed): Character => ({ ...seed, id: seed.hanzi, level: 'exploring' })),
];

const themeDefinitions: Omit<ExplorationTheme, 'characters'>[] = [
  { id: 'sun', name: '太阳', subtitle: '白天、天气与缤纷色彩' },
  { id: 'moon', name: '月亮', subtitle: '家人、小身体与晚安故事' },
  { id: 'earth', name: '地球', subtitle: '山水、植物与生活发现' },
  { id: 'mars', name: '火星', subtitle: '行动、出发与安全探索' },
  { id: 'saturn', name: '土星', subtitle: '数字、形状与身边物品' },
  { id: 'galaxy', name: '银河', subtitle: '动物、阅读与宇宙想象' },
];

export const themes: ExplorationTheme[] = themeDefinitions.map((theme) => ({
  ...theme,
  characters: characters.filter((entry) => entry.themeId === theme.id),
}));
