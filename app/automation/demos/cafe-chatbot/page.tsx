  // app/automation/demos/cafe-chatbot/page.tsx
'use client'

import { useState } from 'react'
import Container from '@/components/Container'
import Link from 'next/link'
import MultiStyleChatButton, { ChatButtonStyle } from '@/components/automation/chat/MultiStyleChatButton'
import { getRuleCafeScenario } from '@/lib/automation-data/rule-cafe'
import { ArrowLeft, Coffee, Clock, MapPin, Wifi, Power, Monitor, Sparkles } from 'lucide-react'

export default function CafeChatbotDemoPage() {
  const [buttonStyle, setButtonStyle] = useState<ChatButtonStyle>('peekWide')
  const ruleCafeScenario = getRuleCafeScenario()

  return (
    <>
      {/* Main page content */}
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Header Navigation */}
        <div className="bg-white border-b border-gray-200">
          <Container>
            <div className="py-4 flex items-center justify-between">
              <Link 
                href="/automation"
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Automation Hub
              </Link>
              
              <div className="flex items-center gap-4">
                <Link
                  href="/automation/pricing"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Pricing
                </Link>
                <Link
                  href="/automation/first-5-clients"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:shadow-lg transition-shadow"
                >
                  Get Special Offer
                </Link>
              </div>
            </div>
          </Container>
        </div>

        <Container>
          {/* Hero Section */}
          <div className="py-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span>Live Demo - Try It Now</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Signal Cafe
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-3">
              Experience Our Cafe Reservation Chatbot
            </p>
            
            <p className="text-lg text-gray-500 mb-8">
              Premium Coffee & Relaxing Space | 123 Broadway, New York, NY 10012
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>Canal St Station (N, Q, R, W, 6)</span>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                📧 Contact Information
              </h3>
              <p className="text-gray-600 mb-2 flex items-center gap-2">
                <span>📞</span> (212) 555-0123
              </p>
              <p className="text-gray-600 mb-2">
                📧 contact@signalcafenyc.demo
              </p>
              <p className="text-sm text-gray-500">Mon-Fri: 8:00 AM - 8:00 PM EST</p>
              <p className="text-sm text-gray-500">Sat-Sun: 9:00 AM - 7:00 PM EST</p>
            </div>
            
            {/* Business Hours */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                <Clock className="inline w-5 h-5 mb-1 mr-1" />
                Business Hours
              </h3>
              <p className="text-gray-600 mb-1">Mon-Fri: 8:00 AM - 8:00 PM</p>
              <p className="text-gray-600 mb-2">Sat-Sun: 9:00 AM - 7:00 PM</p>
              <p className="text-sm text-gray-500">Closed: New Year holidays only</p>
            </div>
            
            {/* Features */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                ✨ Cafe Features
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600 flex items-center gap-2">
                  <Wifi className="w-4 h-4" /> Free Wi-Fi
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <Power className="w-4 h-4" /> Power outlets at every seat
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <Monitor className="w-4 h-4" /> Remote work friendly
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-2xl p-12 text-center text-white mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Try Our Chatbot Reservation System!
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Click the <strong className="bg-white/20 px-3 py-1 rounded">💬 Chat Button</strong> 
              in the bottom right to experience 24/7 automated reservations
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-bold mb-1">Instant Response</h3>
                <p className="text-sm text-white/80">No waiting, immediate answers</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-2xl mb-2">📅</div>
                <h3 className="font-bold mb-1">Easy Booking</h3>
                <p className="text-sm text-white/80">Visual calendar selection</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-2xl mb-2">🕐</div>
                <h3 className="font-bold mb-1">24/7 Available</h3>
                <p className="text-sm text-white/80">Book anytime, even after hours</p>
              </div>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-6 max-w-4xl mx-auto mb-16">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🎭</span>
              <div>
                <h3 className="font-bold text-amber-800 text-lg mb-2">
                  This is a Demo Environment
                </h3>
                <p className="text-amber-700 leading-relaxed">
                  This is a <strong>fully functional chatbot reservation demo</strong>. 
                  No actual bookings will be made, but you can experience all features.
                  <strong className="block mt-2">
                    Click the 💬 button in the bottom right to start!
                  </strong>
                </p>
              </div>
            </div>
          </div>

          {/* Chat Button Style Selector */}
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full">
                <Sparkles className="w-4 h-4" />
                <span>Try Different Styles</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
                🎨 Choose Your Chat Button Style
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Click on any style below to see it in action on the bottom right!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Simple Circle */}
              <button
                onClick={() => setButtonStyle('simple')}
                className={`p-4 sm:p-6 rounded-xl border-2 transition-all hover:scale-105 text-left ${
                  buttonStyle === 'simple'
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-lg sm:text-lg sm:text-xl">
                    💬
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-900">Simple Circle</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500">Classic & Clean</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Minimalist design with pulse animation
                </p>
                {buttonStyle === 'simple' && (
                  <div className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-indigo-600">
                    ✓ Currently Active
                  </div>
                )}
              </button>

              {/* Expandable */}
              <button
                onClick={() => setButtonStyle('expandable')}
                className={`p-4 sm:p-6 rounded-xl border-2 transition-all hover:scale-105 text-left ${
                  buttonStyle === 'expandable'
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-sm">💬→</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-900">Expandable</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500">2024 Trend 🔥</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Expands on hover to show text
                </p>
                {buttonStyle === 'expandable' && (
                  <div className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-indigo-600">
                    ✓ Currently Active
                  </div>
                )}
              </button>

              {/* Bubble */}
              <button
                onClick={() => setButtonStyle('bubble')}
                className={`p-4 sm:p-6 rounded-xl border-2 transition-all hover:scale-105 text-left ${
                  buttonStyle === 'bubble'
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-12 h-12 bg-white border-2 border-indigo-300 rounded-2xl flex items-center justify-center text-lg sm:text-xl">
                    💭
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-900">Message Bubble</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500">Friendly & Warm</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Speech bubble with greeting text
                </p>
                {buttonStyle === 'bubble' && (
                  <div className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-indigo-600">
                    ✓ Currently Active
                  </div>
                )}
              </button>

              {/* Bar */}
              <button
                onClick={() => setButtonStyle('bar')}
                className={`p-4 sm:p-6 rounded-xl border-2 transition-all hover:scale-105 text-left ${
                  buttonStyle === 'bar'
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-lg sm:text-xl">
                    📱
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-900">Floating Bar</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500">Professional</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Horizontal bar with status info
                </p>
                {buttonStyle === 'bar' && (
                  <div className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-indigo-600">
                    ✓ Currently Active
                  </div>
                )}
              </button>

              {/* Cafe Theme */}
              <button
                onClick={() => setButtonStyle('cafe')}
                className={`p-4 sm:p-6 rounded-xl border-2 transition-all hover:scale-105 text-left ${
                  buttonStyle === 'cafe'
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-lg sm:text-xl">
                    ☕
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-900">Cafe Theme</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500">Custom Brand</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Warm colors for cafe business
                </p>
                {buttonStyle === 'cafe' && (
                  <div className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-indigo-600">
                    ✓ Currently Active
                  </div>
                )}
              </button>

              {/* Side Tab */}
              <button
                onClick={() => setButtonStyle('sideTab')}
                className={`p-4 sm:p-6 rounded-xl border-2 transition-all hover:scale-105 text-left ${
                  buttonStyle === 'sideTab'
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-lg sm:text-xl">
                    📑
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-900">Side Tab</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500">Minimal & Smart</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Vertical tab on the right edge
                </p>
                {buttonStyle === 'sideTab' && (
                  <div className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-indigo-600">
                    ✓ Currently Active
                  </div>
                )}
              </button>

              {/* Docked Panel */}
              <button
                onClick={() => setButtonStyle('docked')}
                className={`p-4 sm:p-6 rounded-xl border-2 transition-all hover:scale-105 text-left ${
                  buttonStyle === 'docked'
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-indigo-300 rounded-lg flex items-center justify-center text-lg sm:text-xl">
                    📌
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-900">Docked Panel</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500">Elegant</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Always visible, slides out on hover
                </p>
                {buttonStyle === 'docked' && (
                  <div className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-indigo-600">
                    ✓ Currently Active
                  </div>
                )}
              </button>

              {/* Corner Peek */}
              <button
                onClick={() => setButtonStyle('peek')}
                className={`p-4 sm:p-6 rounded-xl border-2 transition-all hover:scale-105 text-left ${
                  buttonStyle === 'peek'
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-tl from-indigo-500 to-purple-600 rounded-tl-2xl flex items-center justify-center text-lg sm:text-xl">
                    👀
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-900">Corner Peek</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500">Subtle</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Peeks from bottom-right corner
                </p>
                {buttonStyle === 'peek' && (
                  <div className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-indigo-600">
                    ✓ Currently Active
                  </div>
                )}
              </button>

              {/* Corner Peek Wide */}
              <button
                onClick={() => setButtonStyle('peekWide')}
                className={`p-4 sm:p-6 rounded-xl border-2 transition-all hover:scale-105 text-left ${
                  buttonStyle === 'peekWide'
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-tl from-indigo-500 to-purple-600 rounded-tl-2xl flex items-center justify-center text-lg sm:text-xl relative">
                    <span className="absolute inset-0 flex items-center justify-center">➡️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-900">Corner Peek Wide</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500">Slim & Smart 🔥</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Horizontal slim bar from corner
                </p>
                {buttonStyle === 'peekWide' && (
                  <div className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-indigo-600">
                    ✓ Currently Active
                  </div>
                )}
              </button>

              {/* Full Width Bottom */}
              <button
                onClick={() => setButtonStyle('bottomFull')}
                className={`p-4 sm:p-6 rounded-xl border-2 transition-all hover:scale-105 text-left ${
                  buttonStyle === 'bottomFull'
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-lg sm:text-xl">
                    📊
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-900">Bottom Bar Full</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500">High Impact 🔥</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Full-width bottom notification bar
                </p>
                {buttonStyle === 'bottomFull' && (
                  <div className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-indigo-600">
                    ✓ Currently Active
                  </div>
                )}
              </button>

              {/* Floating Bottom */}
              <button
                onClick={() => setButtonStyle('bottomFloat')}
                className={`p-4 sm:p-6 rounded-xl border-2 transition-all hover:scale-105 text-left ${
                  buttonStyle === 'bottomFloat'
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-indigo-300 rounded-2xl flex items-center justify-center text-lg sm:text-xl">
                    🎈
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-900">Floating Bottom</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500">Elegant</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Floating bar at bottom center
                </p>
                {buttonStyle === 'bottomFloat' && (
                  <div className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-indigo-600">
                    ✓ Currently Active
                  </div>
                )}
              </button>

              {/* Expandable Bottom */}
              <button
                onClick={() => setButtonStyle('bottomExpand')}
                className={`p-4 sm:p-6 rounded-xl border-2 transition-all hover:scale-105 text-left ${
                  buttonStyle === 'bottomExpand'
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-lg sm:text-xl">
                    ⬆️
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-900">Bottom Expand</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500">Minimal</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Expands on hover at bottom
                </p>
                {buttonStyle === 'bottomExpand' && (
                  <div className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-indigo-600">
                    ✓ Currently Active
                  </div>
                )}
              </button>

              {/* Info Card */}
              <div className="p-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-center">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    💡 <strong>Tip:</strong> Hover over the button to see animations!
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    Each style can be customized to match your brand
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How to Use */}
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              💡 How to Use This Demo
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Click the Chat Button</h3>
                  <p className="text-gray-600">Look for the 💬 button in the bottom right corner</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Choose Your Action</h3>
                  <p className="text-gray-600">Select from reservations, menu, FAQ, or business hours</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Experience the Flow</h3>
                  <p className="text-gray-600">Complete a reservation and receive a QR confirmation code</p>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-gray-50 rounded-xl p-8 max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              🔧 Technical Implementation
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-700">Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="text-green-500">✓</span> Rule-based conversation flow
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="text-green-500">✓</span> Calendar date picker
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="text-green-500">✓</span> Time slot selection
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="text-green-500">✓</span> QR code generation
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="text-green-500">✓</span> Mobile responsive
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-700">Technology</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="text-blue-500">⚡</span> Next.js 14 + React 18
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="text-blue-500">⚡</span> TypeScript
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="text-blue-500">⚡</span> Tailwind CSS
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="text-blue-500">⚡</span> QR Code Library
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <span className="text-blue-500">⚡</span> No AI costs
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-emerald-100 rounded-lg">
              <p className="text-emerald-800 font-medium">
                💡 This is a rule-based chatbot demo. Perfect for businesses that need predictable, 
                fast responses without AI costs. Pricing: $2,800 (special offer) | Delivery: 3-5 weeks
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Want This for Your Business?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Get your own custom chatbot with your branding, features, and integrations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/automation/first-5-clients"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <Coffee className="w-5 h-5 mr-2" />
                Get Your Chatbot - $2,800
              </Link>
              <Link
                href="/automation/pricing"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View All Pricing Options
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Multi-Style Chat Button */}
      <MultiStyleChatButton
        scenarioData={ruleCafeScenario}
        botName="Signal Cafe Bot"
        style={buttonStyle}
      />
    </>
  )
}