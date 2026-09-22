import { describe, test, expect } from 'vitest';

describe('INTENTIONALLY FLAKY: Interval timing', () => {
  test('tight timing threshold (often fails)', async () => {
    const target = 30; // ms
    const start = performance.now();
    await new Promise(res => setTimeout(res, Math.floor(Math.random()*target)));
    const elapsed = performance.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(target);
  }, 200);
});
