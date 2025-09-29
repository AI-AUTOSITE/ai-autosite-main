
import { Metadata } from 'next'
import PasswordGeneratorClient from './components/PasswordGeneratorClient'

export const metadata: Metadata = {
  title: 'Password Generator - Create Strong Passwords | AI AutoSite',
  description: 'Generate secure passwords instantly. Customize length and characters. Free online password creator.',
  keywords: 'password generator, strong password, secure password, random password, password creator',
  openGraph: {
    title: 'Password Generator - Free & Secure',
    description: 'Create strong passwords instantly',
    type: 'website',
  },
}

export default function PasswordGeneratorPage() {
  return <PasswordGeneratorClient />
}