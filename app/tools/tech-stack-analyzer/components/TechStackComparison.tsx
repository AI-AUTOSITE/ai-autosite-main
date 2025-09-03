// app/tools/tech-stack-analyzer/components/TechStackComparison.tsx
'use client';

import { useState } from 'react';
// Tech data structure
interface TechData {
  id: string;
  name: string;
  category: string;
  categoryColor: string;
  features: string[];
  useCases: string[];
  learningCurve: 'Beginner' | 'Intermediate' | 'Advanced';
  learningNote: string;
  pros: string;
  cons: string;
}

// All technologies data
const techData: TechData[] = [
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'Framework',
    categoryColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    features: [
      'Full-stack React framework',
      'Built-in SSR/SSG',
      'File-based routing',
      'API Routes',
      'Automatic image optimization',
      'Edge runtime support'
    ],
    useCases: [
      'SEO-critical websites',
      'E-commerce sites',
      'Corporate websites',
      'Full-stack applications',
      'Content-heavy sites',
      'Blogs with dynamic features'
    ],
    learningCurve: 'Intermediate',
    learningNote: 'React + framework concepts',
    pros: 'Best SEO, zero config, rich ecosystem',
    cons: 'Steeper learning curve, heavier builds'
  },
  {
    id: 'astro',
    name: 'Astro',
    category: 'Framework',
    categoryColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    features: [
      'Static-site focused',
      'Multi-framework support',
      'Minimal JavaScript',
      'Component Islands',
      'Native Markdown support',
      'Content collections'
    ],
    useCases: [
      'Documentation sites',
      'Blogs & content sites',
      'Landing pages',
      'Portfolio websites',
      'Marketing sites',
      'Performance-critical sites'
    ],
    learningCurve: 'Intermediate',
    learningNote: 'Unique syntax & concepts',
    pros: 'Fastest performance, great SEO, lightweight',
    cons: 'Limited interactivity, smaller ecosystem'
  },
  {
    id: 'sveltekit',
    name: 'SvelteKit',
    category: 'Framework',
    categoryColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    features: [
      'Compile-time optimization',
      'No Virtual DOM',
      'Intuitive syntax',
      'Small bundle sizes',
      'Built-in reactivity',
      'TypeScript support'
    ],
    useCases: [
      'High-performance apps',
      'Mobile applications',
      'Interactive dashboards',
      'Real-time applications',
      'Animation-heavy sites',
      'Lightweight SPAs'
    ],
    learningCurve: 'Intermediate',
    learningNote: 'New concepts to learn',
    pros: 'Fast runtime, small bundles, great DX',
    cons: 'Smaller adoption, fewer resources'
  },
  {
    id: 'vite',
    name: 'Vite',
    category: 'Build Tool',
    categoryColor: 'bg-green-500/20 text-green-300 border-green-500/30',
    features: [
      'Lightning-fast dev server',
      'ES Modules native',
      'Instant HMR',
      'Framework agnostic',
      'Plugin ecosystem',
      'Production optimizations'
    ],
    useCases: [
      'SPAs & admin panels',
      'Rapid prototyping',
      'Library development',
      'Learning projects',
      'Developer tooling',
      'Multi-page applications'
    ],
    learningCurve: 'Beginner',
    learningNote: 'Minimal configuration',
    pros: 'Best dev experience, fast, simple setup',
    cons: 'Weak SEO without SSR setup'
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'Styling',
    categoryColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    features: [
      'Utility-first CSS',
      'Highly customizable',
      'Component-friendly',
      'Built-in design system',
      'JIT compilation',
      'Plugin ecosystem'
    ],
    useCases: [
      'Rapid UI development',
      'Design system consistency',
      'Component libraries',
      'Responsive design',
      'Team collaboration',
      'Prototyping'
    ],
    learningCurve: 'Beginner',
    learningNote: 'Learn utility classes',
    pros: 'Fast development, consistent design, great DX',
    cons: 'Large HTML classes, learning curve'
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'Database',
    categoryColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    features: [
      'PostgreSQL + auto APIs',
      'Real-time subscriptions',
      'Built-in authentication',
      'File storage',
      'Edge functions',
      'Firebase alternative'
    ],
    useCases: [
      'Chat applications',
      'Real-time dashboards',
      'User auth systems',
      'CRUD applications',
      'Collaborative tools',
      'MVP development'
    ],
    learningCurve: 'Beginner',
    learningNote: 'If familiar with SQL',
    pros: 'Easy setup, full-featured, generous free tier',
    cons: 'PostgreSQL-only, vendor lock-in'
  },
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'Hosting',
    categoryColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    features: [
      'Zero-config deployment',
      'Edge functions',
      'Preview deployments',
      'Analytics included',
      'Next.js optimized',
      'Custom domains'
    ],
    useCases: [
      'Next.js applications',
      'Frontend projects',
      'Team collaboration',
      'Preview environments',
      'Jamstack sites',
      'Rapid deployment'
    ],
    learningCurve: 'Beginner',
    learningNote: 'Git integration',
    pros: 'Easy deployment, great performance, excellent DX',
    cons: 'Can get expensive, vendor lock-in'
  }
];

// Tooltip component for technical terms
interface TooltipProps {
  term: string;
  description: string;
}

const Tooltip = ({ term, description }: TooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <span
        className="text-cyan-400 underline decoration-dotted cursor-help"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {term}
      </span>
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl border border-white/20 whitespace-nowrap max-w-xs">
          <p className="text-xs">{description}</p>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="w-2 h-2 bg-gray-900 transform rotate-45 border-r border-b border-white/20"></div>
          </div>
        </div>
      )}
    </div>
  );
};

const TechStackComparison = () => {
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'compare'>('grid');
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for sticky header
  useState(() => {
    const handleScroll = () => {
      const controlsElement = document.getElementById('compare-controls');
      if (controlsElement) {
        const rect = controlsElement.getBoundingClientRect();
        setIsScrolled(rect.top <= 64); // 64px is header height
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  });

  const toggleTechSelection = (techId: string) => {
    setSelectedTechs(prev => {
      if (prev.includes(techId)) {
        return prev.filter(id => id !== techId);
      }
      if (prev.length >= 3) {
        // Replace oldest selection
        return [...prev.slice(1), techId];
      }
      return [...prev, techId];
    });
  };

  const selectedTechData = techData.filter(tech => selectedTechs.includes(tech.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
{/* Controls - Sticky version */}
      <div 
        id="compare-controls"
        className={`sticky top-16 z-30 transition-all duration-300 ${
          isScrolled ? '-mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8' : ''
        }`}
      >
        <div className={`bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 transition-all duration-300 ${
          isScrolled ? 'py-3 px-4' : 'p-6'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className={`transition-all duration-300 ${isScrolled ? 'flex items-center gap-4' : ''}`}>
              <h2 className={`font-bold text-white transition-all duration-300 ${
                isScrolled ? 'text-base' : 'text-xl mb-2'
              }`}>
                Compare Technologies
              </h2>
              {!isScrolled && (
                <p className="text-sm text-gray-400">
                  Select up to 3 technologies to compare side by side
                </p>
              )}
              {isScrolled && selectedTechs.length > 0 && (
                <div className="hidden sm:flex gap-2">
                  {selectedTechs.map(techId => {
                    const tech = techData.find(t => t.id === techId);
                    return (
                      <span key={techId} className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs">
                        {tech?.name}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-lg font-medium transition-all ${
                  isScrolled ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
                } ${
                  viewMode === 'grid'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode('compare')}
                className={`rounded-lg font-medium transition-all ${
                  isScrolled ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
                } ${
                  viewMode === 'compare'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
                disabled={selectedTechs.length === 0}
              >
                Compare ({selectedTechs.length})
              </button>
            </div>
          </div>

          {!isScrolled && selectedTechs.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedTechs.map(techId => {
                const tech = techData.find(t => t.id === techId);
                return (
                  <span key={techId} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm flex items-center gap-2">
                    {tech?.name}
                    <button
                      onClick={() => toggleTechSelection(techId)}
                      className="text-cyan-300 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add margin to prevent content jump */}
      <div className="mb-8"></div>
      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {techData.map(tech => (
            <div
              key={tech.id}
              onClick={() => toggleTechSelection(tech.id)}
              className={`bg-white/5 backdrop-blur-xl rounded-xl p-6 border cursor-pointer transition-all hover:bg-white/10 ${
                selectedTechs.includes(tech.id)
                  ? 'border-cyan-500/50 ring-2 ring-cyan-500/20'
                  : 'border-white/10'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 border ${tech.categoryColor}`}>
                    {tech.category}
                  </span>
                  <h3 className="text-lg font-bold text-white">{tech.name}</h3>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 ${
                  selectedTechs.includes(tech.id)
                    ? 'bg-cyan-500 border-cyan-500'
                    : 'border-gray-500'
                }`}>
                  {selectedTechs.includes(tech.id) && (
                    <svg className="w-full h-full text-white p-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              
              <div className="mb-3">
                <span className={`text-sm ${
                  tech.learningCurve === 'Beginner' ? 'text-green-400' :
                  tech.learningCurve === 'Intermediate' ? 'text-orange-400' :
                  'text-red-400'
                }`}>
                  {tech.learningCurve} Level
                </span>
              </div>

              <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                {tech.features.slice(0, 3).join(', ')}...
              </p>

              <div className="text-xs text-gray-500">
                Click to {selectedTechs.includes(tech.id) ? 'remove from' : 'add to'} comparison
              </div>
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
                  <th className="text-left py-4 px-6 font-semibold text-gray-400 min-w-[150px]">Aspect</th>
                  {selectedTechData.map(tech => (
                    <th key={tech.id} className="text-left py-4 px-6 font-semibold text-white min-w-[250px]">
                      <div>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 border ${tech.categoryColor}`}>
                          {tech.category}
                        </span>
                        <div className="text-xl">{tech.name}</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Key Features */}
                <tr className="border-b border-white/10">
                  <td className="py-4 px-6 font-medium text-gray-400">
                    Key Features
                  </td>
                  {selectedTechData.map(tech => (
                    <td key={tech.id} className="py-4 px-6 text-sm text-gray-300">
                      <ul className="space-y-1">
                        {tech.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-cyan-400 mr-2">•</span>
                            {feature.includes('SSR') ? (
                              <Tooltip term="SSR" description="Server-Side Rendering: Pages are prepared on the server before sending to browser, improving SEO and initial load time" />
                            ) : feature.includes('SSG') ? (
                              <Tooltip term="SSG" description="Static Site Generation: Pages are built at compile time, resulting in ultra-fast loading" />
                            ) : feature.includes('HMR') ? (
                              <Tooltip term="HMR" description="Hot Module Replacement: See code changes instantly without page refresh" />
                            ) : feature.includes('Virtual DOM') ? (
                              <Tooltip term="Virtual DOM" description="A JavaScript representation of the real DOM for efficient updates" />
                            ) : feature}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Best Use Cases */}
                <tr className="border-b border-white/10 bg-white/5">
                  <td className="py-4 px-6 font-medium text-gray-400">
                    Best Use Cases
                  </td>
                  {selectedTechData.map(tech => (
                    <td key={tech.id} className="py-4 px-6 text-sm text-green-400">
                      <ul className="space-y-1">
                        {tech.useCases.map((useCase, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2">•</span>
                            {useCase}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Learning Curve */}
                <tr className="border-b border-white/10">
                  <td className="py-4 px-6 font-medium text-gray-400">
                    Learning Curve
                  </td>
                  {selectedTechData.map(tech => (
                    <td key={tech.id} className="py-4 px-6">
                      <div className={`font-medium ${
                        tech.learningCurve === 'Beginner' ? 'text-green-400' :
                        tech.learningCurve === 'Intermediate' ? 'text-orange-400' :
                        'text-red-400'
                      }`}>
                        {tech.learningCurve}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {tech.learningNote}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Pros */}
                <tr className="border-b border-white/10 bg-white/5">
                  <td className="py-4 px-6 font-medium text-gray-400">
                    Pros
                  </td>
                  {selectedTechData.map(tech => (
                    <td key={tech.id} className="py-4 px-6 text-sm">
                      <div className="text-green-400">✅ {tech.pros}</div>
                    </td>
                  ))}
                </tr>

                {/* Cons */}
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-400">
                    Cons
                  </td>
                  {selectedTechData.map(tech => (
                    <td key={tech.id} className="py-4 px-6 text-sm">
                      <div className="text-red-400">⚠️ {tech.cons}</div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State for Compare View */}
      {viewMode === 'compare' && selectedTechData.length === 0 && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">No Technologies Selected</h3>
          <p className="text-gray-400 mb-6">
            Switch to Grid View and select up to 3 technologies to compare them side by side
          </p>
          <button
            onClick={() => setViewMode('grid')}
            className="px-6 py-3 bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-all border border-cyan-500/30"
          >
            Switch to Grid View
          </button>
        </div>
      )}

      {/* Use Case Recommendations - Keep existing */}
      <div className="mt-16 bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">Recommended Stacks by Use Case</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10">
            <div className="text-xl font-bold mb-3 text-white">E-commerce Platform</div>
            <div className="text-green-400 font-semibold mb-3">Next.js + Tailwind + Supabase + Stripe + Vercel</div>
            <div className="text-sm text-gray-400 leading-relaxed">
              Perfect <Tooltip term="SEO" description="Search Engine Optimization: How well search engines can find and rank your website" /> for product pages, built-in 
              <Tooltip term="API routes" description="Backend endpoints that handle data operations like saving orders or processing payments" /> for payments, 
              real-time inventory updates, and seamless checkout experience.
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10">
            <div className="text-xl font-bold mb-3 text-white">SaaS Dashboard</div>
            <div className="text-green-400 font-semibold mb-3">Vite + React + Zustand + tRPC + shadcn/ui + Vercel</div>
            <div className="text-sm text-gray-400 leading-relaxed">
              Fast development cycle, complex state management, <Tooltip term="type-safe APIs" description="APIs where data types are checked at compile time, preventing errors" />, 
              and professional UI components for data visualization.
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10">
            <div className="text-xl font-bold mb-3 text-white">Marketing Website</div>
            <div className="text-green-400 font-semibold mb-3">Astro + Tailwind + Markdown + Cloudflare Pages</div>
            <div className="text-sm text-gray-400 leading-relaxed">
              Maximum performance, excellent SEO, easy content management, 
              and cost-effective global distribution.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStackComparison;