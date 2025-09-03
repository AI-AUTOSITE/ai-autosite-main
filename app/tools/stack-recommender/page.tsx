// app/tools/stack-recommender/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import AIStackRecommender from './components/AIStackRecommender';

export const metadata: Metadata = {
  title: 'AI Stack Recommender - Get Personalized Tech Stack in 30 Seconds | AI-AutoSite',
  description: 'Describe your project idea and get AI-powered tech stack recommendations. Perfect stack for your budget, timeline, and experience level. Free tool for developers.',
  keywords: 'ai stack recommender, tech stack generator, project stack advisor, framework recommendation, ai development tools, stack suggestion, project architecture',
  openGraph: {
    title: 'AI Stack Recommender - Personalized Tech Stack in 30 Seconds',
    description: 'Get AI-powered recommendations for your project. Tell us your idea, budget, and timeline - receive the perfect tech stack instantly.',
    type: 'website',
    url: 'https://ai-autosite.com/tools/stack-recommender',
  }
};

export default function StackRecommenderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Background animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Simple Header */}
      <header className="relative z-10 bg-white/5 backdrop-blur-md border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/tools" className="text-xl font-bold text-white hover:text-cyan-400 transition-colors">
            ← Back to Tools
          </Link>
          <Link 
            href="/tools/tech-stack-analyzer"
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Want detailed comparison? →
          </Link>
        </nav>
      </header>

      {/* Hero Section - Simplified */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium mb-6 border border-purple-500/20">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            AI-Powered
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            Stack Recommender
            <span className="block text-2xl sm:text-3xl mt-2 text-gray-400 font-normal">
              Your perfect tech stack in 30 seconds
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Describe your project idea. Get personalized recommendations based on your budget, timeline, and experience.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 bg-white/10 text-cyan-300 rounded-full text-sm font-medium border border-white/20">
              🚀 30 Second Results
            </span>
            <span className="px-4 py-2 bg-white/10 text-green-300 rounded-full text-sm font-medium border border-white/20">
              💰 Budget-Aware
            </span>
            <span className="px-4 py-2 bg-white/10 text-purple-300 rounded-full text-sm font-medium border border-white/20">
              🎯 Personalized
            </span>
          </div>
        </div>
      </section>

      {/* Main Tool */}
      <main className="relative z-10 pb-20">
        <AIStackRecommender />
      </main>

      {/* Link to Tech Stack Analyzer */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 bg-white/5 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Want to learn more about these technologies?
          </h2>
          <p className="text-gray-400 mb-6">
            Deep dive into framework comparisons, see detailed pros & cons, and explore use cases
          </p>
          <Link 
            href="/tools/tech-stack-analyzer"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
          >
            Explore Tech Stack Analyzer
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}