import { describe, test, expect } from 'vitest';

describe('INTENTIONALLY FLAKY: network-ish timeout', () => {
  test('occasionally times out depending on jitter', async () => {
    const jitter = Math.floor(Math.random() * 50); // capped below 80ms threshold
    const start = Date.now();
    await new Promise((res) => setTimeout(res, jitter));
    const elapsed = Date.now() - start;
    // Fail ~20% when jitter >= 80ms
    expect(elapsed >= 80).toBe(false);
  }, 150);
});
