import { describe, test, expect } from 'vitest';
import {
  validateNumber,
  checkGuess,
  generateRandomNumber,
  generateMachineGuess,
} from '../GameLogic';

/**
 * Stress / performance tests.
 * These push the game logic to its limits to find regressions and
 * ensure CI resource constraints are handled properly.
 */

describe('Stress – generateRandomNumber bulk generation', () => {
  test('generate 5000 numbers – all valid, decent uniqueness', () => {
    const results = new Set<string>();
    for (let i = 0; i < 5000; i++) {
      const num = generateRandomNumber();
      expect(num).toHaveLength(4);
      expect(new Set(num).size).toBe(4);
      results.add(num);
    }
    // There are 5040 possible 4-digit codes with unique digits
    // 5000 draws should hit at least 2000 unique values
    expect(results.size).toBeGreaterThan(2000);
  });
});

describe('Stress – checkGuess exhaustive pair sampling', () => {
  test('check 50,000 random pairs without error', () => {
    let count = 0;
    for (let i = 0; i < 50000; i++) {
      const a = generateRandomNumber();
      const b = generateRandomNumber();
      const { excellent, good } = checkGuess(a, b);
      expect(excellent + good).toBeLessThanOrEqual(4);
      count++;
    }
    expect(count).toBe(50000);
  });
});

describe('Stress – AI solver under load', () => {
  test('run 30 full AI games (hard) – all complete within limits', () => {
    const maxRounds = 25;
    const games = 30;
    let totalRounds = 0;
    let solved = 0;

    const start = performance.now();
    for (let g = 0; g < games; g++) {
      const target = generateRandomNumber();
      const history: Array<{ guess: string; excellent: number; good: number }> = [];
      for (let r = 0; r < maxRounds; r++) {
        const guess = generateMachineGuess(history, 'hard');
        const result = checkGuess(guess, target);
        history.push({ guess, ...result });
        totalRounds++;
        if (result.excellent === 4) {
          solved++;
          break;
        }
      }
    }
    const elapsed = performance.now() - start;

    // Should complete all 30 games in under 60 seconds
    expect(elapsed).toBeLessThan(60000);
    // Hard AI should solve at least some games
    expect(solved).toBeGreaterThan(0);
    expect(totalRounds).toBeGreaterThan(games); // at least 1 round per game
  });

  test('run 30 full AI games (novice) – validate all guesses', () => {
    const games = 30;
    const maxRounds = 30;

    for (let g = 0; g < games; g++) {
      const target = generateRandomNumber();
      const history: Array<{ guess: string; excellent: number; good: number }> = [];
      for (let r = 0; r < maxRounds; r++) {
        const guess = generateMachineGuess(history, 'novice');
        expect(validateNumber(guess)).toBe(true);
        const result = checkGuess(guess, target);
        history.push({ guess, ...result });
        if (result.excellent === 4) break;
      }
    }
  });
});

describe('Stress – validation throughput', () => {
  test('validate 100,000 inputs (mix of valid and invalid)', () => {
    const inputs: string[] = [];
    for (let i = 0; i < 50000; i++) {
      inputs.push(generateRandomNumber()); // valid
    }
    for (let i = 0; i < 50000; i++) {
      // Generate intentionally invalid inputs
      const type = i % 5;
      switch (type) {
        case 0: inputs.push('1123'); break;        // dup
        case 1: inputs.push('abc'); break;          // non-numeric
        case 2: inputs.push('12345'); break;        // too long
        case 3: inputs.push('12'); break;           // too short
        case 4: inputs.push('11' + String(i % 10) + String((i + 1) % 10)); break; // dup
      }
    }

    const start = performance.now();
    let validCount = 0;
    for (const inp of inputs) {
      if (validateNumber(inp)) validCount++;
    }
    const elapsed = performance.now() - start;

    expect(validCount).toBe(50000);
    expect(elapsed).toBeLessThan(1000); // 100k validations under 1 second
  });
});

describe('Stress – memory pressure (large history)', () => {
  test('AI handles 100-entry history without OOM or timeout', () => {
    const history: Array<{ guess: string; excellent: number; good: number }> = [];
    for (let i = 0; i < 100; i++) {
      history.push({
        guess: generateRandomNumber(),
        excellent: Math.floor(Math.random() * 3),
        good: Math.floor(Math.random() * 3),
      });
    }

    const start = performance.now();
    const guess = generateMachineGuess(history, 'hard');
    const elapsed = performance.now() - start;

    expect(validateNumber(guess)).toBe(true);
    expect(elapsed).toBeLessThan(30000); // under 30s even with huge history
  });
});

describe('Determinism – seeded random sanity check', () => {
  test('same seed produces same results (mock Math.random)', () => {
    // Simple LCG for reproducibility
    let seed = 42;
    const lcg = () => {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      return (seed >>> 0) / 0xffffffff;
    };

    const originalRandom = Math.random;
    Math.random = lcg;

    const results1: string[] = [];
    seed = 42;
    for (let i = 0; i < 10; i++) {
      results1.push(generateRandomNumber());
    }

    const results2: string[] = [];
    seed = 42;
    for (let i = 0; i < 10; i++) {
      results2.push(generateRandomNumber());
    }

    Math.random = originalRandom;

    expect(results1).toEqual(results2);
  });
});
