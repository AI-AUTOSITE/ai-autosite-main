// app/tools/japanese-ocr/components/JapaneseOCR.tsx
'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Upload, Image, FileText, Loader2, RefreshCw, Camera } from 'lucide-react'
import { processTesseract, type OCRResult } from '../lib/tesseract-helper'
import OCRResultDisplay from './OCRResult'

export default function JapaneseOCR() {
  const [imageData, setImageData] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<OCRResult | null>(null)
  const [error, setError] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ファイル処理
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
    reader.onload = (e) => {
      const data = e.target?.result as string
      setImageData(data)
      setError('')
      performOCR(data)
    }
    reader.readAsDataURL(file)
  }, [])

  // OCR実行
  const performOCR = async (imageUrl: string) => {
    setIsProcessing(true)
    setError('')
    setResult(null)

    try {
      const ocrResult = await processTesseract(imageUrl)
      setResult(ocrResult)
    } catch (err: any) {
      setError(err.message || 'OCR processing failed')
    } finally {
      setIsProcessing(false)
    }
  }

  // ドラッグ&ドロップハンドラー
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  // ファイル選択
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  // リセット
  const reset = () => {
    setImageData('')
    setResult(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Japanese OCR & Translation
        </h1>
        <p className="text-xl text-gray-300">
          Extract Japanese text from images with AI-powered OCR
        </p>
      </div>

      {/* 機能カード */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <FileText className="w-8 h-8 text-cyan-400 mb-2" />
          <h3 className="text-white font-semibold mb-1">99% Accuracy</h3>
          <p className="text-gray-300 text-sm">High-precision Japanese text recognition</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <Image className="w-8 h-8 text-purple-400 mb-2" />
          <h3 className="text-white font-semibold mb-1">Multiple Formats</h3>
          <p className="text-gray-300 text-sm">Supports JPG, PNG, WEBP images</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <RefreshCw className="w-8 h-8 text-green-400 mb-2" />
          <h3 className="text-white font-semibold mb-1">100% Private</h3>
          <p className="text-gray-300 text-sm">All processing happens in your browser</p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        {!imageData ? (
          // アップロードエリア
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
            <p className="text-gray-400">
              Supports JPG, PNG, WEBP • Max 10MB
            </p>
          </div>
        ) : (
          // 結果表示
          <div className="space-y-6">
            {/* 画像プレビュー */}
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

            {/* OCR結果 */}
            {result && !isProcessing && (
              <OCRResultDisplay
                text={result.text}
                confidence={result.confidence}
                translation={result.translation}
              />
            )}

            {/* エラー表示 */}
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* アクションボタン */}
            <button
              onClick={reset}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Process New Image
            </button>
          </div>
        )}
      </div>
    </div>
  )
}