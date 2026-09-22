
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

interface InstructionsModalProps {
  onClose?: () => void;
}

const InstructionsModal = ({ onClose }: InstructionsModalProps) => {
  return (
    <>
      {!onClose && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="absolute top-4 right-4">
              <InfoIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary mb-4">Decoder Instructions</DialogTitle>
            </DialogHeader>
            <InstructionsContent />
          </DialogContent>
        </Dialog>
      )}

      {onClose && (
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary mb-4">Decoder Instructions</DialogTitle>
          </DialogHeader>
          <InstructionsContent />
          <div className="mt-6 flex justify-end">
            <Button onClick={onClose} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Dismiss
            </Button>
          </div>
        </DialogContent>
      )}
    </>
  );
};

const InstructionsContent = () => (
  <div className="space-y-6 text-primary">
    <div>
      <h3 className="text-xl font-semibold mb-2">Feedback System</h3>
      <div className="space-y-2 bg-secondary/10 p-4 border border-primary/20">
        <div>
          <h4 className="font-bold">EXCELLENT Match</h4>
          <p>Right digit in the right position</p>
        </div>
        <div>
          <h4 className="font-bold">GOOD Match</h4>
          <p>Right digit in the wrong position</p>
        </div>
      </div>
    </div>

    <div>
      <h3 className="text-xl font-semibold mb-2">Quick Tips</h3>
      <ul className="list-disc list-inside space-y-1">
        <li>Use the scratchpad to track your progress</li>
        <li>Each digit appears only once</li>
        <li>Pay attention to both EXCELLENT and GOOD matches</li>
      </ul>
    </div>
  </div>
);

export default InstructionsModal;
