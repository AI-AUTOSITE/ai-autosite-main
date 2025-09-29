
import { Metadata } from 'next'
import UnitConverterClient from './components/UnitConverterClient'

export const metadata: Metadata = {
  title: 'Unit Converter - Length, Weight, Temperature | AI AutoSite',
  description: 'Convert units instantly. Length, weight, temperature, volume. Free online converter for metric and imperial.',
  keywords: 'unit converter, metric converter, imperial converter, length converter, weight converter',
  openGraph: {
    title: 'Unit Converter - Free Online Tool',
    description: 'Convert any measurement instantly',
    type: 'website',
  },
}

export default function UnitConverterPage() {
  return <UnitConverterClient />
}