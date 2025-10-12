'use client'

import { useState } from 'react'
import { Code, Database, Cloud, Zap, Globe, Gauge } from 'lucide-react'

// Tech data structure
interface TechData {
  id: string
  name: string
  category: string
  icon: React.ReactNode
  features: string[]
  useCases: string[]
  learningCurve: 'Beginner' | 'Intermediate' | 'Advanced'
  learningNote: string
  pros: string
  cons: string
}

// All technologies data
const techData: TechData[] = [
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'Framework',
    icon: <Code className="w-5 h-5" />,
    features: [
      'Full-stack React framework',
      'Built-in SSR/SSG',
      'File-based routing',
      'API Routes',
      'Image optimization',
      'Edge runtime',
    ],
    useCases: [
      'SEO-critical websites',
      'E-commerce sites',
      'Corporate websites',
      'Full-stack applications',
      'Content-heavy sites',
      'Blogs with features',
    ],
    learningCurve: 'Intermediate',
    learningNote: 'React + framework concepts',
    pros: 'Best SEO, zero config, rich ecosystem',
    cons: 'Steeper learning curve, heavier builds',
  },
  {
    id: 'astro',
    name: 'Astro',
    category: 'Framework',
    icon: <Code className="w-5 h-5" />,
    features: [
      'Static-site focused',
      'Multi-framework support',
      'Minimal JavaScript',
      'Component Islands',
      'Markdown support',
      'Content collections',
    ],
    useCases: [
      'Documentation sites',
      'Blogs & content',
      'Landing pages',
      'Portfolio websites',
      'Marketing sites',
      'Fast static sites',
    ],
    learningCurve: 'Intermediate',
    learningNote: 'Unique syntax & concepts',
    pros: 'Fastest performance, great SEO, lightweight',
    cons: 'Limited interactivity, smaller ecosystem',
  },
  {
    id: 'sveltekit',
    name: 'SvelteKit',
    category: 'Framework',
    icon: <Code className="w-5 h-5" />,
    features: [
      'Compile-time optimization',
      'No Virtual DOM',
      'Intuitive syntax',
      'Small bundle sizes',
      'Built-in reactivity',
      'TypeScript support',
    ],
    useCases: [
      'High-performance apps',
      'Mobile applications',
      'Interactive dashboards',
      'Real-time applications',
      'Animation-heavy sites',
      'Lightweight SPAs',
    ],
    learningCurve: 'Intermediate',
    learningNote: 'New concepts to learn',
    pros: 'Fast runtime, small bundles, great DX',
    cons: 'Smaller adoption, fewer resources',
  },
  {
    id: 'vite',
    name: 'Vite',
    category: 'Build Tool',
    icon: <Zap className="w-5 h-5" />,
    features: [
      'Lightning-fast dev',
      'ES Modules native',
      'Instant HMR',
      'Framework agnostic',
      'Plugin ecosystem',
      'Production optimized',
    ],
    useCases: [
      'SPAs & admin panels',
      'Rapid prototyping',
      'Library development',
      'Learning projects',
      'Developer tooling',
      'Multi-page apps',
    ],
    learningCurve: 'Beginner',
    learningNote: 'Minimal configuration',
    pros: 'Best dev experience, fast, simple setup',
    cons: 'Weak SEO without SSR setup',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'Styling',
    icon: <Globe className="w-5 h-5" />,
    features: [
      'Utility-first CSS',
      'Highly customizable',
      'Component-friendly',
      'Design system',
      'JIT compilation',
      'Plugin ecosystem',
    ],
    useCases: [
      'Rapid UI development',
      'Design consistency',
      'Component libraries',
      'Responsive design',
      'Team collaboration',
      'Prototyping',
    ],
    learningCurve: 'Beginner',
    learningNote: 'Learn utility classes',
    pros: 'Fast development, consistent design, great DX',
    cons: 'Large HTML classes, learning curve',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'Database',
    icon: <Database className="w-5 h-5" />,
    features: [
      'PostgreSQL + APIs',
      'Real-time subscriptions',
      'Built-in auth',
      'File storage',
      'Edge functions',
      'Firebase alternative',
    ],
    useCases: [
      'Chat applications',
      'Real-time dashboards',
      'User auth systems',
      'CRUD applications',
      'Collaborative tools',
      'MVP development',
    ],
    learningCurve: 'Beginner',
    learningNote: 'If familiar with SQL',
    pros: 'Easy setup, full-featured, generous free tier',
    cons: 'PostgreSQL-only, vendor lock-in',
  },
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'Hosting',
    icon: <Cloud className="w-5 h-5" />,
    features: [
      'Zero-config deploy',
      'Edge functions',
      'Preview deployments',
      'Analytics included',
      'Next.js optimized',
      'Custom domains',
    ],
    useCases: [
      'Next.js applications',
      'Frontend projects',
      'Team collaboration',
      'Preview environments',
      'Jamstack sites',
      'Rapid deployment',
    ],
    learningCurve: 'Beginner',
    learningNote: 'Git integration',
    pros: 'Easy deployment, great performance, excellent DX',
    cons: 'Can get expensive, vendor lock-in',
  },
]

const TechStackComparison = () => {
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'compare'>('grid')

  const toggleTechSelection = (techId: string) => {
    setSelectedTechs((prev) => {
      if (prev.includes(techId)) {
        return prev.filter((id) => id !== techId)
      }
      if (prev.length >= 3) {
        // Replace oldest selection
        return [...prev.slice(1), techId]
      }
      return [...prev, techId]
    })
  }

  const selectedTechData = techData.filter((tech) => selectedTechs.includes(tech.id))

  // Get category colors
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'Framework':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'Build Tool':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'Styling':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'Database':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      case 'Hosting':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Controls */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-medium text-white">Compare Tech</h2>
            <p className="text-sm text-gray-400 mt-1">Select up to 3</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex-1 sm:flex-none min-h-[48px] px-4 sm:px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('compare')}
              className={`flex-1 sm:flex-none min-h-[48px] px-4 sm:px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'compare'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
              disabled={selectedTechs.length === 0}
            >
              Compare ({selectedTechs.length})
            </button>
          </div>
        </div>

        {selectedTechs.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedTechs.map((techId) => {
              const tech = techData.find((t) => t.id === techId)
              return (
                <span
                  key={techId}
                  className="px-3 py-1.5 bg-cyan-600/20 text-cyan-300 rounded-full text-sm flex items-center gap-2"
                >
                  {tech?.name}
                  <button
                    onClick={() => toggleTechSelection(techId)}
                    className="text-cyan-300 hover:text-white min-w-[24px] min-h-[24px] flex items-center justify-center"
                    aria-label="Remove"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              )
            })}
          </div>
        )}
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {techData.map((tech) => (
            <div
              key={tech.id}
              onClick={() => toggleTechSelection(tech.id)}
              className={`bg-white/5 backdrop-blur-xl rounded-xl p-5 border cursor-pointer transition-all hover:bg-white/10 min-h-[48px] ${
                selectedTechs.includes(tech.id)
                  ? 'border-cyan-500/50 ring-2 ring-cyan-500/20'
                  : 'border-white/10'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 border ${getCategoryStyle(tech.category)}`}
                  >
                    {tech.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-medium text-white flex items-center gap-2">
                    {tech.icon}
                    {tech.name}
                  </h3>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedTechs.includes(tech.id)
                      ? 'bg-cyan-600 border-cyan-600'
                      : 'border-gray-500'
                  }`}
                >
                  {selectedTechs.includes(tech.id) && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <span
                  className={`text-xs sm:text-sm ${
                    tech.learningCurve === 'Beginner'
                      ? 'text-green-400'
                      : tech.learningCurve === 'Intermediate'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  }`}
                >
                  <Gauge className="w-3 h-3 inline mr-1" />
                  {tech.learningCurve}
                </span>
              </div>

              <p className="text-sm text-gray-400 line-clamp-2">
                {tech.features.slice(0, 3).join(', ')}...
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Compare View */}
      {viewMode === 'compare' && selectedTechData.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/20">
                  <th className="text-left py-4 px-4 sm:px-6 font-medium text-gray-400 min-w-[120px] sm:min-w-[150px] text-sm sm:text-base">
                    Aspect
                  </th>
                  {selectedTechData.map((tech) => (
                    <th
                      key={tech.id}
                      className="text-left py-4 px-4 sm:px-6 font-medium text-white min-w-[200px] sm:min-w-[250px]"
                    >
                      <div className="flex items-center gap-2">
                        {tech.icon}
                        <div>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-1 border ${getCategoryStyle(tech.category)}`}
                          >
                            {tech.category}
                          </span>
                          <div className="text-base sm:text-lg">{tech.name}</div>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Key Features */}
                <tr className="border-b border-white/10">
                  <td className="py-4 px-4 sm:px-6 font-medium text-gray-400 text-sm sm:text-base">
                    Features
                  </td>
                  {selectedTechData.map((tech) => (
                    <td key={tech.id} className="py-4 px-4 sm:px-6 text-xs sm:text-sm text-gray-300">
                      <ul className="space-y-1">
                        {tech.features.map((feature, idx) => (
                          <li key={idx}>- {feature}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Use Cases */}
                <tr className="border-b border-white/10 bg-white/5">
                  <td className="py-4 px-4 sm:px-6 font-medium text-gray-400 text-sm sm:text-base">
                    Use Cases
                  </td>
                  {selectedTechData.map((tech) => (
                    <td key={tech.id} className="py-4 px-4 sm:px-6 text-xs sm:text-sm text-cyan-400">
                      <ul className="space-y-1">
                        {tech.useCases.map((useCase, idx) => (
                          <li key={idx}>- {useCase}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Learning Curve */}
                <tr className="border-b border-white/10">
                  <td className="py-4 px-4 sm:px-6 font-medium text-gray-400 text-sm sm:text-base">
                    Learning
                  </td>
                  {selectedTechData.map((tech) => (
                    <td key={tech.id} className="py-4 px-4 sm:px-6">
                      <div
                        className={`font-medium text-sm sm:text-base ${
                          tech.learningCurve === 'Beginner'
                            ? 'text-green-400'
                            : tech.learningCurve === 'Intermediate'
                              ? 'text-yellow-400'
                              : 'text-red-400'
                        }`}
                      >
                        {tech.learningCurve}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400 mt-1">{tech.learningNote}</div>
                    </td>
                  ))}
                </tr>

                {/* Pros */}
                <tr className="border-b border-white/10 bg-white/5">
                  <td className="py-4 px-4 sm:px-6 font-medium text-gray-400 text-sm sm:text-base">
                    Pros
                  </td>
                  {selectedTechData.map((tech) => (
                    <td key={tech.id} className="py-4 px-4 sm:px-6 text-xs sm:text-sm text-green-400">
                      {tech.pros}
                    </td>
                  ))}
                </tr>

                {/* Cons */}
                <tr>
                  <td className="py-4 px-4 sm:px-6 font-medium text-gray-400 text-sm sm:text-base">
                    Cons
                  </td>
                  {selectedTechData.map((tech) => (
                    <td key={tech.id} className="py-4 px-4 sm:px-6 text-xs sm:text-sm text-red-400">
                      {tech.cons}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {viewMode === 'compare' && selectedTechData.length === 0 && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 sm:p-12 text-center">
          <Zap className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg sm:text-xl font-medium text-white mb-2">No Tech Selected</h3>
          <p className="text-sm sm:text-base text-gray-400 mb-6">
            Select up to 3 tech in Grid view
          </p>
          <button
            onClick={() => setViewMode('grid')}
            className="min-h-[48px] px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all"
          >
            Grid View
          </button>
        </div>
      )}

      {/* Recommended Stacks */}
      <div className="mt-8 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-medium text-white mb-4">Recommended Stacks</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="text-sm font-medium text-white mb-2">E-commerce</div>
            <div className="text-cyan-400 text-xs sm:text-sm mb-2">
              Next.js + Tailwind + Supabase + Stripe
            </div>
            <div className="text-xs text-gray-400">
              Perfect SEO, payment integration, real-time updates
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="text-sm font-medium text-white mb-2">SaaS Dashboard</div>
            <div className="text-cyan-400 text-xs sm:text-sm mb-2">
              Vite + React + Zustand + shadcn/ui
            </div>
            <div className="text-xs text-gray-400">
              Fast development, complex state management, pro UI
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="text-sm font-medium text-white mb-2">Marketing Site</div>
            <div className="text-cyan-400 text-xs sm:text-sm mb-2">
              Astro + Tailwind + Cloudflare Pages
            </div>
            <div className="text-xs text-gray-400">
              Maximum performance, excellent SEO, cost-effective
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="text-sm font-medium text-white mb-2">Blog/Portfolio</div>
            <div className="text-cyan-400 text-xs sm:text-sm mb-2">Astro + Markdown + Vercel</div>
            <div className="text-xs text-gray-400">
              Content-focused, minimal JS, easy management
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TechStackComparison