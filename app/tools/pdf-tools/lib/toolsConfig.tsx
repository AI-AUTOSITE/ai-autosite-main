import { ReactElement } from 'react'
import {
  RotateCw,
  FileStack,
  Scissors,
  PenTool,
  Highlighter,
  Crop,
  Minimize2,
  Lock,
  FileText,
  Image,
  Trash2,
} from 'lucide-react'
import { Tool } from '../types'

// ツールのアクション関数を定義
const toolActions = {
  rotate: () => console.log('Rotate action'),
  merge: () => console.log('Merge action'),
  split: () => console.log('Split action'),
  annotate: () => alert('Annotation feature coming soon!'),
  highlight: () => alert('Highlight feature coming soon!'),
  crop: () => alert('Crop feature coming soon!'),
  compress: () => console.log('Compress action'),
  password: () => alert('Password protection coming soon!'),
  toword: () => alert('Word conversion coming soon!'),
  toimage: () => alert('Image conversion coming soon!'),
  delete: () => console.log('Delete action'),
}

export const availableTools: Tool[] = [
  // Basic Tools
  {
    id: 'rotate',
    name: 'Turn Pages',
    description: 'Rotate left or right',
    icon: <RotateCw className="w-4 h-4" />,
    category: 'basic',
    color: 'blue',
    action: toolActions.rotate,
  },
  {
    id: 'merge',
    name: 'Join PDFs',
    description: 'Combine multiple files',
    icon: <FileStack className="w-4 h-4" />,
    category: 'basic',
    color: 'purple',
    action: toolActions.merge,
  },
  {
    id: 'split',
    name: 'Take Apart',
    description: 'Separate into parts',
    icon: <Scissors className="w-4 h-4" />,
    category: 'basic',
    color: 'orange',
    action: toolActions.split,
  },
  // Edit Tools
  {
    id: 'annotate',
    name: 'Add Notes',
    description: 'Write on your PDF',
    icon: <PenTool className="w-4 h-4" />,
    category: 'edit',
    color: 'green',
    action: toolActions.annotate,
  },
  {
    id: 'highlight',
    name: 'Highlight Text',
    description: 'Mark important parts',
    icon: <Highlighter className="w-4 h-4" />,
    category: 'edit',
    color: 'yellow',
    action: toolActions.highlight,
  },
  {
    id: 'crop',
    name: 'Cut Pages',
    description: 'Trim page edges',
    icon: <Crop className="w-4 h-4" />,
    category: 'edit',
    color: 'indigo',
    action: toolActions.crop,
  },
  // Optimize Tools
  {
    id: 'compress',
    name: 'Make Smaller',
    description: 'Reduce file size',
    icon: <Minimize2 className="w-4 h-4" />,
    category: 'optimize',
    color: 'red',
    action: toolActions.compress,
  },
  {
    id: 'password',
    name: 'Lock PDF',
    description: 'Add password protection',
    icon: <Lock className="w-4 h-4" />,
    category: 'optimize',
    color: 'gray',
    action: toolActions.password,
  },
  {
    id: 'delete',
    name: 'Delete Pages',
    description: 'Remove selected pages',
    icon: <Trash2 className="w-4 h-4" />,
    category: 'optimize',
    color: 'red',
    action: toolActions.delete,
  },
  // Convert Tools
  {
    id: 'toword',
    name: 'To Word',
    description: 'Convert to DOCX',
    icon: <FileText className="w-4 h-4" />,
    category: 'convert',
    color: 'blue',
    action: toolActions.toword,
  },
  {
    id: 'toimage',
    name: 'To Picture',
    description: 'Save as images',
    icon: <Image className="w-4 h-4" />,
    category: 'convert',
    color: 'green',
    action: toolActions.toimage,
  },
]

export const toolCategories = [
  { id: 'basic', name: 'Basic', description: 'Essential PDF operations' },
  { id: 'edit', name: 'Edit', description: 'Modify your documents' },
  { id: 'optimize', name: 'Optimize', description: 'Improve your PDFs' },
  { id: 'convert', name: 'Convert', description: 'Change file formats' },
]
