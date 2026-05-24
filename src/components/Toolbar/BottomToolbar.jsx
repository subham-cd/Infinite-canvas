import React, { useState, useCallback } from 'react';
import { MousePointer2, Pencil, Shapes, Type, Eraser, SlidersHorizontal, Square, Circle as CircleIcon, ArrowUpRight, Minus, Triangle } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import ColorPopover from './ColorPopover';
import WidthPopover from './WidthPopover';

const tools = [
  { id: "select",  icon: MousePointer2, label: "Select",  shortcut: "V" },
  { id: "pen",     icon: Pencil,        label: "Pen",     shortcut: "P" },
  { id: "shape",   icon: Shapes,        label: "Shapes",  shortcut: "S" },
  { id: "text",    icon: Type,          label: "Text",    shortcut: "T" },
  { id: "eraser",  icon: Eraser,        label: "Eraser",  shortcut: "E" },
];

const shapes = [
  { id: 'rectangle', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: CircleIcon, label: 'Circle' },
  { id: 'arrow', icon: ArrowUpRight, label: 'Arrow' },
  { id: 'line', icon: Minus, label: 'Line' },
  { id: 'diamond', icon: Triangle, label: 'Diamond' },
];

const BottomToolbar = () => {
  const { 
    activeTool, setActiveTool, 
    activeShape, setActiveShape,
    strokeStyle, setStrokeStyle, 
    fillStyle, setFillStyle 
  } = useUIStore();

  const [activePopover, setActivePopover] = useState(null); // 'stroke', 'fill', 'width', 'shape'

  const togglePopover = useCallback((name) => {
    setActivePopover(prev => prev === name ? null : name);
  }, []);

  const handleToolClick = (toolId) => {
    setActiveTool(toolId);
    if (toolId === 'shape') {
      togglePopover('shape');
    } else {
      setActivePopover(null);
    }
  };

  return (
    <div className="fixed bottom-[20px] left-1/2 -translate-x-1/2 z-[1000] flex items-center bg-[#121826]/92 backdrop-blur-[20px] border border-white/10 rounded-full px-2 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] pb-[calc(6px+env(safe-area-inset-bottom))] md:pb-1.5">
      
      {/* Tool Buttons */}
      <div className="flex items-center gap-[2px]">
        {tools.map((tool) => (
          <div key={tool.id} className="relative">
            <button
              onClick={() => handleToolClick(tool.id)}
              className={`w-[44px] h-[44px] md:w-[48px] md:h-[48px] rounded-full flex flex-col items-center justify-center gap-[2px] transition-all duration-150 relative ${
                activeTool === tool.id 
                  ? 'bg-[#7c3aed] text-white shadow-[0_0_16px_rgba(124,58,237,0.5)]' 
                  : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              <tool.icon size={18} className={activeTool === tool.id ? 'text-white' : 'text-inherit'} />
              <span className={`text-[9px] font-bold tracking-wider ${activeTool === tool.id ? 'text-white' : 'text-slate-600'}`}>
                {tool.shortcut}
              </span>
              
              {/* Tooltip on Desktop */}
              <div className="absolute bottom-full mb-4 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-white/10 font-bold hidden md:block">
                 {tool.label}
              </div>
            </button>

            {/* Shape selection popover attachment */}
            {tool.id === 'shape' && activePopover === 'shape' && (
               <div className="absolute bottom-[calc(100%+24px)] left-1/2 -translate-x-1/2 z-[1001] animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-4 shadow-2xl min-w-[220px] flex flex-col gap-3">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">Choose Shape</div>
                    <div className="grid grid-cols-5 gap-2">
                       {shapes.map((s) => (
                         <button
                           key={s.id}
                           onClick={() => {
                             setActiveShape(s.id);
                             setActivePopover(null);
                           }}
                           className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${activeShape === s.id ? 'bg-[#7c3aed] text-white' : 'bg-white/5 text-slate-400 hover:text-slate-200'}`}
                           title={s.label}
                         >
                           <s.icon size={16} />
                         </button>
                       ))}
                    </div>
                  </div>
                  {/* Backdrop for shape popover */}
                  <div className="fixed inset-0 z-[-1]" onClick={() => setActivePopover(null)} />
               </div>
            )}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="w-[1px] h-[28px] bg-white/10 mx-2" />

      {/* Style Controls */}
      <div className="flex items-center gap-3 pr-2">
        {/* Stroke Color */}
        <div className="relative">
          <button
            onClick={() => togglePopover('stroke')}
            className={`w-7 h-7 rounded-full border-2 transition-all ${activePopover === 'stroke' ? 'border-white scale-110' : 'border-white/30'}`}
            style={{ backgroundColor: strokeStyle }}
          />
          {activePopover === 'stroke' && (
            <ColorPopover 
              type="Stroke" 
              currentColor={strokeStyle} 
              onSelect={setStrokeStyle} 
              onClose={() => setActivePopover(null)} 
            />
          )}
        </div>

        {/* Fill Color */}
        <div className="relative">
          <button
            onClick={() => togglePopover('fill')}
            className={`w-7 h-7 rounded-full border-2 transition-all relative overflow-hidden ${activePopover === 'fill' ? 'border-white scale-110' : 'border-white/30'}`}
            style={{ backgroundColor: fillStyle === 'transparent' ? '#fff' : fillStyle }}
          >
            {fillStyle === 'transparent' && (
              <div className="absolute inset-0 border-t-2 border-red-500 -rotate-45 origin-top-left scale-150" />
            )}
          </button>
          {activePopover === 'fill' && (
            <ColorPopover 
              type="Fill" 
              currentColor={fillStyle} 
              onSelect={setFillStyle} 
              onClose={() => setActivePopover(null)} 
            />
          )}
        </div>

        {/* Width/Opacity/Eraser Size */}
        <div className="relative">
          <button
            onClick={() => togglePopover('width')}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${activePopover === 'width' ? 'bg-[#7c3aed] text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:text-slate-200'}`}
          >
            <SlidersHorizontal size={18} />
          </button>
          {activePopover === 'width' && (
            <WidthPopover 
              onClose={() => setActivePopover(null)} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(BottomToolbar);
