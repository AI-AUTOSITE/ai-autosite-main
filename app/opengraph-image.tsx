// app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Signal - 透明性とプライバシーを守るツール'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0052CC 0%, #00C853 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '40px',
          }}
        >
          <svg width="300" height="300" viewBox="0 0 120 120" fill="none">
            <defs>
              <linearGradient id="og-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="50%" stopColor="#E0F2FE" stopOpacity="1" />
                <stop offset="100%" stopColor="#BFDBFE" stopOpacity="1" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="55" stroke="url(#og-grad)" strokeWidth="3" fill="none" opacity="0.5"/>
            <path d="M 25 45 Q 35 40, 45 45 T 65 45 T 85 45 T 95 45" 
                  stroke="white" strokeWidth="4" fill="none" strokeLinecap="round"/>
            <path d="M 25 60 Q 35 55, 45 60 T 65 60 T 85 60 T 95 60" 
                  stroke="white" strokeWidth="5" fill="none" strokeLinecap="round"/>
            <path d="M 25 75 Q 35 70, 45 75 T 65 75 T 85 75 T 95 75" 
                  stroke="white" strokeWidth="4" fill="none" strokeLinecap="round"/>
          </svg>
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h1
              style={{
                fontSize: '80px',
                fontWeight: 'bold',
                color: 'white',
                margin: 0,
              }}
            >
              Signal
            </h1>
            <p
              style={{
                fontSize: '32px',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: 0,
              }}
            >
              透明性とプライバシーを守るツール
            </p>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}