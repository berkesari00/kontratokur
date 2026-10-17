import { useState, useEffect } from 'react';
import { FileSearch, RotateCcw, Play, GraduationCap } from 'lucide-react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import DocumentViewer from './components/DocumentViewer';
import AnalysisPanel from './components/AnalysisPanel';
import LoadingOverlay from './components/LoadingOverlay';
import useStore from './store/useStore';
import { splitByClauses } from './utils/textChunker';
import { analyzeTextChunk } from './services/groqService';
import { calculateRiskScore } from './utils/riskCalculator';

// Inline SVG icons (lucide-react marka ikonlarını kaldırdı)
const GitHubIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const LinkedInIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export default function App() {
  const {
    documentText, documentName, isAnalyzing, setAnalyzing, setAnalysisProgress,
    setRisks, setRiskScore, resetAnalysis, setError, error, theme
  } = useStore();

  const [analysisComplete, setAnalysisComplete] = useState(false);

  // 🌙 Apply theme to html element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // 🔕 Puter'ın console log'larını sustur (opsiyonel)
  useEffect(() => {
    if (window.puter) {
      window.puter.quiet = true;
    }
  }, []);

  const handleAnalyze = async () => {
    if (!documentText) return;
    try {
      setAnalyzing(true);
      setAnalysisProgress(0);
      setAnalysisComplete(false);
      setError(null);

      const chunks = splitByClauses(documentText);
      const totalChunks = chunks.length;

      if (totalChunks === 0) {
        throw new Error('No readable text could be extracted from the document. Please upload a text-based PDF.');
      }

      setAnalysisProgress(10);

      const analysisPromises = chunks.map(async (chunk, index) => {
        const result = await analyzeTextChunk(chunk, 'general');
        const progress = 10 + Math.round(((index + 1) / totalChunks) * 80);
        setAnalysisProgress(progress);
        return result;
      });

      const results = await Promise.all(analysisPromises);
      setAnalysisProgress(95);

      const validRisks = results.filter(r => r && r.risk_level);
      setRisks(validRisks);
      setRiskScore(calculateRiskScore(validRisks));

      setAnalysisProgress(100);
      setAnalysisComplete(true);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message);
      alert('An error occurred during analysis: ' + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    resetAnalysis();
    setAnalysisComplete(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* 🎨 Animated Background */}
      <div className="animated-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {!documentText ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Analyze Your Contracts <br />with <span className="glow-text">AI</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
                Upload your PDF contract and let artificial intelligence identify hidden risks and generate professional objection emails.
              </p>
            </div>
            <FileUpload />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis Results</h2>
                <p className="text-gray-500 dark:text-slate-400">{documentName}</p>
              </div>
              <div className="flex items-center gap-3">
                {!analysisComplete ? (
                  <button onClick={handleAnalyze} disabled={isAnalyzing} className="flex items-center gap-2 bg-legal-600 hover:bg-legal-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-legal-500/20">
                    <Play className="w-4 h-4" />
                    {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
                  </button>
                ) : (
                  <button onClick={handleReset} className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 px-6 py-3 rounded-xl font-medium transition-colors border border-gray-200 dark:border-slate-700">
                    <RotateCcw className="w-4 h-4" />
                    New Analysis
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-danger-light dark:bg-red-900/20 border border-danger rounded-xl p-4 text-danger-dark dark:text-red-300">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 h-[70vh]">
                <DocumentViewer />
              </div>
              <div className="lg:col-span-2">
                {analysisComplete ? (
                  <AnalysisPanel />
                ) : (
                  <div className="bg-white/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-slate-700 p-8 text-center h-full flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-legal-100 dark:bg-legal-900/40 rounded-2xl flex items-center justify-center mb-4">
                      <FileSearch className="w-8 h-8 text-legal-600 dark:text-legal-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-2">Ready to Analyze</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
                      Click "Start Analysis" to review your contract with AI.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 🌟 About Developer Section */}
      <section className="py-20 px-4 relative z-10 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-legal-500 dark:text-legal-400 mb-4 font-medium">
            About the Developer
          </p>
          
          <h2 className="text-5xl sm:text-6xl font-extrabold glow-text mb-4">
            Berke Sarı
          </h2>
          
          <div className="flex items-center justify-center gap-2 mb-6 text-gray-600 dark:text-slate-300">
            <GraduationCap className="w-5 h-5" />
            <p className="text-lg">
              Computer Programming Student at Çukurova University
            </p>
          </div>
          
          <p className="text-base text-gray-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Contractor is a portfolio project demonstrating modern web development practices, 
            provider-agnostic AI architecture, and resilient design patterns. Built with React, Vite, 
            Tailwind CSS, and cutting-edge language models.
          </p>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="https://github.com/berkesari00"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:scale-105 transition-transform shadow-lg"
            >
              <GitHubIcon />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/berke-sarı-220117247"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#0077b5] text-white rounded-xl font-medium hover:scale-105 transition-transform shadow-lg"
            >
              <LinkedInIcon />
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            ⚖️ This tool is not a substitute for professional legal advice. Consult a qualified attorney for important decisions.
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">
            © 2026 Contractor • Built with ❤️ by Berke Sarı
          </p>
        </div>
      </footer>

      {isAnalyzing && <LoadingOverlay />}
    </div>
  );
}