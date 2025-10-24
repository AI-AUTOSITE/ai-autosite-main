import { Metadata } from 'next'
import AIToolsClient from './components/AIToolsClient'

export const metadata: Metadata = {
  title: 'Free AI Tools - Powered by Claude & GPT | AI AutoSite',
  description:
    'AI-powered productivity tools. Resume builder, text summarizer, prompt generator, code review. Powered by Claude and OpenAI. No ads.',
  keywords:
    'ai tools, chatgpt, claude, ai summarizer, ai resume, prompt generator, code review, free, no ads',
  openGraph: {
    title: 'AI Tools - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. AI-powered productivity and creativity.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Tools - No Ads, No Sign Up',
    description: 'AI-powered tools without ads or tracking.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/ai-tools',
  },
}

export default function AIToolsPage() {
  return <AIToolsClient />
}