// app/tools/ai-dev-dictionary/lib/terms/layout.ts

import { TechTerm } from './types';

export const layoutTerms: TechTerm[] = [
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
  }
];