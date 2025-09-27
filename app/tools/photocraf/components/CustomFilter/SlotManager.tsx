'use client'

import React, { useState } from 'react'
import { useSlots } from '../../contexts/SlotContext'
import { PLAN_CONFIGS } from '../../types'

export default function SlotManager() {
  const { slotState, upgradePlan, getRemainingSlots } = useSlots()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const remaining = getRemainingSlots()

  const handleUpgrade = (plan: 'starter' | 'pro' | 'unlimited') => {
    upgradePlan(plan)
    setShowUpgradeModal(false)
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <div className="flex items-center px-3 py-1 bg-gray-800 rounded">
          <span className="text-xs text-gray-400">Slots:</span>
          <span className="ml-2 text-sm font-medium">
            {slotState.usedSlots} / {slotState.maxSlots === Infinity ? '∞' : slotState.maxSlots}
          </span>
        </div>
        
        {slotState.plan === 'free' && (
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Upgrade
          </button>
        )}

        <div className="px-2 py-1 bg-gray-800 rounded">
          <span className="text-xs font-medium text-purple-400">
            {slotState.plan.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Upgrade Your Plan</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Starter Plan */}
              <div className="bg-gray-800 rounded p-4">
                <h3 className="text-lg font-bold text-purple-400 mb-2">Starter</h3>
                <p className="text-2xl font-bold mb-4">$4.99<span className="text-sm text-gray-500">/mo</span></p>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    10 Custom Slots
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    4K Resolution
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    No Watermark
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    All Basic Filters
                  </li>
                </ul>
                <button
                  onClick={() => handleUpgrade('starter')}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                  Choose Plan
                </button>
              </div>

              {/* Pro Plan */}
              <div className="bg-gray-800 rounded p-4 ring-2 ring-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-purple-400">Pro</h3>
                  <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">Popular</span>
                </div>
                <p className="text-2xl font-bold mb-4">$14.99<span className="text-sm text-gray-500">/mo</span></p>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    30 Custom Slots
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    8K Resolution
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    Batch Processing
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    Cloud Storage 10GB
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    Priority Processing
                  </li>
                </ul>
                <button
                  onClick={() => handleUpgrade('pro')}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                  Choose Plan
                </button>
              </div>

              {/* Unlimited Plan */}
              <div className="bg-gray-800 rounded p-4">
                <h3 className="text-lg font-bold text-purple-400 mb-2">Unlimited</h3>
                <p className="text-2xl font-bold mb-4">$29.99<span className="text-sm text-gray-500">/mo</span></p>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    Unlimited Slots
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    Unlimited Resolution
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    Cloud Storage 100GB
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    API Access
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    Priority Support
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    Commercial License
                  </li>
                </ul>
                <button
                  onClick={() => handleUpgrade('unlimited')}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                  Choose Plan
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}