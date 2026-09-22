import { useState, useEffect } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";

type AnimationType = 'intro' | 'nuclear-launch' | 'victory';
interface Props {
  type: AnimationType;
  onComplete: () => void;
  originCountry?: string;
}

const DosAnimation = ({ type, onComplete, originCountry }: Props) => {
  const isMobile = useIsMobile();
  const [text, setText] = useState('');
  const [complete, setComplete] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const introText = [
    "*** ALERT: HOSTILE CYBER INTRUSION DETECTED ***",
    "UNKNOWN ENTITY ATTEMPTING TO ACCESS NUCLEAR SYSTEMS...",
    "DEFENSIVE COUNTERMEASURES ACTIVATING...",
    "TRACE PROTOCOL INITIATED...",
    "OPERATOR: YOU MUST DECODE THE HOSTILE ACCESS PATTERN"
  ];

  const nuclearLaunchText = [
    "***CRITICAL OVERRIDE DETECTED***",
    "VIRUS EXECUTING LAUNCH PROTOCOL...",
    "NUCLEAR WARHEADS ARMED",
    "***ERROR: OVERRIDE ATTEMPT FAILED***",
    "STRIKE ORDERS TRANSMITTED:",
    "  - NEW YORK: LAUNCH CONFIRMED",
    "  - WASHINGTON D.C.: LAUNCH CONFIRMED",
    "  - SAN FRANCISCO: LAUNCH CONFIRMED",
    "  - LOS ANGELES: LAUNCH CONFIRMED",
    "IMPACT IN T-MINUS [COUNTDOWN]",
    "<<CONNECTION TERMINATED>>",
  ];

  const victoryText = [
    "***INTRUSION CONTAINED***",
    "VIRUS NEUTRALIZED",
    "SYSTEM RESTORING OPERATIONS...",
    "TRACEBACK INITIATED...",
    `SOURCE IDENTIFIED: ${originCountry}`,
    "COUNTERSTRIKE PROTOCOL ENGAGED",
    "NUCLEAR WARHEADS ARMED",
    "MISSILE SILO 4A3 LAUNCHED...",
    "MISSILE SILO 7B1 LAUNCHED...",
    "MISSILE SILO 2C9 LAUNCHED...",
    "TARGETS LOCKED:",
    "  - MOSCOW",
    "  - ST. PETERSBURG",
    "  - NOVOSIBIRSK",
    "T-MINUS [COUNTDOWN]",
    "*** ALL TARGETS ELIMINATED ***",
    `${originCountry}: NEUTRALIZED`,
    "MISSION ACCOMPLISHED. WORLD PEACE SECURED.",
  ];

  useEffect(() => {
    const textArray = type === 'intro' 
      ? introText 
      : type === 'nuclear-launch' 
        ? nuclearLaunchText 
        : victoryText;

    let currentIndex = 0;
    let currentLine = '';
    let mounted = true;

    const typeText = () => {
      if (!mounted) return;
      
      if (currentIndex >= textArray.length) {
        setComplete(true);
        setTimeout(() => {
          if (mounted) {
            onComplete();
          }
        }, 3000);
        return;
      }

      const targetLine = textArray[currentIndex];
      
      if (targetLine.includes('[COUNTDOWN]')) {
        setText(prev => prev + '\n' + targetLine.replace('[COUNTDOWN]', '5'));
        setCountdown(5);
        currentIndex++;
        return;
      }

      if (currentLine.length < targetLine.length) {
        currentLine = targetLine.slice(0, currentLine.length + 1);
        setText(prev => prev.split('\n').slice(0, -1).join('\n') + '\n' + currentLine);
        setTimeout(typeText, 50);
      } else {
        currentLine = '';
        currentIndex++;
        setText(prev => prev + '\n');
        setTimeout(typeText, 1000);
      }
    };

    setText('');
    typeText();

    return () => {
      mounted = false;
    };
  }, [type, originCountry]);

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setText(prev => {
          const lines = prev.split('\n');
          const newCount = countdown - 1;
          lines[lines.length - 1] = lines[lines.length - 1].replace(countdown.toString(), newCount.toString());
          return lines.join('\n');
        });
        setCountdown(newCount => newCount !== null ? newCount - 1 : null);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      const timer = setTimeout(() => {
        setText(prev => prev + '\n');
        setCountdown(null);
        const textArray = type === 'nuclear-launch' ? nuclearLaunchText : victoryText;
        const remainingText = textArray.slice(textArray.findIndex(line => line.includes('[COUNTDOWN]')) + 1);
        let currentIndex = 0;
        
        const typeRemainingText = () => {
          if (currentIndex >= remainingText.length) {
            setComplete(true);
            setTimeout(onComplete, 3000);
            return;
          }
          
          setText(prev => prev + remainingText[currentIndex] + '\n');
          currentIndex++;
          setTimeout(typeRemainingText, 1000);
        };
        
        typeRemainingText();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [countdown, type]);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 cursor-pointer" 
      onClick={onComplete}
    >
      <div className={`w-full h-full ${isMobile ? 'max-h-screen' : 'max-w-[133.33vh] aspect-[4/3]'} bg-black`}>
        <pre className={`whitespace-pre-wrap p-4 md:p-8 text-left ${
          type === 'nuclear-launch' ? 'text-red-500' : 'text-green-500'
        } ${isMobile ? 'text-sm' : 'text-base'}`}>
          {text}
          <span className={`inline-block ${complete ? 'hidden' : ''}`}>_</span>
        </pre>
      </div>
    </div>
  );
};

export default DosAnimation;
