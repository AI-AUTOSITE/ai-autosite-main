// app/tools/photocraft/hooks/useHistory.ts
import { useState, useCallback } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UseHistoryReturn<T> {
  state: T;
  setState: (newState: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clear: () => void;
  historyLength: number;
}

export function useHistory<T>(
  initialState: T,
  maxHistory: number = 50
): UseHistoryReturn<T> {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: []
  });

  const setState = useCallback((newState: T) => {
    setHistory(prev => {
      const newPast = [...prev.past, prev.present];
      // Limit history size
      if (newPast.length > maxHistory) {
        newPast.shift();
      }
      
      return {
        past: newPast,
        present: newState,
        future: [] // Clear future when new state is set
      };
    });
  }, [maxHistory]);

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;

      const newPast = [...prev.past];
      const newPresent = newPast.pop()!;
      const newFuture = [prev.present, ...prev.future];

      return {
        past: newPast,
        present: newPresent,
        future: newFuture
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;

      const newFuture = [...prev.future];
      const newPresent = newFuture.shift()!;
      const newPast = [...prev.past, prev.present];

      return {
        past: newPast,
        present: newPresent,
        future: newFuture
      };
    });
  }, []);

  const clear = useCallback(() => {
    setHistory(prev => ({
      past: [],
      present: prev.present,
      future: []
    }));
  }, []);

  return {
    state: history.present,
    setState,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    clear,
    historyLength: history.past.length + history.future.length + 1
  };
}