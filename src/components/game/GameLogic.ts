export type Difficulty = 'novice' | 'normal' | 'hard';

/** Number of digits in a code */
export const CODE_LENGTH = 4;

/** Difficulty tuning: chance AI ignores its strategy and guesses randomly */
export const RANDOM_GUESS_CHANCE: Record<Difficulty, number> = {
  novice: 0.5,
  normal: 0.3,
  hard: 0.1,
};

/** Difficulty tuning: chance AI ignores feedback from a previous guess */
export const IGNORE_FEEDBACK_CHANCE: Record<Difficulty, number> = {
  novice: 0.3,
  normal: 0.2,
  hard: 0.05,
};

/** Difficulty tuning: how many past guesses the AI considers */
export const GUESSES_TO_CONSIDER: Record<Difficulty, number> = {
  novice: 1,
  normal: 2,
  hard: 999,
};

export const generateRandomNumber = () => {
  const numbers = Array.from({ length: 10 }, (_, i) => i);
  let result = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    result += numbers[randomIndex];
    numbers.splice(randomIndex, 1);
  }
  return result;
};

export const validateNumber = (number: string) => {
  return number.length === CODE_LENGTH &&
         new Set(number).size === CODE_LENGTH &&
         /^\d+$/.test(number);
};

export const checkGuess = (guess: string, target: string) => {
  let excellent = 0;
  let good = 0;
  
  // Create arrays to track which positions have been used
  const guessUsed = new Array(CODE_LENGTH).fill(false);
  const targetUsed = new Array(CODE_LENGTH).fill(false);

  // First pass: Check for excellent matches
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guess[i] === target[i]) {
      excellent++;
      guessUsed[i] = true;
      targetUsed[i] = true;
    }
  }
  
  // Second pass: Check for good matches (only among unused digits)
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (!guessUsed[i]) {
      for (let j = 0; j < CODE_LENGTH; j++) {
        if (!targetUsed[j] && guess[i] === target[j]) {
          good++;
          targetUsed[j] = true;
          break; // Once we find a match, stop looking for this digit
        }
      }
    }
  }
  
  return { excellent, good };
};

/** Precomputed list of all 5040 valid 4-digit codes with unique digits */
let _allPermutations: string[] | null = null;
const getAllPermutations = (): string[] => {
  if (_allPermutations) return _allPermutations;
  const result: string[] = [];
  const digits = ['0','1','2','3','4','5','6','7','8','9'];
  const generate = (current: string, remaining: string[]) => {
    if (current.length === CODE_LENGTH) {
      result.push(current);
      return;
    }
    for (let i = 0; i < remaining.length; i++) {
      generate(current + remaining[i], [...remaining.slice(0, i), ...remaining.slice(i + 1)]);
    }
  };
  generate('', digits);
  _allPermutations = result;
  return result;
};

export const generateMachineGuess = (
  previousGuesses: Array<{guess: string; excellent: number; good: number}>,
  difficulty: Difficulty
) => {
  if (Math.random() < RANDOM_GUESS_CHANCE[difficulty]) {
    return generateRandomNumber();
  }

  let possibleNumbers = [...getAllPermutations()];

  const recentGuesses = previousGuesses.slice(-GUESSES_TO_CONSIDER[difficulty]);

  recentGuesses.forEach(prevGuess => {
    possibleNumbers = possibleNumbers.filter(num => {
      if (Math.random() < IGNORE_FEEDBACK_CHANCE[difficulty]) {
        return true;
      }
      const result = checkGuess(num, prevGuess.guess);
      return result.excellent === prevGuess.excellent && result.good === prevGuess.good;
    });
  });

  if (possibleNumbers.length === 0) {
    return generateRandomNumber();
  }

  return possibleNumbers[Math.floor(Math.random() * possibleNumbers.length)];
};
