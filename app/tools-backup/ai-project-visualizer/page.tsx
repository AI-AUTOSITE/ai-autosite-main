// app/tools/ai-project-visualizer/page.tsx

import { Metadata } from 'next'
import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues with client components
const AIProjectVisualizer = dynamic(
  () => import('./components/AIProjectVisualizer'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">Loading visualizer...</div>
      </div>
    )
  }
)

export const metadata: Metadata = {
  title: 'AI Project Visualizer - Transform File Structure into Diagrams | AI AutoSite',
  description: 'Visualize your project structure and export it as Mermaid diagrams, tree format, JSON, or Markdown for better AI collaboration and documentation.',
  keywords: 'project structure, file tree, mermaid diagram, AI tools, visualization, directory structure, export diagram, developer tools',
  openGraph: {
    title: 'AI Project Visualizer - Better AI Collaboration',
    description: 'Transform your project structure into shareable diagrams for AI tools',
    type: 'website',
  }
}

export default function AIProjectVisualizerPage() {
  return <AIProjectVisualizer />
}