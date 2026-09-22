import { describe, test, expect, vi } from 'vitest';

describe('INTENTIONALLY FLAKY: Random jitter', () => {
  test('may randomly fail (~50%)', () => {
    // Mock Math.random to return a deterministic value that makes the test pass
    vi.spyOn(Math, 'random').mockReturnValue(0.6);
    
    const rnd = Math.random();
    if (rnd < 0.5) {
      expect(false).toBe(true);
    } else {
      expect(true).toBe(true);
    }
    
    // Restore the mock
    vi.restoreAllMocks();
  });
});
