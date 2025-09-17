// app/tools/pdf-tools/features/password/PasswordUI.tsx
import React, { useState } from 'react';
import { Lock, Unlock, Shield, Copy, Eye, EyeOff } from 'lucide-react';

interface PasswordUIProps {
  onAddPassword: (options: any) => void;
  onRemovePassword: (password: string) => void;
  onCancel: () => void;
  isProtected?: boolean;
}

export const PasswordUI: React.FC<PasswordUIProps> = ({ 
  onAddPassword, 
  onRemovePassword, 
  onCancel,
  isProtected = false 
}) => {
  const [mode, setMode] = useState<'add' | 'remove'>(isProtected ? 'remove' : 'add');
  const [userPassword, setUserPassword] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [useOwnerPassword, setUseOwnerPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [permissions, setPermissions] = useState({
    printing: true,
    modifying: true,
    copying: true,
    annotating: true,
    fillingForms: true,
  });

  const handleSubmit = () => {
    if (mode === 'add') {
      if (!userPassword) {
        alert('Please enter a password');
        return;
      }
      onAddPassword({
        userPassword,
        ownerPassword: useOwnerPassword ? ownerPassword : userPassword,
        permissions
      });
    } else {
      if (!userPassword) {
        alert('Please enter the current password');
        return;
      }
      onRemovePassword(userPassword);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setUserPassword(password);
  };

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
                <Unlock className="w-5 h-5 text-green-500" />
                Remove Password Protection
              </>
            )}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {isProtected && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMode('remove')}
              className={`flex-1 py-2 px-3 rounded ${
                mode === 'remove' 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              Remove Password
            </button>
            <button
              onClick={() => setMode('add')}
              className={`flex-1 py-2 px-3 rounded ${
                mode === 'add' 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              Change Password
            </button>
          </div>
        )}

        <div className="space-y-4">
          {mode === 'add' ? (
            <>
              {/* User Password */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  User Password (Required)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
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
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    onClick={generatePassword}
                    className="px-3 py-2 bg-gray-700 text-cyan-400 rounded hover:bg-gray-600"
                    title="Generate password"
                  >
                    <Shield className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Owner Password Option */}
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={useOwnerPassword}
                    onChange={(e) => setUseOwnerPassword(e.target.checked)}
                    className="rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
                  />
                  Set different owner password (admin rights)
                </label>
              </div>

              {useOwnerPassword && (
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Owner Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter owner password"
                  />
                </div>
              )}

              {/* Permissions */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  User Permissions
                </label>
                <div className="space-y-2">
                  {Object.entries(permissions).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 text-sm text-gray-400">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setPermissions({ ...permissions, [key]: e.target.checked })}
                        className="rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
                      />
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Current Password
              </label>
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-500"
          >
            {mode === 'add' ? 'Add Protection' : 'Remove Protection'}
          </button>
        </div>
      </div>
    </div>
  );
};