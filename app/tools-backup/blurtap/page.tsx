import { Metadata } from 'next'
import BlurTapClient from './components/BlurTapClient'

export const metadata: Metadata = {
  title: 'BlurTap - Privacy Masking Tool | AI AutoSite',
  description: 'Hide sensitive information in images with black masks. 100% browser-based privacy protection tool. No uploads, instant masking.',
  keywords: 'privacy mask, blur tool, image censoring, sensitive data protection, browser-based editor',
  openGraph: {
    title: 'BlurTap - Privacy Masking Tool',
    description: 'Protect privacy by masking sensitive areas in images',
    type: 'website',
  }
}

export default function BlurTapPage() {
  return <BlurTapClient />
}