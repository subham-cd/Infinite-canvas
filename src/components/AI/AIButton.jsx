import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { analyzeSketch } from '../../lib/gemini';
import { useIsMobile } from '../../hooks/useMediaQuery';
import toast from 'react-hot-toast';

const AIButton = () => {
  const isMobile = useIsMobile();
  const { setAIPanelOpen } = useUIStore();
  const [loading, setLoading] = useState(false);

  const handleAIEnhance = async () => {
    const stage = document.querySelector('.konvajs-content canvas');
    if (!stage) return;

    setLoading(true);
    toast.loading('Analyzing sketch...', { id: 'ai-status' });

    try {
      const dataUrl = stage.toDataURL();
      const result = await analyzeSketch(dataUrl);
      
      // Store result in UI store or pass it to panel
      window.lastAIResult = result; 
      
      setAIPanelOpen(true);
      toast.success('Analysis complete!', { id: 'ai-status' });
    } catch (error) {
      toast.error('AI Analysis failed. Check API key.', { id: 'ai-status' });
    } finally {
      setLoading(false);
    }
  };

  if (isMobile) {
    return (
      <button
        onClick={handleAIEnhance}
        disabled={loading}
        className="fixed bottom-[100px] right-6 w-14 h-14 bg-ai-gradient rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-500/40 z-50 ai-bounce active:scale-90 transition-transform disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
      </button>
    );
  }

  return (
    <button
      onClick={handleAIEnhance}
      disabled={loading}
      className="fixed top-6 right-6 px-6 py-2.5 bg-ai-gradient text-white font-semibold rounded-full flex items-center gap-2 shadow-lg shadow-purple-500/20 z-50 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
    >
      {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
      <span>AI Enhance</span>
    </button>
  );
};

export default AIButton;
