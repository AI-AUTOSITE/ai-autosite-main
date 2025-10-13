import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FileText, Shield, Zap, Users, AlertTriangle, CheckCircle } from 'lucide-react'

export default function TermsOfServicePage() {
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-xl text-gray-400">Simple, fair terms that put users first.</p>
            <p className="text-sm text-gray-500 mt-4">Last updated: October 13, 2025</p>
          </div>

          {/* Key Points */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              Key Points
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <Shield className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <p className="text-white font-semibold">Privacy-First</p>
                <p className="text-gray-400 text-sm">Your data stays with you</p>
              </div>
              <div className="text-center p-4">
                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-white font-semibold">Fair Use</p>
                <p className="text-gray-400 text-sm">Reasonable usage limits</p>
              </div>
              <div className="text-center p-4">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-white font-semibold">Community</p>
                <p className="text-gray-400 text-sm">Respectful environment</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 space-y-8">
            {/* Service Description */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Our Service</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  AI-AutoSite provides free online tools for developers, creatives, and
                  professionals. Most tools run entirely in your browser with minimal data collection and maximum privacy.
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
                  <p className="text-cyan-300 text-sm">
                    <strong>Privacy-First Design:</strong> Most tools process data directly in your browser. 
                    We don't store your files, content, or personal data on our servers.
                  </p>
                </div>
                <p>
                  By using our service, you agree to these terms and our{' '}
                  <Link
                    href="/privacy-policy"
                    className="text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </section>

            {/* User Rights */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Your Rights</h2>
              <div className="space-y-4 text-gray-300">
                <ul className="space-y-3 ml-6">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span>
                      <strong>Use our tools freely</strong> for personal and commercial projects
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span>
                      <strong>Own your data</strong> - anything you create belongs to you 100%
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span>
                      <strong>Control your browser data</strong> - clear localStorage anytime to remove all settings
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span>
                      <strong>No lock-in</strong> - stop using our service anytime, no questions asked
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span>
                      <strong>Verify our claims</strong> - inspect our open source code and browser data storage
                    </span>
                  </li>
                </ul>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4">
                  <p className="text-blue-300 text-sm">
                    <strong>💡 About Data Deletion:</strong> Since we don't store your personal data on our servers, 
                    there's nothing for us to delete. Your browser's localStorage is under your control - 
                    clear your browser data and it's gone instantly. For premium purchases, your license 
                    key is stored in your browser, and payment records are handled by Stripe.
                  </p>
                </div>
              </div>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Acceptable Use</h2>
              <div className="space-y-4 text-gray-300">
                <p>We ask that you use our tools responsibly:</p>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold text-green-400 mb-3">✅ Please Do</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Use for personal and commercial projects</li>
                      <li>• Share tools with colleagues and friends</li>
                      <li>• Provide feedback to help us improve</li>
                      <li>• Report bugs or security issues</li>
                      <li>• Verify our privacy claims via DevTools</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-red-400 mb-3">❌ Please Don't</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Attempt to hack or break our systems</li>
                      <li>• Use tools for illegal activities</li>
                      <li>• Spam or abuse our services</li>
                      <li>• Violate others' intellectual property</li>
                      <li>• Reverse engineer paid features</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Service Availability */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Service Availability</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  We strive to keep our tools available 24/7, but we're a small team with limited
                  resources:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3"></span>
                    <span>Occasional maintenance windows may be required</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3"></span>
                    <span>High traffic may temporarily slow performance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3"></span>
                    <span>Tool updates may cause brief interruptions</span>
                  </li>
                </ul>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mt-4">
                  <p className="text-yellow-300 text-sm">
                    <strong>No Service Guarantees:</strong> While we work hard to maintain uptime,
                    we cannot guarantee 100% availability for our free tools. Most tools work in your 
                    browser, so even during outages, many features remain functional.
                  </p>
                </div>
              </div>
            </section>

            {/* Premium Services */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Premium Services & Payments</h2>
              <div className="space-y-4 text-gray-300">
                <p>Some advanced features may require a one-time payment or subscription:</p>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-3">💳 Payment Processing Flow:</p>
                  <ol className="space-y-2 list-decimal list-inside text-sm">
                    <li>You initiate purchase → Data sent to Stripe (secure payment processor)</li>
                    <li>Stripe processes your payment → Returns confirmation to our server</li>
                    <li>We generate a unique license token (64-character key)</li>
                    <li>License token sent to your browser → Stored in localStorage only</li>
                    <li>No personal data or purchase records stored on our servers</li>
                  </ol>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                    <p className="text-purple-300 font-semibold mb-2">Your Browser Stores:</p>
                    <ul className="text-sm space-y-1">
                      <li>• License token (randomly generated)</li>
                      <li>• Purchase date</li>
                      <li>• Product type</li>
                      <li>• Active status</li>
                    </ul>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-300 font-semibold mb-2">Stripe Stores:</p>
                    <ul className="text-sm space-y-1">
                      <li>• Email address</li>
                      <li>• Payment details</li>
                      <li>• Transaction history</li>
                    </ul>
                  </div>
                </div>

                <ul className="space-y-2 ml-6 mt-4">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></span>
                    <span>All payments processed securely through Stripe</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></span>
                    <span>License keys stored in your browser (you control them)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></span>
                    <span>Clear pricing with no hidden fees</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></span>
                    <span>Lifetime access for one-time purchases</span>
                  </li>
                </ul>

                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mt-4">
                  <p className="text-orange-300 text-sm mb-2">
                    <strong>⚠️ Refund Policy:</strong>
                  </p>
                  <p className="text-gray-300 text-sm">
                    Due to our privacy-first design (no personal data storage), refunds require manual 
                    verification through Stripe. Contact us with your license key or payment email, 
                    and we'll work with you to resolve any issues. We want you to be satisfied with 
                    your purchase!
                  </p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-blue-300 text-sm">
                    <strong>💡 License Recovery:</strong> Lost your license key? We can recover it 
                    via email verification through Stripe. Your email is used to search Stripe's 
                    purchase records, then we generate a new token and send it to you. This is why 
                    we recommend saving your license key in a safe place after purchase.
                  </p>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
              <div className="space-y-4 text-gray-300">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-3">Your Content</h3>
                    <p className="text-sm mb-3">
                      You retain full ownership of any content you create using our tools. We never
                      claim rights to your work.
                    </p>
                    <p className="text-xs text-gray-400">
                      This includes: Generated code, processed images, PDF outputs, text conversions, 
                      and any other content you create with our tools.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-400 mb-3">Our Service</h3>
                    <p className="text-sm mb-3">
                      Our tools, code, and branding remain our intellectual property. However, much of
                      our code is available as open source on GitHub.
                    </p>
                    <p className="text-xs text-gray-400">
                      You may inspect, review, and learn from our code, but please don't create 
                      identical competing services.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* AI Tools Disclaimer */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. AI-Powered Tools</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Tools displaying an <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white mx-1">AI</span> badge 
                  use Claude API (by Anthropic) to provide advanced AI features and require an internet connection.
                </p>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                  <p className="text-purple-300 font-semibold mb-3">
                    🤖 How AI Tools Work:
                  </p>
                  <ol className="space-y-2 text-sm list-decimal list-inside">
                    <li>You submit your text or file → Sent to Claude API for processing</li>
                    <li>Claude analyzes your input and generates results in real-time</li>
                    <li>Results are displayed immediately in your browser</li>
                    <li>Your input is NOT stored on our servers or Claude's servers after processing</li>
                  </ol>
                </div>

                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></span>
                    <span>We clearly label which tools use AI processing with an AI badge</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></span>
                    <span>Your data is processed temporarily and immediately discarded</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></span>
                    <span>AI-generated content may not always be accurate - verify important results</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></span>
                    <span>These tools cannot function offline as they require real-time API access</span>
                  </li>
                </ul>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-blue-300 text-sm">
                    <strong>💡 Which tools use AI?</strong> Look for the <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white mx-1">AI</span> badge 
                    on any tool card. If you see this badge, the tool requires internet access and temporarily 
                    sends your input to Claude's API for processing.
                  </p>
                </div>
              </div>
            </section>

            {/* Limitations */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Limitations & Disclaimers</h2>
              <div className="space-y-4 text-gray-300">
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-orange-400 mt-1 mr-3 flex-shrink-0" />
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Use at Your Own Risk:</strong> Our tools are provided "as is"
                        without warranties of any kind.
                      </p>
                      <p>
                        <strong>No Liability:</strong> We're not responsible for any damages, data loss, 
                        or business impacts from using our service.
                      </p>
                      <p>
                        <strong>Results May Vary:</strong> Tool outputs depend on your input and may
                        not always be perfect. Always verify critical results.
                      </p>
                      <p>
                        <strong>Browser Compatibility:</strong> Tools work best on modern browsers. 
                        Some features may not work on older browsers.
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-sm">
                  We're a small team doing our best to provide helpful tools. Please use common
                  sense and don't rely solely on our tools for critical business or legal decisions.
                  For important work, always verify results manually.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Changes to These Terms</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  We may update these terms occasionally to improve clarity or comply with legal
                  requirements. We'll notify you of significant changes by:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></span>
                    <span>Posting updates on this page with the new "Last updated" date</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></span>
                    <span>Displaying a notice banner on our website for major changes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></span>
                    <span>Giving you reasonable time to review before changes take effect</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-400 mt-3">
                  Note: Since we don't collect email addresses, we can't send email notifications. 
                  Please check this page periodically if you're a regular user.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Questions or Disputes</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  We believe in resolving issues through friendly communication. If you have
                  concerns about our terms or service, please reach out:
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:aiautosite@gmail.com"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
                  >
                    <span>Email Us</span>
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                  >
                    <span>Contact Page</span>
                  </Link>
                  <Link
                    href="/faq"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                  >
                    <span>Read FAQ</span>
                  </Link>
                </div>
              </div>
            </section>

            {/* Legal Notice */}
            <section className="pt-6 border-t border-white/10">
              <p className="text-sm text-gray-500">
                These terms are governed by the laws of the United States. By using our service, you
                agree to resolve disputes through good faith communication first, and arbitration if
                necessary. These terms are effective as of October 13, 2025 and supersede all 
                previous versions.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}