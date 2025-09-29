import { Metadata } from 'next'
import LoremIpsumClient from './components/LoremIpsumClient'

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator - Dummy Text | AI AutoSite',
  description: 'Generate Lorem Ipsum placeholder text for your designs. Create dummy text in words, sentences, or paragraphs.',
  keywords: 'lorem ipsum, dummy text, placeholder text, lorem generator, filler text',
  openGraph: {
    title: 'Lorem Ipsum Generator - Free Tool',
    description: 'Generate placeholder text instantly',
    type: 'website',
  },
}

export default function LoremIpsumPage() {
  return <LoremIpsumClient />
}