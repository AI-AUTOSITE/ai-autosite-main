// app/tools/japanese-ocr/components/OCRResult.tsx
// Enhanced version with bidirectional translation display

'use client'

import React from 'react'
import { Copy, Download, CheckCircle, Loader2, Languages, ArrowRight } from 'lucide-react'
import { TranslationDirection } from '../lib/translation-helper'

interface OCRResultProps {
  text: string
  confidence: number
  translation?: string
  translationDirection?: TranslationDirection | null
  detectedLanguage?: 'japanese' | 'english' | 'unknown'
  isTranslating?: boolean
}

export default function OCRResult({ 
  text, 
  confidence, 
  translation,
  translationDirection,
  detectedLanguage,
  isTranslating = false
}: OCRResultProps) {
  const [copiedText, setCopiedText] = React.useState(false)
  const [copiedTranslation, setCopiedTranslation] = React.useState(false)

  const copyToClipboard = (content: string, type: 'text' | 'translation') => {
    navigator.clipboard.writeText(content)
    if (type === 'text') {
      setCopiedText(true)
      setTimeout(() => setCopiedText(false), 2000)
    } else {
      setCopiedTranslation(true)
      setTimeout(() => setCopiedTranslation(false), 2000)
    }
  }

  const downloadText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const getTranslationLabel = () => {
    if (!translationDirection) return 'Translation'
    
    switch (translationDirection) {
      case 'ja-en':
        return 'Translation (Japanese → English)'
      case 'en-ja':
        return 'Translation (English → Japanese)'
      default:
        return 'Translation'
    }
  }

  const getExtractedTextLabel = () => {
    if (detectedLanguage === 'japanese') {
      return 'Extracted Text (Japanese)'
    } else if (detectedLanguage === 'english') {
      return 'Extracted Text (English)'
    } else {
      return 'Extracted Text'
    }
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex flex-wrap gap-3 text-sm">
        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
          Confidence: {Math.round(confidence * 100)}%
        </span>
        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">
          Characters: {text.length}
        </span>
        {detectedLanguage && detectedLanguage !== 'unknown' && (
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full flex items-center gap-1">
            <Languages className="w-3 h-3" />
            Detected: {detectedLanguage === 'japanese' ? 'Japanese' : 'English'}
          </span>
        )}
        {translationDirection && (
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center gap-1">
            <ArrowRight className="w-3 h-3" />
            {translationDirection === 'ja-en' ? 'JA → EN' : 'EN → JA'}
          </span>
        )}
      </div>

      {/* Extracted Text */}
      <div className="bg-black/30 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white font-semibold">{getExtractedTextLabel()}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => copyToClipboard(text, 'text')}
              className="p-2 hover:bg-white/10 rounded transition-colors"
              title="Copy text"
            >
              {copiedText ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
            <button
              onClick={() => downloadText(text, `extracted-text-${Date.now()}.txt`)}
              className="p-2 hover:bg-white/10 rounded transition-colors"
              title="Download text"
            >
              <Download className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
        <pre className="text-gray-200 whitespace-pre-wrap font-mono text-sm max-h-96 overflow-y-auto">
          {text || 'No text detected'}
        </pre>
      </div>

      {/* Translation */}
      {isTranslating ? (
        <div className="bg-black/30 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">{getTranslationLabel()}</h3>
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <p className="italic">Processing translation...</p>
          </div>
        </div>
      ) : translation ? (
        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-semibold">{getTranslationLabel()}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(translation, 'translation')}
                className="p-2 hover:bg-white/10 rounded transition-colors"
                title="Copy translation"
              >
                {copiedTranslation ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <button
                onClick={() => downloadText(translation, `translation-${Date.now()}.txt`)}
                className="p-2 hover:bg-white/10 rounded transition-colors"
                title="Download translation"
              >
                <Download className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          <p className="text-gray-200 whitespace-pre-wrap">
            {translation}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Powered by Translation API
          </p>
        </div>
      ) : (
        <div className="bg-black/30 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Translation</h3>
          <p className="text-gray-400 italic">Translation not available</p>
        </div>
      )}
    </div>
  )
}