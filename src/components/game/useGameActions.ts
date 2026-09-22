
import { generateRandomNumber, validateNumber, checkGuess, generateMachineGuess, type Difficulty } from './GameLogic';
import { toast } from '@/components/ui/use-toast';
import { type GuessResult } from './useGameState';

export const useGameActions = (gameState: ReturnType<typeof import('./useGameState').useGameState>) => {
  const makeMachineGuess = () => {
    if (!gameState.gameStarted || gameState.machineThinking || gameState.showEnding) return;
    
    gameState.setMachineThinking(true);
    const delay = Math.random() * 2000 + 1000;
    
    setTimeout(() => {
      const guess = generateMachineGuess(gameState.machineGuesses, gameState.difficulty);
      const { excellent, good } = checkGuess(guess, gameState.userNumber);
      
      gameState.setMachineGuesses(prev => [...prev, { guess, excellent, good }]);
      
      if (excellent === 4) {
        gameState.setMachineWon(true);
        gameState.setShowMachineWinBanner(true);
        
        if (!gameState.userWon) {
          gameState.setFinalGuessAllowed(true);
        } else {
          gameState.setShowEnding(true);
        }
      } else if (gameState.userWon) {
        gameState.setShowEnding(true);
      }
      
      gameState.setMachineThinking(false);
    }, delay);
  };

  const handleUserGuess = () => {
    if (gameState.showEnding || (gameState.machineWon && !gameState.finalGuessAllowed)) return;

    if (!validateNumber(gameState.userGuess)) {
      toast({
        variant: "destructive",
        title: "Invalid format",
        description: "The virus code must be 4 unique digits",
      });
      return;
    }

    const { excellent, good } = checkGuess(gameState.userGuess, gameState.targetNumber);
    gameState.setUserGuesses(prev => [...prev, { guess: gameState.userGuess, excellent, good }]);
    gameState.setUserGuess('');

    if (excellent === 4) {
      gameState.setUserWon(true);
      gameState.setShowUserWinBanner(true);
      
      if (gameState.machineWon) {
        gameState.setShowEnding(true);
      } else {
        makeMachineGuess();
      }
    } else if (gameState.finalGuessAllowed) {
      gameState.setShowEnding(true);
    } else if (!gameState.machineWon) {
      makeMachineGuess();
    }
  };

  const handleSelectDifficulty = (selectedDifficulty: Difficulty) => {
    gameState.setDifficulty(selectedDifficulty);
    gameState.setDifficultySelected(true);
    gameState.setTargetNumber(generateRandomNumber());
    gameState.setShowInstructions(true);
  };

  const startGame = () => {
    gameState.setUserNumber('');
    gameState.setSetupComplete(false);
    gameState.setDifficultySelected(false);
    gameState.setGameStarted(false);
    gameState.setUserGuesses([]);
    gameState.setMachineGuesses([]);
    gameState.setScratchedNumbers([]);
    gameState.setMachineWon(false);
    gameState.setUserWon(false);
    gameState.setFinalGuessAllowed(false);
    gameState.setShowIntro(false);
    gameState.setShowMachineWinBanner(false);
    gameState.setShowUserWinBanner(false);
    gameState.setShowSplash(false);
    toast({
      title: "System Reboot",
      description: "Enter your 4-digit security code to begin.",
    });
  };

  const toggleScratchNumber = (number: number) => {
    gameState.setScratchedNumbers(prev => 
      prev.includes(number) 
        ? prev.filter(n => n !== number)
        : [...prev, number]
    );
  };

  return {
    makeMachineGuess,
    handleUserGuess,
    handleSelectDifficulty,
    startGame,
    toggleScratchNumber,
  };
};
