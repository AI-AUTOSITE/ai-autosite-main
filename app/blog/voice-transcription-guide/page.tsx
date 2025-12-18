// app/blog/voice-transcription-guide/page.tsx
// Complete guide to browser-based voice transcription

import Link from 'next/link'
import { Metadata } from 'next'
import {
  ArrowLeft,
  Mic,
  Shield,
  Zap,
  Download,
  Clock,
  Globe,
  CheckCircle,
  FileAudio,
  Volume2,
  Languages,
  AlertTriangle,
} from 'lucide-react'

export const metadata: Metadata = {
  title:
    'Free Voice Transcription Guide - Convert Speech to Text with AI Whisper | AI AutoSite',
  description:
    'Complete guide to using our free voice transcription tool. Convert audio to text with OpenAI Whisper, 100% private browser-based processing, no uploads required.',
  keywords:
    'voice transcription, speech to text, whisper, free transcription, audio to text, private transcription, offline transcription, meeting transcription, podcast transcription',
}

export default function VoiceTranscriptionGuidePage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Blog
        </Link>
        <h1 className="text-3xl font-bold text-white mb-3">
          Free Voice Transcription: Convert Speech to Text with AI
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>6 min read</span>
          <span>•</span>
          <span>December 2025</span>
        </div>
      </header>

      {/* Introduction */}
      <section className="prose prose-invert max-w-none space-y-6 mb-12">
        <p className="text-lg text-gray-300 leading-relaxed">
          Need to transcribe meetings, podcasts, interviews, or lectures? Our free voice 
          transcription tool uses OpenAI's Whisper model to convert audio to text with 
          remarkable accuracy—and it all happens right in your browser. No uploads, no 
          subscriptions, no limits.
        </p>
      </section>

      {/* Privacy Highlight */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-8 h-8 text-green-400" />
            <h2 className="text-xl font-bold text-white">100% Private - Your Audio Never Leaves Your Device</h2>
          </div>
          <p className="text-gray-300 mb-4">
            Unlike cloud-based transcription services that upload your audio to remote servers,
            our tool processes everything locally in your browser using WebAssembly technology.
          </p>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
              <span>No audio uploads to any server</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
              <span>Works offline after initial model download</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
              <span>Perfect for confidential meetings and sensitive content</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Key Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          Why Choose Our Voice Transcription Tool?
        </h2>
        <div className="grid gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-start gap-3">
              <Zap className="w-6 h-6 text-purple-400 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">AI-Powered Accuracy</h3>
                <p className="text-gray-400">
                  Uses OpenAI Whisper, the same technology behind ChatGPT's voice features.
                  Handles accents, background noise, and multiple speakers with impressive accuracy.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-start gap-3">
              <Globe className="w-6 h-6 text-blue-400 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">99+ Languages Supported</h3>
                <p className="text-gray-400">
                  Transcribe audio in English, Japanese, Chinese, Spanish, French, German, 
                  and 90+ other languages. Auto-detection makes it effortless.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-yellow-400 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">Timestamps Included</h3>
                <p className="text-gray-400">
                  Get word-level timestamps with your transcript. Perfect for creating
                  subtitles, navigating long recordings, or syncing with video.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-start gap-3">
              <Download className="w-6 h-6 text-cyan-400 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">Multiple Export Formats</h3>
                <p className="text-gray-400">
                  Export as plain text (TXT), SRT subtitles for video editing, or 
                  JSON with full timestamp data for developers.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-start gap-3">
              <FileAudio className="w-6 h-6 text-pink-400 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">All Major Audio Formats</h3>
                <p className="text-gray-400">
                  Supports MP3, WAV, M4A, MP4, WebM, OGG, FLAC, and more. Files up to 
                  500MB with no duration limits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Upload Your Audio</h3>
              <p className="text-gray-400">
                Drag and drop or click to select your audio file. We support most common
                audio and video formats up to 500MB.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Choose Settings (Optional)</h3>
              <p className="text-gray-400">
                Select a language for better accuracy, or let auto-detect handle it. 
                Choose between faster (Tiny) or more accurate (Base) models.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Start Transcription</h3>
              <p className="text-gray-400">
                The AI model downloads once (cached for future use), then processes your
                audio entirely in your browser. Watch the progress in real-time.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              4
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Export Your Transcript</h3>
              <p className="text-gray-400">
                Copy to clipboard or download as TXT, SRT subtitles, or JSON. 
                Toggle timestamps on/off as needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Perfect For</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="font-semibold text-white mb-2">📹 Meeting Notes</h3>
            <p className="text-gray-400 text-sm">
              Record your Zoom, Teams, or Google Meet calls and get searchable, 
              shareable transcripts in minutes.
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="font-semibold text-white mb-2">🎙️ Podcasters</h3>
            <p className="text-gray-400 text-sm">
              Create show notes, transcripts for SEO, and accessible content 
              for hearing-impaired listeners.
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="font-semibold text-white mb-2">🎓 Students</h3>
            <p className="text-gray-400 text-sm">
              Convert lecture recordings into study notes. Search through hours 
              of content instantly.
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="font-semibold text-white mb-2">📰 Journalists</h3>
            <p className="text-gray-400 text-sm">
              Transcribe interviews quickly without sending sensitive audio 
              to third-party services.
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="font-semibold text-white mb-2">🎬 Content Creators</h3>
            <p className="text-gray-400 text-sm">
              Generate SRT subtitle files for YouTube, TikTok, or any video 
              platform automatically.
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="font-semibold text-white mb-2">💼 Professionals</h3>
            <p className="text-gray-400 text-sm">
              Keep records of client calls, consultations, and voice memos 
              without privacy concerns.
            </p>
          </div>
        </div>
      </section>

      {/* Model Comparison */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Choosing the Right Model</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400">Model</th>
                <th className="text-left py-3 px-4 text-gray-400">Size</th>
                <th className="text-left py-3 px-4 text-gray-400">Speed</th>
                <th className="text-left py-3 px-4 text-gray-400">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10">
                <td className="py-3 px-4 text-white">Tiny</td>
                <td className="py-3 px-4 text-gray-400">~75MB</td>
                <td className="py-3 px-4 text-green-400">Fastest</td>
                <td className="py-3 px-4 text-gray-400">Quick transcription, clear audio</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-3 px-4 text-white">Tiny English</td>
                <td className="py-3 px-4 text-gray-400">~75MB</td>
                <td className="py-3 px-4 text-green-400">Fastest</td>
                <td className="py-3 px-4 text-gray-400">English-only content</td>
              </tr>
              <tr className="border-b border-white/10 bg-purple-500/10">
                <td className="py-3 px-4 text-white font-medium">Base ⭐</td>
                <td className="py-3 px-4 text-gray-400">~145MB</td>
                <td className="py-3 px-4 text-yellow-400">Balanced</td>
                <td className="py-3 px-4 text-gray-400">Most use cases (recommended)</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-3 px-4 text-white">Base English</td>
                <td className="py-3 px-4 text-gray-400">~145MB</td>
                <td className="py-3 px-4 text-yellow-400">Balanced</td>
                <td className="py-3 px-4 text-gray-400">Best English accuracy</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Tips for Best Results */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Tips for Best Results</h2>
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-500/20">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
            <h3 className="font-semibold text-white">Pro Tips</h3>
          </div>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
              <span>
                <strong>Clear audio = better results.</strong> Reduce background noise and 
                ensure the speaker is close to the microphone.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
              <span>
                <strong>Select the language manually</strong> if you know it for better accuracy,
                rather than relying on auto-detect.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
              <span>
                <strong>Use English-specific models</strong> for English content—they're 
                optimized and more accurate than multilingual models.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
              <span>
                <strong>First load takes longer</strong> as the AI model downloads. It's 
                cached after that for instant future use.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
              <span>
                <strong>Use Chrome or Edge</strong> for best performance. Safari has some 
                WebAssembly limitations.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Comparison with Competitors */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">How We Compare</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400">Feature</th>
                <th className="text-left py-3 px-4 text-gray-400">AI AutoSite</th>
                <th className="text-left py-3 px-4 text-gray-400">Otter.ai</th>
                <th className="text-left py-3 px-4 text-gray-400">Others</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10">
                <td className="py-3 px-4 text-white">Price</td>
                <td className="py-3 px-4 text-green-400">100% Free</td>
                <td className="py-3 px-4 text-gray-400">$17/month</td>
                <td className="py-3 px-4 text-gray-400">$10-30/month</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-3 px-4 text-white">Privacy</td>
                <td className="py-3 px-4 text-green-400">100% Local</td>
                <td className="py-3 px-4 text-red-400">Cloud Upload</td>
                <td className="py-3 px-4 text-red-400">Cloud Upload</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-3 px-4 text-white">Usage Limits</td>
                <td className="py-3 px-4 text-green-400">Unlimited</td>
                <td className="py-3 px-4 text-gray-400">300 min/month</td>
                <td className="py-3 px-4 text-gray-400">Limited</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-3 px-4 text-white">Offline Mode</td>
                <td className="py-3 px-4 text-green-400">Yes</td>
                <td className="py-3 px-4 text-red-400">No</td>
                <td className="py-3 px-4 text-red-400">No</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-3 px-4 text-white">Languages</td>
                <td className="py-3 px-4 text-green-400">99+</td>
                <td className="py-3 px-4 text-gray-400">3</td>
                <td className="py-3 px-4 text-gray-400">Varies</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Technical Details */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Technical Details</h2>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>• <strong>AI Model:</strong> OpenAI Whisper via Transformers.js</li>
            <li>• <strong>Processing:</strong> Web Worker + WebAssembly (WASM)</li>
            <li>• <strong>Audio Processing:</strong> Converted to 16kHz mono for optimal recognition</li>
            <li>• <strong>Chunking:</strong> 30-second segments with 5-second overlap for accuracy</li>
            <li>• <strong>Caching:</strong> Model cached in IndexedDB after first download</li>
            <li>• <strong>Browser Support:</strong> Chrome 91+, Edge 91+, Firefox 89+, Safari 16.4+</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-xl p-8 border border-purple-500/30 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Transcribe?</h2>
          <p className="text-gray-300 mb-6">
            Start converting your audio to text for free. No signup required.
          </p>
          <Link
            href="/tools/voice-transcription"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg font-semibold hover:from-purple-600 hover:to-violet-700 transition-all"
          >
            <Mic className="w-5 h-5" />
            Try Voice Transcription
          </Link>
        </div>
      </section>

      {/* Related Tools */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Related Tools</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/tools/japanese-ocr"
            className="block bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <h3 className="font-semibold text-white mb-1">Japanese OCR</h3>
            <p className="text-sm text-gray-400">Extract and translate text from images</p>
          </Link>
          <Link
            href="/tools/ai-summarizer"
            className="block bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <h3 className="font-semibold text-white mb-1">AI Text Summarizer</h3>
            <p className="text-sm text-gray-400">Summarize your transcripts with AI</p>
          </Link>
        </div>
      </section>
    </article>
  )
}
