// 10. code-dependency-visualizer/page.tsx
// クライアントコンポーネントへの分離が必要
import { Metadata } from 'next'
import CodeDependencyVisualizerClient from './components/CodeDependencyVisualizerClient'

export const metadata: Metadata = {
  title: 'Free Code Dependency Visualizer - No Ads, No Sign Up | AI AutoSite',
  description: 'Visualize code dependencies & compress for AI. 100% free, no ads, works offline. Reduce tokens by 60%.',
  keywords: 'free dependency visualizer, code analysis, no ads, ai compress, privacy, no tracking',
  openGraph: {
    title: 'Code Dependency Visualizer - Zero Ads, Zero BS',
    description: 'Analyze code without ads or tracking. 100% browser-based, truly free.',
    type: 'website',
    images: [{
      url: '/og-dependency-visualizer.png',
      width: 1200,
      height: 630,
      alt: 'Code Dependency Visualizer - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Code Visualizer - Free, No Ads Ever',
    description: 'Visualize & compress code. 100% private.'
  }
}

export default function CodeDependencyVisualizerPage() {
  return <CodeDependencyVisualizerClient />
}