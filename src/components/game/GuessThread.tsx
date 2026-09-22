
import { Shield, Biohazard } from 'lucide-react';
import { useState, useEffect } from 'react';

type GuessResult = {
  guess: string;
  excellent: number;
  good: number;
};

interface GuessThreadProps {
  userGuesses: GuessResult[];
  machineGuesses: GuessResult[];
  machineThinking: boolean;
}

const GuessThread = ({ userGuesses, machineGuesses, machineThinking }: GuessThreadProps) => {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    if (!machineThinking) {
      setDots('');
      return;
    }
    
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [machineThinking]);

  const turns = Math.max(userGuesses.length, machineGuesses.length);
  const turnArray = Array.from({ length: turns }, (_, i) => ({
    userGuess: userGuesses[i],
    machineGuess: machineGuesses[i],
  }));

  return (
    <div className="flex-1 overflow-y-auto mb-4 space-y-5 font-mono">
      {turnArray.map((turn, index) => (
        <div key={index} className="flex flex-col gap-3">
          {turn.userGuess && (
            <div className="flex justify-end">
              <div className="max-w-[80%] bg-secondary border-2 border-primary text-primary rounded-none p-3">
                <div className="flex items-center gap-2 text-sm mb-1">
                  <span>You</span>
                  <Shield className="w-4 h-4" />
                </div>
                <div className="font-mono">{turn.userGuess.guess}</div>
                <div className="text-sm opacity-80">
                  Excellent: {turn.userGuess.excellent} | Good: {turn.userGuess.good}
                </div>
              </div>
            </div>
          )}
          
          {turn.machineGuess && (
            <div className="flex justify-start">
              <div className="max-w-[80%] bg-secondary/10 border border-secondary text-secondary-foreground rounded-none p-3">
                <div className="flex items-center gap-2 text-sm mb-1">
                  <Biohazard className="w-4 h-4" />
                  <span>Virus</span>
                </div>
                <div className="font-mono">{turn.machineGuess.guess}</div>
                <div className="text-sm opacity-80">
                  Excellent: {turn.machineGuess.excellent} | Good: {turn.machineGuess.good}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {machineThinking && (
        <div className="flex justify-start">
          <div className="max-w-[80%] bg-secondary/10 border border-secondary rounded-none p-3">
            <div className="flex items-center gap-2 text-sm mb-1">
              <Biohazard className="w-4 h-4" />
              <span>Virus</span>
            </div>
            <div className="font-mono text-primary">CALCULATING{dots}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuessThread;
