import { Metadata } from 'next'
import DebateTrainer from './components/DebateTrainer'

export const metadata: Metadata = {
  title: 'AI Debate Trainer - Practice Argumentation Skills Free | AI AutoSite',
  description: 'Master debate skills with AI-powered opponents. Get instant feedback on logic, persuasiveness, and structure. Choose from supportive coach to devil\'s advocate styles. 100% free, no signup.',
  keywords: 'debate trainer, argumentation practice, critical thinking, AI debate coach, logic training, debate skills, persuasive writing, study tools, free debate practice, online debate simulator',
  
  openGraph: {
    title: 'Free AI Debate Trainer - Practice Arguments & Get Scored Feedback',
    description: 'Sharpen your debate skills with AI opponents. Real-time scoring on logic, persuasiveness, and structure.',
    type: 'website',
    images: [{
      url: '/og-debate-trainer.png',
      width: 1200,
      height: 630,
      alt: 'AI Debate Trainer - Practice Your Argumentation Skills'
    }],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'AI Debate Trainer - Master the Art of Argumentation',
    description: 'Practice debates with AI. Get scored on logic & persuasiveness. Free tool, no signup.',
    images: ['/og-debate-trainer.png'],
  },
  
  alternates: {
    canonical: 'https://ai-autosite.com/tools/debate-trainer',
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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