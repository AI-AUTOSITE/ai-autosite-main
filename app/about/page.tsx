// app/about/page.tsx
import Link from 'next/link'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SignalLogo from '@/components/icons/SignalLogo'
import {
  Shield,
  Zap,
  Heart,
  Code,
  Globe,
  Target,
  Sparkles,
  Mail,
  MapPin,
  ArrowRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About — Hidekazu Yamaoka & Signal Studio | AI AutoSite',
  description:
    'Signal is a one-person studio in Fukuoka, Japan, run by Hidekazu Yamaoka. Privacy-first iOS apps, Next.js tools, and software built without surveillance baked in.',
  alternates: {
    canonical: 'https://ai-autosite.com/about',
  },
}

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Privacy First',
      description:
        'I collect minimal data and never track or sell your information. Your content stays in your browser.',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Zap,
      title: 'Instant & Simple',
      description:
        'Tools that work immediately — no registration, no complex setup, no learning curve.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Heart,
      title: 'User-Centered',
      description:
        'Every feature is built based on real needs, not engagement metrics or monetization goals.',
      color: 'from-pink-500 to-red-500',
    },
    {
      icon: Code,
      title: 'Open & Transparent',
      description:
        'Most of the code is open source on GitHub under MIT. Transparency over black boxes.',
      color: 'from-green-500 to-emerald-500',
    },
  ]

  const stats = [
    { number: '77+', label: 'Free Tools', description: 'Across 9 categories, growing weekly' },
    { number: '4', label: 'iOS Apps', description: 'Shipped to the App Store' },
    { number: '0', label: 'Trackers', description: 'No analytics, no fingerprinting, ever' },
    { number: '100%', label: 'Open Source', description: 'Web tools available on GitHub' },
  ]

  const apps = [
    { name: 'Tuck Voice', url: 'https://apps.apple.com/app/id6760351425' },
    { name: 'DealKit', url: 'https://apps.apple.com/app/id6757729007' },
    { name: 'TimeSee', url: 'https://apps.apple.com/app/id6759831241' },
  ]

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
      </div>

      <Header />

      <main className="relative z-10 flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* HERO */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
              <SignalLogo size={80} colors={['#FFFFFF', '#E0E0E0', '#B0B0B0']} />
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Hi, I&rsquo;m Hidekazu.
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-6">
              I build software the way I wish more people would: privately, transparently, and
              without surveillance baked in.
            </p>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 flex-wrap">
              <span className="inline-flex items-center gap-1.5">
                <span>🇯🇵</span>
                <MapPin className="w-4 h-4" />
                Fukuoka, Japan
              </span>
              <span className="text-gray-700">·</span>
              <span>Solo developer</span>
              <span className="text-gray-700">·</span>
              <span>Since 2025</span>
            </div>
          </div>

          {/* STORY */}
          <section className="mb-16">
            <div className="bg-gradient-to-br from-gray-700/60 to-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-600/50 p-8 sm:p-10">
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-gray-200 leading-relaxed mb-4">
                  AI AutoSite started as a personal frustration: most modern web tools demand
                  sign-ups, push ads, and quietly send your data to third parties — even when none
                  of that has anything to do with the job they&rsquo;re supposed to do.
                </p>
                <p className="text-base text-gray-300 leading-relaxed mb-4">
                  So I started building the tools I wished existed. They run entirely in your
                  browser. They don&rsquo;t need an account. They don&rsquo;t track you. There are
                  77 of them now, with new ones added regularly, and the code is open source on
                  GitHub under the MIT license.
                </p>
                <p className="text-base text-gray-300 leading-relaxed mb-4">
                  Alongside the web tools, I ship native iOS apps under the same philosophy. Tuck
                  Voice transcribes your voice memos on-device with Whisper, no cloud involved.
                  DealKit is a CRM for creators with no analytics SDK in sight. TimeSee is a
                  visual timer designed for ADHD brains, with a real Apple Watch experience.
                </p>
                <p className="text-base text-gray-300 leading-relaxed">
                  The umbrella for all of this is{' '}
                  <span className="text-white font-semibold">Signal</span> — a one-person studio I
                  run from Fukuoka. The name is a reference to clarity and transparency, the same
                  values that shape how I build.
                </p>
              </div>
            </div>
          </section>

          {/* VALUES */}
          <section className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3">What Signal stands for</h2>
              <p className="text-gray-400">Four principles, applied to every tool and app I ship.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {values.map((value) => {
                const Icon = value.icon
                return (
                  <div
                    key={value.title}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-colors"
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-4`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* STATS */}
          <section className="mb-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="text-center bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
                >
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm font-medium text-cyan-400 mb-1">{stat.label}</div>
                  <div className="text-[11px] text-gray-500 leading-tight">{stat.description}</div>
                </div>
              ))}
            </div>
          </section>

          {/* HOW I BUILD */}
          <section className="mb-16">
            <div className="bg-gradient-to-br from-purple-500/5 to-cyan-500/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 sm:p-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">How I build</h2>
              </div>

              <div className="space-y-4 text-base text-gray-300 leading-relaxed">
                <p>
                  I&rsquo;m one person, but I ship at the pace of a small team. That&rsquo;s
                  possible because I work async, write everything down, and use modern AI-assisted
                  tooling the way professional software studios do in 2026.
                </p>
                <p>What that means in practice:</p>
                <ul className="space-y-3 pl-1">
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1 flex-shrink-0">→</span>
                    <span>
                      I take full responsibility for every line that ships. AI is a tool, not a
                      collaborator that gets its name on the commit.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1 flex-shrink-0">→</span>
                    <span>
                      User data — yours, mine, anyone&rsquo;s — never enters a third-party AI
                      training pipeline. The privacy promise is non-negotiable.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1 flex-shrink-0">→</span>
                    <span>
                      Decisions are documented as Architecture Decision Records, so the code
                      doesn&rsquo;t need me to explain it.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1 flex-shrink-0">→</span>
                    <span>
                      Deadlines are commitments, not estimates. If something is at risk, I say so
                      48 hours in advance, with a written plan — not a last-minute apology.
                    </span>
                  </li>
                </ul>
                <p className="text-gray-400 italic pt-2">
                  Honesty about how the work gets made is part of being privacy-first.
                </p>
              </div>
            </div>
          </section>

          {/* APPS */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-3">Other things I&rsquo;ve made</h2>
              <p className="text-gray-400">Native apps that follow the same playbook.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {apps.map((app) => (
                <a
                  key={app.name}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-5 py-4 transition-colors group"
                >
                  <span className="text-white font-medium">{app.name}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </a>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section>
            <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-8 text-center">
              <Target className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-3">Want to work with me?</h2>
              <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                Signal also takes on a small number of client projects each year — privacy-first
                iOS and Next.js work, on monthly retainers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Link
                  href="/hire"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  See how I work with clients
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/15 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  General contact
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
