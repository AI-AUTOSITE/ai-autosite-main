// app/components/Footer.tsx
import Link from 'next/link'
import { Shield } from 'lucide-react'

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
    // ✅ mt-auto を削除
    <footer className="bg-gradient-to-b from-gray-900/50 to-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Desktop Footer - 4 Column Grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 mb-8">
          {/* Resources Column */}
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

          {/* Company Column */}
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

          {/* Legal Column */}
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
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Connect
            </h3>
            <ul className="space-y-2">
              {footerSections.social.map((link) => (
                <li key={link.href}>
                  
                    <a href={link.href}
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

        {/* Mobile Footer - Compact List */}
        <div className="md:hidden mb-6">
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
            {/* Brand & Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <Link
                href="/"
                className="text-white font-bold text-lg hover:text-cyan-400 transition-colors"
              >
                AI AutoSite
              </Link>
              <span className="hidden sm:inline text-gray-600">•</span>
              <p className="text-xs text-gray-500">
                © {currentYear} AI AutoSite. All rights reserved.
              </p>
            </div>

            {/* Tagline */}
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
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