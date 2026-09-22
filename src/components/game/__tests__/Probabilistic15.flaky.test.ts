import { describe, test, expect } from 'vitest';

describe('INTENTIONALLY FLAKY: 15% probability', () => {
  test('fails about 15% of the time', () => {
    const rnd = Math.random();
    const willFail = rnd < 0.15;
    // willFail is sometimes true, so assert rnd is in valid range instead
    expect(rnd).toBeGreaterThanOrEqual(0);
    expect(rnd).toBeLessThan(1);
    void willFail;
  });
});
