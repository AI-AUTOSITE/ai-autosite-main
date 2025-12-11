'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Settings, Coffee, Book, Lock } from 'lucide-react'

type TimerMode = 'work' | 'shortBreak' | 'longBreak'

interface TimerConfig {
  workMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  sessionsBeforeLongBreak: number
}

const DEFAULT_CONFIG: TimerConfig = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4
}

const MODE_INFO = {
  work: {
    label: 'Focus Time',
    icon: Book,
    color: 'from-red-600 to-orange-600',
    bgColor: 'from-red-500/10 to-orange-500/10',
    borderColor: 'border-red-500/20',
    emoji: '🍅'
  },
  shortBreak: {
    label: 'Short Break',
    icon: Coffee,
    color: 'from-green-600 to-emerald-600',
    bgColor: 'from-green-500/10 to-emerald-500/10',
    borderColor: 'border-green-500/20',
    emoji: '☕'
  },
  longBreak: {
    label: 'Long Break',
    icon: Coffee,
    color: 'from-blue-600 to-cyan-600',
    bgColor: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-500/20',
    emoji: '🌴'
  }
}

export default function PomodoroTimerClient() {
  const [config, setConfig] = useState<TimerConfig>(DEFAULT_CONFIG)
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(config.workMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission>('default')

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // デバイス検出
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // 通知状態チェック
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationStatus(Notification.permission)
    }
  }, [])

  // タイマーロジック
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimerComplete()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  // モード変更時にタイマーリセット
  useEffect(() => {
    const minutes = mode === 'work' 
      ? config.workMinutes 
      : mode === 'shortBreak' 
        ? config.shortBreakMinutes 
        : config.longBreakMinutes
    
    setTimeLeft(minutes * 60)
    setIsRunning(false)
  }, [mode, config])

  const handleTimerComplete = () => {
    setIsRunning(false)
    playNotificationSound()

    if (mode === 'work') {
      const newCompletedSessions = completedSessions + 1
      setCompletedSessions(newCompletedSessions)

      // 長い休憩か短い休憩か判定
      if (newCompletedSessions % config.sessionsBeforeLongBreak === 0) {
        setMode('longBreak')
      } else {
        setMode('shortBreak')
      }
    } else {
      // 休憩終了 → 作業モードに戻る
      setMode('work')
    }

    // ブラウザ通知
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: mode === 'work' ? 'Time for a break!' : 'Time to focus!',
        icon: '/favicon.ico'
      })
    }
  }

  const playNotificationSound = () => {
    // シンプルなビープ音(Web Audio API)
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    const minutes = mode === 'work' 
      ? config.workMinutes 
      : mode === 'shortBreak' 
        ? config.shortBreakMinutes 
        : config.longBreakMinutes
    setTimeLeft(minutes * 60)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = (): number => {
    const totalSeconds = mode === 'work' 
      ? config.workMinutes * 60
      : mode === 'shortBreak' 
        ? config.shortBreakMinutes * 60
        : config.longBreakMinutes * 60
    return ((totalSeconds - timeLeft) / totalSeconds) * 100
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationStatus(permission)
      
      if (permission === 'granted') {
        new Notification('Pomodoro Timer', {
          body: 'Notifications enabled! You\'ll be notified when sessions end.',
          icon: '/favicon.ico'
        })
      }
    }
  }

  const getNotificationButtonText = () => {
    switch (notificationStatus) {
      case 'granted':
        return '✓ Notifications Enabled'
      case 'denied':
        return '✕ Notifications Blocked'
      default:
        return 'Enable Notifications'
    }
  }

  const getNotificationButtonStyle = () => {
    switch (notificationStatus) {
      case 'granted':
        return 'bg-green-600/20 border-green-500/30 text-green-400 cursor-default'
      case 'denied':
        return 'bg-red-600/20 border-red-500/30 text-red-400 cursor-not-allowed'
      default:
        return 'bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer'
    }
  }

  const modeInfo = MODE_INFO[mode]
  const ModeIcon = modeInfo.icon

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Privacy Badge */}
      <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-2">
        <Lock className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-green-300 font-medium">100% Private</p>
          <p className="text-green-400/70 text-xs mt-1">
            Session data stays in your browser • Resets on page reload • No tracking
          </p>
        </div>
      </div>

      {/* Main Timer Card */}
      <div className={`bg-gradient-to-br ${modeInfo.bgColor} backdrop-blur-xl 
                    rounded-3xl border ${modeInfo.borderColor} p-8 sm:p-12 mb-6`}>
        {/* Mode Indicator */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-4xl">{modeInfo.emoji}</span>
          <div>
            <h2 className="text-white font-semibold text-xl sm:text-2xl">
              {modeInfo.label}
            </h2>
            <p className="text-gray-400 text-sm">
              Session {completedSessions + 1}
            </p>
          </div>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-8">
          <div className={`text-7xl sm:text-8xl md:text-9xl font-bold bg-gradient-to-r ${modeInfo.color} 
                        bg-clip-text text-transparent mb-4`}>
            {formatTime(timeLeft)}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${modeInfo.color} transition-all duration-1000 ease-linear`}
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={toggleTimer}
            className={`px-8 py-4 bg-gradient-to-r ${modeInfo.color} text-white 
                     rounded-xl font-semibold hover:opacity-90 transition-all 
                     flex items-center gap-3 shadow-lg min-h-[56px] text-lg`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="px-6 py-4 bg-white/5 border border-white/10 text-white 
                     rounded-xl font-semibold hover:bg-white/10 transition-all 
                     flex items-center gap-2 min-h-[56px]"
          >
            <RotateCcw className="w-5 h-5" />
            {!isMobile && 'Reset'}
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-6 py-4 bg-white/5 border border-white/10 text-white 
                     rounded-xl font-semibold hover:bg-white/10 transition-all 
                     flex items-center gap-2 min-h-[56px]"
          >
            <Settings className="w-5 h-5" />
            {!isMobile && 'Settings'}
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setMode('work')}
            disabled={isRunning}
            className={`px-4 py-3 rounded-lg font-medium transition-all text-sm
                      ${mode === 'work' 
                        ? 'bg-red-600 text-white shadow-lg' 
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            🍅 Work
          </button>
          <button
            onClick={() => setMode('shortBreak')}
            disabled={isRunning}
            className={`px-4 py-3 rounded-lg font-medium transition-all text-sm
                      ${mode === 'shortBreak' 
                        ? 'bg-green-600 text-white shadow-lg' 
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            ☕ Short
          </button>
          <button
            onClick={() => setMode('longBreak')}
            disabled={isRunning}
            className={`px-4 py-3 rounded-lg font-medium transition-all text-sm
                      ${mode === 'longBreak' 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            🌴 Long
          </button>
        </div>
      </div>

      {/* Stats & Progress Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Session Progress */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4 text-base">
            📈 Session Progress
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Completed Today</span>
              <span className="text-white font-semibold">{completedSessions} sessions</span>
            </div>
            
            <div className="flex gap-1">
              {Array.from({ length: config.sessionsBeforeLongBreak }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                    i < completedSessions % config.sessionsBeforeLongBreak
                      ? 'bg-red-500 shadow-lg shadow-red-500/50'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              {config.sessionsBeforeLongBreak - (completedSessions % config.sessionsBeforeLongBreak) === config.sessionsBeforeLongBreak 
                ? 'Long break available! 🎉' 
                : `${config.sessionsBeforeLongBreak - (completedSessions % config.sessionsBeforeLongBreak)} sessions until long break`}
            </p>
          </div>
        </div>

        {/* Today's Stats */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 
                      backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
          <h3 className="text-white font-semibold mb-4 text-base">
            📊 Today's Stats
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-gray-400 text-xs mb-1">Total Sessions</p>
              <p className="text-white text-2xl font-bold">{completedSessions}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-gray-400 text-xs mb-1">Focus Time</p>
              <p className="text-white text-2xl font-bold">
                {Math.floor(completedSessions * config.workMinutes / 60)}h {(completedSessions * config.workMinutes) % 60}m
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel - Collapsible */}
      {showSettings && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 animate-fade-in">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            Settings
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Timer Settings */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Work Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={config.workMinutes}
                  onChange={(e) => setConfig({...config, workMinutes: Number(e.target.value)})}
                  disabled={isRunning}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                           text-white focus:outline-none focus:border-cyan-400 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Short Break (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={config.shortBreakMinutes}
                  onChange={(e) => setConfig({...config, shortBreakMinutes: Number(e.target.value)})}
                  disabled={isRunning}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                           text-white focus:outline-none focus:border-cyan-400 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Long Break (minutes)
                </label>
                <input
                  type="number"
                  min="10"
                  max="30"
                  value={config.longBreakMinutes}
                  onChange={(e) => setConfig({...config, longBreakMinutes: Number(e.target.value)})}
                  disabled={isRunning}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                           text-white focus:outline-none focus:border-cyan-400 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Sessions Before Long Break
                </label>
                <input
                  type="number"
                  min="2"
                  max="8"
                  value={config.sessionsBeforeLongBreak}
                  onChange={(e) => setConfig({...config, sessionsBeforeLongBreak: Number(e.target.value)})}
                  disabled={isRunning}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                           text-white focus:outline-none focus:border-cyan-400 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Notifications & Reset */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Notifications
                </label>
                <button
                  onClick={requestNotificationPermission}
                  disabled={notificationStatus !== 'default'}
                  className={`w-full px-4 py-3 border rounded-lg text-sm font-medium transition-all
                            ${getNotificationButtonStyle()}`}
                >
                  {getNotificationButtonText()}
                </button>
                {notificationStatus === 'denied' && (
                  <p className="text-xs text-gray-500 mt-2">
                    Please enable notifications in your browser settings
                  </p>
                )}
              </div>

              <button
                onClick={() => setConfig(DEFAULT_CONFIG)}
                disabled={isRunning}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-gray-400 
                         rounded-lg hover:text-white hover:bg-white/10 transition-all text-sm
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset to Default
              </button>

              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
                <p className="text-cyan-400 text-sm font-medium mb-2">💡 Pro Tips</p>
                <ul className="space-y-1 text-xs text-gray-300">
                  <li>• Close distracting apps before starting</li>
                  <li>• Stand and stretch during breaks</li>
                  <li>• Keep your phone in another room</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}