// app/tools/pdf-tools/components/LicenseStatusModal.tsx
import React, { useRef, useEffect } from 'react';
import { X, CheckCircle, Lock, Calendar, Mail, CreditCard, Download } from 'lucide-react';
import { LicenseManager } from '../lib/licenseManager';

interface LicenseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  isPremium: boolean;
}

export const LicenseStatusModal: React.FC<LicenseStatusModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  isPremium
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const status = LicenseManager.getLicenseStatus();
  const purchaseDate = status.purchasedAt 
    ? new Date(status.purchasedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Unknown';

  const downloadLicenseBackup = () => {
    const license = LicenseManager.getLicense();
    if (!license) return;
    
    const backup = {
      product: 'PDF Tools Premium',
      license: license.token,
      purchasedAt: license.purchasedAt,
      email: license.email || status.email,
    };
    
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pdf-tools-license-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
      <div 
        ref={modalRef}
        className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full animate-scaleIn"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            {isPremium ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-400" />
                Premium License Active
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 text-gray-400" />
                Free Version
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 p-1 rounded hover:bg-gray-700 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {isPremium ? (
            <>
              {/* Premium Status */}
              <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">Premium Features Active</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Purchased: {purchaseDate}</span>
                  </div>
                  
                  {status.email && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{status.email}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-gray-300">
                    <Lock className="w-4 h-4 text-gray-400" />
                    <span>6 tool slots unlocked</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={downloadLicenseBackup}
                  className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download License Backup
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                  Save this backup to restore your license on other devices
                </p>
              </div>

              {/* Features List */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Your Premium Benefits:</h3>
                <ul className="space-y-1 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    All 6 tool slots available
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    Lifetime access
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    All future premium tools
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    Priority support
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* Free Version Status */}
              <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300 font-medium">Free Version</span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-400">
                  <p>You're using the free version with limited features.</p>
                  <p>• 3 tool slots available</p>
                  <p>• Basic tools only</p>
                  <p>• Community support</p>
                </div>
              </div>

              {/* Upgrade Prompt */}
              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white mb-1">$5</p>
                  <p className="text-sm text-gray-400">One-time payment • Lifetime access</p>
                </div>
                
                <button
                  onClick={onUpgrade}
                  className="w-full px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition flex items-center justify-center gap-2 font-medium"
                >
                  <CreditCard className="w-4 h-4" />
                  Upgrade to Premium
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                  Unlock 3 additional slots and all premium features
                </p>
              </div>

              {/* What You Get */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h3 className="text-sm font-medium text-gray-300 mb-2">What you'll get:</h3>
                <ul className="space-y-1 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    Unlock 3 additional tool slots (6 total)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    Access to all premium tools
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    Lifetime updates & new features
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    Priority support
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};