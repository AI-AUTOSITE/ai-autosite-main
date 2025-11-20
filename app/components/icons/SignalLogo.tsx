// app/components/icons/SignalLogo.tsx
import React from 'react';

interface SignalLogoProps {
  size?: number;
  colors?: [string, string, string];
  className?: string;
  animated?: boolean;
}

export default function SignalLogo({
  size = 40,
  colors = ['#0052CC', '#00A3FF', '#00C853'],
  className = '',
  animated = false,
}: SignalLogoProps) {
  const gradientId = `signal-gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      aria-label="Signal Logo"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors[0]} stopOpacity="1">
            {animated && (
              <animate
                attributeName="stop-color"
                values={`${colors[0]};${colors[1]};${colors[2]};${colors[1]};${colors[0]}`}
                dur="4s"
                repeatCount="indefinite"
              />
            )}
          </stop>
          <stop offset="50%" stopColor={colors[1]} stopOpacity="1">
            {animated && (
              <animate
                attributeName="stop-color"
                values={`${colors[1]};${colors[2]};${colors[0]};${colors[2]};${colors[1]}`}
                dur="4s"
                repeatCount="indefinite"
              />
            )}
          </stop>
          <stop offset="100%" stopColor={colors[2]} stopOpacity="1">
            {animated && (
              <animate
                attributeName="stop-color"
                values={`${colors[2]};${colors[0]};${colors[1]};${colors[0]};${colors[2]}`}
                dur="4s"
                repeatCount="indefinite"
              />
            )}
          </stop>
        </linearGradient>
      </defs>

      <circle
        cx="60"
        cy="60"
        r="55"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        fill="none"
        opacity="0.3"
      >
        {animated && (
          <>
            <animate attributeName="r" values="55;58;55" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.5;0.3" dur="2s" repeatCount="indefinite" />
          </>
        )}
      </circle>

      <path
        d="M 25 45 Q 35 40, 45 45 T 65 45 T 85 45 T 95 45"
        stroke={`url(#${gradientId})`}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      <path
        d="M 25 60 Q 35 55, 45 60 T 65 60 T 85 60 T 95 60"
        stroke={`url(#${gradientId})`}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      <path
        d="M 25 75 Q 35 70, 45 75 T 65 75 T 85 75 T 95 75"
        stroke={`url(#${gradientId})`}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}