import { Metadata } from 'next'
import TextCounterClient from './components/TextCounterClient'

export const metadata: Metadata = {
  title: 'Text Counter - Word & Character Count | AI AutoSite',
  description: 'Count words, characters, lines instantly. Perfect for essays, Twitter, social media. Free online text counter.',
  keywords: 'word counter, character counter, text counter, letter count, word count tool',
  openGraph: {
    title: 'Text Counter - Free Word & Character Counter',
    description: 'Count words and characters instantly as you type',
    type: 'website',
  },
}

export default function TextCounterPage() {
  return <TextCounterClient />
}