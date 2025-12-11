import { Metadata } from 'next'
import MetaTagGeneratorClient from './components/MetaTagGeneratorClient'

export const metadata: Metadata = {
  title: 'Meta Tag Generator - SEO Meta Tags with OG & Twitter | AI AutoSite',
  description: 'Generate SEO meta tags, Open Graph, and Twitter cards for your website. Live preview and one-click copy. 100% private, browser-based.',
  keywords: 'meta tag generator, seo tags, open graph generator, twitter card, og tags, meta description',
  openGraph: { title: 'Meta Tag Generator - Free SEO Tool', description: 'Generate complete meta tags with OG and Twitter cards.' },
  twitter: { card: 'summary_large_image', title: 'Meta Tag Generator' },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://ai-autosite.com/tools/meta-tag-generator' },
}

export default function MetaTagGeneratorPage() {
  return <MetaTagGeneratorClient />
}
