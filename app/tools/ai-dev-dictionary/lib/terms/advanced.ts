// app/tools/ai-dev-dictionary/lib/terms/advanced.ts

import { TechTerm } from './types'

export const advancedTerms: TechTerm[] = [
  {
    id: 'dropdown',
    term: 'Dropdown',
    category: 'advanced',
    aiSynonyms: [
      'Dropdown Menu',
      'Menu',
      'Context Menu',
      'Options Menu',
      'Pull-down Menu',
      'Action Menu',
    ],
    description: 'A menu that appears when clicked, showing a list of actions or options',
    beginnerTip:
      'Click to reveal hidden options - like the menu that appears when you right-click!',
    aiPhrases: [
      'Add a dropdown menu for actions',
      'Create context menu',
      'Implement options dropdown',
      'Show menu on click',
      'Display action menu',
      'Build dropdown list',
    ],
    codeExample: `// React Dropdown Example - Hidden Options!
import { useState } from 'react';

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
    relatedTerms: ['Select', 'Menu', 'Context Menu'],
  },

  {
    id: 'accordion',
    term: 'Accordion',
    category: 'advanced',
    aiSynonyms: [
      'Collapsible',
      'Expandable',
      'Dropdown Panel',
      'Toggle Content',
      'Foldable Section',
      'Collapse Panel',
    ],
    description: 'Expandable/collapsible content sections that show or hide information',
    beginnerTip: 'Like FAQ sections - click a question to reveal the answer, click again to hide!',
    aiPhrases: [
      'Create collapsible sections for FAQs',
      'Add expandable content areas',
      'Implement toggle panels for details',
      'Make sections that can be collapsed',
      'Build an accordion for Q&A',
      'Design foldable content',
    ],
    codeExample: `// React Accordion Example - Expand & Collapse!
import { useState } from 'react';

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
    relatedTerms: ['Tabs', 'Collapsible', 'Expandable'],
  },

  {
    id: 'tabs',
    term: 'Tabs',
    category: 'advanced',
    aiSynonyms: [
      'Tab Panel',
      'Tabbed Interface',
      'Tab Navigation',
      'Page Tabs',
      'Section Switcher',
      'Tab Bar',
    ],
    description: 'Navigation component that switches between different views or content sections',
    beginnerTip: 'Like browser tabs or file folders - click each tab to see different content!',
    aiPhrases: [
      'Add tabs to switch between views',
      'Create a tabbed interface',
      'Implement tab navigation for sections',
      'Use tabs to organize content',
      'Build a tab panel for categories',
      'Make section switcher',
    ],
    codeExample: `// React Tabs Example - Switch Views!
import { useState } from 'react';

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
    relatedTerms: ['Accordion', 'Navigation', 'Switcher'],
  },

  {
    id: 'tooltip',
    term: 'Tooltip',
    category: 'advanced',
    aiSynonyms: [
      'Hover Text',
      'Help Text',
      'Info Bubble',
      'Hint',
      'Popover',
      'Helper Text',
      'Hover Hint',
    ],
    description:
      'Small text that appears when hovering over an element to provide additional information',
    beginnerTip: 'Hover your mouse over something to see extra info - like hints in a game!',
    aiPhrases: [
      'Show a tooltip on hover',
      'Add help text when hovering',
      'Display additional info in a bubble',
      'Create hover hints for buttons',
      'Implement helper text on mouseover',
      'Add info popover',
    ],
    codeExample: `// React Tooltip Example - Hover for Help!
import { useState } from 'react';

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
    relatedTerms: ['Popover', 'Help Text', 'Hint'],
  },

  {
    id: 'drawer',
    term: 'Drawer',
    category: 'advanced',
    aiSynonyms: [
      'Sidebar Drawer',
      'Slide Panel',
      'Side Menu',
      'Navigation Drawer',
      'Sliding Panel',
      'Off-canvas Menu',
    ],
    description: 'A panel that slides in from the edge of the screen',
    beginnerTip:
      'Like pulling out a drawer - slides in from the side with extra options or navigation!',
    aiPhrases: [
      'Add a drawer for mobile navigation',
      'Create a sliding sidebar',
      'Implement a side panel for settings',
      'Build an off-canvas menu',
      'Show navigation in a drawer',
      'Make sliding panel',
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
    relatedTerms: ['Modal', 'Sidebar', 'Panel'],
  },

  {
    id: 'infinite-scroll',
    term: 'Infinite Scroll',
    category: 'advanced',
    aiSynonyms: [
      'Endless Scroll',
      'Lazy Load List',
      'Auto-load Content',
      'Continuous Scroll',
      'Dynamic Loading',
      'Scroll Pagination',
    ],
    description:
      'Automatically loads more content as the user scrolls down, like social media feeds',
    beginnerTip:
      'Like Facebook or Twitter - new posts appear automatically when you scroll to the bottom!',
    aiPhrases: [
      'Implement infinite scrolling for the feed',
      'Add endless scroll to the list',
      'Create auto-loading content',
      'Make continuous scroll pagination',
      'Build dynamic content loading',
      'Add scroll-triggered loading',
    ],
    codeExample: `// React Infinite Scroll Example
import { useEffect } from 'react';

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
    relatedTerms: ['Pagination', 'Lazy Loading', 'Virtual List'],
  },

  {
    id: 'lazy-loading',
    term: 'Lazy Loading',
    category: 'advanced',
    aiSynonyms: [
      'Deferred Loading',
      'On-demand Loading',
      'Progressive Loading',
      'Delayed Loading',
      'Async Loading',
    ],
    description: 'Loading content only when needed, improving initial page load speed',
    beginnerTip: 'Images load only when you scroll to them - makes the page load faster initially!',
    aiPhrases: [
      'Add lazy loading for images',
      'Implement deferred loading',
      'Create on-demand content loading',
      'Use progressive image loading',
      'Add delayed component loading',
      'Build async content loading',
    ],
    codeExample: `// React Lazy Loading Example
import { useState, useEffect, useRef } from 'react';

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
    relatedTerms: ['Infinite Scroll', 'Performance', 'Loading'],
  },

  {
    id: 'drag-drop',
    term: 'Drag and Drop',
    category: 'advanced',
    aiSynonyms: [
      'Draggable',
      'Drag & Drop',
      'Sortable List',
      'Reorderable',
      'Moveable Items',
      'DnD Interface',
    ],
    description: 'Interface allowing users to drag items and drop them in different locations',
    beginnerTip:
      'Click and hold to grab an item, then drag it to a new position - like rearranging apps on your phone!',
    aiPhrases: [
      'Add drag and drop functionality',
      'Make items draggable',
      'Create sortable list',
      'Implement reorderable items',
      'Build drag & drop interface',
      'Enable item rearrangement',
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
    relatedTerms: ['Sortable', 'Reorder', 'Interactive'],
  },

  {
    id: 'swipe-gesture',
    term: 'Swipe Gesture',
    category: 'advanced',
    aiSynonyms: [
      'Swipe Action',
      'Touch Swipe',
      'Slide Gesture',
      'Swipe to Delete',
      'Swipe Navigation',
      'Touch Gesture',
    ],
    description: 'Touch or mouse gesture to trigger actions by swiping',
    beginnerTip:
      'Like swiping photos on your phone or swiping to delete emails - slide left or right!',
    aiPhrases: [
      'Add swipe to delete',
      'Implement swipe gestures',
      'Create touch swipe actions',
      'Build swipe navigation',
      'Add slide to reveal',
      'Make swipeable cards',
    ],
    codeExample: `// React Swipe Gesture Example
import { useState } from 'react';

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
    relatedTerms: ['Gesture', 'Touch', 'Mobile Interaction'],
  },

  {
    id: 'pull-refresh',
    term: 'Pull to Refresh',
    category: 'advanced',
    aiSynonyms: [
      'Swipe to Refresh',
      'Pull Down Refresh',
      'Drag to Reload',
      'Pull to Update',
      'Refresh on Pull',
    ],
    description: 'Pulling down on content to refresh or reload it',
    beginnerTip: 'Like refreshing your Instagram feed - pull down from the top to get new content!',
    aiPhrases: [
      'Add pull to refresh functionality',
      'Implement swipe down to reload',
      'Create pull to update',
      'Build refresh on pull gesture',
      'Add drag to refresh',
      'Make content refreshable',
    ],
    codeExample: `// React Pull to Refresh Example
import { useState } from 'react';

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
    relatedTerms: ['Refresh', 'Reload', 'Update'],
  },

  {
    id: 'search-filter',
    term: 'Search with Filters',
    category: 'advanced',
    aiSynonyms: [
      'Advanced Search',
      'Filtered Search',
      'Search and Filter',
      'Faceted Search',
      'Search Refinement',
    ],
    description: 'Search functionality combined with multiple filter options',
    beginnerTip: 'Like shopping sites - search for "shoes" then filter by size, color, and price!',
    aiPhrases: [
      'Add search with filters',
      'Create advanced search',
      'Implement faceted search',
      'Build filtered search results',
      'Add search refinement',
      'Make multi-filter search',
    ],
    codeExample: `// React Search with Filters Example
import { useState } from 'react';

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
    relatedTerms: ['Search', 'Filter', 'Facets'],
  },

  {
    id: 'live-search',
    term: 'Live Search',
    category: 'advanced',
    aiSynonyms: [
      'Instant Search',
      'Real-time Search',
      'As-you-type Search',
      'Dynamic Search',
      'Immediate Results',
    ],
    description: 'Search that shows results instantly as you type',
    beginnerTip: 'Results appear immediately as you type each letter - no need to press Enter!',
    aiPhrases: [
      'Implement live search',
      'Add instant search results',
      'Create real-time search',
      'Build as-you-type search',
      'Make dynamic search',
      'Add immediate search feedback',
    ],
    codeExample: `// React Live Search Example
import { useState, useEffect } from 'react';

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
    relatedTerms: ['Search', 'Instant', 'Real-time'],
  },

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
      'Design bottom panel',
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
    relatedTerms: ['Drawer', 'Modal', 'Panel'],
  },
]
