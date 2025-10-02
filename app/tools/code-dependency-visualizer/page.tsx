import { Metadata } from 'next'
import CodeDependencyVisualizerClient from './components/CodeDependencyVisualizerClient'

export const metadata: Metadata = {
  title: 'Free Code Dependency Visualizer - No Ads | AI AutoSite',
  description: 'Analyze project structure, compress code for AI, and visualize dependencies. Upload files to get started. 100% free, no ads, no tracking.',
  keywords: 'code analyzer, dependency visualizer, code compressor, free tool, no ads, AI optimization',
  openGraph: {
    title: 'Code Dependency Visualizer - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. Analyze and compress code for AI sharing.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Code Dependency Visualizer - No Ads',
    description: 'Analyze project structure and compress code without ads.'
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/code-dependency-visualizer'
  }
}

export default function CodeDependencyVisualizerPage() {
  return <CodeDependencyVisualizerClient />
}