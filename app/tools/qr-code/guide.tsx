'use client'

import { X, FileText, Link2, Wifi, User, Palette, Sliders, Image, Download, Shield, Infinity, Sparkles } from 'lucide-react'

export default function QRCodeGuide({ onClose }: { onClose?: () => void }) {
  return (
    <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/10 max-w-lg relative shadow-2xl">
      {/* Close Button - More visible with colored background */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full transition-colors z-10"
          aria-label="Close guide"
        >
          <X className="w-5 h-5 text-red-400 hover:text-red-300" />
        </button>
      )}

      {/* Title - Separate row to avoid overlap */}
      <div className="mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-white">QR Code Generator</h3>
        <p className="text-sm text-gray-400">Quick Guide</p>
      </div>

      {/* Quick Start */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-cyan-400">Quick Start</h4>
        <div className="flex items-start space-x-3">
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-400 font-bold text-sm">1</span>
          </div>
          <div>
            <p className="text-white font-medium text-sm">Choose QR type</p>
            <p className="text-gray-400 text-xs">Text, URL, WiFi, or Contact</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-purple-400 font-bold text-sm">2</span>
          </div>
          <div>
            <p className="text-white font-medium text-sm">Enter content</p>
            <p className="text-gray-400 text-xs">QR code updates in real-time</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-green-400 font-bold text-sm">3</span>
          </div>
          <div>
            <p className="text-white font-medium text-sm">Download</p>
            <p className="text-gray-400 text-xs">PNG, SVG, or JPEG format</p>
          </div>
        </div>
      </div>

      {/* QR Types */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-cyan-400 mb-2">QR Types</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-300">Text - Any message</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
            <Link2 className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-300">URL - Website links</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
            <Wifi className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-300">WiFi - Auto connect</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-300">vCard - Contact info</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-cyan-400 mb-2">Features</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-300">8 color presets + custom colors</span>
          </div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-300">6 dot styles (Square, Dots, Rounded...)</span>
          </div>
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-pink-400" />
            <span className="text-xs text-gray-300">Logo embedding - FREE (others charge $60+)</span>
          </div>
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-300">3 sizes: 256px, 512px, 1024px</span>
          </div>
        </div>
      </div>

      {/* Why Different */}
      <div className="bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 rounded-xl p-4 space-y-2">
        <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Why Choose This Tool?
        </h4>
        <div className="space-y-1.5">
          <p className="text-xs text-gray-300 flex items-center gap-2">
            <Shield className="w-3 h-3 text-emerald-400" />
            100% private - Data never leaves your browser
          </p>
          <p className="text-xs text-gray-300 flex items-center gap-2">
            <Infinity className="w-3 h-3 text-cyan-400" />
            No expiration - Unlike QRMonkey&apos;s 14-day limit
          </p>
          <p className="text-xs text-gray-300 flex items-center gap-2">
            <Image className="w-3 h-3 text-pink-400" />
            Free logo - Others charge $60+/year
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 p-3 bg-white/10 rounded-lg">
        <p className="text-xs text-gray-400">
          <span className="text-yellow-400">💡 Tip:</span> Use error correction level Q or H when adding logos for better scannability.
        </p>
      </div>
    </div>
  )
}
