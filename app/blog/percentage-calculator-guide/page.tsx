import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Percent, Calculator, TrendingUp, PieChart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Percentage Calculator - Quick % Calculations Made Simple | AI AutoSite',
  description:
    'Calculate percentages instantly. Find percentage increase, decrease, discount rates, and more. Free online percentage calculator.',
  keywords:
    'percentage calculator, percent calculator, discount calculator, percentage increase, percentage decrease, tip calculator',
  openGraph: {
    title: 'Percentage Calculator - Complete Guide',
    description: 'Master percentage calculations for discounts, tips, and more',
    type: 'article',
  },
}

export default function PercentageCalculatorGuidePage() {
  const publishDate = '2025-01-20'
  const author = 'AI AutoSite Team'
  const readTime = '3 min read'

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
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">Quick Tools</span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Percentage Calculator Guide
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Master percentage calculations for shopping discounts, restaurant tips, grade
          calculations, and business metrics.
        </p>
      </header>

      <section className="space-y-12">
        {/* Common Calculations */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Common Percentage Calculations</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">What is X% of Y?</h3>
              <p className="text-gray-400 text-sm mb-2">Example: What is 15% of 80?</p>
              <code className="text-cyan-400">80 × 0.15 = 12</code>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">X is what % of Y?</h3>
              <p className="text-gray-400 text-sm mb-2">Example: 20 is what % of 80?</p>
              <code className="text-cyan-400">(20 ÷ 80) × 100 = 25%</code>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">% Increase/Decrease</h3>
              <p className="text-gray-400 text-sm mb-2">From 50 to 75:</p>
              <code className="text-cyan-400">((75-50) ÷ 50) × 100 = 50%</code>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Discount Price</h3>
              <p className="text-gray-400 text-sm mb-2">$100 with 30% off:</p>
              <code className="text-cyan-400">100 - (100 × 0.30) = $70</code>
            </div>
          </div>
        </div>

        {/* Real-World Uses */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Real-World Applications</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="text-white pb-3">Scenario</th>
                  <th className="text-white pb-3">Common %</th>
                  <th className="text-white pb-3">Example</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3">Restaurant Tips</td>
                  <td className="py-3 text-cyan-400">15-20%</td>
                  <td className="py-3">$50 bill → $7.50-$10 tip</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Sales Tax</td>
                  <td className="py-3 text-cyan-400">5-10%</td>
                  <td className="py-3">$100 item → $105-$110 total</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Store Discounts</td>
                  <td className="py-3 text-cyan-400">10-50%</td>
                  <td className="py-3">$80 with 25% off → $60</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Interest Rates</td>
                  <td className="py-3 text-cyan-400">2-7%</td>
                  <td className="py-3">$1000 at 5% → $50/year</td>
                </tr>
                <tr>
                  <td className="py-3">Grade Weights</td>
                  <td className="py-3 text-cyan-400">10-40%</td>
                  <td className="py-3">Final exam worth 30%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Tips */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Mental Math Tricks</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  <strong className="text-white">10%:</strong> Move decimal one place left (50 → 5)
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  <strong className="text-white">5%:</strong> Half of 10% (10% of 80 = 8, so 5% = 4)
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  <strong className="text-white">15%:</strong> Add 10% + 5% together
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💡</span>
                <p className="text-gray-300">
                  <strong className="text-white">20%:</strong> Double 10% or divide by 5
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">Calculate Percentages Instantly</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Free percentage calculator for discounts, tips, grades, and more.
        </p>
        <Link
          href="/tools/percentage-calculator"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Percent className="mr-2" size={20} />
          Try Percentage Calculator
        </Link>
      </section>
    </article>
  )
}
