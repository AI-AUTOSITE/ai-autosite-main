
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Ruler, Globe, Calculator, ChefHat } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Unit Conversion Guide - Metric to Imperial | AI AutoSite',
  description: 'Complete guide to converting units. Metric to imperial, temperature, cooking measurements. Free converter included.',
  keywords: 'unit converter, metric to imperial, measurement conversion, cooking conversions, temperature converter',
  openGraph: {
    title: 'Complete Unit Conversion Guide',
    description: 'Master unit conversions for cooking, travel, and more',
    type: 'article',
  },
}

export default function UnitConverterGuidePage() {
  const publishDate = '2025-01-20'
  const author = 'AI AutoSite Team'
  const readTime = '4 min read'

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        href="/blog" 
        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-8 group"
      >
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
        Back to Blog
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">
            Tools
          </span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Unit Conversion Made Simple
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Your complete guide to converting between metric and imperial units. 
          Perfect for cooking, travel, and everyday life.
        </p>
      </header>

      <section className="space-y-12">
        {/* When You Need Conversions */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">When You Need Unit Conversions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <ChefHat className="w-8 h-8 text-orange-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Cooking & Baking</h3>
              <p className="text-gray-400 text-sm">
                Convert recipes between cups, grams, and ounces
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Globe className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Travel</h3>
              <p className="text-gray-400 text-sm">
                Understand distances, temperatures, and speeds abroad
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Calculator className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Shopping</h3>
              <p className="text-gray-400 text-sm">
                Compare prices and sizes in different units
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Ruler className="w-8 h-8 text-purple-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">DIY & Home</h3>
              <p className="text-gray-400 text-sm">
                Measure furniture and spaces in any unit
              </p>
            </div>
          </div>
        </div>

        {/* Common Conversions */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Most Used Conversions</h2>
          
          <div className="space-y-4">
            {/* Length */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3">Length & Distance</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">1 inch</span>
                  <span className="text-cyan-400">= 2.54 cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">1 foot</span>
                  <span className="text-cyan-400">= 30.48 cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">1 mile</span>
                  <span className="text-cyan-400">= 1.609 km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">1 meter</span>
                  <span className="text-cyan-400">= 3.28 feet</span>
                </div>
              </div>
            </div>

            {/* Weight */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3">Weight & Mass</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">1 pound</span>
                  <span className="text-cyan-400">= 454 grams</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">1 ounce</span>
                  <span className="text-cyan-400">= 28.35 grams</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">1 kilogram</span>
                  <span className="text-cyan-400">= 2.2 pounds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">1 stone</span>
                  <span className="text-cyan-400">= 6.35 kg</span>
                </div>
              </div>
            </div>

            {/* Temperature */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3">Temperature</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">
                  <strong className="text-white">°C to °F:</strong> Multiply by 9/5, then add 32
                </p>
                <p className="text-gray-300">
                  <strong className="text-white">°F to °C:</strong> Subtract 32, then multiply by 5/9
                </p>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">0°C</span>
                    <span className="text-cyan-400">= 32°F</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">100°C</span>
                    <span className="text-cyan-400">= 212°F</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cooking Conversions */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Cooking Conversions</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="text-white font-medium mb-2">Volume</h4>
                <div className="space-y-1 text-gray-400">
                  <div>1 cup = 240 mL</div>
                  <div>1 tablespoon = 15 mL</div>
                  <div>1 teaspoon = 5 mL</div>
                  <div>1 fl oz = 30 mL</div>
                </div>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Common Ingredients</h4>
                <div className="space-y-1 text-gray-400">
                  <div>1 cup flour = 125 g</div>
                  <div>1 cup sugar = 200 g</div>
                  <div>1 cup butter = 227 g</div>
                  <div>1 cup water = 240 g</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Conversion Tips</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  Round to practical numbers - 2.54 cm ≈ 2.5 cm for rough estimates
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  Remember key benchmarks: Room temp is ~20°C or ~70°F
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  For cooking: Weight is more accurate than volume
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  Keep a converter handy - small differences matter in baking
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Convert Units Instantly
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Free unit converter for length, weight, temperature, and volume. No ads, works offline.
        </p>
        <Link 
          href="/tools/unit-converter" 
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Ruler className="mr-2" size={20} />
          Try Unit Converter
        </Link>
      </section>
    </article>
  )
}