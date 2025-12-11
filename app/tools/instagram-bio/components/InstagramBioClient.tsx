'use client'

import { useState, useMemo, useCallback } from 'react'
import { 
  Instagram, Copy, Check, Type, Sparkles, Zap,
  ChevronDown, ChevronUp, User, Link2, Grid3X3,
  Smile, Heart, Star, Music, Camera, Coffee
} from 'lucide-react'

// ============================================
// Unicode Font Converters
// ============================================
const FONT_STYLES = {
  normal: {
    name: 'Normal',
    convert: (text: string) => text
  },
  bold: {
    name: '𝗕𝗼𝗹𝗱',
    convert: (text: string) => convertToUnicode(text, 'bold')
  },
  italic: {
    name: '𝘐𝘵𝘢𝘭𝘪𝘤',
    convert: (text: string) => convertToUnicode(text, 'italic')
  },
  boldItalic: {
    name: '𝘽𝙤𝙡𝙙 𝙄𝙩𝙖𝙡𝙞𝙘',
    convert: (text: string) => convertToUnicode(text, 'boldItalic')
  },
  script: {
    name: '𝓢𝓬𝓻𝓲𝓹𝓽',
    convert: (text: string) => convertToUnicode(text, 'script')
  },
  boldScript: {
    name: '𝓑𝓸𝓵𝓭 𝓢𝓬𝓻𝓲𝓹𝓽',
    convert: (text: string) => convertToUnicode(text, 'boldScript')
  },
  fraktur: {
    name: '𝔉𝔯𝔞𝔨𝔱𝔲𝔯',
    convert: (text: string) => convertToUnicode(text, 'fraktur')
  },
  doubleStruck: {
    name: '𝔻𝕠𝕦𝕓𝕝𝕖',
    convert: (text: string) => convertToUnicode(text, 'doubleStruck')
  },
  sansSerif: {
    name: '𝖲𝖺𝗇𝗌',
    convert: (text: string) => convertToUnicode(text, 'sansSerif')
  },
  sansSerifBold: {
    name: '𝗦𝗮𝗻𝘀 𝗕𝗼𝗹𝗱',
    convert: (text: string) => convertToUnicode(text, 'sansSerifBold')
  },
  monospace: {
    name: '𝙼𝚘𝚗𝚘',
    convert: (text: string) => convertToUnicode(text, 'monospace')
  },
  circled: {
    name: 'Ⓒⓘⓡⓒⓛⓔⓓ',
    convert: (text: string) => convertToUnicode(text, 'circled')
  },
  squared: {
    name: '🅂🅀🅄🄰🅁🄴🄳',
    convert: (text: string) => convertToUnicode(text, 'squared')
  },
  fullwidth: {
    name: 'Ｆｕｌｌｗｉｄｔｈ',
    convert: (text: string) => convertToUnicode(text, 'fullwidth')
  },
  smallCaps: {
    name: 'Sᴍᴀʟʟ Cᴀᴘs',
    convert: (text: string) => convertToSmallCaps(text)
  },
}

// Unicode character maps
const UNICODE_MAPS: Record<string, { upper: number; lower: number; digits?: number }> = {
  bold: { upper: 0x1D400, lower: 0x1D41A, digits: 0x1D7CE },
  italic: { upper: 0x1D434, lower: 0x1D44E },
  boldItalic: { upper: 0x1D468, lower: 0x1D482 },
  script: { upper: 0x1D49C, lower: 0x1D4B6 },
  boldScript: { upper: 0x1D4D0, lower: 0x1D4EA },
  fraktur: { upper: 0x1D504, lower: 0x1D51E },
  doubleStruck: { upper: 0x1D538, lower: 0x1D552, digits: 0x1D7D8 },
  sansSerif: { upper: 0x1D5A0, lower: 0x1D5BA, digits: 0x1D7E2 },
  sansSerifBold: { upper: 0x1D5D4, lower: 0x1D5EE, digits: 0x1D7EC },
  monospace: { upper: 0x1D670, lower: 0x1D68A, digits: 0x1D7F6 },
}

function convertToUnicode(text: string, style: string): string {
  if (style === 'circled') {
    return text.split('').map(char => {
      const code = char.charCodeAt(0)
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x24B6 + code - 65)
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x24D0 + code - 97)
      if (code >= 48 && code <= 57) return code === 48 ? '⓪' : String.fromCodePoint(0x2460 + code - 49)
      return char
    }).join('')
  }
  
  if (style === 'squared') {
    return text.split('').map(char => {
      const code = char.charCodeAt(0)
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x1F130 + code - 65)
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x1F130 + code - 97)
      return char
    }).join('')
  }
  
  if (style === 'fullwidth') {
    return text.split('').map(char => {
      const code = char.charCodeAt(0)
      if (code >= 33 && code <= 126) return String.fromCodePoint(0xFF01 + code - 33)
      if (char === ' ') return '　'
      return char
    }).join('')
  }
  
  const map = UNICODE_MAPS[style]
  if (!map) return text
  
  return text.split('').map(char => {
    const code = char.charCodeAt(0)
    if (code >= 65 && code <= 90) return String.fromCodePoint(map.upper + code - 65)
    if (code >= 97 && code <= 122) return String.fromCodePoint(map.lower + code - 97)
    if (map.digits && code >= 48 && code <= 57) return String.fromCodePoint(map.digits + code - 48)
    return char
  }).join('')
}

function convertToSmallCaps(text: string): string {
  const smallCapsMap: Record<string, string> = {
    'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ',
    'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ',
    'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ',
    's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x',
    'y': 'ʏ', 'z': 'ᴢ'
  }
  return text.split('').map(char => smallCapsMap[char.toLowerCase()] || char).join('')
}

// ============================================
// Emoji Categories
// ============================================
const EMOJI_CATEGORIES = [
  {
    name: 'Popular',
    icon: <Star className="w-4 h-4" />,
    emojis: ['✨', '💫', '🌟', '⭐', '💖', '❤️', '🔥', '💯', '🎯', '✅', '🚀', '💪', '🙌', '👑', '💎', '🌈', '☀️', '🌙']
  },
  {
    name: 'Symbols',
    icon: <Sparkles className="w-4 h-4" />,
    emojis: ['•', '◦', '▪️', '▫️', '◾', '◽', '│', '║', '┃', '❖', '✦', '✧', '★', '☆', '♡', '♥', '→', '←', '↑', '↓', '⟡', '⊹']
  },
  {
    name: 'Nature',
    icon: <Coffee className="w-4 h-4" />,
    emojis: ['🌸', '🌺', '🌻', '🌷', '🌹', '🍀', '🌿', '🍃', '🌴', '🌵', '🌊', '⛰️', '🏔️', '🌅', '🌄', '🌞', '🌝', '🦋']
  },
  {
    name: 'Activities',
    icon: <Music className="w-4 h-4" />,
    emojis: ['🎨', '📸', '🎬', '🎤', '🎧', '🎮', '⚽', '🏀', '🎾', '🏋️', '🧘', '💃', '🕺', '✈️', '🏖️', '🎭', '🎪', '🎡']
  },
  {
    name: 'Objects',
    icon: <Camera className="w-4 h-4" />,
    emojis: ['💻', '📱', '📷', '🎥', '💡', '🔑', '💼', '📚', '✏️', '🖊️', '💌', '🎁', '🏆', '🥇', '🎖️', '👜', '👟', '💄']
  },
  {
    name: 'Hearts',
    icon: <Heart className="w-4 h-4" />,
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '❣️', '💟']
  },
]

// ============================================
// Bio Templates
// ============================================
const BIO_TEMPLATES = [
  {
    category: 'Creator',
    templates: [
      '✨ {profession} | Creating {niche}\n📍 {location}\n🔗 {cta}',
      '🎨 {profession}\n💫 {tagline}\n📩 DM for collabs',
      '{emoji} {profession} & {hobby}\n🌍 Based in {location}\n⬇️ {cta}',
    ]
  },
  {
    category: 'Business',
    templates: [
      '🏢 {business_name}\n✨ {tagline}\n🛒 Shop now ⬇️',
      '💼 {profession} | {business_name}\n📧 {email}\n🔗 {website}',
      '{emoji} {what_you_do}\n🎯 Helping {target_audience}\n📩 DM to start',
    ]
  },
  {
    category: 'Personal',
    templates: [
      '✨ {hobby} enthusiast\n📍 {location}\n💭 {quote}',
      '{emoji} Living life one {thing} at a time\n🌍 {location} → {destination}',
      '🌟 {tagline}\n❤️ {interests}\n📸 Sharing my journey',
    ]
  },
  {
    category: 'Minimal',
    templates: [
      '{profession} • {location}',
      '{emoji} {tagline}',
      '{name} | {what_you_do}',
    ]
  },
]

// ============================================
// Main Component
// ============================================
export default function InstagramBioClient() {
  const [bioText, setBioText] = useState('')
  const [selectedFont, setSelectedFont] = useState<keyof typeof FONT_STYLES>('normal')
  const [copied, setCopied] = useState(false)
  const [showFonts, setShowFonts] = useState(true)
  const [showEmojis, setShowEmojis] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState(0)
  
  // Profile preview state
  const [profileName, setProfileName] = useState('your_username')
  const [profilePosts, setProfilePosts] = useState('42')
  const [profileFollowers, setProfileFollowers] = useState('1.2K')
  const [profileFollowing, setProfileFollowing] = useState('500')

  // Character count (Instagram uses grapheme clusters)
  const charCount = useMemo(() => {
    // Use spread operator to count grapheme clusters (handles emojis correctly)
    return [...bioText].length
  }, [bioText])
  
  const isOverLimit = charCount > 150
  const remaining = 150 - charCount

  // Convert bio to selected font
  const convertedBio = useMemo(() => {
    return FONT_STYLES[selectedFont].convert(bioText)
  }, [bioText, selectedFont])

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(convertedBio)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [convertedBio])

  // Insert emoji at cursor position
  const insertEmoji = (emoji: string) => {
    setBioText(prev => prev + emoji)
  }

  // Apply template
  const applyTemplate = (template: string) => {
    setBioText(template)
    setShowTemplates(false)
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Privacy Badge */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-3 py-2 rounded-lg">
          <Zap className="w-3 h-3 text-green-400" />
          <span>100% Browser-based • No Data Upload</span>
        </div>
      </div>

      {/* Character Counter */}
      <div className="text-center mb-6">
        <div className={`text-5xl font-bold mb-1 transition-colors ${
          isOverLimit ? 'text-red-400' : remaining <= 20 ? 'text-yellow-400' : 'text-pink-400'
        }`}>
          {remaining}
        </div>
        <p className="text-gray-400 text-sm">
          characters remaining
          {isOverLimit && <span className="text-red-400 ml-2">({Math.abs(remaining)} over limit)</span>}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Editor */}
        <div className="space-y-6">
          {/* Bio Input */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-medium flex items-center gap-2">
                <Instagram className="w-5 h-5 text-pink-400" />
                Your Bio
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    showTemplates ? 'bg-pink-500/20 text-pink-400' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  Templates
                </button>
                <button
                  onClick={() => setShowEmojis(!showEmojis)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    showEmojis ? 'bg-pink-500/20 text-pink-400' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <Smile className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Templates Panel */}
            {showTemplates && (
              <div className="mb-4 p-4 bg-black/20 rounded-xl border border-white/10 max-h-60 overflow-y-auto">
                {BIO_TEMPLATES.map((category, catIdx) => (
                  <div key={catIdx} className="mb-4 last:mb-0">
                    <p className="text-xs text-pink-400 font-medium mb-2">{category.category}</p>
                    <div className="space-y-2">
                      {category.templates.map((template, tmpIdx) => (
                        <button
                          key={tmpIdx}
                          onClick={() => applyTemplate(template)}
                          className="w-full text-left p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-300 transition-all"
                        >
                          {template}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Emoji Picker */}
            {showEmojis && (
              <div className="mb-4 p-4 bg-black/20 rounded-xl border border-white/10">
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                  {EMOJI_CATEGORIES.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedEmojiCategory(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        selectedEmojiCategory === idx
                          ? 'bg-pink-500/20 text-pink-400'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {cat.icon}
                      {cat.name}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-9 gap-2">
                  {EMOJI_CATEGORIES[selectedEmojiCategory].emojis.map((emoji, idx) => (
                    <button
                      key={idx}
                      onClick={() => insertEmoji(emoji)}
                      className="p-2 text-lg hover:bg-white/10 rounded-lg transition-all"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <textarea
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              placeholder="Write your bio here..."
              className={`w-full h-32 p-4 bg-black/20 border rounded-xl 
                       text-white placeholder-gray-500 focus:outline-none 
                       transition-colors resize-none ${
                         isOverLimit 
                           ? 'border-red-500/50 focus:border-red-500' 
                           : 'border-white/10 focus:border-pink-400'
                       }`}
            />

            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                {charCount}/150 characters
              </p>
              <button
                onClick={handleCopy}
                disabled={!bioText}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2
                           disabled:opacity-50 disabled:cursor-not-allowed ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Bio'}
              </button>
            </div>
          </div>

          {/* Font Styles */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <button
              onClick={() => setShowFonts(!showFonts)}
              className="w-full p-4 flex justify-between items-center"
            >
              <span className="text-white font-medium flex items-center gap-2">
                <Type className="w-5 h-5 text-pink-400" />
                Font Styles
                <span className="text-xs text-gray-500 font-normal">(15 styles)</span>
              </span>
              {showFonts ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            
            {showFonts && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {Object.entries(FONT_STYLES).map(([key, style]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedFont(key as keyof typeof FONT_STYLES)}
                      className={`p-2 rounded-lg text-sm transition-all ${
                        selectedFont === key
                          ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
                
                {/* Font Preview */}
                {bioText && selectedFont !== 'normal' && (
                  <div className="mt-4 p-3 bg-black/20 rounded-lg">
                    <p className="text-xs text-gray-400 mb-2">Preview:</p>
                    <p className="text-white whitespace-pre-wrap break-words">{convertedBio}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Instagram Profile Preview */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-pink-400" />
            Profile Preview
          </h3>

          {/* Mock Instagram Profile */}
          <div className="bg-black rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-4">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-[3px]">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex-1">
                  <div className="flex justify-around text-center mb-2">
                    <div>
                      <p className="text-white font-bold">{profilePosts}</p>
                      <p className="text-gray-400 text-xs">posts</p>
                    </div>
                    <div>
                      <p className="text-white font-bold">{profileFollowers}</p>
                      <p className="text-gray-400 text-xs">followers</p>
                    </div>
                    <div>
                      <p className="text-white font-bold">{profileFollowing}</p>
                      <p className="text-gray-400 text-xs">following</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Username & Bio */}
              <div className="mt-3">
                <p className="text-white font-semibold text-sm">{profileName}</p>
                <p className="text-white text-sm mt-1 whitespace-pre-wrap break-words min-h-[60px]">
                  {convertedBio || <span className="text-gray-500 italic">Your bio will appear here...</span>}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-1.5 bg-[#0095F6] text-white text-sm font-semibold rounded-lg">
                  Follow
                </button>
                <button className="flex-1 py-1.5 bg-gray-800 text-white text-sm font-semibold rounded-lg">
                  Message
                </button>
              </div>
            </div>

            {/* Story Highlights Placeholder */}
            <div className="px-4 pb-3">
              <div className="flex gap-4 overflow-x-auto">
                {['✨', '🎨', '📸'].map((emoji, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xl">
                      {emoji}
                    </div>
                    <span className="text-gray-400 text-xs mt-1">Highlight</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-800">
              <div className="flex">
                <button className="flex-1 py-3 text-white border-b border-white">
                  <Grid3X3 className="w-5 h-5 mx-auto" />
                </button>
                <button className="flex-1 py-3 text-gray-500">
                  <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button className="flex-1 py-3 text-gray-500">
                  <User className="w-5 h-5 mx-auto" />
                </button>
              </div>
            </div>

            {/* Grid Placeholder */}
            <div className="grid grid-cols-3 gap-[1px] bg-gray-800">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-square bg-gray-900" />
              ))}
            </div>
          </div>

          {/* Customize Preview */}
          <div className="mt-4 p-3 bg-black/20 rounded-lg">
            <p className="text-xs text-gray-400 mb-2">Customize Preview:</p>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Username"
                className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white"
              />
              <input
                type="text"
                value={profileFollowers}
                onChange={(e) => setProfileFollowers(e.target.value)}
                placeholder="Followers"
                className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">✨</div>
          <div className="text-xs text-gray-400">15 font styles</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">😊</div>
          <div className="text-xs text-gray-400">100+ emojis</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">📱</div>
          <div className="text-xs text-gray-400">Live preview</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-lg mb-1">📋</div>
          <div className="text-xs text-gray-400">Bio templates</div>
        </div>
      </div>
    </div>
  )
}