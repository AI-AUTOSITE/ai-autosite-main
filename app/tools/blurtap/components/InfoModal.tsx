// app/tools/blurtap/components/InfoModal.tsx

import React from 'react'
import { X, Upload, MousePointer, Move, Download } from 'lucide-react'

interface InfoModalProps {
  onClose: () => void
}

export const InfoModal: React.FC<InfoModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-6 max-w-md w-full border border-white/10">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">How to Use BlurTap</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-3 text-gray-300 text-sm">
          <div className="flex items-start space-x-3">
            <Upload className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <p>Upload or drag & drop your image to get started</p>
          </div>
          
          <div className="flex items-start space-x-3">
            <MousePointer className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <p>Select masking mode: Click for fixed-size masks or Drag for custom areas</p>
          </div>
          
          <div className="flex items-start space-x-3">
            <Move className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
            <p>Click or drag on the image to add black masks over sensitive areas</p>
          </div>
          
          <div className="flex items-start space-x-3">
            <Download className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <p>Download your masked image in PNG, JPEG, or WebP format</p>
          </div>
        </div>
        
        <div className="mt-6 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <p className="text-xs text-yellow-400">
            <strong>100% Private:</strong> All processing happens locally in your browser. No images are uploaded to any server.
          </p>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <p className="text-gray-400">Max file size</p>
            <p className="text-white font-semibold">10MB</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <p className="text-gray-400">Undo history</p>
            <p className="text-white font-semibold">25 steps</p>
          </div>
        </div>
      </div>
    </div>
  )
}