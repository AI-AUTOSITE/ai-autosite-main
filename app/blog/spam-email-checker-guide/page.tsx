import { Metadata } from 'next'
import { Shield, Mail, AlertTriangle, CheckCircle, Lock, Smartphone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How to Check Spam Emails Before Opening - Complete Safety Guide 2025',
  description:
    'Learn to identify phishing emails and spam before opening them. Detect typosquatting, suspicious domains, and fraud attempts. Free email checker tool included.',
  keywords:
    'spam email checker, phishing detection, email security, typosquatting, fraud prevention, email safety, online security, scam detection',
  openGraph: {
    title: 'Spam Email Checker Guide - Protect Yourself from Phishing',
    description:
      'Complete guide to checking suspicious emails. Learn phishing detection techniques and use our free email checker.',
    type: 'article',
    publishedTime: '2025-10-18',
    authors: ['AI AutoSite Team'],
    images: [
      {
        url: '/og/spam-email-checker-guide.png',
        width: 1200,
        height: 630,
        alt: 'Spam Email Checker Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Check Spam Emails - Complete Guide',
    description: 'Learn to detect phishing and spam emails before opening them.',
  },
  alternates: {
    canonical: 'https://ai-autosite.com/blog/spam-email-checker-guide',
  },
}

export default function SpamEmailCheckerGuidePage() {
  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 text-cyan-400 mb-4">
          <Shield className="w-6 h-6" />
          <span className="text-sm font-medium">EMAIL SAFETY GUIDE</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          How to Check Spam Emails Before Opening
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          Learn to identify phishing emails and protect yourself from fraud. Complete guide with
          free email checker tool.
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
          <span>📅 October 18, 2025</span>
          <span>⏱️ 7 min read</span>
          <span>👤 AI AutoSite Team</span>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-12">
        <h2 className="text-lg font-bold text-white mb-4">📋 Table of Contents</h2>
        <ul className="space-y-2 text-gray-300">
          <li>
            <a href="#why-check" className="hover:text-cyan-400 transition-colors">
              1. Why Check Emails Before Opening?
            </a>
          </li>
          <li>
            <a href="#common-threats" className="hover:text-cyan-400 transition-colors">
              2. Common Email Threats
            </a>
          </li>
          <li>
            <a href="#detection-methods" className="hover:text-cyan-400 transition-colors">
              3. How to Detect Suspicious Emails
            </a>
          </li>
          <li>
            <a href="#using-checker" className="hover:text-cyan-400 transition-colors">
              4. Using the Spam Email Checker
            </a>
          </li>
          <li>
            <a href="#mobile-safety" className="hover:text-cyan-400 transition-colors">
              5. Mobile Email Safety
            </a>
          </li>
          <li>
            <a href="#best-practices" className="hover:text-cyan-400 transition-colors">
              6. Best Practices
            </a>
          </li>
        </ul>
      </div>

      {/* Content Sections */}
      <div className="prose prose-invert max-w-none">
        {/* Section 1 */}
        <section id="why-check" className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
            Why Check Emails Before Opening?
          </h2>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-6">
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-red-400">84% of emails are opened on mobile devices</strong>,
              where phishing attacks are harder to detect. A single malicious email can compromise
              your entire digital life.
            </p>
          </div>
          <p className="text-gray-300 leading-relaxed mb-4">
            Email remains the #1 vector for cyberattacks. According to recent data, phishing emails
            account for over 80% of reported security incidents. The consequences can be severe:
          </p>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-red-400 mt-1">●</span>
              <span>
                <strong>Identity theft:</strong> Criminals steal personal information to open
                accounts in your name
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 mt-1">●</span>
              <span>
                <strong>Financial loss:</strong> Direct theft from bank accounts or fraudulent
                purchases
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 mt-1">●</span>
              <span>
                <strong>Data breach:</strong> Malware installations that compromise all your
                devices
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 mt-1">●</span>
              <span>
                <strong>Reputation damage:</strong> Your email account used to attack others
              </span>
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section id="common-threats" className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Mail className="w-8 h-8 text-cyan-400" />
            Common Email Threats
          </h2>

          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-3">
                1. Typosquatting (Most Common)
              </h3>
              <p className="text-gray-300 mb-4">
                Attackers register domains that look almost identical to legitimate companies:
              </p>
              <div className="bg-black/40 rounded-lg p-4 font-mono text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓ Legitimate:</span>
                  <span className="text-white">paypal.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">✗ Fake:</span>
                  <span className="text-white">paypa1.com (L → 1)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">✗ Fake:</span>
                  <span className="text-white">paypai.com (L → I)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">✗ Fake:</span>
                  <span className="text-white">paypa|.com (L → |)</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-3">
                2. Dangerous Domain Extensions
              </h3>
              <p className="text-gray-300 mb-4">
                Certain TLDs (Top Level Domains) are heavily used in phishing:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 font-mono text-sm">.xyz</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 font-mono text-sm">.top</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 font-mono text-sm">.click</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 font-mono text-sm">.link</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                While not all emails from these domains are malicious, they're statistically more
                likely to be spam.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-3">
                3. Suspicious Keywords in Domains
              </h3>
              <p className="text-gray-300 mb-4">
                Phishers often use urgency-inducing words in domain names:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400">●</span>
                  <span className="font-mono">amazon-secure.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">●</span>
                  <span className="font-mono">verify-paypal.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">●</span>
                  <span className="font-mono">account-apple.com</span>
                </li>
              </ul>
              <p className="text-gray-400 text-sm mt-4">
                Legitimate companies rarely use these words in their email domains.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="detection-methods" className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-400" />
            How to Detect Suspicious Emails
          </h2>

          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">Quick Checklist</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5" />
                <span className="text-gray-300">Check sender email address carefully</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5" />
                <span className="text-gray-300">Look for spelling mistakes in domain</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5" />
                <span className="text-gray-300">Verify domain extension (.com vs .xyz)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5" />
                <span className="text-gray-300">Be suspicious of urgent requests</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5" />
                <span className="text-gray-300">Don't trust the display name alone</span>
              </label>
            </div>
          </div>

          <p className="text-gray-300 leading-relaxed mb-6">
            Before opening any suspicious email, examine the sender address. Here's how:
          </p>

          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-3">On Mobile (iPhone/Android)</h4>
              <ol className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">1.</span>
                  <span>
                    Don't open the email yet - just view it in your inbox list
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">2.</span>
                  <span>Long-press or tap on the sender name</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">3.</span>
                  <span>Look at the actual email address (not just the display name)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">4.</span>
                  <span>Copy the address and check it with our tool</span>
                </li>
              </ol>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-3">On Desktop</h4>
              <ol className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">1.</span>
                  <span>Hover over the sender name (don't click)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">2.</span>
                  <span>The full email address will appear</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">3.</span>
                  <span>Copy and verify using our checker tool</span>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section id="using-checker" className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            Using the Spam Email Checker
          </h2>

          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-8 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Try It Now - 100% Free</h3>
            <p className="text-gray-300 mb-6">
              Our email checker analyzes sender addresses for common phishing patterns. No sign-up
              required, works offline.
            </p>
            
              <a href="/tools/spam-email-checker"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 
                       text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg"
            >
              <Shield className="w-5 h-5" />
              Open Spam Email Checker
            </a>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">How It Works:</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4">
                  <span className="text-2xl">1️⃣</span>
                </div>
                <h4 className="text-white font-bold mb-2">Paste Address</h4>
                <p className="text-gray-400 text-sm">
                  Copy the sender's email address and paste it into the checker
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                  <span className="text-2xl">2️⃣</span>
                </div>
                <h4 className="text-white font-bold mb-2">Instant Analysis</h4>
                <p className="text-gray-400 text-sm">
                  Get immediate results on typosquatting, suspicious patterns, and risk level
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <span className="text-2xl">3️⃣</span>
                </div>
                <h4 className="text-white font-bold mb-2">Stay Safe</h4>
                <p className="text-gray-400 text-sm">
                  Follow the recommendations to protect yourself from phishing
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section id="mobile-safety" className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Smartphone className="w-8 h-8 text-blue-400" />
            Mobile Email Safety
          </h2>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-6">
            <p className="text-gray-300 leading-relaxed">
              Since 84% of emails are opened on mobile, it's crucial to be extra careful on your
              phone. Mobile interfaces make it harder to spot fake emails.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Mobile-Specific Tips:</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">●</span>
                <span>
                  <strong>Don't trust what you see:</strong> Display names can be faked. Always
                  check the actual email address.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">●</span>
                <span>
                  <strong>Use our mobile checker:</strong> Bookmark our tool for quick access when
                  suspicious emails arrive.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">●</span>
                <span>
                  <strong>Never click links in suspicious emails:</strong> Even if the sender
                  looks legitimate, verify first.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">●</span>
                <span>
                  <strong>Be extra careful on public WiFi:</strong> Attackers often target people
                  on public networks.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 6 */}
        <section id="best-practices" className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Lock className="w-8 h-8 text-green-400" />
            Email Safety Best Practices
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-green-400 mb-4">✅ Do This</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Always verify sender addresses</li>
                <li>• Use two-factor authentication</li>
                <li>• Keep software updated</li>
                <li>• Report phishing emails</li>
                <li>• Use our checker tool regularly</li>
                <li>• Contact companies directly if unsure</li>
              </ul>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-red-400 mb-4">❌ Never Do This</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Click links in suspicious emails</li>
                <li>• Share passwords via email</li>
                <li>• Trust urgent requests for money</li>
                <li>• Download unexpected attachments</li>
                <li>• Reply with personal information</li>
                <li>• Ignore warning signs</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-12 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-8 text-center">
          <Shield className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Stay Protected Today</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Don't wait until it's too late. Check suspicious emails before opening them with our
            free, privacy-focused tool.
          </p>
          
            <a href="/tools/spam-email-checker"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 
                     text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg text-lg"
          >
            <Shield className="w-6 h-6" />
            Check Email Safety Now
          </a>
          <p className="text-gray-400 text-sm mt-4">
            100% Free • No Sign-up • Works Offline • Privacy Protected
          </p>
        </section>
      </div>

      {/* Related Tools */}
      <section className="mt-12 pt-12 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Related Security Tools</h2>
        <div className="grid md:grid-cols-3 gap-4">
          
            <a href="/tools/password-generator"
            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-500/30 transition-colors"
          >
            <Lock className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-white font-bold mb-2">Password Generator</h3>
            <p className="text-gray-400 text-sm">Create strong, secure passwords</p>
          </a>
          
            <a href="/tools/blurtap"
            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-500/30 transition-colors"
          >
            <Lock className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-white font-bold mb-2">BlurTap</h3>
            <p className="text-gray-400 text-sm">Hide sensitive info in images</p>
          </a>
          
            <a href="/tools/qr-code"
            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-500/30 transition-colors"
          >
            <Shield className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-white font-bold mb-2">QR Code Generator</h3>
            <p className="text-gray-400 text-sm">Create secure QR codes</p>
          </a>
        </div>
      </section>
    </article>
  )
}