import Link from 'next/link'
import { Github, Twitter, Mail, Shield, Lock, Zap } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  const footerLinks = {
    tools: [
      { label: 'Code Reader', href: '/tools/code-reader' },
      { label: 'Tech Stack Analyzer', href: '/tools/tech-stack-analyzer' },
      { label: 'BlurTap', href: '/tools/blurtap' },
    ],
    resources: [
      { label: 'Blog', href: '/blog' },
      { label: 'Documentation', href: '#' },
      { label: 'GitHub', href: 'https://github.com/ai-autosite', external: true },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Open Source', href: 'https://github.com/ai-autosite', external: true },
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Developer Tools */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Developer Tools
              </h3>
              <ul className="space-y-2">
                {footerLinks.tools.map((link) => (
                  <li key={link.href}>
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
            
            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a 
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-cyan-400 transition-colors text-sm inline-flex items-center"
                      >
                        {link.label}
                        <span className="ml-1 text-xs">↗</span>
                      </a>
                    ) : (
                      <Link 
                        href={link.href}
                        className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    )}
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
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a 
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-cyan-400 transition-colors text-sm inline-flex items-center"
                      >
                        {link.label}
                        <span className="ml-1 text-xs">↗</span>
                      </a>
                    ) : (
                      <Link 
                        href={link.href}
                        className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact & Social */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Connect
              </h3>
              <div className="space-y-3">
                <a 
                  href="mailto:aiautosite@gmail.com"
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </a>
                <a 
                  href="https://github.com/ai-autosite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center"
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </a>
                <a 
                  href="https://twitter.com/ai_autosite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </a>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-sm text-gray-500">
                © {currentYear} AI-AutoSite • Built with transparency and privacy in mind
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-xs text-gray-500 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-3 py-1 rounded-full border border-cyan-500/20">
                  No cookies • No tracking • No BS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}