import { Metadata } from 'next'
import GradientGeneratorClient from './components/GradientGeneratorClient'

export const metadata: Metadata = {
  title: 'Gradient Generator - CSS Gradients | AI AutoSite',
  description: 'Create beautiful CSS gradients for your website. Linear and radial gradients with live preview. Free gradient maker.',
  keywords: 'gradient generator, css gradient, linear gradient, radial gradient, color gradient',
  openGraph: {
    title: 'Gradient Generator - Free Tool',
    description: 'Create beautiful CSS gradients instantly',
    type: 'website',
  },
}

export default function GradientGeneratorPage() {
  return <GradientGeneratorClient />
}