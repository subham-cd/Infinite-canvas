import React from 'react';
import { MousePointer2, Pencil, Square, Type, Settings2 } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

const tools = [
  { id: 'select', icon: MousePointer2 },
  { id: 'pen', icon: Pencil },
  { id: 'shape', icon: Square },
  { id: 'text', icon: Type },
];

const BottomNavBar = () => {
  const { activeTool, setActiveTool, setStylePanelOpen } = useUIStore();

  return (
    <div className="fixed bottom-[16px] left-1/2 -translate-x-1/2 min-w-[280px] bg-[#16213e]/85 backdrop-blur-2xl border border-white/10 rounded-[100px] px-4 py-2 flex items-center gap-2 shadow-2xl z-50 animate-in slide-in-from-bottom duration-500 pb-[calc(8px+env(safe-area-inset-bottom))]">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => setActiveTool(tool.id)}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
            activeTool === tool.id 
              ? 'bg-inkmind-purple text-white shadow-[0_0_12px_rgba(124,58,237,0.5)]' 
              : 'text-slate-400'
          }`}
        >
          <tool.icon size={22} />
        </button>
      ))}
      
      <div className="w-[1px] h-6 bg-white/10 mx-1" />
      
      <button
        onClick={() => setStylePanelOpen(true)}
        className="w-12 h-12 flex items-center justify-center rounded-full text-slate-400 active:bg-white/5 transition-colors"
      >
        <Settings2 size={22} />
      </button>
    </div>
  );
};

export default BottomNavBar;
