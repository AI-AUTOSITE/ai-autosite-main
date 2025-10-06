// app/tools/code-roaster/lib/submission-guard.ts
const MAX_DAILY_ATTEMPTS = 3
const STORAGE_KEY = 'code_roaster_daily_count'

function getTodayKey(): string {
  const now = new Date()
  return now.toLocaleDateString()
}

export function checkSubmissionLimit(): boolean {
  if (typeof window === 'undefined') return true

  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const todayKey = getTodayKey()
    const todayCount = data[todayKey] || 0

    return todayCount < MAX_DAILY_ATTEMPTS
  } catch (error) {
    console.error('Error checking submission limit:', error)
    return true
  }
}

export function incrementSubmissionCount(): void {
  if (typeof window === 'undefined') return

  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const todayKey = getTodayKey()

    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

    Object.keys(data).forEach((key) => {
      const keyDate = new Date(key)
      if (keyDate < threeDaysAgo) {
        delete data[key]
      }
    })

    data[todayKey] = (data[todayKey] || 0) + 1
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error incrementing submission count:', error)
  }
}

export function getRemainingAttempts(): number {
  if (typeof window === 'undefined') return MAX_DAILY_ATTEMPTS

  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const todayKey = getTodayKey()
    const todayCount = data[todayKey] || 0

    return Math.max(0, MAX_DAILY_ATTEMPTS - todayCount)
  } catch (error) {
    console.error('Error getting remaining attempts:', error)
    return MAX_DAILY_ATTEMPTS
  }
}

export function validateInput(text: string): string | null {
  const trimmed = text.trim()

  if (!trimmed || trimmed.length < 5) {
    return 'Please enter meaningful code (at least 5 characters)'
  }

  if (trimmed.length > 10000) {
    return 'Code is too long (max 10,000 characters)'
  }

  return null
}

// 言語検出機能
export function detectLanguage(code: string): string {
  const trimmed = code.trim().toLowerCase()

  // Python
  if (
    /^(def|class|import|from|print|if __name__|async def)/.test(trimmed) ||
    /:\s*$/.test(code.split('\n')[0])
  ) {
    return 'Python'
  }

  // JavaScript/TypeScript
  if (
    /^(const|let|var|function|import|export|async|class)/.test(trimmed) ||
    /=>/.test(code) ||
    /console\.log/.test(code)
  ) {
    return trimmed.includes('interface') ||
      trimmed.includes(': string') ||
      trimmed.includes(': number')
      ? 'TypeScript'
      : 'JavaScript'
  }

  // Java
  if (
    /^(public|private|protected|class|interface|import java)/.test(trimmed) ||
    /System\.out\.println/.test(code)
  ) {
    return 'Java'
  }

  // C/C++
  if (
    /^(#include|int main|void main|using namespace)/.test(trimmed) ||
    /printf|cout|cin/.test(code)
  ) {
    return code.includes('iostream') || code.includes('cout') ? 'C++' : 'C'
  }

  // Go
  if (/^(package|func|import|var|type|const)/.test(trimmed) || /fmt\.Print/.test(code)) {
    return 'Go'
  }

  // Rust
  if (/^(fn|use|let|struct|impl|pub|mod)/.test(trimmed) || /println!/.test(code)) {
    return 'Rust'
  }

  // Ruby
  if (/^(def|class|module|require|puts|end)/.test(trimmed)) {
    return 'Ruby'
  }

  // PHP
  if (/^<\?php/.test(trimmed) || /\$\w+/.test(code)) {
    return 'PHP'
  }

  // Swift
  if (/^(func|var|let|class|struct|import|print)/.test(trimmed) && /->/.test(code)) {
    return 'Swift'
  }

  // Kotlin
  if (/^(fun|val|var|class|interface|import)/.test(trimmed) && /\bfun\b/.test(code)) {
    return 'Kotlin'
  }

  // HTML
  if (/^<!DOCTYPE|^<html|^<\w+/.test(trimmed)) {
    return 'HTML'
  }

  // CSS
  if (/^[\w\-\.#]+\s*\{/.test(trimmed) || /^@media|^@import/.test(trimmed)) {
    return 'CSS'
  }

  // SQL
  if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)/i.test(trimmed)) {
    return 'SQL'
  }

  return 'Code'
}
