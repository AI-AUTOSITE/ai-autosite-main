// app/tools/text-case/guide.tsx

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  AlertCircle, 
  BookOpen, 
  Type,
  Code,
  Globe,
  Sparkles,
  Upload,
  Settings,
  Lightbulb,
  Target,
  Download,
  RefreshCw
} from 'lucide-react';

interface GuideProps {
  onClose?: () => void;
}

export default function TextCaseConverterGuide({ onClose }: GuideProps) {
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  const exampleCases = {
    original: "hello world example",
    camelCase: "helloWorldExample",
    snake_case: "hello_world_example",
    PascalCase: "HelloWorldExample",
    kebabCase: "hello-world-example"
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
          <Type className="w-8 h-8 text-cyan-400" />
          <h3 className="text-2xl font-bold text-white">Text Case Converter Guide</h3>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        {/* Overview */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-cyan-300">
              <p className="font-semibold mb-1">Master Text Formatting for Development</p>
              <p>Convert text between 10 different case formats instantly.</p>
              <p className="mt-2">Perfect for developers working with different naming conventions!</p>
            </div>
          </div>
        </div>

        {/* Case Type Examples */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-400" />
            Popular Programming Cases
          </h4>
          
          <div className="space-y-2">
            {/* Original */}
            <div className="bg-gray-800/50 border border-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Original Text</p>
                  <p className="text-sm text-white font-mono">"{exampleCases.original}"</p>
                </div>
                <button
                  onClick={() => handleCopy(exampleCases.original, 'original')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  {copiedExample === 'original' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            {/* camelCase */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-400 font-medium mb-1">camelCase (JavaScript)</p>
                  <p className="text-sm text-gray-300 font-mono">"{exampleCases.camelCase}"</p>
                </div>
                <button
                  onClick={() => handleCopy(exampleCases.camelCase, 'camelCase')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  {copiedExample === 'camelCase' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* snake_case */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-400 font-medium mb-1">snake_case (Python)</p>
                  <p className="text-sm text-gray-300 font-mono">"{exampleCases.snake_case}"</p>
                </div>
                <button
                  onClick={() => handleCopy(exampleCases.snake_case, 'snake_case')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  {copiedExample === 'snake_case' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* PascalCase */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-400 font-medium mb-1">PascalCase (React Components)</p>
                  <p className="text-sm text-gray-300 font-mono">"{exampleCases.PascalCase}"</p>
                </div>
                <button
                  onClick={() => handleCopy(exampleCases.PascalCase, 'PascalCase')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  {copiedExample === 'PascalCase' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* kebab-case */}
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-cyan-400 font-medium mb-1">kebab-case (URLs, CSS)</p>
                  <p className="text-sm text-gray-300 font-mono">"{exampleCases.kebabCase}"</p>
                </div>
                <button
                  onClick={() => handleCopy(exampleCases.kebabCase, 'kebab-case')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  {copiedExample === 'kebab-case' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div>
          <h4 className="font-semibold text-white mb-3">How to Use This Tool</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                1
              </span>
              <div>
                <p className="font-medium text-white">Enter or Upload Text</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Upload className="inline w-3 h-3 mr-1" />
                  Type, paste, or upload a .txt file
                </p>
              </div>
            </li>
            
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                2
              </span>
              <div>
                <p className="font-medium text-white">Select Case Format</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Settings className="inline w-3 h-3 mr-1" />
                  Choose from 10 different case types
                </p>
              </div>
            </li>
            
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                3
              </span>
              <div>
                <p className="font-medium text-white">Instant Conversion</p>
                <p className="text-sm text-gray-400 mt-1">
                  <RefreshCw className="inline w-3 h-3 mr-1" />
                  See results in real-time as you type
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                4
              </span>
              <div>
                <p className="font-medium text-white">Copy or Download</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Download className="inline w-3 h-3 mr-1" />
                  Export your converted text instantly
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* All Case Types */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Type className="w-5 h-5 text-yellow-400" />
            All 10 Available Case Types
          </h4>
          <div className="bg-black/30 rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                <span className="text-gray-300">UPPERCASE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                <span className="text-gray-300">lowercase</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                <span className="text-gray-300">Title Case</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                <span className="text-gray-300">Sentence case</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span className="text-gray-300">camelCase</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span className="text-gray-300">PascalCase</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-gray-300">snake_case</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-gray-300">kebab-case</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span className="text-gray-300">aLtErNaTiNg</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span className="text-gray-300">iNVERSE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-300">
              <p className="font-semibold mb-2">Pro Tips for Developers</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Use camelCase for JavaScript/TypeScript variables</li>
                <li>• Use PascalCase for React components and classes</li>
                <li>• Use snake_case for Python variables and functions</li>
                <li>• Use kebab-case for URLs and CSS class names</li>
                <li>• Use UPPERCASE for constants in most languages</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Globe className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-cyan-300">
              <p className="font-semibold mb-2">Key Features</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Real-time character, word, and line counting</li>
                <li>• Support for .txt file upload and download</li>
                <li>• Instant conversion as you type</li>
                <li>• One-click copy to clipboard</li>
                <li>• 100% offline - no data transmitted</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Common Use Cases */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Target className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-indigo-300">
              <p className="font-semibold mb-2">Perfect For:</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Converting API response fields (snake_case to camelCase)</li>
                <li>• Renaming variables during code refactoring</li>
                <li>• Creating SEO-friendly URLs from titles</li>
                <li>• Formatting database column names</li>
                <li>• Batch converting file names</li>
              </ul>
            </div>
          </div>
        </div>

        {/* When to Use Each Case */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <p className="text-sm text-white font-medium mb-2">💡 Quick Reference</p>
          <div className="space-y-1 text-xs text-gray-400">
            <p><span className="text-cyan-400">JavaScript/TypeScript:</span> camelCase for variables, PascalCase for classes</p>
            <p><span className="text-green-400">Python/Ruby:</span> snake_case for everything except classes</p>
            <p><span className="text-purple-400">CSS/HTML:</span> kebab-case for classes and IDs</p>
            <p><span className="text-yellow-400">SQL:</span> snake_case for table and column names</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export metadata for dynamic loading
export const guideMetadata = {
  title: 'Text Case Converter Guide',
  icon: '📝',
  available: true,
};