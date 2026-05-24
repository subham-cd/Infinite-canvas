import React from 'react';
import { useUIStore } from '../../store/uiStore';
import BottomSheet from './BottomSheet';
import AIResultContent from '../AI/AIResultContent';

const MobileAIPanel = () => {
  const { isAIPanelOpen, setAIPanelOpen } = useUIStore();
  const result = window.lastAIResult;

  return (
    <BottomSheet
      isOpen={isAIPanelOpen}
      onClose={() => setAIPanelOpen(false)}
      title="✨ AI Analysis"
      height="h-[80vh]"
    >
      <AIResultContent result={result} />
    </BottomSheet>
  );
};

export default MobileAIPanel;
