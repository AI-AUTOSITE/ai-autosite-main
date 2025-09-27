'use client'

import React, { useState, useRef, useCallback, ChangeEvent, DragEvent } from 'react'
import {
  Upload,
  FileText,
  Loader2,
  RefreshCw,
  Languages,
  ArrowLeftRight,
  Type,
  Scan,
  Copy,
  CheckCircle
} from 'lucide-react'
import { processTesseract, type OCRResult } from '../lib/tesseract-helper'
import { 
  autoTranslate, 
  translateText, 
  translateInChunks, 
  type TranslationDirection,
  type TranslationResult,
  type DetectedLanguage,
  type TranslationProgress
} from '../lib/translation-helper'
import OCRResultDisplay from './OCRResult'

// Types
type Mode = 'ocr' | 'text'

interface ExtendedOCRResult extends OCRResult {
  translationDirection?: TranslationDirection | null
  detectedLanguage?: DetectedLanguage
}

interface TranslationProgressState {
  current: number
  total: number
}

export default function JapaneseOCR() {
  // Common states
  const [mode, setMode] = useState<Mode>('ocr')
  const [translationDirection, setTranslationDirection] = useState<'auto' | TranslationDirection>('auto')
  const [isTranslating, setIsTranslating] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  // OCR states
  const [imageData, setImageData] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [ocrResult, setOcrResult] = useState<ExtendedOCRResult | null>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Text translation states
  const [inputText, setInputText] = useState<string>('')
  const [translatedText, setTranslatedText] = useState<string>('')
  const [detectedLang, setDetectedLang] = useState<DetectedLanguage>('unknown')
  const [copiedInput, setCopiedInput] = useState<boolean>(false)
  const [copiedTranslation, setCopiedTranslation] = useState<boolean>(false)
  const [translationProgress, setTranslationProgress] = useState<TranslationProgressState | null>(null)

  // Progress callback
  const handleProgress: TranslationProgress = useCallback((current: number, total: number) => {
    console.log(`Progress: ${current}/${total} chunks processed`)
    setTranslationProgress({ current, total })
  }, [])

  // OCR functions
  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = e.target?.result as string
      setImageData(data)
      setError('')
      performOCR(data)
    }
    reader.onerror = () => {
      setError('Failed to read file')
    }
    reader.readAsDataURL(file)
  }, [])

  const performOCR = async (imageUrl: string) => {
    setIsProcessing(true)
    setError('')
    setOcrResult(null)

    try {
      const result = await processTesseract(imageUrl)
      
      setOcrResult({
        ...result,
        translation: undefined,
        translationDirection: null,
        detectedLanguage: 'unknown'
      })

      setIsTranslating(true)
      try {
        if (translationDirection === 'auto') {
          const translationResult = await autoTranslate(result.text)
          setOcrResult({
            ...result,
            translation: translationResult.translation,
            translationDirection: translationResult.direction,
            detectedLanguage: translationResult.detectedLanguage
          })
        } else {
          // Use chunk translation for long texts
          const translation = result.text.length > 450
            ? await translateInChunks(
                result.text, 
                translationDirection, 
                450,
                handleProgress
              )
            : await translateText(result.text, translationDirection)
          
          setOcrResult({
            ...result,
            translation,
            translationDirection,
            detectedLanguage: translationDirection === 'ja-en' ? 'japanese' : 'english'
          })
        }
      } catch (translationError) {
        console.error('Translation failed:', translationError)
        // Keep OCR result even if translation fails
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'OCR processing failed'
      setError(errorMessage)
    } finally {
      setIsProcessing(false)
      setIsTranslating(false)
      setTranslationProgress(null)
    }
  }

  const retranslateOCR = async () => {
    if (!ocrResult || !ocrResult.text) return

    setIsTranslating(true)
    setError('')
    
    try {
      if (translationDirection === 'auto') {
        const translationResult = await autoTranslate(ocrResult.text)
        setOcrResult({
          ...ocrResult,
          translation: translationResult.translation,
          translationDirection: translationResult.direction,
          detectedLanguage: translationResult.detectedLanguage
        })
      } else {
        const translation = ocrResult.text.length > 450
          ? await translateInChunks(
              ocrResult.text, 
              translationDirection, 
              450,
              handleProgress
            )
          : await translateText(ocrResult.text, translationDirection)
        
        setOcrResult({
          ...ocrResult,
          translation,
          translationDirection,
          detectedLanguage: translationDirection === 'ja-en' ? 'japanese' : 'english'
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed'
      setError('Translation failed: ' + errorMessage)
    } finally {
      setIsTranslating(false)
      setTranslationProgress(null)
    }
  }

  // Text translation functions
  const handleTextTranslation = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to translate')
      return
    }

    setIsTranslating(true)
    setError('')
    setTranslatedText('')
    setTranslationProgress(null)

    try {
      console.log(`Translating ${inputText.length} characters...`)
      
      if (translationDirection === 'auto') {
        const result = await autoTranslate(inputText)
        setTranslatedText(result.translation)
        setDetectedLang(result.detectedLanguage)
      } else {
        // Use chunk translation for long texts
        const translation = inputText.length > 450
          ? await translateInChunks(
              inputText, 
              translationDirection, 
              450,
              handleProgress
            )
          : await translateText(inputText, translationDirection)
        
        setTranslatedText(translation)
        setDetectedLang(translationDirection === 'ja-en' ? 'japanese' : 'english')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed'
      setError('Translation failed: ' + errorMessage)
    } finally {
      setIsTranslating(false)
      setTranslationProgress(null)
    }
  }

  // Swap and retranslate function
  const swapAndRetranslate = async () => {
    if (!translatedText) {
      setError('No translation to swap')
      return
    }

    // Swap the texts
    setInputText(translatedText)
    setTranslatedText('')
    
    // Reverse the translation direction
    let newDirection: 'auto' | TranslationDirection = 'auto'
    if (translationDirection !== 'auto') {
      newDirection = translationDirection === 'ja-en' ? 'en-ja' : 'ja-en'
      setTranslationDirection(newDirection)
    } else if (detectedLang !== 'unknown') {
      // If auto mode, set direction based on detected language
      newDirection = detectedLang === 'japanese' ? 'en-ja' : 'ja-en'
      setTranslationDirection(newDirection)
    }

    // Perform translation with the swapped text
    setIsTranslating(true)
    setError('')
    setTranslationProgress(null)

    try {
      console.log(`Reverse translating ${translatedText.length} characters...`)
      
      if (newDirection === 'auto') {
        const result = await autoTranslate(translatedText)
        setTranslatedText(result.translation)
        setDetectedLang(result.detectedLanguage)
      } else {
        const translation = translatedText.length > 450
          ? await translateInChunks(
              translatedText, 
              newDirection, 
              450,
              handleProgress
            )
          : await translateText(translatedText, newDirection)
        
        setTranslatedText(translation)
        setDetectedLang(newDirection === 'ja-en' ? 'japanese' : 'english')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed'
      setError('Translation failed: ' + errorMessage)
    } finally {
      setIsTranslating(false)
      setTranslationProgress(null)
    }
  }

  const copyToClipboard = (text: string, type: 'input' | 'translation') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'input') {
        setCopiedInput(true)
        setTimeout(() => setCopiedInput(false), 2000)
      } else {
        setCopiedTranslation(true)
        setTimeout(() => setCopiedTranslation(false), 2000)
      }
    }).catch(() => {
      setError('Failed to copy to clipboard')
    })
  }

  const clearTextTranslation = () => {
    setInputText('')
    setTranslatedText('')
    setDetectedLang('unknown')
    setError('')
    setTranslationProgress(null)
  }

  // OCR drag and drop handlers
  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const resetOCR = () => {
    setImageData('')
    setOcrResult(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Mode Selector */}
      <div className="flex justify-center mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 inline-flex">
          <button
            onClick={() => setMode('ocr')}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              mode === 'ocr'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Scan className="w-5 h-5" />
            Image OCR
          </button>
          <button
            onClick={() => setMode('text')}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              mode === 'text'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Type className="w-5 h-5" />
            Text Translation
          </button>
        </div>
      </div>
 {/* Translation Mode Selector */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-6">
        <label className="text-white font-medium mb-3 block">Translation Mode</label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setTranslationDirection('auto')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              translationDirection === 'auto'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Auto Detect
          </button>
          <button
            onClick={() => setTranslationDirection('ja-en')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              translationDirection === 'ja-en'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Japanese → English
          </button>
          <button
            onClick={() => setTranslationDirection('en-ja')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              translationDirection === 'en-ja'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            English → Japanese
          </button>
        </div>

        {/* Retranslate button for OCR mode */}
        {mode === 'ocr' && ocrResult && !isTranslating && (
          <button
            onClick={retranslateOCR}
            className="mt-3 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2 mx-auto"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Retranslate with Selected Mode
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        {mode === 'ocr' ? (
          // OCR Mode
          !imageData ? (
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
                ${isDragging ? 'border-cyan-400 bg-cyan-400/10' : 'border-gray-400 hover:border-gray-300'}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Drop image here or click to upload
              </h3>
              <p className="text-gray-400">Supports JPG, PNG, WEBP • Max 10MB</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <img
                  src={imageData}
                  alt="Uploaded"
                  className="w-full max-h-96 object-contain rounded-lg"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 animate-spin text-white mb-2" />
                      <p className="text-white">Processing OCR...</p>
                    </div>
                  </div>
                )}
              </div>

              {ocrResult && !isProcessing && (
                <OCRResultDisplay
                  text={ocrResult.text}
                  confidence={ocrResult.confidence}
                  translation={ocrResult.translation}
                  translationDirection={ocrResult.translationDirection}
                  detectedLanguage={ocrResult.detectedLanguage}
                  isTranslating={isTranslating}
                />
              )}

              {error && (
                <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={resetOCR}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Process New Image
              </button>
            </div>
          )
        ) : (
          // Text Translation Mode
          <div className="space-y-6">
            {/* Input Text Area */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white font-medium">Input Text</label>
                <button
                  onClick={() => copyToClipboard(inputText, 'input')}
                  className="p-2 hover:bg-white/10 rounded transition-colors"
                  title="Copy input text"
                  disabled={!inputText}
                >
                  {copiedInput ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste or type your text here... (Japanese or English)"
                className="w-full h-40 p-4 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-400">
                  {inputText.length} characters
                </span>
                {detectedLang !== 'unknown' && (
                  <span className="text-sm text-purple-400">
                    Detected: {detectedLang === 'japanese' ? 'Japanese' : 'English'}
                  </span>
                )}
              </div>
            </div>

            {/* Swap Button - shown when translation exists */}
            {translatedText && !isTranslating && (
              <div className="flex justify-center -my-2">
                <button
                  onClick={swapAndRetranslate}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 flex items-center gap-2 shadow-lg transform hover:scale-105 transition-all"
                  title="Swap input/output and retranslate"
                >
                  <ArrowLeftRight className="w-5 h-5" />
                  Swap & Retranslate
                </button>
              </div>
            )}

            {/* Translate Button */}
            <button
              onClick={handleTextTranslation}
              disabled={!inputText.trim() || isTranslating}
              className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Translating...
                  {translationProgress && (
                    <span className="text-sm">
                      ({translationProgress.current}/{translationProgress.total})
                    </span>
                  )}
                </>
              ) : (
                <>
                  <Languages className="w-5 h-5" />
                  Translate
                </>
              )}
            </button>

            {/* Translation Result */}
            {translatedText && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-white font-medium">Translation</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => swapAndRetranslate()}
                      className="p-2 hover:bg-white/10 rounded transition-colors group relative"
                      title="Swap and retranslate"
                    >
                      <ArrowLeftRight className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-black/80 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Swap & Retranslate
                      </span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(translatedText, 'translation')}
                      className="p-2 hover:bg-white/10 rounded transition-colors"
                      title="Copy translation"
                    >
                      {copiedTranslation ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-black/30 border border-white/20 rounded-lg">
                  <p className="text-white whitespace-pre-wrap">{translatedText}</p>
                </div>
                <p className="text-xs text-gray-400 mt-2">Powered by Translation API</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Clear Button */}
            {(inputText || translatedText) && (
              <button
                onClick={clearTextTranslation}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}