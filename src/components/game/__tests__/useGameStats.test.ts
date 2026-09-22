import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameStats } from '../useGameStats';

describe('useGameStats', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('starts with empty stats', () => {
    const { result } = renderHook(() => useGameStats());
    expect(result.current.stats.totalGames).toBe(0);
    expect(result.current.stats.wins).toBe(0);
    expect(result.current.stats.losses).toBe(0);
    expect(result.current.stats.winRate).toBe(0);
    expect(result.current.stats.bestRound).toBeNull();
    expect(result.current.stats.history).toEqual([]);
  });

  test('records a win correctly', () => {
    const { result } = renderHook(() => useGameStats());
    act(() => {
      result.current.recordGame(true, 'hard', 5);
    });
    expect(result.current.stats.totalGames).toBe(1);
    expect(result.current.stats.wins).toBe(1);
    expect(result.current.stats.losses).toBe(0);
    expect(result.current.stats.winRate).toBe(100);
    expect(result.current.stats.bestRound).toBe(5);
    expect(result.current.stats.history).toHaveLength(1);
  });

  test('records a loss correctly', () => {
    const { result } = renderHook(() => useGameStats());
    act(() => {
      result.current.recordGame(false, 'normal', 10);
    });
    expect(result.current.stats.totalGames).toBe(1);
    expect(result.current.stats.wins).toBe(0);
    expect(result.current.stats.losses).toBe(1);
    expect(result.current.stats.winRate).toBe(0);
    expect(result.current.stats.bestRound).toBeNull();
  });

  test('tracks best round across multiple wins', () => {
    const { result } = renderHook(() => useGameStats());
    act(() => {
      result.current.recordGame(true, 'hard', 8);
    });
    act(() => {
      result.current.recordGame(true, 'hard', 3);
    });
    act(() => {
      result.current.recordGame(true, 'hard', 5);
    });
    expect(result.current.stats.bestRound).toBe(3);
  });

  test('calculates win rate correctly', () => {
    const { result } = renderHook(() => useGameStats());
    act(() => {
      result.current.recordGame(true, 'normal', 5);
    });
    act(() => {
      result.current.recordGame(false, 'normal', 10);
    });
    act(() => {
      result.current.recordGame(true, 'normal', 7);
    });
    expect(result.current.stats.winRate).toBe(67); // 2/3 = 66.6 -> 67
  });

  test('persists to localStorage', () => {
    const { result } = renderHook(() => useGameStats());
    act(() => {
      result.current.recordGame(true, 'hard', 4);
    });
    const stored = JSON.parse(localStorage.getItem('codebreaker-stats')!);
    expect(stored.totalGames).toBe(1);
    expect(stored.wins).toBe(1);
  });

  test('loads persisted stats on mount', () => {
    localStorage.setItem('codebreaker-stats', JSON.stringify({
      totalGames: 5,
      wins: 3,
      losses: 2,
      winRate: 60,
      bestRound: 4,
      history: [],
    }));
    const { result } = renderHook(() => useGameStats());
    expect(result.current.stats.totalGames).toBe(5);
    expect(result.current.stats.wins).toBe(3);
    expect(result.current.stats.bestRound).toBe(4);
  });

  test('resetStats clears everything', () => {
    const { result } = renderHook(() => useGameStats());
    act(() => {
      result.current.recordGame(true, 'hard', 5);
      result.current.recordGame(false, 'normal', 8);
    });
    act(() => {
      result.current.resetStats();
    });
    expect(result.current.stats.totalGames).toBe(0);
    expect(result.current.stats.wins).toBe(0);
    expect(localStorage.getItem('codebreaker-stats')).toBe(JSON.stringify({
      totalGames: 0, wins: 0, losses: 0, winRate: 0, bestRound: null, history: [],
    }));
  });

  test('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('codebreaker-stats', 'not-json');
    const { result } = renderHook(() => useGameStats());
    expect(result.current.stats.totalGames).toBe(0);
  });

  test('caps history at 50 entries', () => {
    const { result } = renderHook(() => useGameStats());
    for (let i = 0; i < 55; i++) {
      act(() => {
        result.current.recordGame(true, 'normal', 5);
      });
    }
    expect(result.current.stats.history.length).toBeLessThanOrEqual(50);
    expect(result.current.stats.totalGames).toBe(55);
  });
});
