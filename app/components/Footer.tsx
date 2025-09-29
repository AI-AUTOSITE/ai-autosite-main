// app/components/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  // Simple footer links
const footerLinks = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy-policy' },
  { label: 'Terms', href: '/terms-of-service' },
  { label: 'GitHub', href: 'https://github.com/ai-autosite' },
]
  
  return (
    <footer className="mt-auto bg-gray-900/50 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Links and Copyright - centered on desktop */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Links */}
          <div className="flex flex-wrap gap-3 justify-center">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Separator */}
          <span className="hidden sm:inline text-gray-600">•</span>
          
          {/* Copyright */}
          <p className="text-xs text-gray-600">
            © {currentYear} AI AutoSite
          </p>
        </div>
      </div>
    </footer>
  )
}