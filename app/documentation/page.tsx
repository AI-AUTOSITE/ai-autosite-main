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
  AlertTriangle,
  Cloud,
  Lock,
} from 'lucide-react'

export default function DocumentationPage() {
  const tools = [
    {
      name: 'Tech Stack Analyzer',
      description: 'Compare frameworks and get AI-powered recommendations',
      href: '/tools/tech-stack-analyzer',
      status: 'live',
      type: 'ai',
      features: [
        'Framework comparison matrix',
        'AI-powered recommendations',
        'Performance metrics analysis',
        'Learning curve assessment',
      ],
      dataSafety: 'Uses Claude API - only upload non-sensitive, generic framework questions',
    },
    {
      name: 'Code Dependency Visualizer',
      description: 'Analyze project structure and file dependencies',
      href: '/tools/code-reader',
      status: 'live',
      type: 'browser',
      features: [
        'Upload ZIP files or connect GitHub',
        'Interactive dependency tree',
        'File relationship mapping',
        'Project structure analysis',
      ],
      dataSafety: 'Processes entirely in your browser - your code never leaves your device',
    },
    {
      name: 'BlurTap',
      description: 'Mask sensitive information in images instantly',
      href: '/tools/blurtap',
      status: 'live',
      type: 'browser',
      features: [
        'One-click sensitive data masking',
        'Customizable blur intensity',
        'Multiple mask shapes',
        'Instant download',
      ],
      dataSafety: 'Browser-only processing - images never uploaded to any server',
    },
  ]

  const guides = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of using our tools effectively',
      icon: PlayCircle,
      items: [
        'No account needed for basic features',
        'Most tools work entirely in your browser',
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
        'Client-side processing for most tools',
        'AI tools: data not stored after processing',
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
        'Never upload sensitive data to AI tools',
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

          {/* Critical Safety Warning */}
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-500/50 rounded-2xl p-6 mb-12">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-red-300">
                  ⚠️ IMPORTANT: Before Using AI Tools
                </h3>
                <p className="text-gray-200">
                  Tools marked with an <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white mx-1">AI</span> badge 
                  send your input to Claude API for processing.
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <p className="text-red-300 font-semibold mb-2">❌ NEVER Upload:</p>
                  <ul className="grid md:grid-cols-2 gap-2 text-gray-200 text-sm">
                    <li>• Personal information (names, emails, addresses)</li>
                    <li>• Confidential business data</li>
                    <li>• Trade secrets or proprietary code</li>
                    <li>• Medical or legal documents</li>
                    <li>• Customer data or PII</li>
                    <li>• Financial information</li>
                  </ul>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-300 font-semibold mb-2">✅ Safe to Upload:</p>
                  <p className="text-sm text-gray-200">
                    Sample data, anonymized content, public information, generic questions, test data
                  </p>
                </div>
                <p className="text-sm text-cyan-400">
                  → See detailed safety guide in our{' '}
                  <Link href="/faq" className="underline hover:text-cyan-300">
                    FAQ
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy-policy" className="underline hover:text-cyan-300">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Tool Types Explanation */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Understanding Our Tools</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Browser-Only Tools */}
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Lock className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-green-300">Browser-Only Tools</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  40+ tools that process everything locally in your browser
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 text-lg">✓</span>
                    <p className="text-gray-300 text-sm">100% client-side processing</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 text-lg">✓</span>
                    <p className="text-gray-300 text-sm">No data sent to any server</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 text-lg">✓</span>
                    <p className="text-gray-300 text-sm">Works offline after page load</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 text-lg">✓</span>
                    <p className="text-gray-300 text-sm">Safe for any data (including sensitive)</p>
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Examples:</p>
                  <p className="text-xs text-gray-300">
                    Image compressor, Base64 converter, PDF merger, QR generator, BlurTap
                  </p>
                </div>
              </div>

              {/* AI-Powered Tools */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Cloud className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-300">AI-Powered Tools</h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white">AI</span>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  Advanced features that require Claude API processing
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-400 text-lg">⚠</span>
                    <p className="text-gray-300 text-sm">Requires internet connection</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-400 text-lg">⚠</span>
                    <p className="text-gray-300 text-sm">Data sent to Claude API temporarily</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 text-lg">✓</span>
                    <p className="text-gray-300 text-sm">Not stored after processing</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 text-lg">×</span>
                    <p className="text-gray-300 text-sm">NOT for sensitive data</p>
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Examples:</p>
                  <p className="text-xs text-gray-300">
                    Tech Stack Analyzer, AI code analysis, content generators
                  </p>
                </div>
              </div>
            </div>
          </section>

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
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-white">{tool.name}</h3>
                        {tool.type === 'ai' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            AI
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-500/20 text-green-400">
                            Browser
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{tool.description}</p>
                    </div>
                    <span className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400 ml-2">
                      {tool.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mb-4">
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

                  {/* Data Safety Info */}
                  <div
                    className={`rounded-lg p-3 mb-4 ${
                      tool.type === 'ai'
                        ? 'bg-orange-500/10 border border-orange-500/30'
                        : 'bg-green-500/10 border border-green-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {tool.type === 'ai' ? (
                        <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Lock className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p
                          className={`text-xs font-semibold mb-1 ${
                            tool.type === 'ai' ? 'text-orange-300' : 'text-green-300'
                          }`}
                        >
                          {tool.type === 'ai' ? 'Data Safety Warning:' : 'Privacy Guaranteed:'}
                        </p>
                        <p className="text-xs text-gray-300">{tool.dataSafety}</p>
                      </div>
                    </div>
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

          {/* Data Safety Best Practices */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Data Safety Best Practices
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    For Browser-Only Tools
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span className="text-gray-300">
                        Safe to use with ANY data including sensitive information
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span className="text-gray-300">
                        No data ever leaves your device
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span className="text-gray-300">
                        Perfect for confidential documents and personal files
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span className="text-gray-300">
                        Can be used offline (after initial page load)
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white/5 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-orange-400 mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    For AI-Powered Tools
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">×</span>
                      <span className="text-gray-300">
                        Never upload personal or confidential information
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">⚠</span>
                      <span className="text-gray-300">
                        Data is sent to Claude API for processing
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span className="text-gray-300">
                        Safe for generic questions and public information
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">ℹ</span>
                      <span className="text-gray-300">
                        When in doubt, anonymize or use sample data
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <p className="text-cyan-300 text-sm">
                  <strong>💡 Pro Tip:</strong> If you need to analyze sensitive data, use our browser-only 
                  tools. If you need AI features, create anonymized sample data that represents your actual 
                  data without including any sensitive information.
                </p>
              </div>
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
                <p className="text-gray-300 mb-3">
                  It depends on which type of tool you're using:
                </p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>
                      <strong>Browser-only tools:</strong> Absolutely! Your files never leave your device. 
                      Perfect for sensitive data.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>
                      <strong>AI tools:</strong> Your input is sent to Claude API temporarily for processing. 
                      Not stored after processing, but you should NOT upload sensitive data.
                    </span>
                  </li>
                </ul>
                <Link
                  href="/privacy-policy"
                  className="text-cyan-400 hover:text-cyan-300 underline text-sm mt-2 inline-block"
                >
                  Learn more in our Privacy Policy
                </Link>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  How can I tell if a tool uses AI?
                </h3>
                <p className="text-gray-300 mb-3">
                  Very easy! Look for the <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white mx-1">AI</span> badge 
                  on tool cards. If you see this badge, the tool requires internet and sends data to Claude API.
                </p>
                <p className="text-sm text-gray-400">
                  Tools without this badge are browser-only and process everything locally on your device.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Are there usage limits?</h3>
                <p className="text-gray-300">
                  Browser-only tools have no limits - use them as much as you want! AI-powered tools 
                  may have fair usage policies to keep the service running smoothly for everyone. 
                  Premium features unlock higher limits.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Can I use these tools for commercial projects?
                </h3>
                <p className="text-gray-300">
                  Yes! All our tools can be used for both personal and commercial projects. You own
                  the results and outputs - we never claim rights to your work. Just remember not to 
                  upload confidential business data to AI tools.
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
                  href="/faq"
                  className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  <span>Read FAQ</span>
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