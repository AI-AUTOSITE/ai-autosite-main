export function BlogStats({
  totalArticles,
  categories,
  isFree,
}: {
  totalArticles: number
  categories: number
  isFree: boolean
}) {
  return (
    <section className="text-center py-12">
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-2xl font-bold text-cyan-400">{totalArticles}</p>
            <p className="text-xs text-gray-400">Total Articles</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-2xl font-bold text-purple-400">{categories}</p>
            <p className="text-xs text-gray-400">Categories</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-2xl font-bold text-green-400">{isFree ? 'Free' : 'Pro'}</p>
            <p className="text-xs text-gray-400">Forever</p>
          </div>
        </div>
      </div>
    </section>
  )
}
