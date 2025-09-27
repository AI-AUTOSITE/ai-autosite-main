import { Metadata } from 'next'
import PercentageCalculatorClient from './components/PercentageCalculatorClient'

export const metadata: Metadata = {
  title: 'Percentage Calculator - Quick Percent Math | AI AutoSite',
  description: 'Calculate percentages instantly. Discounts, tips, percentage change, and more. Free online calculator.',
  keywords: 'percentage calculator, percent calculator, discount calculator, tip calculator, percentage change',
  openGraph: {
    title: 'Percentage Calculator - Free Online Tool',
    description: 'Quick and easy percentage calculations',
    type: 'website',
  },
}

export default function PercentageCalculatorPage() {
  return <PercentageCalculatorClient />
}