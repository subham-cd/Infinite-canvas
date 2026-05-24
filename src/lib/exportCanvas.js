export const exportToPNG = (stage) => {
  if (!stage) return;
  
  const dataURL = stage.toDataURL({ pixelRatio: 2 });
  const link = document.createElement('a');
  link.download = `inkmind-export-${Date.now()}.png`;
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const shareCanvas = async (stage) => {
    if (!stage || !navigator.share) return;
    
    try {
        const dataURL = stage.toDataURL({ pixelRatio: 2 });
        const blob = await (await fetch(dataURL)).blob();
        const file = new File([blob], `inkmind-${Date.now()}.png`, { type: 'image/png' });
        
        await navigator.share({
            files: [file],
            title: 'InkMind Export',
        });
    } catch (error) {
        console.error('Share failed:', error);
    }
};
