import { describe, test, expect } from 'vitest';

describe('INTENTIONALLY FLAKY: CPU heater', () => {
  test('heavy loop should still be fast (may fail on busy CI)', () => {
    const start = performance.now();
    let x = 0;
    for (let i = 0; i < 5_000_00; i++) { // 500k iterations
      x += i % 3;
    }
    const elapsed = performance.now() - start;
    // 15ms is intentionally tight and will fail on slower/busier machines
    expect(elapsed).toBeLessThan(15);
    expect(x).toBeGreaterThanOrEqual(0); // to use x
  });
});
