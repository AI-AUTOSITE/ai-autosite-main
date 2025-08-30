// app/tools/tech-stack-analyzer/page.tsx
import Link from 'next/link';
import { Metadata } from 'next';
import TechStackComparison from './components/TechStackComparison';

export const metadata: Metadata = {
  title: 'Tech Stack Analyzer & Framework Comparison | AI-AutoSite Tools',
  description: 'Compare frontend frameworks, build tools, and databases. Get AI-powered tech stack recommendations for your project. Next.js, React, Vue, Svelte comparison guide.',
  keywords: 'tech stack comparison, framework comparison tool, frontend technology guide, Next.js vs React, tech stack analyzer, developer tools',
  openGraph: {
    title: 'Tech Stack Analyzer - Choose the Right Technology',
    description: 'Professional technology comparison tool. Compare frameworks, get recommendations, understand trade-offs. Free and comprehensive.',
    type: 'website',
    url: 'https://ai-autosite.com/tools/tech-stack-analyzer'
  }
};

export default function TechStackAnalyzerPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/tools" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            ← Back to Tools
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              href="https://github.com/AI-AUTOSITE" 
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              View Source
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Live Tool
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Tech Stack
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Analyzer
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Compare frontend frameworks, understand trade-offs, and make informed technology decisions. 
            Perfect for beginners and AI-assisted developers.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">No Signup Required</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Always Free</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Beginner Friendly</span>
          </div>
        </div>
      </section>

      {/* Main Content - Tech Stack Comparison */}
      <TechStackComparison />

      {/* Bottom CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Need Code Analysis Too?</h2>
          <p className="text-gray-300 mb-8">
            Once you've chosen your tech stack, analyze your existing codebase with our dependency visualizer.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/tools/code-reader"
              className="px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Code Dependency Visualizer
            </Link>
            <Link 
              href="/tools"
              className="px-8 py-4 border border-gray-600 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              All Tools
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}