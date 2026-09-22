import { Button } from './ui/button';
import GameSetup from './game/GameSetup';
import DifficultySelector from './game/DifficultySelector';
import GameLayout from './game/GameLayout';
import DosAnimation from './game/DosAnimation';
import SplashScreen from './game/SplashScreen';
import { Dialog } from './ui/dialog';
import InstructionsModal from './game/InstructionsModal';
import GameOverMenu from './game/GameOverMenu';
import { useGameState } from './game/useGameState';
import { useGameActions } from './game/useGameActions';
import { useIsMobile } from '@/hooks/use-mobile';
import AgentComment from './game/AgentComment';
import { useGameStats } from './game/useGameStats';
import { useSoundEffects } from './game/useSoundEffects';
import { useState, useEffect, useRef } from 'react';

const NumberGame = () => {
  const gameState = useGameState();
  const gameActions = useGameActions(gameState);
  const isMobile = useIsMobile();
  const { stats, recordGame } = useGameStats();
  const sfx = useSoundEffects();
  const hasRecordedRef = useRef(false);

  // Record game result when game over screen appears
  useEffect(() => {
    if (gameState.showGameOver && !hasRecordedRef.current) {
      hasRecordedRef.current = true;
      const won = !gameState.machineWon;
      const rounds = Math.max(gameState.userGuesses.length, gameState.machineGuesses.length);
      recordGame(won, gameState.difficulty, rounds);
      if (won) sfx.win(); else sfx.lose();
    }
    if (!gameState.showGameOver) {
      hasRecordedRef.current = false;
    }
  }, [gameState.showGameOver, gameState.machineWon, gameState.userGuesses.length, gameState.machineGuesses.length, gameState.difficulty, recordGame]);

  // AI Agent comment state
  const [agentComment, setAgentComment] = useState('');

  // Generate 80's style threatening comments
  useEffect(() => {
    if (gameState.userGuesses.length === 0) {
      setAgentComment("[VIRUS AI] Ready to be humiliated? Enter your first guess, meatbag.");
      return;
    }
    const lastGuess = gameState.userGuesses[gameState.userGuesses.length - 1];
    if (!lastGuess) return;
    const { excellent, good } = lastGuess;
    if (excellent === 4) {
      setAgentComment("[VIRUS AI] Impossible! You cracked the code... this isn't over!");
    } else if (excellent === 3) {
      setAgentComment("[VIRUS AI] You're getting close, but close won't stop the launch!");
    } else if (excellent === 2) {
      setAgentComment("[VIRUS AI] Not bad, but you'll need more than luck to beat me.");
    } else if (excellent === 1) {
      setAgentComment("[VIRUS AI] One digit right? Pathetic. The world is doomed!");
    } else {
      setAgentComment("[VIRUS AI] All wrong! Did you even try? The clock is ticking...");
    }
  }, [gameState.userGuesses, gameState.userWon]);

  const handleInstructionsClose = () => {
    gameState.setShowInstructions(false);
    gameState.setGameStarted(true);
    gameState.setUserGuesses([]);
    gameState.setMachineGuesses([]);
  };

  const handleSetUserNumber = (number: string) => {
    gameState.setUserNumber(number);
    gameState.setSetupComplete(true);
  };

  const handleAnimationComplete = () => {
    gameState.setShowEnding(false);
    gameState.setShowGameOver(true);
  };

  const handleTryAgain = () => {
    gameState.setUserNumber('');
    gameState.setSetupComplete(false);
    gameState.setShowGameOver(false);
    gameState.setDifficultySelected(false);
    gameState.setGameStarted(false);
    gameState.setUserGuesses([]);
    gameState.setMachineGuesses([]);
    gameState.setScratchedNumbers([]);
    gameState.setMachineWon(false);
    gameState.setUserWon(false);
    gameState.setFinalGuessAllowed(false);
    gameState.setShowMachineWinBanner(false);
    gameState.setShowUserWinBanner(false);
  };

  if (gameState.showSplash) {
    return <SplashScreen onComplete={() => gameState.setShowSplash(false)} />;
  }

  if (gameState.showIntro) {
    return <DosAnimation type="intro" onComplete={() => gameState.setShowIntro(false)} />;
  }

  if (gameState.showEnding) {
    return (
      <DosAnimation 
        type={gameState.machineWon ? 'nuclear-launch' : 'victory'} 
        onComplete={handleAnimationComplete}
        originCountry={gameState.originCountry}
      />
    );
  }

  if (gameState.showGameOver) {
    return (
      <GameOverMenu
        won={!gameState.machineWon}
        onRestart={gameActions.startGame}
        onTryAgain={handleTryAgain}
        rounds={Math.max(gameState.userGuesses.length, gameState.machineGuesses.length)}
        stats={stats}
      />
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto min-h-screen flex flex-col">
      <div className={`mb-4 space-y-2 ${isMobile ? 'hidden' : ''}`}>
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">Missile Defense System</h1>
          <Button onClick={gameActions.startGame}>Emergency Reboot</Button>
        </div>
      </div>

      {isMobile && (
        <div className="fixed top-2 right-2 z-10">
          <Button size="sm" onClick={gameActions.startGame} className="h-8 text-xs px-2">
            Reboot
          </Button>
        </div>
      )}

      {!gameState.setupComplete && !gameState.gameStarted && (
        <GameSetup onSetUserNumber={handleSetUserNumber} />
      )}

      {gameState.setupComplete && !gameState.difficultySelected && (
        <DifficultySelector onSelectDifficulty={gameActions.handleSelectDifficulty} />
      )}

      {gameState.difficultySelected && gameState.showInstructions && (
        <Dialog open={gameState.showInstructions} onOpenChange={handleInstructionsClose}>
          <InstructionsModal onClose={handleInstructionsClose} />
        </Dialog>
      )}

      {(gameState.gameStarted || gameState.difficultySelected) && !gameState.showInstructions && (
        <GameLayout
          userGuesses={gameState.userGuesses}
          machineGuesses={gameState.machineGuesses}
          machineThinking={gameState.machineThinking}
          userWon={gameState.userWon}
          machineWon={gameState.machineWon}
          showMachineWinBanner={gameState.showMachineWinBanner}
          showUserWinBanner={gameState.showUserWinBanner}
          userGuess={gameState.userGuess}
          onGuessChange={gameState.setUserGuess}
          onSubmitGuess={gameActions.handleUserGuess}
          scratchedNumbers={gameState.scratchedNumbers}
          onToggleNumber={gameActions.toggleScratchNumber}
          onReturnToGame={() => {
            gameState.setShowMachineWinBanner(false);
            gameState.setShowUserWinBanner(false);
          }}
          agentComment={agentComment}
          onDigitBeep={sfx.digitBeep}
          onSubmitSound={sfx.submit}
          onClearSound={sfx.clear}
          onErrorSound={sfx.error}
        />
      )}
    </div>
  );
};

export default NumberGame;
