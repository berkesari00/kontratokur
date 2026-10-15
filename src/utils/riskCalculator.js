/**
 * Risk skorunu hesaplar (0-100 arası, yüksek = tehlikeli)
 * @param {Array} risks - Risk dizisi
 * @returns {number} - Risk skoru
 */
export function calculateRiskScore(risks) {
  if (!risks || risks.length === 0) return 0;

  const weights = {
    danger: 15,
    warning: 7,
    safe: 0,
  };

  let totalScore = 0;
  let riskCount = 0;

  risks.forEach(risk => {
    totalScore += weights[risk.risk_level] || 0;
    if (risk.risk_level !== 'safe') {
      riskCount++;
    }
  });

  // Toplam skoru 0-100 arasına normalize et
  const normalizedScore = Math.min(100, Math.round(totalScore));
  return normalizedScore;
}

/**
 * Risk skoruna göre renk ve mesaj döndürür
 */
export function getRiskInfo(score) {
  if (score >= 70) {
    return {
      color: 'text-danger-dark',
      bgColor: 'bg-danger-light',
      borderColor: 'border-danger',
      message: '⚠️ Yüksek Risk! Bu sözleşmeyi imzalamadan önce mutlaka bir avukata danışın.',
      emoji: '🔴',
    };
  } else if (score >= 40) {
    return {
      color: 'text-warning-dark',
      bgColor: 'bg-warning-light',
      borderColor: 'border-warning',
      message: '🔶 Orta Risk. Bazı maddeleri müzakere etmenizi öneririz.',
      emoji: '🟡',
    };
  } else if (score > 0) {
    return {
      color: 'text-safe-dark',
      bgColor: 'bg-safe-light',
      borderColor: 'border-safe',
      message: '🟢 Düşük Risk. Genel olarak güvenli görünüyor.',
      emoji: '🟢',
    };
  }
  return {
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    message: 'Henüz analiz yapılmadı.',
    emoji: '⚪',
  };
}