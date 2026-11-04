import { describe, it, expect } from 'vitest';
import { checkGuess } from '../GameLogic';

describe('scoring regression guard', () => {
  it('counts exact matches', () => {
    expect(checkGuess('1234', '1234').excellent).toBe(4);
  });

  it('counts a partial match correctly', () => {
    // Regression: off-by-one in the partial-match counter
    expect(checkGuess('1234', '1243').good).toBe(3);
  });
});
