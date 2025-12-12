// app/tools/bg-eraser/guide.tsx

import React from 'react'
import {
  X,
  Upload,
  Download,
  Sparkles,
  Shield,
  Clock,
  Image,
  Zap,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

interface GuideProps {
  onClose?: () => void
}

export default function BgEraserGuide({ onClose }: GuideProps) {
  const steps = [
    {
      number: 1,
      title: 'Choose your picture',
      description: 'Click the upload area or drag and drop an image. PNG, JPG, and WebP work great!',
      icon: Upload,
    },
    {
      number: 2,
      title: 'Wait for the magic',
      description: 'Our AI finds the edges and removes the background. This takes about 5-10 seconds.',
      icon: Sparkles,
    },
    {
      number: 3,
      title: 'Save your picture',
      description: 'Download as PNG (with see-through background), WebP, or JPG.',
      icon: Download,
    },
  ]

  const tips = [
    {
      title: 'Best for people and objects',
      description: 'Works great for photos of people, products, and animals.',
      icon: CheckCircle,
      color: 'text-green-400',
    },
    {
      title: 'Clear edges help',
      description: 'Pictures with clear edges between the subject and background work best.',
      icon: CheckCircle,
      color: 'text-green-400',
    },
    {
      title: 'Good lighting matters',
      description: 'Well-lit photos give better results than dark or blurry ones.',
      icon: CheckCircle,
      color: 'text-green-400',
    },
    {
      title: 'Complex backgrounds are tricky',
      description: 'Very busy backgrounds or hair against similar colors may need touch-ups.',
      icon: AlertCircle,
      color: 'text-yellow-400',
    },
  ]

  const outputFormats = [
    {
      format: 'PNG',
      best: 'See-through backgrounds',
      description: 'Keeps the transparent background. Best for logos, graphics, and overlays.',
    },
    {
      format: 'WebP',
      best: 'Smaller file size',
      description: '30% smaller than PNG with great quality. Works in all modern browsers.',
    },
    {
      format: 'JPG',
      best: 'Photos with solid backgrounds',
      description: 'Adds a white background (or your chosen color). Smallest file size.',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-gray-700 shadow-xl">
          {/* Header */}
          <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              How to Use Background Eraser
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Quick Start */}
            <section>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Start</h3>
              <div className="space-y-4">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className="flex gap-4 p-4 bg-gray-800/50 rounded-xl"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-violet-500/20 rounded-full flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">
                        Step {step.number}: {step.title}
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Tips */}
            <section>
              <h3 className="text-lg font-semibold text-white mb-4">Tips for Best Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tips.map((tip, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-800/50 rounded-xl"
                  >
                    <div className="flex items-start gap-2">
                      <tip.icon className={`w-4 h-4 mt-0.5 ${tip.color}`} />
                      <div>
                        <h4 className="font-medium text-white text-sm">
                          {tip.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Output Formats */}
            <section>
              <h3 className="text-lg font-semibold text-white mb-4">Choose Your Format</h3>
              <div className="space-y-3">
                {outputFormats.map((format) => (
                  <div
                    key={format.format}
                    className="p-4 bg-gray-800/50 rounded-xl"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-violet-400">
                        {format.format}
                      </span>
                      <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded">
                        Best for: {format.best}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{format.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Privacy */}
            <section className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-400">Your Privacy is Protected</h3>
                  <p className="text-sm text-gray-300 mt-1">
                    Everything happens in your browser. Your pictures are never uploaded to any server.
                    We don't see, store, or have access to your images. Ever.
                  </p>
                </div>
              </div>
            </section>

            {/* Performance */}
            <section>
              <h3 className="text-lg font-semibold text-white mb-4">Good to Know</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-gray-800/50 rounded-xl flex items-center gap-3">
                  <Clock className="w-5 h-5 text-violet-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Processing Time</p>
                    <p className="text-xs text-gray-400">5-15 seconds per image</p>
                  </div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-xl flex items-center gap-3">
                  <Image className="w-5 h-5 text-violet-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Max Image Size</p>
                    <p className="text-xs text-gray-400">25MB (10MB on mobile)</p>
                  </div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-xl flex items-center gap-3">
                  <Zap className="w-5 h-5 text-violet-400" />
                  <div>
                    <p className="text-sm font-medium text-white">First Load</p>
                    <p className="text-xs text-gray-400">~25MB AI model download (cached)</p>
                  </div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-xl flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  <div>
                    <p className="text-sm font-medium text-white">AI Powered</p>
                    <p className="text-xs text-gray-400">Uses MODNet for smart edge detection</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
