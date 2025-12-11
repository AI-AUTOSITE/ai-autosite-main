'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Play, Pause, Copy, Check, Bell, BellOff, Volume2, VolumeX, QrCode, X, Maximize2, Minimize2 } from 'lucide-react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
  percentage: number
}

// ============================================
// QR Code Generator (Simple SVG-based)
// ============================================
function generateQRCodeSVG(text: string, size: number = 150): string {
  // Simple QR-like pattern for demo (real implementation would use qrcode library)
  // For production, consider: npm install qrcode
  const encoded = encodeURIComponent(text)
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`
}

// ============================================
// Progress Ring Component
// ============================================
function ProgressRing({ percentage, size = 200 }: { percentage: number; size?: number }) {
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#progressGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-300"
      />
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// ============================================
// Main Component
// ============================================
export default function CountdownTimerClient() {
  // Basic state
  const [eventName, setEventName] = useState('New Year 2026')
  const [targetDate, setTargetDate] = useState('')
  const [targetTime, setTargetTime] = useState('00:00')
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [copied, setCopied] = useState(false)
  
  // Enhanced features state
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showQR, setShowQR] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hasNotified, setHasNotified] = useState(false)
  
  // Refs for accurate timing
  const endTimeRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize
  useEffect(() => {
    // Set default date to next new year
    const nextYear = new Date()
    nextYear.setFullYear(nextYear.getFullYear() + 1, 0, 1)
    setTargetDate(nextYear.toISOString().split('T')[0])
    
    // Check notification permission
    if (typeof Notification !== 'undefined') {
      setNotificationPermission(Notification.permission)
    }
    
    // Create audio element for alarm
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQsAHIbG7t+FJwAAIMbk7bFyFwAAPa/c4qRlFAAAOpTH2adoFgAAR4K43aNkFgAARWqpz5lcEgAAU1qeyYlTEAAAbEaWuXZKCgAAhjGPs2pBAgAAkByFqmE3AAAAmQd8oVgvAAAAnABzl1AoAAAAmgBvj0ghAAAAlQBriEUcAAAAjwBngjobAAAAigBle0MXAAAAhABkdTwTAAAAfQBjbzYQAAAAdwBiaTINAAAAcQBhYzALAAAAbABhXi0JAAAAaABgWSoHAAAAZABeVSYFAAAAYQBdUSQEAAAAXgBcTSIDAAAAXABbSR8CAAAAWgBaSBwBAAAAWABZRhoBAAAAVgBYRBcAAAAAVQBXQhUAAAAAVABXQRQAAAAAUgBWPxIAAAAAUQBVPhEAAAAAUABUPREAAAAAUABTPBAAAAAATwBSOwwAAAAATgBSOgsAAAAATgBROQoAAAAATQBQOAkAAAAATQBPNwgAAAAATABPNgcAAAAASgBONQYAAAAASgBNNAUAAAAASQBNMwQAAAAASQBMMgQAAAAASQBLMQMAAAAASwBKMAMAAAAASwBJLwIAAAAASgBILgEAAAAASgBILQEAAAAASgBHLAEAAAAASgBGKwAAAAAASgBGKgAAAAAASgBFKQAAAAAASgBEKAAAAAAASgBDJwAAAAAASgBDJgAAAAAASgBCJQAAAAAASgBBJAAAAAAASgBBIwAAAAAASgBAIgAAAAAASgA/IQAAAAAASgA/IAAAAAAASgA+HwAAAAAASgA9HgAAAAAASgA9HQAAAAAASgA8HAAAAAAASgA7GwAAAAAASgA7GgAAAAAASgA6GQAAAAAASgA5GAA=')
  }, [])

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') {
      alert('Your browser does not support notifications')
      return
    }
    
    const permission = await Notification.requestPermission()
    setNotificationPermission(permission)
    if (permission === 'granted') {
      setNotificationsEnabled(true)
    }
  }

  // Toggle notifications
  const toggleNotifications = () => {
    if (notificationPermission !== 'granted') {
      requestNotificationPermission()
    } else {
      setNotificationsEnabled(!notificationsEnabled)
    }
  }

  // Send notification
  const sendNotification = useCallback(() => {
    if (notificationsEnabled && notificationPermission === 'granted' && !hasNotified) {
      new Notification(`⏰ ${eventName}`, {
        body: "Time's up!",
        icon: '/favicon.ico',
        tag: 'countdown-complete',
      })
      setHasNotified(true)
    }
  }, [notificationsEnabled, notificationPermission, eventName, hasNotified])

  // Play sound
  const playSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {})
    }
  }, [soundEnabled])

  // Handle visibility change for accurate background timing
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isActive && endTimeRef.current) {
        // Recalculate time immediately when tab becomes visible
        const now = Date.now()
        const difference = endTimeRef.current - now
        
        if (difference > 0 && startTimeRef.current) {
          const totalDuration = endTimeRef.current - startTimeRef.current
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            total: difference,
            percentage: Math.max(0, (difference / totalDuration) * 100),
          })
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isActive])

  // Main countdown effect using absolute time
  useEffect(() => {
    let animationFrame: number | null = null

    const updateCountdown = () => {
      if (!isActive || !endTimeRef.current || !startTimeRef.current) return

      const now = Date.now()
      const difference = endTimeRef.current - now
      const totalDuration = endTimeRef.current - startTimeRef.current

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          total: difference,
          percentage: Math.max(0, (difference / totalDuration) * 100),
        })
        animationFrame = requestAnimationFrame(updateCountdown)
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0,
          percentage: 0,
        })
        setIsActive(false)
        sendNotification()
        playSound()
      }
    }

    if (isActive) {
      animationFrame = requestAnimationFrame(updateCountdown)
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [isActive, sendNotification, playSound])

  // Start countdown
  const handleStart = () => {
    if (!targetDate) return
    
    const now = Date.now()
    const target = new Date(`${targetDate}T${targetTime}`).getTime()
    
    if (target <= now) {
      alert('Please select a future date and time')
      return
    }
    
    startTimeRef.current = now
    endTimeRef.current = target
    setHasNotified(false)
    setIsActive(true)
  }

  // Stop countdown
  const handleStop = () => {
    setIsActive(false)
    endTimeRef.current = null
    startTimeRef.current = null
  }

  // Quick timer presets (countdown from now)
  const setQuickTimer = (minutes: number, name: string) => {
    const now = new Date()
    const target = new Date(now.getTime() + minutes * 60 * 1000)
    
    setEventName(name)
    setTargetDate(target.toISOString().split('T')[0])
    setTargetTime(target.toTimeString().slice(0, 5))
    
    // Auto-start
    startTimeRef.current = now.getTime()
    endTimeRef.current = target.getTime()
    setHasNotified(false)
    setIsActive(true)
  }

  // Copy share link
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

  // Get share URL
  const getShareUrl = () => {
    const baseUrl = window.location.origin + window.location.pathname
    const params = new URLSearchParams({
      event: eventName,
      date: targetDate,
      time: targetTime,
    })
    return `${baseUrl}?${params.toString()}`
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatNumber = (num: number) => num.toString().padStart(2, '0')

  // Event presets
  const eventPresets = [
    { name: 'New Year', date: new Date(new Date().getFullYear() + 1, 0, 1) },
    { name: 'Christmas', date: new Date(new Date().getFullYear(), 11, 25) },
    { name: 'Weekend', date: (() => { const d = new Date(); d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7)); return d })() },
  ]

  // Quick timer presets
  const quickTimers = [
    { minutes: 5, name: '5 min timer' },
    { minutes: 10, name: '10 min timer' },
    { minutes: 15, name: '15 min timer' },
    { minutes: 30, name: '30 min timer' },
    { minutes: 60, name: '1 hour timer' },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Main Card */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        
        {/* Quick Timers */}
        <div className="mb-6">
          <label className="text-gray-400 text-xs mb-2 block">Quick Timer</label>
          <div className="flex flex-wrap gap-2">
            {quickTimers.map((timer) => (
              <button
                key={timer.minutes}
                onClick={() => setQuickTimer(timer.minutes, timer.name)}
                className="px-3 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 
                         text-cyan-300 rounded-lg text-sm font-medium
                         hover:from-cyan-500/30 hover:to-blue-500/30 transition-all"
              >
                {timer.minutes < 60 ? `${timer.minutes}m` : `${timer.minutes / 60}h`}
              </button>
            ))}
          </div>
        </div>

        {/* Event Setup */}
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
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white font-medium mb-2 block text-sm">Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => { setTargetDate(e.target.value); setIsActive(false) }}
                className="w-full px-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm
                         focus:outline-none focus:border-cyan-400 transition-colors
                         hover:bg-white/15 [&::-webkit-calendar-picker-indicator]:filter 
                         [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
            <div>
              <label className="text-white font-medium mb-2 block text-sm">Time</label>
              <input
                type="time"
                value={targetTime}
                onChange={(e) => { setTargetTime(e.target.value); setIsActive(false) }}
                className="w-full px-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm
                         focus:outline-none focus:border-cyan-400 transition-colors
                         hover:bg-white/15 [&::-webkit-calendar-picker-indicator]:filter 
                         [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>

          {/* Event Presets */}
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-xs text-gray-500">Events:</span>
            {eventPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  setEventName(preset.name)
                  setTargetDate(preset.date.toISOString().split('T')[0])
                  setTargetTime('00:00')
                  setIsActive(false)
                }}
                className="text-xs px-3 py-2 bg-white/5 text-gray-400 rounded-full 
                         hover:bg-white/10 hover:text-white transition-all font-medium"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Row */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={toggleNotifications}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              notificationsEnabled 
                ? 'bg-cyan-500/20 text-cyan-300' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
            title={notificationPermission === 'denied' ? 'Notifications blocked' : 'Enable notifications'}
          >
            {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            <span className="hidden sm:inline">{notificationsEnabled ? 'Notify On' : 'Notify Off'}</span>
          </button>
          
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              soundEnabled 
                ? 'bg-purple-500/20 text-purple-300' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
          </button>
        </div>

        {/* Start/Stop Button */}
        <button
          onClick={isActive ? handleStop : handleStart}
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
              <span>Start Countdown</span>
            </>
          )}
        </button>

        {/* Live Countdown Display */}
        {timeLeft && isActive && (
          <div className="mt-6 pt-6 border-t border-white/10 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">{eventName}</h2>
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Progress Ring with Time Display */}
            <div className="relative flex justify-center mb-6">
              <ProgressRing percentage={timeLeft.percentage} size={200} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  {timeLeft.days > 0 && (
                    <div className="text-3xl font-bold text-white">{timeLeft.days}d</div>
                  )}
                  <div className="text-2xl font-bold text-white">
                    {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Time Display */}
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center bg-white/5 rounded-xl p-3">
                <div className="text-2xl sm:text-3xl font-bold text-cyan-400">
                  {formatNumber(timeLeft.days)}
                </div>
                <div className="text-gray-400 text-xs uppercase mt-1">Days</div>
              </div>
              <div className="text-center bg-white/5 rounded-xl p-3">
                <div className="text-2xl sm:text-3xl font-bold text-blue-400">
                  {formatNumber(timeLeft.hours)}
                </div>
                <div className="text-gray-400 text-xs uppercase mt-1">Hours</div>
              </div>
              <div className="text-center bg-white/5 rounded-xl p-3">
                <div className="text-2xl sm:text-3xl font-bold text-indigo-400">
                  {formatNumber(timeLeft.minutes)}
                </div>
                <div className="text-gray-400 text-xs uppercase mt-1">Mins</div>
              </div>
              <div className="text-center bg-white/5 rounded-xl p-3">
                <div className="text-2xl sm:text-3xl font-bold text-purple-400">
                  {formatNumber(timeLeft.seconds)}
                </div>
                <div className="text-gray-400 text-xs uppercase mt-1">Secs</div>
              </div>
            </div>

            {/* Time's Up Message */}
            {timeLeft.total <= 0 && (
              <div className="text-center mt-4 p-4 bg-green-500/20 rounded-xl">
                <p className="text-2xl font-bold text-green-400">🎉 Time&apos;s Up!</p>
              </div>
            )}

            {/* Share Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={copyShareLink}
                className={`flex-1 py-3 rounded-lg font-medium transition-all 
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
              
              <button
                onClick={() => setShowQR(true)}
                className="py-3 px-4 bg-white/5 text-gray-400 rounded-lg 
                         hover:bg-white/10 hover:text-white transition-all"
              >
                <QrCode className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowQR(false)}>
          <div className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold">Scan to Share</h3>
              <button onClick={() => setShowQR(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-white p-4 rounded-xl flex justify-center">
              <img 
                src={generateQRCodeSVG(getShareUrl(), 200)} 
                alt="QR Code"
                className="w-48 h-48"
              />
            </div>
            <p className="text-gray-400 text-sm text-center mt-4">
              Scan with your phone to open this countdown
            </p>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-4 p-4 bg-white/5 rounded-xl">
        <p className="text-xs text-gray-500 text-center">
          💡 Enable notifications to get alerted when time&apos;s up • Share via QR code for mobile
        </p>
      </div>
    </div>
  )
}