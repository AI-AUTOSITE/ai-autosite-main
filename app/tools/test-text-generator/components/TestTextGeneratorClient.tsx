// app/tools/test-text-generator/components/TestTextGeneratorClient.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  Download,
  FileText,
  Sliders,
  Copy,
  CheckCircle,
  Loader2,
  Type,
  Hash,
  BookOpen,
} from 'lucide-react'
import { saveAs } from 'file-saver'
import {
  DEFAULT_SETTINGS,
  type TextSettings,
  type Language,
  type Complexity,
  type OutputFormat,
} from '../lib/types'
import { generateText, calculateStats, generateFilename } from '../lib/textGenerator'

export default function TestTextGeneratorClient() {
  const [settings, setSettings] = useState<TextSettings>(DEFAULT_SETTINGS)
  const [generatedText, setGeneratedText] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // Auto-generate on settings change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      handleGenerate()
    }, 500)

    return () => clearTimeout(timer)
  }, [settings])

  const handleGenerate = () => {
    setIsGenerating(true)
    try {
      const text = generateText(settings)
      setGeneratedText(text)
    } catch (error) {
      console.error('Text generation failed:', error)
      setGeneratedText('Error generating text. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedText)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
      alert('Failed to copy text. Please try again.')
    }
  }

  const handleDownload = () => {
    try {
      const blob = new Blob([generatedText], { type: 'text/plain;charset=utf-8' })
      const filename = generateFilename(settings.outputFormat)
      saveAs(blob, filename)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download text. Please try again.')
    }
  }

  const stats = generatedText
    ? calculateStats(generatedText)
    : {
        characters: 0,
        words: 0,
        paragraphs: 0,
        sentences: 0,
        readingTime: 0,
      }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Settings Panel */}
          <div className="space-y-6">
            {/* Language & Complexity */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Type className="text-cyan-400 flex-shrink-0" size={24} />
                <h2 className="text-xl sm:text-2xl font-bold">Language & Style</h2>
              </div>

              {/* Language Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    setSettings({ ...settings, language: e.target.value as Language })
                  }
                  className="w-full min-h-[48px] px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="english" className="bg-gray-800 text-white">English</option>
                  <option value="japanese" className="bg-gray-800 text-white">Japanese</option>
                  <option value="mixed" className="bg-gray-800 text-white">Mixed (English + Japanese)</option>
                </select>
              </div>

              {/* Complexity Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Text Complexity
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setSettings({ ...settings, complexity: 'simple' })}
                    className={`min-h-[72px] p-4 rounded-xl border-2 transition-all ${
                      settings.complexity === 'simple'
                        ? 'bg-green-500/20 border-green-500 text-green-400'
                        : 'bg-white/5 border-white/20 hover:border-white/40 text-gray-400'
                    }`}
                  >
                    <p className="text-sm font-semibold">Simple</p>
                    <p className="text-xs mt-1 opacity-80">Short sentences</p>
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, complexity: 'complex' })}
                    className={`min-h-[72px] p-4 rounded-xl border-2 transition-all ${
                      settings.complexity === 'complex'
                        ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                        : 'bg-white/5 border-white/20 hover:border-white/40 text-gray-400'
                    }`}
                  >
                    <p className="text-sm font-semibold">Complex</p>
                    <p className="text-xs mt-1 opacity-80">Long sentences</p>
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, complexity: 'technical' })}
                    className={`min-h-[72px] p-4 rounded-xl border-2 transition-all ${
                      settings.complexity === 'technical'
                        ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                        : 'bg-white/5 border-white/20 hover:border-white/40 text-gray-400'
                    }`}
                  >
                    <p className="text-sm font-semibold">Technical</p>
                    <p className="text-xs mt-1 opacity-80">Jargon terms</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Length Settings */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Hash className="text-purple-400 flex-shrink-0" size={24} />
                <h2 className="text-xl sm:text-2xl font-bold">Length Settings</h2>
              </div>

              {/* Length Mode Tabs */}
              <div className="grid grid-cols-3 gap-2 mb-6 bg-white/10 p-1 rounded-xl">
                <button
                  onClick={() => setSettings({ ...settings, lengthMode: 'characters' })}
                  className={`min-h-[44px] py-3 px-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    settings.lengthMode === 'characters'
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Characters
                </button>
                <button
                  onClick={() => setSettings({ ...settings, lengthMode: 'words' })}
                  className={`min-h-[44px] py-3 px-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    settings.lengthMode === 'words'
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Words
                </button>
                <button
                  onClick={() => setSettings({ ...settings, lengthMode: 'paragraphs' })}
                  className={`min-h-[44px] py-3 px-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    settings.lengthMode === 'paragraphs'
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Paragraphs
                </button>
              </div>

              {/* Character Count */}
              {settings.lengthMode === 'characters' && (
                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Character Count</span>
                    <span className="text-purple-400 font-semibold">
                      {settings.characterCount.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="100000"
                    step="100"
                    value={settings.characterCount}
                    onChange={(e) =>
                      setSettings({ ...settings, characterCount: Number(e.target.value) })
                    }
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>100</span>
                    <span>100,000</span>
                  </div>
                </div>
              )}

              {/* Word Count */}
              {settings.lengthMode === 'words' && (
                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Word Count</span>
                    <span className="text-purple-400 font-semibold">
                      {settings.wordCount.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="20000"
                    step="50"
                    value={settings.wordCount}
                    onChange={(e) =>
                      setSettings({ ...settings, wordCount: Number(e.target.value) })
                    }
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>50</span>
                    <span>20,000</span>
                  </div>
                </div>
              )}

              {/* Paragraph Count */}
              {settings.lengthMode === 'paragraphs' && (
                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Paragraph Count</span>
                    <span className="text-purple-400 font-semibold">{settings.paragraphCount}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={settings.paragraphCount}
                    onChange={(e) =>
                      setSettings({ ...settings, paragraphCount: Number(e.target.value) })
                    }
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1</span>
                    <span>100</span>
                  </div>
                </div>
              )}
            </div>

            {/* Output Format */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="text-orange-400 flex-shrink-0" size={24} />
                <h2 className="text-xl sm:text-2xl font-bold">Output Format</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['plain', 'markdown', 'html'] as OutputFormat[]).map((format) => (
                  <button
                    key={format}
                    onClick={() => setSettings({ ...settings, outputFormat: format })}
                    className={`min-h-[56px] p-4 rounded-xl border-2 transition-all capitalize font-medium ${
                      settings.outputFormat === format
                        ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                        : 'bg-white/5 border-white/20 hover:border-white/40 text-gray-400'
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Options */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Sliders className="text-pink-400 flex-shrink-0" size={24} />
                <h2 className="text-xl sm:text-2xl font-bold">Content Options</h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer min-h-[44px] p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <span className="text-sm font-medium text-gray-300">Include Emojis</span>
                  <input
                    type="checkbox"
                    checked={settings.includeEmojis}
                    onChange={(e) => setSettings({ ...settings, includeEmojis: e.target.checked })}
                    className="w-6 h-6 rounded border-2 border-white/20 bg-white/5 checked:bg-pink-500 cursor-pointer accent-pink-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer min-h-[44px] p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <span className="text-sm font-medium text-gray-300">Include Numbers</span>
                  <input
                    type="checkbox"
                    checked={settings.includeNumbers}
                    onChange={(e) => setSettings({ ...settings, includeNumbers: e.target.checked })}
                    className="w-6 h-6 rounded border-2 border-white/20 bg-white/5 checked:bg-pink-500 cursor-pointer accent-pink-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer min-h-[44px] p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <span className="text-sm font-medium text-gray-300">Include Special Characters</span>
                  <input
                    type="checkbox"
                    checked={settings.includeSpecialChars}
                    onChange={(e) =>
                      setSettings({ ...settings, includeSpecialChars: e.target.checked })
                    }
                    className="w-6 h-6 rounded border-2 border-white/20 bg-white/5 checked:bg-pink-500 cursor-pointer accent-pink-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer min-h-[44px] p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <span className="text-sm font-medium text-gray-300">Extra Line Breaks</span>
                  <input
                    type="checkbox"
                    checked={settings.addLineBreaks}
                    onChange={(e) => setSettings({ ...settings, addLineBreaks: e.target.checked })}
                    className="w-6 h-6 rounded border-2 border-white/20 bg-white/5 checked:bg-pink-500 cursor-pointer accent-pink-500"
                  />
                </label>
              </div>
            </div>

            {/* Stats Display */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-4 sm:p-6 border border-white/10">
              <h3 className="text-base sm:text-lg font-semibold mb-4">Text Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Characters</p>
                  <p className="text-xl sm:text-2xl font-bold text-cyan-400">
                    {stats.characters.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Words</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-400">
                    {stats.words.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Paragraphs</p>
                  <p className="text-xl sm:text-2xl font-bold text-orange-400">{stats.paragraphs}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Reading Time</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-400">{stats.readingTime} min</p>
                </div>
              </div>
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10 lg:sticky lg:top-8 lg:h-fit">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="text-cyan-400 flex-shrink-0" size={24} />
                <h2 className="text-xl sm:text-2xl font-bold">Generated Text</h2>
              </div>
              {isGenerating && <Loader2 className="animate-spin text-cyan-400 flex-shrink-0" size={20} />}
            </div>

            {/* Text Output */}
            <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-white/10 max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] overflow-y-auto custom-scrollbar">
              {generatedText ? (
                <pre className="text-xs sm:text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {generatedText}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <p>Text will appear here...</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={handleCopy}
                disabled={!generatedText}
                className="min-h-[52px] py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCopied ? (
                  <>
                    <CheckCircle className="text-green-400" size={20} />
                    <span className="hidden sm:inline">Copied!</span>
                    <span className="sm:hidden">OK!</span>
                  </>
                ) : (
                  <>
                    <Copy size={20} />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <button
                onClick={handleDownload}
                disabled={!generatedText}
                className="min-h-[52px] py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                <Download size={20} />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  )
}