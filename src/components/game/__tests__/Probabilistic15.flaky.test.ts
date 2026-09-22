import { describe, test, expect } from 'vitest';

describe('INTENTIONALLY FLAKY: 15% probability', () => {
  test('fails about 15% of the time', () => {
    const rnd = Math.random();
    const willFail = rnd < 0.15;
    expect(willFail).toBe(false);
  });
});
