import * as pdfjsLib from 'pdfjs-dist';
import PdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker';

// Worker'ı Vite'ın önerdiği şekilde bağla
pdfjsLib.GlobalWorkerOptions.workerPort = new PdfjsWorker();

// PDF.js worker'ını ayarla
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

/**
 * PDF dosyasından metin çıkarır
 * @param {File} file - Yüklenen PDF dosyası
 * @returns {Promise<string>} - Çıkarılan metin
 */
export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Sayfadaki tüm metin öğelerini birleştir
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');
      
      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('PDF okuma hatası:', error);
    throw new Error('PDF okunurken bir hata oluştu. Lütfen geçerli bir PDF dosyası yükleyin.');
  }
}

/**
 * Metni temizle (gereksiz boşluklar, satır sonları)
 */
export function cleanText(text) {
  return text
    .replace(/\n{3,}/g, '\n\n') // 3'ten fazla satır sonunu 2'ye indir
    .replace(/\s{2,}/g, ' ')    // Birden fazla boşluğu tek boşluğa çevir
    .replace(/-\n/g, '')        // Tireleme ile bölünmüş kelimeleri birleştir
    .trim();
}