import { describe, it, expect } from 'vitest';
import { NIGERIA_LGAS, NIGERIAN_STATES, getLgas } from './nigeriaLGAs';

describe('nigeriaLGAs dataset', () => {
  it('covers all 36 states and the Federal Capital Territory', () => {
    expect(NIGERIAN_STATES).toHaveLength(37);
    expect(NIGERIA_LGAS['Federal Capital Territory']).toBeDefined();
  });

  it('contains all 774 local government areas', () => {
    const total = NIGERIAN_STATES.reduce((sum, state) => sum + getLgas(state).length, 0);
    expect(total).toBe(774);
  });

  it('lists the Bayelsa LGAs', () => {
    expect(getLgas('Bayelsa')).toHaveLength(8);
    expect(getLgas('Bayelsa')).toContain('Yenagoa');
  });

  it('lists LGAs for non-Bayelsa states', () => {
    expect(getLgas('Lagos')).toContain('Ikeja');
    expect(getLgas('Kano').length).toBeGreaterThan(40);
  });

  it('returns an empty list for an unknown state', () => {
    expect(getLgas('Atlantis')).toEqual([]);
  });
});
