import { cn } from "@/lib/utils";

interface CardProps {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

const Card = ({ value, isFlipped, isMatched, onClick }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flip-card w-20 h-28 cursor-pointer",
        isFlipped && "flipped"
      )}
    >
      <div className="flip-card-inner w-full h-full">
        <div className="flip-card-front rounded-xl bg-primary shadow-lg flex items-center justify-center">
          <span className="text-2xl">?</span>
        </div>
        <div className="flip-card-back rounded-xl bg-white shadow-lg border-2 border-secondary flex items-center justify-center">
          <span className="text-4xl">{value}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;