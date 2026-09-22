
import { useState, useEffect } from 'react';

interface Props {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: Props) => {
  const [text, setText] = useState('');
  const title = 'CODE BREAKER';
  
  useEffect(() => {
    let currentIndex = 0;
    let timeoutId: number;
    
    const typeText = () => {
      if (currentIndex < title.length) {
        setText(title.substring(0, currentIndex + 1));
        currentIndex++;
        timeoutId = window.setTimeout(typeText, 200);
      } else {
        timeoutId = window.setTimeout(onComplete, 1500);
      }
    };

    timeoutId = window.setTimeout(typeText, 500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex items-center justify-center cursor-pointer" 
      onClick={onComplete}
    >
      <div className="font-mono text-primary text-4xl md:text-6xl tracking-wider">
        {text}
        <span className="inline-block w-4 h-12 bg-primary ml-1 animate-[pulse_1s_infinite]" />
      </div>
    </div>
  );
};

export default SplashScreen;
