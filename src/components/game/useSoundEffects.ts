import { useCallback, useRef } from 'react';

/**
 * Retro synthesized sound effects using Web Audio API.
 * No audio files needed — all sounds are generated programmatically.
 */

const getAudioContext = (() => {
  let ctx: AudioContext | null = null;
  return () => {
    if (!ctx || ctx.state === 'closed') {
      ctx = new AudioContext();
    }
    return ctx;
  };
})();

const playTone = (frequency: number, duration: number, type: OscillatorType = 'square', volume = 0.15) => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available — silently skip
  }
};

const playDigitBeep = () => playTone(880, 0.05, 'square', 0.08);

const playSubmitSound = () => {
  playTone(523, 0.08, 'square', 0.1);
  setTimeout(() => playTone(659, 0.08, 'square', 0.1), 80);
  setTimeout(() => playTone(784, 0.12, 'square', 0.1), 160);
};

const playClearSound = () => playTone(330, 0.15, 'sawtooth', 0.08);

const playWinSound = () => {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'square', 0.12), i * 150);
  });
};

const playLoseSound = () => {
  const notes = [440, 370, 311, 262];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, 'sawtooth', 0.1), i * 200);
  });
};

const playErrorSound = () => {
  playTone(200, 0.15, 'sawtooth', 0.1);
  setTimeout(() => playTone(150, 0.2, 'sawtooth', 0.1), 100);
};

export const useSoundEffects = () => {
  const enabledRef = useRef(true);

  const play = useCallback((sound: () => void) => {
    if (enabledRef.current) sound();
  }, []);

  return {
    digitBeep: useCallback(() => play(playDigitBeep), [play]),
    submit: useCallback(() => play(playSubmitSound), [play]),
    clear: useCallback(() => play(playClearSound), [play]),
    win: useCallback(() => play(playWinSound), [play]),
    lose: useCallback(() => play(playLoseSound), [play]),
    error: useCallback(() => play(playErrorSound), [play]),
    setEnabled: useCallback((v: boolean) => { enabledRef.current = v; }, []),
    isEnabled: () => enabledRef.current,
  };
};
