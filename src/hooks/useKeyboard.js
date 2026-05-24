import { useEffect } from 'react';
import { useUIStore } from '../store/uiStore';
import { useCanvasStore } from '../store/canvasStore';
import { useHistoryStore } from '../store/historyStore';
import { saveCanvas as fbSaveCanvas } from '../lib/canvasSave';

export const useKeyboard = () => {
  const { setActiveTool, activeTool } = useUIStore();
  const { elements, setElements, selectedIds, removeElement, setSelectedIds } = useCanvasStore();
  const { undo, redo } = useHistoryStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isTyping = e.target.tagName === 'INPUT' || 
                       e.target.tagName === 'TEXTAREA' || 
                       e.target.isContentEditable;

      const ctrl = e.ctrlKey || e.metaKey;

      if (!isTyping) {
        switch (e.key.toLowerCase()) {
          case 'v': setActiveTool('select'); break;
          case 'p': setActiveTool('pen'); break;
          case 's': setActiveTool('shape'); break;
          case 't': setActiveTool('text'); break;
          case 'e': setActiveTool('eraser'); break;
          case 'escape': setSelectedIds([]); break;
          case 'backspace':
          case 'delete':
            if (selectedIds.length > 0) {
              const latestElements = useCanvasStore.getState().elements;
              selectedIds.forEach(id => removeElement(id));
              setSelectedIds([]);
            }
            break;
        }
      }

      // Ctrl shortcuts
      if (ctrl) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              const next = redo(elements);
              if (next) setElements(next);
            } else {
              const prev = undo(elements);
              if (prev) setElements(prev);
            }
            break;
          case 's':
            e.preventDefault();
            fbSaveCanvas(elements);
            break;
          case 'a':
            e.preventDefault();
            setSelectedIds(elements.map(el => el.id));
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTool, elements, selectedIds, setActiveTool, setElements, setSelectedIds, removeElement, undo, redo]);
};
