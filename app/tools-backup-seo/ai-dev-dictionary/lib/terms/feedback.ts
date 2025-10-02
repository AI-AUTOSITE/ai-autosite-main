// app/tools/ai-dev-dictionary/lib/terms/feedback.ts

import { TechTerm } from './types';

export const feedbackTerms: TechTerm[] = [
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
  }
];