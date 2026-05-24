# InkMind — AI-Powered Infinite Whiteboard

InkMind is a production-ready infinite canvas whiteboard application built with React, Konva.js, and Google Gemini AI.

## Features

- **Infinite Canvas**: Pan and zoom infinitely in any direction.
- **Advanced Drawing Tools**: Smooth freehand drawing (perfect-freehand), shapes, text, and eraser.
- **AI Enhancement**: Analyze your sketches with Google Gemini 2.0 Flash to get insights and suggestions.
- **Responsive Design**: Tailored experiences for both Desktop (sidebar) and Mobile (bottom navigation).
- **Undo/Redo**: 50-step history tracking.
- **Cloud Sync**: Auto-save and load via Supabase.
- **Export**: Export your work as high-resolution PNG or share directly on mobile.

## Tech Stack

- **Frontend**: React 18, Vite, Konva.js, Tailwind CSS
- **State**: Zustand (Split stores for performance)
- **AI**: Google Gemini API
- **Backend**: Supabase
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Setup

1. Clone the repository.
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` and add your API keys.
4. Run the development server: `npm run dev`

## Keyboard Shortcuts (Desktop)

- `V`: Select Tool
- `P`: Pen Tool
- `S`: Shapes Tool
- `T`: Text Tool
- `E`: Eraser Tool
- `Ctrl + Z`: Undo
- `Ctrl + Shift + Z`: Redo
- `Ctrl + S`: Save
- `Ctrl + A`: Select All
- `Backspace / Delete`: Delete Selected
- `Space + Drag`: Pan
- `Scroll`: Zoom
- `Escape`: Deselect
