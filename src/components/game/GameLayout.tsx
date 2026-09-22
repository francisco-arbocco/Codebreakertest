import { Button } from '../ui/button';
import GuessThread from './GuessThread';
import NumberScratchPad from './NumberScratchPad';
import GuessInput from './GuessInput';
import InstructionsModal from './InstructionsModal';
import { useIsMobile } from '@/hooks/use-mobile';
import AgentComment from './AgentComment';

interface GameLayoutProps {
  userGuesses: Array<{ guess: string; excellent: number; good: number }>;
  machineGuesses: Array<{ guess: string; excellent: number; good: number }>;
  machineThinking: boolean;
  userWon: boolean;
  machineWon: boolean;
  showMachineWinBanner: boolean;
  showUserWinBanner: boolean;
  userGuess: string;
  onGuessChange: (guess: string) => void;
  onSubmitGuess: () => void;
  scratchedNumbers: number[];
  onToggleNumber: (number: number) => void;
  onReturnToGame: () => void;
  agentComment: string;
  onDigitBeep?: () => void;
  onSubmitSound?: () => void;
  onClearSound?: () => void;
  onErrorSound?: () => void;
}

const GameLayout = ({
  userGuesses,
  machineGuesses,
  machineThinking,
  userWon,
  machineWon,
  showMachineWinBanner,
  showUserWinBanner,
  userGuess,
  onGuessChange,
  onSubmitGuess,
  scratchedNumbers,
  onToggleNumber,
  onReturnToGame,
  agentComment,
  onDigitBeep,
  onSubmitSound,
  onClearSound,
  onErrorSound,
}: GameLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col h-full">
      <InstructionsModal />
      
      {machineWon && !userWon && showMachineWinBanner && (
        <div className="absolute inset-0 z-10 bg-background/95 flex items-center justify-center">
          <div className="text-center p-4 border-2 border-primary">
            <h2 className="text-xl font-bold text-primary mb-2">The virus has cracked your security code!</h2>
            <p className="text-primary mb-4">One last chance to stop the launch - crack their code!</p>
            <Button onClick={onReturnToGame} variant="outline" className="mt-2">
              Return to Terminal
            </Button>
          </div>
        </div>
      )}

      {userWon && !machineWon && showUserWinBanner && (
        <div className="absolute inset-0 z-10 bg-background/95 flex items-center justify-center">
          <div className="text-center p-4 border-2 border-primary">
            <h2 className="text-xl font-bold text-primary mb-2">Virus Signature Identified!</h2>
            <p className="text-primary mb-4">Waiting for final trace attempt...</p>
            <Button onClick={onReturnToGame} variant="outline" className="mt-2">
              Return to Terminal
            </Button>
          </div>
        </div>
      )}

      <div className="grid h-full grid-cols-2">
        {/* Guess thread section */}
        <div className="h-full border-r border-primary relative overflow-hidden">
          <div className="absolute inset-0 overflow-y-auto">
            <div className="p-4">
              <GuessThread
                userGuesses={userGuesses}
                machineGuesses={machineGuesses}
                machineThinking={machineThinking}
              />
            </div>
          </div>
        </div>

        {/* Input section */}
        <div className="h-full p-4 flex flex-col">
          <div className="mb-4">
            <NumberScratchPad
              scratchedNumbers={scratchedNumbers}
              onToggleNumber={onToggleNumber}
            />
          </div>

          {/* AI Agent Comment */}
          <AgentComment comment={agentComment} />

          {(!userWon || machineWon) && (
            <div className="mt-auto">
              <GuessInput
                userGuess={userGuess}
                onGuessChange={onGuessChange}
                onSubmitGuess={onSubmitGuess}
                scratchedNumbers={scratchedNumbers}
                onDigitBeep={onDigitBeep}
                onSubmitSound={onSubmitSound}
                onClearSound={onClearSound}
                onErrorSound={onErrorSound}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameLayout;
