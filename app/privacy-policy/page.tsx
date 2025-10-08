import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Shield, Lock, Eye, UserCheck, Download, Trash2, Smartphone } from 'lucide-react'

export default function PrivacyPolicyPage() {
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
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-400">
              We protect your privacy with minimal data collection and maximum transparency.
            </p>
            <p className="text-sm text-gray-500 mt-4">Last updated: October 9, 2025</p>
          </div>

          {/* Quick Summary */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-cyan-400" />
              TL;DR - The Essentials
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <p className="text-gray-300">We store NOTHING on our servers</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <p className="text-gray-300">No tracking, no analytics, no cookies</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <p className="text-gray-300">Your content stays in your browser</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <p className="text-gray-300">Browser data = your control</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <p className="text-gray-300">No data selling, ever</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <p className="text-gray-300">Open source & verifiable</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 space-y-8">
            {/* What We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <UserCheck className="w-6 h-6 mr-3 text-cyan-400" />
                What We Collect (Spoiler: Almost Nothing)
              </h2>
              <div className="space-y-4 text-gray-300">
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-4 border border-green-500/20">
                  <p className="text-green-300 font-semibold text-lg mb-2">
                    🎉 Server-Side: ZERO Personal Data
                  </p>
                  <p className="text-sm">
                    We don't store your name, email, files, or any personal information on our servers. Period.
                  </p>
                </div>

                <p className="font-semibold">Where your data actually lives:</p>

                <div className="space-y-3">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="font-semibold mb-2">🌐 Your Browser (localStorage)</p>
                    <ul className="space-y-2 ml-6 text-sm">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></span>
                        <span>
                          <strong>Free users:</strong> Nothing stored (empty localStorage)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></span>
                        <span>
                          <strong>Premium users:</strong> License token only (no personal info)
                        </span>
                      </li>
                    </ul>
                    <p className="text-xs text-gray-400 mt-2 italic">
                      You control this data - clear browser data and it's gone forever.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="font-semibold mb-2">💳 Stripe (Payment Processor)</p>
                    <ul className="space-y-2 ml-6 text-sm">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></span>
                        <span>
                          Email address (for purchase verification)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></span>
                        <span>
                          Payment details (handled by Stripe, not us)
                        </span>
                      </li>
                    </ul>
                    <p className="text-xs text-gray-400 mt-2 italic">
                      This is standard for any e-commerce site. We never see your card details.
                    </p>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 mt-4">
                  <p className="text-purple-300 font-semibold">
                    🔍 How to verify: 
                  </p>
                  <p className="text-sm mt-2">
                    Open DevTools (F12) → Application tab → Local Storage → ai-autosite.com
                    <br />
                    On mobile? Check our <Link href="/faq" className="text-cyan-400 hover:underline">FAQ for mobile verification</Link>
                  </p>
                </div>
              </div>
            </section>

            {/* How We Use Data */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-3 text-green-400" />
                How We Use Your Data (The Little We Have)
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>Since we don't store personal data on our servers, there's not much to "use"!</p>
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">Your Browser's localStorage:</p>
                  <ul className="space-y-2 ml-6 text-sm">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3"></span>
                      <span>
                        <strong>License verification:</strong> Check if you have premium access (locally)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3"></span>
                      <span>
                        <strong>Settings persistence:</strong> Remember your preferences (locally)
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">Stripe's Data:</p>
                  <ul className="space-y-2 ml-6 text-sm">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></span>
                      <span>
                        <strong>License recovery:</strong> Let you recover your license if you lose it
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></span>
                      <span>
                        <strong>Payment verification:</strong> Confirm your purchase was successful
                      </span>
                    </li>
                  </ul>
                  <p className="text-xs text-gray-400 mt-2 italic">
                    Managed entirely by Stripe. We query it, but never store the results.
                  </p>
                </div>
              </div>
            </section>

            {/* What We Never Do */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Trash2 className="w-6 h-6 mr-3 text-red-400" />
                What We NEVER Do
              </h2>
              <div className="space-y-4 text-gray-300">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-red-400">
                      <span className="text-lg mr-2">❌</span>
                      <span>No marketing emails</span>
                    </div>
                    <div className="flex items-center text-red-400">
                      <span className="text-lg mr-2">❌</span>
                      <span>No data selling</span>
                    </div>
                    <div className="flex items-center text-red-400">
                      <span className="text-lg mr-2">❌</span>
                      <span>No behavioral tracking</span>
                    </div>
                    <div className="flex items-center text-red-400">
                      <span className="text-lg mr-2">❌</span>
                      <span>No cookies</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-red-400">
                      <span className="text-lg mr-2">❌</span>
                      <span>No user profiling</span>
                    </div>
                    <div className="flex items-center text-red-400">
                      <span className="text-lg mr-2">❌</span>
                      <span>No analytics scripts</span>
                    </div>
                    <div className="flex items-center text-red-400">
                      <span className="text-lg mr-2">❌</span>
                      <span>No third-party sharing</span>
                    </div>
                    <div className="flex items-center text-red-400">
                      <span className="text-lg mr-2">❌</span>
                      <span>No server-side storage</span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mt-4">
                  <p className="text-red-300 font-semibold">
                    🚫 We can't sell your data because we don't have it!
                  </p>
                </div>
              </div>
            </section>

            {/* Your Content */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Your Content & Files</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  All content you process (PDFs, images, text, calculations) stays in your browser memory during processing. 
                  Once you close the tab or refresh, it's gone - forever.
                </p>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">🔄 Processing Flow:</p>
                  <ol className="space-y-2 list-decimal list-inside text-sm">
                    <li>You upload a file → It stays in your browser's RAM</li>
                    <li>JavaScript processes it locally</li>
                    <li>You download the result</li>
                    <li>Close tab → Everything deleted automatically</li>
                  </ol>
                  <p className="text-xs text-gray-400 mt-2">
                    We never send your files to our servers (except AI tools that need API processing).
                  </p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-blue-300">
                    <strong>Your Data, Your Control:</strong> You own 100% of everything you create. 
                    We're just the tool that helps you build it.
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <p className="text-yellow-300">
                    <strong>⚠️ AI Tools Exception:</strong> Tools that use AI APIs (Claude, GPT-4) 
                    temporarily send your text to those services for processing. 
                    We show a warning before this happens. Your files still don't touch our servers.
                  </p>
                </div>
              </div>
            </section>

            {/* Mobile Verification */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Smartphone className="w-6 h-6 mr-3 text-purple-400" />
                Verify on Mobile
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>You can verify our privacy claims on any device:</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="font-semibold mb-2">📱 iPhone Users:</p>
                    <ul className="text-sm space-y-1">
                      <li>• Safari Web Inspector (via Mac)</li>
                      <li>• Inspect Browser app</li>
                      <li>• Simple clear test</li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="font-semibold mb-2">📱 Android Users:</p>
                    <ul className="text-sm space-y-1">
                      <li>• Chrome Remote Debugging</li>
                      <li>• Eruda Console (easiest!)</li>
                      <li>• Via:// Browser</li>
                    </ul>
                  </div>
                </div>

                <Link 
                  href="/faq" 
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
                >
                  <span>→ See detailed mobile verification guide in FAQ</span>
                </Link>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Download className="w-6 h-6 mr-3 text-purple-400" />
                Your Rights (Though There's Not Much to Access!)
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <h3 className="font-semibold text-purple-300 mb-2">Access & Export</h3>
                    <p className="text-gray-300 text-sm">
                      Your localStorage data is always accessible via DevTools. 
                      It's already on your device!
                    </p>
                  </div>
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <h3 className="font-semibold text-red-300 mb-2">Complete Deletion</h3>
                    <p className="text-gray-300 text-sm">
                      Clear your browser data. Done. Since we store nothing on our servers, 
                      there's nothing to delete on our end.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <h3 className="font-semibold text-green-300 mb-2">Data Portability</h3>
                    <p className="text-gray-300 text-sm">
                      All processing happens in your browser. Export anytime, anywhere.
                    </p>
                  </div>
                  <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                    <h3 className="font-semibold text-cyan-300 mb-2">Full Transparency</h3>
                    <p className="text-gray-300 text-sm">
                      Open source code on GitHub. Verify everything yourself.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* GDPR/CCPA */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">GDPR, CCPA & Legal Compliance</h2>
              <div className="space-y-4 text-gray-300">
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-4 border border-green-500/20">
                  <p className="text-green-300 font-semibold text-lg">
                    ✅ We're compliant by design - because we don't collect data!
                  </p>
                </div>

                <p>
                  GDPR and CCPA regulations exist to protect personal data. Since we don't collect, 
                  store, or process personal data on our servers, most of these regulations don't apply to us.
                </p>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">What this means:</p>
                  <ul className="space-y-2 ml-6 text-sm">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3"></span>
                      <span>No data breach risks (we have no data to breach)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3"></span>
                      <span>No "right to be forgotten" requests (nothing to forget)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3"></span>
                      <span>No data portability issues (it's already portable!)</span>
                    </li>
                  </ul>
                </div>

                <p className="text-sm text-gray-400">
                  For payments, Stripe handles GDPR/CCPA compliance as your payment processor.
                </p>
              </div>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  If we ever change our privacy practices, we'll update this page and note the date at the top.
                </p>
                <p className="text-sm text-gray-400">
                  Spoiler: Since we don't collect data now, any future changes would likely just add 
                  more detail to what we're <em>already not doing</em>. 😊
                </p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Questions or Concerns?</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We believe in complete transparency. If you have any questions about how we handle 
                  your data (or rather, how we don't), please don't hesitate to reach out.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:aiautosite@gmail.com"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
                  >
                    <span>Contact Us</span>
                  </a>
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
                This privacy policy is effective as of October 9, 2025. We will notify you of any 
                changes by posting the new policy on this page. Changes are effective immediately 
                upon posting.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}