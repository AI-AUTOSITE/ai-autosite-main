import { Metadata } from 'next'
import UuidGeneratorClient from './components/UuidGeneratorClient'

export const metadata: Metadata = {
  title: 'UUID Generator - Random UUIDs v4 | AI AutoSite',
  description: 'Generate random UUIDs (v4) for your applications. Create unique identifiers instantly. Bulk generation available.',
  keywords: 'uuid generator, guid generator, unique id, uuid v4, random uuid',
  openGraph: {
    title: 'UUID Generator - Free Tool',
    description: 'Generate unique identifiers instantly',
    type: 'website',
  },
}

export default function UuidGeneratorPage() {
  return <UuidGeneratorClient />
}