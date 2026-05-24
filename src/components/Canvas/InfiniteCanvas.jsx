import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { useCanvasStore } from '../../store/canvasStore';
import { useUIStore } from '../../store/uiStore';
import DrawingLayer from './DrawingLayer';
import SelectionBox from './SelectionBox';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { Loader2 } from 'lucide-react';
import { useHistoryStore } from '../../store/historyStore';

// Helper for throttling
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

const InfiniteCanvas = () => {
  const stageRef = useRef(null);
  const staticLayerRef = useRef(null);
  const dynamicLayerRef = useRef(null);
  const isMobile = useIsMobile();
  
  const { 
    stagePos, setStagePos, 
    stageScale, setStageScale,
    elements, isLoading,
    setStageRef,
    isDrawing, setIsDrawing,
    currentElement, setCurrentElement,
    addElement, updateElement, removeElement,
    setSelectedIds
  } = useCanvasStore();
  
  const { 
    activeTool, activeShape, strokeStyle, fillStyle, 
    strokeWidth, opacity, lineStyle, eraserSize 
  } = useUIStore();
  
  const { saveHistory } = useHistoryStore();
  const [hoveredId, setHoveredId] = useState(null);

  const drawingRef = useRef(null);
  useEffect(() => {
    drawingRef.current = currentElement;
  }, [currentElement]);

  const isSpacePressed = useRef(false);
  const isPanning = useRef(false);
  const lastPanPos = useRef({ x: 0, y: 0 });

  // Space key tracking
  useEffect(() => {
    const down = (e) => { 
      if (e.code === 'Space') {
        e.preventDefault();
        isSpacePressed.current = true;
        if (stageRef.current) {
          stageRef.current.container().style.cursor = 'grab';
        }
      }
    };
    const up = (e) => { 
      if (e.code === 'Space') {
        isSpacePressed.current = false;
        if (stageRef.current) {
          stageRef.current.container().style.cursor = 
            activeTool === 'select' ? 'default' : 'crosshair';
        }
      }
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [activeTool]);

  const getPointerPos = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return { x: 0, y: 0 };
    const pointer = stage.getPointerPosition();
    if (!pointer) return { x: 0, y: 0 };
    const transform = stage.getAbsoluteTransform().copy().invert();
    return transform.point(pointer);
  }, []);

  const handlePointerDown = (e) => {
    // Middle mouse button OR space + drag
    if (e.evt.button === 1 || (e.evt.button === 0 && isSpacePressed.current)) {
      isPanning.current = true;
      lastPanPos.current = { x: e.evt.clientX, y: e.evt.clientY };
      stageRef.current.container().style.cursor = 'grabbing';
      return;
    }

    if (e.evt && e.evt.button !== 0 && e.evt.pointerType === 'mouse') return;
    if (activeTool === 'select') return;
    if (isDrawing) return;

    const pos = getPointerPos();
    if (activeTool === 'eraser') return;

    const id = Date.now().toString();
    setIsDrawing(true);

    let newElement = {
      id,
      type: activeTool,
      x: pos.x,
      y: pos.y,
      stroke: strokeStyle,
      fill: fillStyle,
      strokeWidth,
      opacity,
      lineStyle,
    };

    if (activeTool === 'pen') {
      newElement.points = [pos.x, pos.y];
    } else if (activeTool === 'shape') {
      newElement.shapeType = activeShape;
      newElement.width = 0;
      newElement.height = 0;
    } else if (activeTool === 'text') {
      const text = prompt('Enter text:');
      if (!text) {
        setIsDrawing(false);
        return;
      }
      newElement.text = text;
      newElement.fontSize = 24;
      addElement(newElement);
      saveHistory([...elements, newElement]);
      setSelectedIds([id]);
      setIsDrawing(false);
      return;
    }

    setCurrentElement(newElement);
    setSelectedIds([id]);
    
    if (e.target.getStage) {
        e.target.getStage().container().setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = useCallback((e) => {
    if (isPanning.current) {
      const dx = e.evt.clientX - lastPanPos.current.x;
      const dy = e.evt.clientY - lastPanPos.current.y;
      lastPanPos.current = { x: e.evt.clientX, y: e.evt.clientY };
      setStagePos({ x: stagePos.x + dx, y: stagePos.y + dy });
      return;
    }

    const pos = getPointerPos();

    if (activeTool === 'eraser') {
      const stage = stageRef.current;
      if (!stage) return;
      
      const pointer = stage.getPointerPosition();
      const transform = stage.getAbsoluteTransform().copy().invert();
      const eraserPos = transform.point(pointer);
      const radius = eraserSize / stageScale / 2;

      const currentElements = useCanvasStore.getState().elements;

      currentElements.forEach(el => {
        if (el.type === 'pen') {
          let hit = false;
          for (let i = 0; i < el.points.length; i += 2) {
            const dx = el.points[i] - eraserPos.x;
            const dy = el.points[i + 1] - eraserPos.y;
            if (Math.sqrt(dx * dx + dy * dy) < radius) {
              hit = true;
              break;
            }
          }
          if (hit) {
            const newPoints = [];
            for (let i = 0; i < el.points.length; i += 2) {
              const dx = el.points[i] - eraserPos.x;
              const dy = el.points[i + 1] - eraserPos.y;
              if (Math.sqrt(dx * dx + dy * dy) >= radius) {
                newPoints.push(el.points[i], el.points[i + 1]);
              }
            }
            if (newPoints.length < 4) removeElement(el.id);
            else updateElement(el.id, { points: newPoints });
          }
        } else {
          const elLeft = Math.min(el.x, el.x + (el.width || 0));
          const elRight = Math.max(el.x, el.x + (el.width || 0));
          const elTop = Math.min(el.y, el.y + (el.height || 0));
          const elBottom = Math.max(el.y, el.y + (el.height || 0));
          
          const hit = eraserPos.x >= elLeft - radius &&
                      eraserPos.x <= elRight + radius &&
                      eraserPos.y >= elTop - radius &&
                      eraserPos.y <= elBottom + radius;
          
          if (hit) {
            setHoveredId(el.id);
            setTimeout(() => {
              removeElement(el.id);
              setHoveredId(null);
            }, 100);
          }
        }
      });
      return;
    }

    if (!useCanvasStore.getState().isDrawing || !drawingRef.current) return;
    const current = drawingRef.current;

    if (activeTool === 'pen') {
        setCurrentElement({ ...current, points: [...current.points, pos.x, pos.y] });
    } else if (activeTool === 'shape') {
        let width = pos.x - current.x;
        let height = pos.y - current.y;
        if (e.evt.shiftKey) {
            const size = Math.max(Math.abs(width), Math.abs(height));
            width = Math.sign(width) * size;
            height = Math.sign(height) * size;
        }
        setCurrentElement({ ...current, width, height });
    }
  }, [activeTool, eraserSize, stageScale, getPointerPos, removeElement, updateElement, setCurrentElement, stagePos, setStagePos]);

  const throttledPointerMove = useMemo(() => throttle(handlePointerMove, 16), [handlePointerMove]);

  const handlePointerUp = useCallback(() => {
    if (isPanning.current) {
      isPanning.current = false;
      if (stageRef.current) {
        stageRef.current.container().style.cursor = isSpacePressed.current ? 'grab' : (activeTool === 'select' ? 'default' : 'crosshair');
      }
      return;
    }

    const isActuallyDrawing = useCanvasStore.getState().isDrawing;
    if (!isActuallyDrawing) return;

    const current = drawingRef.current;
    setIsDrawing(false);
    setCurrentElement(null);

    if (!current) return;

    const isValidPen = current.type === 'pen' && current.points.length > 4;
    const isValidShape = current.type === 'shape' && (Math.abs(current.width) > 2 || Math.abs(current.height) > 2);

    if (isValidPen || isValidShape) {
      const latestElements = useCanvasStore.getState().elements;
      addElement(current);
      saveHistory([...latestElements, current]);
    }
  }, [addElement, saveHistory, setIsDrawing, setCurrentElement, activeTool]);

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (useCanvasStore.getState().isDrawing || isPanning.current) handlePointerUp();
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, [handlePointerUp]);

  useEffect(() => {
    if (stageRef.current) setStageRef(stageRef.current);
  }, [setStageRef]);

  useEffect(() => {
    if (!stageRef.current) return;
    const container = stageRef.current.container();
    if (activeTool === 'eraser') {
      const size = eraserSize * stageScale;
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><circle cx='${size/2}' cy='${size/2}' r='${size/2 - 1}' fill='rgba(255,255,255,0.3)' stroke='#666' stroke-width='1.5'/></svg>`;
      container.style.cursor = `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${size/2} ${size/2}, crosshair`;
    } else {
      if (!isPanning.current && !isSpacePressed.current) {
        container.style.cursor = activeTool === 'select' ? 'default' : 'crosshair';
      }
    }
  }, [activeTool, eraserSize, stageScale]);

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const mousePointTo = { x: (pointer.x - stage.x()) / oldScale, y: (pointer.y - stage.y()) / oldScale };
    let newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    newScale = Math.max(0.05, Math.min(5, newScale));
    const newPos = { x: pointer.x - mousePointTo.x * newScale, y: pointer.y - mousePointTo.y * newScale };
    setStageScale(newScale);
    setStagePos(newPos);
  };

  return (
    <div className="w-full h-full overflow-hidden bg-inkmind-bg relative">
      {isLoading && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-inkmind-bg/80 backdrop-blur-sm">
          <Loader2 size={48} className="text-purple-500 animate-spin mb-4" />
          <p className="text-slate-300 font-medium tracking-widest uppercase text-xs">Loading Canvas...</p>
        </div>
      )}

      {elements.length === 0 && !isLoading && !isDrawing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 text-center">
          <p className="text-slate-500 font-medium text-lg opacity-50 select-none">
             Start drawing or press <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-white/5 mx-1">P</span> to use pen ✏️<br/>
             <span className="text-sm opacity-60 font-normal tracking-wide">Hold <span className="bg-slate-800 px-1 rounded">Space</span> to pan</span>
          </p>
        </div>
      )}

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageRef}
        x={stagePos.x}
        y={stagePos.y}
        scaleX={stageScale}
        scaleY={stageScale}
        draggable={false}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={throttledPointerMove}
        onPointerUp={handlePointerUp}
        className="touch-none canvas-container"
        style={{ willChange: 'transform', touchAction: 'none', userSelect: 'none' }}
      >
        <Layer ref={staticLayerRef}>
           <Rect id="stage-bg" x={-200000} y={-200000} width={400000} height={400000} fill="transparent" onClick={() => activeTool === 'select' && setSelectedIds([])} />
           <DrawingLayer isStatic={true} hoveredId={hoveredId} />
           <SelectionBox />
        </Layer>
        <Layer ref={dynamicLayerRef} listening={false}>
           <DrawingLayer isStatic={false} />
        </Layer>
      </Stage>
      
      <div className="fixed bottom-4 right-4 text-slate-400 text-[10px] font-bold bg-inkmind-sidebar/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 select-none tracking-widest z-50">
        {Math.round(stageScale * 100)}%
      </div>
    </div>
  );
};

export default InfiniteCanvas;
