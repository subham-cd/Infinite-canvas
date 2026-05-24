import { create } from 'zustand';

const MAX_HISTORY = 50;

export const useHistoryStore = create((set, get) => ({
  past: [],
  future: [],
  
  saveHistory: (elements) => {
    const { past } = get();
    set({
      past: [...past.slice(-MAX_HISTORY + 1), elements],
      future: []
    });
  },
  
  undo: (currentElements) => {
    const { past, future } = get();
    if (past.length === 0) return currentElements;
    
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    set({
      past: newPast,
      future: [currentElements, ...future.slice(0, MAX_HISTORY - 1)]
    });
    
    return previous;
  },
  
  redo: (currentElements) => {
    const { past, future } = get();
    if (future.length === 0) return currentElements;
    
    const next = future[0];
    const newFuture = future.slice(1);
    
    set({
      past: [...past.slice(-MAX_HISTORY + 1), currentElements],
      future: newFuture
    });
    
    return next;
  }
}));
