import { Metadata } from 'next'
import CornellNoteClient from './components/CornellNoteClient'

export const metadata: Metadata = {
  title: 'Cornell Note Template Generator - Free Printable | AI AutoSite',
  description:
    'Create Cornell-style note templates instantly. Scientifically proven to boost retention by 58%. Free, no signup, works offline.',
  keywords: 'cornell notes, note-taking template, study method, free printable, student tools, learning',
  openGraph: {
    title: 'Cornell Note Generator - Science-Backed Study Tool',
    description: 'Generate printable Cornell note templates. Proven to improve memory retention.',
    type: 'website',
    images: [
      {
        url: '/og-cornell-note.png',
        width: 1200,
        height: 630,
        alt: 'Cornell Note Template Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cornell Notes - Free Template Maker',
    description: 'Create study templates based on 70 years of research.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/cornell-note',
  },
}

export default function CornellNotePage() {
  return <CornellNoteClient />
}