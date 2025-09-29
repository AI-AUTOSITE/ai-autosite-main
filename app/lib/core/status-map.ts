// app/lib/core/status-map.ts
// ===================================
// ステータスマッピング（完全版）
// ===================================

// ツールのステータスマッピング
export const TOOL_STATUS_MAP = {
  'live': 'active',
  'coming': 'coming',
  'maintenance': 'maintenance'
} as const

// ブログ記事のステータスマッピング
export const POST_STATUS_MAP = {
  'published': 'active',
  'coming-soon': 'coming',
  'draft': 'draft'
} as const

// カテゴリーIDの正規化
export const CATEGORY_MAP = {
  'business': 'business-tools',
  'creative': 'creative-tools',
  'learning': 'learning-hub'
} as const

// マッピング関数（明示的にexport）
export function mapToolStatus(status: string): string {
  return TOOL_STATUS_MAP[status as keyof typeof TOOL_STATUS_MAP] || status
}

export function mapPostStatus(status: string): string {
  return POST_STATUS_MAP[status as keyof typeof POST_STATUS_MAP] || status
}

export function mapCategoryId(category: string): string {
  return CATEGORY_MAP[category as keyof typeof CATEGORY_MAP] || category
}

// デバッグ用: すべてエクスポートされているか確認
console.log('status-map.ts loaded:', {
  mapToolStatus: typeof mapToolStatus,
  mapPostStatus: typeof mapPostStatus,
  mapCategoryId: typeof mapCategoryId
})