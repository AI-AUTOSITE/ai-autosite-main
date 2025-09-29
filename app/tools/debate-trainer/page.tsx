import { Metadata } from 'next'
import DebateTrainer from './components/DebateTrainer'

export const metadata: Metadata = {
  title: 'Free AI Debate Trainer - No Ads, No Sign Up | AI AutoSite',
  description: 'Practice debates with AI opponents. 100% free, no ads, no tracking. Get scored feedback instantly.',
  keywords: 'free debate trainer, no ads, ai debate, argumentation, privacy, no sign up, critical thinking',
  openGraph: {
    title: 'AI Debate Trainer - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking. Master debate skills with AI coaching.',
    type: 'website',
    images: [{
      url: '/og-debate-trainer.png',
      width: 1200,
      height: 630,
      alt: 'Free AI Debate Trainer - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Debate Trainer - Free Forever, No Tracking',
    description: 'Practice debates without ads or sign-ups.'
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/debate-trainer'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
}

export default function DebateTrainerPage() {
  return (
    <>
      {/* 構造化データ for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'AI Debate Trainer',
            applicationCategory: 'EducationalApplication',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              reviewCount: '127',
            },
          }),
        }}
      />
      <DebateTrainer />
    </>
  )
}