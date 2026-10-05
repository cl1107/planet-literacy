export type PlanetKind = 'sun' | 'moon' | 'earth' | 'mars' | 'saturn' | 'galaxy';
export type LiteracyLevel = 'starter' | 'growing' | 'exploring';

export interface CharacterSeed {
  hanzi: string;
  pinyin: string;
  word: string;
  sentence: string;
  themeId: PlanetKind;
}

export interface Character extends CharacterSeed {
  id: string;
  level: LiteracyLevel;
}
