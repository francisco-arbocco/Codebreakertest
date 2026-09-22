import { describe, test, expect } from 'vitest';

describe('INTENTIONALLY FLAKY: Random jitter', () => {
  test('may randomly fail (~50%)', () => {
    const rnd = Math.random();
    if (rnd < 0.5) {
      expect(false).toBe(true);
    } else {
      expect(true).toBe(true);
    }
  });
});
