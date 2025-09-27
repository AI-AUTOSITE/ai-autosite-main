// app/blog/ai-project-visualizer/page.tsx

import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, FolderTree, Upload, Download, Shield, Zap, Code, FileText, GitBranch, Users, Sparkles, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Introducing AI Project Visualizer: Transform Your Code Structure into Shareable Diagrams | AI AutoSite',
  description: 'Convert your project file structure into Mermaid diagrams, tree formats, JSON, or Markdown. Perfect for AI collaboration, documentation, and code reviews. No ads, no tracking, completely free.',
  keywords: 'project visualizer, file structure diagram, mermaid diagram generator, tree structure tool, AI collaboration, code documentation, project mapping, developer tools',
  openGraph: {
    title: 'AI Project Visualizer: Share Your Code Structure with AI Tools',
    description: 'Transform project structures into shareable formats for better AI collaboration',
    type: 'article',
    images: ['/og-project-visualizer.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Project Visualizer: Perfect for AI Collaboration',
    description: 'Convert file structures to Mermaid, Tree, JSON, or Markdown formats',
  }
}

export default function AIProjectVisualizerBlogPost() {
  const publishDate = '2025-01-28'
  const author = 'AI AutoSite Team'
  const readTime = '4 min read'

  const features = [
    {
      icon: Upload,
      title: 'Drag & Drop Upload',
      description: 'Simply drag your project folder or select files - works instantly in your browser'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Automatically excludes sensitive files like .env, node_modules, and credentials'
    },
    {
      icon: FileText,
      title: 'Multiple Export Formats',
      description: 'Export as Tree, Mermaid diagram, JSON, or Markdown - perfect for any use case'
    },
    {
      icon: Zap,
      title: '100% Local Processing',
      description: 'Your files never leave your browser - lightning fast and completely private'
    }
  ]

  const useCases = [
    {
      title: 'For AI Collaboration',
      description: 'Share your project structure with Claude, ChatGPT, or GitHub Copilot for better context',
      highlights: ['Optimized formats for LLMs', 'Clean, readable output', 'Context preservation']
    },
    {
      title: 'For Documentation',
      description: 'Generate professional project structure diagrams for README files and docs',
      highlights: ['Mermaid diagrams for GitHub', 'Markdown for wikis', 'Visual representations']
    },
    {
      title: 'For Code Reviews',
      description: 'Quickly share project organization with team members or reviewers',
      highlights: ['Instant visualization', 'No setup required', 'Universal formats']
    }
  ]

  const formats = [
    {
      name: 'Tree Format',
      best: 'Claude, ChatGPT',
      example: `my-project/
├── src/
│   ├── components/
│   └── utils/
└── package.json`
    },
    {
      name: 'Mermaid Diagram',
      best: 'GitHub, Notion',
      example: `graph TD
    A[my-project]
    A --> B[src]
    B --> C[components]`
    },
    {
      name: 'JSON Format',
      best: 'APIs, Automation',
      example: `{
  "name": "my-project",
  "children": [...]
}`
    },
    {
      name: 'Markdown',
      best: 'Documentation',
      example: `## Project Structure
- **src/**
  - components/
  - utils/`
    }
  ]

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back to Blog */}
      <Link 
        href="/blog" 
        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-8 group"
      >
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
        Back to Blog
      </Link>

      {/* Article Header */}
      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
            New Tool
          </span>
          <span>•</span>
          <time dateTime={publishDate}>{new Date(publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Introducing AI Project Visualizer:
          <span className="block text-3xl sm:text-4xl mt-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Transform Your Code Structure into Shareable Diagrams
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 leading-relaxed">
          Convert your project's file structure into beautiful diagrams and formats that AI tools can understand. 
          Perfect for getting better help from Claude, ChatGPT, or creating documentation.
        </p>
      </header>

      {/* Hero Image/Demo */}
      <div className="mb-12 p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-white/10">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <FolderTree className="w-24 h-24 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">AI Project Visualizer</h2>
            <p className="text-gray-400 mb-6">Drag, Drop, and Share Your Project Structure</p>
            <Link
              href="/tools/ai-project-visualizer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <Zap className="mr-2" size={20} />
              Try It Now - 100% Free!
            </Link>
          </div>
        </div>
      </div>

      {/* Why We Built This */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Why We Built This Tool</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 mb-4">
            When working with AI assistants like Claude or ChatGPT, providing context about your project structure 
            is crucial for getting accurate help. Manually typing out file structures is tedious and error-prone.
          </p>
          <p className="text-gray-300 mb-4">
            We created AI Project Visualizer to solve this problem. In seconds, you can transform your entire 
            project structure into a format that AI tools can understand, making collaboration more effective 
            and saving valuable development time.
          </p>
          <p className="text-gray-300 mb-4">
            Plus, with automatic exclusion of sensitive files and 100% local processing, your code and credentials 
            stay safe on your machine.
          </p>
        </div>
      </section>

      {/* Key Features */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-8">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 bg-opacity-20">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">How It Works</h2>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Upload Your Project</h3>
              <p className="text-gray-400">Drag and drop your project folder or select files. Node_modules and sensitive files are automatically excluded.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Choose Your Format</h3>
              <p className="text-gray-400">Select from Tree (best for AI), Mermaid (for diagrams), JSON (for processing), or Markdown (for docs).</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Copy or Download</h3>
              <p className="text-gray-400">Instantly copy to clipboard or download as a file. Share with AI tools or add to your documentation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Export Formats */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-8">Export Formats Explained</h2>
        <div className="grid lg:grid-cols-2 gap-6">
          {formats.map((format, index) => (
            <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">{format.name}</h3>
              <p className="text-sm text-cyan-400 mb-3">Best for: {format.best}</p>
              <pre className="bg-black/40 rounded-lg p-3 overflow-x-auto">
                <code className="text-xs text-gray-300">{format.example}</code>
              </pre>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-8">Perfect For Every Scenario</h2>
        <div className="grid lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <div key={index} className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-3">{useCase.title}</h3>
              <p className="text-gray-400 mb-4">{useCase.description}</p>
              <ul className="space-y-2">
                {useCase.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-300">
                    <Sparkles className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Security & Privacy First</h2>
        <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-xl p-6 border border-white/10">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Your Files Stay Safe</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span><strong className="text-white">100% Local Processing:</strong> Files never leave your browser</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span><strong className="text-white">Auto-Exclusion:</strong> .env, credentials, and API keys are automatically filtered</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span><strong className="text-white">No Storage:</strong> Nothing is saved or cached on any server</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span><strong className="text-white">Open Source:</strong> Full code transparency on GitHub</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Implementation */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Built with Performance in Mind</h2>
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <p className="text-gray-300 mb-4">
            AI Project Visualizer is engineered for speed and efficiency:
          </p>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <Code className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
              <span><strong className="text-white">Web File API:</strong> Native browser APIs for instant file processing</span>
            </li>
            <li className="flex items-start">
              <Code className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
              <span><strong className="text-white">React Hooks:</strong> Optimized state management with useCallback and useMemo</span>
            </li>
            <li className="flex items-start">
              <Code className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
              <span><strong className="text-white">Smart Filtering:</strong> Efficient exclusion of build artifacts and dependencies</span>
            </li>
            <li className="flex items-start">
              <Code className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
              <span><strong className="text-white">Handles Large Projects:</strong> Processes up to 1000 files without performance issues</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Stats & Performance */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Lightning Fast Performance</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">&lt; 100ms</h3>
            <p className="text-gray-400 text-sm">Processing time for 1000 files</p>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">50MB</h3>
            <p className="text-gray-400 text-sm">Maximum project size supported</p>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <Users className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">100%</h3>
            <p className="text-gray-400 text-sm">Free forever, no limits</p>
          </div>
        </div>
      </section>

      {/* Real World Example */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Real-World Example</h2>
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <p className="text-gray-300 mb-4">
            Here's how developers are using AI Project Visualizer to improve their workflow:
          </p>
          <div className="bg-black/40 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-400 mb-2">1. Upload your React project</p>
            <p className="text-sm text-gray-400 mb-2">2. Select "Tree" format for AI tools</p>
            <p className="text-sm text-gray-400 mb-2">3. Copy the output</p>
            <p className="text-sm text-gray-400">4. Paste into Claude/ChatGPT with your question</p>
          </div>
          <p className="text-cyan-400 text-sm">
            Result: AI understands your project structure instantly and provides more accurate, context-aware assistance.
          </p>
        </div>
      </section>

      {/* Future Updates */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">What's Coming Next</h2>
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl p-6 border border-white/10">
          <p className="text-gray-300 mb-4">
            We're constantly improving based on user feedback:
          </p>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center">
              <Sparkles className="w-4 h-4 text-cyan-400 mr-2" />
              Git diff visualization for showing changes
            </li>
            <li className="flex items-center">
              <Sparkles className="w-4 h-4 text-cyan-400 mr-2" />
              Custom exclusion rules for specific projects
            </li>
            <li className="flex items-center">
              <Sparkles className="w-4 h-4 text-cyan-400 mr-2" />
              File content preview (first N lines)
            </li>
            <li className="flex items-center">
              <Sparkles className="w-4 h-4 text-cyan-400 mr-2" />
              Batch export to multiple formats at once
            </li>
          </ul>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-4">Start Visualizing Your Projects</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of developers who are already using AI Project Visualizer to improve their AI 
          collaborations and documentation workflow.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tools/ai-project-visualizer"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <FolderTree className="mr-2" size={20} />
            Try AI Project Visualizer
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
          >
            Explore All Tools
          </Link>
        </div>
        <p className="text-xs text-gray-500 mt-6">
          No signup required • Works offline • Your files never leave your browser
        </p>
      </section>

      {/* Author Info */}
      <footer className="mt-12 pt-8 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            By {author} • {publishDate}
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-white/10 text-gray-300 rounded-md text-xs">
              Development
            </span>
            <span className="px-3 py-1 bg-white/10 text-gray-300 rounded-md text-xs">
              Tools
            </span>
            <span className="px-3 py-1 bg-white/10 text-gray-300 rounded-md text-xs">
              AI
            </span>
          </div>
        </div>
      </footer>
    </article>
  )
}