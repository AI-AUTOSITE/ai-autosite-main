// app/tools/text-counter/guide.tsx

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  AlertCircle, 
  BookOpen, 
  Type,
  Twitter,
  MessageSquare,
  FileText,
  Hash,
  Clock,
  AlignLeft,
  Sparkles,
  Lightbulb,
  Target,
  Info,
  TrendingUp
} from 'lucide-react';

interface GuideProps {
  onClose?: () => void;
}

export default function TextCounterGuide({ onClose }: GuideProps) {
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  const platformLimits = {
    twitter: { limit: 280, name: "Twitter/X" },
    sms: { limit: 160, name: "SMS" },
    metaDescription: { limit: 155, name: "Meta Description" },
    instagram: { limit: 2200, name: "Instagram Caption" }
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
          <h3 className="text-2xl font-bold text-white">Text Counter Guide</h3>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        {/* Overview */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-cyan-300">
              <p className="font-semibold mb-1">Count Words & Characters Instantly</p>
              <p>Track text length for essays, social media posts, and SEO content.</p>
              <p className="mt-2">Real-time counting with platform-specific limit indicators!</p>
            </div>
          </div>
        </div>

        {/* What It Counts */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Hash className="w-5 h-5 text-purple-400" />
            What This Tool Counts
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <BookOpen className="w-4 h-4 text-blue-400 mb-1" />
              <p className="text-sm font-medium text-white">Words</p>
              <p className="text-xs text-gray-400">Space-separated text</p>
            </div>
            
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
              <Hash className="w-4 h-4 text-purple-400 mb-1" />
              <p className="text-sm font-medium text-white">Characters</p>
              <p className="text-xs text-gray-400">With & without spaces</p>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <AlignLeft className="w-4 h-4 text-green-400 mb-1" />
              <p className="text-sm font-medium text-white">Lines & Paragraphs</p>
              <p className="text-xs text-gray-400">Text structure</p>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
              <Clock className="w-4 h-4 text-orange-400 mb-1" />
              <p className="text-sm font-medium text-white">Reading Time</p>
              <p className="text-xs text-gray-400">~200 words/min</p>
            </div>
          </div>
        </div>

        {/* Platform Limits */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Twitter className="w-5 h-5 text-blue-400" />
            Platform Character Limits
          </h4>
          
          <div className="space-y-2">
            {Object.entries(platformLimits).map(([key, platform]) => (
              <div key={key} className="bg-gray-800/50 border border-white/10 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{platform.name}</p>
                    <p className="text-xs text-gray-400">Max: {platform.limit} characters</p>
                  </div>
                  <button
                    onClick={() => handleCopy(platform.limit.toString(), key)}
                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                  >
                    {copiedExample === key ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Limits */}
          <div className="mt-3 bg-black/30 rounded-lg p-3 text-xs text-gray-400">
            <p className="font-medium text-gray-300 mb-1">More Platform Limits:</p>
            <div className="grid grid-cols-2 gap-1">
              <span>• LinkedIn: 3,000</span>
              <span>• Meta Title: 60</span>
              <span>• Email Subject: 50</span>
              <span>• YouTube Title: 100</span>
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
                <p className="font-medium text-white">Type or Paste Text</p>
                <p className="text-sm text-gray-400 mt-1">
                  Enter your content in the text area
                </p>
              </div>
            </li>
            
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                2
              </span>
              <div>
                <p className="font-medium text-white">Watch Real-Time Stats</p>
                <p className="text-sm text-gray-400 mt-1">
                  See word count, characters, and more update instantly
                </p>
              </div>
            </li>
            
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                3
              </span>
              <div>
                <p className="font-medium text-white">Check Platform Limits</p>
                <p className="text-sm text-gray-400 mt-1">
                  Visual indicators show if you're within limits
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                4
              </span>
              <div>
                <p className="font-medium text-white">Copy Your Text</p>
                <p className="text-sm text-gray-400 mt-1">
                  One-click copy when you're done
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Word Count Guidelines */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <FileText className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-300">
              <p className="font-semibold mb-2">Content Length Guidelines</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Blog posts: 1,000-2,500 words (SEO optimal)</li>
                <li>• College essays: 250-650 words</li>
                <li>• Product descriptions: 150-300 words</li>
                <li>• Executive summary: 100-250 words</li>
                <li>• Social media bio: 150-160 characters</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reading Time Info */}
        <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-orange-300">
              <p className="font-semibold mb-2">Reading Speed Reference</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Average adult: 200 words/minute</li>
                <li>• Fast reader: 300 words/minute</li>
                <li>• Technical content: 100 words/minute</li>
                <li>• Skimming: 400-700 words/minute</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-300">
              <p className="font-semibold mb-2">Pro Tips</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Emojis count as 2+ characters on most platforms</li>
                <li>• Keep 10% buffer - platforms count differently</li>
                <li>• Characters without spaces matter for some limits</li>
                <li>• URLs are often shortened automatically</li>
                <li>• Line breaks count as 1-2 characters</li>
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
                <li>• Writing essays with word requirements</li>
                <li>• Crafting perfect social media posts</li>
                <li>• Optimizing SEO meta descriptions</li>
                <li>• Creating SMS marketing messages</li>
                <li>• Checking article reading time</li>
                <li>• Meeting character limits for forms</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Academic Writing */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-white font-medium mb-2">Academic Writing Standards</p>
              <div className="space-y-1 text-xs text-gray-400">
                <p>• High school essay: 300-1,000 words</p>
                <p>• College admission: 400-650 words</p>
                <p>• Research paper: 2,500-7,000 words</p>
                <p>• Thesis: 10,000-20,000 words</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Facts */}
        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-white font-medium mb-1">Did You Know?</p>
              <p className="text-gray-400 text-xs">
                The average English word is 4.5 characters long. This tool counts 
                sentences by periods, exclamation marks, and question marks. 
                Paragraphs are detected by double line breaks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export metadata for dynamic loading
export const guideMetadata = {
  title: 'Text Counter Guide',
  icon: '📝',
  available: true,
};