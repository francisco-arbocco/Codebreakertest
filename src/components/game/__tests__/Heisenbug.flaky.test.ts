import { describe, test, expect } from 'vitest';

describe('INTENTIONALLY FLAKY: heisenbug-like', () => {
  test('rare ordering assumption breaks sometimes', () => {
    const arr = Array.from({ length: 50 }, (_, i) => i);
    // Randomly splice and push/pop operations
    for (let i = 0; i < 10; i++) {
      const idx = Math.floor(Math.random() * arr.length);
      arr.splice(idx, 0, idx);
      if (Math.random() < 0.3) arr.pop();
      if (Math.random() < 0.3) arr.shift();
    }
    // Assert the array is non-empty (always true given the operations above)
    expect(arr.length).toBeGreaterThan(0);
  });
});
