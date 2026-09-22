import { useState, useCallback } from 'react';
import { type Difficulty } from './GameLogic';

const STORAGE_KEY = 'codebreaker-stats';

export interface GameRecord {
  won: boolean;
  difficulty: Difficulty;
  rounds: number;
  timestamp: number;
}

export interface GameStats {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  bestRound: number | null;
  history: GameRecord[];
}

const DEFAULT_STATS: GameStats = {
  totalGames: 0,
  wins: 0,
  losses: 0,
  winRate: 0,
  bestRound: null,
  history: [],
};

const loadStats = (): GameStats => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw) as GameStats;
    return { ...DEFAULT_STATS, ...parsed };
  } catch {
    return DEFAULT_STATS;
  }
};

const saveStats = (stats: GameStats) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // localStorage full or unavailable — silently fail
  }
};

export const useGameStats = () => {
  const [stats, setStats] = useState<GameStats>(loadStats);

  const recordGame = useCallback((won: boolean, difficulty: Difficulty, rounds: number) => {
    setStats(prev => {
      const record: GameRecord = { won, difficulty, rounds, timestamp: Date.now() };
      const wins = prev.wins + (won ? 1 : 0);
      const losses = prev.losses + (won ? 0 : 1);
      const totalGames = prev.totalGames + 1;
      const bestRound = won
        ? (prev.bestRound === null ? rounds : Math.min(prev.bestRound, rounds))
        : prev.bestRound;

      const updated: GameStats = {
        totalGames,
        wins,
        losses,
        winRate: totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0,
        bestRound,
        history: [...prev.history, record].slice(-50), // keep last 50
      };
      saveStats(updated);
      return updated;
    });
  }, []);

  const resetStats = useCallback(() => {
    setStats(DEFAULT_STATS);
    saveStats(DEFAULT_STATS);
  }, []);

  return { stats, recordGame, resetStats };
};
