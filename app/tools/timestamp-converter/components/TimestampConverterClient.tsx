'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { 
  Copy, Check, Clock, Calendar, Globe, RefreshCw, ArrowLeftRight,
  Lock, MessageSquare, Hash, Zap, Info, ChevronDown, ChevronUp
} from 'lucide-react'

// ===== TYPES =====
type Precision = 'seconds' | 'milliseconds' | 'auto'

interface ConversionResult {
  label: string
  value: string
  copyId: string
}

// ===== CONSTANTS =====
const COMMON_TIMEZONES = [
  { id: 'UTC', label: 'UTC', offset: '+00:00' },
  { id: 'America/New_York', label: 'New York (EST/EDT)', offset: '-05:00' },
  { id: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)', offset: '-08:00' },
  { id: 'America/Chicago', label: 'Chicago (CST/CDT)', offset: '-06:00' },
  { id: 'Europe/London', label: 'London (GMT/BST)', offset: '+00:00' },
  { id: 'Europe/Paris', label: 'Paris (CET/CEST)', offset: '+01:00' },
  { id: 'Europe/Berlin', label: 'Berlin (CET/CEST)', offset: '+01:00' },
  { id: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: '+09:00' },
  { id: 'Asia/Shanghai', label: 'Shanghai (CST)', offset: '+08:00' },
  { id: 'Asia/Singapore', label: 'Singapore (SGT)', offset: '+08:00' },
  { id: 'Asia/Dubai', label: 'Dubai (GST)', offset: '+04:00' },
  { id: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)', offset: '+10:00' },
  { id: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)', offset: '+12:00' },
]

const DISCORD_FORMATS = [
  { code: 't', label: 'Short Time', example: '9:41 PM' },
  { code: 'T', label: 'Long Time', example: '9:41:30 PM' },
  { code: 'd', label: 'Short Date', example: '12/04/2025' },
  { code: 'D', label: 'Long Date', example: 'December 4, 2025' },
  { code: 'f', label: 'Short Date/Time', example: 'December 4, 2025 9:41 PM' },
  { code: 'F', label: 'Long Date/Time', example: 'Thursday, December 4, 2025 9:41 PM' },
  { code: 'R', label: 'Relative', example: '2 hours ago' },
]

// ===== HELPER FUNCTIONS =====
function detectPrecision(input: string): { precision: Precision; timestamp: number } {
  const num = parseInt(input, 10)
  if (isNaN(num)) return { precision: 'auto', timestamp: 0 }
  
  // If > 10 trillion, likely nanoseconds (divide by 1M)
  if (num > 10_000_000_000_000) {
    return { precision: 'milliseconds', timestamp: Math.floor(num / 1_000_000) }
  }
  // If > 1 trillion, likely milliseconds
  if (num > 1_000_000_000_000) {
    return { precision: 'milliseconds', timestamp: num }
  }
  // If between 1B and 1T, likely seconds
  if (num > 1_000_000_000) {
    return { precision: 'seconds', timestamp: num * 1000 }
  }
  // Small numbers default to seconds
  return { precision: 'seconds', timestamp: num * 1000 }
}

function formatInTimezone(timestamp: number, timezone: string, format: string): string {
  try {
    const date = new Date(timestamp)
    const options: Intl.DateTimeFormatOptions = { timeZone: timezone }
    
    switch (format) {
      case 'iso':
        return date.toISOString()
      case 'locale':
        return date.toLocaleString('en-US', { ...options, dateStyle: 'full', timeStyle: 'long' })
      case 'date':
        return date.toLocaleDateString('en-US', { ...options, dateStyle: 'full' })
      case 'time':
        return date.toLocaleTimeString('en-US', { ...options, timeStyle: 'medium' })
      case 'rfc2822':
        return date.toUTCString()
      default:
        return date.toLocaleString('en-US', options)
    }
  } catch {
    return 'Invalid date'
  }
}

function getRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const absDiff = Math.abs(diff)
  const isPast = diff > 0
  
  const seconds = Math.floor(absDiff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)
  
  let text = ''
  if (years > 0) text = `${years} year${years > 1 ? 's' : ''}`
  else if (months > 0) text = `${months} month${months > 1 ? 's' : ''}`
  else if (weeks > 0) text = `${weeks} week${weeks > 1 ? 's' : ''}`
  else if (days > 0) text = `${days} day${days > 1 ? 's' : ''}`
  else if (hours > 0) text = `${hours} hour${hours > 1 ? 's' : ''}`
  else if (minutes > 0) text = `${minutes} minute${minutes > 1 ? 's' : ''}`
  else text = `${seconds} second${seconds !== 1 ? 's' : ''}`
  
  return isPast ? `${text} ago` : `in ${text}`
}

// ===== MAIN COMPONENT =====
export default function TimestampConverterClient() {
  const [mode, setMode] = useState<'toDate' | 'toTimestamp'>('toDate')
  const [timestampInput, setTimestampInput] = useState('')
  const [dateInput, setDateInput] = useState('')
  const [timeInput, setTimeInput] = useState('')
  const [timezone, setTimezone] = useState('UTC')
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [copied, setCopied] = useState<string | null>(null)
  const [showDiscord, setShowDiscord] = useState(false)
  const [showTimezones, setShowTimezones] = useState(false)
  
  // Detect user timezone on mount
  useEffect(() => {
    try {
      const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (COMMON_TIMEZONES.some(tz => tz.id === userTz)) {
        setTimezone(userTz)
      }
    } catch {
      // Keep UTC default
    }
  }, [])
  
  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  
  // Auto-detect and convert timestamp input
  const { detectedPrecision, convertedTimestamp, isValidTimestamp } = useMemo(() => {
    if (!timestampInput.trim()) {
      return { detectedPrecision: null, convertedTimestamp: 0, isValidTimestamp: false }
    }
    
    const { precision, timestamp } = detectPrecision(timestampInput.trim())
    const isValid = timestamp > 0 && !isNaN(new Date(timestamp).getTime())
    
    return {
      detectedPrecision: precision,
      convertedTimestamp: timestamp,
      isValidTimestamp: isValid
    }
  }, [timestampInput])
  
  // Convert date input to timestamp
  const dateToTimestamp = useMemo(() => {
    if (!dateInput) return null
    
    try {
      const dateStr = timeInput ? `${dateInput}T${timeInput}` : dateInput
      const date = new Date(dateStr)
      
      if (isNaN(date.getTime())) return null
      
      return {
        seconds: Math.floor(date.getTime() / 1000),
        milliseconds: date.getTime()
      }
    } catch {
      return null
    }
  }, [dateInput, timeInput])
  
  // Copy to clipboard
  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      if (navigator.vibrate) navigator.vibrate(30)
      setTimeout(() => setCopied(null), 2000)
    } catch (e) {
      console.error('Copy failed:', e)
    }
  }, [])
  
  // Use current time
  const useCurrentTime = useCallback(() => {
    const now = Date.now()
    setTimestampInput(Math.floor(now / 1000).toString())
    if (navigator.vibrate) navigator.vibrate(30)
  }, [])
  
  // Format results for timestamp -> date
  const conversionResults: ConversionResult[] = useMemo(() => {
    if (!isValidTimestamp) return []
    
    return [
      { label: 'Local Time', value: formatInTimezone(convertedTimestamp, timezone, 'locale'), copyId: 'local' },
      { label: 'ISO 8601', value: new Date(convertedTimestamp).toISOString(), copyId: 'iso' },
      { label: 'RFC 2822', value: new Date(convertedTimestamp).toUTCString(), copyId: 'rfc' },
      { label: 'Unix (seconds)', value: Math.floor(convertedTimestamp / 1000).toString(), copyId: 'unix-s' },
      { label: 'Unix (milliseconds)', value: convertedTimestamp.toString(), copyId: 'unix-ms' },
      { label: 'Relative', value: getRelativeTime(convertedTimestamp), copyId: 'relative' },
    ]
  }, [isValidTimestamp, convertedTimestamp, timezone])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Privacy Badge */}
      <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
        <Lock className="w-4 h-4 text-green-400 flex-shrink-0" />
        <p className="text-green-400 text-xs">
          <span className="font-medium">100% Private</span> — All conversions done locally in your browser
        </p>
      </div>

      {/* Current Time Display */}
      <div className="mb-6 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
              <div className="text-sm text-gray-400 mb-1">Current Time ({timezone})</div>
              <div className="font-mono text-2xl text-cyan-400">
                {formatInTimezone(currentTime, timezone, 'locale')}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-1">Unix Timestamp</div>
              <div className="font-mono text-xl">
                <span className="text-white">{Math.floor(currentTime / 1000)}</span>
                <span className="text-gray-500 text-sm ml-1">(s)</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-white/5 rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setMode('toDate')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                mode === 'toDate' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Timestamp → Date
            </button>
            <button
              onClick={() => setMode('toTimestamp')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                mode === 'toTimestamp' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Date → Timestamp
            </button>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            {mode === 'toDate' ? (
              /* Timestamp to Date */
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <label className="text-sm font-medium text-gray-300 mb-3 block">
                  Unix Timestamp
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={timestampInput}
                    onChange={(e) => setTimestampInput(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter timestamp (e.g., 1701648000)"
                    className="flex-1 bg-gray-800/50 rounded-xl border border-white/10 px-4 py-3 outline-none font-mono text-lg focus:border-cyan-500/50 transition-colors"
                  />
                  <button
                    onClick={useCurrentTime}
                    className="px-4 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-xl transition-colors"
                    title="Use current time"
                  >
                    <RefreshCw className="w-5 h-5 text-cyan-400" />
                  </button>
                </div>
                
                {/* Auto-detection info */}
                {detectedPrecision && timestampInput && (
                  <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-blue-400">
                      Detected: {timestampInput.length}-digit timestamp ({detectedPrecision === 'seconds' ? 'seconds' : 'milliseconds'} precision)
                    </span>
                  </div>
                )}
                
                {timestampInput && !isValidTimestamp && (
                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <span className="text-sm text-red-400">Invalid timestamp</span>
                  </div>
                )}
              </div>
            ) : (
              /* Date to Timestamp */
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <label className="text-sm font-medium text-gray-300 mb-3 block">
                  Date & Time
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="bg-gray-800/50 rounded-xl border border-white/10 px-4 py-3 outline-none focus:border-cyan-500/50 transition-colors"
                  />
                  <input
                    type="time"
                    value={timeInput}
                    onChange={(e) => setTimeInput(e.target.value)}
                    step="1"
                    className="bg-gray-800/50 rounded-xl border border-white/10 px-4 py-3 outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
                
                {dateToTimestamp && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <span className="text-gray-400 text-sm">Seconds:</span>
                        <span className="ml-2 font-mono text-white">{dateToTimestamp.seconds}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(dateToTimestamp.seconds.toString(), 'date-s')}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {copied === 'date-s' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <span className="text-gray-400 text-sm">Milliseconds:</span>
                        <span className="ml-2 font-mono text-white">{dateToTimestamp.milliseconds}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(dateToTimestamp.milliseconds.toString(), 'date-ms')}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {copied === 'date-ms' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Timezone Selector */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
              <button
                onClick={() => setShowTimezones(!showTimezones)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <span className="font-medium">Timezone: {timezone}</span>
                </div>
                {showTimezones ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              
              {showTimezones && (
                <div className="p-4 pt-0 max-h-60 overflow-y-auto">
                  <div className="grid gap-1">
                    {COMMON_TIMEZONES.map((tz) => (
                      <button
                        key={tz.id}
                        onClick={() => {
                          setTimezone(tz.id)
                          setShowTimezones(false)
                          if (navigator.vibrate) navigator.vibrate(30)
                        }}
                        className={`p-3 rounded-lg text-left transition-colors ${
                          timezone === tz.id
                            ? 'bg-purple-500/20 border border-purple-500/30'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="font-medium text-sm">{tz.label}</div>
                        <div className="text-xs text-gray-400">{tz.id}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Discord/Slack Formatter */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
              <button
                onClick={() => setShowDiscord(!showDiscord)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                  <span className="font-medium">Discord / Slack Timestamps</span>
                </div>
                {showDiscord ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              
              {showDiscord && isValidTimestamp && (
                <div className="p-4 pt-0 space-y-2">
                  <p className="text-xs text-gray-400 mb-3">
                    Copy these codes to display dynamic timestamps in Discord/Slack
                  </p>
                  {DISCORD_FORMATS.map((format) => {
                    const unixSeconds = Math.floor(convertedTimestamp / 1000)
                    const code = `<t:${unixSeconds}:${format.code}>`
                    return (
                      <div 
                        key={format.code}
                        className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                      >
                        <div>
                          <div className="font-mono text-indigo-400 text-sm">{code}</div>
                          <div className="text-xs text-gray-400">{format.label} • {format.example}</div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(code, `discord-${format.code}`)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          {copied === `discord-${format.code}` ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
              
              {showDiscord && !isValidTimestamp && (
                <div className="p-4 pt-0">
                  <p className="text-sm text-gray-500">Enter a valid timestamp to generate Discord codes</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Results Section */}
          <div className="space-y-4">
            {mode === 'toDate' && isValidTimestamp && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <h3 className="text-sm font-medium text-gray-300 mb-4">Conversion Results</h3>
                <div className="space-y-3">
                  {conversionResults.map((result) => (
                    <div 
                      key={result.copyId}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-400 mb-1">{result.label}</div>
                        <div className="font-mono text-sm text-white truncate">{result.value}</div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(result.value, result.copyId)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0 ml-2"
                      >
                        {copied === result.copyId ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quick Reference */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-sm font-medium text-gray-300 mb-4">Quick Reference</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-gray-400 mb-1">10-digit timestamp</div>
                  <div className="font-mono text-cyan-400">1701648000 → seconds</div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-gray-400 mb-1">13-digit timestamp</div>
                  <div className="font-mono text-cyan-400">1701648000000 → milliseconds</div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-gray-400 mb-1">Common Epochs</div>
                  <div className="font-mono text-xs text-gray-300">
                    <div>0 = Jan 1, 1970 (Unix Epoch)</div>
                    <div>2147483647 = Jan 19, 2038 (Y2K38)</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Code Examples */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-sm font-medium text-gray-300 mb-4">Code Examples</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-xs text-gray-400 mb-2">JavaScript</div>
                  <code className="text-xs text-green-400 font-mono">
                    Date.now() // milliseconds<br/>
                    Math.floor(Date.now() / 1000) // seconds
                  </code>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-xs text-gray-400 mb-2">Python</div>
                  <code className="text-xs text-green-400 font-mono">
                    import time<br/>
                    time.time() # seconds (float)
                  </code>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-xs text-gray-400 mb-2">Bash</div>
                  <code className="text-xs text-green-400 font-mono">
                    date +%s # seconds
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
