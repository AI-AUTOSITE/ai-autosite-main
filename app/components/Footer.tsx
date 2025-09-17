// app/components/Footer.tsx
import Link from 'next/link'
import { Github, Twitter, Mail, Shield, Lock, Zap, Code, BookOpen, GraduationCap, Briefcase } from 'lucide-react'
import { CATEGORIES, TOOLS, getEnabledCategories, getToolsByCategory } from '../lib/categories.config'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const enabledCategories = getEnabledCategories()
  
  // Tool category structure (extensible)
  interface ToolCategory {
    title: string
    icon: JSX.Element
    links: Array<{
      label: string
      href: string
      status?: 'new' | 'soon'
    }>
    disabled?: boolean
  }

  // Generate tool categories dynamically from categories.config
  const toolCategories: Record<string, ToolCategory> = enabledCategories.reduce((acc, category) => {
    const categoryTools = getToolsByCategory(category.id)
    const iconMap: Record<string, JSX.Element> = {
      'quick-tools': <Zap className="w-4 h-4 text-cyan-400" />,
      'dev-tools': <Code className="w-4 h-4 text-purple-400" />,
      'learning': <BookOpen className="w-4 h-4 text-amber-400" />,
      'study-tools': <GraduationCap className="w-4 h-4 text-green-400" />,
      'business': <Briefcase className="w-4 h-4 text-blue-400" />
    }
    
    acc[category.id] = {
      title: category.title,
      icon: iconMap[category.id] || <Zap className="w-4 h-4 text-gray-400" />,
      links: categoryTools.slice(0, 5).map(tool => ({
        label: tool.name,
        href: tool.url,
        status: tool.status === 'coming' ? 'soon' : tool.new ? 'new' : undefined
      }))
    }
    
    return acc
  }, {} as Record<string, ToolCategory>)

  // Coming soon categories for display
  const comingSoonCategories = CATEGORIES.filter(c => !c.enabled)

  const companyLinks = {
    resources: [
      { label: 'Blog', href: '/blog' },
      { label: 'Documentation', href: '/documentation' },
      { label: 'Request Tool', href: '/request' },
    ],
    legal: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
      { label: 'About Us', href: '/about' },
    ],
    connect: [
      { label: 'Contact', href: '/contact', icon: <Mail className="w-4 h-4" /> },
      { label: 'GitHub', href: 'https://github.com/ai-autosite', icon: <Github className="w-4 h-4" />, external: true },
      { label: 'Twitter', href: 'https://twitter.com/ai_autosite', icon: <Twitter className="w-4 h-4" />, external: true },
    ],
  }
  
  const features = [
    { icon: Shield, label: '100% Private', desc: 'No data stored' },
    { icon: Lock, label: 'Open Source', desc: 'Fully transparent' },
    { icon: Zap, label: 'Instant', desc: 'No registration' },
  ]
  
  return (
    <footer className="relative z-10 mt-auto">
      {/* Main Footer Content */}
      <div className="backdrop-blur-xl bg-white/5 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Features Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div 
                  key={feature.label}
                  className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
                >
                  <Icon className="w-8 h-8 text-cyan-400" />
                  <div>
                    <p className="text-white font-semibold">{feature.label}</p>
                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
            {/* Tool Categories */}
            {Object.entries(toolCategories).map(([key, category]) => {
              if (category.disabled) return null
              
              return (
                <div key={key}>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                    {category.icon}
                    <span>{category.title}</span>
                  </h3>
                  <ul className="space-y-2">
                    {category.links.map((link, index) => (
                      <li key={`${link.href}-${index}`}>
                        <Link 
                          href={link.status === 'soon' ? '#' : link.href}
                          className={`text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-1 ${
                            link.status === 'soon' ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {link.label}
                          {link.status === 'new' && (
                            <span className="text-xs px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded">NEW</span>
                          )}
                          {link.status === 'soon' && (
                            <span className="text-xs px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">SOON</span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
            
            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                {companyLinks.resources.map((link, index) => (
                  <li key={`${link.href}-${index}`}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Legal
              </h3>
              <ul className="space-y-2">
                {companyLinks.legal.map((link, index) => (
                  <li key={`${link.href}-${index}`}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Connect */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Connect
              </h3>
              <div className="space-y-2">
                {companyLinks.connect.map((link, index) => (
                  <a 
                    key={`${link.href}-${index}`}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2"
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Coming Soon Section */}
          {comingSoonCategories.length > 0 && (
            <div className="mb-8 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
              <h3 className="text-sm font-semibold text-yellow-400 mb-2">🚀 Coming Soon</h3>
              <div className="flex flex-wrap gap-4">
                {comingSoonCategories.map((category) => {
                  const iconMap: Record<string, JSX.Element> = {
                    'study-tools': <GraduationCap className="w-4 h-4 text-green-400" />,
                    'business': <Briefcase className="w-4 h-4 text-blue-400" />,
                  }
                  return (
                    <div key={category.id} className="flex items-center gap-2 text-gray-400">
                      {iconMap[category.id] || <span>{category.icon}</span>}
                      <span className="text-sm">{category.title}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          
          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div>
                <p className="text-sm text-gray-500">
                  © {currentYear} AI-AutoSite • Built with transparency and privacy in mind
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  *Free for all browser-based tools. AI features may require payment for API costs.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-xs text-gray-500 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-3 py-1 rounded-full border border-cyan-500/20">
                  No cookies • No tracking • No BS
                </span>
              </div>
            </div>
            
            {/* Philosophy Statement */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400 italic">
                "If it doesn't cost us to run, it doesn't cost you to use."
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}