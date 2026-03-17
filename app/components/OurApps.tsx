// app/components/OurApps.tsx
'use client'

import { useState } from 'react'

const apps = [
  {
    name: 'Tuck Voice',
    tagline: 'Voice memos that think for themselves',
    description: 'Record, transcribe on-device with Whisper AI, and search every word — privately.',
    emoji: '🎙️',
    gradient: 'from-emerald-500/20 to-emerald-600/5',
    borderColor: 'border-emerald-500/20',
    accentColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-400',
    badges: ['Free', 'On-Device AI', 'iOS'],
    url: 'https://apps.apple.com/app/id6760351425',
    status: 'live',
    platform: 'ios',
  },
  {
    name: 'DealKit',
    tagline: 'Deal management for creators',
    description: 'Track brand deals, manage contacts, and stay organized. CRM built for influencers.',
    emoji: '💜',
    gradient: 'from-purple-500/20 to-purple-600/5',
    borderColor: 'border-purple-500/20',
    accentColor: 'text-purple-400',
    badgeBg: 'bg-purple-500/10',
    badgeText: 'text-purple-400',
    badges: ['Free', 'No Ads', 'iOS & Android'],
    url: 'https://apps.apple.com/app/id6757729007',
    status: 'live',
    platform: 'both',
  },
  {
    name: 'TimeSee',
    tagline: 'See your time. Beat time blindness.',
    description: 'A visual timer designed for ADHD brains. Set time in one drag, feel it through haptics.',
    emoji: '⏱️',
    gradient: 'from-orange-500/20 to-orange-600/5',
    borderColor: 'border-orange-500/20',
    accentColor: 'text-orange-400',
    badgeBg: 'bg-orange-500/10',
    badgeText: 'text-orange-400',
    badges: ['Free', 'Apple Watch', 'iOS'],
    url: 'https://apps.apple.com/app/id6759831241',
    status: 'live',
    platform: 'ios',
  },
  {
    name: 'DropAlert',
    tagline: 'App Store price tracker',
    description: 'Get notified when apps drop in price or go free. Smart deal scoring and price history.',
    emoji: '⚡',
    gradient: 'from-amber-500/20 to-amber-600/5',
    borderColor: 'border-amber-500/20',
    accentColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-400',
    badges: ['Freemium', 'Notifications', 'iOS'],
    url: null,
    status: 'coming',
    platform: 'ios',
  },
  {
    name: 'Unrent',
    tagline: 'Search all streaming services in one place',
    description: 'Search Netflix, Prime Video, Disney+ and more — without creating accounts on each service.',
    emoji: '🎬',
    gradient: 'from-blue-500/20 to-blue-600/5',
    borderColor: 'border-blue-500/20',
    accentColor: 'text-blue-400',
    badgeBg: 'bg-blue-500/10',
    badgeText: 'text-blue-400',
    badges: ['Free', 'No Account', 'iOS'],
    url: null,
    status: 'coming',
    platform: 'ios',
  },
]

function AppleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  )
}

export default function OurApps() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-medium text-cyan-400">From the same team</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Our Mobile Apps
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Privacy-first native apps — same philosophy as our web tools. 
            No tracking, no ads, no data collection.
          </p>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps.map((app, i) => (
            <div
              key={app.name}
              className={`relative group rounded-2xl border ${app.borderColor} bg-gradient-to-br ${app.gradient} backdrop-blur-sm p-6 transition-all duration-300 ${
                hoveredIndex === i ? 'scale-[1.02] shadow-lg shadow-black/20' : ''
              } ${app.status === 'coming' ? 'opacity-80' : ''}`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Coming Soon Badge */}
              {app.status === 'coming' && (
                <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                  Coming Soon
                </div>
              )}

              {/* App Header */}
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">{app.emoji}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">{app.name}</h3>
                  <p className={`text-xs font-medium ${app.accentColor}`}>{app.tagline}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                {app.description}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {app.badges.map((badge) => (
                  <span
                    key={badge}
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${app.badgeBg} ${app.badgeText}`}
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* CTA */}
              {app.status === 'live' && app.url ? (
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors"
                >
                  <AppleIcon />
                  App Store
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 text-sm font-medium text-white/40 px-4 py-2 rounded-xl bg-white/5">
                  <AppleIcon />
                  Under Review
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
