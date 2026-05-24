import React, { useRef, useEffect, useCallback } from 'react';
import { Stage, Layer } from 'react-konva';
import { useCanvasStore } from '../../store/canvasStore';
import { useUIStore } from '../../store/uiStore';
import DrawingLayer from './DrawingLayer';
import SelectionBox from './SelectionBox';
import { useIsMobile } from '../../hooks/useMediaQuery';

const InfiniteCanvas = () => {
  const stageRef = useRef(null);
  const isMobile = useIsMobile();
  
  const { 
    stagePos, setStagePos, 
    stageScale, setStageScale,
    elements, setElements,
    selectedIds, setSelectedIds,
    setStageRef
  } = useCanvasStore();

  useEffect(() => {
    if (stageRef.current) {
        setStageRef(stageRef.current);
    }
  }, [setStageRef]);
  
  const { activeTool } = useUIStore();

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    let newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    // Constraints: 5% to 500%
    newScale = Math.max(0.05, Math.min(5, newScale));

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setStageScale(newScale);
    setStagePos(newPos);
  };

  const handleDragEnd = (e) => {
    if (activeTool === 'select' || e.evt?.button === 1 || (e.evt?.shiftKey)) {
       setStagePos({ x: e.target.x(), y: e.target.y() });
    }
  };

  // Pinch to zoom and multi-touch pan for mobile
  const lastCenter = useRef(null);
  const lastDist = useRef(0);

  const getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  const getCenter = (p1, p2) => {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
  };

  const handleTouchMove = (e) => {
    e.evt.preventDefault();
    const touch1 = e.evt.touches[0];
    const touch2 = e.evt.touches[1];

    if (touch1 && touch2) {
      const p1 = { x: touch1.clientX, y: touch1.clientY };
      const p2 = { x: touch2.clientX, y: touch2.clientY };

      if (!lastCenter.current) {
        lastCenter.current = getCenter(p1, p2);
        lastDist.current = getDistance(p1, p2);
        return;
      }

      const newCenter = getCenter(p1, p2);
      const newDist = getDistance(p1, p2);

      const stage = stageRef.current;
      const oldScale = stage.scaleX();

      const scaleBy = newDist / lastDist.current;
      let newScale = oldScale * scaleBy;
      newScale = Math.max(0.05, Math.min(5, newScale));

      const mousePointTo = {
        x: (newCenter.x - stage.x()) / oldScale,
        y: (newCenter.y - stage.y()) / oldScale,
      };

      const newPos = {
        x: newCenter.x - mousePointTo.x * newScale,
        y: newCenter.y - mousePointTo.y * newScale,
      };

      setStageScale(newScale);
      setStagePos(newPos);
      lastDist.current = newDist;
      lastCenter.current = newCenter;
    }
  };

  const handleTouchEnd = () => {
    lastCenter.current = null;
    lastDist.current = 0;
  };

  // Prevent default context menu on middle click
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  return (
    <div className="w-full h-full overflow-hidden bg-inkmind-bg">
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageRef}
        x={stagePos.x}
        y={stagePos.y}
        scaleX={stageScale}
        scaleY={stageScale}
        draggable={activeTool === 'select' || isMobile}
        onWheel={handleWheel}
        onDragEnd={handleDragEnd}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="touch-none"
      >
        <Layer>
           <DrawingLayer />
           <SelectionBox />
        </Layer>
      </Stage>
      
      {/* Zoom Indicator */}
      <div className="fixed bottom-4 right-4 text-slate-400 text-sm font-medium bg-inkmind-sidebar/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 select-none">
        {Math.round(stageScale * 100)}%
      </div>
    </div>
  );
};

export default InfiniteCanvas;
