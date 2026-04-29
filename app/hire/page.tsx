// app/hire/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SignalLogo from '@/components/icons/SignalLogo'
import {
  Mail,
  Shield,
  Clock,
  Code,
  Zap,
  CheckCircle2,
  Apple,
  Globe,
  Server,
  ArrowRight,
  Sparkles,
  Lock,
  FileCode,
  GitBranch,
  Calendar,
  Receipt,
  FileText,
  DoorOpen,
  Moon,
  MessageCircle,
  Sunrise,
  Coins,
  Rocket,
  Target,
  Workflow,
  UserCheck,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hire Hidekazu — Privacy-First Solo Developer | Signal Studio',
  description:
    'Async-only solo developer from Fukuoka, Japan. iOS, Next.js, and Cloudflare-native systems built without ads, without tracking. Monthly retainers from $2,500.',
  keywords:
    'hire ios developer, hire next.js developer, privacy-first developer, solo developer for hire, monthly retainer developer, async developer, swift developer japan',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-autosite.com/hire',
    siteName: 'Signal — by Hidekazu Yamaoka',
    title: 'Hire Hidekazu — Privacy-First Solo Developer',
    description:
      'Async-only solo developer from Fukuoka, Japan. iOS, Next.js, Cloudflare. Monthly retainers from $2,500. No tracking, no surveillance, no ads.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hire Hidekazu — Privacy-First Solo Developer',
    description: 'Async-only. iOS + Next.js + Cloudflare. Monthly retainers from $2,500.',
  },
  alternates: {
    canonical: 'https://ai-autosite.com/hire',
  },
}

const HIRE_EMAIL = 'hire@ai-autosite.com'
const EMAIL_SUBJECT = 'New Project Inquiry'
const EMAIL_BODY = `Hi Hidekazu,

A bit about my project:
• What I'm building:
• Current stack:
• Timeline:
• Budget range:
• Privacy / compliance needs (if any):

Looking forward to hearing from you.`

const mailtoLink = `mailto:${HIRE_EMAIL}?subject=${encodeURIComponent(
  EMAIL_SUBJECT
)}&body=${encodeURIComponent(EMAIL_BODY)}`

export default function HirePage() {
  const stack = [
    {
      icon: Apple,
      title: 'iOS / SwiftUI',
      description:
        'Native apps with Apple Watch, Live Activities, and StoreKit 2. 4 apps shipped to the App Store.',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
    },
    {
      icon: Globe,
      title: 'Next.js / TypeScript',
      description:
        'App Router, Tailwind, Vercel. The same stack that runs ai-autosite.com (77+ tools, monthly visitors).',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      icon: Server,
      title: 'Cloudflare / Supabase',
      description:
        'Workers for low-latency APIs, Supabase for auth and Postgres, RevenueCat for subscriptions.',
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
    },
  ]

  const principles = [
    {
      icon: Mail,
      title: 'Async-only',
      description:
        'Email, Loom, Linear. No standups, no calls. Senior-level work delivered in deep-focus blocks.',
    },
    {
      icon: Shield,
      title: 'Privacy by default',
      description:
        'No analytics SDKs, no fingerprinting, no IDFA. Your users\u2019 data stays where it belongs.',
    },
    {
      icon: Lock,
      title: 'Your code, your IP',
      description:
        'Full IP transfer on delivery. Your data and code never enter any AI training pipeline.',
    },
    {
      icon: GitBranch,
      title: 'Honest about tools',
      description:
        'I use modern AI-assisted tooling. I take full responsibility for every line that ships.',
    },
  ]

  // NEW: Why Japan section
  const whyJapan = [
    {
      icon: Sunrise,
      title: 'Your nights are my workdays',
      description:
        'When something breaks at 11 PM in San Francisco, I\u2019m already 16 hours ahead — on my morning coffee, ready to ship a fix before your team starts their day.',
    },
    {
      icon: CheckCircle2,
      title: 'Quiet reliability, by default',
      description:
        'Software culture here treats precision and durability as defaults, not features. Tests get written. Edge cases get handled. Documentation exists before it\u2019s needed.',
    },
    {
      icon: Coins,
      title: 'Favorable economics',
      description:
        'A strong dollar against the yen means you get senior-level work at honest USD rates without sacrificing quality, attention, or commitment.',
    },
  ]

  // NEW: Solo means fast
  const soloAdvantages = [
    {
      icon: Rocket,
      title: 'Decisions in hours, not days',
      description:
        'No kickoff meetings, no estimation rounds, no internal approvals. You email me on Monday morning, I\u2019m writing code by Monday afternoon.',
    },
    {
      icon: UserCheck,
      title: 'One person, end to end',
      description:
        'The person reading your inquiry, writing the code, and sending the invoice is the same person. No handoffs, no account managers, no "let me check with the team."',
    },
    {
      icon: Workflow,
      title: 'Pivots without paperwork',
      description:
        'Change your mind about a feature mid-sprint? Just tell me. There\u2019s no change-order process, no scope-creep meeting — I update the plan and keep moving.',
    },
  ]

  // NEW: The boring parts, done properly
  const boringParts = [
    {
      icon: MessageCircle,
      title: 'Replies within one business day',
      description:
        'Every email gets a real human reply, not an auto-responder. If the answer needs research, you get an acknowledgment first and the answer next.',
    },
    {
      icon: Calendar,
      title: 'Deadlines are commitments, not estimates',
      description:
        'If a deadline is at risk, you\u2019ll know at least 48 hours in advance — with a written explanation and a revised plan, not a last-minute apology.',
    },
    {
      icon: Receipt,
      title: 'Itemized invoices, monthly, on the 1st',
      description:
        'Every invoice lists hours, deliverables, and a brief change log. USD totals are locked at the previous month\u2019s exchange rate. No surprise charges, ever.',
    },
    {
      icon: FileText,
      title: 'Every change documented in writing',
      description:
        'Architecture Decision Records on every meaningful change. Loom walkthroughs on every release. Your future self (or future hire) will thank you.',
    },
    {
      icon: DoorOpen,
      title: 'Clean handoffs, even if you cancel',
      description:
        'Cancellation includes a written handoff document, credentials transfer, and 30 days of email-only support — included in the contract, not a paid extra.',
    },
    {
      icon: Moon,
      title: 'Quiet hours respected — yours and mine',
      description:
        'I don\u2019t fire Slack messages into your team\u2019s evening. P1 incidents are the only exception, and they get a phone-tree escalation, not a midnight ping.',
    },
  ]

  const packages = [
    {
      name: 'Care',
      price: 2500,
      tagline: 'Maintenance & small improvements',
      hours: '~15 hours / month',
      sla: 'First response within 24h on weekdays',
      ideal: 'Existing apps that need a steady hand',
      features: [
        'Bug fixes & dependency updates',
        'Small feature additions',
        'Monthly 30-min written review',
        'Email support',
      ],
      featured: false,
    },
    {
      name: 'Build',
      price: 5000,
      tagline: 'Active product growth',
      hours: '1 active request at a time',
      sla: 'First response within 6h on weekdays',
      ideal: 'Seed–Series A SaaS in growth mode',
      features: [
        'Async delivery on small tasks within 48h',
        'One mid-size feature sprint per month',
        'Bi-weekly Loom progress updates',
        'Architecture Decision Records (ADRs)',
      ],
      featured: true,
    },
    {
      name: 'Build Pro',
      price: 7500,
      tagline: 'Privacy-critical or parallel work',
      hours: '2 active requests at a time',
      sla: 'First response within 2h on weekdays',
      ideal: 'Privacy-sensitive SaaS, healthtech MVPs',
      features: [
        'GDPR / CCPA design reviews included',
        'Dedicated Linear workspace',
        'Overnight Japan-time coverage',
        'Detailed ADRs on every change',
      ],
      featured: false,
    },
    {
      name: 'Founding Engineer',
      price: 9500,
      tagline: 'Embedded engineer slot',
      hours: 'Reserved capacity',
      sla: 'Custom',
      ideal: 'Early-stage startups without a CTO',
      features: [
        'Up to one other client maximum',
        'Weekly written sync',
        'Roadmap & technical strategy input',
        'Full IP assignment to your company',
      ],
      featured: false,
    },
  ]

  const work = [
    {
      name: 'Tuck Voice',
      tagline: 'Voice memos that think for themselves',
      description:
        'Record, transcribe on-device with Whisper, and search every word — privately. Native iOS, no servers involved for transcription.',
      stack: ['SwiftUI', 'Whisper', 'On-device AI'],
      url: 'https://apps.apple.com/app/id6760351425',
      accent: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      name: 'DealKit',
      tagline: 'Deal management for creators',
      description:
        'CRM-style brand deal tracker for influencers. Shipped on iOS and Android in 9 days from design to App Store release.',
      stack: ['SwiftUI', 'Kotlin', 'Supabase'],
      url: 'https://apps.apple.com/app/id6757729007',
      accent: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      name: 'TimeSee',
      tagline: 'Visual timer for ADHD brains',
      description:
        'See your time. Drag once, feel it through haptics. Native iOS with Apple Watch companion and Live Activities.',
      stack: ['SwiftUI', 'WatchKit', 'Live Activities'],
      url: 'https://apps.apple.com/app/id6759831241',
      accent: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
    },
    {
      name: 'ai-autosite.com',
      tagline: '77+ free tools, zero tracking',
      description:
        'A growing library of privacy-first web tools running on Next.js, Tailwind, and Cloudflare. Open source under MIT.',
      stack: ['Next.js 14', 'TypeScript', 'Tailwind'],
      url: 'https://github.com/ai-autosite',
      accent: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
    },
  ]

  const faq = [
    {
      q: 'Why no calls?',
      a: 'Async work produces better software. Every decision is written down, every demo is recorded as a Loom you can replay, and you keep a permanent record of why things were built the way they were. It also means you get senior-level focus time instead of meeting time.',
    },
    {
      q: 'How does the time difference work?',
      a: 'I\u2019m in Fukuoka, Japan (JST, UTC+9). For US East Coast clients I\u2019m roughly 13–14 hours ahead, and for US West Coast I\u2019m 16–17 hours ahead. In practice this means your nights are my workdays — you wake up to overnight progress, and urgent issues can be handled while your team sleeps.',
    },
    {
      q: 'How do you use AI in your workflow?',
      a: 'I work with modern AI-assisted tooling — it\u2019s part of any professional software studio in 2026. What matters is that I take full responsibility for every line that ships, your code and data never enter any third-party training pipeline, and every change is reviewed, tested, and documented in an Architecture Decision Record.',
    },
    {
      q: 'Can I cancel a retainer?',
      a: 'Yes. Retainers are month-to-month with 30 days\u2019 notice. No long-term lock-in. Cancellation includes a written handoff document, credentials transfer, and 30 days of email-only support at no extra cost — written into the contract, not sold as an upsell.',
    },
    {
      q: 'What if I\u2019m not sure I need a full retainer?',
      a: 'Start with a Pilot Sprint: $3,500 for two weeks of focused work on one well-defined scope. If we work well together, we move into a retainer. If not, you keep the work and we part ways cleanly.',
    },
    {
      q: 'How do payments work?',
      a: 'Stripe invoices in USD, paid monthly in advance. Every invoice itemizes hours, deliverables, and a brief change log. USD totals are locked at the previous month\u2019s exchange rate, so the number you see is the number you pay. W-8BEN provided for US clients (no withholding under the US–Japan tax treaty).',
    },
    {
      q: 'Are there any hidden fees or setup costs?',
      a: 'No. The retainer price is the price. No onboarding fee, no tooling surcharge, no per-seat add-ons. If a project needs paid third-party services (e.g., RevenueCat, OpenAI API), those are billed at cost with receipts attached — never marked up.',
    },
    {
      q: 'Do you handle sensitive or regulated data?',
      a: 'I build privacy-first by default and have shipped apps that collect zero analytics. For HIPAA, GDPR, or SOC 2 environments I work within your compliance framework but I\u2019m not your compliance officer — final regulatory sign-off stays with your team or counsel.',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
      </div>

      <Header />

      <main className="relative z-10 flex-1">
        {/* HERO */}
        <section className="px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Signal brand mark */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <SignalLogo size={20} colors={['#FFFFFF', '#E0E0E0', '#B0B0B0']} />
              <span className="text-xs font-medium text-gray-300 tracking-wide">
                Signal — a one-person studio
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              I build software{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                without surveillance
              </span>{' '}
              baked in.
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-4 leading-relaxed">
              I&rsquo;m{' '}
              <span className="text-white font-semibold">Hidekazu Yamaoka</span>, a solo
              developer in Fukuoka, Japan. iOS, Next.js, and Cloudflare-native systems for
              founders who don&rsquo;t want to ship trackers along with their products.
            </p>

            <p className="text-sm text-gray-500 mb-2">
              🇯🇵 Fukuoka, Japan · Async-only · Email-first · Monthly retainers from $2,500
            </p>

            <p className="text-sm text-gray-400 italic mb-10">
              No project managers, no committees. Your request hits the keyboard the same day.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={mailtoLink}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all shadow-lg shadow-cyan-500/20"
              >
                <Mail className="w-5 h-5" />
                Email me about your project
              </a>
              <a
                href="#packages"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 transition-all"
              >
                See packages
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Trust strip */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { n: '4', l: 'iOS apps shipped' },
                { n: '77+', l: 'Open-source tools' },
                { n: '0', l: 'Trackers shipped' },
                { n: '🇯🇵', l: 'Working while you sleep' },
              ].map((s) => (
                <div
                  key={s.l}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-4 backdrop-blur-sm"
                >
                  <div className="text-2xl font-bold text-white">{s.n}</div>
                  <div className="text-[11px] text-gray-400 mt-1 leading-tight">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT I BUILD */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">What I build</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                A focused stack, used in production for years. No frameworks-of-the-month, no
                experimental features in your codebase.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stack.map((s) => {
                const Icon = s.icon
                return (
                  <div
                    key={s.title}
                    className={`rounded-2xl border ${s.border} ${s.bg} backdrop-blur-sm p-6`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${s.bg} ${s.border} border flex items-center justify-center mb-4`}
                    >
                      <Icon className={`w-6 h-6 ${s.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{s.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* WHY JAPAN — NEW */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
                <span className="text-base">🇯🇵</span>
                <span className="text-xs font-medium text-gray-300 tracking-wide">
                  Based in Fukuoka, Japan
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Why a Japan-based studio
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Three things that aren&rsquo;t obvious until you start working with someone 16
                time zones away.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {whyJapan.map((w) => {
                const Icon = w.icon
                return (
                  <div
                    key={w.title}
                    className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6"
                  >
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{w.title}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{w.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* SOLO MEANS FAST — NEW */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                <Rocket className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-medium text-purple-400 tracking-wide">
                  Solo means fast
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                One person, no overhead
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                The same thing that makes agencies expensive is what makes them slow: layers of
                people between you and the work. A studio of one removes the layers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {soloAdvantages.map((s) => {
                const Icon = s.icon
                return (
                  <div
                    key={s.title}
                    className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6"
                  >
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{s.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* HOW I WORK */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">How I work</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Four principles, applied consistently. They&rsquo;re what make a one-person studio
                possible.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {principles.map((p) => {
                const Icon = p.icon
                return (
                  <div
                    key={p.title}
                    className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 flex gap-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                      <p className="text-sm text-gray-300 leading-relaxed">{p.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* PACKAGES */}
        <section id="packages" className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Monthly retainers</h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-2">
                Month-to-month. 30-day notice to cancel. No long-term lock-in.
              </p>
              <p className="text-sm text-gray-500">
                You&rsquo;re not buying time — you&rsquo;re reserving capacity in a studio of one.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {packages.map((p) => (
                <div
                  key={p.name}
                  className={`rounded-2xl border p-6 backdrop-blur-sm relative flex flex-col ${
                    p.featured
                      ? 'border-cyan-500/40 bg-gradient-to-br from-cyan-500/10 to-purple-500/5 shadow-lg shadow-cyan-500/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  {p.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-[10px] font-bold uppercase tracking-wider">
                      Most popular
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white">{p.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{p.tagline}</p>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-white">${p.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-400 ml-1">/mo</span>
                  </div>

                  <div className="space-y-2 mb-5 text-xs">
                    <div className="flex items-start gap-2 text-gray-300">
                      <Clock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-400" />
                      <span>{p.hours}</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-300">
                      <Zap className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-400" />
                      <span>{p.sla}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-5 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-green-400" />
                        <span className="leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-[11px] text-gray-500 mb-3 leading-snug">
                      <span className="text-gray-400 font-medium">Ideal for:</span> {p.ideal}
                    </p>
                    <a
                      href={mailtoLink}
                      className={`block text-center text-xs font-semibold py-2.5 rounded-lg transition-all ${
                        p.featured
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:opacity-90'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      Email me
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400">
                Not sure yet?{' '}
                <span className="text-white font-medium">Pilot Sprint</span> —{' '}
                <span className="text-white font-medium">$3,500</span> for 2 weeks of focused work
                on one scoped problem.
              </p>
            </div>
          </div>
        </section>

        {/* THE BORING PARTS — NEW */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                The boring parts, done properly
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Most software relationships break down on the unglamorous stuff: invoices, status
                updates, deadline communication, handoffs. These are written into the contract,
                not handled on a best-effort basis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {boringParts.map((b) => {
                const Icon = b.icon
                return (
                  <div
                    key={b.title}
                    className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 flex gap-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-1.5">{b.title}</h3>
                      <p className="text-sm text-gray-300 leading-relaxed">{b.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* SELECTED WORK */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Selected work</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Products I&rsquo;ve designed, built, and shipped under my own studio. They&rsquo;re
                what your retainer would look like in practice.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {work.map((w) => (
                <a
                  key={w.name}
                  href={w.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block rounded-2xl border ${w.border} ${w.bg} backdrop-blur-sm p-6 hover:scale-[1.01] transition-transform`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">{w.name}</h3>
                      <p className={`text-xs font-medium ${w.accent}`}>{w.tagline}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">{w.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {w.stack.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-gray-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* AI TRANSPARENCY SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <FileCode className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-white">A note on AI in my workflow</h2>
              </div>
              <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
                <p>
                  I work with modern AI-assisted tooling. In 2026, that&rsquo;s the same as saying
                  I use a code editor with autocomplete — it&rsquo;s how professional software gets
                  built today.
                </p>
                <p>What matters more is what I commit to:</p>
                <ul className="space-y-2 pl-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-400" />
                    <span>
                      I take full responsibility for every line that ships, including correctness,
                      security, and IP.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-400" />
                    <span>
                      Your code, configurations, and business data never enter any third-party AI
                      training pipeline.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-400" />
                    <span>
                      Every meaningful decision is documented in an Architecture Decision Record so
                      you can audit anything later.
                    </span>
                  </li>
                </ul>
                <p className="pt-2 text-gray-400 italic">
                  Honesty about tools is part of the privacy-first deal.
                  <br />
                  Doing the boring parts properly is the rest of it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">FAQ</h2>
            </div>

            <div className="space-y-3">
              {faq.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
                >
                  <summary className="px-5 py-4 cursor-pointer text-white font-medium text-sm sm:text-base flex items-center justify-between gap-3 hover:bg-white/5 transition-colors">
                    <span>{item.q}</span>
                    <span className="text-cyan-400 text-xl font-light flex-shrink-0 group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-gray-300 leading-relaxed">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-medium text-cyan-400">
                Currently accepting 2 new clients
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Email me about your project</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              The fastest way to start. Tell me what you&rsquo;re building, your timeline, and your
              budget range. I&rsquo;ll reply within one business day (Japan time).
            </p>

            <a
              href={mailtoLink}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all shadow-lg shadow-cyan-500/20 mb-4"
            >
              <Mail className="w-5 h-5" />
              {HIRE_EMAIL}
            </a>

            <p className="text-xs text-gray-500">
              All inquiries are read personally. No CRM, no auto-responder, no marketing list.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
