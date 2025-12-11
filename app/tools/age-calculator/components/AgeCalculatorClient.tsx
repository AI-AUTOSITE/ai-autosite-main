'use client'

import { useState } from 'react'
import { Calendar, Gift, Lock, Clock, Sparkles, Heart, TrendingUp, Award } from 'lucide-react'

interface AgeResult {
  years: number
  months: number
  days: number
  daysUntilBirthday: number
  totalDays: number
  totalWeeks: number
  totalMonths: number
  totalHours: number
  totalMinutes: number
  totalSeconds: number
  weekday: string
  generation: { name: string; years: string; description: string }
  birthYearEvents: string[]
  nextBirthdayAge: number
  leapYearBirthdays: number
  heartbeats: number
  breaths: number
}

// ============================================
// Generations (Global)
// ============================================
const GENERATIONS = [
  { 
    name: 'Greatest Generation', 
    startYear: 1901, 
    endYear: 1927,
    description: 'Lived through the Great Depression and WWII'
  },
  { 
    name: 'Silent Generation', 
    startYear: 1928, 
    endYear: 1945,
    description: 'Grew up during WWII, known for conformity'
  },
  { 
    name: 'Baby Boomer', 
    startYear: 1946, 
    endYear: 1964,
    description: 'Post-war prosperity, cultural revolution'
  },
  { 
    name: 'Generation X', 
    startYear: 1965, 
    endYear: 1980,
    description: 'Latchkey kids, rise of technology'
  },
  { 
    name: 'Millennial (Gen Y)', 
    startYear: 1981, 
    endYear: 1996,
    description: 'Digital natives, came of age around Y2K'
  },
  { 
    name: 'Generation Z', 
    startYear: 1997, 
    endYear: 2012,
    description: 'True digital natives, social media era'
  },
  { 
    name: 'Generation Alpha', 
    startYear: 2013, 
    endYear: 2025,
    description: 'AI and automation era, post-pandemic'
  },
]

// ============================================
// Historical Events by Year
// ============================================
const HISTORICAL_EVENTS: { [year: number]: string[] } = {
  1950: ['Korean War begins', 'First credit card (Diners Club) introduced'],
  1955: ['Disneyland opens', 'Rosa Parks sparks Civil Rights Movement'],
  1960: ['JFK elected president', 'First weather satellite launched'],
  1965: ['Medicare established', 'First spacewalk by USA'],
  1969: ['Moon landing', 'Woodstock music festival', 'Internet (ARPANET) created'],
  1970: ['First Earth Day', 'Boeing 747 enters service'],
  1975: ['Vietnam War ends', 'Microsoft founded'],
  1976: ['Apple Computer founded', 'Viking 1 lands on Mars'],
  1977: ['Star Wars released', 'Apple II computer launched'],
  1980: ['CNN launches', 'John Lennon assassinated'],
  1981: ['MTV launches', 'First Space Shuttle flight', 'IBM PC introduced'],
  1983: ['Internet adopts TCP/IP', 'First mobile phones'],
  1984: ['Apple Macintosh introduced', 'First TED conference'],
  1985: ['Windows 1.0 released', 'Nintendo NES launched in USA'],
  1989: ['Berlin Wall falls', 'World Wide Web invented', 'Game Boy released'],
  1990: ['Hubble Space Telescope launched', 'German reunification'],
  1991: ['Soviet Union dissolves', 'First website goes live'],
  1994: ['Amazon founded', 'PlayStation released'],
  1995: ['Windows 95 released', 'eBay and Java launched'],
  1996: ['Google research begins', 'DVD introduced'],
  1997: ['Harry Potter published', 'Deep Blue beats chess champion'],
  1998: ['Google founded', 'iMac introduced'],
  1999: ['Euro currency launched', 'Y2K preparations'],
  2000: ['Y2K bug avoided', 'Human genome sequenced'],
  2001: ['9/11 attacks', 'Wikipedia launched', 'iPod introduced'],
  2004: ['Facebook launched', 'Mars rovers land', 'Gmail launched'],
  2005: ['YouTube launched', 'Hurricane Katrina'],
  2006: ['Twitter launched', 'Pluto reclassified'],
  2007: ['iPhone released', 'First Kindle'],
  2008: ['Global financial crisis', 'Obama elected', 'App Store launches'],
  2009: ['Bitcoin created', 'H1N1 pandemic'],
  2010: ['iPad launched', 'Instagram created', 'Deepwater Horizon oil spill'],
  2011: ['Osama bin Laden killed', 'Steve Jobs passes away'],
  2012: ['Curiosity rover lands on Mars', 'Higgs boson discovered'],
  2013: ['Edward Snowden revelations', 'Pope Francis elected'],
  2014: ['Ice Bucket Challenge', 'Amazon Echo introduced'],
  2015: ['Paris Climate Agreement', 'SpaceX lands rocket'],
  2016: ['Brexit vote', 'AlphaGo beats world champion'],
  2017: ['Bitcoin reaches $20,000', 'Me Too movement'],
  2018: ['GDPR enacted', 'Royal Wedding (Harry & Meghan)'],
  2019: ['First black hole image', 'COVID-19 emerges'],
  2020: ['COVID-19 pandemic', 'US election', 'SpaceX crewed flight'],
  2021: ['COVID vaccines rollout', 'James Webb telescope launches'],
  2022: ['Ukraine invasion', 'ChatGPT released', 'Queen Elizabeth II passes'],
  2023: ['GPT-4 released', 'Threads launched'],
  2024: ['AI revolution accelerates', 'Paris Olympics'],
  2025: ['AI agents become mainstream'],
}

// Weekday names
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function AgeCalculatorClient() {
  const [birthDate, setBirthDate] = useState('')
  const [age, setAge] = useState<AgeResult | null>(null)

  // Get Generation
  const getGeneration = (year: number) => {
    for (const gen of GENERATIONS) {
      if (year >= gen.startYear && year <= gen.endYear) {
        return { 
          name: gen.name, 
          years: `${gen.startYear}-${gen.endYear}`,
          description: gen.description
        }
      }
    }
    return { name: 'Unknown', years: '', description: '' }
  }

  // Get historical events for birth year
  const getBirthYearEvents = (year: number): string[] => {
    return HISTORICAL_EVENTS[year] || [`Year ${year} - A unique moment in history`]
  }

  // Count leap year birthdays
  const countLeapYearBirthdays = (birthYear: number, currentYear: number): number => {
    let count = 0
    for (let year = birthYear; year <= currentYear; year++) {
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        count++
      }
    }
    return count
  }

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

    // Calculate totals
    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
    const totalWeeks = Math.floor(totalDays / 7)
    const totalMonths = years * 12 + months
    const totalHours = totalDays * 24
    const totalMinutes = totalHours * 60
    const totalSeconds = totalMinutes * 60

    // Calculate days until next birthday
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
    if (nextBirthday <= today) {
      nextBirthday.setFullYear(today.getFullYear() + 1)
    }
    const daysUntilBirthday = Math.floor(
      (nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )

    // Get weekday
    const weekdayIndex = birth.getDay()
    const weekday = WEEKDAYS[weekdayIndex]

    // Get generation and events
    const generation = getGeneration(birth.getFullYear())
    const birthYearEvents = getBirthYearEvents(birth.getFullYear())
    const leapYearBirthdays = countLeapYearBirthdays(birth.getFullYear(), today.getFullYear())

    // Estimate heartbeats and breaths (average values)
    const heartbeats = Math.round(totalMinutes * 70) // ~70 bpm average
    const breaths = Math.round(totalMinutes * 15) // ~15 breaths/min average

    setAge({
      years,
      months,
      days,
      daysUntilBirthday,
      totalDays,
      totalWeeks,
      totalMonths,
      totalHours,
      totalMinutes,
      totalSeconds,
      weekday,
      generation,
      birthYearEvents,
      nextBirthdayAge: years + 1,
      leapYearBirthdays,
      heartbeats,
      breaths,
    })
  }

  // Get current max date (today)
  const getMaxDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B'
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    return num.toLocaleString()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Privacy Badge */}
      <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
        <Lock className="w-4 h-4 text-green-400 flex-shrink-0" />
        <p className="text-green-400 text-xs">
          <span className="font-medium">100% Private</span> — All calculations done locally in your browser
        </p>
      </div>

      {/* Date Input */}
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

      {/* Results */}
      {age && (
        <div className="mt-6 space-y-4 animate-fadeIn">
          {/* Main Age Display */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Your Age</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                {age.years} years, {age.months} months, {age.days} days
              </p>
            </div>
          </div>

          {/* Next Birthday Countdown */}
          <div className="bg-gradient-to-r from-pink-500/10 to-orange-500/10 backdrop-blur-xl rounded-xl border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-400" />
                <span className="text-white font-medium">Next Birthday</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-pink-400">{age.daysUntilBirthday}</span>
                <span className="text-gray-400 text-sm ml-1">days</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              You&apos;ll be turning <span className="text-white font-medium">{age.nextBirthdayAge}</span>! 🎂
            </p>
          </div>

          {/* Born On */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <p className="text-white">
                You were born on a <span className="font-bold text-blue-400">{age.weekday}</span>
              </p>
            </div>
          </div>

          {/* Generation */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Your Generation</span>
            </div>
            <p className="text-2xl font-bold text-yellow-400">{age.generation.name}</p>
            <p className="text-gray-400 text-sm mt-1">{age.generation.years}</p>
            <p className="text-gray-500 text-xs mt-2">{age.generation.description}</p>
          </div>

          {/* Historical Events */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-medium">The Year You Were Born</span>
            </div>
            <ul className="space-y-2">
              {age.birthYearEvents.map((event, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-cyan-400">•</span>
                  <span className="text-gray-300">{event}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Life Statistics */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Life Statistics</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-white">{formatNumber(age.totalMonths)}</p>
                <p className="text-gray-400 text-xs">Months</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-white">{formatNumber(age.totalWeeks)}</p>
                <p className="text-gray-400 text-xs">Weeks</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-white">{formatNumber(age.totalDays)}</p>
                <p className="text-gray-400 text-xs">Days</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-white">{formatNumber(age.totalHours)}</p>
                <p className="text-gray-400 text-xs">Hours</p>
              </div>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-white font-medium">Fun Estimates</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-red-400">{formatNumber(age.heartbeats)}</p>
                <p className="text-gray-400 text-xs">Heartbeats</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-blue-400">{formatNumber(age.breaths)}</p>
                <p className="text-gray-400 text-xs">Breaths</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-purple-400">{age.leapYearBirthdays}</p>
                <p className="text-gray-400 text-xs">Leap Years</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-green-400">{formatNumber(age.totalMinutes)}</p>
                <p className="text-gray-400 text-xs">Minutes</p>
              </div>
            </div>
            
            <p className="text-gray-500 text-xs mt-3 text-center">
              Based on average rates: ~70 heartbeats/min, ~15 breaths/min
            </p>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-4 p-4 bg-white/5 rounded-xl">
        <p className="text-xs text-gray-500 text-center">
          💡 All calculations are instant and private — nothing is stored or sent
        </p>
      </div>
    </div>
  )
}