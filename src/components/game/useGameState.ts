
import { useState, useEffect } from 'react';
import { type Difficulty } from './GameLogic';

export type GuessResult = {
  guess: string;
  excellent: number;
  good: number;
};

const POSSIBLE_ORIGINS = ['Russia', 'Iran', 'North Korea', 'Unknown Location'];

export const useGameState = () => {
  const [scratchedNumbers, setScratchedNumbers] = useState<number[]>([]);
  const [userGuess, setUserGuess] = useState('');
  const [userNumber, setUserNumber] = useState('');
  const [userGuesses, setUserGuesses] = useState<GuessResult[]>([]);
  const [machineGuesses, setMachineGuesses] = useState<GuessResult[]>([]);
  const [targetNumber, setTargetNumber] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [machineThinking, setMachineThinking] = useState(false);
  const [originCountry, setOriginCountry] = useState(POSSIBLE_ORIGINS[0]);
  const [showSplash, setShowSplash] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [showEnding, setShowEnding] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [difficultySelected, setDifficultySelected] = useState(false);
  const [userWon, setUserWon] = useState(false);
  const [machineWon, setMachineWon] = useState(false);
  const [finalGuessAllowed, setFinalGuessAllowed] = useState(false);
  const [showMachineWinBanner, setShowMachineWinBanner] = useState(false);
  const [showUserWinBanner, setShowUserWinBanner] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * POSSIBLE_ORIGINS.length);
    setOriginCountry(POSSIBLE_ORIGINS[randomIndex]);
  }, [userGuesses, machineGuesses]);

  return {
    scratchedNumbers,
    setScratchedNumbers,
    userGuess,
    setUserGuess,
    userNumber,
    setUserNumber,
    userGuesses,
    setUserGuesses,
    machineGuesses,
    setMachineGuesses,
    targetNumber,
    setTargetNumber,
    difficulty,
    setDifficulty,
    machineThinking,
    setMachineThinking,
    originCountry,
    showSplash,
    setShowSplash,
    showIntro,
    setShowIntro,
    showEnding,
    setShowEnding,
    showGameOver,
    setShowGameOver,
    gameStarted,
    setGameStarted,
    setupComplete,
    setSetupComplete,
    difficultySelected,
    setDifficultySelected,
    userWon,
    setUserWon,
    machineWon,
    setMachineWon,
    finalGuessAllowed,
    setFinalGuessAllowed,
    showMachineWinBanner,
    setShowMachineWinBanner,
    showUserWinBanner,
    setShowUserWinBanner,
    showInstructions,
    setShowInstructions,
  };
};
