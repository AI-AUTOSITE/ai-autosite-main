import { Metadata } from 'next'
import AiPromptGeneratorClient from './components/AiPromptGeneratorClient'

export const metadata: Metadata = {
  title: 'AI Prompt Generator - ChatGPT & Claude Prompts | AI AutoSite',
  description: 'Generate perfect prompts for ChatGPT and Claude. Get better AI responses with optimized prompts. Free prompt maker.',
  keywords: 'ai prompt generator, chatgpt prompts, claude prompts, prompt engineering, ai prompts',
  openGraph: {
    title: 'AI Prompt Generator - Free Tool',
    description: 'Create better AI prompts instantly',
    type: 'website',
  },
}

export default function AiPromptGeneratorPage() {
  return <AiPromptGeneratorClient />
}