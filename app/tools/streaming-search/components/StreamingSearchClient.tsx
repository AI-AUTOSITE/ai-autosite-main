'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Search,
  X,
  Star,
  Clock,
  Film,
  Tv,
  Play,
  ShoppingBag,
  Tag,
  Monitor,
  ChevronLeft,
  TrendingUp,
  ExternalLink,
  Info,
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

interface Provider {
  logo_path: string
  provider_id: number
  provider_name: string
  display_priority: number
}

interface ProvidersData {
  flatrate: Provider[]
  rent: Provider[]
  buy: Provider[]
  ads: Provider[]
  free: Provider[]
  link: string | null
}

interface Details {
  runtime: number | null
  genres: { id: number; name: string }[]
  tagline: string | null
  numberOfSeasons: number | null
  status: string | null
  director: string | null
  cast: string[]
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
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [trending, setTrending] = useState<SearchResult[]>([])
  const [selectedTitle, setSelectedTitle] = useState<SearchResult | null>(null)
  const [providers, setProviders] = useState<ProvidersData | null>(null)
  const [details, setDetails] = useState<Details | null>(null)
  const [region, setRegion] = useState('US')
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingProviders, setIsLoadingProviders] = useState(false)
  const [error, setError] = useState('')
  const [showRegionPicker, setShowRegionPicker] = useState(false)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // ---- Fetch trending on mount ----
  useEffect(() => {
    fetchTrending()
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

  // ---- Debounced search ----
  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value)
      setError('')

      if (debounceRef.current) clearTimeout(debounceRef.current)

      if (!value.trim()) {
        setResults([])
        return
      }

      debounceRef.current = setTimeout(async () => {
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
      }, 350)
    },
    []
  )

  // ---- Load providers for selected title ----
  const selectTitle = async (title: SearchResult) => {
    setSelectedTitle(title)
    setProviders(null)
    setDetails(null)
    setIsLoadingProviders(true)

    try {
      const res = await fetch(
        `/api/streaming-search?action=providers&id=${title.id}&type=${title.mediaType}&region=${region}`
      )
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setProviders(data.providers)
        setDetails(data.details)
      }
    } catch {
      setError('Failed to load streaming info.')
    } finally {
      setIsLoadingProviders(false)
    }
  }

  // ---- Re-fetch providers on region change ----
  useEffect(() => {
    if (selectedTitle) {
      selectTitle(selectedTitle)
    }
  }, [region])

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setSelectedTitle(null)
    setProviders(null)
    setDetails(null)
    setError('')
    searchInputRef.current?.focus()
  }

  const currentRegion = REGIONS.find((r) => r.code === region) || REGIONS[0]

  const hasProviders =
    providers &&
    (providers.flatrate.length > 0 ||
      providers.rent.length > 0 ||
      providers.buy.length > 0 ||
      providers.ads.length > 0 ||
      providers.free.length > 0)

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

      {/* Detail View */}
      {selectedTitle ? (
        <DetailView
          title={selectedTitle}
          providers={providers}
          details={details}
          isLoading={isLoadingProviders}
          region={region}
          onBack={() => {
            setSelectedTitle(null)
            setProviders(null)
            setDetails(null)
          }}
          hasProviders={!!hasProviders}
        />
      ) : (
        <>
          {/* Search Results */}
          {results.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-4">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </h3>
              <ResultsGrid results={results} onSelect={selectTitle} />
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
              <ResultsGrid results={trending} onSelect={selectTitle} />
            </div>
          )}
        </>
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
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
              <img
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                alt="The Movie Database (TMDB)"
                className="h-7"
              />
            </a>
            <span className="text-gray-600 text-lg">+</span>
            <a href="https://www.justwatch.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <span className="text-base font-semibold text-yellow-400">JustWatch</span>
            </a>
          </div>
          <p className="text-sm text-gray-500 max-w-md">
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
  onSelect,
}: {
  results: SearchResult[]
  onSelect: (r: SearchResult) => void
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
      {results.map((r) => (
        <button
          key={`${r.mediaType}-${r.id}`}
          onClick={() => onSelect(r)}
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
              <span className="text-xs text-cyan-400 font-medium">Check availability →</span>
            </div>
          </div>
          {/* Title */}
          <p className="mt-2 truncate text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
            {r.title}
          </p>
          {r.year && <p className="text-xs text-gray-500 mt-0.5">{r.year}</p>}
        </button>
      ))}
    </div>
  )
}

// ==========================================
// Detail View
// ==========================================
function DetailView({
  title,
  providers,
  details,
  isLoading,
  region,
  onBack,
  hasProviders,
}: {
  title: SearchResult
  providers: ProvidersData | null
  details: Details | null
  isLoading: boolean
  region: string
  onBack: () => void
  hasProviders: boolean
}) {
  const regionObj = REGIONS.find((r) => r.code === region)

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to results
      </button>

      {/* Title Card */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-800/40 border border-gray-700/40 mb-8">
        {/* Backdrop */}
        {title.backdropPath && (
          <div className="absolute inset-0">
            <img
              src={`${TMDB_IMG}/w780${title.backdropPath}`}
              alt=""
              className="w-full h-full object-cover opacity-20 blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900/80" />
          </div>
        )}

        <div className="relative flex flex-col sm:flex-row gap-6 p-6">
          {/* Poster */}
          <div className="flex-shrink-0 w-36 sm:w-44 mx-auto sm:mx-0">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-gray-700/40 shadow-2xl">
              {title.posterPath ? (
                <img
                  src={`${TMDB_IMG}/w342${title.posterPath}`}
                  alt={title.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Film className="w-12 h-12 text-gray-600" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-700/60 text-[11px] text-gray-300 font-medium flex-shrink-0">
                {title.mediaType === 'movie' ? (
                  <Film className="w-3 h-3" />
                ) : (
                  <Tv className="w-3 h-3" />
                )}
                {title.mediaType === 'movie' ? 'Movie' : 'TV Series'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">{title.title}</h2>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-400">
              {title.year && <span>{title.year}</span>}
              {details?.runtime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {details.runtime} min
                </span>
              )}
              {title.voteAverage > 0 && (
                <span className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {title.voteAverage.toFixed(1)}
                </span>
              )}
              {details?.numberOfSeasons && (
                <span>{details.numberOfSeasons} Season{details.numberOfSeasons > 1 ? 's' : ''}</span>
              )}
            </div>

            {/* Genres */}
            {details?.genres && details.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {details.genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-2 py-0.5 rounded-full bg-gray-700/50 text-[11px] text-gray-300"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Tagline */}
            {details?.tagline && (
              <p className="text-sm text-gray-400 italic mt-3">&ldquo;{details.tagline}&rdquo;</p>
            )}

            {/* Overview */}
            {title.overview && (
              <p className="text-sm text-gray-400 mt-3 line-clamp-3">{title.overview}</p>
            )}

            {/* Cast */}
            {details?.cast && details.cast.length > 0 && (
              <p className="text-xs text-gray-500 mt-3">
                <span className="text-gray-400">Cast:</span> {details.cast.join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Where to Watch */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Monitor className="w-5 h-5 text-cyan-400" />
            Where to Watch
          </h3>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            {regionObj?.flag} {regionObj?.name}
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Powered by{' '}
          <a href="https://www.justwatch.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 underline underline-offset-2">
            JustWatch
          </a>
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
            <span className="ml-2 text-gray-400 text-sm">Checking availability...</span>
          </div>
        ) : hasProviders ? (
          <div className="space-y-6">
            {/* Subscription */}
            {providers!.flatrate.length > 0 && (
              <ProviderSection
                label="Included with Subscription"
                icon={<Play className="w-4 h-4" />}
                color="cyan"
                providers={providers!.flatrate}
              />
            )}

            {/* Free with Ads */}
            {providers!.ads.length > 0 && (
              <ProviderSection
                label="Free with Ads"
                icon={<Monitor className="w-4 h-4" />}
                color="green"
                providers={providers!.ads}
              />
            )}

            {/* Free */}
            {providers!.free.length > 0 && (
              <ProviderSection
                label="Free"
                icon={<Monitor className="w-4 h-4" />}
                color="green"
                providers={providers!.free}
              />
            )}

            {/* Rent */}
            {providers!.rent.length > 0 && (
              <ProviderSection
                label="Available for Rent"
                icon={<Tag className="w-4 h-4" />}
                color="amber"
                providers={providers!.rent}
              />
            )}

            {/* Buy */}
            {providers!.buy.length > 0 && (
              <ProviderSection
                label="Available to Buy"
                icon={<ShoppingBag className="w-4 h-4" />}
                color="orange"
                providers={providers!.buy}
              />
            )}

            {/* TMDB watch page link */}
            {providers!.link && (
              <div className="pt-2">
                <a
                  href={providers!.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View on TMDB for direct links
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-800/30 rounded-xl border border-gray-700/30">
            <Info className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">
              No streaming information available
            </p>
            <p className="text-gray-500 text-sm mt-1">
              This title may not be available for streaming in {regionObj?.name}.
              Try a different region.
            </p>
          </div>
        )}

        {/* Disclaimer */}
        {hasProviders && (
          <p className="text-[11px] text-gray-600 mt-4 flex items-start gap-1.5">
            <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
            Streaming availability may not reflect the latest changes. Data provided by JustWatch via TMDB.
          </p>
        )}
      </div>
    </div>
  )
}

// ==========================================
// Provider Section
// ==========================================
function ProviderSection({
  label,
  icon,
  color,
  providers,
}: {
  label: string
  icon: React.ReactNode
  color: 'cyan' | 'green' | 'amber' | 'orange'
  providers: Provider[]
}) {
  const colorMap = {
    cyan: {
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      dot: 'bg-cyan-400',
    },
    green: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      dot: 'bg-emerald-400',
    },
    amber: {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      dot: 'bg-amber-400',
    },
    orange: {
      text: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      dot: 'bg-orange-400',
    },
  }

  const c = colorMap[color]

  return (
    <div>
      <div className={`flex items-center gap-2 mb-3 ${c.text} text-sm font-medium`}>
        <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        {icon}
        {label}
      </div>
      <div className="flex flex-wrap gap-3">
        {providers
          .sort((a, b) => a.display_priority - b.display_priority)
          .map((p) => (
            <div
              key={p.provider_id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ${c.bg} border ${c.border} hover:border-opacity-60 transition-colors`}
            >
              {p.logo_path ? (
                <img
                  src={`${TMDB_IMG}/w92${p.logo_path}`}
                  alt={p.provider_name}
                  className="w-9 h-9 rounded-lg object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-gray-700/60 flex items-center justify-center text-gray-500">
                  <Monitor className="w-5 h-5" />
                </div>
              )}
              <span className="text-sm text-gray-200 font-medium">{p.provider_name}</span>
            </div>
          ))}
      </div>
    </div>
  )
}
