// app/tools/pdf-tools/success/page.tsx
'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader, XCircle, Download, ArrowRight } from 'lucide-react';
import { LicenseManager } from '../lib/licenseManager';

// メインのコンテンツコンポーネント（useSearchParamsを使用）
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [licenseInfo, setLicenseInfo] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setStatus('error');
        setMessage('Invalid payment session');
        return;
      }

      try {
        // Verify payment with backend
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (data.success && data.license) {
          // Save license to local storage
          LicenseManager.saveLicense(data.license);
          
          setStatus('success');
          setMessage('Payment successful! Your premium features are now active.');
          setLicenseInfo(data.license);
          
          // Auto redirect after 5 seconds
          setTimeout(() => {
            router.push('/tools/pdf-tools');
          }, 5000);
        } else {
          throw new Error(data.error || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setMessage('Failed to verify payment. Please contact support with your session ID.');
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  // Download license backup
  const downloadLicenseBackup = () => {
    if (!licenseInfo) return;
    
    const backup = {
      product: 'PDF Tools Premium',
      license: licenseInfo.token,
      purchasedAt: licenseInfo.purchasedAt,
      email: licenseInfo.email,
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          {status === 'loading' && (
            <div className="text-center">
              <Loader className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-semibold text-white mb-2">Verifying Payment</h2>
              <p className="text-gray-400">Please wait while we confirm your purchase...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
              <p className="text-gray-300 mb-6">{message}</p>
              
              <div className="bg-gray-700 rounded-lg p-4 mb-6 text-left">
                <h3 className="text-sm font-semibold text-cyan-400 mb-2">Your Premium Features:</h3>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>✓ 6 tool slots unlocked (3 → 6)</li>
                  <li>✓ Lifetime access</li>
                  <li>✓ All future premium tools</li>
                  <li>✓ Priority support</li>
                </ul>
              </div>

              {licenseInfo && (
                <div className="space-y-3 mb-6">
                  <button
                    onClick={downloadLicenseBackup}
                    className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download License Backup
                  </button>
                  <p className="text-xs text-gray-500">
                    Save this backup to restore your license if needed
                  </p>
                </div>
              )}

              <button
                onClick={() => router.push('/tools/pdf-tools')}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition flex items-center justify-center gap-2"
              >
                Go to PDF Editor
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <p className="text-xs text-gray-500 mt-4">
                Redirecting automatically in 5 seconds...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Payment Verification Failed</h2>
              <p className="text-gray-400 mb-6">{message}</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/tools/pdf-tools')}
                  className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
                >
                  Return to PDF Editor
                </button>
                <p className="text-xs text-gray-500">
                  Session ID: {searchParams.get('session_id')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="text-center">
            <Loader className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold text-white mb-2">Loading Payment Status</h2>
            <p className="text-gray-400">Please wait...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}