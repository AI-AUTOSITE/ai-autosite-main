import { X, Zap, Code, Database, Cloud, Globe, Gauge, Check } from 'lucide-react'

export default function TechStackAnalyzerGuide() {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-md">
      <button className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-colors">
        <X className="w-5 h-5 text-gray-400 hover:text-white" />
      </button>

      <h3 className="text-xl font-bold text-white mb-4">Quick Guide</h3>

      {/* How to Use */}
      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-cyan-600/20 rounded-full flex items-center justify-center text-cyan-400 font-bold text-sm flex-shrink-0">
            1
          </div>
          <div>
            <p className="text-white font-medium text-sm">Select Technologies</p>
            <p className="text-gray-400 text-xs">Click up to 3 items to compare</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-cyan-600/20 rounded-full flex items-center justify-center text-cyan-400 font-bold text-sm flex-shrink-0">
            2
          </div>
          <div>
            <p className="text-white font-medium text-sm">Compare Side-by-Side</p>
            <p className="text-gray-400 text-xs">Switch to Compare view</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-cyan-600/20 rounded-full flex items-center justify-center text-cyan-400 font-bold text-sm flex-shrink-0">
            3
          </div>
          <div>
            <p className="text-white font-medium text-sm">Analyze Results</p>
            <p className="text-gray-400 text-xs">See features, pros, cons</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="text-white font-medium text-sm mb-2">Categories</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <Code className="w-3 h-3 text-blue-300" />
            <span className="text-gray-300">Framework - Next.js, Astro, SvelteKit</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-green-300" />
            <span className="text-gray-300">Build Tool - Vite</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3 text-yellow-300" />
            <span className="text-gray-300">Styling - Tailwind CSS</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-3 h-3 text-purple-300" />
            <span className="text-gray-300">Database - Supabase</span>
          </div>
          <div className="flex items-center gap-2">
            <Cloud className="w-3 h-3 text-red-300" />
            <span className="text-gray-300">Hosting - Vercel</span>
          </div>
        </div>
      </div>

      {/* Learning Levels */}
      <div className="mb-6">
        <h4 className="text-white font-medium text-sm mb-2">Learning Levels</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <Gauge className="w-3 h-3 text-green-400" />
            <span className="text-green-400">Beginner</span>
            <span className="text-gray-400">- Easy to start</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="w-3 h-3 text-yellow-400" />
            <span className="text-yellow-400">Intermediate</span>
            <span className="text-gray-400">- Some concepts</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="w-3 h-3 text-red-400" />
            <span className="text-red-400">Advanced</span>
            <span className="text-gray-400">- Steep learning</span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-cyan-600/10 border border-cyan-600/20 rounded-lg p-3">
        <h4 className="text-cyan-400 font-medium text-sm mb-2 flex items-center gap-1">
          <Check className="w-3 h-3" />
          Tips
        </h4>
        <ul className="space-y-1 text-xs text-gray-300">
          <li>• Compare similar categories first</li>
          <li>• Consider your experience level</li>
          <li>• Check pros and cons carefully</li>
          <li>• Look at use cases for best fit</li>
        </ul>
      </div>
    </div>
  )
}
