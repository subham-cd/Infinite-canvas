import React from 'react';
import { Lightbulb, Layout, Target, PlusCircle } from 'lucide-react';

const AIResultContent = ({ result }) => {
  if (!result) return <div className="text-slate-500">No results found.</div>;

  return (
    <div className="space-y-6">
      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
        <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold uppercase tracking-widest text-[10px]">
          <Target size={14} />
          Detected Intent
        </div>
        <p className="text-slate-200 text-sm leading-relaxed">{result.detected_intent}</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
          <Layout size={14} />
          Diagram Type
        </div>
        <span className="inline-block px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-medium border border-white/5 capitalize">
          {result.diagram_type}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
          <Lightbulb size={14} />
          Improvement Suggestions
        </div>
        <ul className="space-y-3">
          {result.suggestions?.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-300">
              <span className="flex-shrink-0 w-5 h-5 bg-slate-800 flex items-center justify-center rounded-full text-[10px] text-slate-500">{i+1}</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4 pb-8">
        <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
          <PlusCircle size={14} />
          Missing Elements
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{result.missing_elements}</p>
      </div>
    </div>
  );
};

export default AIResultContent;
