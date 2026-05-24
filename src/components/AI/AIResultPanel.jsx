import React from 'react';
import { useUIStore } from '../../store/uiStore';
import AIResultContent from './AIResultContent';
import { X } from 'lucide-react';

const AIResultPanel = () => {
  const { isAIPanelOpen, setAIPanelOpen } = useUIStore();
  const result = window.lastAIResult;

  if (!isAIPanelOpen) return null;

  return (
    <div className="fixed right-6 top-24 bottom-6 w-80 bg-inkmind-sidebar/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl z-40 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-white/5 flex justify-between items-center">
        <h3 className="font-bold text-slate-200">✨ AI Analysis</h3>
        <button onClick={() => setAIPanelOpen(false)} className="p-1 hover:bg-white/5 rounded text-slate-400">
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <AIResultContent result={result} />
      </div>
    </div>
  );
};

export default AIResultPanel;
