'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // クライアント側でのみレンダリング（SSRミスマッチ防止）
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className="min-h-[44px] min-w-[44px] p-2 rounded-lg bg-white/5 border border-white/10"
        aria-label="Loading theme toggle"
      >
        <div className="w-5 h-5" />
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="min-h-[44px] min-w-[44px] p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-400 group-hover:rotate-90 transition-transform duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-purple-400 group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  )
}