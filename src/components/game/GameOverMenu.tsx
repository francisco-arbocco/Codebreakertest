
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, RefreshCw, Skull } from "lucide-react";

interface GameOverMenuProps {
  won: boolean;
  onRestart: () => void;
  onTryAgain: () => void;
}

const GameOverMenu = ({ won, onRestart, onTryAgain }: GameOverMenuProps) => {
  return (
    <div className="fixed inset-0 bg-background/95 flex items-center justify-center z-50 p-4">
      <Card className="p-6 max-w-md w-full border-2 border-primary">
        <div className="text-center space-y-6">
          {won ? (
            <>
              <div className="flex justify-center">
                <Shield className="w-16 h-16 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-primary">Mission Accomplished</h2>
              <p className="text-primary/80">
                You've successfully defended against the cyber attack and neutralized the threat.
              </p>
              <Button 
                onClick={onRestart}
                className="w-full"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Start New Mission
              </Button>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <Skull className="w-16 h-16 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold text-destructive">Mission Failed</h2>
              <p className="text-destructive/80">
                The virus broke through our defenses. But we can't give up - try again with a new security code.
              </p>
              <Button 
                onClick={onTryAgain}
                className="w-full"
                variant="destructive"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default GameOverMenu;
