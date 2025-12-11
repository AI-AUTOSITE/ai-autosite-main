import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Code, Shield, Zap, BookOpen, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Regex Tester Guide - Master Regular Expressions | AI AutoSite',
  description:
    'Learn to test and debug regular expressions effectively. Understand ReDoS vulnerabilities, regex flags, and best practices. Free online regex tester guide.',
  keywords:
    'regex tester guide, regular expression tutorial, regex patterns, ReDoS prevention, regex flags, pattern matching',
  openGraph: {
    title: 'Regex Tester - Complete Regular Expression Guide',
    description: 'Master regular expressions with our comprehensive guide and free online tester',
    type: 'article',
  },
}

export default function RegexTesterGuidePage() {
  const publishDate = '2025-12-04'
  const author = 'AI AutoSite Team'
  const readTime = '6 min read'

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/blog"
        className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-8 group"
      >
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
        Back to Blog
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full">Dev Tools</span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Regex Tester Complete Guide
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Master regular expressions with real-time testing, ReDoS detection, and code generation.
          Learn regex patterns and avoid common security pitfalls.
        </p>
      </header>

      <section className="space-y-12">
        {/* What is Regex */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">What is a Regular Expression?</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-300 mb-4">
              A regular expression (regex) is a sequence of characters that defines a search pattern.
              It&apos;s used for pattern matching, validation, and text manipulation in programming.
            </p>
            <div className="bg-white/10 rounded-lg p-4 font-mono text-orange-400 text-sm">
              /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{'{'}2,{'}'}/g
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Example: Email validation pattern matching user@domain.com format
            </p>
          </div>
        </div>

        {/* Common Regex Patterns */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Essential Regex Patterns</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="text-white pb-3">Pattern</th>
                  <th className="text-white pb-3">Meaning</th>
                  <th className="text-white pb-3">Example</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3 font-mono text-orange-400">\d</td>
                  <td className="py-3">Any digit (0-9)</td>
                  <td className="py-3 text-gray-400">Matches: 5, 9, 0</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 font-mono text-orange-400">\w</td>
                  <td className="py-3">Word character (a-z, A-Z, 0-9, _)</td>
                  <td className="py-3 text-gray-400">Matches: a, Z, _</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 font-mono text-orange-400">\s</td>
                  <td className="py-3">Whitespace</td>
                  <td className="py-3 text-gray-400">Matches: space, tab</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 font-mono text-orange-400">.</td>
                  <td className="py-3">Any character (except newline)</td>
                  <td className="py-3 text-gray-400">Matches: a, 1, @</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 font-mono text-orange-400">^</td>
                  <td className="py-3">Start of string/line</td>
                  <td className="py-3 text-gray-400">^Hello matches &quot;Hello world&quot;</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 font-mono text-orange-400">$</td>
                  <td className="py-3">End of string/line</td>
                  <td className="py-3 text-gray-400">world$ matches &quot;Hello world&quot;</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-orange-400">[abc]</td>
                  <td className="py-3">Character set</td>
                  <td className="py-3 text-gray-400">Matches: a, b, or c</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quantifiers */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Quantifiers</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <code className="text-orange-400 font-mono">*</code>
                <p className="text-gray-300 text-sm mt-1">Zero or more</p>
                <p className="text-gray-500 text-xs">a* matches &quot;&quot;, &quot;a&quot;, &quot;aaa&quot;</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <code className="text-orange-400 font-mono">+</code>
                <p className="text-gray-300 text-sm mt-1">One or more</p>
                <p className="text-gray-500 text-xs">a+ matches &quot;a&quot;, &quot;aaa&quot;</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <code className="text-orange-400 font-mono">?</code>
                <p className="text-gray-300 text-sm mt-1">Zero or one (optional)</p>
                <p className="text-gray-500 text-xs">colou?r matches &quot;color&quot;, &quot;colour&quot;</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <code className="text-orange-400 font-mono">{'{'}n{'}'}</code>
                <p className="text-gray-300 text-sm mt-1">Exactly n times</p>
                <p className="text-gray-500 text-xs">\d{'{'}3{'}'} matches &quot;123&quot;</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <code className="text-orange-400 font-mono">{'{'}n,{'}'}</code>
                <p className="text-gray-300 text-sm mt-1">n or more times</p>
                <p className="text-gray-500 text-xs">\d{'{'}2,{'}'} matches &quot;12&quot;, &quot;123456&quot;</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <code className="text-orange-400 font-mono">{'{'}n,m{'}'}</code>
                <p className="text-gray-300 text-sm mt-1">Between n and m times</p>
                <p className="text-gray-500 text-xs">\d{'{'}2,4{'}'} matches &quot;12&quot;, &quot;1234&quot;</p>
              </div>
            </div>
          </div>
        </div>

        {/* Regex Flags */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Regex Flags Explained</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-4">
            <div className="flex items-start gap-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <span className="text-purple-400 font-mono font-bold">g</span>
              <div>
                <p className="text-white font-medium">Global</p>
                <p className="text-gray-400 text-sm">Find all matches instead of stopping at the first match</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <span className="text-cyan-400 font-mono font-bold">i</span>
              <div>
                <p className="text-white font-medium">Case Insensitive</p>
                <p className="text-gray-400 text-sm">Match both uppercase and lowercase letters</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <span className="text-green-400 font-mono font-bold">m</span>
              <div>
                <p className="text-white font-medium">Multiline</p>
                <p className="text-gray-400 text-sm">^ and $ match start/end of each line, not just string</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <span className="text-yellow-400 font-mono font-bold">s</span>
              <div>
                <p className="text-white font-medium">Dotall (Single line)</p>
                <p className="text-gray-400 text-sm">. matches newline characters too</p>
              </div>
            </div>
          </div>
        </div>

        {/* ReDoS Security */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-yellow-400" />
            ReDoS Vulnerability Prevention
          </h2>
          <div className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/20">
            <p className="text-gray-300 mb-4">
              <strong className="text-yellow-400">ReDoS (Regular Expression Denial of Service)</strong> occurs 
              when a regex pattern causes catastrophic backtracking, freezing your application.
            </p>
            
            <h3 className="text-white font-medium mt-6 mb-3">Dangerous Patterns to Avoid:</h3>
            <div className="space-y-2">
              <div className="p-3 bg-red-500/10 rounded-lg flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <code className="text-red-400 font-mono">(a+)+</code>
                <span className="text-gray-400 text-sm">Nested quantifiers</span>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <code className="text-red-400 font-mono">(a|aa)+</code>
                <span className="text-gray-400 text-sm">Overlapping alternatives</span>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <code className="text-red-400 font-mono">(.*a){'{'}10{'}'}</code>
                <span className="text-gray-400 text-sm">Greedy quantifiers in groups</span>
              </div>
            </div>

            <h3 className="text-white font-medium mt-6 mb-3">Safe Alternatives:</h3>
            <div className="space-y-2">
              <div className="p-3 bg-green-500/10 rounded-lg flex items-center gap-3">
                <Zap className="w-5 h-5 text-green-400 flex-shrink-0" />
                <code className="text-green-400 font-mono">a+</code>
                <span className="text-gray-400 text-sm">Simple quantifier (no nesting)</span>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg flex items-center gap-3">
                <Zap className="w-5 h-5 text-green-400 flex-shrink-0" />
                <code className="text-green-400 font-mono">[^a]*a</code>
                <span className="text-gray-400 text-sm">Negated character class</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-8 border border-orange-500/30 text-center">
          <Code className="w-12 h-12 text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Try Our Regex Tester</h2>
          <p className="text-gray-300 mb-6">
            Test your patterns with real-time matching, ReDoS detection, and code generation for 6+ languages.
          </p>
          <Link
            href="/tools/regex-tester"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Open Regex Tester
          </Link>
        </div>

        {/* Quick Reference */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Quick Reference Cheat Sheet</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-medium mb-3">Character Classes</h3>
                <div className="space-y-1 font-mono text-sm">
                  <p><span className="text-orange-400">\d</span> <span className="text-gray-400">= [0-9]</span></p>
                  <p><span className="text-orange-400">\w</span> <span className="text-gray-400">= [A-Za-z0-9_]</span></p>
                  <p><span className="text-orange-400">\s</span> <span className="text-gray-400">= whitespace</span></p>
                  <p><span className="text-orange-400">\D, \W, \S</span> <span className="text-gray-400">= negated</span></p>
                </div>
              </div>
              <div>
                <h3 className="text-white font-medium mb-3">Lookaround</h3>
                <div className="space-y-1 font-mono text-sm">
                  <p><span className="text-orange-400">(?=...)</span> <span className="text-gray-400">= lookahead</span></p>
                  <p><span className="text-orange-400">(?!...)</span> <span className="text-gray-400">= negative lookahead</span></p>
                  <p><span className="text-orange-400">(?&lt;=...)</span> <span className="text-gray-400">= lookbehind</span></p>
                  <p><span className="text-orange-400">(?&lt;!...)</span> <span className="text-gray-400">= negative lookbehind</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-12 pt-8 border-t border-white/10">
        <p className="text-gray-400 text-sm">
          Written by {author} • Last updated {publishDate}
        </p>
      </footer>
    </article>
  )
}
