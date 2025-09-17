// app/tools/japanese-ocr/lib/translation-helper.ts

// 簡易的な翻訳API（無料）を使用
export async function translateToEnglish(japaneseText: string): Promise<string> {
  // LibreTranslate API（無料・セルフホスト可能）を使用
  try {
    // Option 1: LibreTranslate Mirror（無料・制限あり）
    const response = await fetch('https://translate.terraprint.co/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: japaneseText,
        source: 'ja',
        target: 'en',
        format: 'text'
      })
    })

    if (!response.ok) {
      throw new Error('Translation failed')
    }

    const data = await response.json()
    return data.translatedText
  } catch (error) {
    console.error('Translation error:', error)
    
    // フォールバック: MyMemory Translation API（無料・1日あたり5000文字）
    try {
      const encodedText = encodeURIComponent(japaneseText)
      const fallbackResponse = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=ja|en`
      )
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json()
        return fallbackData.responseData.translatedText
      }
    } catch (fallbackError) {
      console.error('Fallback translation error:', fallbackError)
    }
    
    throw new Error('Translation service unavailable')
  }
}

// バッチ翻訳（長文対応）
export async function translateInChunks(text: string, chunkSize: number = 500): Promise<string> {
  const sentences = text.split('。').filter(s => s.trim())
  const translatedChunks: string[] = []
  
  for (const sentence of sentences) {
    if (sentence.length > chunkSize) {
      // 長い文を分割
      const chunks = sentence.match(new RegExp(`.{1,${chunkSize}}`, 'g')) || []
      for (const chunk of chunks) {
        const translated = await translateToEnglish(chunk + '。')
        translatedChunks.push(translated)
        // レート制限対策
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    } else {
      const translated = await translateToEnglish(sentence + '。')
      translatedChunks.push(translated)
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  return translatedChunks.join(' ')
}