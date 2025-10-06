import { ReactElement } from 'react'

export interface Tool {
  id: string
  name: string
  icon: ReactElement // string から ReactElement に変更
  category: 'basic' | 'edit' | 'optimize' | 'convert'
  action: () => void // 追加（ツールの実行関数）
  description?: string // オプショナルに変更
  color?: string // オプショナルに変更
}

export interface PageData {
  id: string
  pageNumber: number
  rotation: number
  thumbnail: string
}

export interface PDFFile {
  file: File
  name: string
  size: number
  pageCount?: number
  thumbnail?: string
}

// ActiveToolSlot は削除（PDFStudioClient では配列で管理）
