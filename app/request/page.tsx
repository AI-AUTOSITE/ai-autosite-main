import Link from 'next/link'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { Lightbulb, Code, Zap, Users, Clock, Star, ArrowRight, CheckCircle } from 'lucide-react'

export default function RequestToolPage() {
  const popularRequests = [
    {
      icon: '📊',
      title: 'Data Visualizer',
      description: 'Create charts and graphs from CSV/JSON data',
      votes: 47,
      status: 'considering'
    },
    {
      icon: '🎨',
      title: 'Logo Generator',
      description: 'AI-powered logo creation and customization',
      votes: 35,
      status: 'considering'
    },
    {
      icon: '📝',
      title: 'Markdown Editor',
      description: 'Real-time markdown editing with preview',
      votes: 28,
      status: 'considering'
    },
    {
      icon: '🔐',
      title: 'Password Generator',
      description: 'Secure password generation with custom rules',
      votes: 22,
      status: 'considering'
    }
  ]

  const toolCategories = [
    {
      icon: Code,
      name: 'Developer Tools',
      description: 'Code analysis, formatting, conversion',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Zap,
      name: 'Productivity',
      description: 'Document processing, automation',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: '🎨',
      name: 'Creative',
      description: 'Design, media processing, generators',
      color: 'from-pink-500 to-purple-600'
    },
    {
      icon: '🛡️',
      name: 'Privacy & Security',
      description: 'Data protection, encryption, anonymization',
      color: 'from-cyan-500 to-blue-600'
    }
  ]

  const process = [
    {
      step: 1,
      title: 'Submit Your Idea',
      description: 'Tell us about the tool you need and how it would help you'
    },
    {
      step: 2,
      title: 'Community Feedback',
      description: 'Other users can vote and add suggestions to your request'
    },
    {
      step: 3,
      title: 'Development Review',
      description: 'We evaluate feasibility and alignment with our philosophy'
    },
    {
      step: 4,
      title: 'Build & Launch',
      description: 'Popular, feasible tools get added to our roadmap'
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
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Request a Tool</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Have an idea for a tool that would make your workflow better? 
              We build based on real user needs and feedback.
            </p>
          </div>

          {/* Quick Request CTA */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Got an Idea? Tell Us!</h2>
            <p className="text-gray-400 mb-6">
              The best tools come from real problems that need solving. 
              Share your idea and help us prioritize what to build next.
            </p>
            <a 
              href="mailto:aiautosite@gmail.com?subject=Tool%20Request%20-%20[Your%20Tool%20Name]&body=Hi!%20I%20would%20love%20to%20see%20a%20tool%20that%3A%0A%0A%5BDescribe%20what%20the%20tool%20should%20do%5D%0A%0AWhy%20I%20need%20this%3A%0A%5BExplain%20your%20use%20case%5D%0A%0AHow%20often%20would%20you%20use%20it%3A%0A%5BDaily%2FWeekly%2FMonthly%5D%0A%0AThanks!"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all text-lg font-semibold"
            >
              <Lightbulb className="w-5 h-5 mr-2" />
              Submit Tool Request
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>

          {/* Popular Requests */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Most Requested Tools</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {popularRequests.map((request, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{request.icon}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{request.title}</h3>
                        <p className="text-gray-400 text-sm">{request.description}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-cyan-400">{request.votes}</div>
                      <div className="text-xs text-gray-500">votes</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">
                      Under Consideration
                    </span>
                    <a 
                      href={`mailto:aiautosite@gmail.com?subject=Vote%20for%20${request.title}&body=I%20would%20like%20to%20vote%20for%20the%20${request.title}%20tool!`}
                      className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                    >
                      +1 This Request
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tool Categories */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">What Kind of Tool Do You Need?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {toolCategories.map((category, index) => {
                const Icon = category.icon
                return (
                  <a 
                    key={index}
                    href={`mailto:aiautosite@gmail.com?subject=Tool%20Request%20-%20${category.name}&body=I%20have%20an%20idea%20for%20a%20${category.name}%20tool%3A%0A%0A%5BDescribe%20your%20idea%20here%5D`}
                    className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all group text-center"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      {typeof Icon === 'string' ? (
                        <span className="text-2xl">{Icon}</span>
                      ) : (
                        <Icon className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{category.description}</p>
                  </a>
                )
              })}
            </div>
          </section>

          {/* Process */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">How Tool Requests Work</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {process.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                  {index < process.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-gray-600 mx-auto mt-4 hidden md:block" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* What Makes a Good Request */}
          <section className="mb-12">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">What Makes a Good Tool Request?</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-4">✅ Great Requests Include:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start text-gray-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                      Clear problem description and use case
                    </li>
                    <li className="flex items-start text-gray-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                      How often you'd use the tool
                    </li>
                    <li className="flex items-start text-gray-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                      Why existing tools don't work for you
                    </li>
                    <li className="flex items-start text-gray-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                      Specific features you need most
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-4">🎯 We Prioritize Tools That:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start text-gray-300 text-sm">
                      <Star className="w-4 h-4 text-cyan-400 mt-0.5 mr-2 flex-shrink-0" />
                      Solve common, recurring problems
                    </li>
                    <li className="flex items-start text-gray-300 text-sm">
                      <Star className="w-4 h-4 text-cyan-400 mt-0.5 mr-2 flex-shrink-0" />
                      Work entirely in the browser
                    </li>
                    <li className="flex items-start text-gray-300 text-sm">
                      <Star className="w-4 h-4 text-cyan-400 mt-0.5 mr-2 flex-shrink-0" />
                      Don't require data uploads
                    </li>
                    <li className="flex items-start text-gray-300 text-sm">
                      <Star className="w-4 h-4 text-cyan-400 mt-0.5 mr-2 flex-shrink-0" />
                      Align with our privacy-first philosophy
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline Expectations */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Timeline Expectations</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Clock className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Simple Tools</h3>
                  <p className="text-gray-400 text-sm">1-2 weeks for basic utilities and converters</p>
                </div>
                <div className="text-center">
                  <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Complex Tools</h3>
                  <p className="text-gray-400 text-sm">1-2 months for advanced analysis or AI features</p>
                </div>
                <div className="text-center">
                  <Clock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Major Features</h3>
                  <p className="text-gray-400 text-sm">2-6 months for comprehensive platforms</p>
                </div>
              </div>
              <p className="text-center text-gray-500 text-sm mt-6">
                Timelines vary based on complexity and team capacity. We always prioritize quality over speed.
              </p>
            </div>
          </section>

          {/* Final CTA */}
          <section>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Ready to Share Your Idea?</h2>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Every tool we build started as a user request. Your idea could be the next one 
                that helps thousands of people work more efficiently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:aiautosite@gmail.com?subject=Tool%20Request%20-%20[Your%20Tool%20Name]&body=Hi!%20I%20would%20love%20to%20see%20a%20tool%20that%3A%0A%0A%5BDescribe%20what%20the%20tool%20should%20do%5D%0A%0AWhy%20I%20need%20this%3A%0A%5BExplain%20your%20use%20case%5D%0A%0AHow%20often%20would%20you%20use%20it%3A%0A%5BDaily%2FWeekly%2FMonthly%5D%0A%0AThanks!"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
                >
                  <span>Submit Request</span>
                </a>
                <Link 
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  <span>General Contact</span>
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