import { Metadata } from 'next'
import CronGeneratorClient from './components/CronGeneratorClient'

export const metadata: Metadata = {
  title: 'Cron Expression Generator - Build Cron Jobs Online | AI AutoSite',
  description: 'Build and understand cron expressions with visual builder and human-readable explanations. See next run times instantly. 100% private, browser-based.',
  keywords: 'cron generator, crontab, cron expression, cron schedule, cron builder, crontab guru alternative',
  openGraph: { title: 'Cron Expression Generator - Free Online Tool', description: 'Build cron schedules with visual builder and see next runs. No tracking.', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Cron Generator - Free & Private' },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://ai-autosite.com/tools/cron-generator' },
}

export default function CronGeneratorPage() {
  return <CronGeneratorClient />
}
