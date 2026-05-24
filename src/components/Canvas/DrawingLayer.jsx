import React from 'react';
import { Line, Rect, Circle, Arrow, Text, Group, Path } from 'react-konva';
import { useCanvasStore } from '../../store/canvasStore';
import { useUIStore } from '../../store/uiStore';
import { useHistoryStore } from '../../store/historyStore';
import { getStroke } from 'perfect-freehand';

const MemoRect = React.memo(Rect);
const MemoCircle = React.memo(Circle);
const MemoArrow = React.memo(Arrow);
const MemoLine = React.memo(Line);
const MemoText = React.memo(Text);
const MemoPath = React.memo(Path);

const getSvgPathFromStroke = (points) => {
  if (!points.length) return '';
  
  const d = points.reduce(
    (acc, point, i, arr) => {
      if (i === 0) return ['M', point[0], point[1]];
      
      const prev = arr[i - 1];
      const cpX = (prev[0] + point[0]) / 2;
      const cpY = (prev[1] + point[1]) / 2;
      
      return [...acc, 'Q', prev[0], prev[1], cpX, cpY];
    },
    []
  );
  
  return [...d, 'Z'].join(' ');
};

const DrawingLayer = ({ isStatic, hoveredId }) => {
  const { 
    elements, updateElement, 
    selectedIds, setSelectedIds,
    currentElement
  } = useCanvasStore();
  
  const { activeTool } = useUIStore();
  const { saveHistory } = useHistoryStore();

  const renderElement = (el) => {
    const isHovered = hoveredId === el.id;
    
    const commonProps = {
      id: el.id,
      opacity: isHovered ? 0.5 : el.opacity,
      stroke: isHovered ? '#ff4d4d' : el.stroke,
      fill: isHovered ? '#ff4d4d' : el.fill,
      draggable: activeTool === 'select' && isStatic,
      dash: el.lineStyle === 'dashed' ? [10, 5] : el.lineStyle === 'dotted' ? [2, 5] : null,
      onDragEnd: (e) => {
        const node = e.target;
        updateElement(el.id, { x: node.x(), y: node.y() });
        const latestElements = useCanvasStore.getState().elements;
        saveHistory(latestElements);
      },
      onClick: () => {
        if (activeTool === 'select' && isStatic) setSelectedIds([el.id]);
      },
      onTap: () => {
        if (activeTool === 'select' && isStatic) setSelectedIds([el.id]);
      },
      onDblClick: () => {
        if (el.type === 'text') {
          const newText = prompt('Enter text:', el.text);
          if (newText !== null) {
            updateElement(el.id, { text: newText });
            const latestElements = useCanvasStore.getState().elements;
            saveHistory(latestElements);
          }
        }
      }
    };

    if (el.type === 'pen') {
      const points = [];
      for (let i = 0; i < el.points.length; i += 2) {
        points.push([el.points[i], el.points[i+1]]);
      }
      const stroke = getStroke(points, {
        size: el.strokeWidth * 3,
        thinning: 0.4,
        smoothing: 0.8,
        streamline: 0.7,
        easing: (t) => t,
        simulatePressure: true,
        last: true,
      });
      
      const pathData = getSvgPathFromStroke(stroke);
      return <MemoPath key={el.id} {...commonProps} data={pathData} fill={isHovered ? '#ff4d4d' : el.stroke} />;
    }

    if (el.type === 'shape') {
      const shapeType = el.shapeType;
      if (shapeType === 'rectangle') {
        return <MemoRect key={el.id} {...commonProps} x={el.x} y={el.y} width={el.width} height={el.height} strokeWidth={el.strokeWidth} />;
      }
      if (shapeType === 'circle') {
        const radius = Math.sqrt(Math.pow(el.width, 2) + Math.pow(el.height, 2)) / 2;
        return <MemoCircle key={el.id} {...commonProps} x={el.x + el.width/2} y={el.y + el.height/2} radius={radius} strokeWidth={el.strokeWidth} />;
      }
      if (shapeType === 'arrow') {
          return <MemoArrow key={el.id} {...commonProps} points={[el.x, el.y, el.x + el.width, el.y + el.height]} strokeWidth={el.strokeWidth} pointerLength={10} pointerWidth={10} />;
      }
      if (shapeType === 'diamond') {
          return (
            <MemoLine
                key={el.id}
                {...commonProps}
                points={[
                    el.x + el.width / 2, el.y,
                    el.x + el.width, el.y + el.height / 2,
                    el.x + el.width / 2, el.y + el.height,
                    el.x, el.y + el.height / 2
                ]}
                closed
                strokeWidth={el.strokeWidth}
            />
          );
      }
      if (shapeType === 'line') {
          return <MemoLine key={el.id} {...commonProps} points={[el.x, el.y, el.x + el.width, el.y + el.height]} strokeWidth={el.strokeWidth} />;
      }
    }

    if (el.type === 'text') {
        return <MemoText key={el.id} {...commonProps} x={el.x} y={el.y} text={el.text} fontSize={el.fontSize} fill={isHovered ? '#ff4d4d' : el.stroke} />;
    }

    return null;
  };

  if (isStatic) {
    return (
        <Group>
            {elements.map(el => renderElement(el))}
        </Group>
    );
  } else {
    return (
        <Group>
            {currentElement && renderElement(currentElement)}
        </Group>
    );
  }
};

export default React.memo(DrawingLayer);
