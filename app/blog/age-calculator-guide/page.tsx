import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Calendar, Cake, Clock, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Age Calculator Online - Calculate Exact Age in Years, Months, Days | AI AutoSite',
  description:
    "Calculate your exact age with our free age calculator. Find out how many days you've lived, zodiac sign, and days until your next birthday.",
  keywords:
    'age calculator, birthday calculator, how old am i, calculate age, zodiac sign calculator, days lived calculator',
  openGraph: {
    title: 'Age Calculator - Find Your Exact Age',
    description: 'Calculate your age in years, months, days, hours, and minutes',
    type: 'article',
  },
}

export default function AgeCalculatorGuidePage() {
  const publishDate = '2025-01-20'
  const author = 'AI AutoSite Team'
  const readTime = '3 min read'

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/blog"
        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-8 group"
      >
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
        Back to Blog
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">Quick Tools</span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Age Calculator Complete Guide
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Calculate your exact age in years, months, days, hours, and minutes. Find out interesting
          facts about your birth date.
        </p>
      </header>

      <section className="space-y-12">
        {/* Why Calculate Age */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Why Use an Age Calculator?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Calendar className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Official Documents</h3>
              <p className="text-gray-400 text-sm">Exact age for applications and forms</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Cake className="w-8 h-8 text-pink-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Birthday Planning</h3>
              <p className="text-gray-400 text-sm">Days until your next birthday</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Star className="w-8 h-8 text-yellow-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Fun Facts</h3>
              <p className="text-gray-400 text-sm">Zodiac signs and life statistics</p>
            </div>
          </div>
        </div>

        {/* What You Can Calculate */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">What You Can Calculate</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">📅</span>
                <p className="text-gray-300">
                  <strong className="text-white">Exact Age:</strong> Years, months, and days since
                  birth
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">⏰</span>
                <p className="text-gray-300">
                  <strong className="text-white">Total Time:</strong> Days, hours, minutes you've
                  lived
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">🎂</span>
                <p className="text-gray-300">
                  <strong className="text-white">Next Birthday:</strong> Countdown to your special
                  day
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">⭐</span>
                <p className="text-gray-300">
                  <strong className="text-white">Zodiac Signs:</strong> Western and Chinese zodiac
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">📊</span>
                <p className="text-gray-300">
                  <strong className="text-white">Life Milestones:</strong> Important age markers
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Age Milestones */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Important Age Milestones</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="text-white pb-3">Age</th>
                  <th className="text-white pb-3">Milestone</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3 text-cyan-400">16</td>
                  <td className="py-3">Driving permit (US)</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-cyan-400">18</td>
                  <td className="py-3">Legal adult in most countries</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-cyan-400">21</td>
                  <td className="py-3">Full legal age (US)</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-cyan-400">25</td>
                  <td className="py-3">Car rental without fees</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-cyan-400">65</td>
                  <td className="py-3">Retirement age (varies)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Fun Facts */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Fun Age Facts</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">🎯</span>
                <p className="text-gray-300">You celebrate about 10,000 days when you turn 27</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">🎯</span>
                <p className="text-gray-300">At age 31, you've lived about 1 billion seconds</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">🎯</span>
                <p className="text-gray-300">Your heart beats about 42 million times per year</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">🎯</span>
                <p className="text-gray-300">
                  People born on Feb 29 celebrate birthdays every 4 years
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">Calculate Your Age Now</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Free age calculator with zodiac signs, life statistics, and birthday countdown.
        </p>
        <Link
          href="/tools/age-calculator"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Calendar className="mr-2" size={20} />
          Try Age Calculator
        </Link>
      </section>
    </article>
  )
}
