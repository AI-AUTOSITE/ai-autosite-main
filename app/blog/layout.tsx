import Link from 'next/link'
import { Shield, Sparkles, Home, BookOpen } from 'lucide-react'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* 背景アニメーション */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* ヘッダー */}
      <header className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="relative">
                <Shield className="w-10 h-10 text-cyan-400" />
                <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  BlurTap Blog
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">Privacy & Security Insights</p>
              </div>
            </Link>
            
            {/* ナビゲーション */}
            <nav className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-gray-300 text-sm"
              >
                <Home className="w-4 h-4" />
                <span>Tool</span>
              </Link>
              <Link 
                href="/blog" 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-gray-300 text-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span>Blog</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>

      {/* フッター */}
      <footer className="relative z-10 mt-auto py-8 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            © 2024 BlurTap by AI AutoSite • 100% Private • No Data Stored
          </p>
        </div>
      </footer>
    </div>
  )
}