
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Shield, Lock, Key, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Password Security Guide 2025 - Create Strong Passwords | AI AutoSite',
  description: 'Learn how to create and manage strong passwords. Best practices for online security. Free password generator included.',
  keywords: 'password security, strong passwords, password generator, online security, password tips',
  openGraph: {
    title: 'Complete Password Security Guide',
    description: 'Everything you need to know about creating strong passwords',
    type: 'article',
  },
}

export default function PasswordSecurityGuidePage() {
  const publishDate = '2025-01-20'
  const author = 'AI AutoSite Team'
  const readTime = '5 min read'

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        href="/blog" 
        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-8 group"
      >
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
        Back to Blog
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">
            Security
          </span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          How to Create Strong Passwords in 2025
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Your complete guide to password security. Learn what makes passwords strong 
          and how to protect your online accounts.
        </p>
      </header>

      <section className="space-y-12">
        {/* Why Strong Passwords Matter */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Why Password Strength Matters</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Data Breaches Daily</h3>
              <p className="text-gray-400 text-sm">
                30,000+ websites are hacked every day
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Lock className="w-8 h-8 text-yellow-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Weak Passwords</h3>
              <p className="text-gray-400 text-sm">
                80% of breaches involve weak passwords
              </p>
            </div>
          </div>
          <p className="text-gray-300">
            A strong password is your first defense against hackers. Weak passwords like "123456" 
            or "password" can be cracked in seconds. Strong passwords can take centuries to break.
          </p>
        </div>

        {/* What Makes a Strong Password */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">What Makes a Password Strong?</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <div>
                  <p className="text-white font-medium">Length: 12+ characters</p>
                  <p className="text-gray-400 text-sm">Every extra character makes it exponentially harder to crack</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <div>
                  <p className="text-white font-medium">Mix character types</p>
                  <p className="text-gray-400 text-sm">Use uppercase, lowercase, numbers, and symbols</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <div>
                  <p className="text-white font-medium">Avoid personal info</p>
                  <p className="text-gray-400 text-sm">No names, birthdays, or common words</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <div>
                  <p className="text-white font-medium">Unique for each account</p>
                  <p className="text-gray-400 text-sm">Never reuse passwords across sites</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Password Strength Examples */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Password Strength Examples</h2>
          <div className="space-y-3">
            <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
              <div className="flex justify-between items-center">
                <code className="text-red-400">password123</code>
                <span className="text-red-400 text-sm">Weak - Cracked in seconds</span>
              </div>
            </div>
            <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
              <div className="flex justify-between items-center">
                <code className="text-yellow-400">MyDog2024!</code>
                <span className="text-yellow-400 text-sm">OK - Cracked in days</span>
              </div>
            </div>
            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
              <div className="flex justify-between items-center">
                <code className="text-green-400">K9#mP2$vL8@nQ5</code>
                <span className="text-green-400 text-sm">Strong - Centuries to crack</span>
              </div>
            </div>
          </div>
        </div>

        {/* Common Mistakes */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Common Password Mistakes</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">✗</span>
              <p className="text-gray-300">
                <strong className="text-white">Dictionary words:</strong> "sunshine", "football", "dragon"
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">✗</span>
              <p className="text-gray-300">
                <strong className="text-white">Keyboard patterns:</strong> "qwerty", "123456", "qazwsx"
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">✗</span>
              <p className="text-gray-300">
                <strong className="text-white">Personal info:</strong> Your name, birthday, pet's name
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">✗</span>
              <p className="text-gray-300">
                <strong className="text-white">Simple substitutions:</strong> "P@ssw0rd" is still weak
              </p>
            </li>
          </ul>
        </div>

        {/* How to Remember */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">How to Remember Strong Passwords</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center font-bold">
                  1
                </span>
                <div>
                  <p className="text-white font-medium">Use a password manager</p>
                  <p className="text-gray-400 text-sm">Store all passwords securely in one place</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center font-bold">
                  2
                </span>
                <div>
                  <p className="text-white font-medium">Create a pattern system</p>
                  <p className="text-gray-400 text-sm">Use a base password + site-specific variation</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center font-bold">
                  3
                </span>
                <div>
                  <p className="text-white font-medium">Write them down safely</p>
                  <p className="text-gray-400 text-sm">Keep in a secure physical location, not on your computer</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Generate Your Strong Password Now
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Free password generator with customizable options. Create unbreakable passwords instantly.
        </p>
        <Link 
          href="/tools/password-generator" 
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Shield className="mr-2" size={20} />
          Try Password Generator
        </Link>
      </section>
    </article>
  )
}
