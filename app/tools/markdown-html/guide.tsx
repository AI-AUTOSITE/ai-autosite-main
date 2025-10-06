import React from 'react'
import { X, Hash, Eye, Code, FileText, Copy } from 'lucide-react'

interface GuideProps {
  onClose?: () => void
}

export default function MarkdownHtmlGuide({ onClose }: GuideProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-h-[80vh] overflow-hidden flex flex-col relative w-full max-w-2xl">
      {/* Fixed Header */}
      <div className="p-6 border-b border-white/10 relative">
        {/* Close Button - 必須 */}
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
          <Hash className="w-8 h-8 text-cyan-400" />
          <h3 className="text-2xl font-bold text-white">How to Convert Markdown to HTML</h3>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        {/* Quick Overview */}
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <FileText className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-cyan-300">
              <p className="font-semibold mb-1">Live Preview</p>
              <p>Type Markdown on the left, see HTML instantly on the right.</p>
              <p className="mt-2">
                Supports GitHub Flavored Markdown (GFM) with tables and code blocks.
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div>
          <h4 className="font-semibold text-white mb-3">4 Simple Steps</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                1
              </span>
              <div>
                <p className="font-medium text-white">Type or Paste Markdown</p>
                <p className="text-sm text-gray-400 mt-1">
                  Use the left panel for your markdown input
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                2
              </span>
              <div>
                <p className="font-medium text-white">Choose View Mode</p>
                <p className="text-sm text-gray-400 mt-1">
                  Toggle between Preview (visual) or HTML (code)
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                3
              </span>
              <div>
                <p className="font-medium text-white">Review Your Output</p>
                <p className="text-sm text-gray-400 mt-1">
                  Check the formatted result or raw HTML code
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                4
              </span>
              <div>
                <p className="font-medium text-white">Copy HTML Code</p>
                <p className="text-sm text-gray-400 mt-1">Click copy button to get your HTML</p>
              </div>
            </li>
          </ol>
        </div>

        {/* Markdown Syntax Reference */}
        <div>
          <h4 className="font-semibold text-white mb-3">Quick Syntax Reference</h4>
          <div className="bg-gray-900/50 backdrop-blur rounded-lg p-4 border border-gray-800">
            <div className="grid grid-cols-2 gap-4 font-mono text-sm">
              {/* Column 1 */}
              <div className="space-y-2">
                <div className="text-gray-400">Headings:</div>
                <code className="text-cyan-300"># Heading 1</code>
                <code className="text-cyan-300">## Heading 2</code>
                <code className="text-cyan-300">### Heading 3</code>

                <div className="text-gray-400 mt-3">Lists:</div>
                <code className="text-cyan-300">- Bullet item</code>
                <code className="text-cyan-300">1. Number item</code>
                <code className="text-cyan-300">- [ ] Task list</code>
              </div>

              {/* Column 2 */}
              <div className="space-y-2">
                <div className="text-gray-400">Emphasis:</div>
                <code className="text-cyan-300">**Bold text**</code>
                <code className="text-cyan-300">*Italic text*</code>
                <code className="text-cyan-300">`Code inline`</code>

                <div className="text-gray-400 mt-3">Links & Images:</div>
                <code className="text-cyan-300">[Link text](url)</code>
                <code className="text-cyan-300">![Alt text](image)</code>
                <code className="text-cyan-300">&gt; Blockquote</code>
              </div>
            </div>
          </div>
        </div>

        {/* Code Blocks */}
        <div>
          <h4 className="font-semibold text-white mb-3">Code Blocks</h4>
          <div className="bg-gray-900/50 backdrop-blur rounded-lg p-4 border border-gray-800 font-mono text-sm">
            <div className="text-gray-400 mb-2">Use triple backticks with language:</div>
            <code className="text-green-300">
              <br />
              function hello() {'{'}
              <br />
              &nbsp;&nbsp;console.log("Hi!");
              <br />
              {'}'}
              <br />
            </code>
          </div>
        </div>

        {/* View Modes */}
        <div>
          <h4 className="font-semibold text-white mb-3">View Modes</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-3 border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-400">Preview Mode</span>
              </div>
              <p className="text-xs text-gray-300">See formatted output as it will appear</p>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-3 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Code className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-400">HTML Mode</span>
              </div>
              <p className="text-xs text-gray-300">Get raw HTML code for copying</p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <p className="text-sm text-amber-300">
            <strong>Pro Tip:</strong> Click "Load Sample" to see all supported Markdown features
            including tables, code blocks, and formatting options.
          </p>
        </div>
      </div>
    </div>
  )
}
// Export metadata for dynamic loading
export const guideMetadata = {
  title: 'Markdown to HTML Guide',
  icon: '#️⃣',
  available: true,
}
