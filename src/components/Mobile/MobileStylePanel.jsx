import React from 'react';
import { useUIStore } from '../../store/uiStore';
import BottomSheet from './BottomSheet';

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

const MobileStylePanel = () => {
  const { 
    isStylePanelOpen, setStylePanelOpen,
    activeTool, activeShape, setActiveShape,
    strokeStyle, setStrokeStyle, 
    fillStyle, setFillStyle, 
    strokeWidth, setStrokeWidth,
    opacity, setOpacity,
    lineStyle, setLineStyle
  } = useUIStore();

  return (
    <BottomSheet 
      isOpen={isStylePanelOpen} 
      onClose={() => setStylePanelOpen(false)} 
      title="Tools & Styling"
      height="h-[60vh]"
    >
      <div className="space-y-6">
        {activeTool === 'shape' && (
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Shape Type</label>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {shapes.map((shape) => (
                <button
                  key={shape.id}
                  onClick={() => setActiveShape(shape.id)}
                  className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl border-2 transition-all ${
                    activeShape === shape.id 
                      ? 'border-purple-500 bg-purple-500/10 text-purple-400' 
                      : 'border-white/5 bg-white/5 text-slate-400'
                  }`}
                >
                  <shape.icon size={24} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stroke Colors */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Stroke Color</label>
          <div className="flex overflow-x-auto pb-2 gap-3 no-scrollbar">
            {colors.slice(0, 11).map(color => (
              <button
                key={color}
                onClick={() => setStrokeStyle(color)}
                className={`flex-shrink-0 w-12 h-12 rounded-full border-2 transition-all ${strokeStyle === color ? 'border-purple-500 scale-110 shadow-lg' : 'border-white/5'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Fill Colors */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fill Color</label>
          <div className="flex overflow-x-auto pb-2 gap-3 no-scrollbar">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setFillStyle(color)}
                className={`flex-shrink-0 w-12 h-12 rounded-full border-2 transition-all relative overflow-hidden ${fillStyle === color ? 'border-purple-500 scale-110 shadow-lg' : 'border-white/5'}`}
                style={{ backgroundColor: color === 'transparent' ? 'transparent' : color }}
              >
                {color === 'transparent' && (
                  <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                    <div className="w-full h-[2px] bg-red-500 rotate-45" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Stroke</label>
              <span className="text-xs text-slate-400">{strokeWidth}px</span>
            </div>
            <input 
              type="range" min="1" max="20" 
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none accent-purple-500"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Opacity</label>
              <span className="text-xs text-slate-400">{Math.round(opacity * 100)}%</span>
            </div>
            <input 
              type="range" min="0.1" max="1" step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none accent-purple-500"
            />
          </div>
        </div>

        {/* Line Styles */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Line Style</label>
          <div className="flex gap-2">
            {['solid', 'dashed', 'dotted'].map(style => (
              <button
                key={style}
                onClick={() => setLineStyle(style)}
                className={`flex-1 py-3 rounded-xl border transition-all text-sm font-medium ${lineStyle === style ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-white/5 border-white/5 text-slate-400'}`}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};

export default MobileStylePanel;
