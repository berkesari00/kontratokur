/**
 * Metni parçalara böler
 * @param {string} text - Bölünecek metin
 * @param {number} chunkSize - Her parçanın maksimum karakter sayısı
 * @returns {string[]} - Metin parçaları dizisi
 */
export function splitTextIntoChunks(text, chunkSize = 1500) {
  if (!text || text.length === 0) return [];

  const chunks = [];
  let currentIndex = 0;

  while (currentIndex < text.length) {
    let endIndex = Math.min(currentIndex + chunkSize, text.length);

    // Cümle ortasında kesmemek için en yakın nokta veya satır sonunu bul
    if (endIndex < text.length) {
      const searchRange = text.slice(currentIndex, endIndex);
      
      // Son nokta veya satır sonunu bul
      const lastPeriod = searchRange.lastIndexOf('.');
      const lastNewline = searchRange.lastIndexOf('\n');
      const lastCut = Math.max(lastPeriod, lastNewline);

      if (lastCut > chunkSize * 0.5) { // Parçanın en az yarısı dolu olsun
        endIndex = currentIndex + lastCut + 1;
      }
    }

    const chunk = text.slice(currentIndex, endIndex).trim();
    
    // Boş olmayan parçaları ekle
    if (chunk.length > 50) {
      chunks.push(chunk);
    }

    currentIndex = endIndex;
  }

  return chunks;
}

/**
 * Metni maddelere göre böler (1.1, 1.2, MADDE 5 gibi)
 */
export function splitByClauses(text) {
  // Türkçe sözleşme maddesi kalıplarını yakala
  const clauseRegex = /(?:MADDE|MADDA|Madde)\s*\d+[\.\-]?|(?:^|\n)\d+\.\d+/gi;
  
  const parts = text.split(clauseRegex);
  
  // Çok uzun parçaları tekrar böl
  const chunks = [];
  parts.forEach(part => {
    if (part.length > 2000) {
      chunks.push(...splitTextIntoChunks(part, 1500));
    } else if (part.trim().length > 50) {
      chunks.push(part.trim());
    }
  });

  return chunks.length > 0 ? chunks : splitTextIntoChunks(text);
}