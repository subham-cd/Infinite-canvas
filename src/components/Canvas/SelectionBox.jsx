import React, { useRef, useEffect } from 'react';
import { Transformer } from 'react-konva';
import { useCanvasStore } from '../../store/canvasStore';
import { useUIStore } from '../../store/uiStore';

const SelectionBox = () => {
  const trRef = useRef(null);
  const { selectedIds, elements, updateElement } = useCanvasStore();
  const { activeTool } = useUIStore();

  useEffect(() => {
    if (activeTool !== 'select') {
      trRef.current?.nodes([]);
      return;
    }

    const stage = trRef.current?.getStage();
    const nodes = selectedIds
      .map(id => stage?.findOne(`#${id}`))
      .filter(node => node !== undefined);

    if (nodes.length > 0) {
      trRef.current?.nodes(nodes);
      trRef.current?.getLayer()?.batchDraw();
    } else {
      trRef.current?.nodes([]);
    }
  }, [selectedIds, activeTool, elements]);

  if (activeTool !== 'select') return null;

  return (
    <Transformer
      ref={trRef}
      boundBoxFunc={(oldBox, newBox) => {
        // limit resize
        if (newBox.width < 5 || newBox.height < 5) {
          return oldBox;
        }
        return newBox;
      }}
      onTransformEnd={(e) => {
          const node = e.target;
          const id = node.id();
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          
          node.scaleX(1);
          node.scaleY(1);
          
          updateElement(id, {
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
              rotation: node.rotation(),
          });
      }}
    />
  );
};

export default SelectionBox;
