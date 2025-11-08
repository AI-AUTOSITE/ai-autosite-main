import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Knowledge Hub - Guides & Tutorials | AI AutoSite',
  description:
    'Expert guides on AI tools, development, and productivity. Learn how to use our free tools effectively.',
  keywords: 'AI tools guide, developer tutorials, productivity tips, tech blog',
  openGraph: {
    title: 'Knowledge Hub - AI AutoSite Blog',
    description: 'Expert guides and tutorials for modern development tools',
    type: 'website',
    url: 'https://ai-autosite.com/blog',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-800 flex flex-col">
      {/* Background animations - more subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
      </div>

      {/* Common Header */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10 flex-1">{children}</main>

      {/* Common Footer */}
      <Footer />
    </div>
  )
}