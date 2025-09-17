// app/demo-doodle/page.tsx
'use client';

import { useState } from 'react';

// Import all Doodle icons from Part 1
import { 
  DoodleIcon,
  DoodleSearchIcon,
  DoodleBookOpenIcon,
  DoodleCodeIcon,
  DoodleSparklesIcon,
  DoodleChevronRightIcon,
  DoodleFilterIcon,
  DoodleXIcon,
  DoodleCopyIcon,
  DoodleCheckIcon,
  DoodleExternalLinkIcon,
  DoodleZapIcon,
  DoodleMousePointerIcon,
  DoodleLayoutIcon,
  DoodleComponentIcon,
  DoodleFormInputIcon
} from '@/components/icons/DoodleIcons';

// Import all Doodle icons from Part 2
import {
  DoodleIcon2,
  DoodleMessageSquareIcon,
  DoodleLoaderIcon,
  DoodleLinkIcon,
  DoodleGridIcon,
  DoodleListIcon,
  DoodleBotIcon,
  DoodleUserIcon,
  DoodleUploadIcon,
  DoodleDownloadIcon,
  DoodleUndoIcon,
  DoodleShieldIcon,
  DoodleAlertCircleIcon,
  DoodleCheckCircleIcon,
  DoodleLockIcon,
  DoodleInfoIcon
} from '@/components/icons/DoodleIconsPart2';

// Import all Doodle icons from Part 3
import {
  DoodleIcon3,
  DoodleFileImageIcon,
  DoodleMoveIcon,
  DoodleGithubIcon,
  DoodleFolderIcon,
  DoodleHelpCircleIcon,
  DoodleFileCodeIcon,
  DoodleSaveIcon,
  DoodleFileTextIcon,
  DoodleMenuIcon,
  DoodleChevronLeftIcon
} from '@/components/icons/DoodleIconsPart3';

// Shannon-inspired color palettes
const colorPalettes = {
  'signal-noise': {
    name: 'Signal & Noise',
    description: 'Pure signal vs uncertainty',
    colors: {
      primary: '#0066FF',    // Signal Blue
      secondary: '#9933FF',  // Noise Purple
      accent: '#00CCFF',     // Clear Channel
      gradient: 'linear-gradient(135deg, #0066FF, #9933FF)'
    }
  },
  'binary-system': {
    name: 'Binary System',
    description: 'Digital 0s and 1s',
    colors: {
      primary: '#00FF41',    // One Bright
      secondary: '#001A00',  // Zero Dark
      accent: '#00CC33',     // Data Stream
      gradient: 'linear-gradient(135deg, #001A00, #00FF41)'
    }
  },
  'entropy-spectrum': {
    name: 'Entropy Spectrum',
    description: 'Order to chaos',
    colors: {
      primary: '#00D4FF',    // Low Entropy
      secondary: '#FF00F6',  // High Entropy
      accent: '#00A4FF',     // Mid State
      gradient: 'linear-gradient(135deg, #00D4FF, #FF00F6)'
    }
  },
  'channel-capacity': {
    name: 'Channel Capacity ⭐',
    description: 'Information flow & depth',
    colors: {
      primary: '#00E5E5',    // Channel Cyan
      secondary: '#4B0082',  // Capacity Indigo
      accent: '#FFD700',     // Transmission Gold
      gradient: 'linear-gradient(135deg, #00E5E5, #4B0082)'
    }
  },
  'compression': {
    name: 'Compression',
    description: 'Raw to optimized',
    colors: {
      primary: '#4ECDC4',    // Compressed
      secondary: '#FF6B6B',  // Raw Data
      accent: '#95E1D3',     // Lossless
      gradient: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)'
    }
  }
};

// Complete icon list with all 40 icons
const iconGroups = [
  {
    title: 'Essential UI',
    icons: [
      { name: 'doodle-search', label: 'Search', component: DoodleSearchIcon },
      { name: 'doodle-menu', label: 'Menu', component: DoodleMenuIcon },
      { name: 'doodle-x', label: 'Close', component: DoodleXIcon },
      { name: 'doodle-check', label: 'Check', component: DoodleCheckIcon },
      { name: 'doodle-copy', label: 'Copy', component: DoodleCopyIcon },
      { name: 'doodle-filter', label: 'Filter', component: DoodleFilterIcon },
    ]
  },
  {
    title: 'Navigation',
    icons: [
      { name: 'doodle-chevron-right', label: 'Chevron Right', component: DoodleChevronRightIcon },
      { name: 'doodle-chevron-left', label: 'Chevron Left', component: DoodleChevronLeftIcon },
      { name: 'doodle-external-link', label: 'External Link', component: DoodleExternalLinkIcon },
      { name: 'doodle-link', label: 'Link', component: DoodleLinkIcon },
      { name: 'doodle-mouse-pointer', label: 'Mouse Pointer', component: DoodleMousePointerIcon },
      { name: 'doodle-move', label: 'Move', component: DoodleMoveIcon },
    ]
  },
  {
    title: 'Files & Folders',
    icons: [
      { name: 'doodle-folder', label: 'Folder', component: DoodleFolderIcon },
      { name: 'doodle-file-text', label: 'File Text', component: DoodleFileTextIcon },
      { name: 'doodle-file-code', label: 'File Code', component: DoodleFileCodeIcon },
      { name: 'doodle-file-image', label: 'File Image', component: DoodleFileImageIcon },
      { name: 'doodle-save', label: 'Save', component: DoodleSaveIcon },
      { name: 'doodle-book-open', label: 'Book Open', component: DoodleBookOpenIcon },
    ]
  },
  {
    title: 'Actions',
    icons: [
      { name: 'doodle-upload', label: 'Upload', component: DoodleUploadIcon },
      { name: 'doodle-download', label: 'Download', component: DoodleDownloadIcon },
      { name: 'doodle-undo', label: 'Undo', component: DoodleUndoIcon },
      { name: 'doodle-sparkles', label: 'Sparkles', component: DoodleSparklesIcon },
      { name: 'doodle-zap', label: 'Zap', component: DoodleZapIcon },
      { name: 'doodle-loader', label: 'Loader', component: DoodleLoaderIcon },
    ]
  },
  {
    title: 'Layout & Design',
    icons: [
      { name: 'doodle-layout', label: 'Layout', component: DoodleLayoutIcon },
      { name: 'doodle-component', label: 'Component', component: DoodleComponentIcon },
      { name: 'doodle-grid', label: 'Grid', component: DoodleGridIcon },
      { name: 'doodle-list', label: 'List', component: DoodleListIcon },
      { name: 'doodle-form-input', label: 'Form Input', component: DoodleFormInputIcon },
      { name: 'doodle-code', label: 'Code', component: DoodleCodeIcon },
    ]
  },
  {
    title: 'Communication',
    icons: [
      { name: 'doodle-message-square', label: 'Message', component: DoodleMessageSquareIcon },
      { name: 'doodle-user', label: 'User', component: DoodleUserIcon },
      { name: 'doodle-bot', label: 'Bot', component: DoodleBotIcon },
      { name: 'doodle-help-circle', label: 'Help', component: DoodleHelpCircleIcon },
      { name: 'doodle-info', label: 'Info', component: DoodleInfoIcon },
    ]
  },
  {
    title: 'Status & Security',
    icons: [
      { name: 'doodle-check-circle', label: 'Check Circle', component: DoodleCheckCircleIcon },
      { name: 'doodle-alert-circle', label: 'Alert Circle', component: DoodleAlertCircleIcon },
      { name: 'doodle-shield', label: 'Shield', component: DoodleShieldIcon },
      { name: 'doodle-lock', label: 'Lock', component: DoodleLockIcon },
      { name: 'doodle-github', label: 'GitHub', component: DoodleGithubIcon },
    ]
  }
];

export default function DoodleDemoPage() {
  const [selectedSize, setSelectedSize] = useState(24);
  const [selectedColor, setSelectedColor] = useState('currentColor');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [selectedPalette, setSelectedPalette] = useState('channel-capacity');

  const currentPalette = colorPalettes[selectedPalette];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Doodle Icons Collection
            </h1>
            <p className="text-lg text-gray-600 mb-1">
              Hand-drawn icons inspired by Notion, Linear & modern startups
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                40 Icons Total
              </span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                100% Customizable
              </span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                No Dependencies
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Shannon Color Palettes Showcase */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🎨 Shannon Theory Inspired Color Palettes
          </h2>
          
          {/* Palette Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {Object.entries(colorPalettes).map(([key, palette]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedPalette(key);
                  setSelectedColor(palette.colors.primary);
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedPalette === key 
                    ? 'border-gray-800 shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <div className="h-20 rounded-lg mb-3 overflow-hidden"
                     style={{ background: palette.colors.gradient }}>
                  <div className="h-full flex">
                    <div className="flex-1" style={{ backgroundColor: palette.colors.primary }} />
                    <div className="flex-1" style={{ backgroundColor: palette.colors.secondary }} />
                    <div className="flex-1" style={{ backgroundColor: palette.colors.accent }} />
                  </div>
                </div>
                <h3 className="font-semibold text-sm text-gray-900">
                  {palette.name}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {palette.description}
                </p>
              </button>
            ))}
          </div>

          {/* Current Palette Display */}
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Selected: {currentPalette.name}
              </h3>
              <div className="flex gap-2">
                {Object.entries(currentPalette.colors).filter(([key]) => key !== 'gradient').map(([key, color]) => (
                  <div key={key} className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg shadow-md mb-1 cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                    <p className="text-xs text-gray-600">{key}</p>
                    <code className="text-xs">{color}</code>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Example Usage */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button 
                className="flex items-center gap-2 px-5 py-2.5 text-white rounded-lg transition-all hover:scale-105"
                style={{ background: currentPalette.colors.gradient }}
              >
                <DoodleSparklesIcon size={20} color="white" />
                Gradient Button
              </button>
              
              <button 
                className="flex items-center gap-2 px-5 py-2.5 text-white rounded-lg transition-all"
                style={{ backgroundColor: currentPalette.colors.primary }}
              >
                <DoodleZapIcon size={20} />
                Primary Action
              </button>
              
              <button 
                className="flex items-center gap-2 px-5 py-2.5 text-white rounded-lg transition-all"
                style={{ backgroundColor: currentPalette.colors.secondary }}
              >
                <DoodleCheckIcon size={20} />
                Secondary
              </button>
              
              <button 
                className="flex items-center gap-2 px-5 py-2.5 border-2 rounded-lg transition-all"
                style={{ 
                  borderColor: currentPalette.colors.primary,
                  color: currentPalette.colors.primary 
                }}
              >
                <DoodleUploadIcon size={20} />
                Outline Style
              </button>
            </div>

            {/* Icon Examples with Current Palette */}
            <div className="mt-6 p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600 mb-3">Icons with your brand colors:</p>
              <div className="flex gap-4">
                <DoodleSearchIcon size={32} color={currentPalette.colors.primary} />
                <DoodleCodeIcon size={32} color={currentPalette.colors.secondary} />
                <DoodleBotIcon size={32} color={currentPalette.colors.accent} />
                <DoodleGithubIcon size={32} color={currentPalette.colors.primary} />
                <DoodleShieldIcon size={32} color={currentPalette.colors.secondary} />
                <DoodleMessageSquareIcon size={32} color={currentPalette.colors.accent} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {/* Size control */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Size:</label>
              <input
                type="range"
                min="16"
                max="48"
                value={selectedSize}
                onChange={(e) => setSelectedSize(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-gray-600 w-12">{selectedSize}px</span>
            </div>

            {/* Stroke width control */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Stroke:</label>
              <input
                type="range"
                min="1"
                max="4"
                step="0.5"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-gray-600 w-12">{strokeWidth}</span>
            </div>

            {/* Color presets from selected palette */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Color:</label>
              <div className="flex gap-1">
                <button
                  onClick={() => setSelectedColor('currentColor')}
                  className={`w-8 h-8 rounded-full bg-gray-800 ${selectedColor === 'currentColor' ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`}
                />
                <button
                  onClick={() => setSelectedColor(currentPalette.colors.primary)}
                  style={{ backgroundColor: currentPalette.colors.primary }}
                  className={`w-8 h-8 rounded-full ${selectedColor === currentPalette.colors.primary ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`}
                />
                <button
                  onClick={() => setSelectedColor(currentPalette.colors.secondary)}
                  style={{ backgroundColor: currentPalette.colors.secondary }}
                  className={`w-8 h-8 rounded-full ${selectedColor === currentPalette.colors.secondary ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`}
                />
                <button
                  onClick={() => setSelectedColor(currentPalette.colors.accent)}
                  style={{ backgroundColor: currentPalette.colors.accent }}
                  className={`w-8 h-8 rounded-full ${selectedColor === currentPalette.colors.accent ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Icon Groups */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {iconGroups.map((group) => (
          <div key={group.title} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
              {group.title}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {group.icons.map(({ name, label, component: IconComponent }) => (
                <div
                  key={name}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-gray-100"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <IconComponent 
                      size={selectedSize} 
                      color={selectedColor}
                      strokeWidth={strokeWidth}
                      className={selectedColor === 'currentColor' ? 'text-gray-800' : ''}
                    />
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                      {name}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Brand Color Implementation Examples */}
      <div className="bg-gradient-to-br from-white to-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Your Brand Colors in Action
          </h2>
          
          {/* Dashboard Example */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: currentPalette.colors.secondary }}>
              Dashboard with {currentPalette.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border-2" style={{ borderColor: currentPalette.colors.primary }}>
                <div className="flex items-center gap-3 mb-2">
                  <DoodleLayoutIcon size={24} color={currentPalette.colors.primary} />
                  <span className="font-medium">Analytics</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: currentPalette.colors.primary }}>
                  2,847
                </p>
                <p className="text-sm text-gray-600">Total views</p>
              </div>
              
              <div className="p-4 rounded-lg" style={{ background: `${currentPalette.colors.primary}15` }}>
                <div className="flex items-center gap-3 mb-2">
                  <DoodleZapIcon size={24} color={currentPalette.colors.accent} />
                  <span className="font-medium">Performance</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: currentPalette.colors.secondary }}>
                  98.5%
                </p>
                <p className="text-sm text-gray-600">Success rate</p>
              </div>
              
              <div className="p-4 rounded-lg text-white" style={{ background: currentPalette.colors.gradient }}>
                <div className="flex items-center gap-3 mb-2">
                  <DoodleSparklesIcon size={24} color="white" />
                  <span className="font-medium">AI Insights</span>
                </div>
                <p className="text-2xl font-bold">Active</p>
                <p className="text-sm opacity-90">Real-time analysis</p>
              </div>
            </div>
          </div>

          {/* Navigation Bar Example */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: currentPalette.colors.secondary }}>
              Navigation Style
            </h3>
            <div className="border rounded-lg p-4" style={{ borderColor: currentPalette.colors.primary + '40' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <span className="font-bold text-xl" style={{ color: currentPalette.colors.primary }}>
                    YourBrand
                  </span>
                  <nav className="flex gap-4">
                    <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
                       style={{ color: currentPalette.colors.primary, backgroundColor: currentPalette.colors.primary + '15' }}>
                      <DoodleLayoutIcon size={18} />
                      <span>Dashboard</span>
                    </a>
                    <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600">
                      <DoodleFolderIcon size={18} />
                      <span>Projects</span>
                    </a>
                    <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600">
                      <DoodleMessageSquareIcon size={18} />
                      <span>Messages</span>
                    </a>
                  </nav>
                </div>
                <button className="p-2 rounded-lg" style={{ backgroundColor: currentPalette.colors.accent }}>
                  <DoodleUserIcon size={20} color="white" />
                </button>
              </div>
            </div>
          </div>

          {/* Color Code Export */}
          <div className="bg-gray-900 text-gray-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Export Your Brand Colors
            </h3>
            <pre className="text-sm overflow-x-auto">
              <code>{`// Your Shannon-inspired Brand Colors
const brandColors = {
  primary: '${currentPalette.colors.primary}',
  secondary: '${currentPalette.colors.secondary}',
  accent: '${currentPalette.colors.accent}',
  gradient: '${currentPalette.colors.gradient}'
};

// Tailwind config
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand': {
          'primary': '${currentPalette.colors.primary}',
          'secondary': '${currentPalette.colors.secondary}',
          'accent': '${currentPalette.colors.accent}',
        }
      }
    }
  }
}`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Real-world Examples</h2>
          
          {/* Example buttons and UI elements */}
          <div className="space-y-8">
            {/* Buttons */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Modern Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all">
                  <DoodleSparklesIcon size={20} />
                  Generate with AI
                </button>
                
                <button className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all">
                  <DoodleGithubIcon size={20} />
                  Connect GitHub
                </button>
                
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all">
                  <DoodleUploadIcon size={20} />
                  Upload File
                </button>
                
                <button className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">
                  <DoodleCheckCircleIcon size={20} />
                  Complete
                </button>
              </div>
            </div>

            {/* Notification cards */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Notification Styles</h3>
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <DoodleInfoIcon className="text-blue-500 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium text-blue-900">Information</p>
                    <p className="text-sm text-blue-700">Your changes have been automatically saved.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <DoodleCheckCircleIcon className="text-green-500 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium text-green-900">Success!</p>
                    <p className="text-sm text-green-700">Your file has been uploaded successfully.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <DoodleAlertCircleIcon className="text-red-500 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium text-red-900">Error</p>
                    <p className="text-sm text-red-700">Something went wrong. Please try again.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation bar */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Navigation Bar</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <DoodleMenuIcon size={24} className="text-gray-700 cursor-pointer hover:text-gray-900" />
                    <div className="flex items-center gap-6">
                      <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-purple-600">
                        <DoodleLayoutIcon size={20} />
                        <span>Dashboard</span>
                      </a>
                      <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-purple-600">
                        <DoodleFolderIcon size={20} />
                        <span>Projects</span>
                      </a>
                      <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-purple-600">
                        <DoodleMessageSquareIcon size={20} />
                        <span>Messages</span>
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <DoodleSearchIcon size={20} className="text-gray-500 cursor-pointer hover:text-gray-700" />
                    <DoodleUserIcon size={20} className="text-gray-500 cursor-pointer hover:text-gray-700" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className="bg-gray-900 text-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">How to Use</h2>
          <div className="bg-gray-800 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm">
              <code>{`// Import the icons you need
import { 
  DoodleSparklesIcon, 
  DoodleUploadIcon 
} from '@/components/icons/DoodleIcons';

import { 
  DoodleBotIcon 
} from '@/components/icons/DoodleIconsPart2';

// Use in your components
function MyComponent() {
  return (
    <button>
      <DoodleSparklesIcon 
        size={24} 
        color="#8B5CF6" 
        strokeWidth={2} 
      />
      Generate Magic
    </button>
  );
}

// Or with Tailwind classes
<DoodleUploadIcon className="text-blue-500 hover:text-blue-600" />

// Responsive sizing
<DoodleBotIcon size={32} className="md:w-8 md:h-8 lg:w-10 lg:h-10" />`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}