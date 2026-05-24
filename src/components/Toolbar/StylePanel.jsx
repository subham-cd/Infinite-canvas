import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { HexColorPicker } from 'react-colorful';

const colors = [
  '#000000', '#ffffff', '#f87171', '#fb923c', '#fbbf24', '#4ade80', 
  '#22d3ee', '#60a5fa', '#818cf8', '#a78bfa', '#f472b6', 'transparent'
];

import { Square, Circle as CircleIcon, ArrowUpRight, Minus, Triangle } from 'lucide-react';

const shapes = [
  { id: 'rectangle', icon: Square },
  { id: 'circle', icon: CircleIcon },
  { id: 'arrow', icon: ArrowUpRight },
  { id: 'line', icon: Minus },
  { id: 'diamond', icon: Triangle },
];

const StylePanel = () => {
  const { 
    activeTool, activeShape, setActiveShape,
    strokeStyle, setStrokeStyle, 
    fillStyle, setFillStyle, 
    strokeWidth, setStrokeWidth,
    opacity, setOpacity,
    lineStyle, setLineStyle
  } = useUIStore();

  return (
    <div className="w-48 p-4 bg-inkmind-sidebar/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col gap-4">
      {activeTool === 'shape' && (
        <div className="space-y-2 pb-2 border-b border-white/5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Shape Type</label>
          <div className="grid grid-cols-5 gap-1">
            {shapes.map((shape) => (
              <button
                key={shape.id}
                onClick={() => setActiveShape(shape.id)}
                className={`p-1.5 rounded-md transition-all ${
                  activeShape === shape.id 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-white/5 text-slate-400 hover:text-slate-200'
                }`}
                title={shape.id.charAt(0).toUpperCase() + shape.id.slice(1)}
              >
                <shape.icon size={16} />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stroke</label>
        <div className="grid grid-cols-4 gap-1">
          {colors.slice(0, 11).map(color => (
            <button
              key={color}
              onClick={() => setStrokeStyle(color)}
              className={`w-full aspect-square rounded-md border border-white/5 transition-transform active:scale-90 ${strokeStyle === color ? 'ring-2 ring-purple-500' : ''}`}
              style={{ backgroundColor: color }}
            />
          ))}
          <div className="relative group">
              <button className="w-full aspect-square rounded-md border border-white/5 bg-slate-700 flex items-center justify-center text-xs">+</button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fill</label>
        <div className="grid grid-cols-4 gap-1">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => setFillStyle(color)}
              className={`w-full aspect-square rounded-md border border-white/5 transition-transform active:scale-90 ${fillStyle === color ? 'ring-2 ring-purple-500' : ''} ${color === 'transparent' ? 'bg-slate-800 relative overflow-hidden' : ''}`}
              style={{ backgroundColor: color === 'transparent' ? undefined : color }}
            >
                {color === 'transparent' && <div className="absolute inset-0 border-t border-red-500 -rotate-45 origin-top-left scale-150" />}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Width</label>
            <span className="text-[10px] text-slate-400 font-mono">{strokeWidth}px</span>
        </div>
        <input 
          type="range" min="1" max="20" step="1"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Opacity</label>
            <span className="text-[10px] text-slate-400 font-mono">{Math.round(opacity * 100)}%</span>
        </div>
        <input 
          type="range" min="0.1" max="1" step="0.1"
          value={opacity}
          onChange={(e) => setOpacity(parseFloat(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Style</label>
        <div className="flex gap-1">
          {['solid', 'dashed', 'dotted'].map(style => (
            <button
              key={style}
              onClick={() => setLineStyle(style)}
              className={`flex-1 py-1 text-[10px] rounded border border-white/5 transition-colors ${lineStyle === style ? 'bg-purple-500 text-white' : 'bg-white/5 text-slate-400 hover:text-slate-200'}`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StylePanel;
