import { create } from 'zustand';

const useStore = create((set, get) => ({
  // Belge durumu
  documentText: '',
  documentName: '',
  isLoading: false,
  isAnalyzing: false,
  analysisProgress: 0,
  error: null,

  // Analiz sonuçları
  chunks: [],
  risks: [],
  riskScore: 0,

  // UI durumu
  selectedRisk: null,
  showObjectionModal: false,
  objectionText: '',
  isGeneratingObjection: false,

  // Actions
  setDocument: (text, name) => set({ documentText: text, documentName: name }),
  setLoading: (isLoading) => set({ isLoading }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setAnalysisProgress: (progress) => set({ analysisProgress: progress }),
  setError: (error) => set({ error }),
  setRisks: (risks) => set({ risks }),
  setRiskScore: (score) => set({ riskScore: score }),
  setSelectedRisk: (risk) => set({ selectedRisk: risk }),
  setShowObjectionModal: (show) => set({ showObjectionModal: show }),
  setObjectionText: (text) => set({ objectionText: text }),
  setIsGeneratingObjection: (isGenerating) => set({ isGeneratingObjection: isGenerating }),

  // Reset
  resetAnalysis: () => set({
    documentText: '',
    documentName: '',
    isLoading: false,
    isAnalyzing: false,
    analysisProgress: 0,
    error: null,
    chunks: [],
    risks: [],
    riskScore: 0,
    selectedRisk: null,
    showObjectionModal: false,
    objectionText: '',
  }),
}));

export default useStore;