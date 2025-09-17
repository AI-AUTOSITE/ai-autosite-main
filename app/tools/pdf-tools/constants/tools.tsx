// app/tools/pdf-tools/constants/tools.tsx
import { 
  RotateCw, FileStack, Scissors, Trash2, 
  Minimize2, PenTool, Highlighter, Crop,
  Hash, FileText, Copy, ScanLine, Lock, 
  Droplets, Edit2, FileSpreadsheet  // すべてのアイコンを追加
} from 'lucide-react';
import { Tool } from '../types';

export const availableTools: Tool[] = [
  {
    id: 'rotate',
    name: 'Rotate',
    icon: <RotateCw className="w-4 h-4" />,
    category: 'basic',
    action: () => {}
  },
  {
    id: 'merge',
    name: 'Merge',
    icon: <FileStack className="w-4 h-4" />,
    category: 'basic',
    action: () => {}
  },
  {
    id: 'split',
    name: 'Split',
    icon: <Scissors className="w-4 h-4" />,
    category: 'basic',
    action: () => {}
  },
  {
    id: 'delete',
    name: 'Delete',
    icon: <Trash2 className="w-4 h-4" />,
    category: 'optimize',
    action: () => {}
  },
  {
    id: 'compress',
    name: 'Compress',
    icon: <Minimize2 className="w-4 h-4" />,
    category: 'optimize',
    action: () => {}
  },
  {
    id: 'password',
    name: 'Password',
    icon: <Lock className="w-4 h-4" />,
    category: 'optimize',
    action: () => {}
  },
  {
    id: 'annotate',
    name: 'Annotate',
    icon: <PenTool className="w-4 h-4" />,
    category: 'edit',
    action: () => {}
  },
  {
    id: 'highlight',
    name: 'Highlight',
    icon: <Highlighter className="w-4 h-4" />,
    category: 'edit',
    action: () => {}
  },
  {
    id: 'crop',
    name: 'Crop',
    icon: <Crop className="w-4 h-4" />,
    category: 'edit',
    action: () => {}
  },
  {
    id: 'watermark',
    name: 'Watermark',
    icon: <Droplets className="w-4 h-4" />,
    category: 'edit',
    action: () => {}
  },
  {
    id: 'signature',
    name: 'Signature',
    icon: <Edit2 className="w-4 h-4" />,
    category: 'edit',
    action: () => {}
  },
  {
    id: 'pageNumbers',
    name: 'Page Numbers',
    icon: <Hash className="w-4 h-4" />,
    category: 'basic',
    action: () => {}
  },
  {
    id: 'blankPage',
    name: 'Blank Page',
    icon: <FileText className="w-4 h-4" />,
    category: 'basic',
    action: () => {}
  },
  {
    id: 'duplicate',
    name: 'Duplicate',
    icon: <Copy className="w-4 h-4" />,
    category: 'basic',
    action: () => {}
  },
  {
    id: 'ocr',
    name: 'OCR',
    icon: <ScanLine className="w-4 h-4" />,
    category: 'convert',
    action: () => {}
  },
  {
    id: 'toWord',
    name: 'To Word',
    icon: <FileText className="w-4 h-4" />,
    category: 'convert',
    action: () => {}
  },
  {
    id: 'toExcel',
    name: 'To Excel',
    icon: <FileSpreadsheet className="w-4 h-4" />,
    category: 'convert',
    action: () => {}
  }
];

export const MAX_FREE_SLOTS = 3;