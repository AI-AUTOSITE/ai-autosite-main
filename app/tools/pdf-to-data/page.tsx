import { Metadata } from 'next'
import PdfToDataTool from './components/PdfToDataTool'

export const metadata: Metadata = {
  title: 'PDF to Data - Extract Tables to CSV/Excel | AI AutoSite',
  description: 'Drop PDF, get CSV and Excel instantly. AI-powered table extraction.',
  keywords: 'PDF to CSV, PDF to Excel, table extraction',
}

export default function PdfToDataPage() {
  return <PdfToDataTool />
}