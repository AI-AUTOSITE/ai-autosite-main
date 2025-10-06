// app/tools/ai-project-visualizer/components/ToolGuide.tsx

import { X, FolderTree, Upload, Download, Shield, Sparkles, Code } from 'lucide-react'

export const toolGuide = {
  title: 'How to use AI Project Visualizer',
  steps: [
    { icon: '1', text: 'Drag & drop your project folder or click to browse' },
    { icon: '2', text: 'Choose export format (Tree, Mermaid, JSON, or Markdown)' },
    { icon: '3', text: 'Review the generated structure in real-time' },
    { icon: '4', text: 'Copy to clipboard or download the output' },
  ],
  tips: [
    'Automatically excludes node_modules, .git, and .env files',
    'Supports up to 1000 files (50MB total)',
    'All processing happens locally in your browser',
    'Tree format is best for Claude/ChatGPT',
    'Mermaid format works great in GitHub & Notion',
    'Drag entire folders for complete project mapping',
  ],
  troubleshooting: [
    {
      problem: 'No files showing',
      solution: 'Check if all files are excluded (like node_modules only folder)',
    },
    {
      problem: 'Missing some files',
      solution: 'Files over 5MB or sensitive files are auto-excluded',
    },
    { problem: 'Folder upload not working', solution: 'Use Chrome/Edge for best folder support' },
    { problem: 'Output looks wrong', solution: 'Try a different format - Tree is most reliable' },
  ],
  formats: [
    { name: 'Tree', best: 'AI tools, CLI output', icon: '🌳' },
    { name: 'Mermaid', best: 'GitHub, Notion, diagrams', icon: '🌊' },
    { name: 'JSON', best: 'APIs, programmatic use', icon: '📊' },
    { name: 'Markdown', best: 'Documentation, README', icon: '📝' },
  ],
}

interface ToolGuideProps {
  onClose?: () => void
  compact?: boolean
}

export default function ToolGuide({ onClose, compact = false }: ToolGuideProps) {
  if (compact) {
    // Compact version for inline help
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <FolderTree className="w-5 h-5 text-purple-400" />
          <h4 className="text-sm font-semibold text-white">Quick Guide</h4>
        </div>
        <div className="space-y-2 text-xs text-gray-300">
          <p>• Drag & drop any project folder</p>
          <p>• Sensitive files auto-excluded</p>
          <p>• Choose format → Copy/Download</p>
          <p className="text-purple-400 mt-2">
            <Sparkles className="w-3 h-3 inline mr-1" />
            Best for AI: Use Tree format for Claude
          </p>
        </div>
      </div>
    )
  }

  // Full guide modal version
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-2xl w-full relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close guide"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
      )}

      <div className="flex items-center gap-2 mb-6">
        <FolderTree className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white">{toolGuide.title}</h3>
      </div>

      {/* Steps Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Steps</h4>
          <div className="space-y-3">
            {toolGuide.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-purple-400 font-semibold">{step.icon}</span>
                </div>
                <p className="text-sm text-gray-300">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Export Formats */}
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Export Formats</h4>
          <div className="space-y-2">
            {toolGuide.formats.map((format, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{format.icon}</span>
                  <span className="text-sm text-white font-medium">{format.name}</span>
                </div>
                <span className="text-xs text-gray-400">{format.best}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Features & Tips</h4>
        <div className="bg-white/5 rounded-lg p-4 grid md:grid-cols-2 gap-2">
          {toolGuide.tips.map((tip, index) => (
            <p key={index} className="text-xs text-gray-300 flex items-start">
              <span className="text-purple-400 mr-1">•</span>
              {tip}
            </p>
          ))}
        </div>
      </div>

      {/* Security Notice */}
      <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20 mb-6">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-green-400 mb-1">Privacy & Security</h4>
            <p className="text-xs text-gray-300">
              Your files never leave your browser. Sensitive files like .env, credentials.json, and
              API keys are automatically excluded to keep your data safe.
            </p>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Troubleshooting</h4>
        <div className="space-y-2">
          {toolGuide.troubleshooting.map((item, index) => (
            <details key={index} className="group">
              <summary className="cursor-pointer text-xs text-gray-400 hover:text-white transition-colors">
                <Code className="w-3 h-3 inline mr-1" />
                {item.problem}
              </summary>
              <p className="text-xs text-gray-300 ml-5 mt-1 p-2 bg-white/5 rounded">
                → {item.solution}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* Pro Tips */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <p className="text-xs text-purple-400">
            <Upload className="w-3 h-3 inline mr-1" />
            <strong>Pro tip:</strong> You can drag multiple files or an entire folder at once!
          </p>
        </div>
        <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
          <p className="text-xs text-cyan-400">
            <Download className="w-3 h-3 inline mr-1" />
            <strong>AI tip:</strong> Use Tree format for Claude/ChatGPT for best results!
          </p>
        </div>
      </div>
    </div>
  )
}
