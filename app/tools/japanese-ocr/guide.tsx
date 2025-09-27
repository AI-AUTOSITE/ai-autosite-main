import React, { useState } from 'react'
import {
  X,
  Copy,
  Check,
  AlertCircle,
  FileText,
  Globe,
  Upload,
  Image,
  Shield,
  Zap,
  Info,
  RefreshCw,
  Download,
  Languages,
  Type,
  Scan,
  ArrowRight,
  ArrowLeftRight
} from 'lucide-react'

interface GuideProps {
  onClose?: () => void
}

export default function JapaneseOCRGuide({ onClose }: GuideProps) {
  const [copiedExample, setCopiedExample] = useState<string | null>(null)

  const supportedFormats = ['JPG', 'PNG', 'WEBP']
  const useCases = [
    'Translate Japanese documents and signs',
    'Extract text from manga and books',
    'Convert printed Japanese to digital text',
    'Learn Japanese through image-based content',
    'Process business documents and receipts',
    'Quick text translation without images'
  ]

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedExample(id)
    setTimeout(() => setCopiedExample(null), 2000)
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-h-[80vh] overflow-hidden flex flex-col relative w-full max-w-2xl">
      {/* Header */}
      <div className="p-6 border-b border-white/10 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
            aria-label="Close guide"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        )}
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Languages className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Japanese OCR & Translation Guide</h3>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        {/* Main feature highlight */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-cyan-300">
              <p className="font-semibold mb-1">Two Powerful Modes</p>
              <p>1. Image OCR: Extract & translate text from images (99% accuracy)</p>
              <p>2. Text Translation: Copy-paste text for instant translation</p>
              <p className="mt-2">No character limits • Bidirectional (JA↔EN) • 100% private</p>
              <p className="mt-1 text-yellow-300">NEW: Swap & Retranslate for accuracy testing!</p>
            </div>
          </div>
        </div>

        {/* Mode Selection */}
        <div>
          <h4 className="font-semibold text-white mb-3">Choose Your Mode</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Scan className="w-5 h-5 text-cyan-400" />
                <span className="font-medium text-white">Image OCR Mode</span>
              </div>
              <p className="text-sm text-gray-300">Extract text from images and translate</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Type className="w-5 h-5 text-purple-400" />
                <span className="font-medium text-white">Text Mode</span>
              </div>
              <p className="text-sm text-gray-300">Paste text for quick translation</p>
            </div>
          </div>
        </div>

        {/* How to Use - OCR Mode */}
        <div>
          <h4 className="font-semibold text-white mb-3">Using Image OCR Mode</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</span>
              <div>
                <p className="font-medium text-white">Upload Your Image</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Upload className="inline w-3 h-3 mr-1" />
                  Drag & drop or click to upload (Max 10MB)
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</span>
              <div>
                <p className="font-medium text-white">Automatic Processing</p>
                <p className="text-sm text-gray-400 mt-1">
                  <RefreshCw className="inline w-3 h-3 mr-1" />
                  AI extracts and translates text instantly
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</span>
              <div>
                <p className="font-medium text-white">Get Results</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Download className="inline w-3 h-3 mr-1" />
                  Copy text or download translation
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* How to Use - Text Mode */}
        <div>
          <h4 className="font-semibold text-white mb-3">Using Text Translation Mode</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</span>
              <div>
                <p className="font-medium text-white">Paste Your Text</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Copy className="inline w-3 h-3 mr-1" />
                  Copy-paste or type Japanese/English text
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</span>
              <div>
                <p className="font-medium text-white">Click Translate</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Languages className="inline w-3 h-3 mr-1" />
                  Auto-detects language or use manual mode
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</span>
              <div>
                <p className="font-medium text-white">Copy Translation</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Check className="inline w-3 h-3 mr-1" />
                  One-click copy of translated text
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-pink-500 to-red-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">4</span>
              <div>
                <p className="font-medium text-white">Swap & Retranslate (NEW!)</p>
                <p className="text-sm text-gray-400 mt-1">
                  <ArrowLeftRight className="inline w-3 h-3 mr-1" />
                  One-click swap results to input and retranslate for accuracy testing
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Key Features */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            Key Features
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Globe className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-sm text-white">Smart Translation</p>
                <p className="text-xs text-gray-400">Auto-detect or manual JA ↔ EN</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Shield className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-white">100% Private</p>
                <p className="text-xs text-gray-400">All processing in your browser</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Zap className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm text-white">No Limits</p>
                <p className="text-xs text-gray-400">Handle long texts with smart chunking</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <ArrowRight className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-white">Instant Results</p>
                <p className="text-xs text-gray-400">Fast translation with fallback APIs</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <ArrowLeftRight className="w-5 h-5 text-pink-400" />
              <div>
                <p className="text-sm text-white">Swap & Retranslate</p>
                <p className="text-xs text-gray-400">Test accuracy with reverse translation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Supported Formats */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Image className="w-5 h-5 text-blue-400" />
            Supported Image Formats
          </h4>
          <div className="bg-black/30 rounded-lg p-4">
            <div className="flex gap-2 flex-wrap">
              {supportedFormats.map((format, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm border border-cyan-500/30"
                >
                  {format}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">Maximum file size: 10MB per image</p>
          </div>
        </div>

        {/* Perfect For */}
        <div>
          <h4 className="font-semibold text-white mb-3">Perfect For</h4>
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
            <ul className="space-y-2">
              {useCases.map((useCase, index) => (
                <li key={index} className="text-sm text-gray-300">
                  {useCase}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Technical Information */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-blue-300 mb-2">Technical Information</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Powered by Tesseract.js v5 for OCR</li>
                <li>• Smart text chunking (450 chars per request)</li>
                <li>• Multiple translation API fallbacks</li>
                <li>• Supports vertical & horizontal Japanese text</li>
                <li>• Handles Hiragana, Katakana, and Kanji</li>
                <li>• Works offline after initial load (OCR only)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-yellow-300 mb-2">Pro Tips for Best Results</p>
              <ul className="space-y-1 text-gray-300">
                <li>• For images: Use high-resolution with good contrast</li>
                <li>• For text: Break very long texts into paragraphs</li>
                <li>• Auto-detect works best for pure Japanese or English</li>
                <li>• Manual mode recommended for mixed language texts</li>
                <li>• OCR works best with printed text (not handwriting)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-300">
              <p className="font-semibold mb-1">Complete Privacy</p>
              <p className="text-gray-300">
                Your images and text never leave your device. All OCR processing happens
                locally in your browser. Translation uses secure HTTPS APIs without storing
                your data. Perfect for sensitive documents and confidential information.
              </p>
            </div>
          </div>
        </div>

        {/* Language Support */}
        <div className="bg-purple-500/10 rounded-lg p-4">
          <p className="text-sm text-white font-medium mb-2">Japanese Language Support</p>
          <p className="text-xs text-gray-300">
            This tool specializes in Japanese ↔ English translation with support for complex
            Kanji characters, vertical text, and long documents. Perfect for students,
            professionals, and anyone working with Japanese content.
          </p>
        </div>
      </div>
    </div>
  )
}

export const guideMetadata = {
  title: 'Japanese OCR & Translation Guide',
  icon: 'JP',
  available: true,
}