'use client'

import { useState, useCallback, useMemo } from 'react'
import { Copy, Check, Clock, Calendar, Lock, Info, Play, ChevronDown, ChevronUp } from 'lucide-react'

// ===== CRON PARSING =====
const CRON_PRESETS = [
  { label: 'Every minute', cron: '* * * * *' },
  { label: 'Every 5 minutes', cron: '*/5 * * * *' },
  { label: 'Every 15 minutes', cron: '*/15 * * * *' },
  { label: 'Every hour', cron: '0 * * * *' },
  { label: 'Every day at midnight', cron: '0 0 * * *' },
  { label: 'Every day at 9am', cron: '0 9 * * *' },
  { label: 'Every Monday at 9am', cron: '0 9 * * 1' },
  { label: 'Every weekday at 9am', cron: '0 9 * * 1-5' },
  { label: 'First day of month', cron: '0 0 1 * *' },
  { label: 'Every Sunday at 3am', cron: '0 3 * * 0' },
]

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function parseCronField(field: string, type: 'minute' | 'hour' | 'day' | 'month' | 'weekday'): string {
  if (field === '*') return `every ${type}`
  if (field.includes('/')) {
    const [, step] = field.split('/')
    return `every ${step} ${type}s`
  }
  if (field.includes('-')) {
    const [start, end] = field.split('-')
    if (type === 'weekday') return `${DAYS_OF_WEEK[parseInt(start)]} through ${DAYS_OF_WEEK[parseInt(end)]}`
    if (type === 'month') return `${MONTHS[parseInt(start) - 1]} through ${MONTHS[parseInt(end) - 1]}`
    return `${start} through ${end}`
  }
  if (field.includes(',')) {
    const values = field.split(',')
    if (type === 'weekday') return values.map(v => DAYS_OF_WEEK[parseInt(v)]).join(', ')
    if (type === 'month') return values.map(v => MONTHS[parseInt(v) - 1]).join(', ')
    return values.join(', ')
  }
  // Single value
  if (type === 'weekday') return `on ${DAYS_OF_WEEK[parseInt(field)]}`
  if (type === 'month') return `in ${MONTHS[parseInt(field) - 1]}`
  if (type === 'minute') return `at minute ${field}`
  if (type === 'hour') return `at ${field}:00`
  if (type === 'day') return `on day ${field}`
  return field
}

function cronToHuman(cron: string): string {
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 5) return 'Invalid cron expression (need 5 fields)'
  
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts
  
  // Common patterns
  if (cron === '* * * * *') return 'Every minute'
  if (cron === '0 * * * *') return 'Every hour at minute 0'
  if (cron === '0 0 * * *') return 'Every day at midnight'
  
  const segments: string[] = []
  
  // Time
  if (minute === '0' && hour !== '*') {
    if (hour.includes('-') || hour.includes(',') || hour.includes('/')) {
      segments.push(`At minute 0 past ${parseCronField(hour, 'hour')}`)
    } else {
      segments.push(`At ${hour.padStart(2, '0')}:00`)
    }
  } else if (minute !== '*' || hour !== '*') {
    if (minute.includes('/')) {
      segments.push(parseCronField(minute, 'minute'))
    } else if (minute !== '*') {
      segments.push(`At minute ${minute}`)
    }
    if (hour !== '*') {
      segments.push(parseCronField(hour, 'hour'))
    }
  }
  
  // Day of week
  if (dayOfWeek !== '*') {
    segments.push(parseCronField(dayOfWeek, 'weekday'))
  }
  
  // Day of month
  if (dayOfMonth !== '*') {
    segments.push(parseCronField(dayOfMonth, 'day'))
  }
  
  // Month
  if (month !== '*') {
    segments.push(parseCronField(month, 'month'))
  }
  
  return segments.join(', ') || 'Every minute'
}

function getNextRuns(cron: string, count: number = 5): Date[] {
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 5) return []
  
  const [minuteExpr, hourExpr, dayExpr, monthExpr, dowExpr] = parts
  const runs: Date[] = []
  const now = new Date()
  let current = new Date(now)
  current.setSeconds(0)
  current.setMilliseconds(0)
  
  const matchesField = (value: number, expr: string, max: number): boolean => {
    if (expr === '*') return true
    if (expr.includes('/')) {
      const step = parseInt(expr.split('/')[1])
      return value % step === 0
    }
    if (expr.includes('-')) {
      const [start, end] = expr.split('-').map(Number)
      return value >= start && value <= end
    }
    if (expr.includes(',')) {
      return expr.split(',').map(Number).includes(value)
    }
    return value === parseInt(expr)
  }
  
  // Simple forward iteration (limited for performance)
  for (let i = 0; i < 525600 && runs.length < count; i++) { // Max 1 year of minutes
    current = new Date(current.getTime() + 60000)
    
    const minute = current.getMinutes()
    const hour = current.getHours()
    const day = current.getDate()
    const month = current.getMonth() + 1
    const dow = current.getDay()
    
    if (
      matchesField(minute, minuteExpr, 59) &&
      matchesField(hour, hourExpr, 23) &&
      matchesField(day, dayExpr, 31) &&
      matchesField(month, monthExpr, 12) &&
      matchesField(dow, dowExpr, 6)
    ) {
      runs.push(new Date(current))
    }
  }
  
  return runs
}

// ===== MAIN COMPONENT =====
export default function CronGeneratorClient() {
  const [mode, setMode] = useState<'builder' | 'manual'>('builder')
  const [cronExpression, setCronExpression] = useState('0 9 * * 1-5')
  const [copied, setCopied] = useState(false)
  const [showPresets, setShowPresets] = useState(false)
  
  // Builder state
  const [minute, setMinute] = useState('0')
  const [hour, setHour] = useState('9')
  const [dayOfMonth, setDayOfMonth] = useState('*')
  const [month, setMonth] = useState('*')
  const [dayOfWeek, setDayOfWeek] = useState('1-5')
  
  // Build expression from builder state
  const builtExpression = useMemo(() => {
    return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`
  }, [minute, hour, dayOfMonth, month, dayOfWeek])
  
  // Current expression based on mode
  const currentExpression = mode === 'builder' ? builtExpression : cronExpression
  
  // Human readable
  const humanReadable = useMemo(() => cronToHuman(currentExpression), [currentExpression])
  
  // Next runs
  const nextRuns = useMemo(() => getNextRuns(currentExpression, 5), [currentExpression])
  
  // Copy
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentExpression)
      setCopied(true)
      if (navigator.vibrate) navigator.vibrate(30)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error('Copy failed:', e)
    }
  }, [currentExpression])
  
  // Load preset
  const loadPreset = useCallback((preset: typeof CRON_PRESETS[0]) => {
    const [m, h, dom, mon, dow] = preset.cron.split(' ')
    setMinute(m)
    setHour(h)
    setDayOfMonth(dom)
    setMonth(mon)
    setDayOfWeek(dow)
    setCronExpression(preset.cron)
    setShowPresets(false)
    if (navigator.vibrate) navigator.vibrate(30)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Privacy Badge */}
      <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
        <Lock className="w-4 h-4 text-green-400 flex-shrink-0" />
        <p className="text-green-400 text-xs">
          <span className="font-medium">100% Private</span> — All generation done locally in your browser
        </p>
      </div>

      {/* Result Display */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-400">Cron Expression</span>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm"
          >
            {copied ? <><Check className="w-4 h-4 text-green-400" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
          </button>
        </div>
        <div className="font-mono text-3xl text-amber-400 text-center py-4 bg-gray-800/50 rounded-xl">
          {currentExpression}
        </div>
        <div className="mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-400">{humanReadable}</p>
          </div>
        </div>
      </div>
      
      {/* Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-white/5 rounded-xl p-1 border border-white/10">
          <button
            onClick={() => setMode('builder')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              mode === 'builder' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Visual Builder
          </button>
          <button
              onClick={() => setMode('manual')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                mode === 'manual' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Manual Input
            </button>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Builder/Input Section */}
          <div className="space-y-4">
            {mode === 'builder' ? (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-4">
                <h3 className="font-medium text-gray-300">Schedule Builder</h3>
                
                {/* Minute */}
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Minute (0-59)</label>
                  <input
                    type="text"
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                    className="w-full bg-gray-800/50 rounded-lg border border-white/10 px-3 py-2 font-mono text-sm outline-none focus:border-amber-500/50"
                    placeholder="* or 0 or */5"
                  />
                </div>
                
                {/* Hour */}
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Hour (0-23)</label>
                  <input
                    type="text"
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    className="w-full bg-gray-800/50 rounded-lg border border-white/10 px-3 py-2 font-mono text-sm outline-none focus:border-amber-500/50"
                    placeholder="* or 9 or 9-17"
                  />
                </div>
                
                {/* Day of Month */}
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Day of Month (1-31)</label>
                  <input
                    type="text"
                    value={dayOfMonth}
                    onChange={(e) => setDayOfMonth(e.target.value)}
                    className="w-full bg-gray-800/50 rounded-lg border border-white/10 px-3 py-2 font-mono text-sm outline-none focus:border-amber-500/50"
                    placeholder="* or 1 or 1,15"
                  />
                </div>
                
                {/* Month */}
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Month (1-12)</label>
                  <input
                    type="text"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full bg-gray-800/50 rounded-lg border border-white/10 px-3 py-2 font-mono text-sm outline-none focus:border-amber-500/50"
                    placeholder="* or 1-6"
                  />
                </div>
                
                {/* Day of Week */}
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Day of Week (0=Sun, 6=Sat)</label>
                  <input
                    type="text"
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    className="w-full bg-gray-800/50 rounded-lg border border-white/10 px-3 py-2 font-mono text-sm outline-none focus:border-amber-500/50"
                    placeholder="* or 1-5 or 0,6"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <h3 className="font-medium text-gray-300 mb-4">Enter Cron Expression</h3>
                <input
                  type="text"
                  value={cronExpression}
                  onChange={(e) => setCronExpression(e.target.value)}
                  className="w-full bg-gray-800/50 rounded-lg border border-white/10 px-4 py-3 font-mono text-lg outline-none focus:border-amber-500/50"
                  placeholder="* * * * *"
                />
                <p className="mt-2 text-xs text-gray-500">Format: minute hour day month weekday</p>
              </div>
            )}
            
            {/* Presets */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
              <button
                onClick={() => setShowPresets(!showPresets)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <span className="font-medium">Common Presets</span>
                {showPresets ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {showPresets && (
                <div className="p-4 pt-0 grid gap-2">
                  {CRON_PRESETS.map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => loadPreset(preset)}
                      className="p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-left transition-colors"
                    >
                      <div className="font-medium text-sm">{preset.label}</div>
                      <code className="text-xs text-amber-400/70">{preset.cron}</code>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-4">
            {/* Next Runs */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Play className="w-5 h-5 text-green-400" />
                <h3 className="font-medium text-gray-300">Next 5 Runs</h3>
              </div>
              {nextRuns.length > 0 ? (
                <div className="space-y-2">
                  {nextRuns.map((date, i) => (
                    <div key={i} className="p-2 bg-gray-800/50 rounded-lg font-mono text-sm">
                      {date.toLocaleString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Invalid expression or no runs found</p>
              )}
            </div>
            
            {/* Syntax Guide */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="font-medium text-gray-300 mb-4">Syntax Guide</h3>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between"><span className="text-gray-400">*</span><span className="text-gray-300">Every value</span></div>
                <div className="flex justify-between"><span className="text-gray-400">*/5</span><span className="text-gray-300">Every 5 units</span></div>
                <div className="flex justify-between"><span className="text-gray-400">1-5</span><span className="text-gray-300">Range (1 to 5)</span></div>
                <div className="flex justify-between"><span className="text-gray-400">1,3,5</span><span className="text-gray-300">List of values</span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-xs text-gray-500">
                <code className="text-amber-400">┌───── minute (0-59)</code><br/>
                <code className="text-amber-400">│ ┌─── hour (0-23)</code><br/>
                <code className="text-amber-400">│ │ ┌─ day of month (1-31)</code><br/>
                <code className="text-amber-400">│ │ │ ┌ month (1-12)</code><br/>
                <code className="text-amber-400">│ │ │ │ ┌ day of week (0-6)</code><br/>
                <code className="text-amber-400">* * * * *</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
