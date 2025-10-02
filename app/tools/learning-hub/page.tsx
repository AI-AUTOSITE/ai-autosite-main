import { Metadata } from 'next'
import LearningHubClient from './components/LearningHubClient'

export const metadata: Metadata = {
  title: 'Free Learning Hub - Understand Concepts | AI AutoSite',
  description: 'Learn technical concepts with interactive examples. Visual explanations, interactive demos, beginner-friendly. No ads, no tracking.',
  keywords: 'learning hub, technical learning, interactive examples, free, no ads, tutorials',
  openGraph: {
    title: 'Learning Hub - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. Interactive learning resources.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Learning Hub - No Ads, No Sign Up',
    description: 'Learn technical concepts without ads or tracking.'
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/learning-hub'
  }
}

export default function LearningHubPage() {
  return <LearningHubClient />
}