import { useState, useEffect } from 'react';
import { X, Copy, Check, Loader2, Mail } from 'lucide-react';
import useStore from '../store/useStore';
import { generateObjection } from '../services/groqService';

export default function ObjectionModal() {
  const { selectedRisk, showObjectionModal, setShowObjectionModal, documentName, objectionText, setObjectionText, isGeneratingObjection, setIsGeneratingObjection } = useStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (showObjectionModal && selectedRisk) {
      handleGenerate();
    }
  }, [showObjectionModal, selectedRisk]);

  const handleGenerate = async () => {
    setIsGeneratingObjection(true);
    try {
      const text = await generateObjection(selectedRisk, documentName);
      setObjectionText(text);
    } catch (error) {
      console.error('Failed to generate objection:', error);
    } finally {
      setIsGeneratingObjection(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(objectionText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleClose = () => {
    setShowObjectionModal(false);
    setObjectionText('');
  };

  if (!showObjectionModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose}></div>

      <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden animate-fade-in border border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-legal-100 dark:bg-legal-900/40 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-legal-600 dark:text-legal-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Objection Email</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400">{selectedRisk?.risk_title}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {isGeneratingObjection ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-legal-600 animate-spin mb-4" />
              <p className="text-gray-500 dark:text-slate-400">Preparing professional objection email...</p>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-slate-900/50 rounded-2xl p-6">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-slate-200 font-sans leading-relaxed">
                {objectionText}
              </pre>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-slate-700 flex justify-end gap-3">
          <button onClick={handleClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
            Close
          </button>
          <button onClick={handleCopy} disabled={!objectionText || isGeneratingObjection} className="flex items-center gap-2 px-5 py-2.5 bg-legal-600 hover:bg-legal-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors">
            {copied ? (<><Check className="w-4 h-4" /> Copied!</>) : (<><Copy className="w-4 h-4" /> Copy to Clipboard</>)}
          </button>
        </div>
      </div>
    </div>
  );
}