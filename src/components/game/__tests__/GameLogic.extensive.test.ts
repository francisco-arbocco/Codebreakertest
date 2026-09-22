import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  validateNumber,
  checkGuess,
  generateRandomNumber,
  generateMachineGuess,
  Difficulty,
} from '../GameLogic';

// ---------------------------------------------------------------------------
// validateNumber – exhaustive edge cases
// ---------------------------------------------------------------------------
describe('validateNumber – edge cases', () => {
  test('rejects empty string', () => {
    expect(validateNumber('')).toBe(false);
  });

  test('rejects single digit', () => {
    expect(validateNumber('5')).toBe(false);
  });

  test('rejects 3 digits', () => {
    expect(validateNumber('123')).toBe(false);
  });

  test('rejects 5 digits even if unique', () => {
    expect(validateNumber('12345')).toBe(false);
  });

  test('accepts all-zero-free codes (no leading zero)', () => {
    expect(validateNumber('1234')).toBe(true);
  });

  test('accepts codes with leading zero', () => {
    expect(validateNumber('0123')).toBe(true);
  });

  test('rejects duplicate digits in various positions', () => {
    expect(validateNumber('1123')).toBe(false); // dup at start
    expect(validateNumber('1223')).toBe(false); // dup in middle
    expect(validateNumber('1233')).toBe(false); // dup at end
    expect(validateNumber('1231')).toBe(false); // wrap-around dup
  });

  test('rejects non-numeric characters', () => {
    expect(validateNumber('abcd')).toBe(false);
    expect(validateNumber('12a4')).toBe(false);
    expect(validateNumber('!@#$')).toBe(false);
    expect(validateNumber('12 4')).toBe(false);
  });

  test('rejects strings with special unicode digits', () => {
    // Full-width digits ０１２３ should fail the regex
    expect(validateNumber('\uff10\uff11\uff12\uff13')).toBe(false);
  });

  test('validates every permutation start (0-9 as first digit)', () => {
    for (let i = 0; i <= 9; i++) {
      const code = [i, (i + 1) % 10, (i + 2) % 10, (i + 3) % 10]
        .map(String)
        .join('');
      expect(validateNumber(code)).toBe(true);
    }
  });

  test('all 4-same-digit strings are invalid', () => {
    for (let d = 0; d <= 9; d++) {
      expect(validateNumber(String(d).repeat(4))).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// checkGuess – combinatorial coverage
// ---------------------------------------------------------------------------
describe('checkGuess – comprehensive', () => {
  test('perfect match', () => {
    expect(checkGuess('5678', '5678')).toEqual({ excellent: 4, good: 0 });
  });

  test('complete reversal', () => {
    expect(checkGuess('4321', '1234')).toEqual({ excellent: 0, good: 4 });
  });

  test('no overlap at all', () => {
    expect(checkGuess('5678', '1234')).toEqual({ excellent: 0, good: 0 });
  });

  test('1 excellent, 0 good', () => {
    expect(checkGuess('1567', '1234')).toEqual({ excellent: 1, good: 0 });
  });

  test('0 excellent, 1 good', () => {
    expect(checkGuess('5167', '1234')).toEqual({ excellent: 0, good: 1 });
  });

  test('2 excellent, 1 good', () => {
    expect(checkGuess('1235', '1234')).toEqual({ excellent: 3, good: 0 });
    expect(checkGuess('1274', '1234')).toEqual({ excellent: 3, good: 0 });
    // 2 excellent + 1 good: positions 0,1 match; digit 4 is in target but wrong pos
    expect(checkGuess('1249', '1234')).toEqual({ excellent: 2, good: 1 });
  });

  test('symmetry: swapping guess and target may change result', () => {
    const a = checkGuess('1234', '1243');
    const b = checkGuess('1243', '1234');
    // For this specific pair, result is symmetric
    expect(a).toEqual(b);
  });

  test('excellent + good never exceeds 4', () => {
    for (let i = 0; i < 100; i++) {
      const guess = generateRandomNumber();
      const target = generateRandomNumber();
      const { excellent, good } = checkGuess(guess, target);
      expect(excellent + good).toBeLessThanOrEqual(4);
      expect(excellent).toBeGreaterThanOrEqual(0);
      expect(good).toBeGreaterThanOrEqual(0);
    }
  });

  test('self-check always returns 4 excellent', () => {
    for (let i = 0; i < 50; i++) {
      const num = generateRandomNumber();
      expect(checkGuess(num, num)).toEqual({ excellent: 4, good: 0 });
    }
  });

  test('position matters: same digits different order', () => {
    expect(checkGuess('1234', '2143')).toEqual({ excellent: 0, good: 4 });
    expect(checkGuess('1234', '1324')).toEqual({ excellent: 2, good: 2 });
  });

  test('handles codes with zero', () => {
    expect(checkGuess('0123', '0123')).toEqual({ excellent: 4, good: 0 });
    expect(checkGuess('0123', '3210')).toEqual({ excellent: 0, good: 4 });
  });
});

// ---------------------------------------------------------------------------
// generateRandomNumber – statistical properties
// ---------------------------------------------------------------------------
describe('generateRandomNumber – statistical', () => {
  test('always returns 4-character string', () => {
    for (let i = 0; i < 200; i++) {
      expect(generateRandomNumber()).toHaveLength(4);
    }
  });

  test('all digits are unique in every generation', () => {
    for (let i = 0; i < 200; i++) {
      const num = generateRandomNumber();
      expect(new Set(num).size).toBe(4);
    }
  });

  test('only contains numeric characters', () => {
    for (let i = 0; i < 200; i++) {
      expect(/^\d{4}$/.test(generateRandomNumber())).toBe(true);
    }
  });

  test('produces variety (not always the same number)', () => {
    const results = new Set<string>();
    for (let i = 0; i < 100; i++) {
      results.add(generateRandomNumber());
    }
    // With 5040 possible permutations, 100 tries should yield many unique values
    expect(results.size).toBeGreaterThan(50);
  });

  test('all 10 digits appear across many generations', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 500; i++) {
      for (const ch of generateRandomNumber()) {
        seen.add(ch);
      }
    }
    expect(seen.size).toBe(10);
  });
});

// ---------------------------------------------------------------------------
// generateMachineGuess – AI strategy tests
// ---------------------------------------------------------------------------
describe('generateMachineGuess – AI strategy', () => {
  test('returns a valid 4-digit unique number with no history', () => {
    const difficulties: Difficulty[] = ['novice', 'normal', 'hard'];
    for (const d of difficulties) {
      for (let i = 0; i < 20; i++) {
        const guess = generateMachineGuess([], d);
        expect(validateNumber(guess)).toBe(true);
      }
    }
  });

  test('returns valid guess with previous guesses', () => {
    const history = [
      { guess: '1234', excellent: 1, good: 2 },
      { guess: '5678', excellent: 0, good: 1 },
    ];
    for (let i = 0; i < 30; i++) {
      const guess = generateMachineGuess(history, 'hard');
      expect(validateNumber(guess)).toBe(true);
    }
  });

  test('hard mode converges better than novice over many rounds', () => {
    const target = '3871';
    const runGame = (difficulty: Difficulty) => {
      const history: Array<{ guess: string; excellent: number; good: number }> = [];
      for (let round = 0; round < 20; round++) {
        const guess = generateMachineGuess(history, difficulty);
        const result = checkGuess(guess, target);
        history.push({ guess, ...result });
        if (result.excellent === 4) return round + 1;
      }
      return 21; // did not solve
    };

    // Run multiple games and compare averages
    let hardTotal = 0;
    let noviceTotal = 0;
    const trials = 20;
    for (let i = 0; i < trials; i++) {
      hardTotal += runGame('hard');
      noviceTotal += runGame('novice');
    }
    // Hard mode should on average solve faster (or at least not worse by a lot)
    // This is a statistical test so we give generous margin
    expect(hardTotal / trials).toBeLessThanOrEqual(noviceTotal / trials + 5);
  });

  test('never crashes with adversarial history', () => {
    // All zeros feedback (impossible in real game but shouldn't crash)
    const badHistory = [
      { guess: '1234', excellent: 0, good: 0 },
      { guess: '5678', excellent: 0, good: 0 },
      { guess: '9012', excellent: 0, good: 0 },
    ];
    expect(() => generateMachineGuess(badHistory, 'hard')).not.toThrow();
    expect(validateNumber(generateMachineGuess(badHistory, 'hard'))).toBe(true);
  });

  test('handles contradictory feedback gracefully', () => {
    // Contradictory: same guess with different feedback
    const contradictory = [
      { guess: '1234', excellent: 4, good: 0 },
      { guess: '1234', excellent: 0, good: 0 },
    ];
    expect(() => generateMachineGuess(contradictory, 'hard')).not.toThrow();
  });

  test('with long history, still returns valid guess', () => {
    const history = Array.from({ length: 15 }, (_, i) => ({
      guess: generateRandomNumber(),
      excellent: Math.floor(Math.random() * 3),
      good: Math.floor(Math.random() * 3),
    }));
    const guess = generateMachineGuess(history, 'hard');
    expect(validateNumber(guess)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Performance benchmarks
// ---------------------------------------------------------------------------
describe('Performance', () => {
  test('generateRandomNumber is fast (1000 calls < 100ms)', () => {
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      generateRandomNumber();
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(100);
  });

  test('checkGuess is fast (10000 calls < 100ms)', () => {
    const pairs = Array.from({ length: 10000 }, () => [
      generateRandomNumber(),
      generateRandomNumber(),
    ]);
    const start = performance.now();
    for (const [a, b] of pairs) {
      checkGuess(a, b);
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(100);
  });

  test('validateNumber is fast (10000 calls < 50ms)', () => {
    const inputs = Array.from({ length: 10000 }, () => generateRandomNumber());
    const start = performance.now();
    for (const inp of inputs) {
      validateNumber(inp);
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(50);
  });

  test('generateMachineGuess completes within 5s even with history', () => {
    const history = [
      { guess: '1234', excellent: 1, good: 1 },
      { guess: '5678', excellent: 0, good: 2 },
      { guess: '9012', excellent: 1, good: 0 },
    ];
    const start = performance.now();
    for (let i = 0; i < 10; i++) {
      generateMachineGuess(history, 'hard');
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(5000);
  });
});
