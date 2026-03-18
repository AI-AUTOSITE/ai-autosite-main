import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import MovieDetailClient from './MovieDetailClient'

// ==========================================
// TMDB Server-side fetch
// ==========================================
const TMDB_BASE = 'https://api.themoviedb.org/3'

async function tmdbFetch(path: string, params: Record<string, string> = {}) {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) throw new Error('TMDB_API_KEY not configured')

  const url = new URL(`${TMDB_BASE}${path}`)
  url.searchParams.set('api_key', apiKey)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString(), {
    next: { revalidate: 86400 }, // Cache 24 hours
  })

  if (!res.ok) return null
  return res.json()
}

// Parse slug: "414906-the-batman" → { id: "414906", type: guess }
function parseSlug(slug: string) {
  const match = slug.match(/^(\d+)/)
  if (!match) return null
  return match[1]
}

// Try movie first, then TV
async function fetchTitle(id: string) {
  // Try movie
  const movie = await tmdbFetch(`/movie/${id}`, {
    language: 'en-US',
    append_to_response: 'credits,release_dates,watch/providers',
  })
  if (movie && movie.id && movie.success !== false) {
    const movieJA = await tmdbFetch(`/movie/${id}`, { language: 'ja-JP' })
    return { data: movie, dataJA: movieJA, mediaType: 'movie' as const }
  }

  // Try TV
  const tv = await tmdbFetch(`/tv/${id}`, {
    language: 'en-US',
    append_to_response: 'credits,content_ratings,watch/providers',
  })
  if (tv && tv.id) {
    const tvJA = await tmdbFetch(`/tv/${id}`, { language: 'ja-JP' })
    return { data: tv, dataJA: tvJA, mediaType: 'tv' as const }
  }

  return null
}

// ==========================================
// Dynamic Metadata (SEO)
// ==========================================
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const id = parseSlug(params.slug)
  if (!id) return { title: 'Title Not Found' }

  const result = await fetchTitle(id)
  if (!result) return { title: 'Title Not Found' }

  const { data, mediaType } = result
  const title = data.title || data.name
  const year = (data.release_date || data.first_air_date || '').substring(0, 4)
  const overview = data.overview || ''
  const posterUrl = data.poster_path
    ? `https://image.tmdb.org/t/p/w780${data.poster_path}`
    : null
  const typeLabel = mediaType === 'movie' ? 'Movie' : 'TV Show'

  const pageTitle = `${title}${year ? ` (${year})` : ''} - Where to Watch Streaming | Defrust`
  const description = overview
    ? `Find where to stream ${title}. ${overview.substring(0, 140)}...`
    : `Find where to stream ${title}. Check streaming availability across Netflix, Prime Video, Disney+, and more.`

  return {
    title: pageTitle,
    description,
    keywords: `${title}, where to watch, streaming, ${typeLabel.toLowerCase()}, netflix, prime video, disney plus, hulu, max`,
    openGraph: {
      title: `${title}${year ? ` (${year})` : ''} - Streaming Availability`,
      description,
      type: mediaType === 'movie' ? 'video.movie' : 'video.tv_show',
      images: posterUrl ? [{ url: posterUrl, width: 780, height: 1170 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: posterUrl ? [posterUrl] : [],
    },
    alternates: {
      canonical: `/movies/${params.slug}`,
    },
  }
}

// ==========================================
// Page Component (Server)
// ==========================================
export default async function MoviePage({
  params,
}: {
  params: { slug: string }
}) {
  const id = parseSlug(params.slug)
  if (!id) notFound()

  const result = await fetchTitle(id)
  if (!result) notFound()

  const { data, dataJA, mediaType } = result

  // Extract certification
  let certification = null
  if (mediaType === 'movie' && data.release_dates?.results) {
    const usRelease = data.release_dates.results.find(
      (r: any) => r.iso_3166_1 === 'US'
    )
    if (usRelease?.release_dates) {
      const cert = usRelease.release_dates.find((rd: any) => rd.certification)
      certification = cert?.certification || null
    }
  } else if (mediaType === 'tv' && data.content_ratings?.results) {
    const usRating = data.content_ratings.results.find(
      (r: any) => r.iso_3166_1 === 'US'
    )
    certification = usRating?.rating || null
  }

  // Build props for client
  const titleData = {
    id: data.id,
    title: data.title || data.name,
    originalTitle: data.original_title || data.original_name,
    titleJA: dataJA?.title || dataJA?.name || data.title || data.name,
    mediaType,
    year: (data.release_date || data.first_air_date || '').substring(0, 4),
    posterPath: data.poster_path,
    backdropPath: data.backdrop_path,
    overviewEN: data.overview || '',
    overviewJA: dataJA?.overview || '',
    voteAverage: data.vote_average || 0,
    voteCount: data.vote_count || 0,
    runtime: data.runtime || data.episode_run_time?.[0] || null,
    genres: (data.genres || []).map((g: any) => ({ id: g.id, name: g.name })),
    genresJA: (dataJA?.genres || []).map((g: any) => ({ id: g.id, name: g.name })),
    tagline: data.tagline || null,
    taglineJA: dataJA?.tagline || null,
    numberOfSeasons: data.number_of_seasons || null,
    numberOfEpisodes: data.number_of_episodes || null,
    status: data.status || null,
    certification,
    director:
      data.credits?.crew?.find((c: any) => c.job === 'Director')?.name || null,
    cast: (data.credits?.cast || []).slice(0, 8).map((c: any) => ({
      name: c.name,
      character: c.character,
      profilePath: c.profile_path,
    })),
    providers: (() => {
      const regionData = data['watch/providers']?.results?.US || {}
      return {
        flatrate: regionData.flatrate || [],
        rent: regionData.rent || [],
        buy: regionData.buy || [],
        ads: regionData.ads || [],
        free: regionData.free || [],
        link: regionData.link || null,
      }
    })(),
  }

  // Schema.org structured data
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': mediaType === 'movie' ? 'Movie' : 'TVSeries',
    name: titleData.title,
    ...(titleData.year && { datePublished: titleData.year }),
    description: titleData.overviewEN,
    ...(titleData.posterPath && {
      image: `https://image.tmdb.org/t/p/w780${titleData.posterPath}`,
    }),
    ...(titleData.director && {
      director: { '@type': 'Person', name: titleData.director },
    }),
    ...(titleData.cast.length > 0 && {
      actor: titleData.cast.map((c: any) => ({
        '@type': 'Person',
        name: c.name,
      })),
    }),
    ...(titleData.voteAverage > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: titleData.voteAverage.toFixed(1),
        bestRating: '10',
        ratingCount: titleData.voteCount,
      },
    }),
    genre: titleData.genres.map((g: any) => g.name),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <MovieDetailClient titleData={titleData} />
    </>
  )
}
