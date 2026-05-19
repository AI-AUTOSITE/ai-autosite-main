// middleware.ts
// プロジェクトルート（app/ と同じ階層）に配置してください
//
// 目的:
// ホームページ「/」への POST リクエストをブロックする。
// ai-autosite では Server Actions を一切使っていないため、
// 「/」への POST は全て不正リクエスト（ボット／スキャナー）と判断できる。
//
// 効果:
// - Vercel ログの 500 エラー「Unexpected end of form」を防止
// - Server Action "true" 試行などの脆弱性スキャンを早期に弾く
// - 正当なユーザーには一切影響なし（GET / HEAD はそのまま通過）

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // ホームページ「/」への POST リクエストのみ拒否
  if (request.method === 'POST' && request.nextUrl.pathname === '/') {
    return new NextResponse('Method Not Allowed', {
      status: 405,
      headers: {
        Allow: 'GET, HEAD',
      },
    })
  }

  return NextResponse.next()
}

// このミドルウェアを適用するパスを「/」のみに限定
// （他のページや API には一切影響しない）
export const config = {
  matcher: '/',
}
