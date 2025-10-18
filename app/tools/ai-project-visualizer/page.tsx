// app/tools/ai-project-visualizer/page.tsx

import { Metadata } from 'next'
import AIProjectVisualizer from './components/AIProjectVisualizer'

export const metadata: Metadata = {
  title: 'Free Project Visualizer - No Ads, No Sign Up | AI AutoSite',
  description:
    'Transform file structures into diagrams instantly. 100% free, no ads, works offline. Export to Mermaid, JSON, Markdown.',
  keywords: 'free project visualizer, no ads, mermaid diagram, file tree, privacy, no tracking',
  openGraph: {
    title: 'AI Project Visualizer - Zero Ads, Zero BS',
    description:
      'Visualize projects without ads or sign-ups. Export anywhere, keep everything private.',
    type: 'website',
    images: [
      {
        url: '/og-project-visualizer.png',
        width: 1200,
        height: 630,
        alt: 'Free Project Visualizer - No Ads',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Project Visualizer - Truly Free, No Ads',
    description: 'Transform files to diagrams. 100% private.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/ai-project-visualizer',
  },
}

export default function AIProjectVisualizerPage() {
  return <AIProjectVisualizer />
}