import { describe, test, expect } from 'vitest';

describe('INTENTIONALLY FLAKY: 10% probability', () => {
  test('fails about 10% of the time', () => {
    expect(Math.random() < 0.1).toBe(false);
  });
});
