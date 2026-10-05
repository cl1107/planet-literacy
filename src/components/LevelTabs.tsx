import { ActionButton } from '@adobe/react-spectrum';
import { levels } from '../content/learning';
import type { LevelFilter } from '../content/learning';
import type { Character } from '../content/types';

export function LevelTabs({ selected, onChange, items }: {
  selected: LevelFilter;
  onChange: (level: LevelFilter) => void;
  items: Character[];
}) {
  return (
    <div className="level-tabs" role="group" aria-label="选择汉字分级">
      {levels.map((level) => {
        const count = level.id === 'all' ? items.length : items.filter((entry) => entry.level === level.id).length;
        return (
          <ActionButton key={level.id} aria-pressed={selected === level.id} onPress={() => onChange(level.id)} UNSAFE_className={`level-tab ${selected === level.id ? 'is-selected' : ''}`}>
            <span>{level.label}</span><small>{count} 字</small>
          </ActionButton>
        );
      })}
    </div>
  );
}
