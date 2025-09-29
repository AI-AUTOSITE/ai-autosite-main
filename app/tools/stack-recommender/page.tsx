// app/tools/stack-recommender/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import AIStackRecommender from './components/AIStackRecommender';


export const metadata: Metadata = {
  title: 'Free AI Stack Recommender - No Ads, No Sign Up | AI AutoSite',
  description: 'Get personalized tech stack recommendations in 30 seconds. 100% free, no ads, no tracking.',
  keywords: 'free stack recommender, tech stack generator, no ads, ai development, privacy, no sign up',
  openGraph: {
    title: 'AI Stack Recommender - Truly Free, No Ads',
    description: 'Zero ads, zero tracking. Get perfect tech stack recommendations instantly.',
    type: 'website',
    images: [{
      url: '/og-stack-recommender.png',
      width: 1200,
      height: 630,
      alt: 'Free Stack Recommender - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stack Recommender - Free AI Tool',
    description: 'Tech stack advice without ads.'
  }
}

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