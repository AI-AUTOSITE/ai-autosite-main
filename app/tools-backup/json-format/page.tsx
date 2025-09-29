import { Metadata } from 'next'
import JsonFormatClient from './components/JsonFormatClient'

export const metadata: Metadata = {
  title: 'JSON Format - Pretty & Small | AI AutoSite',
  description: 'Format JSON online. Make it pretty or small. Free tool with error checking. Works offline.',
  keywords: 'json format, json pretty, json small, json tool, format json online',
  openGraph: {
    title: 'JSON Format - Free Online Tool',
    description: 'Make your JSON pretty or small instantly',
    type: 'website',
  },
}

export default function JsonFormatPage() {
  return <JsonFormatClient />
}