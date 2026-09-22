export type Difficulty = 'novice' | 'normal' | 'hard';

export const generateRandomNumber = () => {
  const numbers = Array.from({ length: 10 }, (_, i) => i);
  let result = '';
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    result += numbers[randomIndex];
    numbers.splice(randomIndex, 1);
  }
  return result;
};

export const validateNumber = (number: string) => {
  return number.length === 4 && 
         new Set(number).size === 4 && 
         /^\d+$/.test(number);
};

export const checkGuess = (guess: string, target: string) => {
  let excellent = 0;
  let good = 0;
  
  // Create arrays to track which positions have been used
  const guessUsed = new Array(4).fill(false);
  const targetUsed = new Array(4).fill(false);
  
  // First pass: Check for excellent matches
  for (let i = 0; i < 4; i++) {
    if (guess[i] === target[i]) {
      excellent++;
      guessUsed[i] = true;
      targetUsed[i] = true;
    }
  }
  
  // Second pass: Check for good matches (only among unused digits)
  for (let i = 0; i < 4; i++) {
    if (!guessUsed[i]) { // Only check if this guess position hasn't been used
      for (let j = 0; j < 4; j++) {
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

export const generateMachineGuess = (
  previousGuesses: Array<{guess: string; excellent: number; good: number}>,
  difficulty: Difficulty
) => {
  const randomGuessChance = {
    novice: 0.5,    // 50% chance of random guess
    normal: 0.3,    // 30% chance of random guess
    hard: 0.1       // 10% chance of random guess
  };

  const ignoreChance = {
    novice: 0.3,    // 30% chance to ignore feedback
    normal: 0.2,    // 20% chance to ignore feedback
    hard: 0.05      // 5% chance to ignore feedback
  };

  const guessesToConsider = {
    novice: 1,      // Only consider last guess
    normal: 2,      // Consider last 2 guesses
    hard: 999       // Consider all guesses
  };

  if (Math.random() < randomGuessChance[difficulty]) {
    return generateRandomNumber();
  }

  let possibleNumbers = [];
  const digits = Array.from({ length: 10 }, (_, i) => i.toString());
  
  const generateCombinations = (current: string, remaining: string[]) => {
    if (current.length === 4) {
      possibleNumbers.push(current);
      return;
    }
    for (let i = 0; i < remaining.length; i++) {
      const newCurrent = current + remaining[i];
      const newRemaining = [...remaining.slice(0, i), ...remaining.slice(i + 1)];
      generateCombinations(newCurrent, newRemaining);
    }
  };
  
  generateCombinations('', digits);
  
  const recentGuesses = previousGuesses.slice(-guessesToConsider[difficulty]);
  
  recentGuesses.forEach(prevGuess => {
    possibleNumbers = possibleNumbers.filter(num => {
      if (Math.random() < ignoreChance[difficulty]) {
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
