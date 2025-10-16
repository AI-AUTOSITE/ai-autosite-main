// app/tools/pc-optimizer/constants/index.ts

export const FILE_CONSTANTS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_TYPES: '.csv',
  OUTPUT_FILENAME: 'pc_files_info.csv',
} as const

export const SIZE_UNITS = ['B', 'KB', 'MB', 'GB'] as const
export const SIZE_DIVISOR = 1024

export const TIME_UNITS = {
  DAY: 1000 * 60 * 60 * 24,
  WEEK: 7,
  MONTH: 30,
  YEAR: 365,
} as const

export const ERROR_MESSAGES = {
  PARSE_ERROR: 'Cannot read CSV file. Check format.',
  ANALYSIS_ERROR: 'Analysis failed. Try again.',
  INVALID_DATA: 'Invalid CSV format.',
  NO_DATA_FOUND: 'No data found in file',
  FILE_TOO_LARGE: 'File too large (max 10MB)',
  INVALID_FILE_TYPE: 'CSV files only',
  FILE_READ_ERROR: 'Cannot read file',
  UNEXPECTED_ERROR: 'Error occurred. Try again.',
} as const

export const UI_MESSAGES = {
  UPLOAD: {
    TITLE: 'Upload File',
    DROP_TEXT: 'Drop CSV here',
    CLICK_TEXT: 'or tap to select',
    ANALYZING: 'Analyzing...',
    PRIVACY_NOTE: 'Files deleted after analysis',
    NO_PERSONAL_INFO: 'No data saved',
  },
  ANALYSIS: {
    SUMMARY_TITLE: 'Summary',
    TOTAL_SIZE: 'Total Size',
    CACHE_EST: 'Cache',
    REMOVABLE: 'Removable',
    TOTAL_APPS: 'Apps',
    OPTIMIZATION_TITLE: 'Save Space',
    DETAILS_TITLE: 'Details',
    OPTIMIZATION_TIPS: 'Tips',
  },
  GUIDE: {
    TITLE: 'How to Get Data',
    SECURITY_TITLE: 'Security',
    SECURITY_DESC: 'Only file info collected (name, size, date).',
    SECURITY_NOTE: 'No personal data included.',
    STEPS_TITLE: 'Steps',
    PROCESSING_TIME: 'Time:',
    PROCESSING_NOTE:
      '1-5 minutes. Wait for completion.',
  },
} as const

export const PRIORITY_CONFIG = {
  critical: {
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    label: 'System Critical',
    warning: 'Required for Windows. Do not remove.',
  },
  high: {
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    label: 'Used Often',
  },
  medium: {
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    label: 'Sometimes Used',
  },
  low: {
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    label: 'Rarely Used',
  },
  removable: {
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    label: 'Can Remove',
    warning:
      'Not used for 3+ months. Safe to uninstall.',
    uninstallGuide: 'Uninstall: Settings - Apps - {name} - Uninstall',
  },
} as const

export const CATEGORY_CONFIG = {
  browser: { name: 'Browser', iconClass: 'Globe' },
  gaming: { name: 'Gaming', iconClass: 'Gamepad2' },
  productivity: { name: 'Productivity', iconClass: 'Wrench' },
  development: { name: 'Development', iconClass: 'Code' },
  media: { name: 'Media', iconClass: 'Image' },
  communication: { name: 'Chat', iconClass: 'MessageSquare' },
  security: { name: 'Security', iconClass: 'Shield' },
  utility: { name: 'Utility', iconClass: 'Wrench' },
  system: { name: 'System', iconClass: 'Shield' },
  unknown: { name: 'Other', iconClass: 'HelpCircle' },
} as const