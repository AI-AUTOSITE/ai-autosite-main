// app/tools/japanese-ocr/components/OCRResult.tsx
'use client'

import React from 'react'
import { Copy, Download, CheckCircle } from 'lucide-react'

interface OCRResultProps {
  text: string
  confidence: number
  translation?: string
}

export default function OCRResult({ text, confidence, translation }: OCRResultProps) {
  const [copied, setCopied] = React.useState(false)

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadText = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `japanese-text-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* 統計情報 */}
      <div className="flex gap-4 text-sm">
        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
          Confidence: {Math.round(confidence * 100)}%
        </span>
        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">
          Characters: {text.length}
        </span>
      </div>

      {/* 抽出テキスト */}
      <div className="bg-black/30 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white font-semibold">Extracted Text (Japanese)</h3>
          <div className="flex gap-2">
            <button
              onClick={() => copyToClipboard(text)}
              className="p-2 hover:bg-white/10 rounded transition-colors"
              title="Copy text"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
            <button
              onClick={downloadText}
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

      {/* 翻訳結果 */}
      {translation ? (
        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-semibold">Translation (English)</h3>
            <button
              onClick={() => copyToClipboard(translation)}
              className="p-2 hover:bg-white/10 rounded transition-colors"
              title="Copy translation"
            >
              <Copy className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <p className="text-gray-200">
            {translation}
          </p>
        </div>
      ) : (
        <div className="bg-black/30 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Translation (English)</h3>
          <p className="text-gray-400 italic">
            Translation feature coming soon in the next update
          </p>
        </div>
      )}
    </div>
  )
}