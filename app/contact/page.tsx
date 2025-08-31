import Link from 'next/link'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { Mail, Github, Twitter, MessageSquare, Bug, Lightbulb, Heart, Clock, MapPin } from 'lucide-react'

export default function ContactPage() {
  const contactReasons = [
    {
      icon: Bug,
      title: 'Report a Bug',
      description: 'Found something broken? Help us fix it quickly.',
      action: 'Report Bug',
      href: 'mailto:aiautosite@gmail.com?subject=Bug%20Report',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Lightbulb,
      title: 'Feature Request',
      description: 'Have an idea for a new tool or improvement?',
      action: 'Share Idea',
      href: 'mailto:aiautosite@gmail.com?subject=Feature%20Request',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: MessageSquare,
      title: 'General Feedback',
      description: 'Tell us what you think or ask questions.',
      action: 'Send Feedback',
      href: 'mailto:aiautosite@gmail.com?subject=Feedback',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Heart,
      title: 'Partnership',
      description: 'Interested in collaborating or integrating?',
      action: 'Get in Touch',
      href: 'mailto:aiautosite@gmail.com?subject=Partnership%20Inquiry',
      color: 'from-purple-500 to-pink-500'
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We're a small team that values every piece of feedback. 
              Your input helps us build better tools for everyone.
            </p>
          </div>

          {/* Quick Contact */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Quick Contact</h2>
            <p className="text-gray-400 mb-6">
              For the fastest response, email us directly:
            </p>
            <a 
              href="mailto:aiautosite@gmail.com"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all text-lg font-semibold"
            >
              <Mail className="w-5 h-5 mr-2" />
              aiautosite@gmail.com
            </a>
            <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>We typically respond within 24 hours</span>
            </div>
          </div>

          {/* Contact Reasons */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">What can we help you with?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {contactReasons.map((reason, index) => {
                const Icon = reason.icon
                return (
                  <div key={index} className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all group">
                    <div className={`w-12 h-12 bg-gradient-to-br ${reason.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{reason.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{reason.description}</p>
                    <a 
                      href={reason.href}
                      className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <span>{reason.action}</span>
                      <Mail className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Social & Community */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Follow Our Journey</h2>
              <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
                Stay updated with new tools, features, and behind-the-scenes development insights.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <a 
                  href="https://github.com/ai-autosite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all text-center group border border-white/10"
                >
                  <Github className="w-8 h-8 text-gray-300 group-hover:text-white mx-auto mb-3 transition-colors" />
                  <h3 className="text-white font-semibold mb-2">GitHub</h3>
                  <p className="text-gray-400 text-sm">View source code, report issues, contribute</p>
                </a>
                
                <a 
                  href="https://twitter.com/ai_autosite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all text-center group border border-white/10"
                >
                  <Twitter className="w-8 h-8 text-blue-400 group-hover:text-blue-300 mx-auto mb-3 transition-colors" />
                  <h3 className="text-white font-semibold mb-2">Twitter</h3>
                  <p className="text-gray-400 text-sm">Updates, tips, and development news</p>
                </a>
                
                <Link 
                  href="/blog"
                  className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all text-center group border border-white/10"
                >
                  <MessageSquare className="w-8 h-8 text-purple-400 group-hover:text-purple-300 mx-auto mb-3 transition-colors" />
                  <h3 className="text-white font-semibold mb-2">Blog</h3>
                  <p className="text-gray-400 text-sm">Tutorials, guides, and deep dives</p>
                </Link>
              </div>
            </div>
          </section>

          {/* Response Times */}
          <section className="mb-12">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">What to Expect</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Response Time</h3>
                  <p className="text-gray-400 text-sm">Usually within 24 hours, often much faster</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Personal Response</h3>
                  <p className="text-gray-400 text-sm">Real human replies, no automated responses</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Genuine Care</h3>
                  <p className="text-gray-400 text-sm">We read and consider every message carefully</p>
                </div>
              </div>
            </div>
          </section>

          {/* Office Info */}
          <section>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center">
              <MapPin className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-4">About Our Team</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                We're a small, remote team passionate about creating simple, powerful tools 
                that respect your privacy and time. Based globally, we work around the clock 
                to keep improving our services for users worldwide.
              </p>
              <div className="mt-6 text-sm text-gray-500">
                <p>🌍 Remote-first team • 🛡️ Privacy-focused • 🚀 User-driven development</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}