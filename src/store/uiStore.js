import { create } from 'zustand';

export const useUIStore = create((set) => ({
  activeTool: 'pen', // 'select', 'pen', 'shape', 'text', 'eraser'
  setActiveTool: (tool) => set({ activeTool: tool }),
  
  activeShape: 'rectangle', // 'rectangle', 'circle', 'arrow', 'line', 'diamond'
  setActiveShape: (shape) => set({ activeShape: shape }),
  
  // Style properties
  strokeStyle: '#7c3aed',
  fillStyle: 'transparent',
  strokeWidth: 2,
  opacity: 1,
  lineStyle: 'solid', // 'solid', 'dashed', 'dotted'
  eraserSize: 40,
  
  setStrokeStyle: (color) => set({ strokeStyle: color }),
  setFillStyle: (color) => set({ fillStyle: color }),
  setStrokeWidth: (width) => set({ strokeWidth: width }),
  setOpacity: (opacity) => set({ opacity: opacity }),
  setLineStyle: (style) => set({ lineStyle: style }),
  setEraserSize: (size) => set({ eraserSize: size }),
  
  // Mobile UI
  isStylePanelOpen: false,
  setStylePanelOpen: (isOpen) => set({ isStylePanelOpen: isOpen }),
  
  isAIPanelOpen: false,
  setAIPanelOpen: (isOpen) => set({ isAIPanelOpen: isOpen }),
}));
