// app/blog/japanese-ocr-guide/page.tsx
// Enhanced blog post with bidirectional translation and swap feature

import Link from 'next/link'
import { Metadata } from 'next'
import {
  ArrowLeft,
  FileText,
  Globe,
  Zap,
  Shield,
  CheckCircle,
  Languages,
  ArrowLeftRight,
  RefreshCw,
} from 'lucide-react'

export const metadata: Metadata = {
  title:
    'Extract & Translate Text from Images - Japanese ↔ English OCR with Swap Feature | AI AutoSite',
  description:
    'Complete guide to using our free OCR tool with bidirectional translation and unique swap & retranslate feature. Extract text from images and translate between Japanese and English with 99% accuracy.',
  keywords:
    'japanese ocr, english ocr, bidirectional translation, swap translation, reverse translation, image to text, japanese translation, english translation, tesseract, ai ocr, free ocr tool',
}

export default function JapaneseOCRGuidePage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-4"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Blog
        </Link>
        <h1 className="text-3xl font-bold text-white mb-3">
          Extract & Translate Text from Images with AI OCR
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
          Need to extract text from images and translate between Japanese and English? Our free
          AI-powered OCR tool makes it simple to convert images containing any text into editable,
          translatable content with remarkable accuracy. Plus, our unique "Swap & Retranslate"
          feature lets you verify translation accuracy instantly.
        </p>
      </section>

      {/* New Feature Highlight */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center gap-3 mb-3">
            <ArrowLeftRight className="w-8 h-8 text-purple-400" />
            <h2 className="text-xl font-bold text-white">NEW: Swap & Retranslate Feature!</h2>
          </div>
          <p className="text-gray-300 mb-4">
            Our unique feature that even Google Translate doesn't have! With one click, swap your
            translation result back to the input field and retranslate in the opposite direction.
          </p>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
              <span>Test translation accuracy with back-translation</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
              <span>Verify that meaning is preserved in both directions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
              <span>Professional-grade quality checking in one click</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Key Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          Why Choose Our OCR & Translation Tool?
        </h2>
        <div className="grid gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-start gap-3">
              <Zap className="w-6 h-6 text-yellow-400 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">99% Accuracy</h3>
                <p className="text-gray-400">
                  Powered by Tesseract.js with specialized language models for exceptional text
                  recognition in both Japanese and English.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-start gap-3">
              <Languages className="w-6 h-6 text-purple-400 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">Bidirectional Translation</h3>
                <p className="text-gray-400">
                  Seamlessly translate between Japanese and English. Auto-detect language or
                  manually select translation direction.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-start gap-3">
              <ArrowLeftRight className="w-6 h-6 text-pink-400 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">Swap & Retranslate</h3>
                <p className="text-gray-400">
                  Unique feature to swap translation results back to input and retranslate for
                  accuracy verification. Perfect for quality checking.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-green-400 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">100% Private</h3>
                <p className="text-gray-400">
                  All OCR processing happens locally in your browser. Your images never leave your
                  device, ensuring complete privacy.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-start gap-3">
              <Globe className="w-6 h-6 text-cyan-400 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">Smart Language Detection</h3>
                <p className="text-gray-400">
                  Automatically detects whether text is in Japanese or English and translates
                  accordingly.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-start gap-3">
              <RefreshCw className="w-6 h-6 text-blue-400 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">Two Convenient Modes</h3>
                <p className="text-gray-400">
                  Image OCR mode for extracting text from photos, or Text mode for quick copy-paste
                  translations without images.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          How to Use the OCR & Translation Tool
        </h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-semibold">
              1
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Choose Your Mode</h3>
              <p className="text-gray-400">
                Select Image OCR for extracting text from images, or Text Translation for quick
                copy-paste translations.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-semibold">
              2
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Select Translation Direction</h3>
              <p className="text-gray-400">
                Choose Auto Detect for automatic language detection, or manually select Japanese →
                English or English → Japanese.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-semibold">
              3
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Input Your Content</h3>
              <p className="text-gray-400">
                Upload an image (JPG, PNG, WEBP up to 10MB) or paste/type text directly into the
                text field.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-semibold">
              4
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Get Instant Results</h3>
              <p className="text-gray-400">
                View extracted text with confidence score and translation. Copy results or download
                for later use.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold">
              5
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Swap & Retranslate (Optional)</h3>
              <p className="text-gray-400">
                Click the "Swap & Retranslate" button to move the translation back to input and
                translate in reverse direction for accuracy checking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Translation Modes */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Translation Modes Explained</h2>
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 text-cyan-400" />
            <div>
              <h3 className="font-semibold text-white">Auto Detect</h3>
              <p className="text-gray-400 text-sm">
                Automatically identifies the language and translates to the other. Perfect when
                you're not sure what language the text is in.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl">🇯🇵→🇬🇧</span>
            <div>
              <h3 className="font-semibold text-white">Japanese → English</h3>
              <p className="text-gray-400 text-sm">
                Extracts Japanese text (Hiragana, Katakana, Kanji) and translates to English.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl">🇬🇧→🇯🇵</span>
            <div>
              <h3 className="font-semibold text-white">English → Japanese</h3>
              <p className="text-gray-400 text-sm">
                Extracts English text and translates to Japanese. Great for learning materials.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ArrowLeftRight className="w-6 h-6 text-purple-400" />
            <div>
              <h3 className="font-semibold text-white">Swap & Retranslate</h3>
              <p className="text-gray-400 text-sm">
                After translation, swap the result back to input and translate in reverse. This
                back-translation technique helps verify accuracy and meaning preservation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Perfect For</h2>
        <ul className="space-y-3">
          {[
            'Translating Japanese documents, signs, and menus',
            'Converting English materials to Japanese for language learners',
            'Extracting text from manga, books, and publications',
            'Processing business documents in either language',
            'Creating bilingual content from images',
            'Academic research requiring text extraction and translation',
            'Travel and tourism - instant translation of signs and notices',
            'E-commerce - translating product descriptions and labels',
            'Quality checking translations with back-translation',
            'Language learning - compare original and translated texts',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-300">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Tips for Best Results */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Tips for Best Results</h2>
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">💡</span>
              <span>Use high-resolution images for better accuracy</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">💡</span>
              <span>Ensure good contrast between text and background</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">💡</span>
              <span>Avoid blurry or distorted images</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">💡</span>
              <span>Crop images to focus on the text area</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">💡</span>
              <span>Works best with printed text rather than handwriting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">💡</span>
              <span>Use Auto Detect mode when dealing with mixed-language content</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">💡</span>
              <span>Use Swap & Retranslate to verify translation accuracy</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">💡</span>
              <span>For long texts, our smart chunking ensures accurate translation</span>
            </li>
          </ul>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">What Makes Our Tool Unique</h2>
        <div className="space-y-4 text-gray-300">
          <p>Unlike other OCR and translation tools, we offer several unique features:</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <ArrowLeftRight className="w-5 h-5 text-purple-400 mt-0.5" />
              <span>
                <strong className="text-white">Swap & Retranslate:</strong> Our exclusive feature
                for instant back-translation testing that even major translation services don't
                offer.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-green-400 mt-0.5" />
              <span>
                <strong className="text-white">Complete Privacy:</strong> OCR processing happens
                entirely in your browser - your images never leave your device.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Zap className="w-5 h-5 text-yellow-400 mt-0.5" />
              <span>
                <strong className="text-white">No Character Limits:</strong> Smart chunking
                technology handles texts of any length without quality loss.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <RefreshCw className="w-5 h-5 text-blue-400 mt-0.5" />
              <span>
                <strong className="text-white">Dual Mode Operation:</strong> Switch between image
                OCR and direct text translation seamlessly.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-12 text-center p-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-3">Ready to Extract and Translate Text?</h2>
        <p className="text-gray-300 mb-6">
          Start using our free OCR & Translation tool now. No sign-up required, 100% private.
        </p>
        <Link
          href="/tools/japanese-ocr"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <FileText className="mr-2 w-5 h-5" />
          Try OCR & Translation Now
        </Link>
      </div>
    </article>
  )
}
