import { useState } from 'react';
import { FileText, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import useStore from '../store/useStore';

export default function DocumentViewer() {
  const { documentText, documentName, risks } = useStore();
  const [fontSize, setFontSize] = useState(16);

  // Metni riskli kısımlara göre vurgula
  const renderHighlightedText = () => {
    if (!documentText) return null;

    // Şimdilik düz metin göster, ileride risk bazlı vurgulama eklenecek
    return (
      <div 
        className="prose prose-sm max-w-none text-gray-800 leading-relaxed"
        style={{ fontSize: `${fontSize}px` }}
      >
        {documentText.split('\n\n').map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-legal-600" />
          <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
            {documentName}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Küçült"
          >
            <ZoomOut className="w-4 h-4 text-gray-500" />
          </button>
          <span className="text-xs text-gray-400 w-8 text-center">{fontSize}</span>
          <button
            onClick={() => setFontSize(prev => Math.min(24, prev + 2))}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Büyüt"
          >
            <ZoomIn className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => setFontSize(16)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors ml-1"
            title="Sıfırla"
          >
            <RotateCcw className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Document Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {renderHighlightedText()}
      </div>
    </div>
  );
}