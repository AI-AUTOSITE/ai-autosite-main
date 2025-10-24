import { Metadata } from 'next'
import LearningClient from './components/LearningClient'

export const metadata: Metadata = {
  title: 'Free Learning Tools - Study & Productivity | AI AutoSite',
  description:
    'Learning and study tools. Pomodoro timer, AI dictionary, study techniques. Boost productivity and master concepts. No ads.',
  keywords:
    'learning tools, study tools, pomodoro timer, ai dictionary, productivity, education, free, no ads',
  openGraph: {
    title: 'Learning Tools - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking, zero BS. Tools to enhance learning and productivity.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Learning Tools - No Ads, No Sign Up',
    description: 'Study and learn without ads or tracking.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/learning',
  },
}

export default function LearningPage() {
  return <LearningClient />
}