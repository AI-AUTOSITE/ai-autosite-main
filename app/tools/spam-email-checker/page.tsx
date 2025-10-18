import { Metadata } from 'next'
import SpamEmailCheckerClient from './components/SpamEmailCheckerClient'

export const metadata: Metadata = {
  title: 'Spam Email Checker - Check Suspicious Emails Before Opening | AI AutoSite',
  description:
    'Check email addresses for phishing and spam before opening. Detect typosquatting, suspicious domains, and fraud attempts. 100% free, works offline, no data stored.',
  keywords: 'spam checker, email safety, phishing detector, email security, typosquatting, fraud detection, suspicious email, scam checker, privacy, no tracking',
  openGraph: {
    title: 'Spam Email Checker - Protect Yourself from Phishing',
    description: 'Check suspicious email addresses instantly. Detect phishing attempts before opening emails. 100% private.',
    type: 'website',
    images: [
      {
        url: '/og-spam-email-checker.png',
        width: 1200,
        height: 630,
        alt: 'Spam Email Checker - Email Safety Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spam Email Checker - Stay Safe Online',
    description: 'Check email safety before opening. Detect phishing and fraud attempts instantly.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/spam-email-checker',
  },
}

export default function SpamEmailCheckerPage() {
  return <SpamEmailCheckerClient />
}