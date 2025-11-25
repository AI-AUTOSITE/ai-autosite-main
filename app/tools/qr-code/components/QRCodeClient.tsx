// ============================================
// QR Code Generator - Main Client Component
// ============================================

'use client'

import { useQRCode } from '../hooks/useQRCode'
import { QRTypeSelector } from './QRTypeSelector'
import { ContentInput } from './ContentInput'
import { ColorOptions } from './ColorOptions'
import { AdvancedOptions } from './AdvancedOptions'
import { QRPreview } from './QRPreview'
import { FloatingPreview } from './FloatingPreview'
import { Features } from './Features'

export default function QRCodeClient() {
  const qr = useQRCode()

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 max-w-2xl">
      {/* Main Preview Section (Normal position) */}
      <div className="mb-4">
        <QRPreview
          qrRef={qr.qrRef}
          isGenerated={qr.isGenerated}
          error={qr.error}
          backgroundColor={qr.currentColors.background}
          size={qr.size}
          outputFormat={qr.outputFormat}
          errorLevel={qr.errorLevel}
          onDownload={qr.handleDownload}
        />
      </div>
      
      {/* QR Type Selection */}
      <div className="mb-4">
        <QRTypeSelector
          qrType={qr.qrType}
          onTypeChange={(type) => {
            qr.setQrType(type)
            qr.handleClear()
          }}
        />
      </div>

      {/* Content Input */}
      <div className="mb-4">
        <ContentInput
          qrType={qr.qrType}
          textInput={qr.textInput}
          wifiData={qr.wifiData}
          vcardData={qr.vcardData}
          showPassword={qr.showPassword}
          onTextChange={qr.setTextInput}
          onWifiChange={qr.setWifiData}
          onVcardChange={qr.setVcardData}
          onShowPasswordChange={qr.setShowPassword}
          onLoadExample={qr.loadExample}
          onClear={qr.handleClear}
        />
      </div>

      {/* Color Options (Accordion - Default Closed) */}
      <div className="mb-4">
        <ColorOptions
          colorTab={qr.colorTab}
          selectedPreset={qr.selectedPreset}
          customForeground={qr.customForeground}
          customBackground={qr.customBackground}
          onColorTabChange={qr.setColorTab}
          onPresetChange={qr.setSelectedPreset}
          onForegroundChange={qr.setCustomForeground}
          onBackgroundChange={qr.setCustomBackground}
        />
      </div>

      {/* Advanced Options (Accordion - Default Closed) */}
      <div className="mb-4">
        <AdvancedOptions
          size={qr.size}
          outputFormat={qr.outputFormat}
          errorLevel={qr.errorLevel}
          dotStyle={qr.dotStyle}
          logo={qr.logo}
          onSizeChange={qr.setSize}
          onFormatChange={qr.setOutputFormat}
          onErrorLevelChange={qr.setErrorLevel}
          onDotStyleChange={qr.setDotStyle}
          onLogoChange={qr.setLogo}
          onError={(err) => console.error(err)}
        />
      </div>

      {/* Features */}
      <Features />
      
      {/* Bottom padding for scroll space */}
      <div className="h-24" />

      {/* Floating Preview (FAB) - Shows when scrolled */}
      <FloatingPreview
        isGenerated={qr.isGenerated}
        backgroundColor={qr.currentColors.background}
        outputFormat={qr.outputFormat}
        onDownload={qr.handleDownload}
        qrRef={qr.qrRef}
      />
    </div>
  )
}
