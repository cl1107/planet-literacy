import { useState } from 'react';
import { ActionButton, Button, Switch } from '@adobe/react-spectrum';
import { ArrowLeft, ArrowRight, BookOpen, ChevronRight, CircleHelp, Heart, LibraryBig, Orbit, Pencil, Rocket, Settings2, Sparkles, Star, Volume2, VolumeX } from 'lucide-react';
import { PlanetArt } from './components/PlanetArt';
import { CharacterLibrary } from './components/CharacterLibrary';
import { LevelTabs } from './components/LevelTabs';
import { characters, themes } from './content/themes';
import type { ExplorationTheme } from './content/themes';
import type { Character } from './content/types';
import { filterCharacters, lessonBatch, nextBatchIndex } from './content/learning';
import type { LevelFilter } from './content/learning';

type Section = 'learn' | 'words' | 'write' | 'library' | 'cards' | 'growth' | 'parents';
const navigation = [
  { id: 'learn', label: '识字星球', icon: Orbit },
  { id: 'words', label: '词语探险', icon: Rocket },
  { id: 'write', label: '星轨写字', icon: Pencil },
  { id: 'library', label: '汉字宇宙', icon: LibraryBig },
  { id: 'cards', label: '我的字卡', icon: Heart },
  { id: 'growth', label: '探索足迹', icon: Star },
  { id: 'parents', label: '给爸爸妈妈', icon: Settings2 },
] satisfies { id: Section; label: string; icon: typeof Orbit }[];

const plannedPages = {
  words: { title: '词语探险', intro: '让认识的字，变成会用的词。', detail: '规划包含词语听读、字词配对和短句补字。每轮 4–6 道题，先从“日出、月亮、星星”这些具体词语出发。', icon: Rocket },
  write: { title: '星轨写字', intro: '用小手，慢慢走过汉字的轨道。', detail: '规划包含笔顺示范、分笔描红与自由书写。先写“一、二、三、十、人”等简单字，提供左手模式，不给书写打分。', icon: Pencil },
  cards: { title: '我的字卡', intro: '把喜欢的汉字，装进自己的星球口袋。', detail: '规划包含收藏、已认识字卡与待复习字卡。收藏和掌握分别记录，喜欢一个字就可以收藏。当前还没有保存的字卡。', icon: Heart },
  growth: { title: '探索足迹', intro: '每一小步，都值得被看见。', detail: '规划展示实际学习过的字、复习结果和主题探索记录。没有排名和连续签到压力；当前示例不记录学习成绩。', icon: Star },
} satisfies Partial<Record<Section, { title: string; intro: string; detail: string; icon: typeof Orbit }>>;

function speak(text: string, onError: (message: string) => void) {
  if (!('speechSynthesis' in window)) {
    onError('这个浏览器暂时不能朗读，可以请爸爸妈妈读给你听。');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.78;
  const chineseVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.startsWith('zh'));
  if (chineseVoice) utterance.voice = chineseVoice;
  utterance.onerror = (event) => {
    if (event.error !== 'interrupted' && event.error !== 'canceled') onError('朗读没有成功，请再试一次，或请爸爸妈妈读给你听。');
  };
  window.speechSynthesis.speak(utterance);
}

export function App() {
  const [section, setSection] = useState<Section>('learn');
  const [theme, setTheme] = useState<ExplorationTheme>(() => {
    const first = themes[0];
    if (!first) throw new Error('至少需要一个识字主题');
    return first;
  });
  const [wordIndex, setWordIndex] = useState(0);
  const [level, setLevel] = useState<LevelFilter>('starter');
  const [sound, setSound] = useState(true);
  const [pinyin, setPinyin] = useState(true);
  const [audioError, setAudioError] = useState('');
  const available = filterCharacters({ items: theme.characters, level });
  const character = available[wordIndex];
  const batch = lessonBatch({ items: available, index: wordIndex });
  const batchPosition = wordIndex - batch.start;
  const pageTitle = navigation.find((item) => item.id === section)?.label;

  function selectTheme(nextTheme: ExplorationTheme) {
    window.speechSynthesis?.cancel();
    setTheme(nextTheme);
    setWordIndex(0);
    setAudioError('');
  }

  function toggleSound() {
    window.speechSynthesis?.cancel();
    setSound((value) => !value);
    setAudioError('');
  }

  function changeLevel(nextLevel: LevelFilter) {
    window.speechSynthesis?.cancel();
    setLevel(nextLevel);
    setWordIndex(0);
    setAudioError('');
  }

  function openCharacter(entry: Character) {
    const nextTheme = themes.find((item) => item.id === entry.themeId);
    if (!nextTheme) throw new Error(`汉字 ${entry.hanzi} 引用了未知主题`);
    const index = nextTheme.characters.findIndex((item) => item.id === entry.id);
    if (index < 0) throw new Error(`主题 ${nextTheme.name} 缺失汉字 ${entry.hanzi}`);
    selectTheme(nextTheme);
    setLevel('all');
    setWordIndex(index);
    setSection('learn');
    requestAnimationFrame(() => document.getElementById('main')?.focus());
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">跳到学习内容</a>
      <aside className="sidebar">
        <a className="brand" href="#main" onClick={() => setSection('learn')}>
          <span className="brand-mark"><Orbit size={30} strokeWidth={1.5} /></span>
          <span>星球识字<small>小小宇航员的汉字之旅</small></span>
        </a>
        <nav aria-label="主导航">
          {navigation.map(({ id, label, icon: Icon }) => (
            <ActionButton key={id} isQuiet onPress={() => setSection(id)} aria-current={section === id ? 'page' : false} UNSAFE_className={`nav-item ${section === id ? 'is-current' : ''}`}>
              <Icon size={21} strokeWidth={1.7} /><span>{label}</span>
            </ActionButton>
          ))}
        </nav>
        <div className="sidebar-note">
          <PlanetArt kind="saturn" />
          <p>宇宙很大，<br />我们慢慢认识它。</p>
          <small>每天几个字，一起发现新世界。</small>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <span className="breadcrumb">我的小宇宙 <ChevronRight size={14} /> <strong>{pageTitle}</strong></span>
          <ActionButton isQuiet onPress={toggleSound} aria-label={sound ? '关闭声音' : '开启声音'} UNSAFE_className="sound-toggle">
            {sound ? <Volume2 size={20} /> : <VolumeX size={20} />}<span>{sound ? '声音开' : '声音关'}</span>
          </ActionButton>
        </header>

        <main id="main" tabIndex={-1}>
          {section === 'learn' && <>
            <div className="page-heading"><div><h1>今天，去哪个星球？</h1><p>{characters.length} 个常用字，选一个喜欢的地方慢慢探索。</p></div><span className="session-note"><Sparkles size={17} /> 一次认识 3 个字</span></div>
            <LevelTabs selected={level} onChange={changeLevel} items={characters} />
            <div className="theme-picker" role="group" aria-label="选择探索主题">
              {themes.map((item) => (
                <ActionButton key={item.id} onPress={() => selectTheme(item)} aria-pressed={theme.id === item.id} UNSAFE_className={`theme-button ${theme.id === item.id ? 'is-selected' : ''}`}>
                  <PlanetArt kind={item.id} /><span>{item.name}</span><small className="theme-count">{filterCharacters({ items: item.characters, level }).length} 字</small>
                </ActionButton>
              ))}
            </div>

            {character ? <section className="lesson" aria-labelledby="lesson-title">
              <div className="lesson-top"><span className="lesson-label"><span className="status-dot" /> 认识汉字 · {available.length} 字可探索</span><ActionButton isQuiet aria-label="换一组字" onPress={() => { window.speechSynthesis?.cancel(); setAudioError(''); setWordIndex(nextBatchIndex({ index: wordIndex, total: available.length })); }} UNSAFE_className="change-batch">换一组字</ActionButton></div>
              <div className="lesson-content">
                <div className="planet-scene"><div className="orbit-line" /><PlanetArt kind={theme.id} /><span className="scene-star star-one"><Star size={17} /></span><span className="scene-star star-two"><Sparkles size={20} /></span><span className="scene-dot" /><span className="scene-caption">下一站，{theme.name}</span></div>
                <div className="character-content" key={character.id}>
                  <h2 id="lesson-title">一起认识这个字</h2>
                  <div className="character-pinyin" aria-hidden={!pinyin}>{pinyin ? character.pinyin : '\u00a0'}</div>
                  <div className="hanzi">{character.hanzi}</div>
                  <p className="character-word">{character.word}</p><span className="word-pronunciation-note">拼音按例词中的读音</span>
                  <p className="character-sentence">{character.sentence}</p>
                  <Button variant="secondary" onPress={() => { setAudioError(''); speak(`${character.word}。${character.sentence}`, setAudioError); }} isDisabled={!sound} UNSAFE_className="read-button"><Volume2 size={19} /><span>读给我听</span></Button>
                  <p className="audio-status" role="status">{audioError || (!sound ? '声音已关闭' : '点击按钮，听一听它的名字。')}</p>
                </div>
              </div>
              <footer className="lesson-footer">
                <span className="lesson-progress">本组 {batchPosition + 1} / {batch.items.length} 个字 <span className="progress-dots" aria-hidden="true">{batch.items.map((item, index) => <i key={item.id} className={index === batchPosition ? 'active' : ''} />)}</span></span>
                <div className="lesson-controls">
                  <ActionButton isQuiet isDisabled={wordIndex === 0} aria-label="上一个字" onPress={() => { window.speechSynthesis?.cancel(); setAudioError(''); setWordIndex((value) => value - 1); }}><ArrowLeft size={20} /></ActionButton>
                  <Button variant="accent" onPress={() => { window.speechSynthesis?.cancel(); setAudioError(''); setWordIndex((value) => value === available.length - 1 ? 0 : value + 1); }} UNSAFE_className="next-button"><span>{wordIndex === available.length - 1 ? '从头看看' : batchPosition === batch.items.length - 1 ? '下一组字' : '下一个字'}</span><ArrowRight size={19} /></Button>
                </div>
              </footer>
              <p className="theme-position">{theme.name}探索 · 当前第 {wordIndex + 1} / {available.length} 个字 · {theme.subtitle}</p>
            </section> : <section className="library-empty"><h2>这个主题暂时没有这一组的字</h2><p>换一个主题，或查看这个主题的全部汉字。</p><Button variant="secondary" onPress={() => changeLevel('all')}>查看全部分级</Button></section>}
            <div className="upcoming"><CircleHelp size={18} /><span>接下来还可以：看图识字、听音选字、翻卡配对。</span><span className="phase-label">已规划，待开发</span></div>
            <p className="gentle-note">每个孩子都有自己的节奏，陪伴比速度更重要。</p>
          </>}

          {section === 'library' && <CharacterLibrary pinyin={pinyin} onOpen={openCharacter} />}

          {section === 'parents' && <>
            <div className="page-heading"><div><h1>给爸爸妈妈</h1><p>陪孩子一起，把兴趣变成小小的发现。</p></div></div>
            <section className="parents-panel"><h2>学习偏好</h2><Switch isSelected={sound} onChange={() => toggleSound()}>开启朗读声音</Switch><Switch isSelected={pinyin} onChange={setPinyin}>显示拼音提示</Switch><p className="settings-note">当前设置在本次打开期间生效。设备朗读需系统支持中文语音。</p><hr /><h2>一起学习的小建议</h2><p>先看字、听声音，再指一指生活里的东西。每次认识几个字就够了，孩子累了随时停下来。</p><p>字库有 {characters.length} 个可选常用字，三个分级均为产品编排，没有统一的幼儿园必认字数。可以随时换组、跳过或休息，无需学完。</p><p>尚未进行掌握评估，也不保存学习记录。完整规划包含复习安排、进度报告和数据导出。</p></section>
          </>}

          {(section === 'words' || section === 'write' || section === 'cards' || section === 'growth') && (() => {
            const page = plannedPages[section];
            const Icon = page.icon;
            return <><div className="page-heading"><div><h1>{page.title}</h1><p>{page.intro}</p></div></div><section className="planned-page"><Icon size={48} strokeWidth={1.2} /><h2>这段探索，即将出发</h2><p>{page.detail}</p><span className="phase-label">已规划，待开发</span><Button variant="secondary" onPress={() => setSection('learn')}><BookOpen size={18} /><span>先去认识汉字</span></Button></section></>;
          })()}
        </main>
      </div>
    </div>
  );
}
