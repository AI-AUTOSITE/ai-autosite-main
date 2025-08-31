import Link from 'next/link'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { Shield, Zap, Heart, Users, Code, Globe, Target, Sparkles } from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'We collect minimal data and never track or sell your information. Your content stays in your browser.',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Zap,
      title: 'Instant & Simple',
      description: 'Tools that work immediately without registration, complex setup, or learning curves.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Heart,
      title: 'User-Centered',
      description: 'Every feature is built based on real user needs, not metrics or monetization goals.',
      color: 'from-pink-500 to-red-500'
    },
    {
      icon: Code,
      title: 'Open & Transparent',
      description: 'Much of our code is open source, and we believe in transparency over black boxes.',
      color: 'from-green-500 to-emerald-500'
    }
  ]

  const stats = [
    { number: '6', label: 'Tools Available', description: 'And growing based on user needs' },
    { number: '10k+', label: 'Monthly Users', description: 'Developers and creatives worldwide' },
    { number: '0', label: 'Data Breaches', description: 'Hard to breach what you don\'t store' },
    { number: '100%', label: 'Open Source', description: 'Core tools available on GitHub' }
  ]

  const team = [
    {
      name: 'AI-Powered Development',
      role: 'Core Architecture',
      description: 'Leveraging AI for efficient, high-quality code generation and optimization.',
      avatar: '🤖'
    },
    {
      name: 'Community Feedback',
      role: 'Product Direction',
      description: 'User requests and feedback drive our development roadmap and priorities.',
      avatar: '👥'
    },
    {
      name: 'Privacy-First Design',
      role: 'Security & Ethics',
      description: 'Every feature is designed with user privacy and data minimization in mind.',
      avatar: '🛡️'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col">
      {/* Background animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <Header />

      <main className="relative z-10 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-6">About AI-AutoSite</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              We believe the internet should be filled with tools that respect your privacy, 
              work instantly, and solve real problems without unnecessary complexity.
            </p>
          </div>

          {/* Mission Statement */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <div className="text-center">
                <Target className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-6">Our Mission</h2>
                <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
                  We're committed to solving the complexity issues of modern web tools that often frustrate users. 
                  By combining AI technology with user-centered design, we create tools that enable everyone 
                  to achieve their goals effortlessly, regardless of technical expertise or background.
                </p>
              </div>
            </div>
          </section>

          {/* Core Values */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">What We Stand For</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div key={index} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                    <div className={`w-12 h-12 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Stats */}
          <section className="mb-16">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">Impact by the Numbers</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-2">
                      {stat.number}
                    </div>
                    <div className="text-white font-semibold mb-1">{stat.label}</div>
                    <div className="text-gray-400 text-sm">{stat.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How We're Different */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">How We're Different</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-4">❌ What We Don't Do</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Track your behavior or build user profiles</li>
                  <li>• Require lengthy registrations or verifications</li>
                  <li>• Store your sensitive files or content</li>
                  <li>• Show ads or sell your data to third parties</li>
                  <li>• Add features just because competitors have them</li>
                  <li>• Hide functionality behind paywalls unnecessarily</li>
                </ul>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-4">✅ What We Do</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Build tools that work instantly in your browser</li>
                  <li>• Process data locally whenever possible</li>
                  <li>• Listen to user feedback and build what's needed</li>
                  <li>• Keep interfaces simple and intuitive</li>
                  <li>• Open-source our core tools for transparency</li>
                  <li>• Provide generous free tiers with real value</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Team Philosophy */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Approach</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {team.map((member, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 text-center">
                  <div className="text-4xl mb-4">{member.avatar}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{member.name}</h3>
                  <div className="text-cyan-400 text-sm mb-3">{member.role}</div>
                  <p className="text-gray-300 text-sm">{member.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Technology Stack */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Built with Modern Tech</h2>
              <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
                We use cutting-edge technology to deliver fast, reliable tools while maintaining 
                our commitment to privacy and simplicity.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">AI-Powered</h3>
                  <p className="text-gray-400 text-sm">Leveraging AI for intelligent analysis and recommendations</p>
                </div>
                <div className="text-center">
                  <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Edge Computing</h3>
                  <p className="text-gray-400 text-sm">Processing data in your browser for speed and privacy</p>
                </div>
                <div className="text-center">
                  <Globe className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Global CDN</h3>
                  <p className="text-gray-400 text-sm">Fast loading times worldwide with edge distribution</p>
                </div>
              </div>
            </div>
          </section>

          {/* Future Vision */}
          <section className="mb-16">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Looking Ahead</h2>
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-gray-300 leading-relaxed mb-6">
                  We envision a web where powerful tools are accessible to everyone, where privacy is the default, 
                  and where technology serves users rather than exploiting them. Our goal is to prove that 
                  sustainable, ethical software can compete with and surpass traditional approaches.
                </p>
                <p className="text-gray-400">
                  Every tool we build brings us closer to this vision. Join us on this journey.
                </p>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-6">Want to Learn More?</h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                We're always happy to discuss our approach, answer questions, or hear your ideas 
                for making the web a better place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
                >
                  <span>Get in Touch</span>
                </Link>
                <Link 
                  href="/blog"
                  className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  <span>Read Our Blog</span>
                </Link>
                <a 
                  href="https://github.com/ai-autosite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  <span>View on GitHub</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}