export interface Character {
  id: string;
  hanzi: string;
  pinyin: string;
  word: string;
  sentence: string;
}

export type PlanetKind = 'sun' | 'moon' | 'earth' | 'mars' | 'saturn' | 'galaxy';

export interface ExplorationTheme {
  id: PlanetKind;
  name: string;
  subtitle: string;
  color: string;
  characters: [Character, Character, Character];
}

// 初始化内容种子。主题是兴趣场景，汉字难度须在完整课程上线前单独审核。
export const themes: ExplorationTheme[] = [
  { id: 'sun', name: '太阳', subtitle: '寻找暖暖的光', color: '#df9b32', characters: [
    { id: 'ri', hanzi: '日', pinyin: 'rì', word: '日出', sentence: '我们一起看日出。' },
    { id: 'guang', hanzi: '光', pinyin: 'guāng', word: '阳光', sentence: '阳光照在小手上。' },
    { id: 'tian', hanzi: '天', pinyin: 'tiān', word: '天空', sentence: '抬头看看天空。' },
  ] },
  { id: 'moon', name: '月亮', subtitle: '拜访夜空好朋友', color: '#938baa', characters: [
    { id: 'yue', hanzi: '月', pinyin: 'yuè', word: '月亮', sentence: '一起找找今晚的月亮。' },
    { id: 'ye', hanzi: '夜', pinyin: 'yè', word: '夜晚', sentence: '夜晚到了，该休息啦。' },
    { id: 'bai', hanzi: '白', pinyin: 'bái', word: '白色', sentence: '指一指身边白色的东西。' },
  ] },
  { id: 'earth', name: '地球', subtitle: '发现我们的家', color: '#528578', characters: [
    { id: 'shui', hanzi: '水', pinyin: 'shuǐ', word: '喝水', sentence: '玩一会儿，记得喝水。' },
    { id: 'shan', hanzi: '山', pinyin: 'shān', word: '大山', sentence: '画一座你喜欢的大山。' },
    { id: 'ren', hanzi: '人', pinyin: 'rén', word: '家人', sentence: '和家人一起去探索。' },
  ] },
  { id: 'mars', name: '火星', subtitle: '收集红色小石头', color: '#be7154', characters: [
    { id: 'huo', hanzi: '火', pinyin: 'huǒ', word: '火苗', sentence: '火苗很烫，要离远一点。' },
    { id: 'shi', hanzi: '石', pinyin: 'shí', word: '石头', sentence: '找一找小小的石头。' },
    { id: 'hong', hanzi: '红', pinyin: 'hóng', word: '红色', sentence: '找找身边红色的东西。' },
  ] },
  { id: 'saturn', name: '土星', subtitle: '看看大大的星环', color: '#ad8a50', characters: [
    { id: 'tu', hanzi: '土', pinyin: 'tǔ', word: '泥土', sentence: '小种子在泥土里长大。' },
    { id: 'da', hanzi: '大', pinyin: 'dà', word: '大小', sentence: '哪一个大，哪一个小？' },
    { id: 'xiao', hanzi: '小', pinyin: 'xiǎo', word: '小手', sentence: '举起你的小手。' },
  ] },
  { id: 'galaxy', name: '银河', subtitle: '寻找闪闪的星星', color: '#767499', characters: [
    { id: 'xing', hanzi: '星', pinyin: 'xīng', word: '星星', sentence: '一起找找夜空中的星星。' },
    { id: 'yun', hanzi: '云', pinyin: 'yún', word: '白云', sentence: '这朵白云像什么？' },
    { id: 'he', hanzi: '河', pinyin: 'hé', word: '小河', sentence: '小河里的水流呀流。' },
  ] },
];

export const characters = themes.flatMap((theme) => theme.characters);
