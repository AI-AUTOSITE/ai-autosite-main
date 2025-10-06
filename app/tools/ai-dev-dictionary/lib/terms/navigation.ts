// app/tools/ai-dev-dictionary/lib/terms/navigation.ts

import { TechTerm } from './types'

export const navigationTerms: TechTerm[] = [
  {
    id: 'navbar',
    term: 'Navigation Bar',
    category: 'navigation',
    aiSynonyms: ['Navbar', 'Nav Bar', 'Menu Bar', 'Top Navigation', 'Header Nav', 'Main Menu'],
    description: 'The main navigation menu, usually at the top of a website',
    beginnerTip:
      "The menu at the top of websites with links like Home, About, Contact - your site's road map!",
    aiPhrases: [
      'Add a navigation bar at the top',
      'Create navbar with menu items',
      'Implement header navigation',
      'Make a menu bar',
      'Add top navigation menu',
      'Build main navigation',
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
    relatedTerms: ['Menu', 'Header', 'Breadcrumb'],
  },

  {
    id: 'breadcrumb',
    term: 'Breadcrumb',
    category: 'navigation',
    aiSynonyms: [
      'Breadcrumb Trail',
      'Navigation Path',
      'Page Path',
      'Navigation Trail',
      'Path Navigation',
    ],
    description: "Shows the user's location in a website hierarchy, like a trail of breadcrumbs",
    beginnerTip:
      "Like Hansel and Gretel's breadcrumbs - shows where you are: Home > Products > Shoes",
    aiPhrases: [
      'Add breadcrumb navigation',
      'Show navigation path',
      'Display page hierarchy',
      'Create breadcrumb trail',
      'Implement path navigation',
      'Add location indicator',
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
    relatedTerms: ['Navigation Bar', 'Menu', 'Pagination'],
  },

  {
    id: 'pagination',
    term: 'Pagination',
    category: 'navigation',
    aiSynonyms: [
      'Page Navigation',
      'Page Numbers',
      'Paging',
      'Page Controls',
      'Page Selector',
      'Page Links',
    ],
    description: 'Controls to navigate through multiple pages of content',
    beginnerTip:
      'The "1 2 3... Next" buttons at the bottom of search results - for navigating pages!',
    aiPhrases: [
      'Add pagination for results',
      'Create page navigation',
      'Implement paging controls',
      'Add page numbers',
      'Make next/previous buttons',
      'Build page selector',
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
    relatedTerms: ['Navigation', 'List', 'Table'],
  },

  {
    id: 'stepper',
    term: 'Stepper',
    category: 'navigation',
    aiSynonyms: [
      'Progress Steps',
      'Wizard',
      'Step Indicator',
      'Progress Bar',
      'Multi-step Form',
      'Step Navigation',
    ],
    description: 'Shows progress through a multi-step process, like a checkout flow',
    beginnerTip:
      'Like a progress bar with steps - shows "Step 1 of 3" in a checkout or signup process!',
    aiPhrases: [
      'Add a stepper for checkout',
      'Create progress steps',
      'Implement wizard navigation',
      'Make multi-step form',
      'Add step indicator',
      'Build progress navigation',
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
    relatedTerms: ['Progress Bar', 'Wizard', 'Navigation'],
  },

  {
    id: 'mega-menu',
    term: 'Mega Menu',
    category: 'navigation',
    aiSynonyms: [
      'Large Dropdown',
      'Expanded Menu',
      'Full-width Menu',
      'Multi-column Menu',
      'Complex Menu',
      'Navigation Panel',
    ],
    description: 'Large dropdown menu with multiple columns and sections',
    beginnerTip:
      "Like Amazon's menu - hover over a category and see a huge panel with all subcategories!",
    aiPhrases: [
      'Create a mega menu for navigation',
      'Add large dropdown with columns',
      'Build expanded navigation menu',
      'Implement full-width dropdown',
      'Make multi-column menu',
      'Design complex navigation panel',
    ],
    codeExample: `// React Mega Menu Example
import { useState } from 'react';

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
    relatedTerms: ['Dropdown', 'Navigation', 'Menu'],
  },
]
