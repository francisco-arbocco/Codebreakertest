import { validateNumber, checkGuess, generateRandomNumber } from '../GameLogic';

describe('GameLogic', () => {
  test('validateNumber validates 4 unique digits', () => {
    expect(validateNumber('1234')).toBe(true);
    expect(validateNumber('1123')).toBe(false);
    expect(validateNumber('123')).toBe(false);
    expect(validateNumber('abcd')).toBe(false);
  });

  test('checkGuess calculates excellent and good', () => {
    const target = '1234';
    expect(checkGuess('1234', target)).toEqual({ excellent: 4, good: 0 });
    expect(checkGuess('1243', target)).toEqual({ excellent: 2, good: 2 });
    expect(checkGuess('5678', target)).toEqual({ excellent: 0, good: 0 });
  });

  test('generateRandomNumber returns 4 unique digits', () => {
    const num = generateRandomNumber();
    expect(num).toHaveLength(4);
    expect(/^[0-9]{4}$/.test(num)).toBe(true);
    expect(new Set(num).size).toBe(4);
  });
});
