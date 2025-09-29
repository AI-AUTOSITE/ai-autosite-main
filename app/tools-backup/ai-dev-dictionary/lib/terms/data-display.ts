// app/tools/ai-dev-dictionary/lib/terms/data-display.ts

import { TechTerm } from './types';

export const dataDisplayTerms: TechTerm[] = [
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
import { useState } from 'react';

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
import { useState } from 'react';

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
import { useState } from 'react';

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
import { useState } from 'react';

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
  }
];