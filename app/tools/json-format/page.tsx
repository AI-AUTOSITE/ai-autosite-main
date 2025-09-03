import { Metadata } from 'next'
import JsonBeautifyTool from './JsonBeautifyTool'

export const metadata: Metadata = {
  title: 'JSON Beautify - Format & Validate JSON | AI AutoSite',
  description: 'Beautify, minify, and validate JSON online. Free JSON formatter with syntax highlighting and error detection. Works offline.',
  keywords: 'json beautify, json formatter, json validator, json minify, json pretty print',
  openGraph: {
    title: 'JSON Beautify - Free JSON Formatter',
    description: 'Format, validate, and minify JSON instantly',
    type: 'website',
  }
}

export default function JsonFormatPage() {
  return <JsonBeautifyTool />
}