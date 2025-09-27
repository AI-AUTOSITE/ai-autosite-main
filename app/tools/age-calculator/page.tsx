import { Metadata } from 'next'
import AgeCalculatorClient from './components/AgeCalculatorClient'

export const metadata: Metadata = {
  title: 'Age Calculator - Calculate Your Age | AI AutoSite',
  description: 'Calculate your exact age in years, months, and days. Find out how many days until your next birthday.',
  keywords: 'age calculator, birthday calculator, how old am i, days old, age in days',
  openGraph: {
    title: 'Age Calculator - Free Online Tool',
    description: 'Calculate your exact age and fun facts',
    type: 'website',
  },
}

export default function AgeCalculatorPage() {
  return <AgeCalculatorClient />
}