import Link from 'next/link'
import { Metadata } from 'next'
import {
  ArrowLeft,
  Monitor,
  Search,
  Shield,
  Zap,
  Globe,
  Play,
  Tag,
  ShoppingBag,
  Film,
  Tv,
  Check,
  X,
  ExternalLink,
} from 'lucide-react'

export const metadata: Metadata = {
  title:
    'Free Streaming Search - Where to Watch Movies & TV Shows Guide 2026 | AI AutoSite',
  description:
    'Find where to stream any movie or TV show across Netflix, Prime Video, Disney+, Hulu, Max, and more. No account needed, 100% private.',
  keywords:
    'streaming search, where to watch, streaming availability, netflix search, prime video, disney plus, free streaming checker',
  openGraph: {
    title: 'Free Streaming Search - Where to Watch Guide 2026',
    description:
      'Search across all major streaming services to find where any movie or TV show is available. 100% free and private.',
    type: 'article',
  },
}

export default function StreamingSearchGuidePage() {
  const publishDate = '2026-03-17'
  const author = 'AI AutoSite Team'
  const readTime = '5 min read'

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/blog"
        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-8 group"
      >
        <ArrowLeft
          className="mr-2 group-hover:-translate-x-1 transition-transform"
          size={20}
        />
        Back to Blog
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 flex-wrap">
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
            Analyzers
          </span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Free Streaming Search: Find Where to Watch Any Movie or TV Show
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Tired of opening 5 different streaming apps to find one movie? Our
          free tool searches Netflix, Prime Video, Disney+, Hulu, Max, and
          more in a single search — no account needed.
        </p>
      </header>

      {/* CTA */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6 sm:p-8 mb-12">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
              <Monitor className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg font-semibold text-white">
              Try the Streaming Search Tool
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Search any movie or TV show and instantly see where it&apos;s streaming.
            </p>
          </div>
          <Link
            href="/tools/streaming-search"
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Open Tool
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-invert prose-lg max-w-none">
        {/* The Problem */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
            <Film className="w-6 h-6 text-cyan-400" />
            The Problem: Streaming is Fragmented
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            With over 200 streaming services worldwide, finding where to watch
            a specific title has become a frustrating task. Most major services
            require an account just to search their catalog:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {[
              { name: 'Netflix', locked: true },
              { name: 'Disney+', locked: true },
              { name: 'Hulu', locked: true },
              { name: 'Max', locked: true },
              { name: 'Peacock', locked: true },
              { name: 'Paramount+', locked: true },
              { name: 'Apple TV+', locked: false },
              { name: 'Prime Video', locked: false },
            ].map((s) => (
              <div
                key={s.name}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
                  s.locked
                    ? 'bg-red-500/5 border-red-500/20 text-red-400'
                    : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                }`}
              >
                {s.locked ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                <span className="text-gray-300">{s.name}</span>
                <span className="text-xs ml-auto">
                  {s.locked ? 'Account required to search' : 'Open catalog'}
                </span>
              </div>
            ))}
          </div>
          <p className="text-gray-300 leading-relaxed">
            Our streaming search tool solves this by letting you search across
            all services in one place — completely free and without creating
            any accounts.
          </p>
        </section>

        {/* How it works */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-amber-400" />
            How It Works
          </h2>
          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Search for a title',
                desc: 'Type any movie or TV show name in the search bar. Results appear instantly as you type.',
                icon: Search,
              },
              {
                step: '2',
                title: 'Select your title',
                desc: 'Click on any result to see detailed streaming availability with poster, rating, cast, and more.',
                icon: Film,
              },
              {
                step: '3',
                title: 'See where to watch',
                desc: 'Instantly see which services offer it — organized by subscription, rent, and buy options.',
                icon: Monitor,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-4 p-5 bg-gray-800/40 rounded-xl border border-gray-700/40"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Status types */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
            <Tag className="w-6 h-6 text-amber-400" />
            Understanding Availability Types
          </h2>
          <div className="space-y-3">
            {[
              {
                label: 'Subscription',
                desc: 'Included with your streaming subscription (Netflix, Prime, Disney+, etc.)',
                icon: Play,
                color: 'cyan',
              },
              {
                label: 'Free with Ads',
                desc: 'Available for free on ad-supported services like Tubi or Pluto TV',
                icon: Monitor,
                color: 'green',
              },
              {
                label: 'Rent',
                desc: 'Available to rent for a limited time (usually 48 hours)',
                icon: Tag,
                color: 'amber',
              },
              {
                label: 'Buy',
                desc: 'Available to purchase for permanent access',
                icon: ShoppingBag,
                color: 'orange',
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex items-start gap-4 p-4 rounded-xl bg-${item.color}-500/5 border border-${item.color}-500/20`}
              >
                <item.icon className={`w-5 h-5 text-${item.color}-400 flex-shrink-0 mt-0.5`} />
                <div>
                  <h3 className="text-white font-medium">{item.label}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Multi-region */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-blue-400" />
            Multi-Region Support
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Streaming catalogs vary by country. A movie on Netflix US might
            not be on Netflix UK. Use the region picker next to the search bar
            to check availability in 10 supported regions including the US,
            UK, Canada, Japan, and more.
          </p>
        </section>

        {/* Privacy */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-emerald-400" />
            100% Private
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Unlike other streaming search services that require accounts and
            track your viewing habits, our tool collects zero personal data:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'No account required',
              'No cookies or tracking',
              'No search history stored',
              'No personal data collected',
              'No ads or paywalls',
              'Results not stored on server',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg"
              >
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Data source */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Data Source & Attribution</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            This tool uses data from The Movie Database (TMDB), with streaming
            availability information powered by JustWatch. Data is typically
            updated daily, though there may be a 24-32 hour delay before the
            latest changes are reflected.
          </p>
          <p className="text-gray-400 text-sm italic">
            This product uses the TMDB API but is not endorsed or certified
            by TMDB. Streaming availability data is provided by JustWatch.
          </p>
        </section>
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <Link
          href="/tools/streaming-search"
          className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-semibold rounded-xl transition-colors text-lg"
        >
          <Search className="w-5 h-5" />
          Try Streaming Search Now
        </Link>
        <p className="text-gray-500 text-sm mt-3">
          Free, instant, no account needed
        </p>
      </div>

      {/* Author */}
      <footer className="mt-16 pt-8 border-t border-gray-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <p className="text-white font-medium">{author}</p>
            <p className="text-gray-500 text-sm">
              Published {publishDate} • {readTime}
            </p>
          </div>
        </div>
      </footer>
    </article>
  )
}
