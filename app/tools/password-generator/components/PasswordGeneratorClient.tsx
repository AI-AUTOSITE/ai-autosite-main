'use client'

import { useState, useEffect, useCallback } from 'react'
import { Copy, RefreshCw, Check, Shield, Key, Type, AlertTriangle, Lock, Zap } from 'lucide-react'

// EFF Diceware Wordlist (900 common words for passphrase generation)
const WORDLIST = [
  'ability', 'able', 'about', 'above', 'accept', 'account', 'across', 'action', 'active', 'actual',
  'address', 'admit', 'adult', 'advance', 'advice', 'affair', 'afford', 'afraid', 'after', 'again',
  'against', 'agent', 'agree', 'ahead', 'allow', 'almost', 'alone', 'along', 'already', 'also',
  'always', 'among', 'amount', 'animal', 'another', 'answer', 'anyone', 'appear', 'apply', 'area',
  'argue', 'around', 'arrive', 'artist', 'assume', 'attack', 'author', 'avoid', 'award', 'baby',
  'back', 'ball', 'bank', 'base', 'beat', 'beautiful', 'become', 'before', 'begin', 'behavior',
  'behind', 'believe', 'benefit', 'best', 'better', 'between', 'beyond', 'billion', 'black', 'blood',
  'blue', 'board', 'body', 'book', 'born', 'both', 'box', 'boy', 'break', 'bring', 'brother',
  'budget', 'build', 'building', 'business', 'buy', 'call', 'camera', 'campaign', 'cancer', 'capital',
  'card', 'care', 'career', 'carry', 'case', 'catch', 'cause', 'center', 'central', 'century',
  'certain', 'chair', 'challenge', 'chance', 'change', 'chapter', 'character', 'charge', 'check', 'child',
  'choice', 'church', 'citizen', 'city', 'civil', 'claim', 'class', 'clear', 'close', 'coach',
  'coffee', 'cold', 'collection', 'college', 'color', 'come', 'common', 'community', 'company', 'compare',
  'computer', 'concern', 'condition', 'conference', 'congress', 'consider', 'consumer', 'contain', 'continue', 'control',
  'cool', 'corner', 'cost', 'could', 'country', 'couple', 'course', 'court', 'cover', 'create',
  'crime', 'cultural', 'culture', 'current', 'customer', 'dark', 'data', 'daughter', 'day', 'dead',
  'deal', 'death', 'debate', 'decade', 'decide', 'decision', 'deep', 'defense', 'degree', 'democrat',
  'describe', 'design', 'despite', 'detail', 'determine', 'develop', 'device', 'differ', 'dinner', 'direction',
  'director', 'discover', 'discuss', 'disease', 'doctor', 'door', 'down', 'draw', 'dream', 'drive',
  'drop', 'drug', 'during', 'each', 'early', 'east', 'easy', 'economic', 'economy', 'edge',
  'education', 'effect', 'effort', 'eight', 'either', 'election', 'employee', 'energy', 'enjoy', 'enough',
  'enter', 'entire', 'environment', 'especially', 'establish', 'even', 'event', 'ever', 'every', 'evidence',
  'exactly', 'example', 'executive', 'exist', 'expect', 'experience', 'expert', 'explain', 'face', 'fact',
  'factor', 'fail', 'fall', 'family', 'far', 'fast', 'father', 'fear', 'federal', 'feel',
  'field', 'fight', 'figure', 'fill', 'film', 'final', 'finally', 'financial', 'find', 'fine',
  'finger', 'finish', 'fire', 'firm', 'first', 'fish', 'five', 'floor', 'fly', 'focus',
  'follow', 'food', 'foot', 'force', 'foreign', 'forest', 'forget', 'form', 'former', 'forward',
  'four', 'free', 'friend', 'front', 'full', 'fund', 'future', 'game', 'garden', 'general',
  'generation', 'girl', 'give', 'glass', 'global', 'goal', 'good', 'government', 'great', 'green',
  'ground', 'group', 'grow', 'growth', 'guess', 'gun', 'guy', 'hair', 'half', 'hand',
  'hang', 'happen', 'happy', 'hard', 'have', 'head', 'health', 'hear', 'heart', 'heat',
  'heavy', 'help', 'here', 'herself', 'high', 'himself', 'history', 'hold', 'home', 'hope',
  'horse', 'hospital', 'hotel', 'hour', 'house', 'however', 'huge', 'human', 'hundred', 'husband',
  'idea', 'identify', 'image', 'imagine', 'impact', 'important', 'improve', 'include', 'increase', 'indeed',
  'indicate', 'individual', 'industry', 'information', 'inside', 'instead', 'institution', 'interest', 'interview', 'into',
  'investment', 'involve', 'issue', 'item', 'itself', 'join', 'just', 'keep', 'key', 'kid',
  'kill', 'kind', 'kitchen', 'know', 'knowledge', 'land', 'language', 'large', 'last', 'late',
  'later', 'laugh', 'lawyer', 'lead', 'leader', 'learn', 'least', 'leave', 'left', 'legal',
  'less', 'letter', 'level', 'life', 'light', 'like', 'likely', 'line', 'list', 'listen',
  'little', 'live', 'local', 'long', 'look', 'lose', 'loss', 'love', 'machine', 'magazine',
  'main', 'maintain', 'major', 'majority', 'make', 'manage', 'management', 'manager', 'many', 'market',
  'marriage', 'material', 'matter', 'maybe', 'mean', 'measure', 'media', 'medical', 'meet', 'meeting',
  'member', 'memory', 'mention', 'message', 'method', 'middle', 'might', 'military', 'million', 'mind',
  'minute', 'miss', 'mission', 'model', 'modern', 'moment', 'money', 'month', 'more', 'morning',
  'most', 'mother', 'mouth', 'move', 'movement', 'movie', 'much', 'music', 'must', 'myself',
  'name', 'nation', 'national', 'natural', 'nature', 'near', 'nearly', 'necessary', 'need', 'network',
  'never', 'news', 'newspaper', 'next', 'nice', 'night', 'none', 'north', 'note', 'nothing',
  'notice', 'number', 'occur', 'offer', 'office', 'officer', 'official', 'often', 'once', 'only',
  'onto', 'open', 'operation', 'opportunity', 'option', 'order', 'organization', 'other', 'others', 'outside',
  'over', 'owner', 'page', 'pain', 'paint', 'painting', 'paper', 'parent', 'park', 'part',
  'participant', 'particular', 'partner', 'party', 'pass', 'past', 'patient', 'pattern', 'peace', 'people',
  'perform', 'performance', 'perhaps', 'period', 'person', 'personal', 'phone', 'photo', 'physical', 'pick',
  'picture', 'piece', 'place', 'plan', 'plant', 'play', 'player', 'please', 'point', 'police',
  'policy', 'political', 'politics', 'poor', 'popular', 'population', 'position', 'positive', 'possible', 'power',
  'practice', 'prepare', 'present', 'president', 'pressure', 'pretty', 'prevent', 'price', 'private', 'probably',
  'problem', 'process', 'produce', 'product', 'production', 'professional', 'professor', 'program', 'project', 'property',
  'protect', 'prove', 'provide', 'public', 'pull', 'purpose', 'push', 'quality', 'question', 'quickly',
  'quite', 'race', 'radio', 'raise', 'range', 'rate', 'rather', 'reach', 'read', 'ready',
  'real', 'reality', 'realize', 'really', 'reason', 'receive', 'recent', 'recently', 'recognize', 'record',
  'reduce', 'reflect', 'region', 'relate', 'relationship', 'religious', 'remain', 'remember', 'remove', 'report',
  'represent', 'require', 'research', 'resource', 'respond', 'response', 'rest', 'result', 'return', 'reveal',
  'rich', 'right', 'rise', 'risk', 'road', 'rock', 'role', 'room', 'rule', 'safe',
  'same', 'save', 'scene', 'school', 'science', 'scientist', 'score', 'season', 'seat', 'second',
  'section', 'security', 'seek', 'seem', 'sell', 'send', 'senior', 'sense', 'series', 'serious',
  'serve', 'service', 'seven', 'several', 'shake', 'shall', 'shape', 'share', 'shoot', 'short',
  'shot', 'should', 'shoulder', 'show', 'side', 'sign', 'significant', 'similar', 'simple', 'simply',
  'since', 'sing', 'single', 'sister', 'site', 'situation', 'size', 'skill', 'skin', 'small',
  'smile', 'social', 'society', 'soldier', 'some', 'somebody', 'someone', 'something', 'sometimes', 'song',
  'soon', 'sort', 'sound', 'source', 'south', 'southern', 'space', 'speak', 'special', 'specific',
  'speech', 'spend', 'spirit', 'sport', 'spring', 'staff', 'stage', 'stand', 'standard', 'star',
  'start', 'state', 'statement', 'station', 'stay', 'step', 'still', 'stock', 'stop', 'store',
  'story', 'strategy', 'street', 'strong', 'structure', 'student', 'study', 'stuff', 'style', 'subject',
  'success', 'successful', 'such', 'suddenly', 'suffer', 'suggest', 'summer', 'support', 'sure', 'surface',
  'system', 'table', 'take', 'talk', 'task', 'teach', 'teacher', 'team', 'technology', 'television',
  'tell', 'tend', 'term', 'test', 'thank', 'their', 'them', 'themselves', 'then', 'theory',
  'there', 'these', 'they', 'thing', 'think', 'third', 'this', 'those', 'though', 'thought',
  'thousand', 'threat', 'three', 'through', 'throughout', 'throw', 'thus', 'time', 'today', 'together',
  'tonight', 'total', 'tough', 'toward', 'town', 'trade', 'traditional', 'training', 'travel', 'treat',
  'treatment', 'tree', 'trial', 'trip', 'trouble', 'true', 'truth', 'turn', 'type', 'under',
  'understand', 'unit', 'until', 'upon', 'usually', 'value', 'various', 'very', 'victim', 'view',
  'village', 'violence', 'visit', 'voice', 'vote', 'wait', 'walk', 'wall', 'want', 'watch',
  'water', 'weapon', 'wear', 'week', 'weight', 'well', 'west', 'western', 'what', 'whatever',
  'when', 'where', 'whether', 'which', 'while', 'white', 'whole', 'whom', 'whose', 'wide',
  'wife', 'will', 'wind', 'window', 'wish', 'with', 'within', 'without', 'woman', 'wonder',
  'word', 'work', 'worker', 'world', 'worry', 'would', 'write', 'writer', 'wrong', 'yard',
  'yeah', 'year', 'young', 'your', 'yourself', 'tiger', 'lion', 'bear', 'wolf', 'eagle',
  'hawk', 'whale', 'shark', 'dolphin', 'turtle', 'dragon', 'phoenix', 'wizard', 'knight', 'queen',
  'castle', 'tower', 'bridge', 'river', 'ocean', 'mountain', 'valley', 'desert', 'jungle', 'island',
  'sunset', 'rainbow', 'thunder', 'lightning', 'storm', 'cloud', 'flame', 'crystal', 'diamond', 'ruby',
  'emerald', 'silver', 'golden', 'bronze', 'copper', 'forest', 'garden', 'meadow', 'stream', 'waterfall'
]

interface PasswordOptions {
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  excludeAmbiguous: boolean
}

type GenerationMode = 'password' | 'passphrase'

// Password strength calculation (zxcvbn-like algorithm)
function calculateStrengthScore(password: string): {
  score: 0 | 1 | 2 | 3 | 4
  crackTime: string
  feedback: string
} {
  const length = password.length
  let entropy = 0
  
  // Calculate character set size
  let charsetSize = 0
  if (/[a-z]/.test(password)) charsetSize += 26
  if (/[A-Z]/.test(password)) charsetSize += 26
  if (/[0-9]/.test(password)) charsetSize += 10
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32
  
  // Calculate entropy
  if (charsetSize > 0) {
    entropy = length * Math.log2(charsetSize)
  }
  
  // Check for common patterns
  const hasSequence = /(.)\1{2,}|012|123|234|345|456|567|678|789|abc|bcd|cde|def/i.test(password)
  const isCommon = ['password', '123456', 'qwerty', 'admin', 'letmein', 'welcome'].some(
    common => password.toLowerCase().includes(common)
  )
  
  if (hasSequence) entropy *= 0.7
  if (isCommon) entropy *= 0.3
  
  // Determine score and crack time
  let score: 0 | 1 | 2 | 3 | 4
  let crackTime: string
  let feedback: string
  
  if (entropy < 28 || isCommon) {
    score = 0
    crackTime = 'Instant'
    feedback = 'Very weak - easily guessable'
  } else if (entropy < 36) {
    score = 1
    crackTime = 'Minutes'
    feedback = 'Weak - add more characters'
  } else if (entropy < 60) {
    score = 2
    crackTime = 'Hours to days'
    feedback = 'Fair - consider adding symbols'
  } else if (entropy < 80) {
    score = 3
    crackTime = 'Months to years'
    feedback = 'Strong - good for most uses'
  } else {
    score = 4
    crackTime = 'Centuries+'
    feedback = 'Very strong - excellent!'
  }
  
  return { score, crackTime, feedback }
}

// Cryptographically secure random number generator
function secureRandom(max: number): number {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return array[0] % max
}

export default function PasswordGeneratorClient() {
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<GenerationMode>('password')
  const [length, setLength] = useState(16)
  const [wordCount, setWordCount] = useState(4)
  const [separator, setSeparator] = useState('-')
  const [capitalize, setCapitalize] = useState(true)
  const [options, setOptions] = useState<PasswordOptions>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
    excludeAmbiguous: false,
  })
  const [copied, setCopied] = useState(false)
  const [strengthInfo, setStrengthInfo] = useState<{
    score: 0 | 1 | 2 | 3 | 4
    crackTime: string
    feedback: string
  }>({ score: 2, crackTime: 'Hours to days', feedback: 'Fair' })
  const [isMobile, setIsMobile] = useState(false)

  // Vibration helper
  const vibrate = (duration: number = 30) => {
    if (navigator.vibrate) {
      navigator.vibrate(duration)
    }
  }

  // Device detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      const smallScreen = window.innerWidth < 768
      setIsMobile(mobile || smallScreen)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Character sets
  const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
  const NUMBERS = '0123456789'
  const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  const AMBIGUOUS = '0O1lI|'

  // Generate password
  const generatePassword = useCallback(() => {
    if (mode === 'passphrase') {
      const words: string[] = []
      for (let i = 0; i < wordCount; i++) {
        let word = WORDLIST[secureRandom(WORDLIST.length)]
        if (capitalize) {
          word = word.charAt(0).toUpperCase() + word.slice(1)
        }
        words.push(word)
      }
      setPassword(words.join(separator))
    } else {
      let chars = ''
      if (options.uppercase) chars += UPPERCASE
      if (options.lowercase) chars += LOWERCASE
      if (options.numbers) chars += NUMBERS
      if (options.symbols) chars += SYMBOLS

      if (options.excludeAmbiguous) {
        chars = chars.split('').filter(c => !AMBIGUOUS.includes(c)).join('')
      }

      if (chars === '') {
        chars = LOWERCASE.split('').filter(c => !AMBIGUOUS.includes(c)).join('')
        setOptions((prev) => ({ ...prev, lowercase: true }))
      }

      let newPassword = ''
      for (let i = 0; i < length; i++) {
        newPassword += chars[secureRandom(chars.length)]
      }

      // Ensure at least one character from each selected type
      const ensureChars: string[] = []
      
      const getChars = (set: string) => options.excludeAmbiguous 
        ? set.split('').filter(c => !AMBIGUOUS.includes(c)).join('')
        : set

      if (options.uppercase) {
        const availableChars = getChars(UPPERCASE)
        if (!availableChars.split('').some((c) => newPassword.includes(c))) {
          ensureChars.push(availableChars[secureRandom(availableChars.length)])
        }
      }
      if (options.lowercase) {
        const availableChars = getChars(LOWERCASE)
        if (!availableChars.split('').some((c) => newPassword.includes(c))) {
          ensureChars.push(availableChars[secureRandom(availableChars.length)])
        }
      }
      if (options.numbers) {
        const availableChars = getChars(NUMBERS)
        if (!availableChars.split('').some((c) => newPassword.includes(c))) {
          ensureChars.push(availableChars[secureRandom(availableChars.length)])
        }
      }
      if (options.symbols) {
        const availableChars = getChars(SYMBOLS)
        if (!availableChars.split('').some((c) => newPassword.includes(c))) {
          ensureChars.push(availableChars[secureRandom(availableChars.length)])
        }
      }

      if (ensureChars.length > 0) {
        const passwordArray = newPassword.split('')
        ensureChars.forEach((char) => {
          const randomPos = secureRandom(passwordArray.length)
          passwordArray[randomPos] = char
        })
        newPassword = passwordArray.join('')
      }

      setPassword(newPassword)
    }
    vibrate(30)
  }, [mode, length, wordCount, separator, capitalize, options])

  // Update strength when password changes
  useEffect(() => {
    if (password) {
      setStrengthInfo(calculateStrengthScore(password))
    }
  }, [password])

  // Generate on mount and when options change
  useEffect(() => {
    generatePassword()
  }, [generatePassword])

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password)
      vibrate(30)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy')
    }
  }

  // Toggle option
  const toggleOption = (option: keyof PasswordOptions) => {
    const newOptions = { ...options, [option]: !options[option] }
    if (['uppercase', 'lowercase', 'numbers', 'symbols'].includes(option)) {
      const hasSelection = newOptions.uppercase || newOptions.lowercase || newOptions.numbers || newOptions.symbols
      if (!hasSelection) return
    }
    setOptions(newOptions)
    vibrate(30)
  }

  const getStrengthColor = () => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-cyan-500']
    return colors[strengthInfo.score]
  }

  const getStrengthText = () => {
    const texts = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong']
    return texts[strengthInfo.score]
  }

  const getStrengthTextColor = () => {
    const colors = ['text-red-400', 'text-orange-400', 'text-yellow-400', 'text-green-400', 'text-cyan-400']
    return colors[strengthInfo.score]
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <style jsx>{`
        .custom-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 9999px;
          outline: none;
        }
        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(6 182 212), rgb(37 99 235));
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(6, 182, 212, 0.4);
          transition: all 0.2s;
        }
        .custom-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.6);
        }
        .custom-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(6 182 212), rgb(37 99 235));
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(6, 182, 212, 0.4);
        }
        @media (max-width: 768px) {
          .custom-slider::-webkit-slider-thumb { width: 28px; height: 28px; }
          .custom-slider::-moz-range-thumb { width: 28px; height: 28px; }
        }
      `}</style>

      {/* Privacy Badge */}
      <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-2">
        <Lock className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-green-300 font-medium">100% Private</p>
          <p className="text-green-400/70 text-xs mt-1">
            Generated locally using cryptographic randomness • Never sent anywhere
          </p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-2 mb-6">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => { setMode('password'); vibrate(30) }}
            className={`py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              mode === 'password'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Key className="w-4 h-4" />
            Password
          </button>
          <button
            onClick={() => { setMode('passphrase'); vibrate(30) }}
            className={`py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              mode === 'passphrase'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Type className="w-4 h-4" />
            Passphrase
          </button>
        </div>
      </div>

      {/* Password Display */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 mb-6">
        <div className="bg-black/20 rounded-xl p-4 sm:p-6 mb-4 font-mono">
          <div className="text-lg sm:text-xl md:text-2xl text-white text-center break-all select-all min-h-[2em] leading-relaxed">
            {password || 'Generating...'}
          </div>
        </div>

        {/* Strength Meter */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Strength</span>
            <span className={`text-sm font-medium ${getStrengthTextColor()}`}>
              {getStrengthText()}
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getStrengthColor()}`}
              style={{ width: `${(strengthInfo.score + 1) * 20}%` }}
            />
          </div>
        </div>

        {/* Crack Time Display */}
        <div className="flex items-center justify-between text-sm mb-4 p-3 bg-black/20 rounded-lg">
          <div className="flex items-center gap-2 text-gray-400">
            <Zap className="w-4 h-4" />
            <span>Time to crack:</span>
          </div>
          <span className={`font-medium ${
            strengthInfo.score >= 3 ? 'text-green-400' : strengthInfo.score >= 2 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {strengthInfo.crackTime}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={generatePassword}
            className="min-h-[44px] py-3 sm:py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl 
                     font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2
                     shadow-lg shadow-cyan-600/30 active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="hidden sm:inline">Generate</span>
            <span className="sm:hidden">New</span>
          </button>
          <button
            onClick={handleCopy}
            className={`min-h-[44px] py-3 sm:py-3.5 rounded-xl font-medium transition-all flex items-center 
                      justify-center gap-2 active:scale-95 ${
                        copied
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
          >
            {copied ? <><Check className="w-5 h-5" /><span className="hidden sm:inline">Copied!</span><span className="sm:hidden">✓</span></> 
                    : <><Copy className="w-5 h-5" />Copy</>}
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 mb-6">
        {mode === 'password' ? (
          <>
            {/* Password Length Slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="text-white font-medium text-sm sm:text-base">Length</label>
                <span className="text-cyan-400 font-bold text-2xl min-w-[3ch] text-right">{length}</span>
              </div>
              <input
                type="range" min="8" max="64" value={length}
                onChange={(e) => { setLength(Number(e.target.value)); vibrate(10) }}
                className="w-full custom-slider cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(6 182 212) 0%, rgb(6 182 212) ${((length - 8) / 56) * 100}%, rgba(255, 255, 255, 0.1) ${((length - 8) / 56) * 100}%, rgba(255, 255, 255, 0.1) 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-3">
                <span>8</span><span className="hidden sm:inline">16</span><span className="hidden sm:inline">32</span><span className="hidden sm:inline">48</span><span>64</span>
              </div>
            </div>

            {/* Character Options */}
            <div className="space-y-3">
              <label className="text-white font-medium block text-sm sm:text-base">Characters</label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  { key: 'uppercase' as const, label: 'ABC', desc: 'Uppercase' },
                  { key: 'lowercase' as const, label: 'abc', desc: 'Lowercase' },
                  { key: 'numbers' as const, label: '123', desc: 'Numbers' },
                  { key: 'symbols' as const, label: '!@#', desc: 'Symbols' },
                ].map(({ key, label, desc }) => (
                  <button
                    key={key}
                    onClick={() => toggleOption(key)}
                    className={`min-h-[44px] p-4 rounded-lg border transition-all active:scale-95 ${
                      options[key]
                        ? 'bg-cyan-600/20 border-cyan-600/50 text-white shadow-lg shadow-cyan-600/20'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-bold text-lg sm:text-xl">{label}</div>
                    <div className="text-xs mt-1 opacity-80">{desc}</div>
                  </button>
                ))}
              </div>

              {/* Exclude Ambiguous */}
              <button
                onClick={() => toggleOption('excludeAmbiguous')}
                className={`w-full min-h-[44px] p-4 rounded-lg border transition-all active:scale-95 flex items-center justify-between ${
                  options.excludeAmbiguous
                    ? 'bg-amber-600/20 border-amber-600/50 text-white'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium text-sm">Exclude Ambiguous</div>
                    <div className="text-xs opacity-70">Remove 0O1lI| for clarity</div>
                  </div>
                </div>
                <div className={`w-10 h-6 rounded-full transition-colors ${options.excludeAmbiguous ? 'bg-amber-500' : 'bg-white/20'}`}>
                  <div className="w-5 h-5 rounded-full bg-white shadow mt-0.5" style={{ transform: options.excludeAmbiguous ? 'translateX(18px)' : 'translateX(2px)' }} />
                </div>
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Word Count */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="text-white font-medium text-sm sm:text-base">Words</label>
                <span className="text-cyan-400 font-bold text-2xl min-w-[2ch] text-right">{wordCount}</span>
              </div>
              <input
                type="range" min="3" max="8" value={wordCount}
                onChange={(e) => { setWordCount(Number(e.target.value)); vibrate(10) }}
                className="w-full custom-slider cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(6 182 212) 0%, rgb(6 182 212) ${((wordCount - 3) / 5) * 100}%, rgba(255, 255, 255, 0.1) ${((wordCount - 3) / 5) * 100}%, rgba(255, 255, 255, 0.1) 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-3">
                {[3,4,5,6,7,8].map(n => <span key={n}>{n}</span>)}
              </div>
            </div>

            {/* Separator */}
            <div className="mb-6">
              <label className="text-white font-medium block text-sm sm:text-base mb-3">Separator</label>
              <div className="grid grid-cols-5 gap-2">
                {['-', '_', '.', ' ', ''].map((sep) => (
                  <button
                    key={sep}
                    onClick={() => { setSeparator(sep); vibrate(30) }}
                    className={`py-3 rounded-lg border transition-all text-center font-mono text-lg ${
                      separator === sep
                        ? 'bg-cyan-600/20 border-cyan-600/50 text-white'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {sep === '' ? '∅' : sep === ' ' ? '␣' : sep}
                  </button>
                ))}
              </div>
            </div>

            {/* Capitalize */}
            <button
              onClick={() => { setCapitalize(!capitalize); vibrate(30) }}
              className={`w-full min-h-[44px] p-4 rounded-lg border transition-all active:scale-95 flex items-center justify-between ${
                capitalize ? 'bg-cyan-600/20 border-cyan-600/50 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <Type className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium text-sm">Capitalize Words</div>
                  <div className="text-xs opacity-70">First letter uppercase</div>
                </div>
              </div>
              <div className={`w-10 h-6 rounded-full transition-colors ${capitalize ? 'bg-cyan-500' : 'bg-white/20'}`}>
                <div className="w-5 h-5 rounded-full bg-white shadow mt-0.5" style={{ transform: capitalize ? 'translateX(18px)' : 'translateX(2px)' }} />
              </div>
            </button>
          </>
        )}
      </div>

      {/* Security Tips */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
        <div className="flex items-center gap-2 text-white font-medium mb-3 text-sm sm:text-base">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
          Security Tips
        </div>
        <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-4 sm:gap-y-2">
          {mode === 'password' ? (
            <>
              <div className="flex items-start gap-2 text-sm text-gray-400"><span className="text-cyan-400">•</span><span>Use 16+ characters for important accounts</span></div>
              <div className="flex items-start gap-2 text-sm text-gray-400"><span className="text-cyan-400">•</span><span>Include symbols for extra strength</span></div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-2 text-sm text-gray-400"><span className="text-cyan-400">•</span><span>4+ words = very secure & memorable</span></div>
              <div className="flex items-start gap-2 text-sm text-gray-400"><span className="text-cyan-400">•</span><span>Each word adds ~10 bits of entropy</span></div>
            </>
          )}
          <div className="flex items-start gap-2 text-sm text-gray-400"><span className="text-cyan-400">•</span><span>Unique password for each account</span></div>
          <div className="flex items-start gap-2 text-sm text-gray-400"><span className="text-cyan-400">•</span><span>Use a password manager</span></div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex items-start gap-2 text-sm text-green-400">
            <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Generated using <strong>crypto.getRandomValues()</strong> - cryptographically secure and never leaves your browser.</span>
          </div>
        </div>
      </div>
    </div>
  )
}