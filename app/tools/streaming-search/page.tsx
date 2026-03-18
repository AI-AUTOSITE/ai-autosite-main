import { Metadata } from 'next'
import { Suspense } from 'react'
import StreamingSearchClient from './components/StreamingSearchClient'

export const metadata: Metadata = {
  title: 'Free Streaming Search - Where to Watch Movies & TV Shows | AI AutoSite',
  description:
    'Find where to stream any movie or TV show. Check Netflix, Prime Video, Disney+, Hulu, and more. No account needed, 100% private. Free streaming availability checker.',
  keywords: [
    'where to watch',
    'streaming search',
    'streaming availability',
    'where to stream',
    'netflix search',
    'prime video search',
    'disney plus search',
    'free streaming checker',
    'movie streaming finder',
    'tv show streaming search',
    'watch providers',
    'streaming guide',
  ].join(', '),
  openGraph: {
    title: 'Where to Watch Movies & TV Shows - Free Streaming Search',
    description:
      'Search any movie or TV show and instantly see which streaming services have it. No account needed.',
    type: 'website',
    images: [
      {
        url: '/og-streaming-search.png',
        width: 1200,
        height: 630,
        alt: 'Free Streaming Availability Checker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Where to Watch - Free Streaming Search',
    description:
      'Find where to stream movies and TV shows across all major services. 100% private.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/streaming-search',
  },
}

export default function StreamingSearchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" /></div>}>
      <StreamingSearchClient />
    </Suspense>
  )
}
