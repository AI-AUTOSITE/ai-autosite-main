// app/tools/image-grid-maker/guide.tsx

import { X, Grid3x3 } from 'lucide-react'

export const toolGuide = {
  title: 'How to Use Image Grid Maker',
  steps: [
    { icon: '1', text: 'Set your grid size (rows × columns)' },
    { icon: '2', text: 'Drag & drop multiple images at once' },
    { icon: '3', text: 'Click any cell to add or replace image' },
    { icon: '4', text: 'Toggle numbers for tracking' },
    { icon: '5', text: 'Click "Merge & Download" to save' },
  ],
  tips: [
    'Drop multiple images at once to fill grid quickly',
    'Click any cell to replace its image',
    'Up to 8×8 grid (64 images max)',
    'Numbers help track image order',
    'Empty cells show with light borders',
  ],
  useCases: [
    { title: 'Before/After', desc: 'Compare changes' },
    { title: 'Tutorials', desc: 'Show steps' },
    { title: 'Product Grid', desc: 'Display items' },
    { title: 'Photo Collage', desc: 'Make collections' },
  ],
  troubleshooting: [
    { problem: 'Images not loading', solution: 'Check format: JPG, PNG, GIF, WebP' },
    { problem: 'Grid looks wrong', solution: 'Images auto-fit to largest size' },
    { problem: "Can't add more", solution: 'Max 64 images (8×8 grid)' },
  ],
}

interface ToolGuideProps {
  onClose?: () => void
}

export default function ToolGuide({ onClose }: ToolGuideProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-md w-full relative">
      {/* Close button - required */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close guide"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Grid3x3 className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-bold text-white">{toolGuide.title}</h3>
      </div>

      {/* Steps */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Quick Steps</h4>
        {toolGuide.steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-cyan-400 font-semibold">{step.icon}</span>
            </div>
            <p className="text-sm text-gray-300">{step.text}</p>
          </div>
        ))}
      </div>

      {/* Use Cases */}
      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Perfect For</h4>
        <div className="grid grid-cols-2 gap-2">
          {toolGuide.useCases.map((useCase, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-2">
              <div className="text-xs text-white font-semibold">{useCase.title}</div>
              <div className="text-xs text-gray-400">{useCase.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Pro Tips</h4>
        <div className="bg-white/5 rounded-lg p-3 space-y-1">
          {toolGuide.tips.map((tip, index) => (
            <p key={index} className="text-xs text-gray-300">
              • {tip}
            </p>
          ))}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
        <p className="text-xs text-green-400">
          <strong>100% Private:</strong> All work happens in your browser. No uploads.
        </p>
      </div>
    </div>
  )
}
