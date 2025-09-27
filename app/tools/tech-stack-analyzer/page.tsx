import { Metadata } from 'next';
import TechStackComparison from './components/TechStackComparison';

export const metadata: Metadata = {
  title: 'Tech Stack Analyzer - Framework Comparison Tool | AI AutoSite',
  description: 'Compare Next.js, React, Vue, Svelte and more. Get insights for your project with beginner-friendly explanations. Free tool.',
  keywords: 'tech stack analyzer, framework comparison, Next.js vs React, frontend framework comparison',
  openGraph: {
    title: 'Tech Stack Analyzer - Free Tool',
    description: 'Compare frameworks and make informed decisions',
    type: 'website',
  }
};

export default function TechStackAnalyzerPage() {
  return <TechStackComparison />
}