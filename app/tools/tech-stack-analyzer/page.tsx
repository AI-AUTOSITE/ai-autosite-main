// app/tools/tech-stack-analyzer/page.tsx
import Link from 'next/link';
import { Metadata } from 'next';
import TechStackComparison from './components/TechStackComparison';

export const metadata: Metadata = {
  title: 'Tech Stack Analyzer & Framework Comparison Tool | AI-AutoSite',
  description: 'Compare Next.js, React, Vue, Svelte and more. Get AI-powered recommendations for your project with beginner-friendly explanations. Free tech stack comparison tool.',
  keywords: 'tech stack analyzer, framework comparison, Next.js vs React, frontend framework comparison, web development tools, technology stack guide, developer tools, AI recommendations',
  authors: [{ name: 'AI-AutoSite' }],
  creator: 'AI-AutoSite',
  publisher: 'AI-AutoSite',
  robots: 'index, follow',
  openGraph: {
    title: 'Tech Stack Analyzer - Choose the Right Framework | AI-AutoSite',
    description: 'Professional technology comparison tool with AI-powered recommendations. Compare frameworks, understand trade-offs, make informed decisions. Free forever.',
    type: 'website',
    url: 'https://ai-autosite.com/tools/tech-stack-analyzer',
    siteName: 'AI-AutoSite',
    images: [{
      url: 'https://ai-autosite.com/og-tech-stack-analyzer.jpg',
      width: 1200,
      height: 630,
      alt: 'Tech Stack Analyzer - Framework Comparison Tool'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Stack Analyzer - Choose the Right Framework',
    description: 'Compare frameworks with AI-powered recommendations. Next.js, React, Vue, Svelte comparison made simple.',
    images: ['https://ai-autosite.com/og-tech-stack-analyzer.jpg']
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/tech-stack-analyzer'
  }
};

export default function TechStackAnalyzerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Background animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/tools" className="text-xl font-bold text-white hover:text-cyan-400 transition-colors">
            ← Back to Tools
          </Link>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/ai-autosite" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm border border-white/10"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              View Source
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-6 border border-green-500/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Live Tool
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            Tech Stack
            <span className="block text-3xl sm:text-5xl mt-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Analyzer
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Compare frameworks with AI-powered insights, understand trade-offs, and make confident technology decisions. 
            Built for developers who want clarity, not complexity.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="px-4 py-2 bg-white/10 text-cyan-300 rounded-full text-sm font-medium border border-white/20">No Signup Required</span>
            <span className="px-4 py-2 bg-white/10 text-green-300 rounded-full text-sm font-medium border border-white/20">Always Free</span>
            <span className="px-4 py-2 bg-white/10 text-purple-300 rounded-full text-sm font-medium border border-white/20">Beginner Friendly</span>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-cyan-400">8+</div>
              <div className="text-sm text-gray-400">Technologies Compared</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-green-400">50+</div>
              <div className="text-sm text-gray-400">Key Features Analyzed</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-purple-400">6</div>
              <div className="text-sm text-gray-400">Use Case Examples</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Tech Stack Comparison */}
      <main className="relative z-10">
        <TechStackComparison />
      </main>

      {/* Related Tools Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-white/5 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Complete Your Development Workflow</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Link 
              href="/tools/code-reader"
              className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-2xl mb-4">
                🔍
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                Code Dependency Visualizer
              </h3>
              <p className="text-gray-400 mb-4">
                Analyze your existing codebase structure and understand file dependencies. 
                Perfect companion after choosing your tech stack.
              </p>
              <div className="inline-flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                <span>Analyze Code Structure</span>
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link 
              href="/tools/blurtap"
              className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl mb-4">
                🔒
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                BlurTap - Privacy Tool
              </h3>
              <p className="text-gray-400 mb-4">
                Protect sensitive information in screenshots and documentation. 
                Essential for sharing development progress securely.
              </p>
              <div className="inline-flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
                <span>Secure Your Screenshots</span>
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/tools"
              className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all border border-white/20"
            >
              <span>View All Tools</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Found This Tool Helpful?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            We're building more tools to help developers make better decisions. 
            Your feedback helps us prioritize what to build next.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:aiautosite@gmail.com?subject=Tech%20Stack%20Analyzer%20Feedback"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Feedback
            </a>
            <Link 
              href="/request"
              className="inline-flex items-center px-8 py-4 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all border border-white/20"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Request New Tool
            </Link>
          </div>
        </div>
      </section>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Tech Stack Analyzer",
            "description": "Compare frontend frameworks and get AI-powered technology recommendations",
            "url": "https://ai-autosite.com/tools/tech-stack-analyzer",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "creator": {
              "@type": "Organization",
              "name": "AI-AutoSite",
              "url": "https://ai-autosite.com"
            },
            "featureList": [
              "Next.js vs React comparison",
              "Framework performance analysis", 
              "AI-powered recommendations",
              "Beginner-friendly explanations",
              "Use case recommendations"
            ]
          })
        }}
      />
    </div>
  );
}