import { describe, test, expect } from 'vitest';

describe('INTENTIONALLY FLAKY: Random failure', () => {
  test('may randomly fail to simulate flakiness', () => {
    const rnd = Math.random();
    // ~30% chance to fail
    if (rnd < 0.3) {
      expect(false).toBe(true);
    } else {
      expect(true).toBe(true);
    }
  });
});
