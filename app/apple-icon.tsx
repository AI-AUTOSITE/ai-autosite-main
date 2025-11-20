// app/apple-icon.tsx
// ✨ 修正版：SVGのネストを解消して二重表示を修正

import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}

export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 白い円形背景 */}
          <circle cx="90" cy="90" r="85" fill="white" />
          
          {/* グラデーション定義 */}
          <defs>
            <linearGradient id="grad-apple" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0052CC" stopOpacity="1" />
              <stop offset="50%" stopColor="#00A3FF" stopOpacity="1" />
              <stop offset="100%" stopColor="#00C853" stopOpacity="1" />
            </linearGradient>
          </defs>
          
          {/* Signalロゴ（スケール調整して直接描画） */}
          {/* 外側の円 */}
          <circle 
            cx="90" 
            cy="90" 
            r="62" 
            stroke="url(#grad-apple)" 
            strokeWidth="2" 
            fill="none" 
            opacity="0.3"
          />
          
          {/* 波線1 */}
          <path 
            d="M 40 67.5 Q 50 60, 60 67.5 T 80 67.5 T 100 67.5 T 120 67.5 T 140 67.5" 
            stroke="url(#grad-apple)" 
            strokeWidth="4" 
            fill="none" 
            strokeLinecap="round"
          />
          
          {/* 波線2（中央・太い） */}
          <path 
            d="M 40 90 Q 50 82.5, 60 90 T 80 90 T 100 90 T 120 90 T 140 90" 
            stroke="url(#grad-apple)" 
            strokeWidth="5" 
            fill="none" 
            strokeLinecap="round"
          />
          
          {/* 波線3 */}
          <path 
            d="M 40 112.5 Q 50 105, 60 112.5 T 80 112.5 T 100 112.5 T 120 112.5 T 140 112.5" 
            stroke="url(#grad-apple)" 
            strokeWidth="4" 
            fill="none" 
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}