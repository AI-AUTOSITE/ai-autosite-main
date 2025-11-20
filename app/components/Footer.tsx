// app/components/Footer.tsx
// ✨ リッチ版：Signalブランドを強調したバージョン

import Link from 'next/link'
import SignalLogo from './icons/SignalLogo'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = {
    resources: [
      { label: 'Documentation', href: '/documentation' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Blog', href: '/blog' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Request Tool', href: '/request' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
    ],
    social: [
      { label: 'GitHub', href: 'https://github.com/ai-autosite' },
      { label: 'Twitter', href: 'https://twitter.com/ai_autosite' },
    ],
  }

  const mobileLinks = [
    { label: 'FAQ', href: '/faq' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy', href: '/privacy-policy' },
    { label: 'Terms', href: '/terms-of-service' },
  ]

  return (
    <footer 
      className="bg-gradient-to-b from-gray-900/50 to-gray-900 border-t border-gray-800"
      style={{
        minHeight: '360px',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Desktop Footer with Brand Section */}
        <div className="hidden md:grid md:grid-cols-5 gap-8 lg:gap-12 mb-8">
          
          {/* Brand Section */}
          <div className="col-span-2">
            <Link 
              href="/" 
              className="flex items-center gap-3 mb-4 group"
            >
              <SignalLogo 
                size={48} 
                colors={['#FFFFFF', '#E0E0E0', '#B0B0B0']}
              />
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  Signal
                </h3>
                <p className="text-xs text-gray-400">Free • Private • Instant</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Transparent, privacy-first tools that work entirely in your browser. 
              No data collection, no tracking, no compromises.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              <a 
                href="https://github.com/ai-autosite" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="https://twitter.com/ai_autosite" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-2">
              {footerSections.resources.map((link) => (
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

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-2">
              {footerSections.company.map((link) => (
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

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-2">
              {footerSections.legal.map((link) => (
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
            
            <h3 className="text-white font-semibold mb-4 mt-6 text-sm uppercase tracking-wider">
              Connect
            </h3>
            <ul className="space-y-2">
              {footerSections.social.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="md:hidden mb-6">
          {/* Mobile Brand */}
          <Link 
            href="/" 
            className="flex items-center justify-center gap-3 mb-6"
          >
            <SignalLogo 
              size={40} 
              colors={['#FFFFFF', '#E0E0E0', '#B0B0B0']}
            />
            <div>
              <h3 className="text-lg font-bold text-white">Signal</h3>
              <p className="text-xs text-gray-400">Free • Private • Instant</p>
            </div>
          </Link>
          
          {/* Mobile Links */}
          <div className="flex flex-wrap gap-3 justify-center">
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-gray-400 hover:text-cyan-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              © {currentYear} Signal. All rights reserved.
            </p>

            <div className="flex items-center gap-2">
              <SignalLogo 
                size={16} 
                colors={['#06B6D4', '#06B6D4', '#06B6D4']}
              />
              <p className="text-sm text-gray-400 font-medium">
                Privacy-first tools for everyone
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}