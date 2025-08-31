import Link from 'next/link'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
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
            <p className="text-xl text-gray-400">
              Simple, fair terms that put users first.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: August 31, 2025
            </p>
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
                <p className="text-white font-semibold">User-First</p>
                <p className="text-gray-400 text-sm">Your rights are protected</p>
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
                  AI-AutoSite provides free online tools for developers, creatives, and professionals. 
                  Our tools work directly in your browser with minimal data collection and maximum privacy.
                </p>
                <p>
                  By using our service, you agree to these terms and our 
                  <Link href="/privacy-policy" className="text-cyan-400 hover:text-cyan-300 underline ml-1">
                    Privacy Policy
                  </Link>.
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
                    <span><strong>Use our tools freely</strong> for personal and commercial projects</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span><strong>Own your data</strong> - anything you create belongs to you</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span><strong>Cancel anytime</strong> - no lock-in contracts for premium features</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span><strong>Request data deletion</strong> - complete removal within 24 hours</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span><strong>Export your data</strong> - take it anywhere you want</span>
                  </li>
                </ul>
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
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-red-400 mb-3">❌ Please Don't</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Attempt to hack or break our systems</li>
                      <li>• Use tools for illegal activities</li>
                      <li>• Spam or abuse our services</li>
                      <li>• Violate others' intellectual property</li>
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
                  We strive to keep our tools available 24/7, but we're a small team with limited resources:
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
                    <span>We'll communicate major outages on our status page</span>
                  </li>
                </ul>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mt-4">
                  <p className="text-yellow-300 text-sm">
                    <strong>No Service Guarantees:</strong> While we work hard to maintain uptime, 
                    we cannot guarantee 100% availability for our free tools.
                  </p>
                </div>
              </div>
            </section>

            {/* Premium Services */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Premium Services</h2>
              <div className="space-y-4 text-gray-300">
                <p>Some advanced features may require a premium subscription:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></span>
                    <span>All payments processed securely through Stripe</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></span>
                    <span>7-day satisfaction guarantee with full refund</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></span>
                    <span>Cancel anytime - no questions asked</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></span>
                    <span>Clear pricing with no hidden fees</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
              <div className="space-y-4 text-gray-300">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-3">Your Content</h3>
                    <p className="text-sm">
                      You retain full ownership of any content you create using our tools. 
                      We never claim rights to your work.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-400 mb-3">Our Service</h3>
                    <p className="text-sm">
                      Our tools, code, and branding remain our intellectual property, 
                      but much of our code is open source.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Limitations */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Limitations & Disclaimers</h2>
              <div className="space-y-4 text-gray-300">
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-orange-400 mt-1 mr-3 flex-shrink-0" />
                    <div className="space-y-2 text-sm">
                      <p><strong>Use at Your Own Risk:</strong> Our tools are provided "as is" without warranties.</p>
                      <p><strong>No Liability:</strong> We're not responsible for any damages from using our service.</p>
                      <p><strong>Results May Vary:</strong> Tool outputs depend on your input and may not always be perfect.</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm">
                  We're a small team doing our best to provide helpful tools. Please use common sense 
                  and don't rely solely on our tools for critical business decisions.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Changes to These Terms</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  We may update these terms occasionally to improve clarity or comply with legal requirements. 
                  We'll notify you of significant changes by:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></span>
                    <span>Posting updates on this page</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></span>
                    <span>Sending email notifications for major changes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></span>
                    <span>Giving you time to review before changes take effect</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Questions or Disputes</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  We believe in resolving issues through friendly communication. 
                  If you have concerns about our terms or service, please reach out:
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="mailto:aiautosite@gmail.com" 
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
                  >
                    <span>Email Us</span>
                  </a>
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                  >
                    <span>Contact Page</span>
                  </Link>
                </div>
              </div>
            </section>

            {/* Legal Notice */}
            <section className="pt-6 border-t border-white/10">
              <p className="text-sm text-gray-500">
                These terms are governed by the laws of the United States. 
                By using our service, you agree to resolve disputes through good faith communication first, 
                and arbitration if necessary. These terms are effective as of August 31, 2025.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}