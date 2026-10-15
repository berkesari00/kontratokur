import { useState } from 'react';
import { FileSearch, RotateCcw, Play } from 'lucide-react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import DocumentViewer from './components/DocumentViewer';
import AnalysisPanel from './components/AnalysisPanel';
import LoadingOverlay from './components/LoadingOverlay';
import useStore from './store/useStore';
import { splitByClauses } from './utils/textChunker';
import { analyzeTextChunk } from './services/groqService';
import { calculateRiskScore } from './utils/riskCalculator';

export default function App() {
  const {
    documentText,
    documentName,
    isAnalyzing,
    setAnalyzing,          // ← DÜZELTME 1: setIsAnalyzing değil, setAnalyzing
    setAnalysisProgress,
    setRisks,
    setRiskScore,
    resetAnalysis,
    setError,
    error,
  } = useStore();

  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleAnalyze = async () => {
    if (!documentText) return;

    try {
      setAnalyzing(true);
      setAnalysisProgress(0);
      setAnalysisComplete(false);
      setError(null);

      // 1. Metni parçalara böl
      const chunks = splitByClauses(documentText);
      const totalChunks = chunks.length;

      if (totalChunks === 0) {
        throw new Error('Belgeden okunabilir metin çıkarılamadı. Lütfen metin tabanlı bir PDF yükleyin.');
      }

      setAnalysisProgress(10);

      // 2. Her parçayı paralel olarak analiz et
      const analysisPromises = chunks.map(async (chunk, index) => {
        const result = await analyzeTextChunk(chunk, 'genel');
        const progress = 10 + Math.round(((index + 1) / totalChunks) * 80);
        setAnalysisProgress(progress);
        return result;
      });

      const results = await Promise.all(analysisPromises);

      setAnalysisProgress(95);

      // 3. Sonuçları filtrele ve kaydet
      const validRisks = results.filter(r => r && r.risk_level);
      setRisks(validRisks);

      // 4. Risk skorunu hesapla
      const score = calculateRiskScore(validRisks);
      setRiskScore(score);

      setAnalysisProgress(100);
      setAnalysisComplete(true);
    } catch (err) {
      console.error('Analiz hatası:', err);
      setError(err.message);
      alert('Analiz sırasında bir hata oluştu: ' + err.message);
    } finally {
      setAnalyzing(false);   // ← Her durumda kapat
    }
  };

  const handleReset = () => {
    resetAnalysis();
    setAnalysisComplete(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Henüz belge yüklenmediyse */}
        {!documentText ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Sözleşmenizi <span className="text-legal-600">Yapay Zeka</span> ile Analiz Edin
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                PDF'inizi yükleyin, gizli riskleri tespit edelim ve profesyonel itiraz mailleri oluşturalım.
              </p>
            </div>
            <FileUpload />
          </div>
        ) : (
          /* Belge yüklendiyse */
          <div className="space-y-6">
            {/* Üst bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Analiz Sonuçları</h2>
                <p className="text-gray-500">{documentName}</p>
              </div>
              <div className="flex items-center gap-3">
                {!analysisComplete ? (
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 bg-legal-600 hover:bg-legal-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-legal-500/20"
                  >
                    <Play className="w-4 h-4" />
                    {isAnalyzing ? 'Analiz Ediliyor...' : 'Analizi Başlat'}
                  </button>
                ) : (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Yeni Analiz
                  </button>
                )}
              </div>
            </div>

            {/* Hata mesajı */}
            {error && (
              <div className="bg-danger-light border border-danger rounded-xl p-4 text-danger-dark">
                {error}
              </div>
            )}

            {/* Ana içerik: Sol - Belge, Sağ - Analiz */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Belge görüntüleyici (sol, 3 birim) */}
              <div className="lg:col-span-3 h-[70vh]">
                <DocumentViewer />
              </div>

              {/* Analiz paneli (sağ, 2 birim) */}
              <div className="lg:col-span-2">
                {analysisComplete ? (
                  <AnalysisPanel />
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center h-full flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-legal-100 rounded-2xl flex items-center justify-center mb-4">
                      <FileSearch className="w-8 h-8 text-legal-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Analize Hazır
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      "Analizi Başlat" butonuna tıklayarak sözleşmenizi yapay zeka ile inceleyin.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            ⚖️ Bu araç bir hukuk danışmanı değildir. Önemli kararlar için mutlaka bir avukata danışın.
          </p>
          <p className="text-xs text-gray-300 mt-1">
            © 2025 KontratOkur • Berke Sarı tarafından geliştirildi • Çukurova Üniversitesi
          </p>
        </div>
      </footer>

      {/* Loading Overlay */}
      {isAnalyzing && <LoadingOverlay />}
    </div>
  );
}