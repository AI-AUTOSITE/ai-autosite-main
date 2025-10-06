'use client'

import { useState } from 'react'
import { Copy, Check, RefreshCw, Instagram, Sparkles, HelpCircle } from 'lucide-react'
import dynamic from 'next/dynamic'

// ガイドを動的インポート
const ToolGuide = dynamic(() => import('../guide'), { ssr: false })

type BioStyle = 'professional' | 'fun' | 'creative'

const EMOJI_MAP: Record<string, string[]> = {
  fitness: ['💪', '🏋️', '🏃', '🤸'],
  travel: ['✈️', '🌍', '🗺️', '🏝️'],
  food: ['🍕', '☕', '🥑', '🍜'],
  music: ['🎵', '🎸', '🎤', '🎧'],
  photo: ['📸', '📷', '🎞️', '📹'],
  business: ['💼', '📈', '💡', '🚀'],
  tech: ['💻', '📱', '🤖', '⚡'],
  creative: ['🎨', '✨', '🌟', '💫'],
  fashion: ['👗', '👠', '💄', '✨'],
  student: ['📚', '🎓', '✏️', '🎯'],
}

const generateBios = (style: BioStyle, keywords: string[]): string[] => {
  const templates: Record<BioStyle, (kw: string[]) => string[]> = {
    professional: (kw) => [
      `${kw[0] || 'Professional'} | ${kw[1] || 'Expert'} | ${kw[2] || 'Leader'}\n📩 DM for collaboration`,
      `🎯 ${kw[0]} specialist\n💡 Helping you with ${kw[1]}\n🔗 Link below`,
      `${kw[0]} by profession\n${kw[1]} by passion\n${kw[2] || 'Living'} my best life`,
    ],
    fun: (kw) => [
      `Just a ${kw[0]} loving ${kw[1]} 🌈\n${kw[2] || 'Good vibes'} only ✨`,
      `${kw[0]} + ${kw[1]} = happiness 💖\nLiving for ${kw[2] || 'adventure'}`,
      `Professional ${kw[0]} enthusiast\nPowered by ${kw[1]} ☕\n${kw[2] || 'Smiling'} always 😊`,
    ],
    creative: (kw) => [
      `Creating magic with ${kw[0]} ✨\n${kw[1]} is my canvas 🎨\n${kw[2] || 'Dream'} big`,
      `${kw[0]} × ${kw[1]} × creativity 🌟\nTurning ideas into reality`,
      `Lost in ${kw[0]} 🌙\nFound in ${kw[1]} ⭐\n${kw[2] || 'Creating'} my story`,
    ],
  }

  const bioTexts = templates[style](keywords)

  // Add relevant emojis
  const emojis: string[] = []
  keywords.forEach((keyword) => {
    const lower = keyword.toLowerCase()
    Object.entries(EMOJI_MAP).forEach(([key, emojiList]) => {
      if (lower.includes(key) || key.includes(lower)) {
        emojis.push(...emojiList.slice(0, 2))
      }
    })
  })

  return bioTexts.map((bio) => {
    return bio.length > 150 ? bio.substring(0, 147) + '...' : bio
  })
}

export default function InstagramBioClient() {
  const [style, setStyle] = useState<BioStyle>('professional')
  const [keywords, setKeywords] = useState('')
  const [bios, setBios] = useState<string[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [showGuide, setShowGuide] = useState(false)

  const handleGenerate = () => {
    const keywordArray = keywords
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0)
      .slice(0, 3)

    if (keywordArray.length === 0) {
      alert('Please enter at least one keyword')
      return
    }

    const generatedBios = generateBios(style, keywordArray)
    setBios(generatedBios)
  }

  const handleCopy = async (bio: string, index: number) => {
    await navigator.clipboard.writeText(bio)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Main Card */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        {/* Style Selection */}
        <div className="mb-6">
          <label className="text-white font-medium mb-3 block">Choose Your Style</label>
          <div className="grid grid-cols-3 gap-2">
            {(['professional', 'fun', 'creative'] as BioStyle[]).map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`py-3 rounded-lg font-medium capitalize transition-all ${
                  style === s
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {s === 'professional' && '💼 '}
                {s === 'fun' && '🎉 '}
                {s === 'creative' && '🎨 '}
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Keyword Input */}
        <div className="mb-6">
          <label className="text-white font-medium mb-2 block">
            Your Keywords (max 3, separated by commas)
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., photographer, travel, NYC"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white
                     placeholder-gray-400 focus:outline-none focus:border-pink-400 transition-colors"
            autoFocus
          />

          {/* Quick Examples */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="text-xs text-gray-500">Quick fill:</span>
            {[
              'developer, coffee, coding',
              'fitness, coach, motivation',
              'artist, digital, creative',
            ].map((example, i) => (
              <button
                key={i}
                onClick={() => setKeywords(example)}
                className="text-xs px-3 py-1 bg-white/5 text-gray-400 rounded-full 
                         hover:bg-white/10 hover:text-white transition-all"
              >
                {example.split(',')[0]}...
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!keywords.trim()}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl 
                   font-medium hover:opacity-90 transition-all disabled:opacity-50 
                   disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Generate Bio
        </button>

        {/* Generated Bios */}
        {bios.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium">Your Bio Options</h3>
              <button
                onClick={() => {
                  const generatedBios = generateBios(
                    style,
                    keywords
                      .split(',')
                      .map((k) => k.trim())
                      .slice(0, 3)
                  )
                  setBios(generatedBios)
                }}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                title="Regenerate"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {bios.map((bio, index) => (
                <div
                  key={index}
                  className="bg-black/30 rounded-xl p-4 group hover:bg-black/40 transition-all"
                >
                  <pre className="text-white text-sm whitespace-pre-wrap font-sans">{bio}</pre>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">{bio.length}/150 characters</span>
                    <button
                      onClick={() => handleCopy(bio, index)}
                      className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
                        copiedIndex === index
                          ? 'bg-green-500 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-3 h-3 inline mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 inline mr-1" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Guide Modal */}
      {showGuide && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[100000]"
            onClick={() => setShowGuide(false)}
          />
          <div className="fixed inset-0 z-[100001] overflow-y-auto">
            <div className="flex min-h-screen pt-24 px-4 pb-20 justify-center">
              <div onClick={(e) => e.stopPropagation()}>
                <ToolGuide onClose={() => setShowGuide(false)} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
