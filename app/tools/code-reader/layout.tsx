// app/tools/code-reader/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Code Dependency Visualizer - AI-Powered Code Analysis',
  description: 'Analyze your project structure and dependencies with AI assistance. Perfect for beginners and professionals.',
  keywords: 'code analysis, dependency visualization, AI coding, refactoring, ChatGPT, Claude',
}

export default function CodeReaderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Animation */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      </div>
      
      {/* Main Content */}
      <main className="relative">
        {children}
      </main>
    </div>
  )
}