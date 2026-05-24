import React from 'react';
import InfiniteCanvas from './components/Canvas/InfiniteCanvas';
import TopToolbar from './components/Toolbar/TopToolbar';
import LeftToolbar from './components/Toolbar/LeftToolbar';
import BottomNavBar from './components/Toolbar/BottomNavBar';
import MobileStylePanel from './components/Mobile/MobileStylePanel';
import AIButton from './components/AI/AIButton';
import AIResultPanel from './components/AI/AIResultPanel';
import MobileAIPanel from './components/Mobile/MobileAIPanel';
import { useIsMobile } from './hooks/useMediaQuery';
import { useKeyboard } from './hooks/useKeyboard';
import { useCanvas } from './hooks/useCanvas';
import { Toaster } from 'react-hot-toast';

function App() {
  const isMobile = useIsMobile();
  useKeyboard();
  useCanvas(); // Handles initial load and auto-save

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-inkmind-bg text-slate-200">
      <Toaster position={isMobile ? "top-center" : "bottom-right"} />
      
      {/* Background Canvas */}
      <InfiniteCanvas />

      {/* Overlays */}
      <TopToolbar />
      {!isMobile && <LeftToolbar />}
      {isMobile && <BottomNavBar />}
      
      <AIButton />
      {!isMobile && <AIResultPanel />}
      {isMobile && <MobileAIPanel />}
      
      {isMobile && <MobileStylePanel />}
    </div>
  );
}

export default App;
