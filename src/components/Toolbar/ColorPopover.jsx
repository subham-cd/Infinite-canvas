import React, { useRef } from 'react';

const colors = [
  '#000000', '#ffffff', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#06b6d4', '#3b82f6',
  '#8b5cf6', '#ec4899', '#a855f7'
];

const ColorPopover = ({ type, currentColor, onSelect, onClose }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 bg-[#1e293b] border border-white/10 rounded-2xl p-4 shadow-2xl min-w-[220px] z-[1001] animate-in fade-in slide-in-from-bottom-2 duration-150">
      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">
        {type} Color
      </div>
      
      <div className="grid grid-cols-6 gap-2">
        {type === 'Fill' && (
          <button
            onClick={() => onSelect('transparent')}
            className={`w-8 h-8 rounded-lg border-2 transition-all relative overflow-hidden bg-white ${currentColor === 'transparent' ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}
          >
            <div className="absolute inset-0 border-t-2 border-red-500 -rotate-45 origin-top-left scale-150" />
          </button>
        )}
        
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onSelect(color)}
            className={`w-8 h-8 rounded-lg border-2 transition-all ${currentColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}
            style={{ backgroundColor: color }}
          />
        ))}
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-8 h-8 rounded-lg border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center text-slate-400 hover:border-white/40 transition-colors"
        >
          <span className="text-sm font-bold">+</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="color"
        className="hidden"
        onChange={(e) => onSelect(e.target.value)}
      />

      {/* Backdrop for closing */}
      <div 
        className="fixed inset-0 z-[-1]" 
        onClick={onClose}
      />
    </div>
  );
};

export default ColorPopover;
