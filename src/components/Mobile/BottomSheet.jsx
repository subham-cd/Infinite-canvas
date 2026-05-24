import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const BottomSheet = ({ isOpen, onClose, title, children, height = 'h-[70vh]' }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" 
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div 
        className={`absolute bottom-0 left-0 right-0 ${height} bg-[#1a1a2e] border-t border-white/10 rounded-t-[32px] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col bottom-sheet-transition ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        onTransitionEnd={handleAnimationEnd}
      >
        {/* Handle */}
        <div className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 bg-white/20 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-white/5">
          <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 pb-12">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
