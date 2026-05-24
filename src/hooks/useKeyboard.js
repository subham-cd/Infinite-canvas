import { useEffect } from 'react';
import { useUIStore } from '../store/uiStore';
import { useCanvasStore } from '../store/canvasStore';
import { useHistoryStore } from '../store/historyStore';

export const useKeyboard = () => {
  const { setActiveTool, activeTool } = useUIStore();
  const { elements, setElements, selectedIds, removeElement, setSelectedIds } = useCanvasStore();
  const { undo, redo } = useHistoryStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if user is typing in a text field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const ctrl = e.ctrlKey || e.metaKey;

      // Tool shortcuts
      if (e.key.toLowerCase() === 'v') setActiveTool('select');
      if (e.key.toLowerCase() === 'p') setActiveTool('pen');
      if (e.key.toLowerCase() === 's') setActiveTool('shape');
      if (e.key.toLowerCase() === 't') setActiveTool('text');
      if (e.key.toLowerCase() === 'e') setActiveTool('eraser');

      // Undo/Redo
      if (ctrl && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          const next = redo(elements);
          setElements(next);
        } else {
          const prev = undo(elements);
          setElements(prev);
        }
      }

      // Delete
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedIds.length > 0) {
        selectedIds.forEach(id => removeElement(id));
        setSelectedIds([]);
      }

      // Select All
      if (ctrl && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setSelectedIds(elements.map(el => el.id));
      }
      
      // Escape
      if (e.key === 'Escape') {
          setSelectedIds([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTool, elements, selectedIds, setActiveTool, setElements, setSelectedIds, removeElement, undo, redo]);
};
