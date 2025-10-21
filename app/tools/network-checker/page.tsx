// app/tools/network-checker/page.tsx
import { Metadata } from 'next'
import NetworkCheckerClient from './components/NetworkCheckerClient'

export const metadata: Metadata = {
  title: 'Network Connection Checker - Fix Device Connection Problems | AI AutoSite',
  description:
    'Find out why devices can\'t connect. Simple network troubleshooting for offices and homes. Check IP addresses in 60 seconds.',
  keywords: 'network checker, ip address checker, connection problems, network troubleshoot, device connection, lan checker',
  openGraph: {
    title: 'Network Checker - Fix Connection Issues Fast',
    description: 'Can\'t connect two devices? Find out why in 60 seconds.',
    type: 'website',
    images: [
      {
        url: '/og-network-checker.png',
        width: 1200,
        height: 630,
        alt: 'Network Connection Checker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Network Checker - Simple Troubleshooting',
    description: 'Find connection problems between devices quickly.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/network-checker',
  },
}

export default function NetworkCheckerPage() {
  return <NetworkCheckerClient />
}