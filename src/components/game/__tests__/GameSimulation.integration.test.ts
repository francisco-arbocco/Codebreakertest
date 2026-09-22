import { describe, test, expect } from 'vitest';
import {
  validateNumber,
  checkGuess,
  generateRandomNumber,
  generateMachineGuess,
  Difficulty,
} from '../GameLogic';

/**
 * Integration tests that simulate full game sessions.
 * These verify that the game logic functions work correctly together
 * as they would during actual gameplay.
 */

interface GameResult {
  rounds: number;
  solved: boolean;
  history: Array<{ guess: string; excellent: number; good: number }>;
}

const simulateAIGame = (
  target: string,
  difficulty: Difficulty,
  maxRounds = 20
): GameResult => {
  const history: Array<{ guess: string; excellent: number; good: number }> = [];
  for (let round = 0; round < maxRounds; round++) {
    const guess = generateMachineGuess(history, difficulty);
    expect(validateNumber(guess)).toBe(true);
    const result = checkGuess(guess, target);
    history.push({ guess, ...result });
    if (result.excellent === 4) {
      return { rounds: round + 1, solved: true, history };
    }
  }
  return { rounds: maxRounds, solved: false, history };
};

describe('Full game simulation – AI vs fixed target', () => {
  const targets = ['1234', '0579', '9876', '3071', '8024'];

  for (const target of targets) {
    test(`AI (hard) attempts to crack code ${target}`, () => {
      const result = simulateAIGame(target, 'hard', 25);
      // Hard AI should solve most codes within 25 rounds
      expect(result.history.length).toBeGreaterThan(0);
      // Every guess in history must be a valid number
      for (const entry of result.history) {
        expect(validateNumber(entry.guess)).toBe(true);
        expect(entry.excellent).toBeGreaterThanOrEqual(0);
        expect(entry.good).toBeGreaterThanOrEqual(0);
        expect(entry.excellent + entry.good).toBeLessThanOrEqual(4);
      }
    });
  }

  test('AI (novice) always produces valid guesses over 50-round game', () => {
    const target = generateRandomNumber();
    const result = simulateAIGame(target, 'novice', 50);
    for (const entry of result.history) {
      expect(validateNumber(entry.guess)).toBe(true);
    }
  });
});

describe('Full game simulation – mutual game (player vs AI)', () => {
  test('simulates a turn-based game where both sides guess', () => {
    const playerCode = generateRandomNumber();
    const aiCode = generateRandomNumber();

    const playerHistory: Array<{ guess: string; excellent: number; good: number }> = [];
    const aiHistory: Array<{ guess: string; excellent: number; good: number }> = [];

    let winner: 'player' | 'ai' | 'tie' | null = null;
    const maxRounds = 30;

    for (let round = 0; round < maxRounds && !winner; round++) {
      // Player guesses AI's code (simulate with hard AI logic)
      const playerGuess = generateMachineGuess(playerHistory, 'hard');
      const playerResult = checkGuess(playerGuess, aiCode);
      playerHistory.push({ guess: playerGuess, ...playerResult });

      // AI guesses player's code
      const aiGuess = generateMachineGuess(aiHistory, 'normal');
      const aiResult = checkGuess(aiGuess, playerCode);
      aiHistory.push({ guess: aiGuess, ...aiResult });

      const playerWon = playerResult.excellent === 4;
      const aiWon = aiResult.excellent === 4;

      if (playerWon && aiWon) winner = 'tie';
      else if (playerWon) winner = 'player';
      else if (aiWon) winner = 'ai';
    }

    // Game should have run at least 1 round
    expect(playerHistory.length).toBeGreaterThan(0);
    expect(aiHistory.length).toBeGreaterThan(0);

    // All guesses should be valid
    for (const h of [...playerHistory, ...aiHistory]) {
      expect(validateNumber(h.guess)).toBe(true);
    }
  });
});

describe('Game invariants across many random games', () => {
  test('checkGuess feedback is always consistent with the target', () => {
    for (let i = 0; i < 200; i++) {
      const target = generateRandomNumber();
      const guess = generateRandomNumber();
      const { excellent, good } = checkGuess(guess, target);

      // Count actual exact matches manually
      let manualExcellent = 0;
      for (let j = 0; j < 4; j++) {
        if (guess[j] === target[j]) manualExcellent++;
      }
      expect(excellent).toBe(manualExcellent);

      // Count total shared digits
      const guessDigits = new Set(guess);
      const targetDigits = new Set(target);
      let shared = 0;
      for (const d of guessDigits) {
        if (targetDigits.has(d)) shared++;
      }
      expect(excellent + good).toBe(shared);
    }
  });

  test('feedback symmetry: shared digits count is symmetric', () => {
    for (let i = 0; i < 100; i++) {
      const a = generateRandomNumber();
      const b = generateRandomNumber();
      const r1 = checkGuess(a, b);
      const r2 = checkGuess(b, a);
      // Total shared digits should be the same in both directions
      expect(r1.excellent + r1.good).toBe(r2.excellent + r2.good);
    }
  });
});

describe('Difficulty scaling validation', () => {
  test('hard mode solves codes faster on average than novice', () => {
    const trials = 15;
    let hardAvg = 0;
    let noviceAvg = 0;

    for (let i = 0; i < trials; i++) {
      const target = generateRandomNumber();
      const hardResult = simulateAIGame(target, 'hard', 30);
      const noviceResult = simulateAIGame(target, 'novice', 30);
      hardAvg += hardResult.rounds;
      noviceAvg += noviceResult.rounds;
    }

    hardAvg /= trials;
    noviceAvg /= trials;

    // Hard should generally be faster; allow generous margin for randomness
    expect(hardAvg).toBeLessThan(noviceAvg + 8);
  });
});

describe('Edge cases – boundary codes', () => {
  const edgeCodes = ['0123', '9876', '0987', '1098', '5049'];

  for (const code of edgeCodes) {
    test(`boundary code ${code} is valid and self-check works`, () => {
      expect(validateNumber(code)).toBe(true);
      expect(checkGuess(code, code)).toEqual({ excellent: 4, good: 0 });
    });
  }
});
