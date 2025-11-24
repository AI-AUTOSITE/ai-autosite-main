// ============================================
// Content Input Component
// ============================================

import { Eye, EyeOff } from 'lucide-react'
import { QRType, WiFiData, VCardData } from '../lib/types'
import { MAX_TEXT_LENGTH } from '../lib/constants'

interface ContentInputProps {
  qrType: QRType
  textInput: string
  wifiData: WiFiData
  vcardData: VCardData
  showPassword: boolean
  onTextChange: (text: string) => void
  onWifiChange: (data: WiFiData) => void
  onVcardChange: (data: VCardData) => void
  onShowPasswordChange: (show: boolean) => void
  onLoadExample: () => void
  onClear: () => void
}

export function ContentInput({
  qrType,
  textInput,
  wifiData,
  vcardData,
  showPassword,
  onTextChange,
  onWifiChange,
  onVcardChange,
  onShowPasswordChange,
  onLoadExample,
  onClear,
}: ContentInputProps) {
  const inputClass = `w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white 
                      placeholder-gray-500 focus:outline-none focus:border-cyan-400 text-sm`

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
      {/* Text/URL Input */}
      {(qrType === 'text' || qrType === 'url') && (
        <div>
          <textarea
            value={textInput}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder={qrType === 'url' ? 'https://example.com' : 'Enter any text...'}
            className={`${inputClass} h-24 resize-none font-mono`}
            maxLength={MAX_TEXT_LENGTH}
            spellCheck={false}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-400">{textInput.length}/{MAX_TEXT_LENGTH}</span>
            <div className="flex gap-2">
              <button
                onClick={onLoadExample}
                className="px-3 py-1.5 text-xs bg-white/5 text-gray-300 rounded-lg hover:bg-white/10"
              >
                Example
              </button>
              <button
                onClick={onClear}
                className="px-3 py-1.5 text-xs bg-white/5 text-gray-300 rounded-lg hover:bg-white/10"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WiFi Input */}
      {qrType === 'wifi' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Network Name (SSID)</label>
            <input
              type="text"
              value={wifiData.ssid}
              onChange={(e) => onWifiChange({ ...wifiData, ssid: e.target.value })}
              placeholder="MyNetwork"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={wifiData.password}
                onChange={(e) => onWifiChange({ ...wifiData, password: e.target.value })}
                placeholder="••••••••"
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => onShowPasswordChange(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Security</label>
              <select
                value={wifiData.encryption}
                onChange={(e) => onWifiChange({ ...wifiData, encryption: e.target.value as WiFiData['encryption'] })}
                className={inputClass}
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer w-full">
                <input
                  type="checkbox"
                  checked={wifiData.hidden}
                  onChange={(e) => onWifiChange({ ...wifiData, hidden: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-xs text-gray-300">Hidden</span>
              </label>
            </div>
          </div>
          <button
            onClick={onLoadExample}
            className="w-full py-2 text-xs bg-white/5 text-gray-300 rounded-lg hover:bg-white/10"
          >
            Load Example
          </button>
        </div>
      )}

      {/* vCard Input */}
      {qrType === 'vcard' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">First Name</label>
              <input
                type="text"
                value={vcardData.firstName}
                onChange={(e) => onVcardChange({ ...vcardData, firstName: e.target.value })}
                placeholder="John"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Last Name</label>
              <input
                type="text"
                value={vcardData.lastName}
                onChange={(e) => onVcardChange({ ...vcardData, lastName: e.target.value })}
                placeholder="Doe"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={vcardData.email}
              onChange={(e) => onVcardChange({ ...vcardData, email: e.target.value })}
              placeholder="john@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Phone</label>
            <input
              type="tel"
              value={vcardData.phone}
              onChange={(e) => onVcardChange({ ...vcardData, phone: e.target.value })}
              placeholder="+1234567890"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Company</label>
              <input
                type="text"
                value={vcardData.company}
                onChange={(e) => onVcardChange({ ...vcardData, company: e.target.value })}
                placeholder="Company"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Title</label>
              <input
                type="text"
                value={vcardData.title}
                onChange={(e) => onVcardChange({ ...vcardData, title: e.target.value })}
                placeholder="Developer"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Website</label>
            <input
              type="url"
              value={vcardData.website}
              onChange={(e) => onVcardChange({ ...vcardData, website: e.target.value })}
              placeholder="https://example.com"
              className={inputClass}
            />
          </div>
          <button
            onClick={onLoadExample}
            className="w-full py-2 text-xs bg-white/5 text-gray-300 rounded-lg hover:bg-white/10"
          >
            Load Example
          </button>
        </div>
      )}
    </div>
  )
}
