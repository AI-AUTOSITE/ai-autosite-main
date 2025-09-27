// Type definitions
export type TranslationDirection = 'ja-en' | 'en-ja'
export type TranslationProgress = (current: number, total: number) => void
export type DetectedLanguage = 'japanese' | 'english' | 'unknown'

// Interfaces
export interface TranslationResult {
  translation: string
  detectedLanguage: DetectedLanguage
  direction: TranslationDirection | null
}

export interface TranslationError extends Error {
  service?: string
  originalError?: unknown
}

/**
 * Main translation function with multiple fallback APIs
 */
export async function translateText(
  text: string,
  direction: TranslationDirection = 'ja-en'
): Promise<string> {
  if (!text || text.trim().length === 0) {
    return ''
  }

  const [source, target] = direction.split('-') as [string, string]
  
  // Try MyMemory API first (most reliable for CORS)
  try {
    const textToTranslate = text.substring(0, 500) // MyMemory has 500 char limit
    const encodedText = encodeURIComponent(textToTranslate)
    const langPair = `${source}|${target}`
    
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${langPair}`
    )
    
    if (response.ok) {
      const data = await response.json()
      if (data?.responseData?.translatedText) {
        return data.responseData.translatedText
      }
    }
  } catch (error) {
    console.error('MyMemory translation error:', error)
  }
  
  // Try LibreTranslate as fallback
  try {
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: source === 'ja' ? 'ja' : 'en',
        target: target === 'ja' ? 'ja' : 'en',
        format: 'text'
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data?.translatedText) {
        return data.translatedText
      }
    }
  } catch (error) {
    console.error('LibreTranslate error:', error)
  }
  
  // Google Translate fallback (unofficial API)
  try {
    const encodedText = encodeURIComponent(text)
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodedText}`
    
    const response = await fetch(googleUrl)
    if (response.ok) {
      const data = await response.json()
      if (Array.isArray(data) && data[0]?.[0]?.[0]) {
        return String(data[0][0][0])
      }
    }
  } catch (error) {
    console.error('Google Translate fallback error:', error)
  }
  
  throw new Error('All translation services unavailable. Please try again later.')
}

/**
 * Translate Japanese text to English
 */
export async function translateToEnglish(japaneseText: string): Promise<string> {
  return translateText(japaneseText, 'ja-en')
}

/**
 * Translate English text to Japanese
 */
export async function translateToJapanese(englishText: string): Promise<string> {
  return translateText(englishText, 'en-ja')
}

/**
 * Smart text splitting function for chunking
 */
function smartSplit(text: string, maxLength: number): string[] {
  const chunks: string[] = []
  let currentChunk = ''
  
  // Try to split by sentences first
  const sentences = text.split(/(?<=[。．.!?！？\n])/g)
  
  for (const sentence of sentences) {
    if (sentence.length > maxLength) {
      // Save current chunk if it has content
      if (currentChunk) {
        chunks.push(currentChunk)
        currentChunk = ''
      }
      
      // Split long sentence into smaller parts by words or characters
      const words = sentence.split(/(?<=[、,，\s])/g)
      
      for (const word of words) {
        if (word.length > maxLength) {
          // If even a word is too long, split by characters
          const parts = word.match(new RegExp(`.{1,${maxLength}}`, 'g')) || []
          chunks.push(...parts)
        } else if ((currentChunk + word).length > maxLength) {
          if (currentChunk) {
            chunks.push(currentChunk)
          }
          currentChunk = word
        } else {
          currentChunk += word
        }
      }
    } else if ((currentChunk + sentence).length > maxLength) {
      if (currentChunk) {
        chunks.push(currentChunk)
      }
      currentChunk = sentence
    } else {
      currentChunk += sentence
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk)
  }
  
  return chunks
}

/**
 * Translate text in chunks for long content
 */
export async function translateInChunks(
  text: string,
  direction: TranslationDirection = 'ja-en',
  chunkSize: number = 450,
  onProgress?: TranslationProgress
): Promise<string> {
  if (!text || text.trim().length === 0) {
    return ''
  }

  // If text is short enough, translate directly
  if (text.length <= chunkSize) {
    return translateText(text, direction)
  }

  console.log(`Processing ${text.length} characters in chunks of ${chunkSize}`)
  
  const chunks = smartSplit(text, chunkSize)
  console.log(`Split into ${chunks.length} chunks`)
  
  const translatedChunks: string[] = []
  
  for (let i = 0; i < chunks.length; i++) {
    let retryCount = 0
    const maxRetries = 3
    
    while (retryCount <= maxRetries) {
      try {
        const translated = await translateText(chunks[i], direction)
        translatedChunks.push(translated)
        
        // Report progress
        if (onProgress) {
          onProgress(i + 1, chunks.length)
        }
        
        // Break out of retry loop on success
        break
      } catch (error) {
        console.error(`Translation failed for chunk ${i + 1}, retry ${retryCount}:`, error)
        retryCount++
        
        if (retryCount > maxRetries) {
          // If all retries failed, use original text
          translatedChunks.push(chunks[i])
          console.warn(`Using original text for chunk ${i + 1}`)
          break
        } else {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)))
        }
      }
    }
    
    // Delay between chunks to respect rate limits
    if (i < chunks.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }
  
  // Join translated chunks with appropriate spacing
  const joinChar = direction === 'en-ja' ? '' : ' '
  return translatedChunks.join(joinChar).trim()
}

/**
 * Auto-detect language and translate
 */
export async function autoTranslate(text: string): Promise<TranslationResult> {
  if (!text || text.trim().length === 0) {
    return {
      translation: '',
      detectedLanguage: 'unknown',
      direction: null
    }
  }

  // Detect language
  const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)
  const hasOnlyEnglish = /^[A-Za-z0-9\s\W]+$/.test(text)
  
  if (hasJapanese) {
    const translation = text.length > 450 
      ? await translateInChunks(text, 'ja-en', 450)
      : await translateToEnglish(text)
    return {
      translation,
      detectedLanguage: 'japanese',
      direction: 'ja-en'
    }
  } else if (hasOnlyEnglish) {
    const translation = text.length > 450
      ? await translateInChunks(text, 'en-ja', 450)
      : await translateToJapanese(text)
    return {
      translation,
      detectedLanguage: 'english',
      direction: 'en-ja'
    }
  } else {
    return {
      translation: text,
      detectedLanguage: 'unknown',
      direction: null
    }
  }
}

/**
 * Batch translate multiple texts
 */
export async function batchTranslate(
  texts: string[],
  direction: TranslationDirection = 'ja-en'
): Promise<string[]> {
  const results: string[] = []
  
  for (const text of texts) {
    try {
      const translated = text.length > 450
        ? await translateInChunks(text, direction, 450)
        : await translateText(text, direction)
      results.push(translated)
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error('Batch translation error:', error)
      results.push(text) // Return original text on error
    }
  }
  
  return results
}