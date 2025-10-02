// app/tools/ai-dev-dictionary/guide.tsx

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  AlertCircle, 
  BookOpen, 
  Search,
  Filter,
  Eye,
  Sparkles,
  MessageSquare,
  Code,
  Lightbulb,
  Target
} from 'lucide-react';

interface GuideProps {
  onClose?: () => void;
}

export default function AIDevDictionaryGuide({ onClose }: GuideProps) {
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  const examplePrompts = {
    before: "I want to create a popup thing that shows information",
    after: "Create a Modal component with a close button and backdrop"
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
          <BookOpen className="w-8 h-8 text-cyan-400" />
          <h3 className="text-2xl font-bold text-white">AI Dev Dictionary Guide</h3>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        {/* Overview */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-cyan-300">
              <p className="font-semibold mb-1">Master the Language of Development</p>
              <p>Discover what UI components actually look like with interactive demos.</p>
              <p className="mt-2">Perfect for giving precise instructions to AI assistants!</p>
            </div>
          </div>
        </div>

        {/* Before & After Example */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            Transform Your AI Prompts
          </h4>
          
          <div className="space-y-3">
            {/* Before */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-red-400 font-medium mb-1">❌ Before (Unclear)</p>
                  <p className="text-sm text-gray-300">"{examplePrompts.before}"</p>
                </div>
                <button
                  onClick={() => handleCopy(examplePrompts.before, 'before')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  {copiedExample === 'before' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            {/* After */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-green-400 font-medium mb-1">✅ After (Precise)</p>
                  <p className="text-sm text-gray-300">"{examplePrompts.after}"</p>
                </div>
                <button
                  onClick={() => handleCopy(examplePrompts.after, 'after')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  {copiedExample === 'after' ? (
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
          <h4 className="font-semibold text-white mb-3">How to Use This Dictionary</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                1
              </span>
              <div>
                <p className="font-medium text-white">Search or Browse</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Search className="inline w-3 h-3 mr-1" />
                  Use the search bar to find terms, or browse by category
                </p>
              </div>
            </li>
            
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                2
              </span>
              <div>
                <p className="font-medium text-white">Click "View Demo"</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Eye className="inline w-3 h-3 mr-1" />
                  See interactive demonstrations of each component
                </p>
              </div>
            </li>
            
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                3
              </span>
              <div>
                <p className="font-medium text-white">Learn AI Synonyms</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Sparkles className="inline w-3 h-3 mr-1" />
                  Discover alternative terms AI understands
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                4
              </span>
              <div>
                <p className="font-medium text-white">Copy Code Examples</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Code className="inline w-3 h-3 mr-1" />
                  Get implementation code you can use immediately
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Categories Guide */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-400" />
            Browse by Category
          </h4>
          <div className="bg-black/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">UI Components</span>
              <p className="text-xs text-gray-400">Buttons, Cards, Modals, etc.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">Layout</span>
              <p className="text-xs text-gray-400">Grid, Flexbox, Sidebar layouts</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Navigation</span>
              <p className="text-xs text-gray-400">Menus, Tabs, Breadcrumbs</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Forms</span>
              <p className="text-xs text-gray-400">Inputs, Selects, Validation</p>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-300">
              <p className="font-semibold mb-2">Pro Tips for Maximum Value</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Try the interactive demos to understand component behavior</li>
                <li>• Use AI synonyms when your first prompt doesn't work</li>
                <li>• Copy code examples to jumpstart your projects</li>
                <li>• Bookmark frequently used terms for quick reference</li>
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
                <li>• Individual developers working with AI assistants</li>
                <li>• Learning proper UI/UX terminology</li>
                <li>• Understanding what components actually look like</li>
                <li>• Getting better results from AI code generation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* View Mode Tips */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <p className="text-sm text-white font-medium mb-2">💡 View Modes</p>
          <p className="text-xs text-gray-400">
            Toggle between <span className="text-cyan-400">Grid View</span> for visual browsing 
            and <span className="text-cyan-400">List View</span> for compact scanning.
          </p>
        </div>
      </div>
    </div>
  );
}

// Export metadata for dynamic loading
export const guideMetadata = {
  title: 'AI Dev Dictionary Guide',
  icon: '📚',
  available: true,
};