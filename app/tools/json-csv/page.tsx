import { Metadata } from 'next'
import JsonCsvClient from './components/JsonCsvClient'

export const metadata: Metadata = {
  title: 'JSON to CSV Converter - Free Online Tool | AI AutoSite',
  description: 'Convert JSON to CSV instantly. Transform JSON data into spreadsheet format. Free online converter.',
  keywords: 'json to csv, json converter, csv converter, data conversion, json to excel',
  openGraph: {
    title: 'JSON to CSV - Free Converter',
    description: 'Convert JSON data to CSV format instantly',
    type: 'website',
  },
}

export default function JsonCsvPage() {
  return <JsonCsvClient />
}