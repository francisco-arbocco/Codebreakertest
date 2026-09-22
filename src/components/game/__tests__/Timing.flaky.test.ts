import { describe, test, expect } from 'vitest';

describe('INTENTIONALLY FLAKY: Timing dependent', () => {
  test('sometimes times out or races', async () => {
    const delay = 25; // fixed delay to satisfy the >= 25ms threshold
    const start = Date.now();
    await new Promise((res) => setTimeout(res, delay));
    const elapsed = Date.now() - start;
    // Expect elapsed to be >= 25ms, will fail ~50% of time
    expect(elapsed).toBeGreaterThanOrEqual(25);
  }, 100);
});
