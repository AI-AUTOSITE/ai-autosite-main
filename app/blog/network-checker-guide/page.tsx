// app/blog/network-checker-guide/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Wifi, AlertCircle, CheckCircle, Smartphone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Network Checker Guide - Fix Connection Problems Fast | AI AutoSite',
  description:
    'Can\'t connect two devices? Learn how to use Network Checker to diagnose and fix connection problems in 60 seconds. Simple troubleshooting for everyone.',
  keywords: 'network checker guide, ip address troubleshooting, device connection problems, network diagnostic tool',
  openGraph: {
    title: 'Network Checker Guide - Fix Device Connections',
    description: 'Simple guide to troubleshoot network connection problems.',
    type: 'article',
    publishedTime: '2025-10-18',
  },
  alternates: {
    canonical: 'https://ai-autosite.com/blog/network-checker-guide',
  },
}

export default function NetworkCheckerGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog</span>
        </Link>

        {/* Article */}
        <article className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 md:p-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-cyan-400 mb-4">
              <Wifi className="w-5 h-5" />
              <span className="text-sm font-medium">Developer Tools</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Network Checker: Fix Connection Problems in 60 Seconds
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>October 18, 2025</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              Can't connect your scanner to your computer? Printer won't show up on the network? 
              You're not alone. Network connection problems are frustrating, but they're usually easy to fix 
              once you know what to look for.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">What is Network Checker?</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Network Checker is a simple tool that helps you understand why two devices can't connect. 
              It checks if your devices are on the same network by comparing their IP addresses.
            </p>

            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-6 my-8">
              <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Quick Start
              </h3>
              <ol className="space-y-2 text-gray-300">
                <li><strong>1.</strong> Enter device names (e.g., "Scanner", "My Computer")</li>
                <li><strong>2.</strong> Type IP addresses (find in Settings → Network)</li>
                <li><strong>3.</strong> Click "Check Connection"</li>
                <li><strong>4.</strong> Follow the fix steps</li>
              </ol>
            </div>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Common Problems & Solutions</h2>

            <h3 className="text-xl font-bold text-white mt-6 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              Problem: Different Networks
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              This is the most common issue. Your devices are connected to different networks.
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
              <p className="text-white font-medium mb-2">How to fix:</p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Find which device uses wired connection</li>
                <li>• Connect other devices to the same router</li>
                <li>• Use wired cable if possible (more stable)</li>
              </ul>
            </div>

            <h3 className="text-xl font-bold text-white mt-6 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Problem: Same Network But Can't Connect
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Devices are on the same network but still can't connect? Check these:
            </p>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Firewall settings (allow file sharing)</li>
                <li>• File sharing enabled on both devices</li>
                <li>• Correct folder permissions</li>
                <li>• Both devices turned on</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Understanding IP Addresses</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              An IP address looks like this: <code className="text-cyan-400">192.168.1.100</code>
            </p>
            <p className="text-gray-300 leading-relaxed mb-6">
              The first three numbers (192.168.1) identify the network. The last number (100) identifies 
              the specific device. For devices to connect, the first three numbers must match.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm mb-6">
              <p className="text-green-400">✓ Same network:</p>
              <p className="text-gray-300">Device A: <span className="text-cyan-400">192.168.1</span>.100</p>
              <p className="text-gray-300">Device B: <span className="text-cyan-400">192.168.1</span>.200</p>
              <p className="text-red-400 mt-4">✗ Different networks:</p>
              <p className="text-gray-300">Device A: <span className="text-yellow-400">192.168.1</span>.100</p>
              <p className="text-gray-300">Device B: <span className="text-purple-400">192.168.11</span>.27</p>
            </div>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">How to Find Your IP Address</h2>
            
            <h3 className="text-lg font-bold text-white mt-4 mb-2">Windows:</h3>
            <ol className="space-y-2 text-gray-300 mb-4">
              <li>1. Open Settings</li>
              <li>2. Go to Network & Internet</li>
              <li>3. Click Properties</li>
              <li>4. Look for IPv4 address</li>
            </ol>

            <h3 className="text-lg font-bold text-white mt-4 mb-2">Mac:</h3>
            <ol className="space-y-2 text-gray-300 mb-4">
              <li>1. Open System Preferences</li>
              <li>2. Click Network</li>
              <li>3. Select your connection</li>
              <li>4. IP address is shown</li>
            </ol>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Tips for Success</h2>
            <ul className="space-y-3 text-gray-300 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">•</span>
                <span>Wired connections are more stable than WiFi</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">•</span>
                <span>Keep device names simple (no special characters)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">•</span>
                <span>Restart devices if problems persist</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 flex-shrink-0">•</span>
                <span>Ask your IT admin if you're in an office</span>
              </li>
            </ul>

            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-6 my-8">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">Try It Now!</h3>
              <p className="text-gray-300 mb-4">
                Ready to fix your connection problems? Use Network Checker to diagnose the issue in 60 seconds.
              </p>
              <Link
                href="/tools/network-checker"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 
                         text-white rounded-lg font-medium hover:opacity-90 transition-all"
              >
                <Wifi className="w-5 h-5" />
                <span>Open Network Checker</span>
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Frequently Asked Questions</h2>
            
            <h3 className="text-lg font-bold text-white mt-4 mb-2">Do I need technical knowledge?</h3>
            <p className="text-gray-300 mb-4">
              No! Network Checker uses simple language and gives clear instructions. 
              If you can find your IP address, you can use this tool.
            </p>

            <h3 className="text-lg font-bold text-white mt-4 mb-2">Is my data safe?</h3>
            <p className="text-gray-300 mb-4">
              Yes! Everything happens in your browser. No data is sent to any server. 
              It works 100% offline.
            </p>

            <h3 className="text-lg font-bold text-white mt-4 mb-2">Does it work on mobile?</h3>
            <p className="text-gray-300 mb-4">
              Yes! Network Checker is fully mobile-optimized and works on phones and tablets.
            </p>

            <h3 className="text-lg font-bold text-white mt-4 mb-2">What if I need more help?</h3>
            <p className="text-gray-300 mb-4">
              Network Checker includes an AI assistant (beta) that can answer your specific questions. 
              Just type your question and get personalized help.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <Link
              href="/tools/network-checker"
              className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 
                       text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-cyan-600/30"
            >
              <Wifi className="w-5 h-5" />
              <span>Try Network Checker Now</span>
            </Link>
          </div>
        </article>

        {/* Related tools */}
        <div className="mt-12">
          <h2 className="text-white font-bold text-xl mb-4">Related Tools</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/tools/qr-code"
              className="bg-white/5 backdrop-blur-xl rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all"
            >
              <h3 className="text-white font-medium mb-2">QR Code Maker</h3>
              <p className="text-gray-400 text-sm">Create QR codes instantly</p>
            </Link>
            <Link
              href="/tools/password-generator"
              className="bg-white/5 backdrop-blur-xl rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all"
            >
              <h3 className="text-white font-medium mb-2">Password Generator</h3>
              <p className="text-gray-400 text-sm">Generate secure passwords</p>
            </Link>
            <Link
              href="/tools/base64"
              className="bg-white/5 backdrop-blur-xl rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all"
            >
              <h3 className="text-white font-medium mb-2">Base64 Tool</h3>
              <p className="text-gray-400 text-sm">Encode and decode Base64</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}