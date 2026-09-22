
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
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

  const handleNumberClick = (num: number) => {
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
  };

  const handleClear = () => {
    setDigits(['', '', '', '']);
    setCurrentPosition(0);
  };

  const handleSubmit = () => {
    onSubmitGuess();
    setDigits(['', '', '', '']);
    setCurrentPosition(0);
  };

  const handleBoxClick = (index: number) => {
    setCurrentPosition(index);
  };

  return (
    <div className="sticky bottom-0 bg-background pt-2 border-t-2 border-primary">
      <div className="flex flex-col gap-4">
        <div className="flex justify-center gap-2">
          {digits.map((digit, index) => (
            <div
              key={index}
              className={`w-12 h-12 flex items-center justify-center bg-background border-2 ${
                index === currentPosition ? 'border-primary-foreground' : 'border-primary'
              } text-primary rounded-none select-none cursor-pointer`}
              onClick={() => handleBoxClick(index)}
            >
              {digit || '_'}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
            <Button
              key={num}
              onClick={() => handleNumberClick(num)}
              disabled={digits.includes(num.toString()) || scratchedNumbers.includes(num)}
              variant="outline"
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
            className="h-12 rounded-none border-2"
          >
            Clear
          </Button>
        </div>
        
        <Button 
          onClick={handleSubmit} 
          className="w-full rounded-none border-2 border-primary"
          disabled={!digits.every(d => d !== '')}
        >
          Submit Guess
        </Button>
      </div>
    </div>
  );
};

export default GuessInput;
