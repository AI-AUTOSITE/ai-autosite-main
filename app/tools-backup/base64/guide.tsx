// app/tools/base64/guide.tsx

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  AlertCircle, 
  Code,
  Upload,
  FileText,
  Image,
  Shield,
  Zap,
  ArrowRight,
  Info,
  Database
} from 'lucide-react';

interface GuideProps {
  onClose?: () => void;
}

export default function Base64Guide({ onClose }: GuideProps) {
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  const examples = {
    text: "Hello World",
    encoded: "SGVsbG8gV29ybGQ=",
    dataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedExample(id);
    setTimeout(() => setCopiedExample(null), 2000);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-h-[80vh] overflow-hidden flex flex-col relative w-full max-w-2xl">
      {/* Fixed Header */}
      <div className="p-6 border-b border-white/10 relative">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
            aria-label="Close guide"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        )}

        {/* Title */}
        <div className="flex items-center gap-3">
          <Code className="w-8 h-8 text-indigo-400" />
          <h3 className="text-2xl font-bold text-white">Base64 Encoder/Decoder Guide</h3>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        {/* Overview */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-indigo-300">
              <p className="font-semibold mb-1">Quick & Easy Base64 Conversion</p>
              <p>Encode text & files to Base64, or decode Base64 strings back.</p>
              <p className="mt-2">Perfect for APIs, data URLs, and email attachments.</p>
            </div>
          </div>
        </div>

        {/* What is Base64 */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-300">
              <p className="font-semibold mb-1">What is Base64?</p>
              <p className="text-gray-300">
                Base64 converts binary data into text format using 64 ASCII characters.
                It makes data safe to transmit through text-only systems.
              </p>
            </div>
          </div>
        </div>

        {/* Example */}
        <div>
          <h4 className="font-semibold text-white mb-3">Quick Example</h4>
          <div className="bg-black/30 rounded-lg p-4 space-y-3">
            {/* Text to Base64 */}
            <div className="flex items-center gap-2">
              <code className="text-cyan-400 text-sm flex-1">{examples.text}</code>
              <ArrowRight className="w-4 h-4 text-gray-500" />
              <code className="text-green-400 text-sm flex-1">{examples.encoded}</code>
              <button
                onClick={() => handleCopy(examples.encoded, 'example')}
                className="p-1.5 hover:bg-white/10 rounded transition-colors"
              >
                {copiedExample === 'example' ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div>
          <h4 className="font-semibold text-white mb-3">How to Use This Tool</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                1
              </span>
              <div>
                <p className="font-medium text-white">Choose Mode</p>
                <p className="text-sm text-gray-400 mt-1">
                  Select "Encode" to convert to Base64, or "Decode" to convert from Base64
                </p>
              </div>
            </li>
            
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                2
              </span>
              <div>
                <p className="font-medium text-white">Input Your Data</p>
                <p className="text-sm text-gray-400 mt-1">
                  <FileText className="inline w-3 h-3 mr-1" />
                  Type/paste text or
                  <Upload className="inline w-3 h-3 mx-1" />
                  upload a file (max 5MB)
                </p>
              </div>
            </li>
            
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                3
              </span>
              <div>
                <p className="font-medium text-white">Get Instant Results</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Copy className="inline w-3 h-3 mr-1" />
                  Copy the result or download as file
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Features */}
        <div>
          <h4 className="font-semibold text-white mb-3">Key Features</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Image className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-white">Image Support</p>
                <p className="text-xs text-gray-400">Preview images when decoding Base64</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Upload className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-white">File Upload</p>
                <p className="text-xs text-gray-400">Support for text files and images (5MB max)</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Zap className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm text-white">Real-time Processing</p>
                <p className="text-xs text-gray-400">Instant encoding/decoding as you type</p>
              </div>
            </div>
          </div>
        </div>

        {/* Common Use Cases */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            Common Use Cases
          </h4>
          <div className="bg-black/30 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">•</span>
              <div className="text-sm">
                <span className="text-white">API Development:</span>
                <span className="text-gray-400 ml-1">Send binary data in JSON</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">•</span>
              <div className="text-sm">
                <span className="text-white">Data URLs:</span>
                <span className="text-gray-400 ml-1">Embed images directly in HTML/CSS</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">•</span>
              <div className="text-sm">
                <span className="text-white">Email Attachments:</span>
                <span className="text-gray-400 ml-1">MIME encoding for email</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">•</span>
              <div className="text-sm">
                <span className="text-white">Authentication:</span>
                <span className="text-gray-400 ml-1">HTTP Basic Auth headers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-amber-300 mb-2">Important to Remember</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Base64 is NOT encryption - anyone can decode it</li>
                <li>• Increases data size by ~33%</li>
                <li>• Use URL-safe Base64 for URLs (- and _ instead of + and /)</li>
                <li>• Max file size: 5MB for browser performance</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-300">
              <p className="font-semibold mb-1">100% Private</p>
              <p className="text-gray-300">
                All processing happens in your browser. No data is sent to any server.
                Your files and text never leave your device.
              </p>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg p-4">
          <p className="text-sm text-white font-medium mb-2">💡 Pro Tips</p>
          <ul className="space-y-1 text-xs text-gray-300">
            <li>• Double-click output to select all text quickly</li>
            <li>• Drag & drop files directly onto the input area</li>
            <li>• The tool auto-detects if your input is Base64</li>
            <li>• Image previews appear automatically when decoding images</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Export metadata for dynamic loading
export const guideMetadata = {
  title: 'Base64 Encoder/Decoder Guide',
  icon: '🔐',
  available: true,
};