import React from 'react';
import { Undo2, Redo2, Save, Download, Maximize } from 'lucide-react';
import { useCanvasStore } from '../../store/canvasStore';
import { useHistoryStore } from '../../store/historyStore';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { saveCanvas } from '../../lib/canvasSave';
import toast from 'react-hot-toast';

import { exportToPNG, shareCanvas } from '../../lib/exportCanvas';

const TopToolbar = () => {
  const isMobile = useIsMobile();
  const { elements, setElements, setStagePos, setStageScale } = useCanvasStore();
  const { undo, redo, past, future } = useHistoryStore();

  const handleUndo = () => {
    const prevElements = undo(elements);
    if (prevElements) setElements(prevElements);
  };

  const handleRedo = () => {
    const nextElements = redo(elements);
    if (nextElements) setElements(nextElements);
  };

  const handleResetView = () => {
    setStagePos({ x: 0, y: 0 });
    setStageScale(1);
  };

  const handleManualSave = async () => {
    const result = await saveCanvas(elements);
    if (result.success) {
      toast.success('Saved ✓');
    } else {
      toast.error('Save failed ❌');
    }
  };

  const handleExport = () => {
    const stage = document.querySelector('.konvajs-content canvas');
    if (!stage) return;
    
    if (isMobile && navigator.share) {
        shareCanvas(stage);
    } else {
        exportToPNG(stage);
    }
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-inkmind-sidebar/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50">
      <div className="flex items-center gap-1 pr-3 border-r border-white/10">
        <button 
          onClick={handleUndo}
          disabled={past.length === 0}
          className="p-2 hover:bg-white/5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={20} className="text-slate-200" />
        </button>
        <button 
          onClick={handleRedo}
          disabled={future.length === 0}
          className="p-2 hover:bg-white/5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 size={20} className="text-slate-200" />
        </button>
      </div>

      <div className="flex items-center gap-1 px-1">
        <button 
          onClick={handleManualSave}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          title="Save (Ctrl+S)"
        >
          <Save size={20} className="text-slate-200" />
        </button>
        <button 
          onClick={handleExport}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          title={isMobile ? "Share" : "Export PNG"}
        >
          <Download size={20} className="text-slate-200" />
        </button>
        <button 
          onClick={handleResetView}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          title="Reset View"
        >
          <Maximize size={20} className="text-slate-200" />
        </button>
      </div>
      
      {!isMobile && (
          <div className="pl-3 border-l border-white/10 ml-2">
            <span className="text-xs font-bold bg-ai-gradient bg-clip-text text-transparent uppercase tracking-wider">InkMind AI</span>
          </div>
      )}
    </div>
  );
};

export default TopToolbar;
