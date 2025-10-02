'use client'

import { useState, useEffect, useCallback } from 'react'
import { Copy, RefreshCw, Check, Shield } from 'lucide-react'

interface PasswordOptions {
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
}

export default function PasswordGeneratorClient() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState<PasswordOptions>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false // Default off for easier copying
  })
  const [copied, setCopied] = useState(false)
  const [strength, setStrength] = useState<'weak' | 'medium' | 'strong' | 'very-strong'>('medium')

  // Character sets
  const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
  const NUMBERS = '0123456789'
  const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  // Generate password
  const generatePassword = useCallback(() => {
    let chars = ''
    let newPassword = ''

    // Build character set
    if (options.uppercase) chars += UPPERCASE
    if (options.lowercase) chars += LOWERCASE
    if (options.numbers) chars += NUMBERS
    if (options.symbols) chars += SYMBOLS

    // If no options selected, use lowercase by default
    if (chars === '') {
      chars = LOWERCASE
      setOptions(prev => ({ ...prev, lowercase: true }))
    }

    // Generate random password
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length)
      newPassword += chars[randomIndex]
    }

    // Ensure at least one character from each selected type
    const ensureChars: string[] = []
    if (options.uppercase && !UPPERCASE.split('').some(c => newPassword.includes(c))) {
      ensureChars.push(UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)])
    }
    if (options.lowercase && !LOWERCASE.split('').some(c => newPassword.includes(c))) {
      ensureChars.push(LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)])
    }
    if (options.numbers && !NUMBERS.split('').some(c => newPassword.includes(c))) {
      ensureChars.push(NUMBERS[Math.floor(Math.random() * NUMBERS.length)])
    }
    if (options.symbols && !SYMBOLS.split('').some(c => newPassword.includes(c))) {
      ensureChars.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
    }

    // Replace random positions with ensured characters
    if (ensureChars.length > 0) {
      let passwordArray = newPassword.split('')
      ensureChars.forEach(char => {
        const randomPos = Math.floor(Math.random() * passwordArray.length)
        passwordArray[randomPos] = char
      })
      newPassword = passwordArray.join('')
    }

    setPassword(newPassword)
  }, [length, options])

  // Calculate password strength
  const calculateStrength = useCallback((pwd: string) => {
    let score = 0

    // Length score
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (pwd.length >= 16) score++
    if (pwd.length >= 20) score++

    // Character variety score
    if (/[a-z]/.test(pwd)) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^a-zA-Z0-9]/.test(pwd)) score++

    // Set strength based on score
    if (score <= 3) setStrength('weak')
    else if (score <= 5) setStrength('medium')
    else if (score <= 7) setStrength('strong')
    else setStrength('very-strong')
  }, [])

  // Generate password on mount and when options change
  useEffect(() => {
    generatePassword()
  }, [generatePassword])

  // Update strength when password changes
  useEffect(() => {
    calculateStrength(password)
  }, [password, calculateStrength])

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy')
    }
  }

  // Toggle option
  const toggleOption = (option: keyof PasswordOptions) => {
    // Ensure at least one option is always selected
    const newOptions = { ...options, [option]: !options[option] }
    const hasSelection = Object.values(newOptions).some(v => v)
    
    if (hasSelection) {
      setOptions(newOptions)
    }
  }

  // Get strength color
  const getStrengthColor = () => {
    switch (strength) {
      case 'weak': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'strong': return 'bg-green-500'
      case 'very-strong': return 'bg-cyan-500'
    }
  }

  // Get strength text
  const getStrengthText = () => {
    switch (strength) {
      case 'weak': return 'Weak'
      case 'medium': return 'OK'
      case 'strong': return 'Strong'
      case 'very-strong': return 'Excellent'
    }
  }

  // Get strength width
  const getStrengthWidth = () => {
    switch (strength) {
      case 'weak': return '25%'
      case 'medium': return '50%'
      case 'strong': return '75%'
      case 'very-strong': return '100%'
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Password Display - Tool First */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
        <div className="bg-black/20 rounded-xl p-6 mb-4 font-mono">
          <div className="text-xl sm:text-2xl text-white text-center break-all select-all min-h-[2em]">
            {password || 'Generating...'}
          </div>
        </div>

        {/* Strength Meter */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Strength</span>
            <span className={`text-sm font-medium ${
              strength === 'weak' ? 'text-red-400' :
              strength === 'medium' ? 'text-yellow-400' :
              strength === 'strong' ? 'text-green-400' :
              'text-cyan-400'
            }`}>
              {getStrengthText()}
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${getStrengthColor()}`}
              style={{ width: getStrengthWidth() }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={generatePassword}
            className="py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl 
                     font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Generate
          </button>
          <button
            onClick={handleCopy}
            className={`py-3 rounded-xl font-medium transition-all flex items-center 
                      justify-center gap-2 ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
        {/* Length Slider */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <label className="text-white font-medium">Length</label>
            <span className="text-cyan-400 font-bold text-xl min-w-[3ch] text-right">{length}</span>
          </div>
          <input
            type="range"
            min="8"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, rgb(6 182 212) 0%, rgb(6 182 212) ${((length - 8) / 24) * 100}%, rgba(255, 255, 255, 0.1) ${((length - 8) / 24) * 100}%, rgba(255, 255, 255, 0.1) 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>8</span>
            <span>16</span>
            <span>24</span>
            <span>32</span>
          </div>
        </div>

        {/* Character Options */}
        <div className="space-y-2">
          <label className="text-white font-medium block mb-3">Characters</label>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => toggleOption('uppercase')}
              className={`p-3 rounded-lg border transition-all ${
                options.uppercase
                  ? 'bg-cyan-600/20 border-cyan-600/50 text-white'
                  : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              <div className="font-medium">ABC</div>
              <div className="text-xs mt-1 opacity-80">Uppercase</div>
            </button>

            <button
              onClick={() => toggleOption('lowercase')}
              className={`p-3 rounded-lg border transition-all ${
                options.lowercase
                  ? 'bg-cyan-600/20 border-cyan-600/50 text-white'
                  : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              <div className="font-medium">abc</div>
              <div className="text-xs mt-1 opacity-80">Lowercase</div>
            </button>

            <button
              onClick={() => toggleOption('numbers')}
              className={`p-3 rounded-lg border transition-all ${
                options.numbers
                  ? 'bg-cyan-600/20 border-cyan-600/50 text-white'
                  : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              <div className="font-medium">123</div>
              <div className="text-xs mt-1 opacity-80">Numbers</div>
            </button>

            <button
              onClick={() => toggleOption('symbols')}
              className={`p-3 rounded-lg border transition-all ${
                options.symbols
                  ? 'bg-cyan-600/20 border-cyan-600/50 text-white'
                  : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              <div className="font-medium">!@#</div>
              <div className="text-xs mt-1 opacity-80">Symbols</div>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Tips - Simplified */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
        <div className="flex items-center gap-2 text-white font-medium mb-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          Security Tips
        </div>
        <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-400">
          <div>• Use 12+ characters</div>
          <div>• Mix different types</div>
          <div>• Unique for each account</div>
          <div>• Never share passwords</div>
        </div>
      </div>
    </div>
  )
}