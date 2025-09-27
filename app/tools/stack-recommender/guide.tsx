// app/tools/stack-recommender/guide.tsx

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  AlertCircle, 
  BookOpen, 
  Code,
  Cpu,
  Database,
  Cloud,
  DollarSign,
  Clock,
  Sparkles,
  Lightbulb,
  Target,
  Info,
  Zap,
  Settings,
  Layers
} from 'lucide-react';

interface GuideProps {
  onClose?: () => void;
}

export default function StackRecommenderGuide({ onClose }: GuideProps) {
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  const projectExamples = {
    ecommerce: "I want to build an online store with payment processing and inventory management",
    ai_chat: "Create a chatbot with AI responses and conversation history",
    blog: "Build a personal website with blog posts and project showcase",
    saas: "Create a data visualization dashboard with user authentication"
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
          <Cpu className="w-8 h-8 text-purple-400" />
          <h3 className="text-2xl font-bold text-white">AI Stack Recommender Guide</h3>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        {/* Overview */}
        <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-purple-300">
              <p className="font-semibold mb-1">Get Your Perfect Tech Stack in 30 Seconds</p>
              <p>AI-powered recommendations based on your project, budget, and experience.</p>
              <p className="mt-2">Stop analysis paralysis - start building faster!</p>
            </div>
          </div>
        </div>

        {/* Project Examples */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Code className="w-5 h-5 text-cyan-400" />
            Project Description Examples
          </h4>
          
          <div className="space-y-2">
            {/* E-commerce */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-blue-400 font-medium mb-1">🛍️ E-commerce</p>
                  <p className="text-sm text-gray-300">{projectExamples.ecommerce}</p>
                </div>
                <button
                  onClick={() => handleCopy(projectExamples.ecommerce, 'ecommerce')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  {copiedExample === 'ecommerce' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            {/* AI Chat */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-purple-400 font-medium mb-1">💬 AI Application</p>
                  <p className="text-sm text-gray-300">{projectExamples.ai_chat}</p>
                </div>
                <button
                  onClick={() => handleCopy(projectExamples.ai_chat, 'ai_chat')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  {copiedExample === 'ai_chat' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Blog */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-green-400 font-medium mb-1">📝 Blog/Portfolio</p>
                  <p className="text-sm text-gray-300">{projectExamples.blog}</p>
                </div>
                <button
                  onClick={() => handleCopy(projectExamples.blog, 'blog')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  {copiedExample === 'blog' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* SaaS */}
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-cyan-400 font-medium mb-1">📊 SaaS Dashboard</p>
                  <p className="text-sm text-gray-300">{projectExamples.saas}</p>
                </div>
                <button
                  onClick={() => handleCopy(projectExamples.saas, 'saas')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  {copiedExample === 'saas' ? (
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
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                1
              </span>
              <div>
                <p className="font-medium text-white">Describe Your Project</p>
                <p className="text-sm text-gray-400 mt-1">
                  Use templates or write your own project idea
                </p>
              </div>
            </li>
            
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                2
              </span>
              <div>
                <p className="font-medium text-white">Set Your Constraints</p>
                <p className="text-sm text-gray-400 mt-1">
                  <DollarSign className="inline w-3 h-3 mr-1" />
                  Budget, 
                  <Clock className="inline w-3 h-3 mx-1" />
                  Timeline, 
                  <Zap className="inline w-3 h-3 mx-1" />
                  Experience
                </p>
              </div>
            </li>
            
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                3
              </span>
              <div>
                <p className="font-medium text-white">Get AI Recommendation</p>
                <p className="text-sm text-gray-400 mt-1">
                  Receive personalized stack in 30 seconds
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                4
              </span>
              <div>
                <p className="font-medium text-white">Start Building</p>
                <p className="text-sm text-gray-400 mt-1">
                  Copy setup commands and begin coding!
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* What You Get */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Layers className="w-5 h-5 text-green-400" />
            What's Included in Recommendations
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
              <Code className="w-4 h-4 text-cyan-400 mb-1" />
              <p className="text-sm font-medium text-white">Core Framework</p>
              <p className="text-xs text-gray-400">Next.js, React, Vue, etc.</p>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <Database className="w-4 h-4 text-green-400 mb-1" />
              <p className="text-sm font-medium text-white">Database</p>
              <p className="text-xs text-gray-400">PostgreSQL, MongoDB, etc.</p>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
              <Cloud className="w-4 h-4 text-purple-400 mb-1" />
              <p className="text-sm font-medium text-white">Hosting</p>
              <p className="text-xs text-gray-400">Vercel, AWS, etc.</p>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
              <Settings className="w-4 h-4 text-orange-400 mb-1" />
              <p className="text-sm font-medium text-white">Tools</p>
              <p className="text-xs text-gray-400">APIs, services, etc.</p>
            </div>
          </div>
        </div>

        {/* Budget Considerations */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <DollarSign className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-300">
              <p className="font-semibold mb-2">Budget-Aware Recommendations</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Free: Open source tools, free tiers</li>
                <li>• Under $20: Hobby projects, side hustles</li>
                <li>• $20-100: Small business, startups</li>
                <li>• $100+: Enterprise, scaling projects</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Experience Levels */}
        <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-300">
              <p className="font-semibold mb-2">Tailored to Your Experience</p>
              <ul className="space-y-1 text-gray-300">
                <li>• <strong>Beginner:</strong> Simple setups, good documentation</li>
                <li>• <strong>Intermediate:</strong> Balanced complexity</li>
                <li>• <strong>Advanced:</strong> Powerful but complex tools</li>
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
                <li>• Be specific about your project features</li>
                <li>• Consider long-term scaling needs</li>
                <li>• Factor in learning curve time</li>
                <li>• Start with MVP, then scale</li>
                <li>• Use free tiers to test first</li>
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
                <li>• Startup founders choosing tech stack</li>
                <li>• Developers starting new projects</li>
                <li>• Students learning web development</li>
                <li>• Freelancers estimating project costs</li>
                <li>• Teams evaluating technology options</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Start Commands */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-white font-medium mb-1">Quick Start Commands</p>
              <p className="text-gray-400 text-xs">
                After getting recommendations, you'll receive copy-paste commands 
                to set up your project immediately. No more searching for installation 
                guides!
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
  title: 'AI Stack Recommender Guide',
  icon: '🚀',
  available: true,
};