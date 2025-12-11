import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Ratio } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Aspect Ratio Guide - Image & Video Dimensions | AI AutoSite',
  description: 'Learn about aspect ratios for images and videos. Common ratios for social media platforms.',
  keywords: 'aspect ratio guide, image dimensions, video size, instagram ratio',
}

export default function AspectRatioCalculatorGuidePage() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/blog" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 group">
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />Back to Blog
      </Link>
      <header className="mb-12">
        <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm">Converters</span>
        <h1 className="text-4xl font-bold text-white my-6">Aspect Ratio Complete Guide</h1>
        <p className="text-xl text-gray-300">Understand aspect ratios for images and videos across all platforms.</p>
      </header>
      <section className="space-y-8">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">Common Aspect Ratios</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[{r:'16:9',u:'YouTube, TV'},{r:'9:16',u:'Stories, Shorts'},{r:'1:1',u:'Instagram Posts'},{r:'4:5',u:'Instagram Portrait'}].map(({r,u})=>(
              <div key={r} className="p-3 bg-gray-800/50 rounded-lg text-center"><div className="text-pink-400 font-mono text-lg">{r}</div><div className="text-gray-500 text-xs mt-1">{u}</div></div>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-xl p-8 text-center">
          <Ratio className="w-12 h-12 text-pink-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Try Our Calculator</h2>
          <Link href="/tools/aspect-ratio-calculator" className="inline-flex px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl">Open Calculator</Link>
        </div>
      </section>
    </article>
  )
}
