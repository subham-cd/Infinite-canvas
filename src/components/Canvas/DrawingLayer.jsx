import React, { useCallback } from 'react';
import { Line, Rect, Circle, Arrow, Text, Group, Path } from 'react-konva';
import { useCanvasStore } from '../../store/canvasStore';
import { useUIStore } from '../../store/uiStore';
import { useHistoryStore } from '../../store/historyStore';
import { getStroke } from 'perfect-freehand';

const DrawingLayer = () => {
  const { elements, addElement, updateElement, removeElement, selectedIds, setSelectedIds, isDrawing, setIsDrawing } = useCanvasStore();
  const { activeTool, activeShape, strokeStyle, fillStyle, strokeWidth, opacity, lineStyle } = useUIStore();
  const { saveHistory } = useHistoryStore();

  const getPointerPos = (e) => {
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    const transform = stage.getAbsoluteTransform().copy().invert();
    return transform.point(pointer);
  };

  const handleMouseDown = (e) => {
    if (activeTool === 'select') return;
    
    setIsDrawing(true);
    const pos = getPointerPos(e);

    if (activeTool === 'eraser') {
      const shape = e.target;
      if (shape && shape.id() && shape.id() !== 'stage') {
        removeElement(shape.id());
      }
      return;
    }

    const id = Date.now().toString();

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
      newElement.text = 'Double click to edit';
      newElement.fontSize = 20;
    } else if (activeTool === 'eraser') {
        // Eraser logic handled in mouseMove
        return;
    }

    addElement(newElement);
    setSelectedIds([id]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    
    const pos = getPointerPos(e);
    const id = selectedIds[0];

    if (activeTool === 'pen') {
      const element = elements.find(el => el.id === id);
      if (element) {
        updateElement(id, { points: [...element.points, pos.x, pos.y] });
      }
    } else if (activeTool === 'shape') {
      const element = elements.find(el => el.id === id);
      if (element) {
          let width = pos.x - element.x;
          let height = pos.y - element.y;
          
          if (e.evt.shiftKey) {
              const size = Math.max(Math.abs(width), Math.abs(height));
              width = Math.sign(width) * size;
              height = Math.sign(height) * size;
          }
          
          updateElement(id, { width, height });
      }
    } else if (activeTool === 'eraser') {
        const shape = e.target;
        if (shape && shape.id() && shape.id() !== 'stage' && shape.id().length > 5) {
            removeElement(shape.id());
        }
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      saveHistory(elements);
      setIsDrawing(false);
    }
  };

  const renderElement = (el) => {
    const isSelected = selectedIds.includes(el.id);
    const commonProps = {
      id: el.id,
      key: el.id,
      opacity: el.opacity,
      draggable: activeTool === 'select',
      dash: el.lineStyle === 'dashed' ? [10, 5] : el.lineStyle === 'dotted' ? [2, 5] : null,
      onDragEnd: (e) => {
        updateElement(el.id, { x: e.target.x(), y: e.target.y() });
        saveHistory(elements);
      },
      onClick: () => {
        if (activeTool === 'select') setSelectedIds([el.id]);
      },
      onTap: () => {
        if (activeTool === 'select') setSelectedIds([el.id]);
      },
      onDblClick: () => {
        if (el.type === 'text') {
          const newText = prompt('Enter text:', el.text);
          if (newText !== null) {
            updateElement(el.id, { text: newText });
            saveHistory(elements);
          }
        }
      }
    };

    if (el.type === 'pen') {
      // Perfect-freehand processing
      const points = [];
      for (let i = 0; i < el.points.length; i += 2) {
        points.push([el.points[i], el.points[i+1]]);
      }
      const stroke = getStroke(points, {
        size: el.strokeWidth * 4,
        thinning: 0.5,
        smoothing: 0.5,
        streamline: 0.5,
      });
      
      const pathData = stroke.reduce(
        (acc, [x, y], i) => {
          if (i === 0) acc.push(`M ${x} ${y}`);
          else acc.push(`L ${x} ${y}`);
          return acc;
        },
        []
      ).join(' ') + ' Z';

      return (
        <Path
          {...commonProps}
          data={pathData}
          fill={el.stroke}
        />
      );
    }

    if (el.type === 'shape') {
      if (el.shapeType === 'rectangle') {
        return <Rect {...commonProps} x={el.x} y={el.y} width={el.width} height={el.height} stroke={el.stroke} fill={el.fill} strokeWidth={el.strokeWidth} />;
      }
      if (el.shapeType === 'circle') {
        const radius = Math.sqrt(Math.pow(el.width, 2) + Math.pow(el.height, 2)) / 2;
        return <Circle {...commonProps} x={el.x + el.width/2} y={el.y + el.height/2} radius={radius} stroke={el.stroke} fill={el.fill} strokeWidth={el.strokeWidth} />;
      }
      if (el.shapeType === 'arrow') {
          return <Arrow {...commonProps} points={[el.x, el.y, el.x + el.width, el.y + el.height]} stroke={el.stroke} fill={el.stroke} strokeWidth={el.strokeWidth} pointerLength={10} pointerWidth={10} />;
      }
      if (el.shapeType === 'diamond') {
          return (
            <Line
                {...commonProps}
                points={[
                    el.x + el.width / 2, el.y,
                    el.x + el.width, el.y + el.height / 2,
                    el.x + el.width / 2, el.y + el.height,
                    el.x, el.y + el.height / 2
                ]}
                closed
                stroke={el.stroke}
                fill={el.fill}
                strokeWidth={el.strokeWidth}
            />
          );
      }
      if (el.shapeType === 'line') {
          return <Line {...commonProps} points={[el.x, el.y, el.x + el.width, el.y + el.height]} stroke={el.stroke} strokeWidth={el.strokeWidth} />;
      }
    }

    if (el.type === 'text') {
        return <Text {...commonProps} x={el.x} y={el.y} text={el.text} fontSize={el.fontSize} fill={el.stroke} />;
    }

    return null;
  };

  return (
    <Group
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Invisible background for click events */}
      <Rect
        x={-50000}
        y={-50000}
        width={100000}
        height={100000}
        fill="transparent"
        onClick={() => {
            if (activeTool === 'select') setSelectedIds([]);
        }}
        onTap={() => {
            if (activeTool === 'select') setSelectedIds([]);
        }}
      />
      {elements.map(renderElement)}
    </Group>
  );
};

export default DrawingLayer;
