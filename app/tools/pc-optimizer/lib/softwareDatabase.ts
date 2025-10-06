import { SoftwareCategory } from './types'

// Known software patterns for identification
export interface SoftwarePattern {
  patterns: RegExp[]
  displayName: string
  category: SoftwareCategory
  description: string
  isStartup?: boolean
  estimatedCacheSize?: number
  tips?: string[]
}

export const knownSoftware: SoftwarePattern[] = [
  // Browsers
  {
    patterns: [/chrome\.exe$/i, /chrome/i],
    displayName: 'Google Chrome',
    category: 'browser',
    description: 'Web Browser',
    isStartup: false,
    estimatedCacheSize: 1024 * 1024 * 500, // 500MB average
    tips: [
      'Clear cache: Settings > Privacy and security > Clear browsing data',
      'Reduce extensions to improve performance',
    ],
  },
  {
    patterns: [/firefox\.exe$/i, /firefox/i],
    displayName: 'Mozilla Firefox',
    category: 'browser',
    description: 'Web Browser',
    isStartup: false,
    estimatedCacheSize: 1024 * 1024 * 400,
    tips: ['Check memory usage at about:performance'],
  },
  {
    patterns: [/msedge\.exe$/i, /edge/i],
    displayName: 'Microsoft Edge',
    category: 'browser',
    description: 'Web Browser (Windows Default)',
    isStartup: true,
    estimatedCacheSize: 1024 * 1024 * 400,
    tips: ['Default Windows browser - removal not recommended'],
  },

  // Communication
  {
    patterns: [/discord\.exe$/i, /discord/i],
    displayName: 'Discord',
    category: 'communication',
    description: 'Voice & Text Chat',
    isStartup: true,
    estimatedCacheSize: 1024 * 1024 * 1000,
    tips: [
      'Disable startup: Settings > Windows Settings',
      'Cache location: %AppData%/Discord/Cache',
    ],
  },
  {
    patterns: [/slack\.exe$/i, /slack/i],
    displayName: 'Slack',
    category: 'communication',
    description: 'Business Chat',
    isStartup: true,
    estimatedCacheSize: 1024 * 1024 * 500,
    tips: ['Cache increases with each workspace'],
  },
  {
    patterns: [/teams\.exe$/i, /teams/i],
    displayName: 'Microsoft Teams',
    category: 'communication',
    description: 'Business Communication',
    isStartup: true,
    estimatedCacheSize: 1024 * 1024 * 800,
    tips: ['Clear cache: %AppData%/Microsoft/Teams'],
  },
  {
    patterns: [/zoom\.exe$/i, /zoom/i],
    displayName: 'Zoom',
    category: 'communication',
    description: 'Video Conferencing',
    isStartup: true,
    estimatedCacheSize: 1024 * 1024 * 200,
    tips: ['Check recording file locations'],
  },

  // Gaming
  {
    patterns: [/steam\.exe$/i, /steam/i],
    displayName: 'Steam',
    category: 'gaming',
    description: 'Gaming Platform',
    isStartup: true,
    estimatedCacheSize: 1024 * 1024 * 2000,
    tips: ['Clean up game library regularly', 'Clear download cache: Settings > Downloads'],
  },
  {
    patterns: [/epicgameslauncher\.exe$/i, /epic.*games/i],
    displayName: 'Epic Games Launcher',
    category: 'gaming',
    description: 'Gaming Platform',
    isStartup: true,
    estimatedCacheSize: 1024 * 1024 * 1500,
    tips: ['Consider consolidating multiple launchers'],
  },
  {
    patterns: [/origin\.exe$/i, /origin/i],
    displayName: 'Origin (EA App)',
    category: 'gaming',
    description: 'EA Gaming Platform',
    isStartup: true,
    estimatedCacheSize: 1024 * 1024 * 800,
  },

  // Productivity
  {
    patterns: [/winword\.exe$/i, /word\.exe/i],
    displayName: 'Microsoft Word',
    category: 'productivity',
    description: 'Document Editor',
    isStartup: false,
    estimatedCacheSize: 1024 * 1024 * 100,
  },
  {
    patterns: [/excel\.exe$/i],
    displayName: 'Microsoft Excel',
    category: 'productivity',
    description: 'Spreadsheet Software',
    isStartup: false,
    estimatedCacheSize: 1024 * 1024 * 100,
  },
  {
    patterns: [/powerpnt\.exe$/i, /powerpoint/i],
    displayName: 'Microsoft PowerPoint',
    category: 'productivity',
    description: 'Presentation Software',
    isStartup: false,
    estimatedCacheSize: 1024 * 1024 * 100,
  },
  {
    patterns: [/outlook\.exe$/i],
    displayName: 'Microsoft Outlook',
    category: 'productivity',
    description: 'Email Client',
    isStartup: true,
    estimatedCacheSize: 1024 * 1024 * 500,
    tips: ['Monitor OST file size'],
  },

  // Media & Creative
  {
    patterns: [/photoshop\.exe$/i, /photoshop/i],
    displayName: 'Adobe Photoshop',
    category: 'media',
    description: 'Image Editor',
    isStartup: false,
    estimatedCacheSize: 1024 * 1024 * 2000,
    tips: ['Check scratch disk settings', 'Cache size: Edit > Preferences > Performance'],
  },
  {
    patterns: [/illustrator\.exe$/i, /illustrator/i],
    displayName: 'Adobe Illustrator',
    category: 'media',
    description: 'Vector Graphics Editor',
    isStartup: false,
    estimatedCacheSize: 1024 * 1024 * 1000,
  },
  {
    patterns: [/premiere.*pro/i, /premiere/i],
    displayName: 'Adobe Premiere Pro',
    category: 'media',
    description: 'Video Editor',
    isStartup: false,
    estimatedCacheSize: 1024 * 1024 * 5000,
    tips: ['Regularly clear media cache'],
  },
  {
    patterns: [/obs.*\.exe$/i, /obs64/i],
    displayName: 'OBS Studio',
    category: 'media',
    description: 'Broadcasting Software',
    isStartup: false,
    estimatedCacheSize: 1024 * 1024 * 100,
    tips: ['Check recording output folder'],
  },
  {
    patterns: [/spotify\.exe$/i],
    displayName: 'Spotify',
    category: 'media',
    description: 'Music Streaming',
    isStartup: true,
    estimatedCacheSize: 1024 * 1024 * 1000,
    tips: ['Offline music cache can be large'],
  },

  // Development
  {
    patterns: [/code\.exe$/i, /vscode/i],
    displayName: 'Visual Studio Code',
    category: 'development',
    description: 'Code Editor',
    isStartup: false,
    estimatedCacheSize: 1024 * 1024 * 500,
    tips: ['Clean up extensions for better performance'],
  },
  {
    patterns: [/devenv\.exe$/i, /visual.*studio/i],
    displayName: 'Visual Studio',
    category: 'development',
    description: 'IDE',
    isStartup: false,
    estimatedCacheSize: 1024 * 1024 * 3000,
    tips: ['Uninstall unused workloads'],
  },
  {
    patterns: [/node\.exe$/i],
    displayName: 'Node.js',
    category: 'development',
    description: 'JavaScript Runtime',
    isStartup: false,
    estimatedCacheSize: 1024 * 1024 * 500,
    tips: ['Consider clearing npm/yarn cache'],
  },
  {
    patterns: [/docker.*desktop/i, /docker/i],
    displayName: 'Docker Desktop',
    category: 'development',
    description: 'Container Platform',
    isStartup: true,
    estimatedCacheSize: 1024 * 1024 * 5000,
    tips: ['Remove unused images: docker image prune'],
  },

  // Security
  {
    patterns: [/avgui\.exe$/i, /avast/i],
    displayName: 'Avast Antivirus',
    category: 'security',
    description: 'Antivirus Software',
    isStartup: true,
    estimatedCacheSize: 1024 * 1024 * 200,
    tips: ['Check for conflicts with Windows Defender'],
  },
  {
    patterns: [/mcafee/i],
    displayName: 'McAfee',
    category: 'security',
    description: 'Security Software',
    isStartup: true,
    estimatedCacheSize: 1024 * 1024 * 300,
  },

  // Utility
  {
    patterns: [/dropbox\.exe$/i],
    displayName: 'Dropbox',
    category: 'utility',
    description: 'Cloud Storage',
    isStartup: true,
    estimatedCacheSize: 1024 * 1024 * 100,
    tips: ['Use selective sync to save space'],
  },
  {
    patterns: [/onedrive\.exe$/i],
    displayName: 'OneDrive',
    category: 'utility',
    description: 'Cloud Storage (MS Default)',
    isStartup: true,
    estimatedCacheSize: 1024 * 1024 * 100,
    tips: ['Windows default - disable carefully'],
  },
  {
    patterns: [/googledrive/i],
    displayName: 'Google Drive',
    category: 'utility',
    description: 'Cloud Storage',
    isStartup: true,
    estimatedCacheSize: 1024 * 1024 * 100,
  },
  {
    patterns: [/7z.*\.exe$/i, /7-?zip/i],
    displayName: '7-Zip',
    category: 'utility',
    description: 'File Archiver',
    isStartup: false,
    estimatedCacheSize: 0,
  },
  {
    patterns: [/ccleaner/i],
    displayName: 'CCleaner',
    category: 'utility',
    description: 'System Cleaner',
    isStartup: false,
    estimatedCacheSize: 0,
    tips: ['Run regularly to optimize PC'],
  },

  // System
  {
    patterns: [/explorer\.exe$/i],
    displayName: 'Windows Explorer',
    category: 'system',
    description: 'Windows System',
    isStartup: true,
    estimatedCacheSize: 0,
    tips: ['Cannot remove - Core Windows component'],
  },
  {
    patterns: [/nvidia/i, /geforce/i],
    displayName: 'NVIDIA Graphics Driver',
    category: 'system',
    description: 'Graphics Driver',
    isStartup: true,
    estimatedCacheSize: 1024 * 1024 * 500,
    tips: ['Clean up old driver versions'],
  },
  {
    patterns: [/realtek/i],
    displayName: 'Realtek Audio',
    category: 'system',
    description: 'Audio Driver',
    isStartup: true,
    estimatedCacheSize: 0,
  },
]

// Identify software from filename
export function identifySoftware(fileName: string, path: string): SoftwarePattern | null {
  const fullPath = `${path}\\${fileName}`.toLowerCase()

  for (const software of knownSoftware) {
    for (const pattern of software.patterns) {
      if (pattern.test(fileName) || pattern.test(fullPath)) {
        return software
      }
    }
  }

  return null
}

// Get category from path if software not identified
export function getCategoryFromPath(path: string): SoftwareCategory {
  const lowerPath = path.toLowerCase()

  if (lowerPath.includes('game') || lowerPath.includes('steam')) return 'gaming'
  if (lowerPath.includes('adobe') || lowerPath.includes('media')) return 'media'
  if (lowerPath.includes('microsoft office')) return 'productivity'
  if (lowerPath.includes('development') || lowerPath.includes('jetbrains')) return 'development'
  if (lowerPath.includes('security') || lowerPath.includes('antivirus')) return 'security'
  if (lowerPath.includes('system32') || lowerPath.includes('windows')) return 'system'

  return 'unknown'
}
