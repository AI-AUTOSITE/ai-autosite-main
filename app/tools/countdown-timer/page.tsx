import { Metadata } from 'next'
import CountdownTimerClient from './components/CountdownTimerClient'
export const metadata: Metadata = {
  title: 'Free Countdown Timer - No Ads, No Sign Up | AI AutoSite',
  description: 'Create event countdown timers instantly. 100% free, no ads, no tracking. Embed anywhere.',
  keywords: 'free countdown timer, no ads, event timer, privacy, no sign up, no tracking',
  openGraph: {
    title: 'Countdown Timer - Truly Free, No Ads Ever',
    description: 'Zero ads, zero tracking. Create countdown timers that work everywhere.',
    type: 'website',
    images: [{
      url: '/og-countdown-timer.png',
      width: 1200,
      height: 630,
      alt: 'Free Countdown Timer - No Ads'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Countdown Timer - Free Forever',
    description: 'Event timers without ads or tracking.'
  }
}

export default function CountdownTimerPage() {
  return <CountdownTimerClient />
}