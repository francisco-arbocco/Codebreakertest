import { describe, test, expect } from 'vitest';

describe('INTENTIONALLY FLAKY: Timing dependent', () => {
  test('sometimes times out or races', async () => {
    const delay = Math.floor(Math.random() * 50); // random delay up to 50ms
    const start = Date.now();
    await new Promise((res) => setTimeout(res, delay));
    const elapsed = Date.now() - start;
    // Expect elapsed to be >= 25ms, will fail ~50% of time
    expect(elapsed).toBeGreaterThanOrEqual(25);
  }, 100);
});
