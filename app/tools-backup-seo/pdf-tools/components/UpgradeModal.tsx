// app/tools/pdf-tools/components/UpgradeModal.tsx
import { X, CreditCard, CheckCircle } from 'lucide-react';

interface UpgradeModalProps {
  showUpgradeModal: boolean;
  setShowUpgradeModal: (show: boolean) => void;
  handleUpgradeToPremium: () => void;
  isLoadingPayment: boolean;
}

export function UpgradeModal({
  showUpgradeModal,
  setShowUpgradeModal,
  handleUpgradeToPremium,
  isLoadingPayment
}: UpgradeModalProps) {
  if (!showUpgradeModal) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative z-[10000]">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-white">Unlock Premium Features</h2>
          <button
            onClick={() => setShowUpgradeModal(false)}
            className="text-gray-400 hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-lg p-4 mb-4 border border-amber-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-white">$5</span>
              <span className="text-sm text-gray-400 line-through">$15</span>
            </div>
            <p className="text-sm text-gray-300">One-time payment • Lifetime access</p>
          </div>
          
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span>Unlock 3 additional tool slots (6 total)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span>Access to all premium tools</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span>Lifetime updates & new features</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span>Priority support</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span>License backup & recovery</span>
            </li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={handleUpgradeToPremium}
            disabled={isLoadingPayment}
            className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {isLoadingPayment ? (
              'Processing...'
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Upgrade to Premium
              </>
            )}
          </button>
          
          <button
            onClick={() => setShowUpgradeModal(false)}
            className="w-full px-4 py-2 text-gray-400 hover:text-gray-300 transition"
          >
            Maybe later
          </button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            Secure payment via Stripe • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}