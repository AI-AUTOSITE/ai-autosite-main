// app/tools/layout.tsx
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Header */}
      <Header />
      
      {/* Main wrapper with background */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        {/* Breadcrumb Navigation */}
        <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Link 
                href="/" 
                className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              
              <ChevronRight className="w-4 h-4 text-gray-600" />
              
              <Link 
                href="/tools" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                Tools
              </Link>
              
              {/* カテゴリーは動的に追加可能 */}
            </div>
          </div>
        </nav>

        {/* Background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </div>

        {/* Main content */}
        <main className="relative z-10">
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </>
  )
}