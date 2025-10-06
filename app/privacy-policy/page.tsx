import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Shield, Lock, Eye, UserCheck, Download, Trash2 } from 'lucide-react'

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
            <p className="text-sm text-gray-500 mt-4">Last updated: August 31, 2025</p>
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
                  <p className="text-gray-300">We store ONLY your email and auth token</p>
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
                  <p className="text-gray-300">Delete account = all data gone in 24h</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <p className="text-gray-300">No data selling, ever</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <p className="text-gray-300">Export your data anytime</p>
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
                What We Collect (Minimal)
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>We believe in data minimalism. We only collect what's absolutely necessary:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></span>
                    <span>
                      <strong>Email address:</strong> From your Google/Microsoft/Apple account for
                      authentication
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></span>
                    <span>
                      <strong>Authentication token:</strong> To maintain your login session securely
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></span>
                    <span>
                      <strong>User ID:</strong> A unique identifier for account management
                    </span>
                  </li>
                </ul>
                <p className="text-sm text-gray-400 italic">
                  That's it. No personal information, no usage data, no tracking pixels.
                </p>
              </div>
            </section>

            {/* How We Use Data */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-3 text-green-400" />
                How We Use Your Data
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>Your minimal data is used only for:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3"></span>
                    <span>
                      <strong>Authentication:</strong> To identify you and maintain secure login
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3"></span>
                    <span>
                      <strong>Essential notifications:</strong> Payment confirmations, security
                      alerts, service updates
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3"></span>
                    <span>
                      <strong>Account management:</strong> Password resets, account deletion
                      requests
                    </span>
                  </li>
                </ul>
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
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-red-400">
                      <span className="text-lg mr-2">❌</span>
                      <span>No user profiling</span>
                    </div>
                    <div className="flex items-center text-red-400">
                      <span className="text-lg mr-2">❌</span>
                      <span>No unnecessary storage</span>
                    </div>
                    <div className="flex items-center text-red-400">
                      <span className="text-lg mr-2">❌</span>
                      <span>No third-party sharing</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Your Content */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Your Content & Data</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  All content you create (code analysis results, tech stack comparisons, processed
                  images) stays in your browser or your chosen cloud service. We never store your
                  actual work on our servers.
                </p>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-blue-300">
                    <strong>Your Data, Your Control:</strong> You own 100% of everything you create.
                    We're just the tool that helps you build it.
                  </p>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Download className="w-6 h-6 mr-3 text-purple-400" />
                Your Rights
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <h3 className="font-semibold text-purple-300 mb-2">Access & Export</h3>
                    <p className="text-gray-300 text-sm">
                      Download all your data anytime with one click
                    </p>
                  </div>
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <h3 className="font-semibold text-red-300 mb-2">Complete Deletion</h3>
                    <p className="text-gray-300 text-sm">Remove everything within 24 hours</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <h3 className="font-semibold text-green-300 mb-2">Data Portability</h3>
                    <p className="text-gray-300 text-sm">Take your data anywhere you want</p>
                  </div>
                  <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                    <h3 className="font-semibold text-cyan-300 mb-2">Full Transparency</h3>
                    <p className="text-gray-300 text-sm">Always know what we store and why</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Questions or Concerns?</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We believe in complete transparency. If you have any questions about how we handle
                  your data, please don't hesitate to reach out.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:aiautosite@gmail.com"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
                  >
                    <span>Contact Us</span>
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                  >
                    <span>More Contact Options</span>
                  </Link>
                </div>
              </div>
            </section>

            {/* Legal Notice */}
            <section className="pt-6 border-t border-white/10">
              <p className="text-sm text-gray-500">
                This privacy policy is effective as of August 31, 2025. We will notify you of any
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
