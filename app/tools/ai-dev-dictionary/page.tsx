// app/tools/ai-dev-dictionary/page.tsx
import { Metadata } from 'next'
import AIDevDictionaryClient from './components/AIDevDictionaryClient'

export const metadata: Metadata = {
  title: 'AI Dev Dictionary - Learn UI Terms for AI Chat | AI AutoSite',
  description: 'Interactive dictionary to learn proper UI terminology for giving precise instructions to AI. Understand modals, toasts, and 100+ tech terms.',
  keywords: 'ai development terms, ui components, modal, toast, drawer, ai chat terminology',
}

export default function AIDevDictionaryPage() {
  return <AIDevDictionaryClient />
}