import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Instagram, Sparkles, Users, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Instagram Bio Generator - Create Perfect Profile Bios | AI AutoSite',
  description: 'Generate creative Instagram bios that get followers. Free bio generator with emoji suggestions and character counter.',
  keywords: 'instagram bio generator, instagram bio ideas, bio creator, profile bio generator, instagram bio examples',
  openGraph: {
    title: 'Instagram Bio Generator - Perfect Profile Guide',
    description: 'Create engaging Instagram bios that attract followers',
    type: 'article',
  },
}

export default function InstagramBioGuidePage() {
  const publishDate = '2025-01-20'
  const author = 'AI AutoSite Team'
  const readTime = '4 min read'

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        href="/blog" 
        className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-8 group"
      >
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
        Back to Blog
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">
            Creative Tools
          </span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Instagram Bio Generator Guide
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Create the perfect Instagram bio that captures your personality 
          and attracts followers. Stand out with creative bio ideas.
        </p>
      </header>

      <section className="space-y-12">
        {/* Bio Anatomy */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Anatomy of a Perfect Bio</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-4">
              <li className="border-b border-white/10 pb-3">
                <h3 className="text-white font-semibold mb-1">Name Field (30 chars)</h3>
                <p className="text-gray-400 text-sm">Searchable - include keywords</p>
              </li>
              <li className="border-b border-white/10 pb-3">
                <h3 className="text-white font-semibold mb-1">Bio Section (150 chars)</h3>
                <p className="text-gray-400 text-sm">Your main description and personality</p>
              </li>
              <li className="border-b border-white/10 pb-3">
                <h3 className="text-white font-semibold mb-1">Link (1 clickable)</h3>
                <p className="text-gray-400 text-sm">Your most important CTA</p>
              </li>
              <li>
                <h3 className="text-white font-semibold mb-1">Category/Profession</h3>
                <p className="text-gray-400 text-sm">Business accounts only</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bio Formulas */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Winning Bio Formulas</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Professional</h3>
              <p className="text-gray-400 text-sm mb-2">
                [Job Title] at [Company]<br/>
                [Achievement/Credential]<br/>
                [Contact/Link] ↓
              </p>
              <p className="text-cyan-400 text-xs">
                Example: Marketing Manager @Nike<br/>
                MBA • 10+ years experience<br/>
                Contact: link.bio/johndoe
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Creative</h3>
              <p className="text-gray-400 text-sm mb-2">
                [Passion/Interest] 🎨<br/>
                [Fun fact or quote]<br/>
                [Location] 📍
              </p>
              <p className="text-purple-400 text-xs">
                Example: Coffee addict ☕<br/>
                "Living my best life"<br/>
                NYC 📍 Shop ↓
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Influencer</h3>
              <p className="text-gray-400 text-sm mb-2">
                [Niche] content creator<br/>
                [Follower milestone]<br/>
                [Email for collabs]
              </p>
              <p className="text-pink-400 text-xs">
                Example: Fashion blogger 👗<br/>
                100K+ community 💕<br/>
                Collabs: email@domain.com
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Business</h3>
              <p className="text-gray-400 text-sm mb-2">
                [What you do]<br/>
                [Value proposition]<br/>
                [CTA + Link]
              </p>
              <p className="text-green-400 text-xs">
                Example: Handmade jewelry ✨<br/>
                Ships worldwide 🌍<br/>
                Shop new collection ↓
              </p>
            </div>
          </div>
        </div>

        {/* Emoji Usage */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Strategic Emoji Usage</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-purple-400">✨</span>
                <p className="text-gray-300">
                  <strong className="text-white">Visual breaks:</strong> Use emojis to separate sections
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">🎯</span>
                <p className="text-gray-300">
                  <strong className="text-white">Replace words:</strong> Save characters (✈️ = travel)
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">💫</span>
                <p className="text-gray-300">
                  <strong className="text-white">Brand personality:</strong> Match emojis to your vibe
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">📍</span>
                <p className="text-gray-300">
                  <strong className="text-white">Draw attention:</strong> Point to your link ↓
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bio Examples by Niche */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Bio Ideas by Niche</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="text-white pb-3">Niche</th>
                  <th className="text-white pb-3">Bio Example</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3 text-purple-400">Fitness</td>
                  <td className="py-3">Personal Trainer 💪 | Transform your body in 90 days | Free workout guide ↓</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-purple-400">Food</td>
                  <td className="py-3">Plant-based recipes 🌱 | Easy 30-min meals | New recipe every Tuesday</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-purple-400">Travel</td>
                  <td className="py-3">50 countries & counting 🌍 | Budget travel tips | Currently: Bali 🏝️</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-purple-400">Art</td>
                  <td className="py-3">Digital artist 🎨 | Commissions open | Portfolio ↓</td>
                </tr>
                <tr>
                  <td className="py-3 text-purple-400">Tech</td>
                  <td className="py-3">Developer 👨‍💻 | JavaScript tips daily | Free coding resources ↓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Growth Tips */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Bio Optimization Tips</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-purple-400">💡</span>
                <p className="text-gray-300">
                  Include searchable keywords in your name field
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">💡</span>
                <p className="text-gray-300">
                  Update bio regularly with current projects/offers
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">💡</span>
                <p className="text-gray-300">
                  Use line breaks for better readability
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">💡</span>
                <p className="text-gray-300">
                  Test different CTAs to see what converts best
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Generate Your Perfect Bio
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Free Instagram bio generator with templates, emojis, and character counter.
        </p>
        <Link 
          href="/tools/instagram-bio" 
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Instagram className="mr-2" size={20} />
          Try Bio Generator
        </Link>
      </section>
    </article>
  )
}