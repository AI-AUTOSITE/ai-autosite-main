// app/blog/blurtap-guide/page.tsx
import Link from 'next/link';
import { Metadata } from 'next';
import { Shield, Lock, Eye, CheckCircle, ArrowLeft, ExternalLink, AlertTriangle, Camera, FileImage, Share2, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'BlurTap - One-Click Privacy Protection for Screenshots | AI-AutoSite',
  description: 'Instantly blur sensitive information in images with BlurTap. 100% local processing, no data uploads. Perfect for bug reports, documentation, and social sharing.',
  keywords: 'blurtap, screenshot privacy, blur tool, image masking, privacy protection, sensitive data, local processing, gdpr compliant',
  authors: [{ name: 'AI-AutoSite Team' }],
  creator: 'AI-AutoSite',
  publisher: 'AI-AutoSite',
  robots: 'index, follow, max-image-preview:large',
  openGraph: {
    title: 'BlurTap - Protect Privacy in Screenshots with One Click',
    description: 'Mask sensitive information instantly. 100% local processing, no uploads required.',
    type: 'article',
    url: 'https://ai-autosite.com/blog/blurtap-guide',
    siteName: 'AI-AutoSite',
    publishedTime: '2025-01-30T00:00:00.000Z',
    modifiedTime: '2025-01-30T00:00:00.000Z',
    authors: ['AI-AutoSite Team'],
    tags: ['Privacy', 'Screenshots', 'Tools', 'Security'],
    images: [{
      url: 'https://ai-autosite.com/og/blurtap-guide.png',
      width: 1200,
      height: 630,
      alt: 'BlurTap Privacy Tool Guide'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ai_autosite',
    creator: '@ai_autosite',
    title: 'BlurTap - Screenshot Privacy Tool',
    description: 'Mask sensitive information instantly with one click.',
    images: ['https://ai-autosite.com/og/blurtap-guide.png']
  },
  alternates: {
    canonical: 'https://ai-autosite.com/blog/blurtap-guide'
  }
};

export default function BlurTapGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900">
      {/* Background animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0">
        <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/blog" className="text-white hover:text-cyan-400 transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          <Link 
            href="/tools/blurtap"
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
          >
            Try BlurTap Now
          </Link>
        </nav>
      </header>

      {/* Article */}
      <article className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            PRIVACY TOOL
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            BlurTap: One-Click Privacy for Screenshots
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Instantly mask sensitive information in your images. 
            100% local processing means your data never leaves your browser.
          </p>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              10 seconds to use
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Lock className="w-4 h-4" />
              100% Local
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              GDPR Compliant
            </span>
          </div>
        </div>

        {/* CTA Box */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-8 mb-12">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-bold text-white mb-2">Ready to protect your screenshots?</h3>
              <p className="text-gray-400">No signup, no uploads, just instant privacy protection.</p>
            </div>
            <Link 
              href="/tools/blurtap"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all flex items-center gap-2"
            >
              Launch BlurTap
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          
          {/* What is BlurTap Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">What is BlurTap?</h2>
            
            <p className="text-gray-300 mb-6">
              BlurTap is a privacy-first tool that lets you quickly mask sensitive information in screenshots 
              before sharing them. Unlike traditional blur effects that can be reversed, BlurTap uses solid 
              masking to permanently hide selected areas.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                <Camera className="w-8 h-8 text-cyan-400 mb-4" />
                <h3 className="font-semibold text-white mb-2">Upload & Click</h3>
                <p className="text-sm text-gray-400">
                  Upload any image and click on areas to mask. Simple as that.
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                <Lock className="w-8 h-8 text-green-400 mb-4" />
                <h3 className="font-semibold text-white mb-2">100% Private</h3>
                <p className="text-sm text-gray-400">
                  All processing happens in your browser. No server uploads ever.
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                <FileImage className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="font-semibold text-white mb-2">Download Ready</h3>
                <p className="text-sm text-gray-400">
                  Export your masked image instantly. Original quality maintained.
                </p>
              </div>
            </div>
          </section>

          {/* Why Use BlurTap Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Why Use BlurTap?</h2>
            
            <div className="bg-orange-500/10 border-l-4 border-orange-400 p-6 mb-6 rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-orange-300 mb-2">The Problem with Traditional Blurring</h3>
                  <p className="text-orange-200 text-sm">
                    Gaussian blur and pixelation can be reversed using AI and deconvolution techniques. 
                    If you're blurring sensitive data, you're not actually protecting it.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-500/10 border-l-4 border-green-400 p-6 mb-8 rounded-r-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-300 mb-2">The BlurTap Solution</h3>
                  <p className="text-green-200 text-sm">
                    Solid color masking is irreversible. Once masked with BlurTap, 
                    the original data cannot be recovered by any means.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Perfect For</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                <h3 className="font-semibold text-cyan-400 mb-3">🐛 Bug Reports</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Share screenshots with developers without exposing user data, 
                  emails, or personal information.
                </p>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Hide user emails and IDs</li>
                  <li>• Mask sensitive form data</li>
                  <li>• Keep error messages visible</li>
                </ul>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                <h3 className="font-semibold text-purple-400 mb-3">📚 Documentation</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Create clean examples for tutorials without revealing 
                  production data or API keys.
                </p>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Hide API credentials</li>
                  <li>• Mask database entries</li>
                  <li>• Protect configuration details</li>
                </ul>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                <h3 className="font-semibold text-green-400 mb-3">💼 Client Presentations</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Show dashboards and reports while keeping confidential 
                  metrics and customer data private.
                </p>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Hide revenue numbers</li>
                  <li>• Mask customer names</li>
                  <li>• Protect competitive data</li>
                </ul>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                <h3 className="font-semibold text-orange-400 mb-3">📱 Social Sharing</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Post screenshots on social media without worrying about 
                  accidentally sharing private information.
                </p>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Hide personal messages</li>
                  <li>• Mask location data</li>
                  <li>• Protect contact information</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How to Use Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">How to Use BlurTap</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Upload Your Image</h3>
                  <p className="text-gray-400 text-sm">
                    Click or drag to upload any image. Supports JPG, PNG, WebP formats.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Click to Mask</h3>
                  <p className="text-gray-400 text-sm">
                    Simply click on any area you want to hide. Adjust the brush size as needed.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Download & Share</h3>
                  <p className="text-gray-400 text-sm">
                    Download your masked image and share it safely anywhere.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Key Features</h2>
            
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-500/20 rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <strong className="text-white">No Registration Required</strong>
                      <p className="text-gray-400 text-sm">Start using immediately, no account needed</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <strong className="text-white">Multiple Mask Sizes</strong>
                      <p className="text-gray-400 text-sm">Adjustable brush for precise masking</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <strong className="text-white">Undo/Redo Support</strong>
                      <p className="text-gray-400 text-sm">Mistake? No problem, just undo</p>
                    </div>
                  </li>
                </ul>

                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <strong className="text-white">Original Quality</strong>
                      <p className="text-gray-400 text-sm">No compression or quality loss</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <strong className="text-white">Fast Processing</strong>
                      <p className="text-gray-400 text-sm">Instant masking with no delays</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <strong className="text-white">Mobile Friendly</strong>
                      <p className="text-gray-400 text-sm">Works on phones and tablets too</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Privacy Guarantee Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Our Privacy Guarantee</h2>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <Lock className="w-6 h-6 text-green-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-300 mb-2">100% Local Processing</h3>
                  <p className="text-gray-300">
                    BlurTap runs entirely in your browser using JavaScript. Your images are never uploaded 
                    to any server, never stored anywhere, and never leave your device. We literally cannot 
                    see your images even if we wanted to.
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="bg-green-900/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400">0</div>
                  <div className="text-sm text-gray-400">Images uploaded</div>
                </div>
                <div className="bg-green-900/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400">0</div>
                  <div className="text-sm text-gray-400">Data collected</div>
                </div>
                <div className="bg-green-900/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400">0</div>
                  <div className="text-sm text-gray-400">Cookies used</div>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Start Protecting Your Screenshots Today
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of developers, designers, and privacy-conscious users who trust BlurTap 
            to keep their sensitive information safe.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/tools/blurtap"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
            >
              <Shield className="w-5 h-5 mr-2" />
              Try BlurTap Free
            </Link>
            <Link 
              href="/blog/privacy-in-development"
              className="inline-flex items-center px-8 py-4 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all border border-white/20"
            >
              Learn About Privacy Development
            </Link>
          </div>
        </div>

        {/* Related Tools */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <h3 className="text-xl font-bold text-white mb-6">Related Privacy Tools</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/tools/password-generator" className="block p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h4 className="font-semibold text-white">Password Generator</h4>
              </div>
              <p className="text-sm text-gray-400">Create strong, secure passwords for your accounts.</p>
            </Link>
            <Link href="/tools/qr-code" className="block p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Share2 className="w-5 h-5 text-purple-400" />
                <h4 className="font-semibold text-white">QR Code Generator</h4>
              </div>
              <p className="text-sm text-gray-400">Generate QR codes for secure information sharing.</p>
            </Link>
            <Link href="/tools/base64" className="block p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Lock className="w-5 h-5 text-green-400" />
                <h4 className="font-semibold text-white">Base64 Encoder</h4>
              </div>
              <p className="text-sm text-gray-400">Encode sensitive data for safe transmission.</p>
            </Link>
          </div>
        </div>

      </article>
    </div>
  );
}