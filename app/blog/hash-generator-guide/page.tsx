import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Hash, Shield, ShieldAlert, ShieldCheck, FileText, Key, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hash Generator Guide - MD5, SHA-256, SHA-512 Explained | AI AutoSite',
  description:
    'Learn how to generate MD5, SHA-256, SHA-512 hashes. Understand hash algorithms, security implications, and best practices for cryptographic hashing.',
  keywords:
    'hash generator, md5 generator, sha256 online, sha512 hash, checksum calculator, hmac generator, cryptographic hash, hash verification',
  openGraph: {
    title: 'Hash Generator Complete Guide - Cryptographic Hashing Explained',
    description: 'Master cryptographic hashing with our comprehensive guide covering MD5, SHA-256, SHA-512, HMAC, and security best practices.',
    type: 'article',
  },
}

export default function HashGeneratorGuidePage() {
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
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full">Security</span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Hash Generator Complete Guide
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Everything you need to know about cryptographic hash functions, from MD5 to SHA-512.
          Learn which algorithms to use, security considerations, and practical applications.
        </p>
      </header>

      <section className="space-y-12">
        {/* What is Hashing */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">What is Cryptographic Hashing?</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-300 mb-4">
              A hash function takes an input (or &quot;message&quot;) and returns a fixed-size string of bytes.
              The output is deterministic—the same input always produces the same hash—but it&apos;s
              computationally infeasible to reverse the process.
            </p>
            <div className="bg-white/10 rounded-lg p-4 font-mono text-sm space-y-2">
              <p className="text-gray-400">Input: <span className="text-white">Hello, World!</span></p>
              <p className="text-gray-400">MD5: <span className="text-cyan-400">65a8e27d8879283831b664bd8b7f0ad4</span></p>
              <p className="text-gray-400">SHA-256: <span className="text-green-400">dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f</span></p>
            </div>
          </div>
        </div>

        {/* Hash Algorithm Comparison */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Hash Algorithm Comparison</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="text-white pb-3">Algorithm</th>
                  <th className="text-white pb-3">Output Size</th>
                  <th className="text-white pb-3">Security Status</th>
                  <th className="text-white pb-3">Use Case</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3 text-yellow-400 font-mono">MD5</td>
                  <td className="py-3">128 bits (32 hex)</td>
                  <td className="py-3">
                    <span className="flex items-center gap-1 text-red-400">
                      <ShieldAlert className="w-4 h-4" /> Broken
                    </span>
                  </td>
                  <td className="py-3">Legacy checksums only</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-yellow-400 font-mono">SHA-1</td>
                  <td className="py-3">160 bits (40 hex)</td>
                  <td className="py-3">
                    <span className="flex items-center gap-1 text-yellow-400">
                      <AlertTriangle className="w-4 h-4" /> Deprecated
                    </span>
                  </td>
                  <td className="py-3">Git (legacy), certificates</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-green-400 font-mono">SHA-256</td>
                  <td className="py-3">256 bits (64 hex)</td>
                  <td className="py-3">
                    <span className="flex items-center gap-1 text-green-400">
                      <ShieldCheck className="w-4 h-4" /> Secure
                    </span>
                  </td>
                  <td className="py-3">General purpose, Bitcoin</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-green-400 font-mono">SHA-384</td>
                  <td className="py-3">384 bits (96 hex)</td>
                  <td className="py-3">
                    <span className="flex items-center gap-1 text-green-400">
                      <ShieldCheck className="w-4 h-4" /> Secure
                    </span>
                  </td>
                  <td className="py-3">TLS, high security</td>
                </tr>
                <tr>
                  <td className="py-3 text-green-400 font-mono">SHA-512</td>
                  <td className="py-3">512 bits (128 hex)</td>
                  <td className="py-3">
                    <span className="flex items-center gap-1 text-green-400">
                      <ShieldCheck className="w-4 h-4" /> Secure
                    </span>
                  </td>
                  <td className="py-3">Maximum security applications</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Warning */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Security Considerations</h2>
          <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-2">Never Use MD5 or SHA-1 for Security</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• MD5 collision attacks are trivial—two different inputs can produce the same hash</li>
                  <li>• SHA-1 was broken in 2017 (SHAttered attack by Google)</li>
                  <li>• Both are deprecated by NIST for cryptographic use</li>
                  <li>• Use SHA-256 or SHA-512 for any security-sensitive application</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Password Hashing Warning */}
        <div>
          <div className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/20">
            <div className="flex items-start gap-3">
              <Key className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">Password Hashing is Different</h3>
                <p className="text-gray-300 text-sm mb-3">
                  General-purpose hash functions (MD5, SHA-256) are NOT suitable for password storage.
                  They&apos;re designed to be fast, which makes brute-force attacks easier.
                </p>
                <p className="text-gray-300 text-sm">
                  <strong className="text-white">For passwords, use:</strong> Argon2id (recommended), bcrypt, or scrypt.
                  These algorithms are intentionally slow and include salt to prevent rainbow table attacks.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* HMAC */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">What is HMAC?</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-300 mb-4">
              HMAC (Hash-based Message Authentication Code) combines a secret key with a hash function
              to verify both data integrity and authenticity. Unlike plain hashes, HMACs prove that
              the message came from someone who knows the secret key.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Plain Hash</h4>
                <p className="text-gray-400 text-sm">Anyone can generate the same hash for known data</p>
              </div>
              <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                <h4 className="text-green-400 font-semibold mb-2">HMAC</h4>
                <p className="text-gray-400 text-sm">Only someone with the secret key can generate a valid HMAC</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Common uses: API authentication, JWT signatures, secure cookies, webhook verification
            </p>
          </div>
        </div>

        {/* Use Cases */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Common Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <FileText className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="text-white font-semibold mb-2">File Integrity</h3>
              <p className="text-gray-400 text-sm">
                Verify downloaded files match the original. Compare SHA-256 checksums
                to detect corruption or tampering.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <Shield className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-white font-semibold mb-2">Data Deduplication</h3>
              <p className="text-gray-400 text-sm">
                Storage systems use hashes to identify duplicate files without
                comparing entire file contents.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <Hash className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="text-white font-semibold mb-2">Blockchain</h3>
              <p className="text-gray-400 text-sm">
                Bitcoin and other cryptocurrencies use SHA-256 for proof-of-work
                mining and transaction verification.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <Key className="w-8 h-8 text-yellow-400 mb-3" />
              <h3 className="text-white font-semibold mb-2">API Security</h3>
              <p className="text-gray-400 text-sm">
                HMAC signatures authenticate API requests, ensuring requests
                haven&apos;t been tampered with in transit.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Quick Reference: Identify Hash by Length</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="space-y-3 font-mono text-sm">
              <div className="flex items-center gap-4">
                <span className="text-gray-400 w-24">32 chars</span>
                <span className="text-yellow-400">→ MD5</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-400 w-24">40 chars</span>
                <span className="text-yellow-400">→ SHA-1</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-400 w-24">64 chars</span>
                <span className="text-green-400">→ SHA-256</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-400 w-24">96 chars</span>
                <span className="text-green-400">→ SHA-384</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-400 w-24">128 chars</span>
                <span className="text-green-400">→ SHA-512</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-2xl p-8 border border-green-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">Try Our Hash Generator</h2>
          <p className="text-gray-300 mb-6">
            Generate MD5, SHA-256, SHA-512 hashes instantly. 100% client-side processing—your data
            never leaves your browser.
          </p>
          <Link
            href="/tools/hash-generator"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            <Hash className="w-5 h-5" />
            Open Hash Generator
          </Link>
        </div>
      </section>

      <footer className="mt-12 pt-8 border-t border-white/10">
        <p className="text-gray-400 text-sm">
          Written by {author} • Published {publishDate}
        </p>
      </footer>
    </article>
  )
}
