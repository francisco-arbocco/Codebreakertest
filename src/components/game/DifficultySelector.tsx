
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { type Difficulty } from "./GameLogic";
import { useState } from "react";

interface DifficultySelectorProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

const DifficultySelector = ({ onSelectDifficulty }: DifficultySelectorProps) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("normal");

  return (
    <div className="mb-8">
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-2xl font-bold text-primary">VIRUS THREAT ASSESSMENT</h1>
        <p className="text-muted-foreground">
          Select expected virus complexity level to calibrate defense systems.
        </p>
        <p className="text-sm text-muted-foreground opacity-80">
          Higher complexity levels indicate more sophisticated viral attack patterns.
        </p>
      </div>
      
      <div className="max-w-md mx-auto space-y-6">
        <RadioGroup 
          defaultValue="normal" 
          onValueChange={(value) => setSelectedDifficulty(value as Difficulty)}
          className="space-y-4 border-2 border-primary/20 p-4"
        >
          <div className="flex items-center space-x-2 whitespace-nowrap">
            <RadioGroupItem value="novice" id="novice" />
            <Label htmlFor="novice" className="text-primary text-sm">LEVEL 1 - Basic Virus Threat</Label>
          </div>
          <div className="flex items-center space-x-2 whitespace-nowrap">
            <RadioGroupItem value="normal" id="normal" />
            <Label htmlFor="normal" className="text-primary text-sm">LEVEL 2 - Intermediate Virus Threat</Label>
          </div>
          <div className="flex items-center space-x-2 whitespace-nowrap">
            <RadioGroupItem value="hard" id="hard" />
            <Label htmlFor="hard" className="text-primary text-sm">LEVEL 3 - Advanced Virus Threat</Label>
          </div>
        </RadioGroup>
        
        <Button 
          onClick={() => onSelectDifficulty(selectedDifficulty)} 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          INITIATE COUNTERMEASURES
        </Button>
      </div>
    </div>
  );
};

export default DifficultySelector;
