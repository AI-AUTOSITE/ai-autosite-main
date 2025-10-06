import { Metadata } from 'next'
import CreativeToolsClient from './components/CreativeToolsClient'

export const metadata: Metadata = {
  title: 'Free Creative Tools - Design & Create | AI AutoSite',
  description:
    'Creative tools for designers and content creators. Color palettes, logo generation, image editing, design templates. No ads.',
  keywords:
    'creative tools, design tools, color palette, image editing, free, no ads, logo generator',
  openGraph: {
    title: 'Creative Tools - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. Tools for designers and creators.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Creative Tools - No Ads, No Sign Up',
    description: 'Design and create without ads or tracking.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/creative-tools',
  },
}

export default function CreativeToolsPage() {
  return <CreativeToolsClient />
}
