import React from 'react';
import {
  RotateCw,
  FileStack,
  Scissors,
  Trash2,
  Minimize2,
  Hash,
  FileText,
  Copy,
  ScanLine,
  Lock,
  Droplets,
  Edit2,
  FileSpreadsheet,
  PenTool,
  Highlighter,
  Crop
} from 'lucide-react';
import { Tool } from '../types';

export const MAX_FREE_SLOTS = 3;

export const availableTools: Tool[] = [
  {
    id: 'rotate',
    name: 'Rotate',
    icon: <RotateCw className="w-4 h-4" />,
    category: 'basic',
    action: () => {},
    description: 'Rotate pages left or right',
    color: 'blue'
  },
  {
    id: 'merge',
    name: 'Merge',
    icon: <FileStack className="w-4 h-4" />,
    category: 'basic',
    action: () => {},
    description: 'Combine multiple PDFs',
    color: 'purple'
  },
  {
    id: 'split',
    name: 'Split',
    icon: <Scissors className="w-4 h-4" />,
    category: 'basic',
    action: () => {},
    description: 'Extract or separate pages',
    color: 'orange'
  },
  {
    id: 'delete',
    name: 'Delete',
    icon: <Trash2 className="w-4 h-4" />,
    category: 'optimize',
    action: () => {},
    description: 'Remove selected pages',
    color: 'red'
  },
  {
    id: 'compress',
    name: 'Compress',
    icon: <Minimize2 className="w-4 h-4" />,
    category: 'optimize',
    action: () => {},
    description: 'Reduce file size',
    color: 'green'
  },
  {
    id: 'pageNumbers',
    name: 'Page Numbers',
    icon: <Hash className="w-4 h-4" />,
    category: 'basic',
    action: () => {},
    description: 'Add page numbers',
    color: 'indigo'
  },
  {
    id: 'blankPage',
    name: 'Blank Page',
    icon: <FileText className="w-4 h-4" />,
    category: 'basic',
    action: () => {},
    description: 'Insert blank pages',
    color: 'gray'
  },
  {
    id: 'duplicate',
    name: 'Duplicate',
    icon: <Copy className="w-4 h-4" />,
    category: 'basic',
    action: () => {},
    description: 'Duplicate selected pages',
    color: 'cyan'
  },
  {
    id: 'ocr',
    name: 'OCR',
    icon: <ScanLine className="w-4 h-4" />,
    category: 'convert',
    action: () => {},
    description: 'Extract text with OCR',
    color: 'purple'
  },
  {
    id: 'password',
    name: 'Password',
    icon: <Lock className="w-4 h-4" />,
    category: 'optimize',
    action: () => {},
    description: 'Add or remove password',
    color: 'yellow'
  },
  {
    id: 'watermark',
    name: 'Watermark',
    icon: <Droplets className="w-4 h-4" />,
    category: 'edit',
    action: () => {},
    description: 'Add watermark to pages',
    color: 'blue'
  },
  {
    id: 'signature',
    name: 'Signature',
    icon: <Edit2 className="w-4 h-4" />,
    category: 'edit',
    action: () => {},
    description: 'Add signature or stamp',
    color: 'green'
  },
  {
    id: 'toWord',
    name: 'To Word',
    icon: <FileText className="w-4 h-4" />,
    category: 'convert',
    action: () => {},
    description: 'Convert to Word document',
    color: 'blue'
  },
  {
    id: 'toExcel',
    name: 'To Excel',
    icon: <FileSpreadsheet className="w-4 h-4" />,
    category: 'convert',
    action: () => {},
    description: 'Convert to Excel spreadsheet',
    color: 'green'
  },
  {
    id: 'annotate',
    name: 'Annotate',
    icon: <PenTool className="w-4 h-4" />,
    category: 'edit',
    action: () => {},
    description: 'Add notes and annotations',
    color: 'orange'
  },
  {
    id: 'highlight',
    name: 'Highlight',
    icon: <Highlighter className="w-4 h-4" />,
    category: 'edit',
    action: () => {},
    description: 'Highlight text',
    color: 'yellow'
  },
  {
    id: 'crop',
    name: 'Crop',
    icon: <Crop className="w-4 h-4" />,
    category: 'edit',
    action: () => {},
    description: 'Crop page areas',
    color: 'indigo'
  }
];