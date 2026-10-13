import { characters } from './themes';
import { filterCharacters } from './learning';
import type { LevelFilter } from './learning';
import type { Character } from './types';

export interface DiscoveryPlanet {
  id: string;
  name: string;
  introduction: string;
  characters: Character[];
  appearance: number;
}

// 想象星球的故事，不作为真实天文知识。先探索具体景物，再扩展到生活词汇。
const stories = [
  ['白云星', '云天白', '白云星的天空里飘着软软的白云。小飞船穿过云，停在一座白色的云岛上。'],
  ['花园星', '花草叶', '花园星上开满了花，小草铺成绿地毯。每片叶子下面，都藏着一颗小水珠。'],
  ['大海星', '海水鱼', '大海星被蓝蓝的海水包围。小鱼游过飞船的窗前，邀请你一起寻找海底的小路。'],
  ['雪人星', '雪人冬', '雪人星的冬天里住着一群雪人。雪人用雪堆出小屋，等你来敲门。'],
  ['火山星', '火山石', '火山星上有一座红色的火山。山脚铺满了石头，我们坐在飞船里远远地看。'],
  ['月光星', '月光夜', '月光星总是安静的夜晚。月光照亮小路，带你找到一座会发光的小屋。'],
  ['彩虹星', '红黄蓝', '彩虹星有红色的山、黄色的沙和蓝色的湖。你想先去找哪一种颜色？'],
  ['森林星', '树木林', '森林星上长着高高的树。树木连成一片林，飞船停在树梢上的小站里。'],
  ['小鸟星', '鸟飞风', '小鸟星上，小鸟迎着风飞过山谷。跟着鸟儿飞，我们能找到风吹来的方向。'],
  ['果园星', '果桃瓜', '果园星上的果子成熟了。桃子挂满树，圆圆的瓜藏在叶子底下。'],
  ['小船星', '船河桥', '小船星有一条弯弯的河。小船从桥下经过，载着我们去河的另一边。'],
  ['积木星', '大小高', '积木星上，大积木和小积木搭成高高的塔。我们给小飞船搭一个新家吧。'],
  ['雨点星', '雨伞水', '雨点星正在下雨。撑开小伞，听雨落在水面上，滴答，滴答。'],
  ['沙滩星', '沙贝海', '沙滩星的沙软软的。海水退下去以后，沙里露出了漂亮的贝壳。'],
  ['早安星', '日出早', '早安星正在日出。太阳慢慢升起来，我们早早出发，去看看新的一天。'],
  ['晚安星', '晚安梦', '晚安星的小屋里亮着灯。大家互道晚安，准备做一个坐飞船的梦。'],
  ['小猫星', '猫狗家', '小猫星上，小猫和小狗住在一起。它们带你回家，看看各自的小床。'],
  ['小兔星', '兔耳白', '小兔星住着白色的小兔。兔子竖起长耳朵，听见了飞船落地的声音。'],
  ['车轮星', '车轮路', '车轮星上有一条长长的路。小车的轮子转呀转，带你去新的地方。'],
  ['气球星', '气球圆', '气球星上飘着圆圆的气球。气球带着小篮子，慢慢升到空中。'],
  ['数字星', '一二三', '数字星有一座小岛、两座小桥和三座小屋。指一指，一、二、三，一起数数。'],
  ['小手星', '手足口', '小手星的居民用手打招呼，用足走小路，用口说欢迎。你也来打个招呼吧。'],
  ['好朋友星', '朋友好', '好朋友星上，朋友们正在等你。说声你好，我们就一起出发。'],
  ['读书星', '书字读', '读书星的每本书里都藏着一个故事。找到书里的字，和家长一起读一读。'],
] satisfies [string, string, string][];

function lookup(hanzi: string): Character {
  const entry = characters.find((item) => item.hanzi === hanzi);
  if (!entry) throw new Error(`星球引用了字库中不存在的汉字：${hanzi}`);
  return entry;
}

const storyPlanets: DiscoveryPlanet[] = stories.map(([name, glyphs, introduction], index) => ({
  id: `story-${index}`, name, introduction, characters: [...glyphs].map(lookup), appearance: index,
}));

// 同词的汉字在同一颗星上相遇，保证所有字都有入口，不靠改编号重复星球。
const wordGroups = new Map<string, Character[]>();
for (const entry of characters) {
  const group = wordGroups.get(entry.word) ?? [];
  group.push(entry);
  wordGroups.set(entry.word, group);
}
const wordPlanets: DiscoveryPlanet[] = [...wordGroups].map(([word, entries], index) => {
  const first = entries[0];
  if (!first) throw new Error(`词语 ${word} 缺少识字内容`);
  return {
    id: `word-${word}`, name: `${word}星`,
    introduction: `欢迎来到${word}星！这颗想象星球把“${word}”变成一个小故事：${first.sentence}`,
    characters: entries, appearance: index + storyPlanets.length,
  };
});
// 名称相同的词语归入已有故事，保留原字卡的读音与例词。
for (const planet of wordPlanets) {
  const story = storyPlanets.find((item) => item.name === planet.name);
  if (story) {
    story.characters = [...planet.characters, ...story.characters.filter((entry) => !planet.characters.some((item) => item.id === entry.id))].slice(0, 3);
    if (planet.characters.some((entry) => !story.introduction.includes(entry.hanzi))) {
      story.introduction += planet.introduction;
    }
  }
}
export const planets = [...storyPlanets, ...wordPlanets.filter((planet) => !storyPlanets.some((story) => story.name === planet.name))];

export function planetsForLevel(level: LevelFilter): DiscoveryPlanet[] {
  return planets.filter((planet) => filterCharacters({ items: planet.characters, level }).length > 0);
}

export function nextPlanet({ currentId, level }: { currentId: string; level: LevelFilter }): DiscoveryPlanet {
  const route = planetsForLevel(level);
  const next = route[(route.findIndex((planet) => planet.id === currentId) + 1) % route.length];
  if (!next) throw new Error(`分级 ${level} 没有可探索星球`);
  return next;
}
