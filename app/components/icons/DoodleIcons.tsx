// components/icons/DoodleIcons.tsx
// Trendy hand-drawn icons inspired by Notion, Linear, and modern SaaS designs
import { FC } from 'react';

export interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

export type DoodleIconName = 
  | 'doodle-search'
  | 'doodle-book-open'
  | 'doodle-code'
  | 'doodle-sparkles'
  | 'doodle-chevron-right'
  | 'doodle-filter'
  | 'doodle-x'
  | 'doodle-copy'
  | 'doodle-check'
  | 'doodle-external-link'
  | 'doodle-zap'
  | 'doodle-mouse-pointer'
  | 'doodle-layout'
  | 'doodle-component'
  | 'doodle-form-input';

// Modern doodle style icons - imperfect but intentional
const doodleIcons = {
  // Search - magnifying glass with personality
  'doodle-search': (props: IconProps) => (
    <svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      {/* Main circle with slight wobble */}
      <circle cx="10.5" cy="10.5" r="6.5" 
              strokeDasharray="0.2 0.3" 
              transform="rotate(-2 10.5 10.5)" />
      {/* Double stroke for sketch effect */}
      <circle cx="10.3" cy="10.7" r="6.3" 
              opacity="0.3" />
      {/* Handle */}
      <path d="M15.5 15.8l5.2 5.1" />
      <path d="M15.3 16l5.1 4.9" opacity="0.3" />
    </svg>
  ),

  // Book Open - like a sketch in margins
  'doodle-book-open': (props: IconProps) => (
    <svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      {/* Spine */}
      <path d="M12 3v15.5" />
      {/* Left page */}
      <path d="M12 3.5c0 0-3.5-0.5-7 0.5v13c3.5-1 7-0.5 7-0.5" />
      {/* Right page */}
      <path d="M12 3.5c0 0 3.5-0.5 7 0.5v13c-3.5-1-7-0.5-7-0.5" />
      {/* Text lines - sketchy */}
      <path d="M6 8h3" opacity="0.4" strokeDasharray="2 1" />
      <path d="M6 11h3" opacity="0.4" strokeDasharray="2 1" />
      <path d="M15 8h3" opacity="0.4" strokeDasharray="2 1" />
      <path d="M15 11h3" opacity="0.4" strokeDasharray="2 1" />
    </svg>
  ),

  // Code - brackets with personality
  'doodle-code': (props: IconProps) => (
    <svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      {/* Left bracket */}
      <path d="M8.5 4.5l-5.5 7.5 5.5 7.5" />
      <path d="M8.3 4.7l-5.3 7.3 5.3 7.3" opacity="0.3" />
      {/* Right bracket */}
      <path d="M15.5 4.5l5.5 7.5-5.5 7.5" />
      <path d="M15.7 4.7l5.3 7.3-5.3 7.3" opacity="0.3" />
    </svg>
  ),

  // Sparkles - whimsical stars
  'doodle-sparkles': (props: IconProps) => (
    <svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      {/* Main star - organic shape */}
      <path d="M12 2.5l1.5 5.5 5.5 1.5-5.5 1.5-1.5 5.5-1.5-5.5-5.5-1.5 5.5-1.5z" />
      {/* Small stars */}
      <path d="M18 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" transform="scale(0.5) translate(20, 4)" />
      <path d="M5 16l0.5 1.5 1.5 0.5-1.5 0.5-0.5 1.5-0.5-1.5-1.5-0.5 1.5-0.5z" />
      {/* Dots for extra sparkle */}
      <circle cx="4" cy="6" r="0.5" fill={props.color || 'currentColor'} />
      <circle cx="20" cy="18" r="0.5" fill={props.color || 'currentColor'} />
    </svg>
  ),

  // Chevron Right - casual arrow
  'doodle-chevron-right': (props: IconProps) => (
    <svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M8.5 4.5l7.5 7.5-7.5 7.5" />
      <path d="M8.7 4.3l7.3 7.7-7.3 7.7" opacity="0.3" />
    </svg>
  ),

  // Filter - funnel with character
  'doodle-filter': (props: IconProps) => (
    <svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M3 5h18l-6 7v7l-6-2v-5z" />
      <path d="M3.2 5.2h17.6l-5.8 6.8v7l-6-2v-5z" opacity="0.3" />
      {/* Filter lines */}
      <path d="M7 8h10" opacity="0.2" strokeDasharray="1 1" />
    </svg>
  ),

  // X - close with attitude
  'doodle-x': (props: IconProps) => (
    <svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M18.5 5.5l-13 13" />
      <path d="M5.5 5.5l13 13" />
      {/* Sketch effect */}
      <path d="M18.3 5.7l-12.6 12.6" opacity="0.3" />
      <path d="M5.7 5.7l12.6 12.6" opacity="0.3" />
    </svg>
  ),

  // Copy - overlapping papers
  'doodle-copy': (props: IconProps) => (
    <svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      {/* Back paper */}
      <rect x="5" y="5" width="11" height="11" rx="1" transform="rotate(-1 10.5 10.5)" />
      {/* Front paper */}
      <rect x="8" y="8" width="11" height="11" rx="1" transform="rotate(1 13.5 13.5)" />
      {/* Copy lines */}
      <path d="M10 11h7" opacity="0.3" strokeDasharray="2 1" />
      <path d="M10 14h5" opacity="0.3" strokeDasharray="2 1" />
    </svg>
  ),

  // Check - confident tick
  'doodle-check': (props: IconProps) => (
    <svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M4.5 12.5l5 5 10.5-11" />
      <path d="M4.7 12.3l4.8 5.2 10.3-11.2" opacity="0.4" />
      {/* Extra strokes for emphasis */}
      <path d="M4.3 12.7l5.2 4.8" opacity="0.2" />
    </svg>
  ),

  // External Link - box with arrow
  'doodle-external-link': (props: IconProps) => (
    <svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      {/* Box */}
      <path d="M18 14v5.5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V7.5a1 1 0 0 1 1-1H11" />
      {/* Arrow going out */}
      <path d="M14 4h6.5v6.5" />
      <path d="M20.5 4L11 13.5" />
      {/* Sketch effect */}
      <path d="M20.3 4.2L11.2 13.3" opacity="0.3" />
    </svg>
  ),

  // Zap - lightning bolt
  'doodle-zap': (props: IconProps) => (
    <svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M13.5 2.5l-9.5 11h8l-1 8 9.5-11h-8z" />
      <path d="M13.3 2.7l-9.3 10.8h8l-1 8 9.3-10.8h-8z" opacity="0.3" />
      {/* Energy lines */}
      <path d="M5 8l2-1" opacity="0.4" strokeDasharray="0.5 1" />
      <path d="M17 16l2 1" opacity="0.4" strokeDasharray="0.5 1" />
    </svg>
  ),

  // Mouse Pointer - cursor with style
  'doodle-mouse-pointer': (props: IconProps) => (
    <svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M3.5 3.5l7.5 17 3-7 7-3z" />
      <path d="M3.7 3.7l7.3 16.8 3-7 7-3z" opacity="0.3" />
      {/* Click effect */}
      <circle cx="14" cy="10" r="1" opacity="0.4" />
    </svg>
  ),

  // Layout - grid with personality
  'doodle-layout': (props: IconProps) => (
    <svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      {/* Main container */}
      <rect x="3.5" y="3.5" width="17" height="17" rx="1" transform="rotate(-0.5 12 12)" />
      {/* Header */}
      <path d="M3.5 8.5h17" />
      {/* Sidebar */}
      <path d="M8.5 8.5v12" />
      {/* Content blocks */}
      <rect x="11" y="11" width="3" height="2" opacity="0.3" />
      <rect x="15" y="11" width="3" height="2" opacity="0.3" />
      <rect x="11" y="15" width="7" height="2" opacity="0.3" />
    </svg>
  ),

  // Component - building blocks
  'doodle-component': (props: IconProps) => (
    <svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      {/* Diamond shapes interconnected */}
      <path d="M12 2.5l4.5 4.5-4.5 4.5-4.5-4.5z" />
      <path d="M12 12.5l4.5 4.5-4.5 4.5-4.5-4.5z" />
      {/* Connection lines */}
      <path d="M12 11.5v1" />
      {/* Sketch effect */}
      <path d="M11.8 2.7l4.3 4.3-4.3 4.3-4.3-4.3z" opacity="0.3" />
    </svg>
  ),

  // Form Input - text field
  'doodle-form-input': (props: IconProps) => (
    <svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.color || 'currentColor'}
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      {/* Input box */}
      <rect x="3" y="8" width="18" height="8" rx="1" transform="rotate(-0.5 12 12)" />
      {/* Cursor */}
      <path d="M6 12h1" strokeWidth="3" />
      {/* Text placeholder */}
      <path d="M9 12h9" opacity="0.3" strokeDasharray="2 2" />
      {/* Label */}
      <path d="M3 5h5" opacity="0.6" />
    </svg>
  ),
};

// Main Doodle Icon component
export const DoodleIcon: FC<{ name: DoodleIconName } & IconProps> = ({ 
  name, 
  ...props 
}) => {
  const IconComponent = doodleIcons[name];
  
  if (!IconComponent) {
    console.warn(`Doodle icon "${name}" not found`);
    return null;
  }
  
  return <IconComponent {...props} />;
};

// Individual exports for convenience
export const DoodleSearchIcon = (props: IconProps) => <DoodleIcon name="doodle-search" {...props} />;
export const DoodleBookOpenIcon = (props: IconProps) => <DoodleIcon name="doodle-book-open" {...props} />;
export const DoodleCodeIcon = (props: IconProps) => <DoodleIcon name="doodle-code" {...props} />;
export const DoodleSparklesIcon = (props: IconProps) => <DoodleIcon name="doodle-sparkles" {...props} />;
export const DoodleChevronRightIcon = (props: IconProps) => <DoodleIcon name="doodle-chevron-right" {...props} />;
export const DoodleFilterIcon = (props: IconProps) => <DoodleIcon name="doodle-filter" {...props} />;
export const DoodleXIcon = (props: IconProps) => <DoodleIcon name="doodle-x" {...props} />;
export const DoodleCopyIcon = (props: IconProps) => <DoodleIcon name="doodle-copy" {...props} />;
export const DoodleCheckIcon = (props: IconProps) => <DoodleIcon name="doodle-check" {...props} />;
export const DoodleExternalLinkIcon = (props: IconProps) => <DoodleIcon name="doodle-external-link" {...props} />;
export const DoodleZapIcon = (props: IconProps) => <DoodleIcon name="doodle-zap" {...props} />;
export const DoodleMousePointerIcon = (props: IconProps) => <DoodleIcon name="doodle-mouse-pointer" {...props} />;
export const DoodleLayoutIcon = (props: IconProps) => <DoodleIcon name="doodle-layout" {...props} />;
export const DoodleComponentIcon = (props: IconProps) => <DoodleIcon name="doodle-component" {...props} />;
export const DoodleFormInputIcon = (props: IconProps) => <DoodleIcon name="doodle-form-input" {...props} />;