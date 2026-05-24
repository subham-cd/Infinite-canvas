import React from 'react';
import { useUIStore } from '../../store/uiStore';

const WidthPopover = ({ onClose }) => {
  const { 
    activeTool,
    strokeWidth, setStrokeWidth,
    opacity, setOpacity,
    eraserSize, setEraserSize
  } = useUIStore();

  return (
    <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 bg-[#1e293b] border border-white/10 rounded-2xl p-5 shadow-2xl min-w-[240px] z-[1001] animate-in fade-in slide-in-from-bottom-2 duration-150 flex flex-col gap-6">
      
      {activeTool === 'eraser' ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[12px] font-bold text-slate-400">
            <span>Eraser Size</span>
            <span className="font-mono text-purple-400">{eraserSize}px</span>
          </div>
          <input 
            type="range" min="10" max="80" step="1"
            value={eraserSize}
            onChange={(e) => setEraserSize(parseInt(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none accent-[#7c3aed] cursor-pointer"
          />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[12px] font-bold text-slate-400">
              <span>Width</span>
              <span className="font-mono text-purple-400">{strokeWidth}px</span>
            </div>
            <input 
              type="range" min="1" max="20" step="1"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none accent-[#7c3aed] cursor-pointer"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-[12px] font-bold text-slate-400">
              <span>Opacity</span>
              <span className="font-mono text-purple-400">{Math.round(opacity * 100)}%</span>
            </div>
            <input 
              type="range" min="10" max="100" step="5"
              value={opacity * 100}
              onChange={(e) => setOpacity(parseInt(e.target.value) / 100)}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none accent-[#7c3aed] cursor-pointer"
            />
          </div>
        </>
      )}

      {/* Backdrop for closing */}
      <div 
        className="fixed inset-0 z-[-1]" 
        onClick={onClose}
      />
    </div>
  );
};

export default WidthPopover;
