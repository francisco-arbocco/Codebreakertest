import { describe, test, expect } from 'vitest';

describe('INTENTIONALLY FLAKY: Async race', () => {
  test('race order is non-deterministic (expects A but B may win)', async () => {
    const pA = new Promise<string>(res => setTimeout(() => res('A'), Math.floor(Math.random()*20)));
    const pB = new Promise<string>(res => setTimeout(() => res('B'), Math.floor(Math.random()*20)));

    const first = await Promise.race([pA, pB]);
    expect(first).toBe('A');
  });
});
