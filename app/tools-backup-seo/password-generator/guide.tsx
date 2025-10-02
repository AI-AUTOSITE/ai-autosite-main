// app/tools/password-generator/guide.tsx

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  AlertCircle, 
  BookOpen, 
  Shield,
  Lock,
  Key,
  Sparkles,
  RefreshCw,
  Settings,
  Lightbulb,
  Target,
  Info
} from 'lucide-react';

interface GuideProps {
  onClose?: () => void;
}

export default function PasswordGeneratorGuide({ onClose }: GuideProps) {
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  const examplePasswords = {
    weak: "password123",
    strong: "K9#mP2$vL8@nQ5xR"
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedExample(id);
    setTimeout(() => setCopiedExample(null), 2000);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-h-[80vh] overflow-hidden flex flex-col relative w-full max-w-2xl">
      {/* Fixed Header */}
      <div className="p-6 border-b border-white/10 relative">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
            aria-label="Close guide"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        )}

        {/* Title */}
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-purple-400" />
          <h3 className="text-2xl font-bold text-white">Password Generator Guide</h3>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 p-6 space-y-6">
        {/* Overview */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-purple-300">
              <p className="font-semibold mb-1">Create Unbreakable Passwords</p>
              <p>Generate secure passwords instantly with customizable options.</p>
              <p className="mt-2">All generation happens locally - your passwords never leave your device!</p>
            </div>
          </div>
        </div>

        {/* Password Strength Example */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            Understand Password Strength
          </h4>
          
          <div className="space-y-3">
            {/* Weak Example */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-red-400 font-medium mb-1">❌ Weak Password</p>
                  <p className="text-sm text-gray-300 font-mono">"{examplePasswords.weak}"</p>
                  <p className="text-xs text-gray-500 mt-1">Can be cracked in seconds</p>
                </div>
                <button
                  onClick={() => handleCopy(examplePasswords.weak, 'weak')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  {copiedExample === 'weak' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Strong Example */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-green-400 font-medium mb-1">✅ Strong Password</p>
                  <p className="text-sm text-gray-300 font-mono">"{examplePasswords.strong}"</p>
                  <p className="text-xs text-gray-500 mt-1">Would take centuries to crack</p>
                </div>
                <button
                  onClick={() => handleCopy(examplePasswords.strong, 'strong')}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  {copiedExample === 'strong' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div>
          <h4 className="font-semibold text-white mb-3">How to Use This Tool</h4>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                1
              </span>
              <div>
                <p className="font-medium text-white">Set Password Length</p>
                <p className="text-sm text-gray-400 mt-1">
                  Use the slider to adjust length (8-32 characters). Longer is stronger!
                </p>
              </div>
            </li>
            
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                2
              </span>
              <div>
                <p className="font-medium text-white">Choose Character Types</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Settings className="inline w-3 h-3 mr-1" />
                  Select uppercase, lowercase, numbers, and symbols
                </p>
              </div>
            </li>
            
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                3
              </span>
              <div>
                <p className="font-medium text-white">Generate Password</p>
                <p className="text-sm text-gray-400 mt-1">
                  <RefreshCw className="inline w-3 h-3 mr-1" />
                  Click "New Password" to generate instantly
                </p>
              </div>
            </li>

            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                4
              </span>
              <div>
                <p className="font-medium text-white">Copy to Clipboard</p>
                <p className="text-sm text-gray-400 mt-1">
                  <Copy className="inline w-3 h-3 mr-1" />
                  Click "Copy" to save your password
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Strength Meter Guide */}
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Key className="w-5 h-5 text-yellow-400" />
            Strength Meter Explained
          </h4>
          <div className="bg-black/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-16 h-2 bg-red-500 rounded-full"></div>
              <p className="text-xs text-gray-400">Weak - Easy to crack</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-2 bg-yellow-500 rounded-full"></div>
              <p className="text-xs text-gray-400">OK - Moderate security</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-2 bg-green-500 rounded-full"></div>
              <p className="text-xs text-gray-400">Strong - Good protection</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-2 bg-emerald-500 rounded-full"></div>
              <p className="text-xs text-gray-400">Very Strong - Excellent security</p>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-300">
              <p className="font-semibold mb-2">Pro Tips for Maximum Security</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Use at least 16 characters for important accounts</li>
                <li>• Include all character types for maximum strength</li>
                <li>• Generate unique passwords for each account</li>
                <li>• Store passwords in a password manager</li>
                <li>• Never share passwords via email or text</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-cyan-300">
              <p className="font-semibold mb-2">Security Features</p>
              <ul className="space-y-1 text-gray-300">
                <li>• 100% client-side generation</li>
                <li>• No passwords stored or transmitted</li>
                <li>• Cryptographically secure randomization</li>
                <li>• Zero tracking or analytics on passwords</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Common Use Cases */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Target className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-indigo-300">
              <p className="font-semibold mb-2">Perfect For:</p>
              <ul className="space-y-1 text-gray-300">
                <li>• Creating new account passwords</li>
                <li>• Updating old weak passwords</li>
                <li>• Generating secure API keys</li>
                <li>• Creating master passwords</li>
                <li>• Team password requirements</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-white font-medium mb-1">Remember</p>
              <p className="text-gray-400">
                A password manager is the best way to store all your unique passwords. 
                This generator helps you create strong passwords, but you'll need a 
                secure way to remember them all!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export metadata for dynamic loading
export const guideMetadata = {
  title: 'Password Generator Guide',
  icon: '🔐',
  available: true,
};