import { Metadata } from 'next'
import FaviconGeneratorClient from './components/FaviconGeneratorClient'

export const metadata: Metadata = {
  title: 'Favicon Generator - All Sizes & Formats | AI AutoSite',
  description: 'Generate favicons for your website. Create all favicon sizes from one image. Free favicon maker with HTML code.',
  keywords: 'favicon generator, ico creator, website icon, favicon maker, site icon generator',
  openGraph: {
    title: 'Favicon Generator - Free Tool',
    description: 'Create all favicon sizes instantly',
    type: 'website',
  },
}

export default function FaviconGeneratorPage() {
  return <FaviconGeneratorClient />
}