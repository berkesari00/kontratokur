import { useState } from 'react';
import { Shield, FileText, AlertTriangle, ChevronDown, ChevronUp, Mail } from 'lucide-react';
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
      {/* Risk Skoru Kartı */}
      <div className={`p-6 rounded-2xl border ${riskInfo.borderColor} ${riskInfo.bgColor}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Risk Analizi
          </h3>
          <span className={`text-3xl font-bold ${riskInfo.color}`}>
            {riskScore}
            <span className="text-lg font-normal text-gray-400">/100</span>
          </span>
        </div>
        <p className={`text-sm ${riskInfo.color}`}>{riskInfo.message}</p>
        
        {/* İstatistikler */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/70 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-danger">{dangerCount}</p>
            <p className="text-xs text-gray-500">Kritik</p>
          </div>
          <div className="bg-white/70 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-warning">{warningCount}</p>
            <p className="text-xs text-gray-500">Uyarı</p>
          </div>
          <div className="bg-white/70 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-safe">{risks.length - dangerCount - warningCount}</p>
            <p className="text-xs text-gray-500">Güvenli</p>
          </div>
        </div>
      </div>

      {/* Belge Bilgisi */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-legal-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-legal-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{documentName}</p>
            <p className="text-xs text-gray-400">{risks.length} madde analiz edildi</p>
          </div>
        </div>
      </div>

      {/* Risk Listesi */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-800 px-1">Tespit Edilen Riskler</h4>
        {risks.filter(r => r.risk_level !== 'safe').map((risk, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <button
              onClick={() => setExpandedRisk(expandedRisk === index ? null : index)}
              className="w-full p-4 text-left flex items-start justify-between gap-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <RiskBadge level={risk.risk_level} size="sm" />
                </div>
                <p className="font-medium text-gray-800 text-sm">{risk.risk_title}</p>
              </div>
              {expandedRisk === index ? (
                <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
              )}
            </button>

            {expandedRisk === index && (
              <div className="px-4 pb-4 animate-fade-in">
                <div className="bg-gray-50 rounded-xl p-4 mb-3">
                  <p className="text-sm text-gray-700 mb-2">{risk.explanation}</p>
                  {risk.original_text && (
                    <blockquote className="border-l-4 border-danger pl-3 py-1 text-sm text-gray-600 italic bg-white rounded-r-lg p-2">
                      "{risk.original_text}"
                    </blockquote>
                  )}
                </div>
                
                {risk.suggestion && (
                  <p className="text-xs text-legal-700 bg-legal-50 rounded-lg p-3 mb-3">
                    💡 <strong>Öneri:</strong> {risk.suggestion}
                  </p>
                )}

                <button
                  onClick={() => handleObjection(risk)}
                  className="w-full flex items-center justify-center gap-2 bg-legal-600 hover:bg-legal-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  İtiraz Maili Oluştur
                </button>
              </div>
            )}
          </div>
        ))}

                {risks.filter(r => r.risk_level !== 'safe').length === 0 && (
          <div className="bg-safe-light border border-safe rounded-2xl p-6 text-center">
            <p className="text-safe-dark font-medium">🎉 Harika! Ciddi bir risk tespit edilmedi.</p>
          </div>
        )}
      </div>

      {/* Modal'ı en sona ekliyoruz */}
      <ObjectionModal />
    </div>
  );
}