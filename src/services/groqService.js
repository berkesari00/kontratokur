// 🆓 Puter.js — API key GEREKMİYOR, CORS yok, sınırsız
// Puter.js index.html'de yüklendi, window.puter olarak global erişilebilir

// Kullanılabilir modeller
const MODELS = [
  'gpt-4o-mini',
  'claude-3-5-sonnet',
  'llama-3.3-70b',
];

/**
 * Puter AI çağrısı yap
 */
async function callPuterAI(model, messages, temperature = 0.1) {
  console.log(`🔄 Puter ile deneniyor: ${model}`);
  
  if (!window.puter) {
    throw new Error('Puter.js yüklenmedi. index.html\'i kontrol et.');
  }

  try {
    const response = await puter.ai.chat(messages, {
      model: model,
      temperature: temperature,
    });

    console.log(`✅ ${model} başarıyla çalıştı!`);
    return response;
  } catch (error) {
    console.error(`❌ ${model} hatası:`, error);
    throw error;
  }
}

/**
 * JSON formatında cevap almak için yardımcı
 */
function extractJsonFromText(text) {
  // Markdown code block içindeki JSON'u çıkar
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch (e) {
      // Devam et
    }
  }
  
  // Direkt JSON objesini bul
  const startIdx = text.indexOf('{');
  const endIdx = text.lastIndexOf('}');
  if (startIdx !== -1 && endIdx !== -1) {
    try {
      return JSON.parse(text.substring(startIdx, endIdx + 1));
    } catch (e) {
      // Devam et
    }
  }
  
  throw new Error('JSON parse edilemedi: ' + text.substring(0, 100));
}

/**
 * Bir metin parçasını analiz eder
 */
export async function analyzeTextChunk(textChunk, userRole = 'genel') {
  const systemPrompt = `Sen uzman bir Türk hukuk danışmanı ve sözleşme analizcisin. 
Görevin sana verilen sözleşme maddesini analiz etmek ve kullanıcı aleyhine olabilecek riskleri tespit etmektir.

Kullanıcı rolü: ${userRole}

Kuralların:
1. Sadece sana verilen metne odaklan, dışarıdan bilgi uydurma.
2. Eğer riskli bir madde yoksa risk_level: "safe" döndür.
3. Açıklamalarını hukuk bilmeyen birinin anlayacağı sade Türkçe ile yaz.
4. Orijinal metindeki riskli cümleyi aynen alıntıla.
5. SADECE geçerli bir JSON objesi döndür, başka hiçbir metin yazma, markdown kullanma.

Zorunlu JSON formatı:
{
  "risk_level": "danger" | "warning" | "safe",
  "risk_title": "Kısa risk başlığı (max 10 kelime)",
  "explanation": "Detaylı açıklama (2-3 cümle, sade Türkçe)",
  "original_text": "Riskli orijinal metin cümlesi",
  "suggestion": "Kullanıcıya öneri (1 cümle)",
  "is_negotiable": true
}`;

  for (const model of MODELS) {
    try {
      const response = await callPuterAI(
        model,
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Şu sözleşme metnini analiz et ve SADECE JSON döndür:\n\n${textChunk}` }
        ],
        0.1
      );
      
      // Puter response yapısı: response.message.content
      const content = response.message?.content || response;
      console.log(`✅ ${model} başarıyla çalıştı!`);
      
      // JSON'u güvenli şekilde parse et
      return extractJsonFromText(content);
      
    } catch (error) {
      console.warn(`⚠️ ${model} başarısız:`, error.message || error);
      if (model === MODELS[MODELS.length - 1]) {
        throw error;
      }
    }
  }
  
  throw new Error('Hiçbir model çalışmadı.');
}

/**
 * İtiraz maili oluşturur
 */
export async function generateObjection(risk, documentName) {
  const systemPrompt = `Sen profesyonel bir hukuk asistanısın. Kullanıcının bir sözleşmedeki riskli maddeye itiraz etmesi gerekiyor. 
Kibar, profesyonel ama kararlı bir dille itiraz maili yaz.

Kurallar:
1. Mail kısa ve öz olsun (max 150 kelime).
2. Konu satırı ekle.
3. Riskli maddeyi belirt ve neden kabul edilemez olduğunu açıkla.
4. Alternatif bir öneri sun.
5. Profesyonel bir kapanış yap.`;

  for (const model of MODELS) {
    try {
      const response = await callPuterAI(
        model,
        [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Belge: ${documentName}\nRiskli madde: ${risk.original_text}\nRisk açıklaması: ${risk.explanation}\nÖneri: ${risk.suggestion}\n\nBu maddeye profesyonel bir itiraz maili yaz.` 
          }
        ],
        0.7
      );
      
      const content = response.message?.content || response;
      console.log(`✅ ${model} başarıyla çalıştı!`);
      return content;
      
    } catch (error) {
      console.warn(`⚠️ ${model} başarısız:`, error.message || error);
      if (model === MODELS[MODELS.length - 1]) {
        throw error;
      }
    }
  }
  
  throw new Error('Hiçbir model çalışmadı.');
}