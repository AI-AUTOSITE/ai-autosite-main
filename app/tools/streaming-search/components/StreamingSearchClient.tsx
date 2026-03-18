'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Search,
  X,
  Star,
  Film,
  Tv,
  Monitor,
  TrendingUp,
  Shield,
  Loader2,
} from 'lucide-react'

// ==========================================
// Types
// ==========================================
interface SearchResult {
  id: number
  title: string
  originalTitle?: string
  mediaType: 'movie' | 'tv'
  year: string
  posterPath: string | null
  backdropPath: string | null
  overview: string
  voteAverage: number
  genreIds: number[]
}

// ==========================================
// Constants
// ==========================================
const TMDB_IMG = 'https://image.tmdb.org/t/p'
const REGIONS = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
]

// ==========================================
// Main Component
// ==========================================
export default function StreamingSearchClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [trending, setTrending] = useState<SearchResult[]>([])
  const [region, setRegion] = useState('US')
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')
  const [showRegionPicker, setShowRegionPicker] = useState(false)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // ---- Fetch trending on mount ----
  useEffect(() => {
    fetchTrending()
  }, [])

  // ---- Restore search from URL param on mount ----
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
    }
  }, [])

  const fetchTrending = async () => {
    try {
      const res = await fetch('/api/streaming-search?action=trending')
      const data = await res.json()
      if (data.results) setTrending(data.results)
    } catch {
      // Silent fail for trending
    }
  }

  // ---- Actual search function ----
  const performSearch = async (value: string) => {
    setIsSearching(true)
    try {
      const res = await fetch(
        `/api/streaming-search?action=search&q=${encodeURIComponent(value.trim())}`
      )
      const data = await res.json()
      if (data.error) {
        setError(data.error)
        setResults([])
      } else {
        setResults(data.results || [])
      }
    } catch {
      setError('Search failed. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  // ---- Debounced search with URL update ----
  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value)
      setError('')

      if (debounceRef.current) clearTimeout(debounceRef.current)

      if (!value.trim()) {
        setResults([])
        // Remove q param from URL
        router.replace('/tools/streaming-search', { scroll: false })
        return
      }

      debounceRef.current = setTimeout(() => {
        // Update URL with search query (for back navigation)
        router.replace(`/tools/streaming-search?q=${encodeURIComponent(value.trim())}`, { scroll: false })
        performSearch(value)
      }, 350)
    },
    []
  )

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setError('')
    router.replace('/tools/streaming-search', { scroll: false })
    searchInputRef.current?.focus()
  }

  const currentRegion = REGIONS.find((r) => r.code === region) || REGIONS[0]

  // Helper to generate movie page URL slug (includes region if not US)
  const getMovieUrl = (r: SearchResult) => {
    const slug = (r.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const regionParam = region !== 'US' ? `?region=${region}` : ''
    return `/movies/${r.mediaType}-${r.id}-${slug}${regionParam}`
  }

  // ==========================================
  // Render
  // ==========================================
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-4">
          <Monitor className="w-3.5 h-3.5" />
          <span>Streaming Availability Checker</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Where to Watch Movies & TV Shows
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
          Search any movie or TV show and instantly see which streaming services have it.
          No account needed — 100% private.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto mb-8">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search movies and TV shows..."
            className="w-full pl-12 pr-24 py-3.5 bg-gray-800/80 border border-gray-700/60 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-base"
            autoFocus
          />
          <div className="absolute right-2 flex items-center gap-1.5">
            {query && (
              <button
                onClick={clearSearch}
                className="p-1.5 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {/* Region Picker */}
            <div className="relative">
              <button
                onClick={() => setShowRegionPicker(!showRegionPicker)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-700/60 hover:bg-gray-600/60 rounded-lg text-sm text-gray-300 transition-colors"
              >
                <span>{currentRegion.flag}</span>
                <span className="hidden sm:inline text-xs">{region}</span>
              </button>
              {showRegionPicker && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowRegionPicker(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 z-50 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl py-2 w-52 max-h-64 overflow-y-auto">
                    {REGIONS.map((r) => (
                      <button
                        key={r.code}
                        onClick={() => {
                          setRegion(r.code)
                          setShowRegionPicker(false)
                        }}
                        className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-700/60 transition-colors text-sm ${
                          r.code === region ? 'text-cyan-400 bg-cyan-500/10' : 'text-gray-300'
                        }`}
                      >
                        <span className="text-lg">{r.flag}</span>
                        <span>{r.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {isSearching && (
          <div className="absolute left-1/2 -translate-x-1/2 mt-2">
            <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-2xl mx-auto mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-4">
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </h3>
          <ResultsGrid results={results} getUrl={getMovieUrl} />
        </div>
      )}

      {/* No results */}
      {query && !isSearching && results.length === 0 && !error && (
        <div className="text-center py-12">
          <Film className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No results found for &ldquo;{query}&rdquo;</p>
          <p className="text-gray-500 text-sm mt-1">Try a different search term</p>
        </div>
      )}

      {/* Trending (show when no search) */}
      {!query && trending.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-medium text-gray-400">Trending This Week</h3>
          </div>
          <ResultsGrid results={trending} getUrl={getMovieUrl} />
        </div>
      )}

      {/* Attribution & Privacy Footer */}
      <div className="mt-12 pt-8 border-t border-gray-800/60 space-y-6">
        {/* Privacy Notice */}
        <div className="max-w-2xl mx-auto px-4 py-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl text-center">
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-medium mb-2">
            <Shield className="w-5 h-5" />
            <span>100% Private — No Data Sent to External Services</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your search queries are processed through our server only. No personal data, IP address,
            or browsing history is sent to TMDB, JustWatch, or any third party.
            Nothing is stored — all data is cleared when you leave the page.
          </p>
        </div>

        {/* TMDB + JustWatch Attribution */}
        <div className="max-w-2xl mx-auto px-6 py-5 bg-gray-800/40 border border-gray-700/30 rounded-xl">
          <div className="flex flex-wrap items-center justify-center gap-6 mb-3">
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
              <img
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                alt="The Movie Database (TMDB)"
                className="h-14"
              />
            </a>
            <span className="text-gray-600 text-3xl font-light">+</span>
            <a href="https://www.justwatch.com" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
              <span className="text-2xl font-bold text-yellow-400">JustWatch</span>
            </a>
          </div>
          <p className="text-base text-gray-400 text-center leading-relaxed">
            Streaming availability data powered by JustWatch.
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// Results Grid
// ==========================================
function ResultsGrid({
  results,
  getUrl,
}: {
  results: SearchResult[]
  getUrl: (r: SearchResult) => string
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
      {results.map((r) => (
        <Link
          key={`${r.mediaType}-${r.id}`}
          href={getUrl(r)}
          className="block min-w-0 w-full overflow-hidden text-left focus:outline-none group"
        >
          {/* Poster — native aspect-ratio, no padding hack */}
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-gray-800/60 border border-gray-700/40 group-hover:border-cyan-500/40 transition-all group-hover:shadow-lg group-hover:shadow-cyan-500/10">
            {r.posterPath ? (
              <img
                src={`${TMDB_IMG}/w342${r.posterPath}`}
                alt={r.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                <Film className="w-10 h-10" />
              </div>
            )}
            {/* Type badge */}
            <div className="absolute top-2 left-2 z-10">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/70 text-[10px] text-gray-300 font-medium backdrop-blur-sm">
                {r.mediaType === 'movie' ? (
                  <Film className="w-2.5 h-2.5" />
                ) : (
                  <Tv className="w-2.5 h-2.5" />
                )}
                {r.mediaType === 'movie' ? 'Movie' : 'TV'}
              </span>
            </div>
            {/* Rating */}
            {r.voteAverage > 0 && (
              <div className="absolute top-2 right-2 z-10">
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/70 text-[10px] text-amber-400 font-medium backdrop-blur-sm">
                  <Star className="w-2.5 h-2.5 fill-amber-400" />
                  {r.voteAverage.toFixed(1)}
                </span>
              </div>
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 z-10">
              <span className="text-xs text-cyan-400 font-medium">View details →</span>
            </div>
          </div>
          {/* Title */}
          <p className="mt-2 truncate text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
            {r.title}
          </p>
          {r.year && <p className="text-xs text-gray-500 mt-0.5">{r.year}</p>}
        </Link>
      ))}
    </div>
  )
}
