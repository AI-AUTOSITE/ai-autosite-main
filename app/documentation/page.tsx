import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  Book,
  Code,
  Zap,
  Shield,
  ChevronRight,
  ExternalLink,
  PlayCircle,
  FileText,
} from 'lucide-react'

export default function DocumentationPage() {
  const tools = [
    {
      name: 'Tech Stack Analyzer',
      description: 'Compare frameworks and get AI-powered recommendations',
      href: '/tools/tech-stack-analyzer',
      status: 'live',
      features: [
        'Framework comparison matrix',
        'AI-powered recommendations',
        'Performance metrics analysis',
        'Learning curve assessment',
      ],
    },
    {
      name: 'Code Dependency Visualizer',
      description: 'Analyze project structure and file dependencies',
      href: '/tools/code-reader',
      status: 'live',
      features: [
        'Upload ZIP files or connect GitHub',
        'Interactive dependency tree',
        'File relationship mapping',
        'Project structure analysis',
      ],
    },
    {
      name: 'BlurTap',
      description: 'Mask sensitive information in images instantly',
      href: '/tools/blurtap',
      status: 'live',
      features: [
        'One-click sensitive data masking',
        'Customizable blur intensity',
        'Multiple mask shapes',
        'Instant download',
      ],
    },
  ]

  const guides = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of using our tools effectively',
      icon: PlayCircle,
      items: [
        'No account needed for basic features',
        'All tools work in your browser',
        'Your data stays private and local',
        'Export results anytime',
      ],
    },
    {
      title: 'Privacy & Security',
      description: 'Understand how we protect your information',
      icon: Shield,
      items: [
        'Minimal data collection',
        'No tracking or analytics',
        'Client-side processing',
        'Optional cloud integration',
      ],
    },
    {
      title: 'Best Practices',
      description: 'Tips for getting the most out of our tools',
      icon: Zap,
      items: [
        'Use specific, detailed inputs',
        'Check results with your context',
        'Combine multiple tools for workflows',
        'Save important results locally',
      ],
    },
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
              <Book className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Documentation</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to know about using our tools effectively and securely.
            </p>
          </div>

          {/* Quick Start Guide */}
          <section className="mb-12">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <PlayCircle className="w-6 h-6 mr-3 text-green-400" />
                Quick Start Guide
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {guides.map((guide, index) => {
                  const Icon = guide.icon
                  return (
                    <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <Icon className="w-8 h-8 text-cyan-400 mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">{guide.title}</h3>
                      <p className="text-gray-400 text-sm mb-4">{guide.description}</p>
                      <ul className="space-y-1">
                        {guide.items.map((item, i) => (
                          <li key={i} className="text-gray-300 text-sm flex items-start">
                            <span className="w-2 h-2 bg-cyan-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Tool Documentation */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Code className="w-6 h-6 mr-3 text-purple-400" />
              Tool Documentation
            </h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {tools.map((tool, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{tool.name}</h3>
                      <p className="text-gray-400 text-sm">{tool.description}</p>
                    </div>
                    <span className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                      {tool.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">Key Features:</h4>
                    <ul className="space-y-1">
                      {tool.features.map((feature, i) => (
                        <li key={i} className="text-gray-300 text-sm flex items-start">
                          <span className="w-2 h-2 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href={tool.href}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all text-sm"
                    >
                      <span>Try Tool</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-yellow-400" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Do I need to create an account?
                </h3>
                <p className="text-gray-300">
                  No! All our tools work without registration. You only need an account for premium
                  features or to sync data across devices. We use social login
                  (Google/Microsoft/Apple) - no passwords to remember.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Is my data safe and private?
                </h3>
                <p className="text-gray-300">
                  Absolutely. Most processing happens in your browser - your files never leave your
                  device. We store minimal account data (just email for login) and never track or
                  sell your information.
                  <Link
                    href="/privacy-policy"
                    className="text-cyan-400 hover:text-cyan-300 underline ml-1"
                  >
                    Learn more in our Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Are there usage limits?</h3>
                <p className="text-gray-300">
                  Our free tier is generous - you can process most files and use all core features
                  without limits. Premium features (like larger file support or advanced AI
                  analysis) may have fair usage policies to keep the service running smoothly for
                  everyone.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Can I use these tools for commercial projects?
                </h3>
                <p className="text-gray-300">
                  Yes! All our tools can be used for both personal and commercial projects. You own
                  the results and outputs - we never claim rights to your work.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  What browsers are supported?
                </h3>
                <p className="text-gray-300">
                  Our tools work in all modern browsers (Chrome, Firefox, Safari, Edge) on desktop
                  and mobile. For the best experience, we recommend using the latest version of your
                  preferred browser.
                </p>
              </div>
            </div>
          </section>

          {/* API & Integration */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <div className="text-center">
                <Code className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-4">API & Integrations</h2>
                <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                  Want to integrate our tools into your workflow? We're working on APIs and
                  integrations to make our tools available wherever you need them.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://github.com/ai-autosite"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                  >
                    <span>View on GitHub</span>
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                  <a
                    href="mailto:aiautosite@gmail.com?subject=API%20Access%20Request"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
                  >
                    <span>Request API Access</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Support Section */}
          <section>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Need Help?</h2>
              <p className="text-gray-400 mb-6">
                Can't find what you're looking for? We're here to help you get the most out of our
                tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:aiautosite@gmail.com"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
                >
                  <span>Email Support</span>
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  <span>Contact Page</span>
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  <span>Read Our Blog</span>
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
