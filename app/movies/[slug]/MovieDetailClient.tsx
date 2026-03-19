'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Star,
  Clock,
  Film,
  Tv,
  Play,
  ShoppingBag,
  Tag,
  Monitor,
  ChevronLeft,
  ExternalLink,
  Info,
  Shield,
  Bell,
  Globe,
  Users,
  Calendar,
  Award,
} from 'lucide-react'

// ==========================================
// Types
// ==========================================
interface Provider {
  logo_path: string
  provider_id: number
  provider_name: string
  display_priority: number
}

interface TitleData {
  id: number
  title: string
  originalTitle: string
  titleJA: string
  mediaType: 'movie' | 'tv'
  year: string
  posterPath: string | null
  backdropPath: string | null
  overviewEN: string
  overviewJA: string
  voteAverage: number
  voteCount: number
  runtime: number | null
  genres: { id: number; name: string }[]
  genresJA: { id: number; name: string }[]
  tagline: string | null
  taglineJA: string | null
  numberOfSeasons: number | null
  numberOfEpisodes: number | null
  status: string | null
  certification: string | null
  director: string | null
  cast: { name: string; character: string; profilePath: string | null }[]
  providers: {
    flatrate: Provider[]
    rent: Provider[]
    buy: Provider[]
    ads: Provider[]
    free: Provider[]
    link: string | null
  }
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

const LANGUAGES = [
  { code: 'en', tmdbCode: 'en-US', label: 'EN', name: 'English' },
  { code: 'ja', tmdbCode: 'ja-JP', label: 'JA', name: '日本語' },
  { code: 'de', tmdbCode: 'de-DE', label: 'DE', name: 'Deutsch' },
  { code: 'fr', tmdbCode: 'fr-FR', label: 'FR', name: 'Français' },
  { code: 'es', tmdbCode: 'es-MX', label: 'ES', name: 'Español' },
  { code: 'pt', tmdbCode: 'pt-BR', label: 'PT', name: 'Português' },
  { code: 'hi', tmdbCode: 'hi-IN', label: 'HI', name: 'हिन्दी' },
  { code: 'ko', tmdbCode: 'ko-KR', label: 'KO', name: '한국어' },
  { code: 'zh', tmdbCode: 'zh-CN', label: 'ZH', name: '中文' },
  { code: 'it', tmdbCode: 'it-IT', label: 'IT', name: 'Italiano' },
]

interface TranslationData {
  title: string
  overview: string
  tagline: string
  genres: { id: number; name: string }[]
}

// Map region code to default language
const REGION_TO_LANG: Record<string, string> = {
  US: 'en', GB: 'en', CA: 'en', AU: 'en',
  JP: 'ja', DE: 'de', FR: 'fr', IN: 'hi', BR: 'pt', MX: 'es',
}

// Map language code to default region
const LANG_TO_REGION: Record<string, string> = {
  en: 'US', ja: 'JP', de: 'DE', fr: 'FR', hi: 'IN', pt: 'BR', es: 'MX',
  ko: 'US', zh: 'US', it: 'US',
}

// ==========================================
// Main Component
// ==========================================
export default function MovieDetailClient({
  titleData,
}: {
  titleData: TitleData
}) {
  const searchParams = useSearchParams()
  const initialRegion = searchParams.get('region') || 'US'
  const initialLang = REGION_TO_LANG[initialRegion] || 'en'

  const [lang, setLang] = useState(initialLang)
  const [region, setRegion] = useState(initialRegion)
  const [providers, setProviders] = useState(titleData.providers)
  const [showRegionPicker, setShowRegionPicker] = useState(false)
  const [showLangPicker, setShowLangPicker] = useState(false)
  const [isLoadingProviders, setIsLoadingProviders] = useState(false)
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false)
  const [translations, setTranslations] = useState<Record<string, TranslationData>>({
    en: {
      title: titleData.title,
      overview: titleData.overviewEN,
      tagline: titleData.tagline || '',
      genres: titleData.genres,
    },
    ja: {
      title: titleData.titleJA,
      overview: titleData.overviewJA,
      tagline: titleData.taglineJA || '',
      genres: titleData.genresJA,
    },
  })
  const router = useRouter()

  // Auto-fetch translation + providers if region from URL is not US
  useEffect(() => {
    if (initialRegion !== 'US') {
      fetchProviders(initialRegion)
    }
    if (initialLang !== 'en' && initialLang !== 'ja') {
      switchLanguage(initialLang, true) // skip region sync on init
    }
  }, [])

  const currentRegion = REGIONS.find((r) => r.code === region) || REGIONS[0]
  const currentLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0]

  // Get translated content (fallback to EN)
  const t = translations[lang] || translations['en']
  const displayTitle = t.title || titleData.title
  const overview = t.overview || titleData.overviewEN
  const tagline = t.tagline || titleData.tagline
  const genres = t.genres?.length ? t.genres : titleData.genres

  // Fetch translation for a new language + sync region
  const switchLanguage = async (langCode: string, skipRegionSync = false) => {
    setLang(langCode)

    // Sync region when language changes
    if (!skipRegionSync) {
      const mappedRegion = LANG_TO_REGION[langCode]
      if (mappedRegion && mappedRegion !== region) {
        fetchProviders(mappedRegion)
      }
    }

    // Already cached
    if (translations[langCode]) return

    const langDef = LANGUAGES.find((l) => l.code === langCode)
    if (!langDef) return

    setIsLoadingTranslation(true)
    try {
      const res = await fetch(
        `/api/streaming-search?action=translate&id=${titleData.id}&type=${titleData.mediaType}&lang=${langDef.tmdbCode}`
      )
      const data = await res.json()
      setTranslations((prev) => ({
        ...prev,
        [langCode]: {
          title: data.title || '',
          overview: data.overview || '',
          tagline: data.tagline || '',
          genres: data.genres || [],
        },
      }))
    } catch {
      // Fallback to EN on error
    } finally {
      setIsLoadingTranslation(false)
    }
  }

  const hasFlatrate = providers.flatrate.length > 0 || providers.ads.length > 0 || providers.free.length > 0
  const hasAnyProvider =
    providers.flatrate.length > 0 ||
    providers.rent.length > 0 ||
    providers.buy.length > 0 ||
    providers.ads.length > 0 ||
    providers.free.length > 0

  // Fetch providers for a region (without triggering language sync)
  const fetchProviders = async (newRegion: string) => {
    setRegion(newRegion)
    setIsLoadingProviders(true)
    try {
      const res = await fetch(
        `/api/streaming-search?action=providers&id=${titleData.id}&type=${titleData.mediaType}&region=${newRegion}`
      )
      const data = await res.json()
      if (data.providers) {
        setProviders(data.providers)
      }
    } catch {
      // Keep current providers on error
    } finally {
      setIsLoadingProviders(false)
    }
  }

  // Region change → refetch providers + sync language
  const changeRegion = async (newRegion: string) => {
    setShowRegionPicker(false)
    fetchProviders(newRegion)

    // Sync language when region changes
    const mappedLang = REGION_TO_LANG[newRegion] || 'en'
    if (mappedLang !== lang) {
      switchLanguage(mappedLang, true) // skipRegionSync to avoid loop
    }
  }

  // Score ring percentage
  const scorePercent = Math.round((titleData.voteAverage / 10) * 100)

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero section with backdrop */}
      <div className="relative">
        {/* Backdrop image */}
        {titleData.backdropPath && (
          <div className="absolute inset-0 h-[400px] sm:h-[480px]">
            <img
              src={`${TMDB_IMG}/w1280${titleData.backdropPath}`}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-950/80 to-gray-950" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/50 to-gray-950/90" />
          </div>
        )}

        <div className="relative max-w-5xl mx-auto px-4 pt-6 pb-8">
          {/* Back link — uses browser back to preserve search results */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-8 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>

          {/* Title card */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            {/* Poster */}
            <div className="flex-shrink-0 w-48 sm:w-56 mx-auto sm:mx-0">
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-gray-800/60 shadow-2xl shadow-black/40 ring-1 ring-white/10">
                {titleData.posterPath ? (
                  <img
                    src={`${TMDB_IMG}/w500${titleData.posterPath}`}
                    alt={titleData.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Film className="w-16 h-16 text-gray-600" />
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pt-2">
              {/* Type badge */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-800/70 text-xs text-gray-300 font-medium backdrop-blur-sm ring-1 ring-white/10">
                {titleData.mediaType === 'movie' ? (
                  <Film className="w-3.5 h-3.5" />
                ) : (
                  <Tv className="w-3.5 h-3.5" />
                )}
                {titleData.mediaType === 'movie' ? 'Movie' : 'TV Series'}
              </span>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-3 leading-tight">
                {displayTitle}
              </h1>
              {lang !== 'en' && titleData.title !== displayTitle && (
                <p className="text-sm text-gray-400 mt-1">{titleData.title}</p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-sm text-gray-400">
                {titleData.year && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {titleData.year}
                  </span>
                )}
                {titleData.certification && (
                  <span className="px-1.5 py-0.5 rounded border border-gray-600 text-xs font-medium text-gray-300">
                    {titleData.certification}
                  </span>
                )}
                {titleData.runtime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {Math.floor(titleData.runtime / 60)}h {titleData.runtime % 60}m
                  </span>
                )}
                {titleData.numberOfSeasons && (
                  <span>
                    {titleData.numberOfSeasons} Season{titleData.numberOfSeasons > 1 ? 's' : ''}
                    {titleData.numberOfEpisodes && ` · ${titleData.numberOfEpisodes} Episodes`}
                  </span>
                )}
              </div>

              {/* Genres */}
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {genres.map((g) => (
                    <span
                      key={g.id}
                      className="px-2.5 py-1 rounded-full bg-gray-800/60 text-xs text-gray-300 ring-1 ring-white/5"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Score + Votes */}
              {titleData.voteAverage > 0 && (
                <div className="flex items-center gap-4 mt-5">
                  {/* Circular score ring */}
                  <div className="relative w-14 h-14">
                    <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
                      <circle
                        cx="20" cy="20" r="17"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="text-gray-800"
                      />
                      <circle
                        cx="20" cy="20" r="17"
                        fill="none"
                        stroke={scorePercent >= 70 ? '#22c55e' : scorePercent >= 50 ? '#eab308' : '#ef4444'}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray={`${scorePercent * 1.068} 106.8`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {titleData.voteAverage.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">TMDB Score</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {titleData.voteCount.toLocaleString()} votes
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content below hero */}
      <div className="max-w-5xl mx-auto px-4 pb-16">

        {/* Synopsis */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">
              Synopsis
            </h2>
            {/* Language picker (globe + dropdown) */}
            <div className="relative">
              <button
                onClick={() => setShowLangPicker(!showLangPicker)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg text-sm text-gray-300 transition-colors ring-1 ring-white/5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{currentLang.label}</span>
                <span className="hidden sm:inline text-xs">{currentLang.name}</span>
              </button>
              {showLangPicker && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowLangPicker(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 z-50 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl py-2 w-48 max-h-64 overflow-y-auto">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          switchLanguage(l.code)
                          setShowLangPicker(false)
                        }}
                        className={`w-full px-4 py-2 text-left flex items-center justify-between hover:bg-gray-700/60 transition-colors text-sm ${
                          lang === l.code
                            ? 'text-cyan-400 bg-cyan-500/10'
                            : 'text-gray-300'
                        }`}
                      >
                        <span>{l.name}</span>
                        <span className="text-xs text-gray-500">{l.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {tagline && (
            <p className="text-sm text-cyan-400 italic mb-2">&ldquo;{tagline}&rdquo;</p>
          )}

          {isLoadingTranslation ? (
            <div className="flex items-center gap-2 py-4">
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-400">Loading translation...</span>
            </div>
          ) : overview ? (
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{overview}</p>
          ) : (
            <p className="text-sm text-gray-500">
              No synopsis available in {currentLang.name}.
            </p>
          )}
        </section>

        {/* Cast */}
        {titleData.cast.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-white mb-3">Cast</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {titleData.cast.map((c, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-20 text-center"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-gray-800 overflow-hidden ring-1 ring-white/10">
                    {c.profilePath ? (
                      <img
                        src={`${TMDB_IMG}/w185${c.profilePath}`}
                        alt={c.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-lg">
                        {c.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-200 font-medium mt-1.5 truncate">{c.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{c.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Director */}
        {titleData.director && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
            <Award className="w-4 h-4 text-gray-500" />
            <span>Director:</span>
            <span className="text-gray-200 font-medium">{titleData.director}</span>
          </div>
        )}

        {/* Where to Watch */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Monitor className="w-5 h-5 text-cyan-400" />
              Where to Watch
            </h2>

            {/* Region picker */}
            <div className="relative">
              <button
                onClick={() => setShowRegionPicker(!showRegionPicker)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg text-sm text-gray-300 transition-colors ring-1 ring-white/5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{currentRegion.flag}</span>
                <span className="hidden sm:inline text-xs">{currentRegion.name}</span>
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
                        onClick={() => changeRegion(r.code)}
                        className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-700/60 transition-colors text-sm ${
                          r.code === region
                            ? 'text-cyan-400 bg-cyan-500/10'
                            : 'text-gray-300'
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

          <p className="text-xs text-gray-500 mb-5">
            Powered by{' '}
            <a
              href="https://www.justwatch.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyan-400 underline underline-offset-2"
            >
              JustWatch
            </a>
          </p>

          {isLoadingProviders ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span className="ml-3 text-gray-400 text-sm">Checking availability...</span>
            </div>
          ) : hasAnyProvider ? (
            <div className="space-y-6">
              {providers.flatrate.length > 0 && (
                <ProviderSection
                  label='Included with Subscription'
                  icon={<Play className="w-4 h-4" />}
                  color="cyan"
                  providers={providers.flatrate}
                />
              )}
              {providers.ads.length > 0 && (
                <ProviderSection
                  label='Free with Ads'
                  icon={<Monitor className="w-4 h-4" />}
                  color="green"
                  providers={providers.ads}
                />
              )}
              {providers.free.length > 0 && (
                <ProviderSection
                  label='Free'
                  icon={<Monitor className="w-4 h-4" />}
                  color="green"
                  providers={providers.free}
                />
              )}
              {providers.rent.length > 0 && (
                <ProviderSection
                  label='Available for Rent'
                  icon={<Tag className="w-4 h-4" />}
                  color="amber"
                  providers={providers.rent}
                />
              )}
              {providers.buy.length > 0 && (
                <ProviderSection
                  label='Available to Buy'
                  icon={<ShoppingBag className="w-4 h-4" />}
                  color="orange"
                  providers={providers.buy}
                />
              )}
              {providers.link && (
                <div className="pt-2">
                  <a
                    href={providers.link}
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
                This title may not be available in {currentRegion.name}. Try a different region.
              </p>
            </div>
          )}

          {/* Disclaimer */}
          {hasAnyProvider && (
            <p className="text-[11px] text-gray-600 mt-4 flex items-start gap-1.5">
              <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
              Streaming availability may not reflect the latest changes. Data provided by JustWatch via TMDB.
            </p>
          )}
        </section>

        {/* Conditional Unrent CTA — when no flatrate available (rent-only OR no providers) */}
        {!hasFlatrate && !isLoadingProviders && (
          <section className="mt-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 p-6 sm:p-8 text-center">
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-medium mb-4">
                  <Bell className="w-3.5 h-3.5" />
                  {hasAnyProvider
                    ? 'Never miss when it becomes free'
                    : 'Get notified when it starts streaming'}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  {hasAnyProvider
                    ? 'Rent-only? Get notified when it\u2019s included free'
                    : 'Not streaming yet? We\u2019ll let you know'}
                </h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto mb-5">
                  {hasAnyProvider
                    ? 'Unrent alerts you the moment this title joins your streaming subscriptions \u2014 so you never pay to rent what\u2019s about to be free.'
                    : 'Unrent monitors streaming services and sends you a push notification the moment this title becomes available.'}
                </p>
                <div
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700/60 text-gray-300 font-semibold rounded-xl text-sm ring-1 ring-white/10"
                >
                  <Play className="w-4 h-4" />
                  Coming Soon on the App Store
                </div>
                <p className="text-[11px] text-gray-600 mt-3">
                  iOS · No data collection · Free
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Attribution Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-800/60 space-y-6">
          {/* TMDB + JustWatch Attribution */}
          <div className="max-w-2xl mx-auto px-6 py-5 bg-gray-800/40 border border-gray-700/30 rounded-xl">
            <div className="flex flex-wrap items-center justify-center gap-6 mb-3">
              <a
                href="https://www.themoviedb.org"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-80 hover:opacity-100 transition-opacity"
              >
                <img
                  src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                  alt="The Movie Database (TMDB)"
                  className="h-14"
                />
              </a>
              <span className="text-gray-600 text-3xl font-light">+</span>
              <a
                href="https://www.justwatch.com"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-80 hover:opacity-100 transition-opacity"
              >
                <span className="text-2xl font-bold text-yellow-400">JustWatch</span>
              </a>
            </div>
            <p className="text-base text-gray-400 text-center leading-relaxed">
              Streaming availability data powered by JustWatch.
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </div>

          {/* Privacy */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
            <Shield className="w-3.5 h-3.5" />
            <span>No personal data collected · No cookies · No tracking</span>
          </div>

          {/* Back to streaming search */}
          <div className="text-center pt-2">
            <Link
              href="/tools/streaming-search"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-cyan-400 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Back to Streaming Search
            </Link>
          </div>
        </footer>
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ${c.bg} border ${c.border} transition-colors`}
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
