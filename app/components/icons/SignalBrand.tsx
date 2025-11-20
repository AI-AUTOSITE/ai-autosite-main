// app/components/SignalBrand.tsx
import React from 'react';
import SignalLogo from '../icons/SignalLogo';

interface SignalBrandProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  animated?: boolean;
}

const sizeConfig = {
  sm: { logo: 32, text: 'text-xl', subtitle: 'text-[10px]' },
  md: { logo: 40, text: 'text-2xl', subtitle: 'text-xs' },
  lg: { logo: 60, text: 'text-4xl', subtitle: 'text-sm' },
};

export default function SignalBrand({
  size = 'md',
  showText = true,
  className = '',
  animated = false,
}: SignalBrandProps) {
  const { logo, text, subtitle } = sizeConfig[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <SignalLogo size={logo} animated={animated} />
      {showText && (
        <div>
          <h1 className={`${text} font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent`}>
            Signal
          </h1>
          <p className={`${subtitle} text-gray-400`}>Free • Private • Instant</p>
        </div>
      )}
    </div>
  );
}