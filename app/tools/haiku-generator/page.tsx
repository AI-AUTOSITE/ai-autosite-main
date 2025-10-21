// app/tools/haiku-generator/page.tsx
import { Metadata } from 'next'
import HaikuClient from './components/HaikuClient'

export const metadata: Metadata = {
  title: 'Free AI Haiku Generator - Learn Poetry Writing | AI AutoSite',
  description: 'Create beautiful haikus with AI guidance. Learn 5-7-5 poetry structure and season words. 100% free, no ads, no tracking, no sign up.',
  keywords: 'free haiku generator, AI poetry, creative writing, learn haiku, season words, kigo, no ads, no sign up, privacy',
  
  openGraph: {
    title: 'AI Haiku Generator - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. Learn and create beautiful haikus with AI coaching.',
    type: 'website',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'AI Haiku Generator - Free Forever, No Ads',
    description: 'Learn poetry writing through traditional haiku. AI-powered coaching included.'
  },
  
  robots: {
    index: true,
    follow: true
  },
  
  alternates: {
    canonical: 'https://ai-autosite.com/tools/haiku-generator'
  }
}

export default function HaikuGeneratorPage() {
  return <HaikuClient />
}