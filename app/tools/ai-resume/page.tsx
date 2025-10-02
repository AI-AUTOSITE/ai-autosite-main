import { Metadata } from 'next'
import AIResumeGenerator from './components/AIResumeGenerator'

export const metadata: Metadata = {
  title: 'Free AI Resume Generator - No Ads, No Sign Up | AI AutoSite',
  description: 'Create professional resumes & cover letters instantly. 100% free, no ads, no email required. Export as PDF.',
  keywords: 'free resume generator, no ads, cover letter, cv maker, no sign up, privacy',
  openGraph: {
    title: 'AI Resume Generator - Zero Ads, Zero Tracking',
    description: 'Professional resumes without the BS. Truly free forever, export as PDF.',
    type: 'website',
    images: [{
      url: '/og-resume-generator.png',
      width: 1200,
      height: 630,
      alt: 'Free Resume Generator - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Resume Generator - No Ads Ever',
    description: 'Create resumes without ads or sign-ups.'
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/ai-resume'
  }
}

export default function AIResumePage() {
  return <AIResumeGenerator />
}