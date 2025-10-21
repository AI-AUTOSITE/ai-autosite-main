'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Settings, CheckCircle, Coffee, Book } from 'lucide-react'

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
    // シンプルなビープ音（Web Audio API）
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
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }

  const modeInfo = MODE_INFO[mode]
  const ModeIcon = modeInfo.icon

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 
                      rounded-full px-4 py-2 mb-4">
          <span className="text-2xl">🍅</span>
          <span className="text-red-300 text-sm font-medium">
            Pomodoro Technique - Proven Since 1980s
          </span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Pomodoro Timer
        </h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
          Stay focused with 25-minute work sessions. 
          <span className="text-cyan-400"> Boost productivity by 40%.</span>
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Main Timer - Takes more space */}
        <div className="lg:col-span-3">
          <div className={`bg-gradient-to-br ${modeInfo.bgColor} backdrop-blur-xl 
                        rounded-3xl border ${modeInfo.borderColor} p-8 sm:p-12`}>
            {/* Mode Indicator */}
            <div className="flex items-center justify-center gap-3 mb-8">
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
            <div className="flex items-center justify-center gap-4">
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
            <div className="grid grid-cols-3 gap-2 mt-8">
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
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Session Progress */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Progress
            </h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Completed Sessions</span>
                  <span className="text-white font-semibold">{completedSessions}</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: config.sessionsBeforeLongBreak }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-2 rounded-full transition-colors ${
                        i < completedSessions % config.sessionsBeforeLongBreak
                          ? 'bg-red-500'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {config.sessionsBeforeLongBreak - (completedSessions % config.sessionsBeforeLongBreak)} until long break
                </p>
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 animate-fade-in">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                Settings
              </h3>

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

                <button
                  onClick={() => setConfig(DEFAULT_CONFIG)}
                  disabled={isRunning}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 text-gray-400 
                           rounded-lg hover:text-white hover:bg-white/10 transition-all text-sm
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 
                        backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6">
            <h3 className="text-white font-semibold mb-3 text-base">
              💡 Quick Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>Eliminate distractions before starting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>Stand up and stretch during breaks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>Hydrate every break</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>Keep your phone in another room</span>
              </li>
            </ul>

            <button
              onClick={requestNotificationPermission}
              className="mt-4 w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white 
                       rounded-lg text-sm font-medium transition-colors"
            >
              Enable Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}