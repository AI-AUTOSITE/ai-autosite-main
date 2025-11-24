// ============================================
// QR Code Generator - Utility Functions
// ============================================

import { WiFiData, VCardData } from './types'

/**
 * Convert WiFi data to QR code format string
 */
export const formatWiFiString = (data: WiFiData): string => {
  const { ssid, password, encryption, hidden } = data
  if (!ssid) return ''
  const hiddenStr = hidden ? 'H:true;' : ''
  if (encryption === 'nopass') {
    return `WIFI:T:nopass;S:${ssid};${hiddenStr};`
  }
  return `WIFI:T:${encryption};S:${ssid};P:${password};${hiddenStr};`
}

/**
 * Convert vCard data to QR code format string
 */
export const formatVCardString = (data: VCardData): string => {
  const lines = ['BEGIN:VCARD', 'VERSION:3.0']

  if (data.firstName || data.lastName) {
    lines.push(`N:${data.lastName};${data.firstName};;;`)
    lines.push(`FN:${data.firstName} ${data.lastName}`.trim())
  }
  if (data.email) lines.push(`EMAIL:${data.email}`)
  if (data.phone) lines.push(`TEL:${data.phone}`)
  if (data.company) lines.push(`ORG:${data.company}`)
  if (data.title) lines.push(`TITLE:${data.title}`)
  if (data.website) lines.push(`URL:${data.website}`)

  lines.push('END:VCARD')
  return lines.join('\n')
}

/**
 * Calculate contrast ratio between two hex colors (WCAG AA: 4.5:1 minimum)
 */
export const getContrastRatio = (hex1: string, hex2: string): number => {
  const getLuminance = (hex: string): number => {
    const rgb = hex
      .replace('#', '')
      .match(/.{2}/g)
      ?.map((x) => {
        const c = parseInt(x, 16) / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      }) || [0, 0, 0]
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
  }

  const l1 = getLuminance(hex1)
  const l2 = getLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if contrast ratio meets WCAG AA standard
 */
export const isContrastOk = (hex1: string, hex2: string): boolean => {
  return getContrastRatio(hex1, hex2) >= 4.5
}

/**
 * Get size label from pixel value
 */
export const getSizeLabel = (size: number): string => {
  switch (size) {
    case 256:
      return 'Small'
    case 512:
      return 'Medium'
    case 1024:
      return 'Large'
    default:
      return `${size}px`
  }
}
