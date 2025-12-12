'use client'

import { useRef, useState, useCallback } from 'react'

interface UseBgRemovalOptions {
  maxDimension: number
  onProgress: (progress: number) => void
}

// HEIC/HEIFファイルかどうかを判定
function isHeicFile(file: File): boolean {
  const type = file.type.toLowerCase()
  const name = file.name.toLowerCase()
  
  return (
    type === 'image/heic' ||
    type === 'image/heif' ||
    name.endsWith('.heic') ||
    name.endsWith('.heif')
  )
}

// HEIC/HEIFをJPEGに変換
async function convertHeicToJpeg(file: File): Promise<File> {
  try {
    // heic2anyを動的にインポート
    const heic2any = (await import('heic2any')).default
    
    const convertedBlob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.92,
    })
    
    // heic2anyは配列またはBlobを返す可能性がある
    const resultBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob
    
    // 新しいファイル名を作成（.heic → .jpg）
    const newName = file.name.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg')
    
    return new File([resultBlob], newName, { type: 'image/jpeg' })
  } catch (error) {
    console.error('HEIC conversion error:', error)
    throw new Error('Failed to convert HEIC image. Please try a different image.')
  }
}

export function useBgRemoval({ maxDimension, onProgress }: UseBgRemovalOptions) {
  const [modelLoaded, setModelLoaded] = useState(false)
  const modelRef = useRef<any>(null)
  const processorRef = useRef<any>(null)

  const loadModel = useCallback(async () => {
    if (modelRef.current && processorRef.current) {
      return
    }

    onProgress(5)

    try {
      // Dynamic import to avoid Terser issues with import.meta
      const { AutoModel, AutoProcessor, env } = await import('@huggingface/transformers')
      env.allowLocalModels = false
      
      onProgress(10)

      const model = await AutoModel.from_pretrained('briaai/RMBG-1.4', {
        progress_callback: (progressInfo: any) => {
          if (progressInfo.status === 'progress') {
            const pct = Math.round(10 + (progressInfo.progress * 0.4))
            onProgress(pct)
          }
        }
      })
      
      onProgress(50)
      
      const processor = await AutoProcessor.from_pretrained('briaai/RMBG-1.4', {
        progress_callback: (progressInfo: any) => {
          if (progressInfo.status === 'progress') {
            const pct = Math.round(50 + (progressInfo.progress * 0.2))
            onProgress(pct)
          }
        }
      })

      modelRef.current = model
      processorRef.current = processor
      onProgress(70)
      setModelLoaded(true)
      
    } catch (err) {
      console.error('Model loading error:', err)
      throw new Error("Couldn't load the AI model. Please try again.")
    }
  }, [onProgress])

  const removeBackground = useCallback(async (file: File): Promise<{ blob: Blob; width: number; height: number }> => {
    // 🔥 HEICファイルの場合はJPEGに変換
    let processFile = file
    if (isHeicFile(file)) {
      onProgress(1)
      console.log('Converting HEIC to JPEG...')
      processFile = await convertHeicToJpeg(file)
      console.log('HEIC conversion complete')
      onProgress(3)
    }

    await loadModel()

    // Dynamic import
    const { RawImage } = await import('@huggingface/transformers')

    onProgress(72)

    const imageUrl = URL.createObjectURL(processFile)
    
    try {
      const image = await RawImage.fromURL(imageUrl)
      
      let processImage = image
      if (image.width > maxDimension || image.height > maxDimension) {
        const scale = maxDimension / Math.max(image.width, image.height)
        const newWidth = Math.round(image.width * scale)
        const newHeight = Math.round(image.height * scale)
        processImage = await image.resize(newWidth, newHeight)
      }

      onProgress(75)

      const { pixel_values } = await processorRef.current(processImage)
      
      onProgress(80)
      
      const { output } = await modelRef.current({ input: pixel_values })

      onProgress(88)

      const maskTensor = output[0]
      const maskImage = await RawImage.fromTensor(
        maskTensor.mul(255).clamp(0, 255).to('uint8')
      )
      const resizedMask = await maskImage.resize(processImage.width, processImage.height)

      onProgress(92)

      const canvas = document.createElement('canvas')
      canvas.width = processImage.width
      canvas.height = processImage.height
      const ctx = canvas.getContext('2d')!
      
      const origCanvas = processImage.toCanvas()
      ctx.drawImage(origCanvas, 0, 0)
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const pixels = imageData.data
      
      const maskData = resizedMask.data
      const maskChannels = maskData.length / (canvas.width * canvas.height)
      
      for (let i = 0; i < canvas.width * canvas.height; i++) {
        let maskValue: number
        if (maskChannels === 1) {
          maskValue = maskData[i]
        } else {
          maskValue = maskData[i * maskChannels]
        }
        pixels[i * 4 + 3] = maskValue
      }
      
      ctx.putImageData(imageData, 0, 0)
      
      onProgress(98)
      
      const resultBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png')
      })
      
      onProgress(100)
      
      return { 
        blob: resultBlob, 
        width: processImage.width,
        height: processImage.height
      }

    } finally {
      URL.revokeObjectURL(imageUrl)
    }
  }, [loadModel, maxDimension, onProgress])

  return {
    loadModel,
    removeBackground,
    modelLoaded
  }
}