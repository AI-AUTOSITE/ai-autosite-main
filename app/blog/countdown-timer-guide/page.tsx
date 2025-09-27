import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Clock, Calendar, Bell, Target } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Countdown Timer - Track Important Events & Deadlines | AI AutoSite',
  description: 'Create countdown timers for events, deadlines, and special occasions. Free online countdown timer with customization options.',
  keywords: 'countdown timer, event timer, deadline tracker, countdown clock, days until calculator',
  openGraph: {
    title: 'Countdown Timer - Event Tracking Guide',
    description: 'Never miss important dates with countdown timers',
    type: 'article',
  },
}

export default function CountdownTimerGuidePage() {
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
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">
            Quick Tools
          </span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Countdown Timer Complete Guide
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Create countdown timers for events, deadlines, and special occasions. 
          Never miss an important date again.
        </p>
      </header>

      <section className="space-y-12">
        {/* Why Use Countdown Timers */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Why Use Countdown Timers?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Target className="w-8 h-8 text-cyan-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Stay Focused</h3>
              <p className="text-gray-400 text-sm">
                Visual reminder of approaching deadlines
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Bell className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Build Excitement</h3>
              <p className="text-gray-400 text-sm">
                Create anticipation for events
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Calendar className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Time Management</h3>
              <p className="text-gray-400 text-sm">
                Better planning and organization
              </p>
            </div>
          </div>
        </div>

        {/* Common Uses */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Popular Countdown Timer Uses</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="text-white pb-3">Category</th>
                  <th className="text-white pb-3">Examples</th>
                  <th className="text-white pb-3">Typical Duration</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3 text-cyan-400">Personal</td>
                  <td className="py-3">Birthdays, anniversaries</td>
                  <td className="py-3">Days to months</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-blue-400">Work</td>
                  <td className="py-3">Project deadlines, meetings</td>
                  <td className="py-3">Hours to weeks</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-green-400">Events</td>
                  <td className="py-3">Concerts, conferences</td>
                  <td className="py-3">Weeks to months</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-purple-400">Sales</td>
                  <td className="py-3">Limited offers, flash sales</td>
                  <td className="py-3">Minutes to days</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-orange-400">Holiday</td>
                  <td className="py-3">Christmas, New Year</td>
                  <td className="py-3">Months</td>
                </tr>
                <tr>
                  <td className="py-3 text-pink-400">Sports</td>
                  <td className="py-3">Game day, tournaments</td>
                  <td className="py-3">Days to weeks</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Timer Display Formats */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Timer Display Formats</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-4">
              <li className="border-b border-white/10 pb-3">
                <h3 className="text-white font-semibold mb-1">Full Format</h3>
                <p className="text-cyan-400 font-mono">125 Days 14 Hours 32 Minutes 45 Seconds</p>
              </li>
              <li className="border-b border-white/10 pb-3">
                <h3 className="text-white font-semibold mb-1">Short Format</h3>
                <p className="text-cyan-400 font-mono">125d 14h 32m 45s</p>
              </li>
              <li className="border-b border-white/10 pb-3">
                <h3 className="text-white font-semibold mb-1">Digital Clock</h3>
                <p className="text-cyan-400 font-mono">125:14:32:45</p>
              </li>
              <li>
                <h3 className="text-white font-semibold mb-1">Percentage</h3>
                <p className="text-cyan-400 font-mono">75% Complete (25% Remaining)</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Website Integration */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Add Timer to Your Website</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-300 mb-4">
              Basic JavaScript countdown timer example:
            </p>
            <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto">
              <code className="text-cyan-400 text-sm">{`// Set the target date
const targetDate = new Date("Dec 31, 2025 23:59:59").getTime();

// Update every second
const timer = setInterval(function() {
  const now = new Date().getTime();
  const distance = targetDate - now;
  
  // Calculate time units
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
  // Display result
  document.getElementById("timer").innerHTML = 
    days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
  
  // When countdown ends
  if (distance < 0) {
    clearInterval(timer);
    document.getElementById("timer").innerHTML = "EXPIRED";
  }
}, 1000);`}</code>
            </pre>
          </div>
        </div>

        {/* Psychology of Countdowns */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Psychology of Countdown Timers</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Urgency:</strong> Creates sense of limited time
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Anticipation:</strong> Builds excitement for upcoming events
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">Motivation:</strong> Visual progress toward goals
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <p className="text-gray-300">
                <strong className="text-white">FOMO:</strong> Fear of missing out drives action
              </p>
            </li>
          </ul>
        </div>

        {/* Best Practices */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Timer Best Practices</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  Set realistic deadlines to maintain credibility
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  Include timezone information for global events
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  Add notifications or alerts for important milestones
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  Make timers mobile-responsive for all devices
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Create Your Countdown Timer
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Free countdown timer with customizable display and sharing options.
        </p>
        <Link 
          href="/tools/countdown-timer" 
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Clock className="mr-2" size={20} />
          Create Countdown Timer
        </Link>
      </section>
    </article>
  )
}