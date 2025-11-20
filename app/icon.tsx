// app/icon.tsx
// ✨ 修正版：SVGのネストを解消して二重表示を修正

import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

export default function Icon() {
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
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 白い円形背景 */}
          <circle cx="16" cy="16" r="15" fill="white" />
          
          {/* グラデーション定義 */}
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0052CC" stopOpacity="1" />
              <stop offset="50%" stopColor="#00A3FF" stopOpacity="1" />
              <stop offset="100%" stopColor="#00C853" stopOpacity="1" />
            </linearGradient>
          </defs>
          
          {/* Signalロゴ（スケール調整して直接描画） */}
          {/* 外側の円 */}
          <circle 
            cx="16" 
            cy="16" 
            r="11" 
            stroke="url(#grad)" 
            strokeWidth="0.5" 
            fill="none" 
            opacity="0.3"
          />
          
          {/* 波線1 */}
          <path 
            d="M 6 12 Q 8.5 10.5, 11 12 T 16 12 T 21 12 T 26 12" 
            stroke="url(#grad)" 
            strokeWidth="0.8" 
            fill="none" 
            strokeLinecap="round"
          />
          
          {/* 波線2（中央・太い） */}
          <path 
            d="M 6 16 Q 8.5 14.5, 11 16 T 16 16 T 21 16 T 26 16" 
            stroke="url(#grad)" 
            strokeWidth="1" 
            fill="none" 
            strokeLinecap="round"
          />
          
          {/* 波線3 */}
          <path 
            d="M 6 20 Q 8.5 18.5, 11 20 T 16 20 T 21 20 T 26 20" 
            stroke="url(#grad)" 
            strokeWidth="0.8" 
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