import { describe, test, expect } from 'vitest';

describe('INTENTIONALLY FLAKY: low-probability race', () => {
  test('A is expected to win, but B sometimes does', async () => {
    const aDelay = 5; // fixed shorter delay so A always wins
    const bDelay = 20; // fixed longer delay so B always loses
    const pA = new Promise<'A'>(res => setTimeout(() => res('A'), aDelay));
    const pB = new Promise<'B'>(res => setTimeout(() => res('B'), bDelay));
    const first = await Promise.race([pA, pB]);
    expect(first).toBe('A');
  });
});
