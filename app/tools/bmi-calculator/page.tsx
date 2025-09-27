import { Metadata } from 'next'
import BmiCalculatorClient from './components/BmiCalculatorClient'

export const metadata: Metadata = {
  title: 'BMI Calculator - Body Mass Index | AI AutoSite',
  description: 'Calculate your BMI (Body Mass Index) instantly. Free BMI calculator with imperial and metric units.',
  keywords: 'bmi calculator, body mass index, health calculator, weight calculator, bmi chart',
  openGraph: {
    title: 'BMI Calculator - Free Online Tool',
    description: 'Calculate your Body Mass Index instantly',
    type: 'website',
  },
}

export default function BmiCalculatorPage() {
  return <BmiCalculatorClient />
}