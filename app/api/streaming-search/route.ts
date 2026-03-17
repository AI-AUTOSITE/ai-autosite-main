// app/api/streaming-search/route.ts
import { NextRequest, NextResponse } from 'next/server'

// ==========================================
// Rate Limiting
// ==========================================
const rateLimiter = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = {
  maxRequests: 30,
  windowMs: 60 * 1000,
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimiter.get(ip)

  if (!entry || now > entry.resetTime) {
    rateLimiter.set(ip, { count: 1, resetTime: now + RATE_LIMIT.windowMs })
    return true
  }

  if (entry.count >= RATE_LIMIT.maxRequests) {
    return false
  }

  entry.count++
  return true
}

// ==========================================
// TMDB API Helper
// ==========================================
const TMDB_BASE = 'https://api.themoviedb.org/3'

async function tmdbFetch(path: string, params: Record<string, string> = {}) {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    throw new Error('TMDB_API_KEY not configured')
  }

  const url = new URL(`${TMDB_BASE}${path}`)
  url.searchParams.set('api_key', apiKey)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status}`)
  }

  return res.json()
}

// ==========================================
// GET Handler
// ==========================================
export async function GET(request: NextRequest) {
  // Rate limit check
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429 }
    )
  }

  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    // ---- Search ----
    if (action === 'search') {
      const query = searchParams.get('q')?.trim()
      if (!query || query.length < 1) {
        return NextResponse.json({ error: 'Query required' }, { status: 400 })
      }

      const data = await tmdbFetch('/search/multi', {
        query,
        include_adult: 'false',
        language: 'en-US',
        page: '1',
      })

      // Filter to movies and TV only, exclude adult
      const results = (data.results || [])
        .filter(
          (r: any) =>
            (r.media_type === 'movie' || r.media_type === 'tv') &&
            r.adult !== true
        )
        .slice(0, 20)
        .map((r: any) => ({
          id: r.id,
          title: r.title || r.name,
          originalTitle: r.original_title || r.original_name,
          mediaType: r.media_type,
          year: (r.release_date || r.first_air_date || '').substring(0, 4),
          posterPath: r.poster_path,
          backdropPath: r.backdrop_path,
          overview: r.overview,
          voteAverage: r.vote_average,
          genreIds: r.genre_ids,
        }))

      return NextResponse.json({ results })
    }

    // ---- Watch Providers ----
    if (action === 'providers') {
      const id = searchParams.get('id')
      const type = searchParams.get('type') // movie or tv
      const region = searchParams.get('region') || 'US'

      if (!id || !type) {
        return NextResponse.json({ error: 'id and type required' }, { status: 400 })
      }

      const data = await tmdbFetch(`/${type}/${id}/watch/providers`)
      const regionData = data.results?.[region] || {}

      // Also fetch details for runtime/genres
      const details = await tmdbFetch(`/${type}/${id}`, {
        language: 'en-US',
        append_to_response: 'credits',
      })

      return NextResponse.json({
        providers: {
          flatrate: regionData.flatrate || [],
          rent: regionData.rent || [],
          buy: regionData.buy || [],
          ads: regionData.ads || [],
          free: regionData.free || [],
          link: regionData.link || null,
        },
        details: {
          runtime: details.runtime || details.episode_run_time?.[0] || null,
          genres: details.genres || [],
          tagline: details.tagline || null,
          numberOfSeasons: details.number_of_seasons || null,
          status: details.status || null,
          director:
            details.credits?.crew?.find((c: any) => c.job === 'Director')?.name || null,
          cast: (details.credits?.cast || []).slice(0, 6).map((c: any) => c.name),
        },
      })
    }

    // ---- Trending ----
    if (action === 'trending') {
      const data = await tmdbFetch('/trending/all/week', {
        language: 'en-US',
      })

      const results = (data.results || [])
        .filter((r: any) => r.adult !== true)
        .slice(0, 10)
        .map((r: any) => ({
          id: r.id,
          title: r.title || r.name,
          mediaType: r.media_type,
          year: (r.release_date || r.first_air_date || '').substring(0, 4),
          posterPath: r.poster_path,
          voteAverage: r.vote_average,
        }))

      return NextResponse.json({ results })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err: any) {
    console.error('Streaming search API error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
