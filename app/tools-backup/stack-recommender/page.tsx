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