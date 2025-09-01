// app/tools/ai-dev-dictionary/lib/terms-data.ts

export interface TechTerm {
  id: string
  term: string
  category: string
  aiSynonyms: string[]
  description: string
  beginnerTip: string  // Added for beginners
  aiPhrases: string[]
  codeExample: string
  demoType: string
  relatedTerms?: string[]
}

export const categories = [
  { id: 'all', name: 'All Terms', icon: '🎯' },
  { id: 'ui-components', name: 'UI Components', icon: '🎨' },
  { id: 'data-display', name: 'Data Display', icon: '📊' },
  { id: 'forms', name: 'Forms & Input', icon: '📝' },
  { id: 'layout', name: 'Layout', icon: '📐' },
  { id: 'navigation', name: 'Navigation', icon: '🧭' },
  { id: 'feedback', name: 'Feedback', icon: '💬' },
  { id: 'advanced', name: 'Advanced', icon: '⚡' }
]

export const techTerms: TechTerm[] = [
  // ===== UI COMPONENTS =====
  {
    id: 'modal',
    term: 'Modal',
    category: 'ui-components',
    aiSynonyms: ['Dialog', 'Popup', 'Overlay', 'Lightbox', 'Dialog Box', 'Pop-up Window', 'Floating Window', 'Modal Window'],
    description: 'A window that appears on top of the main content, requiring user interaction before continuing',
    beginnerTip: 'Think of it like a "pause screen" in a game - everything else stops until you deal with it!',
    aiPhrases: [
      'Show a modal when the user clicks the button',
      'Display this in a dialog box',
      'Create an overlay window for confirmation',
      'Open a popup to collect user input',
      'Present this form in a lightbox',
      'Show a floating window with options'
    ],
    codeExample: `// React Modal Example - Super Simple!
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;  // Don't show if closed
  
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}`,
    demoType: 'modal',
    relatedTerms: ['Toast', 'Drawer', 'Alert', 'Dialog']
  },

  {
    id: 'card',
    term: 'Card',
    category: 'ui-components',
    aiSynonyms: ['Panel', 'Tile', 'Box', 'Container', 'Content Card', 'Info Card', 'Widget'],
    description: 'A rectangular container that groups related information together, like a playing card',
    beginnerTip: 'Imagine a business card or trading card - it contains all related info in one neat package!',
    aiPhrases: [
      'Display each item in a card',
      'Create cards for the products',
      'Show information in card format',
      'Use cards to organize content',
      'Make card components for each user',
      'Wrap content in a card container'
    ],
    codeExample: `// React Card Example - Like a Container!
const Card = ({ title, content, image }) => {
  return (
    <div className="card">
      {image && <img src={image} alt={title} />}
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
}`,
    demoType: 'card',
    relatedTerms: ['Panel', 'Container', 'Box']
  },

  // ===== DATA DISPLAY =====
  {
    id: 'table',
    term: 'Table',
    category: 'data-display',
    aiSynonyms: ['Data Table', 'Grid', 'DataGrid', 'Spreadsheet View', 'Tabular Data', 'Data Grid', 'Table View'],
    description: 'Displays data in rows and columns, like an Excel spreadsheet',
    beginnerTip: 'Just like a spreadsheet or a list with columns - perfect for showing lots of organized data!',
    aiPhrases: [
      'Display the data in a table format',
      'Create a grid view for the records',
      'Show results in tabular form',
      'Add a data table with sorting',
      'Implement a spreadsheet-like view',
      'Present data in rows and columns'
    ],
    codeExample: `// React Table Example - Like Excel!
const Table = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            <td>{row.name}</td>
            <td>{row.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}`,
    demoType: 'table',
    relatedTerms: ['Grid', 'List', 'DataGrid']
  },

  {
    id: 'list',
    term: 'List',
    category: 'data-display',
    aiSynonyms: ['Item List', 'List View', 'Listing', 'Collection', 'Index', 'Directory'],
    description: 'A vertical arrangement of items, like a shopping list or to-do list',
    beginnerTip: 'Think of your grocery list or contacts in your phone - items stacked one after another!',
    aiPhrases: [
      'Show items in a list',
      'Create a list view',
      'Display as a vertical list',
      'Make a listing of products',
      'Show collection as list items',
      'Present options in a list format'
    ],
    codeExample: `// React List Example - Simple & Clean!
const List = ({ items }) => {
  return (
    <ul className="list">
      {items.map(item => (
        <li key={item.id}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}`,
    demoType: 'list',
    relatedTerms: ['Table', 'Grid', 'Card']
  },

  {
    id: 'carousel',
    term: 'Carousel',
    category: 'data-display',
    aiSynonyms: ['Slider', 'Image Slider', 'Gallery', 'Slideshow', 'Image Carousel', 'Content Slider', 'Swiper'],
    description: 'A rotating display of images or content, like a photo slideshow',
    beginnerTip: 'Like flipping through photos on your phone - swipe to see the next one!',
    aiPhrases: [
      'Add a carousel for the images',
      'Create an image slider',
      'Implement a slideshow',
      'Make a gallery with navigation',
      'Build a content slider',
      'Add swipeable image gallery'
    ],
    codeExample: `// React Carousel Example - Swipe Through!
const Carousel = ({ images }) => {
  const [current, setCurrent] = useState(0);
  
  return (
    <div className="carousel">
      <img src={images[current]} />
      <button onClick={() => setCurrent(current - 1)}>
        Previous
      </button>
      <button onClick={() => setCurrent(current + 1)}>
        Next
      </button>
    </div>
  );
}`,
    demoType: 'carousel',
    relatedTerms: ['Gallery', 'Slider', 'Slideshow']
  },

  // ===== FORMS & INPUT =====
  {
    id: 'checkbox',
    term: 'Checkbox',
    category: 'forms',
    aiSynonyms: ['Check Box', 'Tick Box', 'Selection Box', 'Check Mark', 'Toggle Box', 'Multi-select'],
    description: 'A small box that can be checked or unchecked, allowing multiple selections',
    beginnerTip: 'Like a checklist where you can select multiple items - tick as many as you want!',
    aiPhrases: [
      'Add checkboxes for multiple selection',
      'Create tick boxes for options',
      'Let users check multiple items',
      'Add selection boxes',
      'Implement multi-select with checkboxes',
      'Use checkmarks for preferences'
    ],
    codeExample: `// React Checkbox Example - Check It!
const Checkbox = ({ label, checked, onChange }) => {
  return (
    <label className="checkbox-label">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  );
}`,
    demoType: 'checkbox',
    relatedTerms: ['Radio Button', 'Switch', 'Toggle']
  },

  {
    id: 'radio',
    term: 'Radio Button',
    category: 'forms',
    aiSynonyms: ['Radio', 'Option Button', 'Radio Select', 'Single Select', 'Choice Button', 'Radio Input'],
    description: 'Circular buttons where only one option can be selected from a group',
    beginnerTip: 'Like old car radios - you can only listen to one station at a time!',
    aiPhrases: [
      'Add radio buttons for single selection',
      'Create option buttons',
      'Use radio inputs for choices',
      'Implement single-select options',
      'Add radio group for selection',
      'Make mutually exclusive choices'
    ],
    codeExample: `// React Radio Button Example - Pick One!
const RadioGroup = ({ options, selected, onChange }) => {
  return (
    <div>
      {options.map(option => (
        <label key={option}>
          <input
            type="radio"
            value={option}
            checked={selected === option}
            onChange={() => onChange(option)}
          />
          {option}
        </label>
      ))}
    </div>
  );
}`,
    demoType: 'radio',
    relatedTerms: ['Checkbox', 'Select', 'Dropdown']
  },

  {
    id: 'switch',
    term: 'Switch',
    category: 'forms',
    aiSynonyms: ['Toggle', 'Toggle Switch', 'On/Off Switch', 'Toggle Button', 'Binary Switch', 'Flip Switch'],
    description: 'A sliding button that toggles between on and off states',
    beginnerTip: 'Like a light switch - flip it on or off. Perfect for settings!',
    aiPhrases: [
      'Add a toggle switch for settings',
      'Create an on/off switch',
      'Implement toggle button',
      'Use switch for enabling features',
      'Add toggle for preferences',
      'Make a flip switch control'
    ],
    codeExample: `// React Switch Example - Flip It!
const Switch = ({ isOn, onToggle }) => {
  return (
    <button
      className={\`switch \${isOn ? 'on' : 'off'}\`}
      onClick={onToggle}
    >
      <span className="switch-slider" />
    </button>
  );
}`,
    demoType: 'switch',
    relatedTerms: ['Checkbox', 'Toggle', 'Button']
  },

  {
    id: 'input',
    term: 'Input Field',
    category: 'forms',
    aiSynonyms: ['Text Field', 'Text Input', 'Input Box', 'Text Box', 'Form Field', 'Entry Field'],
    description: 'A box where users can type text, like their name or email',
    beginnerTip: 'The basic typing box - where users enter information like username or password!',
    aiPhrases: [
      'Add an input field for the name',
      'Create a text box for email',
      'Add text input for user data',
      'Make an entry field',
      'Implement form fields',
      'Add input boxes for information'
    ],
    codeExample: `// React Input Example - Type Away!
const Input = ({ label, value, onChange }) => {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type here..."
      />
    </div>
  );
}`,
    demoType: 'input',
    relatedTerms: ['Textarea', 'Select', 'Form']
  },

  {
    id: 'select',
    term: 'Select Box',
    category: 'forms',
    aiSynonyms: ['Dropdown Select', 'Select Menu', 'Option Select', 'Choice Box', 'Picker', 'Select Input'],
    description: 'A dropdown list where users can choose one option from many',
    beginnerTip: 'Like picking your country from a list - click and choose from the options!',
    aiPhrases: [
      'Add a select box for countries',
      'Create dropdown select menu',
      'Implement option selector',
      'Make a choice picker',
      'Add select input for categories',
      'Use dropdown for selection'
    ],
    codeExample: `// React Select Example - Pick From List!
const Select = ({ options, value, onChange }) => {
  return (
    <select value={value} onChange={onChange}>
      <option value="">Choose...</option>
      {options.map(opt => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}`,
    demoType: 'select',
    relatedTerms: ['Dropdown', 'Radio Button', 'Input']
  },

  {
    id: 'datepicker',
    term: 'Date Picker',
    category: 'forms',
    aiSynonyms: ['Calendar Input', 'Date Selector', 'Date Input', 'Calendar Picker', 'Date Field', 'Date Chooser'],
    description: 'A calendar interface for selecting dates',
    beginnerTip: 'A mini calendar that pops up to let you pick a date - like booking a flight!',
    aiPhrases: [
      'Add a date picker for birthdate',
      'Create calendar input',
      'Implement date selector',
      'Add calendar for date selection',
      'Make a date chooser',
      'Use date field with calendar'
    ],
    codeExample: `// React Date Picker Example - Pick a Date!
const DatePicker = ({ value, onChange }) => {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="date-picker"
    />
  );
}`,
    demoType: 'datepicker',
    relatedTerms: ['Time Picker', 'Calendar', 'Input']
  },

  // ===== NAVIGATION =====
  {
    id: 'navbar',
    term: 'Navigation Bar',
    category: 'navigation',
    aiSynonyms: ['Navbar', 'Nav Bar', 'Menu Bar', 'Top Navigation', 'Header Nav', 'Main Menu'],
    description: 'The main navigation menu, usually at the top of a website',
    beginnerTip: 'The menu at the top of websites with links like Home, About, Contact - your site\'s road map!',
    aiPhrases: [
      'Add a navigation bar at the top',
      'Create navbar with menu items',
      'Implement header navigation',
      'Make a menu bar',
      'Add top navigation menu',
      'Build main navigation'
    ],
    codeExample: `// React Navbar Example - Site Navigation!
const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/services">Services</a>
      <a href="/contact">Contact</a>
    </nav>
  );
}`,
    demoType: 'navbar',
    relatedTerms: ['Menu', 'Header', 'Breadcrumb']
  },

  {
    id: 'breadcrumb',
    term: 'Breadcrumb',
    category: 'navigation',
    aiSynonyms: ['Breadcrumb Trail', 'Navigation Path', 'Page Path', 'Navigation Trail', 'Path Navigation'],
    description: 'Shows the user\'s location in a website hierarchy, like a trail of breadcrumbs',
    beginnerTip: 'Like Hansel and Gretel\'s breadcrumbs - shows where you are: Home > Products > Shoes',
    aiPhrases: [
      'Add breadcrumb navigation',
      'Show navigation path',
      'Display page hierarchy',
      'Create breadcrumb trail',
      'Implement path navigation',
      'Add location indicator'
    ],
    codeExample: `// React Breadcrumb Example - You Are Here!
const Breadcrumb = ({ path }) => {
  return (
    <nav className="breadcrumb">
      {path.map((item, index) => (
        <span key={index}>
          <a href={item.url}>{item.name}</a>
          {index < path.length - 1 && ' > '}
        </span>
      ))}
    </nav>
  );
}`,
    demoType: 'breadcrumb',
    relatedTerms: ['Navigation Bar', 'Menu', 'Pagination']
  },

  {
    id: 'pagination',
    term: 'Pagination',
    category: 'navigation',
    aiSynonyms: ['Page Navigation', 'Page Numbers', 'Paging', 'Page Controls', 'Page Selector', 'Page Links'],
    description: 'Controls to navigate through multiple pages of content',
    beginnerTip: 'The "1 2 3... Next" buttons at the bottom of search results - for navigating pages!',
    aiPhrases: [
      'Add pagination for results',
      'Create page navigation',
      'Implement paging controls',
      'Add page numbers',
      'Make next/previous buttons',
      'Build page selector'
    ],
    codeExample: `// React Pagination Example - Page by Page!
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination">
      <button onClick={() => onPageChange(currentPage - 1)}>
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)}>
        Next
      </button>
    </div>
  );
}`,
    demoType: 'pagination',
    relatedTerms: ['Navigation', 'List', 'Table']
  },

  {
    id: 'stepper',
    term: 'Stepper',
    category: 'navigation',
    aiSynonyms: ['Progress Steps', 'Wizard', 'Step Indicator', 'Progress Bar', 'Multi-step Form', 'Step Navigation'],
    description: 'Shows progress through a multi-step process, like a checkout flow',
    beginnerTip: 'Like a progress bar with steps - shows "Step 1 of 3" in a checkout or signup process!',
    aiPhrases: [
      'Add a stepper for checkout',
      'Create progress steps',
      'Implement wizard navigation',
      'Make multi-step form',
      'Add step indicator',
      'Build progress navigation'
    ],
    codeExample: `// React Stepper Example - Step by Step!
const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="stepper">
      {steps.map((step, index) => (
        <div
          key={index}
          className={\`step \${index <= currentStep ? 'active' : ''}\`}
        >
          <span>{index + 1}</span>
          <p>{step}</p>
        </div>
      ))}
    </div>
  );
}`,
    demoType: 'stepper',
    relatedTerms: ['Progress Bar', 'Wizard', 'Navigation']
  },

  // ===== LAYOUT =====
  {
    id: 'sidebar',
    term: 'Sidebar',
    category: 'layout',
    aiSynonyms: ['Side Panel', 'Side Navigation', 'Side Menu', 'Lateral Bar', 'Side Column', 'Navigation Panel'],
    description: 'A vertical panel on the side of the page, often used for navigation',
    beginnerTip: 'The menu on the left or right side of many apps - like your email folders list!',
    aiPhrases: [
      'Add a sidebar for navigation',
      'Create side panel with menu',
      'Implement left sidebar',
      'Make side navigation',
      'Add lateral menu bar',
      'Build side column layout'
    ],
    codeExample: `// React Sidebar Example - Side Menu!
const Sidebar = ({ isOpen }) => {
  return (
    <aside className={\`sidebar \${isOpen ? 'open' : ''}\`}>
      <nav>
        <a href="/dashboard">Dashboard</a>
        <a href="/profile">Profile</a>
        <a href="/settings">Settings</a>
      </nav>
    </aside>
  );
}`,
    demoType: 'sidebar',
    relatedTerms: ['Drawer', 'Navigation', 'Layout']
  },

  {
    id: 'header',
    term: 'Header',
    category: 'layout',
    aiSynonyms: ['Page Header', 'Top Bar', 'App Bar', 'Banner', 'Top Section', 'Masthead'],
    description: 'The top section of a page, usually containing logo and main navigation',
    beginnerTip: 'The very top part of a website with the logo and main menu - like a storefront sign!',
    aiPhrases: [
      'Add header with logo',
      'Create top bar navigation',
      'Implement app header',
      'Make page banner',
      'Add top section',
      'Build masthead area'
    ],
    codeExample: `// React Header Example - Top of Page!
const Header = () => {
  return (
    <header className="header">
      <div className="logo">My App</div>
      <nav className="nav-menu">
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>
    </header>
  );
}`,
    demoType: 'header',
    relatedTerms: ['Footer', 'Navigation Bar', 'Layout']
  },

  {
    id: 'footer',
    term: 'Footer',
    category: 'layout',
    aiSynonyms: ['Page Footer', 'Bottom Bar', 'Bottom Section', 'Site Footer', 'Copyright Section'],
    description: 'The bottom section of a page, often containing links and copyright info',
    beginnerTip: 'The bottom part of websites with copyright, contact info, and extra links!',
    aiPhrases: [
      'Add footer with links',
      'Create bottom section',
      'Implement page footer',
      'Make copyright area',
      'Add site footer',
      'Build bottom navigation'
    ],
    codeExample: `// React Footer Example - Bottom Info!
const Footer = () => {
  return (
    <footer className="footer">
      <div className="links">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
      </div>
      <p>© 2024 My Company</p>
    </footer>
  );
}`,
    demoType: 'footer',
    relatedTerms: ['Header', 'Layout', 'Navigation']
  },

  {
    id: 'grid',
    term: 'Grid Layout',
    category: 'layout',
    aiSynonyms: ['CSS Grid', 'Grid System', 'Grid Container', 'Layout Grid', 'Column Grid', 'Responsive Grid'],
    description: 'A layout system that arranges content in rows and columns',
    beginnerTip: 'Like a checkerboard or graph paper - organize content in neat rows and columns!',
    aiPhrases: [
      'Use grid layout for cards',
      'Create CSS grid container',
      'Implement responsive grid',
      'Make column layout',
      'Add grid system',
      'Build grid-based layout'
    ],
    codeExample: `// React Grid Example - Organized Layout!
const Grid = ({ items }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map(item => (
        <div key={item.id} className="grid-item">
          {item.content}
        </div>
      ))}
    </div>
  );
}`,
    demoType: 'grid',
    relatedTerms: ['Flexbox', 'Layout', 'Container']
  },

  {
    id: 'hero',
    term: 'Hero Section',
    category: 'layout',
    aiSynonyms: ['Hero Banner', 'Hero Image', 'Landing Section', 'Main Banner', 'Splash Section', 'Featured Section'],
    description: 'The large, prominent section at the top of a homepage',
    beginnerTip: 'The big, eye-catching area at the top of websites with a headline and call-to-action!',
    aiPhrases: [
      'Create hero section with CTA',
      'Add hero banner',
      'Make landing hero area',
      'Implement main banner',
      'Build splash section',
      'Design featured area'
    ],
    codeExample: `// React Hero Example - Make an Impact!
const HeroSection = () => {
  return (
    <section className="hero">
      <h1>Welcome to Our Site!</h1>
      <p>Your journey starts here</p>
      <button className="cta-button">
        Get Started
      </button>
    </section>
  );
}`,
    demoType: 'hero',
    relatedTerms: ['Header', 'Banner', 'Landing Page']
  },

  // ===== FEEDBACK (Original + New) =====
  {
    id: 'toast',
    term: 'Toast',
    category: 'feedback',
    aiSynonyms: ['Notification', 'Alert', 'Snackbar', 'Flash Message', 'Popup Message', 'Brief Alert', 'Temporary Notification'],
    description: 'A brief message that appears temporarily, usually at the edge of the screen',
    beginnerTip: 'Like a notification on your phone - pops up briefly then disappears!',
    aiPhrases: [
      'Show a toast notification for success',
      'Display a brief message at the bottom',
      'Add a snackbar for error messages',
      'Create a temporary alert',
      'Flash a success message to the user',
      'Show notification toast'
    ],
    codeExample: `// React Toast Example - Quick Message!
const Toast = ({ message, type = 'info' }) => {
  const toastClass = 'toast toast-' + type;
  return (
    <div className={toastClass}>
      {message}
    </div>
  );
}`,
    demoType: 'toast',
    relatedTerms: ['Modal', 'Alert', 'Notification']
  },

  {
    id: 'alert',
    term: 'Alert',
    category: 'feedback',
    aiSynonyms: ['Warning', 'Notice', 'Message Box', 'Info Box', 'Notification Banner', 'Callout', 'Announcement'],
    description: 'A prominent message box that displays important information or warnings',
    beginnerTip: 'Like a warning sign - stays visible to make sure you see important information!',
    aiPhrases: [
      'Show an alert for errors',
      'Display warning message',
      'Add info box for tips',
      'Create notification banner',
      'Implement callout for important info',
      'Make announcement banner'
    ],
    codeExample: `// React Alert Example - Important Info!
const Alert = ({ type, title, message }) => {
  const alertClass = 'alert alert-' + type;
  return (
    <div className={alertClass}>
      <h4>{title}</h4>
      <p>{message}</p>
    </div>
  );
}`,
    demoType: 'alert',
    relatedTerms: ['Toast', 'Modal', 'Banner']
  },

  {
    id: 'badge',
    term: 'Badge',
    category: 'feedback',
    aiSynonyms: ['Tag', 'Chip', 'Label', 'Pill', 'Status Indicator', 'Count Bubble', 'Notification Dot'],
    description: 'Small label or indicator often used to show status, count, or category',
    beginnerTip: 'Like the red number on your app icons showing unread messages!',
    aiPhrases: [
      'Add a badge to show count',
      'Display status with a label',
      'Show categories using tags',
      'Create notification badges',
      'Implement status chips',
      'Add count indicator'
    ],
    codeExample: `// React Badge Example - Small but Important!
const Badge = ({ text, variant = 'primary' }) => {
  const badgeClass = 'badge badge-' + variant;
  return (
    <span className={badgeClass}>
      {text}
    </span>
  );
}`,
    demoType: 'badge',
    relatedTerms: ['Tag', 'Chip', 'Label']
  },

  {
    id: 'progress',
    term: 'Progress Bar',
    category: 'feedback',
    aiSynonyms: ['Progress Indicator', 'Loading Bar', 'Progress Track', 'Completion Bar', 'Status Bar', 'Progress Meter'],
    description: 'Visual indicator showing the completion status of a task or process',
    beginnerTip: 'Like a loading bar in a game - shows how much is done and how much is left!',
    aiPhrases: [
      'Show progress bar for upload',
      'Display loading progress',
      'Add completion indicator',
      'Create a progress track',
      'Implement status bar for tasks',
      'Make progress meter'
    ],
    codeExample: `// React Progress Bar Example - How Far Along?
const ProgressBar = ({ percent }) => {
  return (
    <div className="progress-bar">
      <div 
        className="progress-fill"
        style={{ width: \`\${percent}%\` }}
      />
    </div>
  );
}`,
    demoType: 'progress',
    relatedTerms: ['Spinner', 'Loading', 'Status']
  },

  {
    id: 'spinner',
    term: 'Spinner',
    category: 'feedback',
    aiSynonyms: ['Loading Spinner', 'Loader', 'Loading Indicator', 'Progress Circle', 'Activity Indicator', 'Busy Indicator'],
    description: 'Animated indicator that shows something is loading or processing',
    beginnerTip: 'The spinning circle you see when something is loading - means "please wait"!',
    aiPhrases: [
      'Show a loading spinner',
      'Add a loader while fetching',
      'Display activity indicator',
      'Create a spinning loader',
      'Implement busy state indicator',
      'Add loading animation'
    ],
    codeExample: `// React Spinner Example - Loading...
const Spinner = ({ size = 'medium' }) => {
  const spinnerClass = 'spinner spinner-' + size;
  return (
    <div className={spinnerClass}>
      <div className="spinner-circle" />
    </div>
  );
}`,
    demoType: 'spinner',
    relatedTerms: ['Skeleton', 'Progress', 'Loading']
  },

  {
    id: 'skeleton',
    term: 'Skeleton',
    category: 'feedback',
    aiSynonyms: ['Loading Placeholder', 'Content Loader', 'Ghost Element', 'Shimmer', 'Loading State', 'Placeholder UI'],
    description: 'Placeholder UI that shows the structure of content while it\'s loading',
    beginnerTip: 'Gray boxes that show where content will appear - like a preview while loading!',
    aiPhrases: [
      'Show skeleton while loading',
      'Add loading placeholders',
      'Display ghost elements during fetch',
      'Create shimmer effect for loading',
      'Implement content loaders',
      'Use placeholder UI'
    ],
    codeExample: `// React Skeleton Example - Loading Preview!
const Skeleton = ({ width, height }) => {
  return (
    <div 
      className="skeleton"
      style={{ width, height }}
    />
  );
}`,
    demoType: 'skeleton',
    relatedTerms: ['Spinner', 'Loading', 'Progress']
  },

  {
    id: 'empty',
    term: 'Empty State',
    category: 'feedback',
    aiSynonyms: ['No Data', 'Empty View', 'Zero State', 'No Results', 'Blank State', 'No Content'],
    description: 'Message or illustration shown when there\'s no data to display',
    beginnerTip: 'What you see when your inbox is empty - a friendly message saying "No messages"!',
    aiPhrases: [
      'Show empty state when no data',
      'Display no results message',
      'Add zero state illustration',
      'Create blank state view',
      'Implement no content message',
      'Design empty view'
    ],
    codeExample: `// React Empty State Example - Nothing Here!
const EmptyState = ({ message, icon }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <p>{message}</p>
      <button>Add First Item</button>
    </div>
  );
}`,
    demoType: 'empty',
    relatedTerms: ['Loading', 'Error State', 'Placeholder']
  },

  // ===== ADVANCED COMPONENTS =====
  {
    id: 'dropdown',
    term: 'Dropdown',
    category: 'advanced',
    aiSynonyms: ['Dropdown Menu', 'Menu', 'Context Menu', 'Options Menu', 'Pull-down Menu', 'Action Menu'],
    description: 'A menu that appears when clicked, showing a list of actions or options',
    beginnerTip: 'Click to reveal hidden options - like the menu that appears when you right-click!',
    aiPhrases: [
      'Add a dropdown menu for actions',
      'Create context menu',
      'Implement options dropdown',
      'Show menu on click',
      'Display action menu',
      'Build dropdown list'
    ],
    codeExample: `// React Dropdown Example - Hidden Options!
const Dropdown = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="dropdown">
      <button onClick={() => setIsOpen(!isOpen)}>
        Options ▼
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map(option => (
            <li key={option} onClick={() => onSelect(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    demoType: 'dropdown',
    relatedTerms: ['Select', 'Menu', 'Context Menu']
  },

  {
    id: 'accordion',
    term: 'Accordion',
    category: 'advanced',
    aiSynonyms: ['Collapsible', 'Expandable', 'Dropdown Panel', 'Toggle Content', 'Foldable Section', 'Collapse Panel'],
    description: 'Expandable/collapsible content sections that show or hide information',
    beginnerTip: 'Like FAQ sections - click a question to reveal the answer, click again to hide!',
    aiPhrases: [
      'Create collapsible sections for FAQs',
      'Add expandable content areas',
      'Implement toggle panels for details',
      'Make sections that can be collapsed',
      'Build an accordion for Q&A',
      'Design foldable content'
    ],
    codeExample: `// React Accordion Example - Expand & Collapse!
const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);
  
  return (
    <div className="accordion">
      {items.map((item, i) => (
        <div key={i}>
          <button onClick={() => setOpenIndex(i === openIndex ? null : i)}>
            {item.title} {openIndex === i ? '−' : '+'}
          </button>
          {openIndex === i && (
            <div className="content">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}`,
    demoType: 'accordion',
    relatedTerms: ['Tabs', 'Collapsible', 'Expandable']
  },

  {
    id: 'tabs',
    term: 'Tabs',
    category: 'advanced',
    aiSynonyms: ['Tab Panel', 'Tabbed Interface', 'Tab Navigation', 'Page Tabs', 'Section Switcher', 'Tab Bar'],
    description: 'Navigation component that switches between different views or content sections',
    beginnerTip: 'Like browser tabs or file folders - click each tab to see different content!',
    aiPhrases: [
      'Add tabs to switch between views',
      'Create a tabbed interface',
      'Implement tab navigation for sections',
      'Use tabs to organize content',
      'Build a tab panel for categories',
      'Make section switcher'
    ],
    codeExample: `// React Tabs Example - Switch Views!
const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <div className="tabs">
      <div className="tab-headers">
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={activeTab === i ? 'active' : ''}
            onClick={() => setActiveTab(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs[activeTab].content}
      </div>
    </div>
  );
}`,
    demoType: 'tabs',
    relatedTerms: ['Accordion', 'Navigation', 'Switcher']
  },

  {
    id: 'tooltip',
    term: 'Tooltip',
    category: 'advanced',
    aiSynonyms: ['Hover Text', 'Help Text', 'Info Bubble', 'Hint', 'Popover', 'Helper Text', 'Hover Hint'],
    description: 'Small text that appears when hovering over an element to provide additional information',
    beginnerTip: 'Hover your mouse over something to see extra info - like hints in a game!',
    aiPhrases: [
      'Show a tooltip on hover',
      'Add help text when hovering',
      'Display additional info in a bubble',
      'Create hover hints for buttons',
      'Implement helper text on mouseover',
      'Add info popover'
    ],
    codeExample: `// React Tooltip Example - Hover for Help!
const Tooltip = ({ children, text }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div 
      className="tooltip-wrapper"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="tooltip">{text}</div>
      )}
    </div>
  );
}`,
    demoType: 'tooltip',
    relatedTerms: ['Popover', 'Help Text', 'Hint']
  },

  {
    id: 'drawer',
    term: 'Drawer',
    category: 'advanced',
    aiSynonyms: ['Sidebar Drawer', 'Slide Panel', 'Side Menu', 'Navigation Drawer', 'Sliding Panel', 'Off-canvas Menu'],
    description: 'A panel that slides in from the edge of the screen',
    beginnerTip: 'Like pulling out a drawer - slides in from the side with extra options or navigation!',
    aiPhrases: [
      'Add a drawer for mobile navigation',
      'Create a sliding sidebar',
      'Implement a side panel for settings',
      'Build an off-canvas menu',
      'Show navigation in a drawer',
      'Make sliding panel'
    ],
    codeExample: `// React Drawer Example - Slide In!
const Drawer = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="drawer-backdrop" onClick={onClose} />
      )}
      <div className={\`drawer \${isOpen ? 'open' : ''}\`}>
        <button onClick={onClose}>×</button>
        {children}
      </div>
    </>
  );
}`,
    demoType: 'drawer',
    relatedTerms: ['Modal', 'Sidebar', 'Panel']
  },

  {
    id: 'avatar',
    term: 'Avatar',
    category: 'ui-components',
    aiSynonyms: ['Profile Picture', 'User Icon', 'Profile Image', 'User Avatar', 'Profile Photo', 'User Thumbnail'],
    description: 'A small image or icon representing a user',
    beginnerTip: 'The little round picture that represents you - like your profile pic on social media!',
    aiPhrases: [
      'Add user avatar',
      'Show profile picture',
      'Display user icon',
      'Create profile image',
      'Implement user thumbnail',
      'Add profile photo'
    ],
    codeExample: `// React Avatar Example - User Picture!
const Avatar = ({ src, name, size = 'medium' }) => {
  return (
    <div className={\`avatar avatar-\${size}\`}>
      {src ? (
        <img src={src} alt={name} />
      ) : (
        <span>{name?.[0]}</span>
      )}
    </div>
  );
}`,
    demoType: 'avatar',
    relatedTerms: ['Profile', 'User', 'Image']
  },

  {
    id: 'chip',
    term: 'Chip',
    category: 'ui-components',
    aiSynonyms: ['Tag', 'Badge', 'Label', 'Pill', 'Token', 'Removable Tag'],
    description: 'Small, interactive element often used for tags or filters that can be removed',
    beginnerTip: 'Like removable tags - click the X to remove them. Often used for filters or selections!',
    aiPhrases: [
      'Add removable chips',
      'Create filter tags',
      'Implement selectable chips',
      'Make deletable tags',
      'Add token elements',
      'Build filter pills'
    ],
    codeExample: `// React Chip Example - Removable Tag!
const Chip = ({ label, onRemove }) => {
  return (
    <div className="chip">
      <span>{label}</span>
      <button onClick={onRemove}>×</button>
    </div>
  );
}`,
    demoType: 'chip',
    relatedTerms: ['Badge', 'Tag', 'Label']
  },

  // ===== MODERN UI COMPONENTS =====
  {
    id: 'infinite-scroll',
    term: 'Infinite Scroll',
    category: 'advanced',
    aiSynonyms: ['Endless Scroll', 'Lazy Load List', 'Auto-load Content', 'Continuous Scroll', 'Dynamic Loading', 'Scroll Pagination'],
    description: 'Automatically loads more content as the user scrolls down, like social media feeds',
    beginnerTip: 'Like Facebook or Twitter - new posts appear automatically when you scroll to the bottom!',
    aiPhrases: [
      'Implement infinite scrolling for the feed',
      'Add endless scroll to the list',
      'Create auto-loading content',
      'Make continuous scroll pagination',
      'Build dynamic content loading',
      'Add scroll-triggered loading'
    ],
    codeExample: `// React Infinite Scroll Example
const InfiniteScroll = ({ loadMore }) => {
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= 
          document.body.offsetHeight - 100) {
        loadMore(); // Load more items
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return <div>Content here...</div>;
}`,
    demoType: 'infinite-scroll',
    relatedTerms: ['Pagination', 'Lazy Loading', 'Virtual List']
  },

  {
    id: 'lazy-loading',
    term: 'Lazy Loading',
    category: 'advanced',
    aiSynonyms: ['Deferred Loading', 'On-demand Loading', 'Progressive Loading', 'Delayed Loading', 'Async Loading'],
    description: 'Loading content only when needed, improving initial page load speed',
    beginnerTip: 'Images load only when you scroll to them - makes the page load faster initially!',
    aiPhrases: [
      'Add lazy loading for images',
      'Implement deferred loading',
      'Create on-demand content loading',
      'Use progressive image loading',
      'Add delayed component loading',
      'Build async content loading'
    ],
    codeExample: `// React Lazy Loading Example
const LazyImage = ({ src, alt }) => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    });
    if (imgRef.current) observer.observe(imgRef.current);
  }, []);
  
  return (
    <div ref={imgRef}>
      {isVisible && <img src={src} alt={alt} />}
    </div>
  );
}`,
    demoType: 'lazy-loading',
    relatedTerms: ['Infinite Scroll', 'Performance', 'Loading']
  },

  {
    id: 'sticky-header',
    term: 'Sticky Header',
    category: 'layout',
    aiSynonyms: ['Fixed Header', 'Persistent Header', 'Floating Header', 'Pinned Header', 'Static Header', 'Frozen Header'],
    description: 'Header that stays at the top of the page when scrolling',
    beginnerTip: 'The header "sticks" to the top when you scroll down - always visible for easy navigation!',
    aiPhrases: [
      'Make the header sticky on scroll',
      'Create a fixed navigation bar',
      'Add persistent header',
      'Implement floating top bar',
      'Build pinned header',
      'Make header stay on top'
    ],
    codeExample: `// CSS Sticky Header Example
const StickyHeader = () => {
  return (
    <header 
      style={{ 
        position: 'sticky',
        top: 0,
        zIndex: 100 
      }}
    >
      <nav>Navigation here</nav>
    </header>
  );
}`,
    demoType: 'sticky-header',
    relatedTerms: ['Header', 'Navigation Bar', 'Fixed Position']
  },

  {
    id: 'floating-label',
    term: 'Floating Label',
    category: 'forms',
    aiSynonyms: ['Animated Label', 'Material Label', 'Moving Label', 'Dynamic Label', 'Placeholder Label'],
    description: 'Input label that moves above the field when focused or filled',
    beginnerTip: 'The label starts inside the input box, then "floats" up when you start typing!',
    aiPhrases: [
      'Add floating labels to inputs',
      'Create animated form labels',
      'Implement material design labels',
      'Make moving placeholders',
      'Build dynamic input labels',
      'Add animated field labels'
    ],
    codeExample: `// React Floating Label Example
const FloatingLabel = ({ label, value, onChange }) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <div className="floating-label-container">
      <input
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <label className={focused || value ? 'float' : ''}>
        {label}
      </label>
    </div>
  );
}`,
    demoType: 'floating-label',
    relatedTerms: ['Input Field', 'Form', 'Label']
  },

  {
    id: 'mega-menu',
    term: 'Mega Menu',
    category: 'navigation',
    aiSynonyms: ['Large Dropdown', 'Expanded Menu', 'Full-width Menu', 'Multi-column Menu', 'Complex Menu', 'Navigation Panel'],
    description: 'Large dropdown menu with multiple columns and sections',
    beginnerTip: 'Like Amazon\'s menu - hover over a category and see a huge panel with all subcategories!',
    aiPhrases: [
      'Create a mega menu for navigation',
      'Add large dropdown with columns',
      'Build expanded navigation menu',
      'Implement full-width dropdown',
      'Make multi-column menu',
      'Design complex navigation panel'
    ],
    codeExample: `// React Mega Menu Example
const MegaMenu = ({ categories }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  
  return (
    <nav>
      {categories.map(cat => (
        <div 
          key={cat.id}
          onMouseEnter={() => setActiveCategory(cat.id)}
          onMouseLeave={() => setActiveCategory(null)}
        >
          <button>{cat.name}</button>
          {activeCategory === cat.id && (
            <div className="mega-menu-panel">
              {/* Multiple columns of links */}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}`,
    demoType: 'mega-menu',
    relatedTerms: ['Dropdown', 'Navigation', 'Menu']
  },

  // ===== INTERACTION PATTERNS =====
  {
    id: 'drag-drop',
    term: 'Drag and Drop',
    category: 'advanced',
    aiSynonyms: ['Draggable', 'Drag & Drop', 'Sortable List', 'Reorderable', 'Moveable Items', 'DnD Interface'],
    description: 'Interface allowing users to drag items and drop them in different locations',
    beginnerTip: 'Click and hold to grab an item, then drag it to a new position - like rearranging apps on your phone!',
    aiPhrases: [
      'Add drag and drop functionality',
      'Make items draggable',
      'Create sortable list',
      'Implement reorderable items',
      'Build drag & drop interface',
      'Enable item rearrangement'
    ],
    codeExample: `// React Drag & Drop Example
const DraggableItem = ({ item, onDragStart, onDragEnd }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      onDragEnd={onDragEnd}
      className="draggable-item"
    >
      {item.content}
    </div>
  );
}`,
    demoType: 'drag-drop',
    relatedTerms: ['Sortable', 'Reorder', 'Interactive']
  },

  {
    id: 'swipe-gesture',
    term: 'Swipe Gesture',
    category: 'advanced',
    aiSynonyms: ['Swipe Action', 'Touch Swipe', 'Slide Gesture', 'Swipe to Delete', 'Swipe Navigation', 'Touch Gesture'],
    description: 'Touch or mouse gesture to trigger actions by swiping',
    beginnerTip: 'Like swiping photos on your phone or swiping to delete emails - slide left or right!',
    aiPhrases: [
      'Add swipe to delete',
      'Implement swipe gestures',
      'Create touch swipe actions',
      'Build swipe navigation',
      'Add slide to reveal',
      'Make swipeable cards'
    ],
    codeExample: `// React Swipe Gesture Example
const SwipeableCard = ({ onSwipeLeft, onSwipeRight }) => {
  const [startX, setStartX] = useState(0);
  
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };
  
  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    if (diff > 50) onSwipeRight();
    if (diff < -50) onSwipeLeft();
  };
  
  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      Swipe me!
    </div>
  );
}`,
    demoType: 'swipe',
    relatedTerms: ['Gesture', 'Touch', 'Mobile Interaction']
  },

  {
    id: 'pull-refresh',
    term: 'Pull to Refresh',
    category: 'advanced',
    aiSynonyms: ['Swipe to Refresh', 'Pull Down Refresh', 'Drag to Reload', 'Pull to Update', 'Refresh on Pull'],
    description: 'Pulling down on content to refresh or reload it',
    beginnerTip: 'Like refreshing your Instagram feed - pull down from the top to get new content!',
    aiPhrases: [
      'Add pull to refresh functionality',
      'Implement swipe down to reload',
      'Create pull to update',
      'Build refresh on pull gesture',
      'Add drag to refresh',
      'Make content refreshable'
    ],
    codeExample: `// React Pull to Refresh Example
const PullToRefresh = ({ onRefresh }) => {
  const [pulling, setPulling] = useState(false);
  
  const handleTouchMove = (e) => {
    if (window.scrollY === 0 && e.touches[0].clientY > 100) {
      setPulling(true);
    }
  };
  
  const handleTouchEnd = () => {
    if (pulling) {
      onRefresh();
      setPulling(false);
    }
  };
  
  return (
    <div
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {pulling && <div>Release to refresh...</div>}
      {/* Content */}
    </div>
  );
}`,
    demoType: 'pull-refresh',
    relatedTerms: ['Refresh', 'Reload', 'Update']
  },

  // ===== FORM ENHANCEMENTS =====
  {
    id: 'form-validation',
    term: 'Form Validation',
    category: 'forms',
    aiSynonyms: ['Input Validation', 'Field Validation', 'Form Checking', 'Input Verification', 'Data Validation', 'Form Errors'],
    description: 'Checking user input for errors and showing helpful messages',
    beginnerTip: 'Red error messages that appear when you fill out a form incorrectly - like "Please enter a valid email"!',
    aiPhrases: [
      'Add form validation',
      'Validate user input',
      'Show validation errors',
      'Implement field checking',
      'Create input verification',
      'Add error messages to form'
    ],
    codeExample: `// React Form Validation Example
const ValidatedInput = ({ value, onChange, type }) => {
  const [error, setError] = useState('');
  
  const validate = (val) => {
    if (type === 'email' && !val.includes('@')) {
      setError('Please enter a valid email');
    } else {
      setError('');
    }
  };
  
  return (
    <div>
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          validate(e.target.value);
        }}
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
}`,
    demoType: 'form-validation',
    relatedTerms: ['Form', 'Input', 'Error Message']
  },

  {
    id: 'autocomplete',
    term: 'Autocomplete',
    category: 'forms',
    aiSynonyms: ['Auto-suggest', 'Type-ahead', 'Search Suggestions', 'Predictive Text', 'Auto-fill', 'Smart Search'],
    description: 'Suggests options as the user types, like Google search',
    beginnerTip: 'Start typing and see suggestions appear - like when Google finishes your search for you!',
    aiPhrases: [
      'Add autocomplete to search',
      'Implement type-ahead suggestions',
      'Create auto-suggest input',
      'Build predictive text field',
      'Add search suggestions',
      'Make smart search box'
    ],
    codeExample: `// React Autocomplete Example
const Autocomplete = ({ options }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  const handleChange = (value) => {
    setQuery(value);
    const filtered = options.filter(opt => 
      opt.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
  };
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleChange(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map(s => (
            <li key={s} onClick={() => setQuery(s)}>
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    demoType: 'autocomplete',
    relatedTerms: ['Search', 'Input', 'Suggestions']
  },

  {
    id: 'multi-step-form',
    term: 'Multi-step Form',
    category: 'forms',
    aiSynonyms: ['Wizard Form', 'Step-by-step Form', 'Progressive Form', 'Staged Form', 'Sequential Form', 'Form Wizard'],
    description: 'Form divided into multiple steps or pages',
    beginnerTip: 'Like online checkout - shipping info → payment → review → complete. One step at a time!',
    aiPhrases: [
      'Create multi-step form',
      'Build wizard interface',
      'Add step-by-step form',
      'Implement progressive form',
      'Make staged data collection',
      'Design form wizard'
    ],
    codeExample: `// React Multi-step Form Example
const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  return (
    <div>
      <div className="progress">
        Step {step} of 3
      </div>
      
      {step === 1 && <PersonalInfo onNext={nextStep} />}
      {step === 2 && <AddressInfo onNext={nextStep} onBack={prevStep} />}
      {step === 3 && <Review onSubmit={handleSubmit} onBack={prevStep} />}
    </div>
  );
}`,
    demoType: 'multi-step-form',
    relatedTerms: ['Stepper', 'Form', 'Wizard']
  },

  {
    id: 'tag-input',
    term: 'Tag Input',
    category: 'forms',
    aiSynonyms: ['Tags Field', 'Multi-tag Input', 'Keyword Input', 'Label Input', 'Tag Editor', 'Tag Selector'],
    description: 'Input field for adding multiple tags or keywords',
    beginnerTip: 'Type a word, press Enter, and it becomes a tag. Add multiple tags like hashtags!',
    aiPhrases: [
      'Add tag input field',
      'Create multi-tag selector',
      'Implement keyword input',
      'Build tag editor',
      'Make label input field',
      'Add hashtag input'
    ],
    codeExample: `// React Tag Input Example
const TagInput = () => {
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState('');
  
  const addTag = (e) => {
    if (e.key === 'Enter' && input) {
      setTags([...tags, input]);
      setInput('');
    }
  };
  
  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  return (
    <div>
      <div className="tags">
        {tags.map(tag => (
          <span key={tag} className="tag">
            {tag}
            <button onClick={() => removeTag(tag)}>×</button>
          </span>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={addTag}
        placeholder="Add a tag..."
      />
    </div>
  );
}`,
    demoType: 'tag-input',
    relatedTerms: ['Input', 'Tags', 'Chip']
  },

  {
    id: 'range-slider',
    term: 'Range Slider',
    category: 'forms',
    aiSynonyms: ['Slider Input', 'Range Input', 'Value Slider', 'Number Slider', 'Min-Max Slider', 'Dual Slider'],
    description: 'Slider for selecting a value or range between minimum and maximum',
    beginnerTip: 'Drag the handle to pick a number - like adjusting volume or brightness on your phone!',
    aiPhrases: [
      'Add range slider for price',
      'Create value slider',
      'Implement number range selector',
      'Build min-max slider',
      'Add dual handle slider',
      'Make adjustable range input'
    ],
    codeExample: `// React Range Slider Example
const RangeSlider = ({ min, max, value, onChange }) => {
  return (
    <div className="slider-container">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="slider"
      />
      <div className="value">{value}</div>
    </div>
  );
}`,
    demoType: 'range-slider',
    relatedTerms: ['Input', 'Slider', 'Number Input']
  },

  // ===== NOTIFICATION & FEEDBACK =====
  {
    id: 'push-notification',
    term: 'Push Notification',
    category: 'feedback',
    aiSynonyms: ['Browser Notification', 'Desktop Notification', 'System Alert', 'Native Notification', 'Pop-up Alert'],
    description: 'System-level notifications that appear outside the browser',
    beginnerTip: 'Those pop-up messages from websites that appear in your system tray or notification center!',
    aiPhrases: [
      'Send push notifications',
      'Add browser notifications',
      'Implement desktop alerts',
      'Create system notifications',
      'Build native alerts',
      'Enable push messages'
    ],
    codeExample: `// Browser Push Notification Example
const sendNotification = (title, body) => {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, {
          body: body,
          icon: '/icon.png'
        });
      }
    });
  }
};`,
    demoType: 'push-notification',
    relatedTerms: ['Notification', 'Alert', 'Toast']
  },

  {
    id: 'loading-overlay',
    term: 'Loading Overlay',
    category: 'feedback',
    aiSynonyms: ['Loading Screen', 'Loading Mask', 'Busy Overlay', 'Processing Screen', 'Wait Screen', 'Loader Overlay'],
    description: 'Full-screen or partial overlay showing content is loading',
    beginnerTip: 'A semi-transparent layer with a spinner that covers the page while loading - prevents clicking!',
    aiPhrases: [
      'Show loading overlay',
      'Add loading screen',
      'Create busy state overlay',
      'Implement processing mask',
      'Build wait screen',
      'Display loader overlay'
    ],
    codeExample: `// React Loading Overlay Example
const LoadingOverlay = ({ isLoading, children }) => {
  return (
    <div className="container">
      {children}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner" />
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}`,
    demoType: 'loading-overlay',
    relatedTerms: ['Spinner', 'Loading', 'Overlay']
  },

  {
    id: 'confirmation-modal',
    term: 'Confirmation Modal',
    category: 'feedback',
    aiSynonyms: ['Confirm Dialog', 'Confirmation Popup', 'Confirm Box', 'Decision Modal', 'Yes/No Dialog', 'Action Confirmation'],
    description: 'Modal asking user to confirm an action before proceeding',
    beginnerTip: 'The "Are you sure?" popup that appears before deleting something important!',
    aiPhrases: [
      'Add confirmation dialog',
      'Show confirm modal',
      'Create yes/no dialog',
      'Implement delete confirmation',
      'Build action verification',
      'Add decision popup'
    ],
    codeExample: `// React Confirmation Modal Example
const ConfirmModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Confirm Action</h3>
        <p>{message}</p>
        <div className="buttons">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}`,
    demoType: 'confirmation-modal',
    relatedTerms: ['Modal', 'Dialog', 'Alert']
  },

  {
    id: 'success-state',
    term: 'Success State',
    category: 'feedback',
    aiSynonyms: ['Success Message', 'Completion State', 'Success Screen', 'Done State', 'Successful Result', 'Achievement State'],
    description: 'Visual feedback showing an action completed successfully',
    beginnerTip: 'The green checkmark or success message you see after submitting a form!',
    aiPhrases: [
      'Show success state',
      'Display completion message',
      'Add success screen',
      'Create done state',
      'Implement successful feedback',
      'Build achievement display'
    ],
    codeExample: `// React Success State Example
const SuccessState = ({ message }) => {
  return (
    <div className="success-state">
      <div className="checkmark">✓</div>
      <h3>Success!</h3>
      <p>{message}</p>
    </div>
  );
}`,
    demoType: 'success-state',
    relatedTerms: ['Feedback', 'Alert', 'Confirmation']
  },

  // ===== DATA DISPLAY ENHANCEMENTS =====
  {
    id: 'virtual-list',
    term: 'Virtual List',
    category: 'data-display',
    aiSynonyms: ['Virtual Scroll', 'Windowed List', 'Virtualized List', 'Performance List', 'Optimized List'],
    description: 'List that only renders visible items for better performance',
    beginnerTip: 'Shows thousands of items smoothly by only drawing what\'s on screen - super fast!',
    aiPhrases: [
      'Implement virtual scrolling',
      'Create virtualized list',
      'Add windowed list',
      'Build performance-optimized list',
      'Make virtual scroll container',
      'Optimize large lists'
    ],
    codeExample: `// React Virtual List Example
const VirtualList = ({ items, itemHeight, containerHeight }) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.ceil((scrollTop + containerHeight) / itemHeight);
  const visibleItems = items.slice(startIndex, endIndex);
  
  return (
    <div 
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight }}>
        {visibleItems.map((item, i) => (
          <div 
            key={startIndex + i}
            style={{ 
              position: 'absolute',
              top: (startIndex + i) * itemHeight
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}`,
    demoType: 'virtual-list',
    relatedTerms: ['List', 'Performance', 'Scroll']
  },

  {
    id: 'data-grid',
    term: 'Data Grid',
    category: 'data-display',
    aiSynonyms: ['Advanced Table', 'Grid Table', 'Spreadsheet Grid', 'Excel-like Grid', 'Editable Table', 'Interactive Grid'],
    description: 'Advanced table with sorting, filtering, and editing capabilities',
    beginnerTip: 'Like Excel in your browser - sort columns, filter data, edit cells directly!',
    aiPhrases: [
      'Create data grid with sorting',
      'Add advanced table features',
      'Build spreadsheet-like grid',
      'Implement editable table',
      'Make interactive data grid',
      'Design Excel-like interface'
    ],
    codeExample: `// React Data Grid Example
const DataGrid = ({ data, columns }) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  
  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    return sortDirection === 'asc' 
      ? aVal > bVal ? 1 : -1
      : aVal < bVal ? 1 : -1;
  });
  
  return (
    <table>
      <thead>
        <tr>
          {columns.map(col => (
            <th 
              key={col.key}
              onClick={() => handleSort(col.key)}
            >
              {col.label} {sortColumn === col.key && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map(row => (
          <tr key={row.id}>
            {columns.map(col => (
              <td key={col.key}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}`,
    demoType: 'data-grid',
    relatedTerms: ['Table', 'Grid', 'Spreadsheet']
  },

  {
    id: 'timeline',
    term: 'Timeline',
    category: 'data-display',
    aiSynonyms: ['Chronology', 'Event Timeline', 'History View', 'Activity Feed', 'Time-based List', 'Sequential Display'],
    description: 'Visual representation of events in chronological order',
    beginnerTip: 'Like Facebook timeline - shows events in order with dates and descriptions!',
    aiPhrases: [
      'Create timeline component',
      'Add chronological display',
      'Build event timeline',
      'Implement activity feed',
      'Make history view',
      'Design sequential list'
    ],
    codeExample: `// React Timeline Example
const Timeline = ({ events }) => {
  return (
    <div className="timeline">
      {events.map((event, i) => (
        <div key={i} className="timeline-item">
          <div className="timeline-marker" />
          <div className="timeline-content">
            <h4>{event.title}</h4>
            <time>{event.date}</time>
            <p>{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}`,
    demoType: 'timeline',
    relatedTerms: ['List', 'Feed', 'History']
  },

  {
    id: 'tree-view',
    term: 'Tree View',
    category: 'data-display',
    aiSynonyms: ['File Tree', 'Hierarchy View', 'Folder Structure', 'Nested List', 'Expandable Tree', 'Directory Tree'],
    description: 'Hierarchical view of nested items, like file explorers',
    beginnerTip: 'Like the folder structure in Windows Explorer - click to expand and see what\'s inside!',
    aiPhrases: [
      'Create tree view component',
      'Add file tree structure',
      'Build hierarchy display',
      'Implement folder view',
      'Make expandable tree',
      'Design nested list'
    ],
    codeExample: `// React Tree View Example
const TreeNode = ({ node }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="tree-node">
      <div 
        className="node-label"
        onClick={() => setExpanded(!expanded)}
      >
        {node.children && (expanded ? '▼' : '▶')}
        {node.label}
      </div>
      {expanded && node.children && (
        <div className="node-children">
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}`,
    demoType: 'tree-view',
    relatedTerms: ['Hierarchy', 'Nested', 'Expandable']
  },

  // ===== SEARCH & FILTER =====
  {
    id: 'search-filter',
    term: 'Search with Filters',
    category: 'advanced',
    aiSynonyms: ['Advanced Search', 'Filtered Search', 'Search and Filter', 'Faceted Search', 'Search Refinement'],
    description: 'Search functionality combined with multiple filter options',
    beginnerTip: 'Like shopping sites - search for "shoes" then filter by size, color, and price!',
    aiPhrases: [
      'Add search with filters',
      'Create advanced search',
      'Implement faceted search',
      'Build filtered search results',
      'Add search refinement',
      'Make multi-filter search'
    ],
    codeExample: `// React Search with Filters Example
const SearchWithFilters = ({ data }) => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    rating: ''
  });
  
  const filteredData = data.filter(item => {
    const matchesSearch = item.name.includes(search);
    const matchesCategory = !filters.category || item.category === filters.category;
    const matchesPrice = !filters.priceRange || checkPriceRange(item.price, filters.priceRange);
    return matchesSearch && matchesCategory && matchesPrice;
  });
  
  return (
    <div>
      <input 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
      <div className="filters">
        {/* Filter controls */}
      </div>
      <div className="results">
        {/* Filtered results */}
      </div>
    </div>
  );
}`,
    demoType: 'search-filter',
    relatedTerms: ['Search', 'Filter', 'Facets']
  },

  {
    id: 'live-search',
    term: 'Live Search',
    category: 'advanced',
    aiSynonyms: ['Instant Search', 'Real-time Search', 'As-you-type Search', 'Dynamic Search', 'Immediate Results'],
    description: 'Search that shows results instantly as you type',
    beginnerTip: 'Results appear immediately as you type each letter - no need to press Enter!',
    aiPhrases: [
      'Implement live search',
      'Add instant search results',
      'Create real-time search',
      'Build as-you-type search',
      'Make dynamic search',
      'Add immediate search feedback'
    ],
    codeExample: `// React Live Search Example
const LiveSearch = ({ data }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    if (query) {
      const filtered = data.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query, data]);
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search..."
      />
      <div className="live-results">
        {results.map(result => (
          <div key={result}>{result}</div>
        ))}
      </div>
    </div>
  );
}`,
    demoType: 'live-search',
    relatedTerms: ['Search', 'Instant', 'Real-time']
  },

  // ===== MOBILE PATTERNS =====
  {
    id: 'bottom-sheet',
    term: 'Bottom Sheet',
    category: 'advanced',
    aiSynonyms: ['Bottom Drawer', 'Slide-up Panel', 'Bottom Modal', 'Action Sheet', 'Bottom Panel'],
    description: 'Panel that slides up from the bottom of the screen',
    beginnerTip: 'Like the share menu on iPhone - slides up from the bottom with options!',
    aiPhrases: [
      'Add bottom sheet',
      'Create slide-up panel',
      'Implement bottom drawer',
      'Build action sheet',
      'Make bottom modal',
      'Design bottom panel'
    ],
    codeExample: `// React Bottom Sheet Example
const BottomSheet = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="overlay" onClick={onClose} />
      )}
      <div className={\`bottom-sheet \${isOpen ? 'open' : ''}\`}>
        <div className="handle" />
        {children}
      </div>
    </>
  );
}`,
    demoType: 'bottom-sheet',
    relatedTerms: ['Drawer', 'Modal', 'Panel']
  },

  {
    id: 'floating-action',
    term: 'Floating Action Button',
    category: 'ui-components',
    aiSynonyms: ['FAB', 'Floating Button', 'Action Button', 'Float Button', 'Fixed Action Button'],
    description: 'Circular button that floats above content, usually in the bottom corner',
    beginnerTip: 'The round "+" button floating in the corner of apps - always accessible for main actions!',
    aiPhrases: [
      'Add floating action button',
      'Create FAB component',
      'Implement floating button',
      'Build action button',
      'Make fixed action button',
      'Add plus button'
    ],
    codeExample: `// React FAB Example
const FloatingActionButton = ({ onClick, icon }) => {
  return (
    <button 
      className="fab"
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
      }}
    >
      {icon}
    </button>
  );
}`,
    demoType: 'fab',
    relatedTerms: ['Button', 'Action', 'Fixed']
  }
]