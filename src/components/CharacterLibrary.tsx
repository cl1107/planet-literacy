import { useState } from 'react';
import { ActionButton, Button, SearchField } from '@adobe/react-spectrum';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { characters, themes } from '../content/themes';
import { filterCharacters, levels } from '../content/learning';
import type { LevelFilter } from '../content/learning';
import type { Character, PlanetKind } from '../content/types';
import { LevelTabs } from './LevelTabs';

const pageSize = 24;

export function CharacterLibrary({ pinyin, onOpen }: { pinyin: boolean; onOpen: (character: Character) => void }) {
  const [level, setLevel] = useState<LevelFilter>('all');
  const [themeId, setThemeId] = useState<PlanetKind | 'all'>('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const filtered = filterCharacters({ items: characters, level, query, ...(themeId === 'all' ? {} : { themeId }) });
  const pageCount = Math.ceil(filtered.length / pageSize);
  const visible = filtered.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <>
      <div className="page-heading"><div><h1>汉字宇宙</h1><p>{characters.length} 个常用字，从生活到星空，自由选择。</p></div></div>
      <LevelTabs selected={level} items={characters} onChange={(value) => { setLevel(value); setPage(0); }} />
      <div className="library-tools">
        <SearchField label="找一找汉字" placeholder="汉字、词语或拼音" value={query} onChange={(value) => { setQuery(value); setPage(0); }} width="100%" />
        <div className="library-themes" role="group" aria-label="筛选探索主题">
          <ActionButton isQuiet aria-pressed={themeId === 'all'} onPress={() => { setThemeId('all'); setPage(0); }} UNSAFE_className={themeId === 'all' ? 'is-selected' : ''}>全部主题</ActionButton>
          {themes.map((theme) => <ActionButton key={theme.id} isQuiet aria-pressed={themeId === theme.id} onPress={() => { setThemeId(theme.id); setPage(0); }} UNSAFE_className={themeId === theme.id ? 'is-selected' : ''}>{theme.name}</ActionButton>)}
        </div>
      </div>
      <p className="library-result" role="status">找到 {filtered.length} 个字{filtered.length > 0 && ` · 当前 ${page * pageSize + 1}–${Math.min((page + 1) * pageSize, filtered.length)} 个`}</p>
      {filtered.length === 0 ? (
        <section className="library-empty"><Search size={30} /><h2>还没找到这个字</h2><p>试试单个汉字、常见词，或者换一个主题。</p><Button variant="secondary" onPress={() => { setQuery(''); setThemeId('all'); setLevel('all'); setPage(0); }}>查看全部汉字</Button></section>
      ) : (
        <>
          <div className="character-grid">
            {visible.map((entry) => <ActionButton key={entry.id} onPress={() => onOpen(entry)} aria-label={`${entry.hanzi}，${entry.word}，打开字卡`} UNSAFE_className="library-character"><span className="library-pinyin">{pinyin ? entry.pinyin : '\u00a0'}</span><strong>{entry.hanzi}</strong><span>{entry.word}</span><small>{levels.find((item) => item.id === entry.level)?.label}</small></ActionButton>)}
          </div>
          <div className="library-pagination" aria-label="字库分页">
            <Button variant="secondary" isDisabled={page === 0} onPress={() => setPage((value) => value - 1)}><ArrowLeft size={17} /><span>上一页</span></Button>
            <span>第 {page + 1} / {pageCount} 页</span>
            <Button variant="secondary" isDisabled={page === pageCount - 1} onPress={() => setPage((value) => value + 1)}><span>下一页</span><ArrowRight size={17} /></Button>
          </div>
        </>
      )}
      <p className="gentle-note">可选字库，无需学完。分级是内容编排，陪孩子按兴趣选择就好。</p>
    </>
  );
}
