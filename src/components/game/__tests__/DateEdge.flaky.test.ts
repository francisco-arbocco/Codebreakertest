import { describe, test, expect } from 'vitest';

describe('INTENTIONALLY FLAKY: Time edge', () => {
  test('fails when seconds % 5 === 0 (~20%)', () => {
    const seconds = new Date().getSeconds();
    if (seconds % 5 === 0) {
      expect(false).toBe(true);
    } else {
      expect(true).toBe(true);
    }
  });
});
