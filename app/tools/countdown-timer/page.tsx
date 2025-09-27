import { Metadata } from 'next'
import CountdownTimerClient from './components/CountdownTimerClient'

export const metadata: Metadata = {
  title: 'Countdown Timer Generator - Event Countdowns | AI AutoSite',
  description: 'Create countdown timers for your events. Generate embeddable countdown code for websites. Free timer maker.',
  keywords: 'countdown timer, event countdown, timer generator, countdown widget, embeddable timer',
  openGraph: {
    title: 'Countdown Timer Generator - Free Tool',
    description: 'Create event countdown timers',
    type: 'website',
  },
}

export default function CountdownTimerPage() {
  return <CountdownTimerClient />
}