import { useState } from 'react';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from '../ui/use-toast';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface GameSetupProps {
  onSetUserNumber: (number: string) => void;
}

interface SortableDigitProps {
  digit: string;
  id: string;
}

const SortableDigit = ({ digit, id }: SortableDigitProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-12 h-12 flex items-center justify-center bg-background border border-input rounded-md cursor-move"
    >
      {digit}
    </div>
  );
};

const GameSetup = ({ onSetUserNumber }: GameSetupProps) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [currentDigitIndex, setCurrentDigitIndex] = useState(0);

  const validateNumber = (digits: string[]) => {
    const number = digits.join('');
    return number.length === 4 && 
           new Set(number).size === 4 && 
           /^\d+$/.test(number);
  };

  const handleDigitInput = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    
    if (value && index < 3) {
      setCurrentDigitIndex(index + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      setCurrentDigitIndex(index - 1);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = digits.findIndex((_, i) => `setup-digit-${i}` === active.id);
      const newIndex = digits.findIndex((_, i) => `setup-digit-${i}` === over.id);
      
      setDigits(prevDigits => {
        return arrayMove(prevDigits, oldIndex, newIndex);
      });
    }
  };

  const handleDialpadClick = (number: number) => {
    const emptyIndex = digits.findIndex(d => d === '');
    if (emptyIndex !== -1 && !digits.includes(number.toString())) {
      handleDigitInput(number.toString(), emptyIndex);
    }
  };

  const handleSetUserNumber = () => {
    if (!validateNumber(digits)) {
      toast({
        variant: "destructive",
        title: "Invalid number",
        description: "Please enter 4 unique digits",
      });
      return;
    }
    onSetUserNumber(digits.join(''));
  };

  const handleClear = () => {
    setDigits(['', '', '', '']);
    setCurrentDigitIndex(0);
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-xs w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-primary">Emergency Virus Decoder</h1>
          <div className="space-y-2 text-muted-foreground">
            <p>Enter a 4-digit security code - You cannot repeat digits. Break the virus's code before it cracks yours.</p>
          </div>
        </div>
        
        <div>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={digits.map((_, i) => `setup-digit-${i}`)} strategy={horizontalListSortingStrategy}>
              <div className="flex justify-center gap-2 mb-8">
                {digits.map((digit, index) => (
                  <div key={`setup-digit-${index}`} className="relative">
                    <input
                      type="text"
                      value={digit}
                      onChange={(e) => handleDigitInput(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      maxLength={1}
                      autoFocus={index === currentDigitIndex}
                      className="w-12 h-12 text-center border rounded-md opacity-0 absolute inset-0 z-10"
                    />
                    <SortableDigit digit={digit || '_'} id={`setup-digit-${index}`} />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className="bg-background space-y-8">
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => (
                <Button
                  key={number}
                  onClick={() => handleDialpadClick(number)}
                  variant="outline"
                  className={`h-12 text-lg ${digits.includes(number.toString()) ? 'opacity-50' : ''}`}
                  disabled={digits.includes(number.toString())}
                >
                  {number}
                </Button>
              ))}
              <Button onClick={handleClear} variant="outline" className="h-12">
                Clear
              </Button>
            </div>
            
            <Button 
              onClick={handleSetUserNumber} 
              className="w-full"
              disabled={!digits.every(d => d !== '')}
            >
              Engage Virus
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
