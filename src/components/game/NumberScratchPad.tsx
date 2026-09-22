
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

interface NumberScratchPadProps {
  onToggleNumber: (number: number) => void;
  scratchedNumbers: number[];
}

const NumberScratchPad = ({ onToggleNumber, scratchedNumbers }: NumberScratchPadProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-background">
      <div className={`space-y-1 ${isMobile ? 'mb-2' : 'mb-4'}`}>
        <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>Available digits</h2>
        <p className={`${isMobile ? 'text-xs' : 'text-sm'} opacity-80`}>
          (scratch the numbers you think you won't need)
        </p>
      </div>
      <div className={`flex gap-1 ${isMobile ? 'justify-between w-full' : 'gap-2'}`}>
        {Array.from({ length: 10 }, (_, i) => i).map((number) => (
          <button
            key={number}
            onClick={() => onToggleNumber(number)}
            className={`${isMobile ? 'w-[8vw] h-[8vw] text-sm' : 'w-8 h-8'} flex items-center justify-center rounded-full border transition-all
              ${scratchedNumbers.includes(number)
                ? 'bg-muted/50 text-muted-foreground line-through cursor-pointer hover:bg-muted/70'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'}`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NumberScratchPad;
