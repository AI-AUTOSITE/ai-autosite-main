import { Metadata } from 'next'
import AiPromptGeneratorClient from './components/AiPromptGeneratorClient'

export const metadata: Metadata = {
  title: 'Free AI Prompt Generator - No Ads, No Sign Up | AI AutoSite',
  description: 'Generate perfect ChatGPT & Claude prompts instantly. 100% free, no ads, no tracking, no email required.',
  keywords: 'free prompt generator, no ads, chatgpt prompts, claude prompts, privacy, no sign up',
  openGraph: {
    title: 'AI Prompt Generator - Truly Free, No Ads',
    description: 'Zero ads, zero tracking. Create better AI prompts without the BS.',
    type: 'website',
    images: [{
      url: '/og-prompt-generator.png',
      width: 1200,
      height: 630,
      alt: 'Free AI Prompt Generator - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Prompt Generator - Free Forever',
    description: 'Perfect prompts without ads or tracking.'
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/ai-prompt-generator'
  }
}

export default function AiPromptGeneratorPage() {
  return <AiPromptGeneratorClient />
}