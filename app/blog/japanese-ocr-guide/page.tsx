// app/blog/japanese-ocr-guide/page.tsx
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, FileText, Globe, Zap, Shield, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Extract Japanese Text from Images with AI OCR | AI AutoSite',
  description: 'Complete guide to using our free Japanese OCR tool. Extract and translate Japanese text from images with 99% accuracy using Tesseract.js technology.',
  keywords: 'japanese ocr, text extraction, image to text, japanese translation, tesseract, ai ocr, free ocr tool',
}

export default function JapaneseOCRGuidePage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-8">
        <Link href="/blog" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-4">
          <ArrowLeft className="mr-2 w-4 h-4" />
          Blog
        </Link>
        <h1 className="text-3xl font-bold text-white mb-3">
          Extract Japanese Text from Images with AI OCR
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>5 min read</span>
          <span>•</span>
          <span>January 2025</span>
        </div>
      </header>

      {/* Introduction */}
      <section className="prose prose-invert max-w-none space-y-6 mb-12">
        <p className="text-lg text-gray-300 leading-relaxed">
          Need to extract Japanese text from images? Our free AI-powered OCR tool makes it simple to convert images containing Japanese text into editable, translatable content with remarkable accuracy.
        </p>
      </section>

      {/* Key Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Why Choose Our Japanese OCR Tool?</h2>
        <div className="grid gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-start gap-3">
              <Zap className="w-6 h-6 text-yellow-400 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">99% Accuracy</h3>
                <p className="text-gray-400">Powered by Tesseract.js with specialized Japanese language models for exceptional text recognition.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-green-400 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">100% Private</h3>
                <p className="text-gray-400">All processing happens locally in your browser. Your images never leave your device.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-start gap-3">
              <Globe className="w-6 h-6 text-cyan-400 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">Instant Translation</h3>
                <p className="text-gray-400">Automatically translate extracted Japanese text to English with integrated translation API.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">How to Use the Japanese OCR Tool</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-semibold">1</div>
            <div>
              <h3 className="font-semibold text-white mb-1">Upload Your Image</h3>
              <p className="text-gray-400">Drag and drop or click to upload an image containing Japanese text. Supports JPG, PNG, and WEBP formats.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-semibold">2</div>
            <div>
              <h3 className="font-semibold text-white mb-1">Automatic Processing</h3>
              <p className="text-gray-400">Our AI instantly analyzes the image and extracts all Japanese text with high precision.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-semibold">3</div>
            <div>
              <h3 className="font-semibold text-white mb-1">Get Results</h3>
              <p className="text-gray-400">Copy the extracted text, download it, or view the English translation instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Perfect For</h2>
        <ul className="space-y-3">
          {[
            'Translating Japanese documents and signs',
            'Extracting text from manga and books',
            'Converting printed Japanese to digital text',
            'Learning Japanese through image-based content',
            'Processing business documents and receipts',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-300">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <div className="mt-12 text-center p-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-3">Ready to Extract Japanese Text?</h2>
        <p className="text-gray-300 mb-6">Start using our free Japanese OCR tool now. No sign-up required.</p>
        <Link
          href="/tools/japanese-ocr"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <FileText className="mr-2 w-5 h-5" />
          Try Japanese OCR Now
        </Link>
      </div>
    </article>
  )
}