import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

// 🔥 ssr: false が最重要！サーバーサイドバンドリングを完全に防ぐ
const BgEraserClient = dynamic(
  () => import('./BgEraserClient'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }
)

export const metadata: Metadata = {
  title: 'AI背景削除ツール | 無料で高精度な背景透過 - AI AutoSite',
  description: 'AIを使って画像の背景を自動削除。人物、商品、ペットなど様々な被写体に対応。ブラウザ内で処理するため、画像がサーバーに送信されることはありません。',
  keywords: ['背景削除', '背景透過', 'AI', '画像編集', '無料', 'オンライン', '透過PNG'],
  openGraph: {
    title: 'AI背景削除ツール | 無料で高精度な背景透過',
    description: 'AIを使って画像の背景を自動削除。プライバシー保護のため、すべての処理はブラウザ内で完結します。',
    type: 'website',
  },
}

export default function BgEraserPage() {
  return <BgEraserClient />
}