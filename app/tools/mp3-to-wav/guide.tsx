// app/tools/mp3-to-wav/guide.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Upload, Settings, Download, Shield } from 'lucide-react';

export default function Guide() {
  const [isOpen, setIsOpen] = useState(false);

  const steps = [
    {
      icon: Upload,
      title: 'Upload MP3',
      description: 'Drag and drop your MP3 file or click to browse. Files up to 100MB are supported.',
    },
    {
      icon: Settings,
      title: 'Choose Bit Depth',
      description: 'Select 16-bit (CD quality), 24-bit (professional), or 32-bit (maximum precision).',
    },
    {
      icon: Download,
      title: 'Convert & Download',
      description: 'Click the button to convert instantly and download your WAV file.',
    },
  ];

  return (
    <div className="border border-gray-700 rounded-xl overflow-hidden">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
      >
        <h2 className="text-lg font-semibold text-white">How to Use</h2>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Content - Collapsible */}
      {isOpen && (
        <div className="p-4 space-y-6 bg-gray-800/30">
          {/* Steps */}
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bit Depth Explanation */}
          <div className="p-4 bg-gray-700/30 rounded-lg">
            <h3 className="font-medium text-white mb-3">Understanding Bit Depth</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-medium">16-bit:</span>
                <span className="text-gray-400">
                  Standard CD quality. Creates the smallest files. Perfect for everyday listening.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-medium">24-bit:</span>
                <span className="text-gray-400">
                  Professional quality. Recommended for audio editing and music production.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-medium">32-bit:</span>
                <span className="text-gray-400">
                  Maximum precision. Creates the largest files. Used for mastering and archiving.
                </span>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-emerald-400">100% Private</h3>
              <p className="text-sm text-gray-400 mt-1">
                Your audio files are processed entirely in your browser using Web Audio API. 
                Nothing is uploaded to any server. Your files never leave your device.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
