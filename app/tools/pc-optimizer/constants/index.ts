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
  PARSE_ERROR: 'Failed to parse CSV file. Please check the file format.',
  ANALYSIS_ERROR: 'An error occurred during analysis. Please try again.',
  INVALID_DATA: 'Invalid data format detected in the CSV file.',
  NO_DATA_FOUND: 'No software data found in the uploaded file',
  FILE_TOO_LARGE: 'File size must be under 10MB',
  INVALID_FILE_TYPE: 'Only CSV files are supported',
  FILE_READ_ERROR: 'Failed to read file',
  UNEXPECTED_ERROR: 'An unexpected error occurred while analyzing the file',
} as const

export const UI_MESSAGES = {
  UPLOAD: {
    TITLE: 'Upload File',
    DROP_TEXT: 'Drop CSV file here',
    CLICK_TEXT: 'or click to select file',
    ANALYZING: 'Analyzing file...',
    PRIVACY_NOTE: 'Uploaded files are automatically deleted after analysis',
    NO_PERSONAL_INFO: 'No personal information or file contents are saved',
  },
  ANALYSIS: {
    SUMMARY_TITLE: 'Analysis Summary',
    TOTAL_SIZE: 'Total Size',
    CACHE_EST: 'Cache (Est.)',
    REMOVABLE: 'Removable',
    TOTAL_APPS: 'Total Apps',
    OPTIMIZATION_TITLE: 'Optimization Recommendations',
    DETAILS_TITLE: 'Details',
    OPTIMIZATION_TIPS: 'Optimization Tips',
  },
  GUIDE: {
    TITLE: 'How to Collect File Data',
    SECURITY_TITLE: 'About Security',
    SECURITY_DESC: 'This script only collects file metadata (name, size, date).',
    SECURITY_NOTE: 'No executable content or personal information is included.',
    STEPS_TITLE: 'Steps to Run',
    PROCESSING_TIME: 'Processing Time:',
    PROCESSING_NOTE:
      'May take 1-5 minutes depending on the number of files. Wait for "File created" message to appear.',
  },
} as const

export const PRIORITY_CONFIG = {
  critical: {
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    label: 'System Critical',
    warning: 'This software is required for system operation. Do not remove.',
  },
  high: {
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    label: 'Frequently Used',
  },
  medium: {
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    label: 'Occasionally Used',
  },
  low: {
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    label: 'Rarely Used',
  },
  removable: {
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    label: 'Safe to Remove',
    warning:
      "This software hasn't been used for over 3 months. Consider uninstalling to free up space.",
    uninstallGuide: 'To uninstall: Settings → Apps → Apps & features → {name} → Uninstall',
  },
} as const

export const CATEGORY_CONFIG = {
  browser: { name: 'Browser', iconClass: 'Globe' },
  gaming: { name: 'Gaming', iconClass: 'Gamepad2' },
  productivity: { name: 'Productivity', iconClass: 'Wrench' },
  development: { name: 'Development', iconClass: 'Code' },
  media: { name: 'Media & Creative', iconClass: 'Image' },
  communication: { name: 'Communication', iconClass: 'MessageSquare' },
  security: { name: 'Security', iconClass: 'Shield' },
  utility: { name: 'Utility', iconClass: 'Wrench' },
  system: { name: 'System', iconClass: 'Shield' },
  unknown: { name: 'Other', iconClass: 'HelpCircle' },
} as const
