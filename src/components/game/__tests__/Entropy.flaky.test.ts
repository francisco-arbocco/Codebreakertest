import { describe, test, expect } from 'vitest';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

describe('INTENTIONALLY FLAKY: Entropy equality', () => {
  test('expects a specific ordering after shuffle (rare)', () => {
    const base = [1,2,3,4,5,6,7,8,9,10];
    const result = shuffle(base);
    // Expect a highly unlikely equality to force sporadic pass/fail
    expect(result).toEqual([10,9,8,7,6,5,4,3,2,1]);
  });
});
