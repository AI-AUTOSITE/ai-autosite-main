// lib/grid-utils.ts

/**
 * カテゴリー数に応じて最適なグリッドクラスを返す
 * 拡張性を考慮し、カテゴリー数が増えても自動的に対応
 */
export const getGridClassName = (categoryCount: number): string => {
  // 特殊なケース（1-10個）の最適化
  const specialCases: { [key: number]: string } = {
    1: 'grid-cols-1 max-w-sm mx-auto',
    2: 'grid-cols-2 max-w-2xl mx-auto',
    3: 'grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5', // 5列で均等に
    6: 'grid-cols-2 md:grid-cols-3',
    7: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4', // 7個の場合、4-3で分割
    8: 'grid-cols-2 md:grid-cols-4',
    9: 'grid-cols-3',
    10: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  }

  if (specialCases[categoryCount]) {
    return specialCases[categoryCount]
  }

  // 11個以上の場合の汎用ルール
  if (categoryCount <= 12) {
    return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  } else if (categoryCount <= 15) {
    return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
  } else if (categoryCount <= 18) {
    return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
  } else {
    // 18個以上の場合は、スクロール可能な固定レイアウト
    return 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6'
  }
}

/**
 * モバイル用のカテゴリーグリッドクラス
 * 小画面でも見やすいレイアウトを提供
 */
export const getMobileGridClassName = (categoryCount: number): string => {
  if (categoryCount <= 2) {
    return 'grid-cols-1'
  } else if (categoryCount <= 4) {
    return 'grid-cols-2'
  } else {
    // 5個以上はスクロール推奨だが、グリッド表示も可能
    return 'grid-cols-2'
  }
}

/**
 * カテゴリーカードの最適なパディングサイズを返す
 * カテゴリー数が多い場合は、カードを小さくして見やすくする
 */
export const getCardPaddingClass = (categoryCount: number): string => {
  if (categoryCount <= 4) {
    return 'p-6' // 大きめのパディング
  } else if (categoryCount <= 8) {
    return 'p-5' // 中サイズ
  } else if (categoryCount <= 12) {
    return 'p-4' // 小さめ
  } else {
    return 'p-3' // 最小サイズ
  }
}

/**
 * アイコンのサイズクラスを返す
 */
export const getIconSizeClass = (categoryCount: number): string => {
  if (categoryCount <= 4) {
    return 'text-3xl' // 大きめ
  } else if (categoryCount <= 8) {
    return 'text-2xl' // 中サイズ
  } else {
    return 'text-xl' // 小さめ
  }
}

/**
 * カテゴリーカードの最小高さを返す
 */
export const getCardMinHeightClass = (categoryCount: number): string => {
  if (categoryCount <= 4) {
    return 'min-h-[200px]' // 大きめのカード
  } else if (categoryCount <= 8) {
    return 'min-h-[180px]' // 中サイズ
  } else {
    return 'min-h-[160px]' // コンパクト
  }
}

/**
 * グリッドのギャップサイズを返す
 */
export const getGridGapClass = (categoryCount: number): string => {
  if (categoryCount <= 6) {
    return 'gap-4' // 通常のギャップ
  } else if (categoryCount <= 10) {
    return 'gap-3' // 少し狭め
  } else {
    return 'gap-2' // 最小ギャップ
  }
}