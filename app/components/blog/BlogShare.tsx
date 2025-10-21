'use client'

import { useState } from 'react'
import { Twitter, Facebook, Linkedin, Link2, Check } from 'lucide-react'

interface BlogShareProps {
  title: string
  description: string
  url: string
  hashtags?: string[]
}

export function BlogShare({ title, description, url, hashtags = [] }: BlogShareProps) {
  const [copied, setCopied] = useState(false)

  // URL エンコード
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)

  // Twitter用ハッシュタグ
  const twitterHashtags = hashtags.slice(0, 3).join(',')

  // 共有URL生成
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}${
      twitterHashtags ? `&hashtags=${twitterHashtags}` : ''
    }`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  }

  // リンクコピー
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // 共有ボタンの設定
  const shareButtons = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: shareUrls.twitter,
      color: 'hover:bg-blue-400 hover:text-white',
      ariaLabel: 'Share on Twitter',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: shareUrls.facebook,
      color: 'hover:bg-blue-600 hover:text-white',
      ariaLabel: 'Share on Facebook',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: shareUrls.linkedin,
      color: 'hover:bg-blue-700 hover:text-white',
      ariaLabel: 'Share on LinkedIn',
    },
  ]

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Share:</span>

      {/* SNS共有ボタン */}
      <div className="flex gap-2">
        {shareButtons.map((button) => (
          <a
            key={button.name}
            href={button.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={button.ariaLabel}
            className={`
              p-2 rounded-lg border border-gray-200 dark:border-gray-700
              transition-all duration-200
              ${button.color}
            `}
          >
            <button.icon className="w-5 h-5" />
          </a>
        ))}

        {/* リンクコピーボタン */}
        <button
          onClick={copyToClipboard}
          aria-label="Copy link"
          className={`
            p-2 rounded-lg border transition-all duration-200
            ${
              copied
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
            }
          `}
        >
          {copied ? <Check className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
        </button>
      </div>

      {/* コピー完了メッセージ */}
      {copied && (
        <span className="text-sm text-green-600 dark:text-green-400 font-medium animate-fade-in">
          Link copied!
        </span>
      )}
    </div>
  )
}

// ==================
// モバイル向けコンパクト版
// ==================
export function BlogShareCompact({ title, url, hashtags = [] }: BlogShareProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const twitterHashtags = hashtags.slice(0, 3).join(',')

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="flex items-center justify-between gap-2">
      {/* 左側: SNSボタン */}
      <div className="flex gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}${
            twitterHashtags ? `&hashtags=${twitterHashtags}` : ''
          }`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-blue-400 text-white"
        >
          <Twitter className="w-4 h-4" />
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-blue-600 text-white"
        >
          <Facebook className="w-4 h-4" />
        </a>
      </div>

      {/* 右側: コピーボタン */}
      <button
        onClick={copyToClipboard}
        className={`
          px-3 py-1.5 rounded-full text-sm font-medium transition-all
          ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }
        `}
      >
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  )
}