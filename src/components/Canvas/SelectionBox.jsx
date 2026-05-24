import React, { useRef, useEffect } from 'react';
import { Transformer } from 'react-konva';
import { useCanvasStore } from '../../store/canvasStore';
import { useUIStore } from '../../store/uiStore';

const SelectionBox = () => {
  const trRef = useRef(null);
  const { selectedIds, elements, updateElement } = useCanvasStore();
  const { activeTool } = useUIStore();

  useEffect(() => {
    if (!trRef.current) return;

    if (activeTool !== 'select' || selectedIds.length === 0) {
      trRef.current.nodes([]);
      trRef.current.getLayer()?.batchDraw();
      return;
    }

    const stage = trRef.current.getStage();
    if (!stage) return;

    requestAnimationFrame(() => {
      if (!trRef.current) return;
      
      const nodes = selectedIds
        .map(id => stage.findOne('#' + id))
        .filter(Boolean)
        .filter(node => node.getClassName() !== 'Transformer');

      trRef.current.nodes(nodes);
      trRef.current.getLayer()?.batchDraw();
    });
  }, [selectedIds, activeTool, elements]);

  return (
    <Transformer
      ref={trRef}
      visible={activeTool === 'select' && selectedIds.length > 0}
      rotateEnabled={true}
      keepRatio={false}
      borderStroke="#7c3aed"
      borderStrokeWidth={1.5}
      anchorStroke="#7c3aed"
      anchorFill="#ffffff"
      anchorSize={8}
      anchorCornerRadius={2}
      anchorStrokeWidth={1.5}
      padding={4}
      boundBoxFunc={(oldBox, newBox) => {
        if (newBox.width < 5 || newBox.height < 5) return oldBox;
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
      onDragEnd={(e) => {
        const node = e.target;
        updateElement(node.id(), {
          x: node.x(),
          y: node.y(),
        });
      }}
    />
  );
};

export default SelectionBox;
