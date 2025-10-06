import React, { useState } from 'react'
import { Lock, Unlock, Eye, EyeOff } from 'lucide-react'

interface PasswordUIProps {
  onAddPassword: (options: any) => void
  onRemovePassword: (password: string) => void
  onCancel: () => void
  isProtected: boolean
}

export const PasswordUI: React.FC<PasswordUIProps> = ({
  onAddPassword,
  onRemovePassword,
  onCancel,
  isProtected,
}) => {
  const [mode, setMode] = useState<'add' | 'remove'>(isProtected ? 'remove' : 'add')
  const [userPassword, setUserPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [ownerPassword, setOwnerPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [permissions, setPermissions] = useState({
    printing: true,
    copying: true,
    modifying: false,
    annotating: true,
  })

  const handleAddPassword = () => {
    if (!userPassword) {
      alert('Please enter a password')
      return
    }

    if (userPassword !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    if (userPassword.length < 4) {
      alert('Password must be at least 4 characters')
      return
    }

    onAddPassword({
      userPassword,
      ownerPassword: ownerPassword || userPassword,
      permissions,
    })
  }

  const handleRemovePassword = () => {
    if (!userPassword) {
      alert('Please enter the password')
      return
    }

    onRemovePassword(userPassword)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-medium flex items-center gap-2">
            {mode === 'add' ? (
              <>
                <Lock className="w-5 h-5 text-cyan-500" />
                Add Password Protection
              </>
            ) : (
              <>
                <Unlock className="w-5 h-5 text-cyan-500" />
                Remove Password Protection
              </>
            )}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Mode Selector */}
        {!isProtected && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMode('add')}
              className={`flex-1 py-2 px-3 rounded ${
                mode === 'add' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              Add Password
            </button>
            <button
              onClick={() => setMode('remove')}
              className={`flex-1 py-2 px-3 rounded ${
                mode === 'remove' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              Remove Password
            </button>
          </div>
        )}

        {mode === 'add' ? (
          <div className="space-y-4">
            {/* User Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">User Password (Required)</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-cyan-500 pr-10"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-cyan-500"
                placeholder="Re-enter password"
              />
            </div>

            {/* Owner Password (Optional) */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Owner Password (Optional)</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={ownerPassword}
                onChange={(e) => setOwnerPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-cyan-500"
                placeholder="Leave blank to use user password"
              />
              <p className="text-xs text-gray-500 mt-1">
                Owner password allows full control over the PDF
              </p>
            </div>

            {/* Permissions */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Permissions</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={permissions.printing}
                    onChange={(e) => setPermissions({ ...permissions, printing: e.target.checked })}
                    className="rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
                  />
                  Allow printing
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={permissions.copying}
                    onChange={(e) => setPermissions({ ...permissions, copying: e.target.checked })}
                    className="rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
                  />
                  Allow copying text
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={permissions.modifying}
                    onChange={(e) =>
                      setPermissions({ ...permissions, modifying: e.target.checked })
                    }
                    className="rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
                  />
                  Allow modifying
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={permissions.annotating}
                    onChange={(e) =>
                      setPermissions({ ...permissions, annotating: e.target.checked })
                    }
                    className="rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
                  />
                  Allow annotations
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Remove Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Enter Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-cyan-500 pr-10"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter the password to unlock the PDF</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={mode === 'add' ? handleAddPassword : handleRemovePassword}
            className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-500 flex items-center justify-center gap-2"
          >
            {mode === 'add' ? (
              <>
                <Lock className="w-4 h-4" />
                Add Password
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                Remove Password
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
