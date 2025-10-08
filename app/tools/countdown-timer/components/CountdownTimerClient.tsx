'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, Copy, Check } from 'lucide-react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

export default function CountdownTimerClient() {
  const [eventName, setEventName] = useState('New Year 2026')
  const [targetDate, setTargetDate] = useState('')
  const [targetTime, setTargetTime] = useState('00:00')
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Set default date to next new year
    const nextYear = new Date()
    nextYear.setFullYear(nextYear.getFullYear() + 1, 0, 1)
    setTargetDate(nextYear.toISOString().split('T')[0])
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && targetDate) {
      interval = setInterval(() => {
        const now = new Date().getTime()
        const target = new Date(`${targetDate}T${targetTime}`).getTime()
        const difference = target - now

        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            total: difference,
          })
        } else {
          setTimeLeft({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            total: 0,
          })
          setIsActive(false)
        }
      }, 100) // Update more frequently for smooth seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, targetDate, targetTime])

  const handleToggle = () => {
    if (targetDate) {
      setIsActive(!isActive)
    }
  }

  const copyShareLink = async () => {
    const baseUrl = window.location.origin + window.location.pathname
    const params = new URLSearchParams({
      event: eventName,
      date: targetDate,
      time: targetTime,
    })
    const shareUrl = `${baseUrl}?${params.toString()}`

    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0')
  }

  // Quick event presets
  const setPreset = (name: string, date: Date) => {
    setEventName(name)
    setTargetDate(date.toISOString().split('T')[0])
    setTargetTime('00:00')
    setIsActive(false)
  }

  const presets = [
    {
      name: 'New Year',
      date: new Date(new Date().getFullYear() + 1, 0, 1),
    },
    {
      name: 'Christmas',
      date: new Date(new Date().getFullYear(), 11, 25),
    },
    {
      name: 'Weekend',
      date: (() => {
        const d = new Date()
        d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7))
        return d
      })(),
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Main Card */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        {/* Quick Setup */}
        <div className="space-y-4 mb-6">
          {/* Event Name */}
          <div>
            <label className="text-white font-medium mb-2 block text-sm">Event Name</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Birthday, Launch Day, etc."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white 
                       placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors
                       hover:bg-white/15"
              autoFocus
            />
          </div>

          {/* Date and Time - Side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white font-medium mb-2 block text-sm">Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => {
                  setTargetDate(e.target.value)
                  setIsActive(false)
                }}
                className="w-full px-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm
                         focus:outline-none focus:border-cyan-400 transition-colors
                         hover:bg-white/15 [&::-webkit-calendar-picker-indicator]:filter 
                         [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </div>
            <div>
              <label className="text-white font-medium mb-2 block text-sm">Time</label>
              <input
                type="time"
                value={targetTime}
                onChange={(e) => {
                  setTargetTime(e.target.value)
                  setIsActive(false)
                }}
                className="w-full px-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm
                         focus:outline-none focus:border-cyan-400 transition-colors
                         hover:bg-white/15 [&::-webkit-calendar-picker-indicator]:filter 
                         [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex gap-2 items-center">
            <span className="text-xs text-gray-500">Quick:</span>
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setPreset(preset.name, preset.date)}
                className="text-xs px-3 py-2 bg-white/5 text-gray-400 rounded-full 
                         hover:bg-white/10 hover:text-white transition-all font-medium"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Start/Stop Button */}
        <button
          onClick={handleToggle}
          disabled={!targetDate}
          className={`w-full py-4 rounded-xl font-medium text-lg transition-all 
                    flex items-center justify-center gap-2 disabled:opacity-50 
                    disabled:cursor-not-allowed ${
                      isActive
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90'
                    }`}
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5" />
              <span>Stop</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Start</span>
            </>
          )}
        </button>

        {/* Live Countdown Display */}
        {timeLeft && isActive && (
          <div className="mt-6 pt-6 border-t border-white/10 animate-fadeIn">
            <h2 className="text-xl font-bold text-white text-center mb-4">{eventName}</h2>

            <div className="grid grid-cols-4 gap-2">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-cyan-400">
                  {formatNumber(timeLeft.days)}
                </div>
                <div className="text-gray-400 text-xs uppercase mt-1">Days</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-400">
                  {formatNumber(timeLeft.hours)}
                </div>
                <div className="text-gray-400 text-xs uppercase mt-1">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-indigo-400">
                  {formatNumber(timeLeft.minutes)}
                </div>
                <div className="text-gray-400 text-xs uppercase mt-1">Mins</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-purple-400">
                  {formatNumber(timeLeft.seconds)}
                </div>
                <div className="text-gray-400 text-xs uppercase mt-1">Secs</div>
              </div>
            </div>

            {timeLeft.total <= 0 && (
              <div className="text-center mt-4">
                <p className="text-xl font-bold text-green-400">🎉 Time's Up!</p>
              </div>
            )}

            {/* Share Button */}
            <button
              onClick={copyShareLink}
              className={`w-full mt-4 py-3 rounded-lg font-medium transition-all 
                        flex items-center justify-center gap-2 ${
                          copied
                            ? 'bg-green-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Minimal tip */}
      <p className="text-center text-xs text-gray-500 mt-4">
        💡 Share the link with friends • Works on any device
      </p>
    </div>
  )
}