// pdf-tools/types/privacy.ts

export interface ShareDestination {
  id: string;
  name: string;
  icon: string;
  url: string;
  privacyScore: number; // 0-10 (10 = most private)
  warning?: string;
}

export interface NetworkActivity {
  timestamp: number;
  url: string;
  method: string;
  type: 'internal' | 'external' | 'blocked';
  size?: number;
}

export interface PrivacyGateConfig {
  destination: ShareDestination;
  fileInfo: {
    name: string;
    size: number;
    type: string;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

export interface PrivacyStatus {
  mode: 'local' | 'sharing' | 'processing';
  filesProcessed: number;
  dataTransmitted: number;
  externalConnections: number;
  lastActivity?: NetworkActivity;
}

export const SHARE_DESTINATIONS: ShareDestination[] = [
      {
    id: 'onedrive',
    name: 'OneDrive',
    icon: '☁️',
    url: 'https://api.onedrive.com',
    privacyScore: 4,
    warning: 'File will be uploaded to Microsoft servers'
  },
  {
    id: 'download',
    name: 'Download',
    icon: '💾',
    url: 'local://download',
    privacyScore: 10,
  },
  {
    id: 'notion',
    name: 'Notion',
    icon: '📝',
    url: 'https://api.notion.com',
    privacyScore: 4,
    warning: 'File will be uploaded to Notion servers'
  },
  {
    id: 'gdrive',
    name: 'Google Drive',
    icon: '📁',
    url: 'https://drive.google.com',
    privacyScore: 3,
    warning: 'File will be uploaded to Google servers'
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    icon: '📦',
    url: 'https://api.dropboxapi.com',
    privacyScore: 4,
    warning: 'File will be uploaded to Dropbox servers'
  }
];