import { useEffect } from 'react';
import { useCanvasStore } from '../store/canvasStore';
import { saveCanvas, loadCanvas } from '../lib/canvasSave';
import toast from 'react-hot-toast';

export const useCanvas = () => {
  const { elements, setElements } = useCanvasStore();

  // Load canvas on mount
  useEffect(() => {
    const initLoad = async () => {
      const data = await loadCanvas();
      if (data) {
        setElements(data);
      }
    };
    initLoad();
  }, [setElements]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const timer = setInterval(async () => {
      if (elements.length > 0) {
        const result = await saveCanvas(elements);
        if (result.success) {
          console.log('Auto-saved ✓');
        }
      }
    }, 30000);

    return () => clearInterval(timer);
  }, [elements]);

  return { saveCanvas: () => saveCanvas(elements) };
};
