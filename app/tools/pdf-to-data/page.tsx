import { Metadata } from 'next'
import PdfToDataTool from './components/PdfToDataTool'

export const metadata: Metadata = {
  title: 'PDF to CSV/Excel Converter - Extract Data from PDFs | AI AutoSite',
  description: 'Extract tables and structured data from PDF files instantly. Convert to CSV or Excel format. AI-powered data extraction with no signup required.',
  keywords: 'PDF to CSV, PDF to Excel, PDF converter, table extraction, data extraction, AI data extraction',
  openGraph: {
    title: 'PDF to CSV/Excel Converter - Free Online Tool',
    description: 'Extract structured data from PDFs and download as CSV or Excel. AI-powered, privacy-focused.',
    type: 'website',
  }
}

export default function PdfToDataPage() {
  return <PdfToDataTool />
}