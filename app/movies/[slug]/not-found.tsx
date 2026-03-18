import Link from 'next/link'

export default function MovieNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-4">🎬</div>
      <h1 className="text-2xl font-bold text-white mb-2">Title Not Found</h1>
      <p className="text-gray-400 mb-6 max-w-md">
        We couldn&apos;t find this movie or TV show. It may have been removed or the link is incorrect.
      </p>
      <Link
        href="/tools/streaming-search"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-medium rounded-xl transition-colors text-sm"
      >
        Search for a title
      </Link>
    </div>
  )
}
