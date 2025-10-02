import { Metadata } from 'next'
import StudyToolsClient from './components/StudyToolsClient'

export const metadata: Metadata = {
  title: 'Free AI Study Tools - Smart Learning Assistance | AI AutoSite',
  description: 'AI-powered study tools. PDF summarization, study guides, note-taking AI, flash cards. 100% free, no ads, no tracking.',
  keywords: 'study tools, AI learning, PDF summary, study guides, free, no ads, flash cards',
  openGraph: {
    title: 'Study Tools - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. AI-powered learning assistance.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Study Tools - No Ads, No Sign Up',
    description: 'Smart learning assistance without ads or tracking.'
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/study-tools'
  }
}

export default function StudyToolsPage() {
  return <StudyToolsClient />
}