import Link from 'next/link'
import { Metadata } from 'next'
import { 
  ArrowLeft, 
  QrCode, 
  Download, 
  Smartphone, 
  Store, 
  Wifi, 
  User, 
  Palette, 
  Image, 
  Shield, 
  Infinity,
  Sparkles,
  Check,
  X
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Free QR Code Generator with Logo - No Expiration Guide 2025 | AI AutoSite',
  description:
    'Create QR codes with FREE logo embedding, custom colors & styles. Unlike QRMonkey, your codes never expire. 100% private, no server uploads.',
  keywords:
    'qr code generator, free qr code with logo, qr code maker no expiration, qrmonkey alternative, wifi qr code, vcard qr code, custom qr colors',
  openGraph: {
    title: 'Free QR Code Generator with Logo - No Expiration, No Ads',
    description:
      'Create custom QR codes with free logo embedding. No 14-day limits. 100% private.',
    type: 'article',
  },
}

export default function QRCodeGuidePage() {
  const publishDate = '2025-11-24'
  const author = 'AI AutoSite Team'
  const readTime = '6 min read'

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
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 flex-wrap">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">Quick Tools</span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Free QR Code Generator with Logo - Complete Guide 2025
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Create custom QR codes with free logo embedding, 8 color presets, and 6 dot styles. 
          Unlike other services, your codes never expire and everything runs 100% in your browser.
        </p>
      </header>

      <section className="space-y-12">
        {/* Why This Tool */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl p-6 border border-emerald-500/20">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            Why This QR Code Generator?
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" />
                <span className="text-gray-300">Logo embedding - <strong className="text-emerald-400">FREE</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" />
                <span className="text-gray-300">No expiration - codes work forever</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" />
                <span className="text-gray-300">100% private - no server uploads</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" />
                <span className="text-gray-300">No ads, no signup required</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <X className="w-5 h-5 text-red-400" />
                <span className="text-gray-400 line-through">QRMonkey - 14 day expiration</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="w-5 h-5 text-red-400" />
                <span className="text-gray-400 line-through">Other tools - $60+/year for logos</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="w-5 h-5 text-red-400" />
                <span className="text-gray-400 line-through">Most sites - data uploaded to servers</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="w-5 h-5 text-red-400" />
                <span className="text-gray-400 line-through">Free tiers - covered in ads</span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Types */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">4 QR Code Types</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <QrCode className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Text</h3>
              <p className="text-gray-400 text-sm">
                Any message up to 2000 characters. Perfect for promotions, quotes, or hidden messages.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Store className="w-8 h-8 text-purple-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">URL</h3>
              <p className="text-gray-400 text-sm">
                Website links, social media profiles, or any web address. One scan opens the page.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Wifi className="w-8 h-8 text-cyan-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">WiFi</h3>
              <p className="text-gray-400 text-sm">
                Share WiFi passwords instantly. Guests scan and connect - no typing required.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <User className="w-8 h-8 text-pink-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">vCard (Contact)</h3>
              <p className="text-gray-400 text-sm">
                Digital business card with name, email, phone, company. One scan saves to contacts.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Customization Features</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
              <Palette className="w-8 h-8 text-purple-400 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold mb-1">8 Color Presets + Custom Colors</h3>
                <p className="text-gray-400 text-sm">
                  Choose from Classic, Midnight, Ocean, Forest, Berry, Sunset, Royal, or Slate. 
                  Or pick any custom foreground and background colors with contrast checking.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
              <QrCode className="w-8 h-8 text-cyan-400 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold mb-1">6 Dot Styles</h3>
                <p className="text-gray-400 text-sm">
                  Square, Dots, Rounded, Pill, Classy, or Elegant. Match your brand aesthetic.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
              <Image className="w-8 h-8 text-pink-400 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold mb-1">Free Logo Embedding</h3>
                <p className="text-gray-400 text-sm">
                  Add your company logo to the center of your QR code. Most services charge $60+/year for this feature.
                  Error correction automatically adjusts to ensure scannability.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
              <Download className="w-8 h-8 text-green-400 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold mb-1">Multiple Formats & Sizes</h3>
                <p className="text-gray-400 text-sm">
                  Download as PNG, SVG, or JPEG. Choose from 256px (small), 512px (medium), or 1024px (large).
                  SVG is perfect for print at any size.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Create */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">How to Create a QR Code</h2>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center font-bold">
                1
              </span>
              <div>
                <p className="text-white font-medium">Choose QR type</p>
                <p className="text-gray-400 text-sm mt-1">
                  Select Text, URL, WiFi, or Contact (vCard) based on what you want to encode.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center font-bold">
                2
              </span>
              <div>
                <p className="text-white font-medium">Enter your content</p>
                <p className="text-gray-400 text-sm mt-1">
                  Type or paste your text/URL, or fill in WiFi/contact details. QR code updates in real-time.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-cyan-500/20 text-cyan-400 rounded-lg flex items-center justify-center font-bold">
                3
              </span>
              <div>
                <p className="text-white font-medium">Customize (optional)</p>
                <p className="text-gray-400 text-sm mt-1">
                  Change colors, dot style, add your logo, adjust size and error correction level.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center font-bold">
                4
              </span>
              <div>
                <p className="text-white font-medium">Download and use</p>
                <p className="text-gray-400 text-sm mt-1">
                  Click download to save as PNG, SVG, or JPEG. Print or share digitally - it never expires!
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Privacy Section */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl p-6 border border-emerald-500/20">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-400" />
            100% Private - How It Works
          </h2>
          <p className="text-gray-300 mb-4">
            Unlike most QR code generators, this tool runs entirely in your browser. Your data is never sent to any server.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-gray-300">
              <Check className="w-4 h-4 text-emerald-400" />
              All processing happens on your device
            </li>
            <li className="flex items-center gap-2 text-gray-300">
              <Check className="w-4 h-4 text-emerald-400" />
              No cookies, no localStorage, no tracking
            </li>
            <li className="flex items-center gap-2 text-gray-300">
              <Check className="w-4 h-4 text-emerald-400" />
              Works offline after initial load
            </li>
            <li className="flex items-center gap-2 text-gray-300">
              <Check className="w-4 h-4 text-emerald-400" />
              Press F12 → Network tab to verify zero requests
            </li>
          </ul>
        </div>

        {/* Best Practices */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Best Practices</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <p className="text-gray-300">
                <strong className="text-white">Test before printing:</strong> Always scan your QR
                code with your phone before using it publicly
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <p className="text-gray-300">
                <strong className="text-white">Use higher error correction for logos:</strong> Level Q or H
                ensures scannability even with a logo overlay
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <p className="text-gray-300">
                <strong className="text-white">High contrast colors:</strong> Dark on light works best.
                The tool warns you if contrast is too low
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <p className="text-gray-300">
                <strong className="text-white">Choose SVG for print:</strong> Vector format scales to any size
                without losing quality
              </p>
            </li>
          </ul>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <p className="text-white font-medium mb-2 flex items-center gap-2">
                <Infinity className="w-5 h-5 text-cyan-400" />
                Do these QR codes expire?
              </p>
              <p className="text-gray-400">
                No! Unlike dynamic QR codes from services like QRMonkey (14-day limit), our static QR codes 
                never expire. The data is encoded directly in the image and works forever.
              </p>
            </div>
            <div>
              <p className="text-white font-medium mb-2">Is the logo feature really free?</p>
              <p className="text-gray-400">
                Yes, completely free. Other services charge $60-120/year for logo embedding. We believe 
                this basic feature should not be paywalled.
              </p>
            </div>
            <div>
              <p className="text-white font-medium mb-2">How much data can a QR code hold?</p>
              <p className="text-gray-400">
                Up to about 2000 characters. This is enough for most URLs, contact info, WiFi credentials, 
                or short messages.
              </p>
            </div>
            <div>
              <p className="text-white font-medium mb-2">Can I track how many people scan my QR code?</p>
              <p className="text-gray-400">
                Static QR codes (like these) cannot be tracked directly. For analytics, you can use a 
                URL shortener with tracking (like Bitly) and encode that link instead.
              </p>
            </div>
            <div>
              <p className="text-white font-medium mb-2">What is the best size for printing?</p>
              <p className="text-gray-400">
                Minimum 2x2 cm for close-up scanning (business cards). For posters or signage viewed 
                from distance, use larger sizes. Download as SVG for perfect quality at any print size.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/20 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">Create Your QR Code Now</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Free logo embedding, custom colors & styles, no expiration. 
          100% private - your data never leaves your browser.
        </p>
        <Link
          href="/tools/qr-code"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transform hover:scale-105 transition-all"
        >
          <QrCode className="mr-2" size={20} />
          Try QR Code Generator
        </Link>
      </section>
    </article>
  )
}
