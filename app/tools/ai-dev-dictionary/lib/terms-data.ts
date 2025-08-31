// app/tools/ai-dev-dictionary/lib/terms-data.ts

export interface TechTerm {
  id: string
  term: string
  category: string
  aiSynonyms: string[]
  description: string
  aiPhrases: string[]
  codeExample: string
  demoType: 'modal' | 'toast' | 'dropdown' | 'accordion' | 'tabs' | 'tooltip' | 'drawer' | 'badge' | 'skeleton' | 'spinner' | 'progress' | 'alert'
  relatedTerms?: string[]
}

export const categories = [
  { id: 'all', name: 'All Terms', icon: '🎯' },
  { id: 'ui-components', name: 'UI Components', icon: '🎨' },
  { id: 'layout', name: 'Layout', icon: '📐' },
  { id: 'navigation', name: 'Navigation', icon: '🧭' },
  { id: 'forms', name: 'Forms', icon: '📝' },
  { id: 'feedback', name: 'Feedback', icon: '💬' },
  { id: 'advanced', name: 'Advanced', icon: '⚡' }
]

export const techTerms: TechTerm[] = [
  // UI Components
  {
    id: 'modal',
    term: 'Modal',
    category: 'ui-components',
    aiSynonyms: ['Dialog', 'Popup', 'Overlay', 'Lightbox', 'Dialog Box', 'Pop-up Window', 'Floating Window'],
    description: 'A window that appears on top of the main content, typically used for important interactions',
    aiPhrases: [
      'Show a modal when the user clicks the button',
      'Display this in a dialog box',
      'Create an overlay window for confirmation',
      'Open a popup to collect user input',
      'Present this form in a lightbox'
    ],
    codeExample: `// React Modal Example
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md">
        <button onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  )
}`,
    demoType: 'modal',
    relatedTerms: ['Toast', 'Drawer', 'Alert']
  },
  
  {
    id: 'toast',
    term: 'Toast',
    category: 'feedback',
    aiSynonyms: ['Notification', 'Alert', 'Snackbar', 'Flash Message', 'Popup Message', 'Brief Alert', 'Temporary Notification'],
    description: 'A brief message that appears temporarily, usually at the edge of the screen',
    aiPhrases: [
      'Show a toast notification for success',
      'Display a brief message at the bottom',
      'Add a snackbar for error messages',
      'Create a temporary alert',
      'Flash a success message to the user'
    ],
    codeExample: `// React Toast Example
const Toast = ({ message, type = 'info' }) => {
  return (
    <div className={\`fixed bottom-4 right-4 px-4 py-2 rounded-lg \${
      type === 'success' ? 'bg-green-500' : 'bg-blue-500'
    } text-white\`}>
      {message}
    </div>
  )
}`,
    demoType: 'toast',
    relatedTerms: ['Modal', 'Alert', 'Badge']
  },
  
  {
    id: 'dropdown',
    term: 'Dropdown',
    category: 'navigation',
    aiSynonyms: ['Select', 'Menu', 'Picker', 'Choice List', 'Options Menu', 'Pull-down Menu', 'Combobox'],
    description: 'A list of options that appears when clicked, allowing users to select from predefined choices',
    aiPhrases: [
      'Add a dropdown menu for navigation',
      'Create a select box for options',
      'Implement a picker for categories',
      'Show a menu when hovering',
      'Display choices in a pull-down list'
    ],
    codeExample: `// React Dropdown Example
const Dropdown = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)}>
        {value || 'Select an option'}
      </button>
      {isOpen && (
        <ul className="absolute top-full left-0 bg-white shadow-lg">
          {options.map(option => (
            <li key={option} onClick={() => onChange(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}`,
    demoType: 'dropdown',
    relatedTerms: ['Accordion', 'Tabs', 'Menu']
  },
  
  {
    id: 'accordion',
    term: 'Accordion',
    category: 'ui-components',
    aiSynonyms: ['Collapsible', 'Expandable', 'Dropdown Panel', 'Toggle Content', 'Foldable Section', 'Collapse Panel'],
    description: 'Expandable/collapsible content sections that show or hide information',
    aiPhrases: [
      'Create collapsible sections for FAQs',
      'Add expandable content areas',
      'Implement toggle panels for details',
      'Make sections that can be collapsed',
      'Build an accordion for Q&A'
    ],
    codeExample: `// React Accordion Example
const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null)
  
  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          <button onClick={() => setOpenIndex(index === openIndex ? null : index)}>
            {item.title}
          </button>
          {openIndex === index && (
            <div className="p-4">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  )
}`,
    demoType: 'accordion',
    relatedTerms: ['Tabs', 'Dropdown', 'Collapsible']
  },
  
  {
    id: 'tabs',
    term: 'Tabs',
    category: 'navigation',
    aiSynonyms: ['Tab Panel', 'Tabbed Interface', 'Tab Navigation', 'Page Tabs', 'Section Switcher', 'Tab Bar'],
    description: 'Navigation component that switches between different views or content sections',
    aiPhrases: [
      'Add tabs to switch between views',
      'Create a tabbed interface',
      'Implement tab navigation for sections',
      'Use tabs to organize content',
      'Build a tab panel for categories'
    ],
    codeExample: `// React Tabs Example
const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0)
  
  return (
    <div>
      <div className="flex border-b">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={activeTab === index ? 'border-b-2 border-blue-500' : ''}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {tabs[activeTab].content}
      </div>
    </div>
  )
}`,
    demoType: 'tabs',
    relatedTerms: ['Accordion', 'Navigation', 'Menu']
  },
  
  {
    id: 'tooltip',
    term: 'Tooltip',
    category: 'feedback',
    aiSynonyms: ['Hover Text', 'Help Text', 'Info Bubble', 'Hint', 'Popover', 'Helper Text', 'Hover Hint'],
    description: 'Small text that appears when hovering over an element to provide additional information',
    aiPhrases: [
      'Show a tooltip on hover',
      'Add help text when hovering',
      'Display additional info in a bubble',
      'Create hover hints for buttons',
      'Implement helper text on mouseover'
    ],
    codeExample: `// React Tooltip Example
const Tooltip = ({ children, text }) => {
  const [show, setShow] = useState(false)
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {show && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm">
          {text}
        </div>
      )}
    </div>
  )
}`,
    demoType: 'tooltip',
    relatedTerms: ['Popover', 'Help Text', 'Modal']
  },
  
  {
    id: 'drawer',
    term: 'Drawer',
    category: 'navigation',
    aiSynonyms: ['Sidebar', 'Slide Panel', 'Side Menu', 'Navigation Drawer', 'Sliding Panel', 'Off-canvas Menu'],
    description: 'A panel that slides in from the edge of the screen, typically used for navigation or additional options',
    aiPhrases: [
      'Add a drawer for mobile navigation',
      'Create a sliding sidebar',
      'Implement a side panel for settings',
      'Build an off-canvas menu',
      'Show navigation in a drawer'
    ],
    codeExample: `// React Drawer Example
const Drawer = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      )}
      <div className={\`fixed left-0 top-0 h-full bg-white transform transition-transform \${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }\`}>
        {children}
      </div>
    </>
  )
}`,
    demoType: 'drawer',
    relatedTerms: ['Modal', 'Sidebar', 'Navigation']
  },
  
  {
    id: 'badge',
    term: 'Badge',
    category: 'ui-components',
    aiSynonyms: ['Tag', 'Chip', 'Label', 'Pill', 'Status Indicator', 'Count Bubble', 'Notification Dot'],
    description: 'Small label or indicator often used to show status, count, or category',
    aiPhrases: [
      'Add a badge to show count',
      'Display status with a label',
      'Show categories using tags',
      'Create notification badges',
      'Implement status chips'
    ],
    codeExample: `// React Badge Example
const Badge = ({ text, variant = 'primary' }) => {
  const colors = {
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500'
  }
  
  return (
    <span className={\`px-2 py-1 text-xs rounded-full text-white \${colors[variant]}\`}>
      {text}
    </span>
  )
}`,
    demoType: 'badge',
    relatedTerms: ['Tag', 'Chip', 'Label']
  },
  
  {
    id: 'skeleton',
    term: 'Skeleton',
    category: 'feedback',
    aiSynonyms: ['Loading Placeholder', 'Content Loader', 'Ghost Element', 'Shimmer', 'Loading State', 'Placeholder UI'],
    description: 'Placeholder UI that shows the structure of content while it\'s loading',
    aiPhrases: [
      'Show skeleton while loading',
      'Add loading placeholders',
      'Display ghost elements during fetch',
      'Create shimmer effect for loading',
      'Implement content loaders'
    ],
    codeExample: `// React Skeleton Example
const Skeleton = ({ width = '100%', height = '20px' }) => {
  return (
    <div
      className="bg-gray-300 animate-pulse rounded"
      style={{ width, height }}
    />
  )
}

// Usage
<div>
  <Skeleton width="200px" height="24px" /> {/* Title */}
  <Skeleton width="100%" height="16px" />  {/* Text line */}
  <Skeleton width="80%" height="16px" />   {/* Text line */}
</div>`,
    demoType: 'skeleton',
    relatedTerms: ['Spinner', 'Loading', 'Progress']
  },
  
  {
    id: 'spinner',
    term: 'Spinner',
    category: 'feedback',
    aiSynonyms: ['Loading Spinner', 'Loader', 'Loading Indicator', 'Progress Circle', 'Activity Indicator', 'Busy Indicator'],
    description: 'Animated indicator that shows something is loading or processing',
    aiPhrases: [
      'Show a loading spinner',
      'Add a loader while fetching',
      'Display activity indicator',
      'Create a spinning loader',
      'Implement busy state indicator'
    ],
    codeExample: `// React Spinner Example
const Spinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }
  
  return (
    <div className={\`\${sizes[size]} border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin\`} />
  )
}`,
    demoType: 'spinner',
    relatedTerms: ['Skeleton', 'Progress', 'Loading']
  },
  
  {
    id: 'progress',
    term: 'Progress Bar',
    category: 'feedback',
    aiSynonyms: ['Progress Indicator', 'Loading Bar', 'Progress Track', 'Completion Bar', 'Status Bar', 'Progress Meter'],
    description: 'Visual indicator showing the completion status of a task or process',
    aiPhrases: [
      'Show progress bar for upload',
      'Display loading progress',
      'Add completion indicator',
      'Create a progress track',
      'Implement status bar for tasks'
    ],
    codeExample: `// React Progress Bar Example
const ProgressBar = ({ value, max = 100 }) => {
  const percentage = (value / max) * 100
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-blue-500 h-2 rounded-full transition-all"
        style={{ width: \`\${percentage}%\` }}
      />
    </div>
  )
}`,
    demoType: 'progress',
    relatedTerms: ['Spinner', 'Loading', 'Status']
  },
  
  {
    id: 'alert',
    term: 'Alert',
    category: 'feedback',
    aiSynonyms: ['Warning', 'Notice', 'Message Box', 'Info Box', 'Notification Banner', 'Callout', 'Announcement'],
    description: 'Prominent message box that displays important information or warnings',
    aiPhrases: [
      'Show an alert for errors',
      'Display warning message',
      'Add info box for tips',
      'Create notification banner',
      'Implement callout for important info'
    ],
    codeExample: `// React Alert Example
const Alert = ({ type = 'info', title, message }) => {
  const styles = {
    info: 'bg-blue-100 border-blue-500 text-blue-700',
    success: 'bg-green-100 border-green-500 text-green-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    error: 'bg-red-100 border-red-500 text-red-700'
  }
  
  return (
    <div className={\`border-l-4 p-4 \${styles[type]}\`}>
      <h4 className="font-bold">{title}</h4>
      <p>{message}</p>
    </div>
  )
}`,
    demoType: 'alert',
    relatedTerms: ['Toast', 'Modal', 'Banner']
  }
]