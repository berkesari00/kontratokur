import { useState } from 'react';
import { FileText, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import useStore from '../store/useStore';

export default function DocumentViewer() {
  const { documentText, documentName } = useStore();
  const [fontSize, setFontSize] = useState(16);

  return (
    <div className="bg-white/90 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-legal-600 dark:text-legal-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-slate-200 truncate max-w-[200px]">{documentName}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setFontSize(prev => Math.max(12, prev - 2))} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Decrease">
            <ZoomOut className="w-4 h-4 text-gray-500 dark:text-slate-400" />
          </button>
          <span className="text-xs text-gray-400 dark:text-slate-500 w-8 text-center">{fontSize}</span>
          <button onClick={() => setFontSize(prev => Math.min(24, prev + 2))} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Increase">
            <ZoomIn className="w-4 h-4 text-gray-500 dark:text-slate-400" />
          </button>
          <button onClick={() => setFontSize(16)} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors ml-1" title="Reset">
            <RotateCcw className="w-4 h-4 text-gray-500 dark:text-slate-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {documentText && (
          <div className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-slate-200 leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
            {documentText.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}