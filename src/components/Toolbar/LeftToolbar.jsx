import React from 'react';
import { MousePointer2, Pencil, Square, Type, Eraser, Shapes as ShapesIcon } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import StylePanel from './StylePanel';

const tools = [
  { id: 'select', icon: MousePointer2, label: 'Select (V)' },
  { id: 'pen', icon: Pencil, label: 'Pen (P)' },
  { id: 'shape', icon: Square, label: 'Shapes (S)' },
  { id: 'text', icon: Type, label: 'Text (T)' },
  { id: 'eraser', icon: Eraser, label: 'Eraser (E)' },
];

const LeftToolbar = () => {
  const { activeTool, setActiveTool } = useUIStore();

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
      <div className="flex flex-col gap-2 p-2 bg-inkmind-sidebar/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`p-3 rounded-xl transition-all duration-200 group relative ${
              activeTool === tool.id 
                ? 'bg-inkmind-purple text-white shadow-lg shadow-purple-500/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
            title={tool.label}
          >
            <tool.icon size={24} />
            <span className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-white/10">
              {tool.label}
            </span>
          </button>
        ))}
      </div>
      
      <StylePanel />
    </div>
  );
};

export default LeftToolbar;
