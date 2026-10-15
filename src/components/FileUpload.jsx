import { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import useStore from '../store/useStore';
import { extractTextFromPDF, cleanText } from '../services/pdfService';

export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { setDocument, setLoading, isLoading, resetAnalysis } = useStore();

  const handleFile = async (file) => {
    if (!file) return;

    // PDF kontrolü
    if (file.type !== 'application/pdf') {
      alert('Lütfen sadece PDF dosyası yükleyin.');
      return;
    }

    // Boyut kontrolü (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Dosya boyutu 10MB\'dan küçük olmalıdır.');
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300
          ${isDragging 
            ? 'border-legal-500 bg-legal-50 scale-[1.02]' 
            : 'border-gray-300 bg-white hover:border-legal-400 hover:bg-legal-50/50'
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
            <p className="text-lg font-medium text-gray-700">PDF okunuyor...</p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-legal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-legal-600" />
            </div>
            <p className="text-lg font-semibold text-gray-800 mb-1">
              Sözleşmenizi buraya sürükleyin
            </p>
            <p className="text-sm text-gray-500 mb-4">
              veya dosya seçmek için tıklayın
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <FileText className="w-4 h-4" />
              <span>PDF • Max 10MB</span>
            </div>
          </>
        )}
      </div>

      {/* Desteklenen belgeler */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {['Freelance Sözleşmesi', 'Kira Kontratı', 'Gizlilik Politikası', 'İş Sözleşmesi'].map((doc) => (
          <span
            key={doc}
            className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full"
          >
            {doc}
          </span>
        ))}
      </div>
    </div>
  );
}