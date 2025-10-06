// app/tools/ai-dev-dictionary/lib/terms/ui-components.ts

import { TechTerm } from './types'

export const uiComponentTerms: TechTerm[] = [
  {
    id: 'modal',
    term: 'Modal',
    category: 'ui-components',
    aiSynonyms: [
      'Dialog',
      'Popup',
      'Overlay',
      'Lightbox',
      'Dialog Box',
      'Pop-up Window',
      'Floating Window',
      'Modal Window',
    ],
    description:
      'A window that appears on top of the main content, requiring user interaction before continuing',
    beginnerTip:
      'Think of it like a "pause screen" in a game - everything else stops until you deal with it!',
    aiPhrases: [
      'Show a modal when the user clicks the button',
      'Display this in a dialog box',
      'Create an overlay window for confirmation',
      'Open a popup to collect user input',
      'Present this form in a lightbox',
      'Show a floating window with options',
    ],
    codeExample: `// React Modal Example - Super Simple!
import { useState } from 'react';

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
    relatedTerms: ['Toast', 'Drawer', 'Alert', 'Dialog'],
  },

  {
    id: 'card',
    term: 'Card',
    category: 'ui-components',
    aiSynonyms: ['Panel', 'Tile', 'Box', 'Container', 'Content Card', 'Info Card', 'Widget'],
    description:
      'A rectangular container that groups related information together, like a playing card',
    beginnerTip:
      'Imagine a business card or trading card - it contains all related info in one neat package!',
    aiPhrases: [
      'Display each item in a card',
      'Create cards for the products',
      'Show information in card format',
      'Use cards to organize content',
      'Make card components for each user',
      'Wrap content in a card container',
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
    relatedTerms: ['Panel', 'Container', 'Box'],
  },

  {
    id: 'avatar',
    term: 'Avatar',
    category: 'ui-components',
    aiSynonyms: [
      'Profile Picture',
      'User Icon',
      'Profile Image',
      'User Avatar',
      'Profile Photo',
      'User Thumbnail',
    ],
    description: 'A small image or icon representing a user',
    beginnerTip:
      'The little round picture that represents you - like your profile pic on social media!',
    aiPhrases: [
      'Add user avatar',
      'Show profile picture',
      'Display user icon',
      'Create profile image',
      'Implement user thumbnail',
      'Add profile photo',
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
    relatedTerms: ['Profile', 'User', 'Image'],
  },

  {
    id: 'chip',
    term: 'Chip',
    category: 'ui-components',
    aiSynonyms: ['Tag', 'Badge', 'Label', 'Pill', 'Token', 'Removable Tag'],
    description: 'Small, interactive element often used for tags or filters that can be removed',
    beginnerTip:
      'Like removable tags - click the X to remove them. Often used for filters or selections!',
    aiPhrases: [
      'Add removable chips',
      'Create filter tags',
      'Implement selectable chips',
      'Make deletable tags',
      'Add token elements',
      'Build filter pills',
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
    relatedTerms: ['Badge', 'Tag', 'Label'],
  },

  {
    id: 'fab',
    term: 'Floating Action Button',
    category: 'ui-components',
    aiSynonyms: ['FAB', 'Floating Button', 'Action Button', 'Float Button', 'Fixed Action Button'],
    description: 'Circular button that floats above content, usually in the bottom corner',
    beginnerTip:
      'The round "+" button floating in the corner of apps - always accessible for main actions!',
    aiPhrases: [
      'Add floating action button',
      'Create FAB component',
      'Implement floating button',
      'Build action button',
      'Make fixed action button',
      'Add plus button',
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
    relatedTerms: ['Button', 'Action', 'Fixed'],
  },
]
