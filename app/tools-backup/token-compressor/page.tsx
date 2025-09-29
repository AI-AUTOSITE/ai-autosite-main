// app/tools/token-compressor/page.tsx
import { Metadata } from 'next'
import TokenCompressor from './components/TokenCompressor'

export const metadata: Metadata = {
  title: 'AI Token Compressor - Optimize Files for AI Sharing | AI AutoSite',
  description: 'Visualize and compress tokens from any file format for efficient AI sharing. Support for multiple files, folders, Git repos, and cloud storage with security checks.',
  keywords: 'token compression, AI optimization, file compression, token counter, AI sharing, GPT tokens, Claude tokens, file optimizer, prompt optimization, ChatGPT, Claude',
  openGraph: {
    title: 'AI Token Compressor - Free Online Tool',
    description: 'Compress and optimize your files for AI sharing with token visualization',
    type: 'website',
    images: ['/og-token-compressor.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Token Compressor - Optimize Files for AI',
    description: 'Smart compression tool for AI interactions',
  }
}

export default function TokenCompressorPage() {
  return <TokenCompressor />
}