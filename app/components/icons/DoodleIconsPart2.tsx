// components/icons/DoodleIconsPart2.tsx
// Trendy hand-drawn icons - Part 2
// Inspired by modern startup aesthetics
import { FC } from 'react'

export interface IconProps {
  size?: number
  color?: string
  className?: string
  strokeWidth?: number
}

export type DoodleIconName2 =
  | 'doodle-message-square'
  | 'doodle-loader'
  | 'doodle-link'
  | 'doodle-grid'
  | 'doodle-list'
  | 'doodle-bot'
  | 'doodle-user'
  | 'doodle-upload'
  | 'doodle-download'
  | 'doodle-undo'
  | 'doodle-shield'
  | 'doodle-alert-circle'
  | 'doodle-check-circle'
  | 'doodle-lock'
  | 'doodle-info'

const doodleIcons2 = {
  // Message Square - chat bubble
  'doodle-message-square': (props: IconProps) => (
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
      {/* Speech bubble with tail */}
      <path
        d="M4 4h16c1 0 2 1 2 2v10c0 1-1 2-2 2h-8l-4 4v-4H4c-1 0-2-1-2-2V6c0-1 1-2 2-2z"
        transform="rotate(-1 12 12)"
      />
      {/* Message dots */}
      <circle cx="8" cy="10" r="0.5" fill={props.color || 'currentColor'} opacity="0.6" />
      <circle cx="12" cy="10" r="0.5" fill={props.color || 'currentColor'} opacity="0.6" />
      <circle cx="16" cy="10" r="0.5" fill={props.color || 'currentColor'} opacity="0.6" />
      {/* Sketch effect */}
      <path d="M4.2 4.2h15.6c1 0 2 1 2 2v9.8c0 1-1 2-2 2h-8l-4 4v-4H4.2" opacity="0.2" />
    </svg>
  ),

  // Loader - spinning dots
  'doodle-loader': (props: IconProps) => (
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
      {/* Circular loading pattern */}
      <circle cx="12" cy="5" r="1.5" opacity="1" />
      <circle cx="17" cy="7" r="1.5" opacity="0.8" />
      <circle cx="19" cy="12" r="1.5" opacity="0.6" />
      <circle cx="17" cy="17" r="1.5" opacity="0.4" />
      <circle cx="12" cy="19" r="1.5" opacity="0.3" />
      <circle cx="7" cy="17" r="1.5" opacity="0.2" />
      <circle cx="5" cy="12" r="1.5" opacity="0.2" />
      <circle cx="7" cy="7" r="1.5" opacity="0.2" />
    </svg>
  ),

  // Link - chain links
  'doodle-link': (props: IconProps) => (
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
      {/* First link */}
      <path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1 1" />
      {/* Second link */}
      <path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1-1" />
      {/* Sketch effect */}
      <path d="M9.8 13.2a5 5 0 0 0 7.5.5l2-2" opacity="0.3" />
    </svg>
  ),

  // Grid 3x3
  'doodle-grid': (props: IconProps) => (
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
      {/* Grid lines - slightly wonky */}
      <path d="M3.5 3.5h17v17h-17z" transform="rotate(-0.5 12 12)" />
      <path d="M9.5 3.5v17" />
      <path d="M14.5 3.5v17" />
      <path d="M3.5 9.5h17" />
      <path d="M3.5 14.5h17" />
      {/* Dots in squares */}
      <circle cx="6.5" cy="6.5" r="0.5" fill={props.color || 'currentColor'} opacity="0.3" />
      <circle cx="12" cy="12" r="0.5" fill={props.color || 'currentColor'} opacity="0.3" />
      <circle cx="17.5" cy="17.5" r="0.5" fill={props.color || 'currentColor'} opacity="0.3" />
    </svg>
  ),

  // List - menu lines
  'doodle-list': (props: IconProps) => (
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
      {/* List items with bullets */}
      <circle cx="5" cy="6" r="1" fill={props.color || 'currentColor'} />
      <path d="M9 6h11" />
      <circle cx="5" cy="12" r="1" fill={props.color || 'currentColor'} />
      <path d="M9 12h11" />
      <circle cx="5" cy="18" r="1" fill={props.color || 'currentColor'} />
      <path d="M9 18h11" />
      {/* Sketch effect */}
      <path d="M9.2 6.2h10.6" opacity="0.2" />
      <path d="M9.2 12.2h10.6" opacity="0.2" />
    </svg>
  ),

  // Bot - friendly robot
  'doodle-bot': (props: IconProps) => (
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
      {/* Head */}
      <rect x="6" y="8" width="12" height="10" rx="2" transform="rotate(-1 12 13)" />
      {/* Antenna */}
      <path d="M12 8V5" />
      <circle cx="12" cy="4" r="1" />
      {/* Eyes */}
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      {/* Mouth */}
      <path d="M9 15h6" />
      {/* Arms */}
      <path d="M6 11h-2" opacity="0.6" />
      <path d="M18 11h2" opacity="0.6" />
    </svg>
  ),

  // User - person silhouette
  'doodle-user': (props: IconProps) => (
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
      {/* Head */}
      <circle cx="12" cy="7" r="3.5" transform="rotate(-2 12 7)" />
      {/* Body */}
      <path d="M5.5 21c0-4 3-7 6.5-7s6.5 3 6.5 7" />
      {/* Sketch effect */}
      <circle cx="11.8" cy="7.2" r="3.3" opacity="0.3" />
    </svg>
  ),

  // Upload - cloud with arrow up
  'doodle-upload': (props: IconProps) => (
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
      {/* Cloud shape */}
      <path d="M18 10a4 4 0 0 0-6.5-3 3 3 0 0 0-5.5 2 2.5 2.5 0 0 0 0 5h12a3 3 0 0 0 0-4z" />
      {/* Upload arrow */}
      <path d="M12 11v7" />
      <path d="M9 14l3-3 3 3" />
      {/* Sketch effect */}
      <path d="M11.8 11.2v6.8" opacity="0.3" />
    </svg>
  ),

  // Download - cloud with arrow down
  'doodle-download': (props: IconProps) => (
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
      {/* Cloud shape */}
      <path d="M18 10a4 4 0 0 0-6.5-3 3 3 0 0 0-5.5 2 2.5 2.5 0 0 0 0 5h12a3 3 0 0 0 0-4z" />
      {/* Download arrow */}
      <path d="M12 11v7" />
      <path d="M9 15l3 3 3-3" />
      {/* Sketch effect */}
      <path d="M11.8 11.2v6.8" opacity="0.3" />
    </svg>
  ),

  // Undo - curved arrow
  'doodle-undo': (props: IconProps) => (
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
      {/* Curved arrow */}
      <path d="M3 7h6" />
      <path d="M3 7l3-3" />
      <path d="M3 7l3 3" />
      <path d="M3 7c0 0 4-2 8-2 6 0 10 4 10 9s-4 9-10 9c-4 0-7-2-8-4" />
      {/* Sketch effect */}
      <path d="M3.2 7.2c0 0 4-2 8-2" opacity="0.3" />
    </svg>
  ),

  // Shield - protection badge
  'doodle-shield': (props: IconProps) => (
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
      {/* Shield shape */}
      <path d="M12 3l8 3v5c0 5-3 9-8 10-5-1-8-5-8-10V6l8-3z" transform="rotate(-1 12 12)" />
      {/* Check mark inside */}
      <path d="M8 11l3 3 5-5" opacity="0.6" />
      {/* Sketch effect */}
      <path d="M11.8 3.2l7.8 2.8v5c0 5-3 9-7.8 10" opacity="0.3" />
    </svg>
  ),

  // Alert Circle - warning sign
  'doodle-alert-circle': (props: IconProps) => (
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
      {/* Wobbly circle */}
      <circle cx="12" cy="12" r="9" transform="rotate(-2 12 12)" />
      {/* Exclamation */}
      <path d="M12 8v5" />
      <circle cx="12" cy="16" r="0.5" fill={props.color || 'currentColor'} />
      {/* Sketch effect */}
      <circle cx="11.8" cy="12.2" r="8.8" opacity="0.3" />
    </svg>
  ),

  // Check Circle - success
  'doodle-check-circle': (props: IconProps) => (
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
      {/* Circle */}
      <circle cx="12" cy="12" r="9" transform="rotate(1 12 12)" />
      {/* Check mark */}
      <path d="M8 12l3 3 5-6" />
      {/* Sketch effect */}
      <circle cx="12.2" cy="11.8" r="8.8" opacity="0.3" />
    </svg>
  ),

  // Lock - padlock
  'doodle-lock': (props: IconProps) => (
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
      {/* Lock body */}
      <rect x="6" y="11" width="12" height="9" rx="1" transform="rotate(-1 12 15.5)" />
      {/* Shackle */}
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      {/* Keyhole */}
      <circle cx="12" cy="15" r="1" />
      <path d="M12 16v2" />
      {/* Sketch effect */}
      <rect x="6.2" y="11.2" width="11.6" height="8.6" rx="1" opacity="0.3" />
    </svg>
  ),

  // Info - information circle
  'doodle-info': (props: IconProps) => (
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
      {/* Circle */}
      <circle cx="12" cy="12" r="9" transform="rotate(2 12 12)" />
      {/* Info symbol */}
      <path d="M12 16v-4" />
      <circle cx="12" cy="8" r="0.5" fill={props.color || 'currentColor'} />
      {/* Sketch effect */}
      <circle cx="12.2" cy="12.2" r="8.8" opacity="0.3" />
    </svg>
  ),
}

// Main component
export const DoodleIcon2: FC<{ name: DoodleIconName2 } & IconProps> = ({ name, ...props }) => {
  const IconComponent = doodleIcons2[name]

  if (!IconComponent) {
    console.warn(`Doodle icon "${name}" not found`)
    return null
  }

  return <IconComponent {...props} />
}

// Individual exports
export const DoodleMessageSquareIcon = (props: IconProps) => (
  <DoodleIcon2 name="doodle-message-square" {...props} />
)
export const DoodleLoaderIcon = (props: IconProps) => (
  <DoodleIcon2 name="doodle-loader" {...props} />
)
export const DoodleLinkIcon = (props: IconProps) => <DoodleIcon2 name="doodle-link" {...props} />
export const DoodleGridIcon = (props: IconProps) => <DoodleIcon2 name="doodle-grid" {...props} />
export const DoodleListIcon = (props: IconProps) => <DoodleIcon2 name="doodle-list" {...props} />
export const DoodleBotIcon = (props: IconProps) => <DoodleIcon2 name="doodle-bot" {...props} />
export const DoodleUserIcon = (props: IconProps) => <DoodleIcon2 name="doodle-user" {...props} />
export const DoodleUploadIcon = (props: IconProps) => (
  <DoodleIcon2 name="doodle-upload" {...props} />
)
export const DoodleDownloadIcon = (props: IconProps) => (
  <DoodleIcon2 name="doodle-download" {...props} />
)
export const DoodleUndoIcon = (props: IconProps) => <DoodleIcon2 name="doodle-undo" {...props} />
export const DoodleShieldIcon = (props: IconProps) => (
  <DoodleIcon2 name="doodle-shield" {...props} />
)
export const DoodleAlertCircleIcon = (props: IconProps) => (
  <DoodleIcon2 name="doodle-alert-circle" {...props} />
)
export const DoodleCheckCircleIcon = (props: IconProps) => (
  <DoodleIcon2 name="doodle-check-circle" {...props} />
)
export const DoodleLockIcon = (props: IconProps) => <DoodleIcon2 name="doodle-lock" {...props} />
export const DoodleInfoIcon = (props: IconProps) => <DoodleIcon2 name="doodle-info" {...props} />
