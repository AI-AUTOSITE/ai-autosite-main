// app/components/automation/AutomationFooter.tsx

import Link from 'next/link'
import { Mail, Shield, Clock, DollarSign } from 'lucide-react'

export default function AutomationFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-emerald-400">
              Automation Consulting
            </h3>
            <p className="text-gray-300 text-sm">
              Transform your business with custom chatbots and automation solutions. 
              First 5 clients special pricing available.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/automation" className="text-gray-300 hover:text-emerald-400 text-sm transition-colors">
                  Automation Home
                </Link>
              </li>
              <li>
                <Link href="/automation/demos/cafe-chatbot" className="text-gray-300 hover:text-emerald-400 text-sm transition-colors">
                  Try Demo
                </Link>
              </li>
              <li>
                <Link href="/automation/pricing" className="text-gray-300 hover:text-emerald-400 text-sm transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/automation/first-5-clients" className="text-gray-300 hover:text-emerald-400 text-sm transition-colors">
                  Special Offer
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li className="text-gray-300 text-sm">☕ Cafe Chatbots</li>
              <li className="text-gray-300 text-sm">📊 Excel Automation</li>
              <li className="text-gray-300 text-sm">⚡ Workflow Automation</li>
              <li className="text-gray-300 text-sm">🤖 Custom Solutions</li>
            </ul>
          </div>

          {/* Contact & Trust */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Why Choose Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Shield className="w-4 h-4 text-green-400" />
                <span>60-Day Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>3-5 Week Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <DollarSign className="w-4 h-4 text-yellow-400" />
                <span>No Hidden Costs</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Mail className="w-4 h-4 text-purple-400" />
                <span>Weekly Updates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-400">
                © {currentYear} AI AutoSite - Automation Consulting. All rights reserved.
              </p>
            </div>
            
            <div className="flex gap-6">
              <Link href="/terms-of-service" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                Terms
              </Link>
              <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                Privacy
              </Link>
              <Link href="/contact" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-sm text-white">
            <span>🎯</span>
            <span className="font-medium">First 5 Clients Special: Save $1,700</span>
            <Link 
              href="/automation/first-5-clients" 
              className="underline hover:no-underline ml-2"
            >
              Claim Your Spot →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}