'use client'

import { useState } from 'react'
import { Cake, Calendar, Gift } from 'lucide-react'

interface AgeResult {
  years: number
  months: number
  days: number
  daysUntilBirthday: number
  totalDays: number
}

export default function AgeCalculatorClient() {
  const [birthDate, setBirthDate] = useState('')
  const [age, setAge] = useState<AgeResult | null>(null)

  const calculateAge = (date: string) => {
    setBirthDate(date)
    if (!date) {
      setAge(null)
      return
    }

    const birth = new Date(date)
    const today = new Date()

    // Check if date is valid and not in future
    if (birth > today) {
      setAge(null)
      return
    }

    // Calculate age
    let years = today.getFullYear() - birth.getFullYear()
    let months = today.getMonth() - birth.getMonth()
    let days = today.getDate() - birth.getDate()

    if (days < 0) {
      months--
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
      days += lastMonth.getDate()
    }

    if (months < 0) {
      years--
      months += 12
    }

    // Calculate total days
    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))

    // Calculate days until next birthday
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1)
    }
    const daysUntilBirthday = Math.floor(
      (nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )

    setAge({
      years,
      months,
      days,
      daysUntilBirthday,
      totalDays,
    })
  }

  // Get current max date (today)
  const getMaxDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Date Input - Main Focus */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-purple-400" />
          <label className="text-white font-medium">Your Birthday</label>
        </div>

        <input
          type="date"
          value={birthDate}
          onChange={(e) => calculateAge(e.target.value)}
          max={getMaxDate()}
          min="1900-01-01"
          className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-base sm:text-lg 
                     focus:outline-none focus:border-purple-400 transition-colors
                     [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert
                     cursor-pointer hover:bg-white/10"
          placeholder="Select your birthday"
        />

        {birthDate && new Date(birthDate) > new Date() && (
          <p className="text-red-400 text-sm mt-3 flex items-center gap-1">
            <span>⚠️</span> Please select a past date
          </p>
        )}
      </div>

      {/* Results - Clean and Simple */}
      {age && (
        <div className="mt-6 space-y-4 animate-fadeIn">
          {/* Main Age */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Your Age</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight px-2">
                {age.years} years, {age.months} months, {age.days} days
              </p>
            </div>
          </div>

          {/* Quick Stats - 3 Key Numbers */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-3 sm:p-4 text-center">
              <p className="text-base sm:text-xl md:text-2xl font-bold text-white break-words leading-tight">
                {age.totalDays.toLocaleString()}
              </p>
              <p className="text-gray-400 text-xs mt-1">Days old</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-3 sm:p-4 text-center">
              <p className="text-base sm:text-xl md:text-2xl font-bold text-white break-words leading-tight">
                {(age.totalDays * 24).toLocaleString()}
              </p>
              <p className="text-gray-400 text-xs mt-1">Hours</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-3 sm:p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Gift className="w-4 h-4 text-pink-400" />
                <p className="text-base sm:text-xl md:text-2xl font-bold text-white">{age.daysUntilBirthday}</p>
              </div>
              <p className="text-gray-400 text-xs">To birthday</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Add fade in animation to tailwind.config.js:
// animation: {
//   fadeIn: 'fadeIn 0.3s ease-in-out',
// },
// keyframes: {
//   fadeIn: {
//     '0%': { opacity: '0', transform: 'translateY(10px)' },
//     '100%': { opacity: '1', transform: 'translateY(0)' },
//   },
// }