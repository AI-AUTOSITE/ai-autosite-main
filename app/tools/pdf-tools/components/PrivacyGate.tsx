// pdf-tools/components/PrivacyGate.tsx

import React, { useState } from 'react'
import { PrivacyGateConfig } from '../types/privacy'

export const PrivacyGate: React.FC<PrivacyGateConfig> = ({
  destination,
  fileInfo,
  onConfirm,
  onCancel,
}) => {
  const [understood, setUnderstood] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} bytes`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const getPrivacyImpact = (score: number) => {
    if (score >= 8) return { level: 'Low', color: 'text-green-500', bg: 'bg-green-50' }
    if (score >= 5) return { level: 'Medium', color: 'text-yellow-500', bg: 'bg-yellow-50' }
    return { level: 'High', color: 'text-orange-500', bg: 'bg-orange-50' }
  }

  const impact = getPrivacyImpact(destination.privacyScore)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Privacy Notice</h2>
          <p className="text-sm text-gray-500 mt-1">Please review before sharing your file</p>
        </div>

        {/* Visual Flow Diagram */}
        <div className="px-6 py-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-2">
                📄
              </div>
              <span className="text-xs font-medium">Your PDF</span>
              <div className="text-xs text-gray-500">{fileInfo.name}</div>
            </div>

            <div className="flex-1 max-w-[100px]">
              <div className="h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-2 text-xs text-gray-500">Direct</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-2">
                🌐
              </div>
              <span className="text-xs font-medium">Your Browser</span>
              <div className="text-xs text-gray-500">Local</div>
            </div>

            <div className="flex-1 max-w-[100px]">
              <div className="h-0.5 bg-gradient-to-r from-purple-400 to-orange-400 relative animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-2 text-xs text-orange-500">⚠️ External</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div
                className={`w-16 h-16 ${impact.bg} rounded-full flex items-center justify-center shadow-md mb-2 ring-2 ring-orange-300`}
              >
                <span className="text-2xl">{destination.icon}</span>
              </div>
              <span className="text-xs font-medium">{destination.name}</span>
              <div className="text-xs text-gray-500">External Service</div>
            </div>
          </div>
        </div>

        {/* Transparency Details */}
        <div className="px-6 py-4">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 text-gray-500 font-medium w-1/3">Destination Service:</td>
                <td className="py-3 font-semibold">{destination.name}</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-500 font-medium">Actual URL:</td>
                <td className="py-3">
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">{destination.url}</code>
                </td>
              </tr>
              <tr>
                <td className="py-3 text-gray-500 font-medium">File to be sent:</td>
                <td className="py-3">
                  {fileInfo.name} ({formatFileSize(fileInfo.size)})
                </td>
              </tr>
              <tr>
                <td className="py-3 text-gray-500 font-medium">Through our server:</td>
                <td className="py-3">
                  <span className="text-green-600 font-semibold flex items-center gap-1">
                    <span>❌</span> No - Direct connection only
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 text-gray-500 font-medium">We can see your data:</td>
                <td className="py-3">
                  <span className="text-green-600 font-semibold flex items-center gap-1">
                    <span>❌</span> No - End-to-end transfer
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 text-gray-500 font-medium">Privacy Impact:</td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 max-w-[200px]">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${
                            destination.privacyScore >= 8
                              ? 'from-green-400 to-green-500'
                              : destination.privacyScore >= 5
                                ? 'from-yellow-400 to-yellow-500'
                                : 'from-orange-400 to-orange-500'
                          }`}
                          style={{ width: `${destination.privacyScore * 10}%` }}
                        />
                      </div>
                    </div>
                    <span className={`font-semibold ${impact.color}`}>{impact.level}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Warning Message */}
          {destination.warning && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">⚠️</span>
                <div>
                  <p className="text-sm text-yellow-800 font-medium">Important:</p>
                  <p className="text-sm text-yellow-700 mt-1">{destination.warning}</p>
                </div>
              </div>
            </div>
          )}

          {/* Additional Details (Collapsible) */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            {showDetails ? '▼' : '▶'} Technical Details
          </button>

          {showDetails && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <pre className="text-xs text-gray-600 font-mono whitespace-pre-wrap">
                {`// What happens when you confirm:
1. Your browser creates a direct connection to ${destination.name}
2. The PDF file is transmitted directly from your device
3. Our servers are NOT involved in this transfer
4. We do NOT receive or store any of your data
5. The connection uses HTTPS encryption
6. Once sent, ${destination.name} controls the data

// Network request preview:
fetch('${destination.url}', {
  method: 'POST',
  body: yourPDFFile,
  headers: {
    'Content-Type': '${fileInfo.type}'
  }
})`}
              </pre>
            </div>
          )}
        </div>

        {/* Confirmation Checkbox */}
        <div className="px-6 py-4 bg-gray-50">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={understood}
              onChange={(e) => setUnderstood(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm text-gray-700">
              I understand that my file will leave my device and be sent directly to{' '}
              {destination.name}. This tool's developers cannot see or access my data during this
              transfer.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            Stay Private
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              Privacy Score: {destination.privacyScore}/10
            </span>
            <button
              onClick={onConfirm}
              disabled={!understood}
              className={`px-6 py-2 font-medium rounded-lg transition-all ${
                understood
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue to {destination.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
