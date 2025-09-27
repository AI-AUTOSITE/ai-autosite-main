import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Heart, Calculator, Activity, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'BMI Calculator - Check Body Mass Index & Health Status | AI AutoSite',
  description: 'Calculate your BMI (Body Mass Index) instantly. Understand your weight category and health risks. Free BMI calculator with health tips.',
  keywords: 'bmi calculator, body mass index, weight calculator, health calculator, obesity calculator, ideal weight',
  openGraph: {
    title: 'BMI Calculator - Body Mass Index Guide',
    description: 'Calculate BMI and understand your health status',
    type: 'article',
  },
}

export default function BmiCalculatorGuidePage() {
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
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">
            Quick Tools
          </span>
          <span>•</span>
          <time>{publishDate}</time>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          BMI Calculator Complete Guide
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Calculate your Body Mass Index and understand what it means for your health. 
          Get personalized recommendations based on your results.
        </p>
      </header>

      <section className="space-y-12">
        {/* What is BMI */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">What is BMI?</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-300 mb-4">
              BMI (Body Mass Index) is a measure of body fat based on height and weight. 
              It's calculated by dividing weight in kilograms by height in meters squared.
            </p>
            <div className="bg-white/10 rounded-lg p-4 font-mono text-cyan-400">
              BMI = weight (kg) / height² (m²)
            </div>
          </div>
        </div>

        {/* BMI Categories */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">BMI Categories</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/10">
                  <th className="text-white pb-3">BMI Range</th>
                  <th className="text-white pb-3">Category</th>
                  <th className="text-white pb-3">Health Risk</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3 text-blue-400">Below 18.5</td>
                  <td className="py-3">Underweight</td>
                  <td className="py-3 text-yellow-400">Malnutrition risk</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-green-400">18.5 - 24.9</td>
                  <td className="py-3">Normal weight</td>
                  <td className="py-3 text-green-400">Low risk</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-yellow-400">25.0 - 29.9</td>
                  <td className="py-3">Overweight</td>
                  <td className="py-3 text-yellow-400">Increased risk</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-orange-400">30.0 - 34.9</td>
                  <td className="py-3">Obesity Class I</td>
                  <td className="py-3 text-orange-400">Moderate risk</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-red-400">35.0 - 39.9</td>
                  <td className="py-3">Obesity Class II</td>
                  <td className="py-3 text-red-400">Severe risk</td>
                </tr>
                <tr>
                  <td className="py-3 text-red-600">40.0 and above</td>
                  <td className="py-3">Obesity Class III</td>
                  <td className="py-3 text-red-600">Very severe risk</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Why BMI Matters */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Why BMI Matters</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Heart className="w-8 h-8 text-red-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Heart Health</h3>
              <p className="text-gray-400 text-sm">
                Screen for cardiovascular risks
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <Activity className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Fitness Goals</h3>
              <p className="text-gray-400 text-sm">
                Track weight management progress
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <TrendingUp className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-white font-semibold mb-2">Health Screening</h3>
              <p className="text-gray-400 text-sm">
                Identify potential health issues
              </p>
            </div>
          </div>
        </div>

        {/* BMI Limitations */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">BMI Limitations</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-300 mb-4">
              While BMI is useful, it doesn't account for:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>• <strong className="text-white">Muscle mass:</strong> Athletes may have high BMI but low body fat</li>
              <li>• <strong className="text-white">Bone density:</strong> Varies between individuals</li>
              <li>• <strong className="text-white">Body composition:</strong> Fat vs muscle distribution</li>
              <li>• <strong className="text-white">Age and gender:</strong> Different standards apply</li>
              <li>• <strong className="text-white">Ethnicity:</strong> Risk levels vary by background</li>
            </ul>
          </div>
        </div>

        {/* Health Tips */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Healthy Weight Tips</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💪</span>
                <p className="text-gray-300">
                  Exercise regularly - at least 150 minutes per week
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">🥗</span>
                <p className="text-gray-300">
                  Eat a balanced diet with fruits and vegetables
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">💧</span>
                <p className="text-gray-300">
                  Stay hydrated - drink 8 glasses of water daily
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">😴</span>
                <p className="text-gray-300">
                  Get enough sleep - 7-9 hours per night
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">⚕️</span>
                <p className="text-gray-300">
                  Consult healthcare providers for personalized advice
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-white/10 mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Calculate Your BMI Now
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Free BMI calculator with instant results and health recommendations.
        </p>
        <Link 
          href="/tools/bmi-calculator" 
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Calculator className="mr-2" size={20} />
          Try BMI Calculator
        </Link>
      </section>
    </article>
  )
}