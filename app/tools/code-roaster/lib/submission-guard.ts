const MAX_DAILY_ATTEMPTS = 3
const STORAGE_KEY = 'code_roaster_daily_count'

// Generate today's date key
function getTodayKey(): string {
  const now = new Date()
  // Use locale date string for consistency across timezones
  return now.toLocaleDateString()
}

// Check submission limit
export function checkSubmissionLimit(): boolean {
  if (typeof window === 'undefined') return true

  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const todayKey = getTodayKey()
    const todayCount = data[todayKey] || 0

    return todayCount < MAX_DAILY_ATTEMPTS
  } catch (error) {
    console.error('Error checking submission limit:', error)
    return true // Don't limit on error
  }
}

// Increment submission count
export function incrementSubmissionCount(): void {
  if (typeof window === 'undefined') return

  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const todayKey = getTodayKey()
    
    // Clean up old entries (keep only last 3 days)
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    
    Object.keys(data).forEach(key => {
      const keyDate = new Date(key)
      if (keyDate < threeDaysAgo) {
        delete data[key]
      }
    })

    // Increment today's count
    data[todayKey] = (data[todayKey] || 0) + 1
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error incrementing submission count:', error)
  }
}

// Get remaining attempts
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

// Validate input
export function validateInput(text: string): string | null {
  const trimmed = text.trim()
  
  // Check if empty or too short
  if (!trimmed || trimmed.length < 5) {
    return 'Please enter meaningful code (at least 5 characters)'
  }
  
  // Check if too long
  if (trimmed.length > 10000) {
    return 'Code is too long (max 10,000 characters)'
  }
  
  // Check for Japanese characters
  const japaneseRegex = /[\u3040-\u30FF\u4E00-\u9FFF]/
  if (japaneseRegex.test(trimmed)) {
    return 'Please enter code in English only'
  }
  
  // Check for CJK characters
  const cjkRegex = /[\u4E00-\u9FFF\uAC00-\uD7AF]/
  if (cjkRegex.test(trimmed)) {
    return 'Please enter code in English only'
  }
  
  return null
}