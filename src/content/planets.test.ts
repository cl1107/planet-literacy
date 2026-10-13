import { describe, expect, it } from 'vitest';
import { characters } from './themes';
import { filterCharacters } from './learning';
import { planets, planetsForLevel, nextPlanet } from './planets';

describe('名称和故事带动识字的星球探索', () => {
  it('每颗星有独立名称、介绍及最多三个故事中的字，覆盖整个字库', () => {
    expect(planets.length).toBeGreaterThan(500);
    expect(new Set(planets.map((planet) => planet.id)).size).toBe(planets.length);
    expect(new Set(planets.map((planet) => planet.name)).size).toBe(planets.length);
    for (const planet of planets) {
      expect(planet.characters.length, planet.name).toBeGreaterThan(0);
      expect(planet.characters.length, planet.name).toBeLessThanOrEqual(3);
      expect(planet.introduction.length, planet.name).toBeGreaterThan(planet.name.length);
      for (const entry of planet.characters) {
        expect(planet.introduction, `${planet.name}/${entry.hanzi}`).toContain(entry.hanzi);
      }
    }
    expect(new Set(planets.flatMap((planet) => planet.characters.map((entry) => entry.id))))
      .toEqual(new Set(characters.map((entry) => entry.id)));
  });

  it('各分级先遍历所有不同星球，再回到起点，不出现空课程', () => {
    for (const level of ['all', 'starter', 'growing', 'exploring'] as const) {
      const route = planetsForLevel(level);
      const visited = new Set<string>();
      const first = route[0];
      if (!first) throw new Error('需要可探索星球');
      let current = first;
      for (let i = 0; i < route.length; i++) {
        expect(visited.has(current.id)).toBe(false);
        expect(filterCharacters({ items: current.characters, level }).length).toBeGreaterThan(0);
        visited.add(current.id);
        const next = nextPlanet({ currentId: current.id, level });
        expect(next.name).not.toBe(current.name);
        expect(next.appearance).not.toBe(current.appearance);
        current = next;
      }
      expect(current.id).toBe(first.id);
      expect(visited.size).toBe(route.length);
    }
  });
});
