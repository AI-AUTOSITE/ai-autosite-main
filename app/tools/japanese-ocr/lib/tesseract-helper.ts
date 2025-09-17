// app/tools/japanese-ocr/lib/tesseract-helper.ts
import { createWorker, PSM } from 'tesseract.js'

export interface OCRResult {
  text: string
  confidence: number
  translation?: string
}

// シンプルなOCR処理
export async function processTesseract(imageData: string): Promise<OCRResult> {
  // createWorkerの正しい使用方法（言語のみ指定）
  const worker = await createWorker(['jpn', 'eng'])

  try {
    const { data } = await worker.recognize(imageData)
    
    return {
      text: data.text.trim(),
      confidence: data.confidence / 100,
      translation: undefined
    }
  } catch (error) {
    console.error('OCR Error:', error)
    throw new Error('Failed to process image with OCR')
  } finally {
    await worker.terminate()
  }
}

// 高度な設定を使用したOCR処理
export async function processTesseractAdvanced(
  imageData: string,
  options?: {
    lang?: string[]
    psm?: PSM
  }
): Promise<OCRResult> {
  const languages = options?.lang || ['jpn', 'eng']
  
  // 言語配列で作成
  const worker = await createWorker(languages)

  try {
    // PSM設定がある場合
    if (options?.psm !== undefined) {
      await worker.setParameters({
        tessedit_pageseg_mode: options.psm
      })
    }

    const { data } = await worker.recognize(imageData)
    
    return {
      text: data.text.trim(),
      confidence: data.confidence / 100,
      translation: undefined
    }
  } finally {
    await worker.terminate()
  }
}

// 日本語専用の処理（縦書き対応）
export async function processJapaneseText(
  imageData: string,
  isVertical: boolean = false
): Promise<OCRResult> {
  const worker = await createWorker('jpn')

  try {
    // 縦書きテキスト用のPSM設定
    if (isVertical) {
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK_VERT_TEXT
      })
    } else {
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.AUTO
      })
    }

    const { data } = await worker.recognize(imageData)
    
    return {
      text: data.text.trim(),
      confidence: data.confidence / 100,
      translation: undefined
    }
  } finally {
    await worker.terminate()
  }
}

// プログレス付きのOCR処理
export async function processTesseractWithProgress(
  imageData: string,
  onProgress?: (progress: number) => void
): Promise<OCRResult> {
  const worker = await createWorker(
    ['jpn', 'eng'],
    undefined, // OEMはデフォルト
    {
      logger: (m) => {
        if (m.status === 'recognizing text' && m.progress && onProgress) {
          onProgress(m.progress)
        }
      }
    }
  )

  try {
    const { data } = await worker.recognize(imageData)
    
    return {
      text: data.text.trim(),
      confidence: data.confidence / 100,
      translation: undefined
    }
  } finally {
    await worker.terminate()
  }
}