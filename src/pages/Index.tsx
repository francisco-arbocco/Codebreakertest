
import NumberGame from "@/components/NumberGame";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex items-center justify-center">
      <div className={`w-full h-full ${isMobile ? 'max-h-screen p-0' : 'max-w-[133.33vh] aspect-[4/3] p-5'}`}>
        <div className={`h-full w-full ${isMobile ? '' : 'border-2 border-primary'}`}>
          <NumberGame />
        </div>
      </div>
    </div>
  );
};

export default Index;
