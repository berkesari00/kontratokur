import { useState } from 'react';
import { Shield, FileText, ChevronDown, ChevronUp, Mail } from 'lucide-react';
import useStore from '../store/useStore';
import RiskBadge from './RiskBadge';
import ObjectionModal from './ObjectionModal';
import { getRiskInfo } from '../utils/riskCalculator';

export default function AnalysisPanel() {
  const { risks, riskScore, documentName, setShowObjectionModal, setSelectedRisk } = useStore();
  const [expandedRisk, setExpandedRisk] = useState(null);

  const riskInfo = getRiskInfo(riskScore);
  const dangerCount = risks.filter(r => r.risk_level === 'danger').length;
  const warningCount = risks.filter(r => r.risk_level === 'warning').length;

  const handleObjection = (risk) => {
    setSelectedRisk(risk);
    setShowObjectionModal(true);
  };

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-2xl border ${riskInfo.borderColor} ${riskInfo.bgColor} dark:bg-opacity-20`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-slate-100 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Risk Analysis
          </h3>
          <span className={`text-3xl font-bold ${riskInfo.color}`}>
            {riskScore}
            <span className="text-lg font-normal text-gray-400 dark:text-slate-500">/100</span>
          </span>
        </div>
        <p className={`text-sm ${riskInfo.color}`}>{riskInfo.message}</p>
        
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/70 dark:bg-slate-800/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-danger">{dangerCount}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">Critical</p>
          </div>
          <div className="bg-white/70 dark:bg-slate-800/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-warning">{warningCount}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">Caution</p>
          </div>
          <div className="bg-white/70 dark:bg-slate-800/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-safe">{risks.length - dangerCount - warningCount}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">Safe</p>
          </div>
        </div>
      </div>

      <div className="bg-white/90 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-legal-100 dark:bg-legal-900/40 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-legal-600 dark:text-legal-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-slate-100 truncate">{documentName}</p>
            <p className="text-xs text-gray-400 dark:text-slate-500">{risks.length} clauses analyzed</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-gray-800 dark:text-slate-100 px-1">Detected Risks</h4>
        {risks.filter(r => r.risk_level !== 'safe').map((risk, index) => (
          <div key={index} className="bg-white/90 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-md">
            <button onClick={() => setExpandedRisk(expandedRisk === index ? null : index)} className="w-full p-4 text-left flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <RiskBadge level={risk.risk_level} size="sm" />
                </div>
                <p className="font-medium text-gray-800 dark:text-slate-100 text-sm">{risk.risk_title}</p>
              </div>
              {expandedRisk === index ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
            </button>

            {expandedRisk === index && (
              <div className="px-4 pb-4 animate-fade-in">
                <div className="bg-gray-50 dark:bg-slate-900/50 rounded-xl p-4 mb-3">
                  <p className="text-sm text-gray-700 dark:text-slate-300 mb-2">{risk.explanation}</p>
                  {risk.original_text && (
                    <blockquote className="border-l-4 border-danger pl-3 py-1 text-sm text-gray-600 dark:text-slate-400 italic bg-white dark:bg-slate-800 rounded-r-lg p-2">
                      "{risk.original_text}"
                    </blockquote>
                  )}
                </div>
                
                {risk.suggestion && (
                  <p className="text-xs text-legal-700 dark:text-legal-300 bg-legal-50 dark:bg-legal-900/30 rounded-lg p-3 mb-3">
                    💡 <strong>Suggestion:</strong> {risk.suggestion}
                  </p>
                )}

                <button onClick={() => handleObjection(risk)} className="w-full flex items-center justify-center gap-2 bg-legal-600 hover:bg-legal-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors">
                  <Mail className="w-4 h-4" />
                  Generate Objection Email
                </button>
              </div>
            )}
          </div>
        ))}

        {risks.filter(r => r.risk_level !== 'safe').length === 0 && (
          <div className="bg-safe-light dark:bg-green-900/20 border border-safe rounded-2xl p-6 text-center">
            <p className="text-safe-dark dark:text-green-300 font-medium">🎉 Great! No serious risks detected.</p>
          </div>
        )}
      </div>

      <ObjectionModal />
    </div>
  );
}