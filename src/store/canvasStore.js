import { create } from 'zustand';

export const useCanvasStore = create((set, get) => ({
  elements: [],
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
  currentElement: null,
  setCurrentElement: (element) => set({ currentElement: element }),
  setElements: (elements) => set({ elements }),
  addElement: (element) => set((state) => ({ 
    elements: [...state.elements, element] 
  })),
  updateElement: (id, updates) => set((state) => ({
    elements: state.elements.map((el) => el.id === id ? { ...el, ...updates } : el)
  })),
  removeElement: (id) => set((state) => ({
    elements: state.elements.filter((el) => el.id !== id)
  })),
  
  // Selection
  selectedIds: [],
  setSelectedIds: (ids) => set({ selectedIds: ids }),
  
  // Canvas Transform
  stagePos: { x: 0, y: 0 },
  stageScale: 1,
  setStagePos: (pos) => set({ stagePos: pos }),
  setStageScale: (scale) => set({ stageScale: scale }),
  
  // Drawing state
  isDrawing: false,
  setIsDrawing: (isDrawing) => set({ isDrawing }),

  // Stage Ref for exports/AI
  stageRef: null,
  setStageRef: (ref) => set({ stageRef: ref }),
}));
