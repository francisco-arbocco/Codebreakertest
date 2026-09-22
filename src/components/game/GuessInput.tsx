
import { Button } from '../ui/button';
import { useEffect, useState, useCallback } from 'react';
import { toast } from '../ui/use-toast';

interface GuessInputProps {
  userGuess: string;
  onGuessChange: (guess: string) => void;
  onSubmitGuess: () => void;
  scratchedNumbers?: number[];
}

const GuessInput = ({ userGuess, onGuessChange, onSubmitGuess, scratchedNumbers = [] }: GuessInputProps) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [currentPosition, setCurrentPosition] = useState(0);

  useEffect(() => {
    onGuessChange(digits.join(''));
  }, [digits, onGuessChange]);

  const isFilled = digits.every(d => d !== '');

  const handleNumberClick = useCallback((num: number) => {
    if (digits.includes(num.toString())) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Each digit can only be used once!",
      });
      return;
    }

    const newDigits = [...digits];
    newDigits[currentPosition] = num.toString();
    setDigits(newDigits);

    if (currentPosition < 3) {
      setCurrentPosition(prev => prev + 1);
    }
  }, [digits, currentPosition]);

  const handleClear = useCallback(() => {
    setDigits(['', '', '', '']);
    setCurrentPosition(0);
  }, []);

  const handleBackspace = useCallback(() => {
    if (digits[currentPosition] !== '') {
      const newDigits = [...digits];
      newDigits[currentPosition] = '';
      setDigits(newDigits);
    } else if (currentPosition > 0) {
      const newDigits = [...digits];
      newDigits[currentPosition - 1] = '';
      setDigits(newDigits);
      setCurrentPosition(prev => prev - 1);
    }
  }, [digits, currentPosition]);

  const handleSubmit = useCallback(() => {
    onSubmitGuess();
    setDigits(['', '', '', '']);
    setCurrentPosition(0);
  }, [onSubmitGuess]);

  const handleBoxClick = (index: number) => {
    setCurrentPosition(index);
  };

  // Keyboard support: digits 0-9, Backspace, Enter, Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleNumberClick(parseInt(e.key, 10));
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Enter' && isFilled) {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumberClick, handleBackspace, handleSubmit, handleClear, isFilled]);

  return (
    <div
      className="sticky bottom-0 bg-background pt-2 border-t-2 border-primary"
      role="group"
      aria-label="Guess input"
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-center gap-2" role="group" aria-label="Code digits">
          {digits.map((digit, index) => (
            <div
              key={index}
              role="button"
              tabIndex={0}
              aria-label={`Digit position ${index + 1}: ${digit || 'empty'}`}
              className={`w-12 h-12 flex items-center justify-center bg-background border-2 ${
                index === currentPosition ? 'border-primary-foreground' : 'border-primary'
              } text-primary rounded-none select-none cursor-pointer`}
              onClick={() => handleBoxClick(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleBoxClick(index);
              }}
            >
              {digit || '_'}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto" role="group" aria-label="Number pad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
            <Button
              key={num}
              onClick={() => handleNumberClick(num)}
              disabled={digits.includes(num.toString()) || scratchedNumbers.includes(num)}
              variant="outline"
              aria-label={`${num}`}
              className={`h-12 text-lg rounded-none border-2 hover:bg-primary hover:text-primary-foreground ${
                digits.includes(num.toString()) || scratchedNumbers.includes(num) ? 'opacity-50' : ''
              }`}
            >
              {num}
            </Button>
          ))}
          <Button
            onClick={handleClear}
            variant="outline"
            aria-label="Clear all digits"
            className="h-12 rounded-none border-2"
          >
            Clear
          </Button>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full rounded-none border-2 border-primary"
          disabled={!isFilled}
          aria-label="Submit guess"
        >
          Submit Guess
        </Button>
        <p className="text-xs text-muted-foreground text-center" aria-live="polite">
          Type digits, Backspace to delete, Enter to submit, Esc to clear
        </p>
      </div>
    </div>
  );
};

export default GuessInput;
