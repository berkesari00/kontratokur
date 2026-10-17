import { useState, useRef } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
import useStore from '../store/useStore';
import { extractTextFromPDF, cleanText } from '../services/pdfService';

export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { setDocument, setLoading, isLoading } = useStore();

  const handleFile = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file only.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }
    setLoading(true);
    try {
      const rawText = await extractTextFromPDF(file);
      const cleanedText = cleanText(rawText);
      setDocument(cleanedText, file.name);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };
  const handleInputChange = (e) => handleFile(e.target.files[0]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300
          bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm
          ${isDragging 
            ? 'border-legal-500 bg-legal-50 dark:bg-legal-900/20 scale-[1.02]' 
            : 'border-gray-300 dark:border-slate-600 hover:border-legal-400 hover:bg-legal-50/50 dark:hover:bg-slate-700/50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleInputChange}
          className="hidden"
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-legal-600 animate-spin" />
            <p className="text-lg font-medium text-gray-700 dark:text-slate-200">Reading PDF...</p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-legal-100 dark:bg-legal-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-legal-600 dark:text-legal-400" />
            </div>
            <p className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
              Drag & drop your contract here
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
              or click to browse files
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-slate-500">
              <FileText className="w-4 h-4" />
              <span>PDF • Max 10MB</span>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {['Freelance Agreement', 'Lease Contract', 'Privacy Policy', 'Employment Contract'].map((doc) => (
          <span key={doc} className="text-xs bg-white/80 dark:bg-slate-800/50 text-gray-600 dark:text-slate-300 px-3 py-1.5 rounded-full backdrop-blur-sm border border-gray-200 dark:border-slate-700">
            {doc}
          </span>
        ))}
      </div>
    </div>
  );
}