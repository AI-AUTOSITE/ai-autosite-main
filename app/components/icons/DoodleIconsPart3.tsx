// components/icons/DoodleIconsPart3.tsx
// Trendy hand-drawn icons - Part 3 (Final)
// Modern startup aesthetic continues
import { FC } from 'react'

export interface IconProps {
  size?: number
  color?: string
  className?: string
  strokeWidth?: number
}

export type DoodleIconName3 =
  | 'doodle-file-image'
  | 'doodle-move'
  | 'doodle-github'
  | 'doodle-folder'
  | 'doodle-help-circle'
  | 'doodle-file-code'
  | 'doodle-save'
  | 'doodle-file-text'
  | 'doodle-menu'
  | 'doodle-chevron-left'

const doodleIcons3 = {
  // File Image - picture doc
  'doodle-file-image': (props: IconProps) => (
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
      {/* Page with folded corner */}
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        transform="rotate(-0.5 12 12)"
      />
      <path d="M14 2v6h6" />
      {/* Image inside - mountains and sun */}
      <circle cx="9" cy="11" r="1.5" />
      <path d="M7 17l3-3 2 2 5-5" />
      {/* Sketch effect */}
      <path d="M13.8 2.2v5.8h5.8" opacity="0.3" />
    </svg>
  ),

  // Move - drag handle
  'doodle-move': (props: IconProps) => (
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
      {/* Cross arrows */}
      <path d="M12 2v20" />
      <path d="M9 5l3-3 3 3" />
      <path d="M9 19l3 3 3-3" />
      <path d="M2 12h20" />
      <path d="M5 9l-3 3 3 3" />
      <path d="M19 9l3 3-3 3" />
      {/* Center dot */}
      <circle cx="12" cy="12" r="1" fill={props.color || 'currentColor'} opacity="0.4" />
    </svg>
  ),

  // GitHub - octocat inspired
  'doodle-github': (props: IconProps) => (
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
      {/* Cat head shape */}
      <path d="M12 2C6.5 2 2 6.5 2 12c0 4.5 3 8.3 7 9.5.5.1.7-.2.7-.5v-2c-3 .7-3.5-1.5-3.5-1.5-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.7-1.4-2.4-.3-4.9-1.2-4.9-5.3 0-1.2.4-2.1 1-2.9-.1-.3-.5-1.4.1-2.8 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.5.1 2.8.7.8 1 1.7 1 2.9 0 4.1-2.5 5-4.9 5.3.4.3.7 1 .7 2v3c0 .3.2.6.7.5 4-1.3 7-5 7-9.5C22 6.5 17.5 2 12 2z" />
      {/* Sketch effect */}
      <path d="M11.8 2.2C6.3 2.2 1.8 6.7 1.8 12.2" opacity="0.3" />
    </svg>
  ),

  // Folder - file container
  'doodle-folder': (props: IconProps) => (
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
      {/* Folder shape with tab */}
      <path
        d="M3 5a2 2 0 0 1 2-2h4l3 3h8a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        transform="rotate(-0.5 12.5 12)"
      />
      {/* Folder opening */}
      <path d="M3 8h19" opacity="0.4" />
      {/* Papers inside */}
      <path d="M7 13h10" opacity="0.3" strokeDasharray="2 1" />
      <path d="M7 16h8" opacity="0.3" strokeDasharray="2 1" />
    </svg>
  ),

  // Help Circle - question mark
  'doodle-help-circle': (props: IconProps) => (
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
      <circle cx="12" cy="12" r="9" transform="rotate(1 12 12)" />
      {/* Question mark */}
      <path d="M9 9a3 3 0 0 1 6 0c0 2-3 3-3 3" />
      <circle cx="12" cy="17" r="0.5" fill={props.color || 'currentColor'} />
      {/* Sketch effect */}
      <circle cx="11.8" cy="12.2" r="8.8" opacity="0.3" />
    </svg>
  ),

  // File Code - code document
  'doodle-file-code': (props: IconProps) => (
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
      {/* Page */}
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        transform="rotate(0.5 12 12)"
      />
      <path d="M14 2v6h6" />
      {/* Code symbols */}
      <path d="M10 13l-2 2 2 2" />
      <path d="M14 13l2 2-2 2" />
      {/* Sketch effect */}
      <path d="M14.2 2.2v5.8h5.6" opacity="0.3" />
    </svg>
  ),

  // Save - floppy disk retro
  'doodle-save': (props: IconProps) => (
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
      {/* Disk outline */}
      <path
        d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
        transform="rotate(-0.5 12 12)"
      />
      {/* Save slider */}
      <path d="M7 3v5h8V3" />
      {/* Label area */}
      <rect x="7" y="13" width="10" height="6" rx="0.5" />
      {/* Sketch effect */}
      <path d="M6.8 3.2v4.8h8.4V3.2" opacity="0.3" />
    </svg>
  ),

  // File Text - document
  'doodle-file-text': (props: IconProps) => (
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
      {/* Page with corner */}
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        transform="rotate(-0.3 12 12)"
      />
      <path d="M14 2v6h6" />
      {/* Text lines */}
      <path d="M8 12h8" opacity="0.6" />
      <path d="M8 15h6" opacity="0.6" />
      <path d="M8 18h4" opacity="0.6" />
      {/* Sketch effect */}
      <path d="M13.7 2.3v5.7h6" opacity="0.3" />
    </svg>
  ),

  // Menu - hamburger
  'doodle-menu': (props: IconProps) => (
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
      {/* Three lines with personality */}
      <path d="M3.5 6h17" transform="rotate(-0.5 12 6)" />
      <path d="M3.5 12h17" />
      <path d="M3.5 18h17" transform="rotate(0.5 12 18)" />
      {/* Sketch effect */}
      <path d="M3.7 6.2h16.6" opacity="0.3" />
      <path d="M3.7 12.2h16.6" opacity="0.3" />
      <path d="M3.7 18.2h16.6" opacity="0.3" />
    </svg>
  ),

  // Chevron Left - back arrow
  'doodle-chevron-left': (props: IconProps) => (
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
      <path d="M15.5 4.5l-7.5 7.5 7.5 7.5" />
      <path d="M15.3 4.3l-7.3 7.7 7.3 7.7" opacity="0.3" />
    </svg>
  ),
}

// Main component
export const DoodleIcon3: FC<{ name: DoodleIconName3 } & IconProps> = ({ name, ...props }) => {
  const IconComponent = doodleIcons3[name]

  if (!IconComponent) {
    console.warn(`Doodle icon "${name}" not found`)
    return null
  }

  return <IconComponent {...props} />
}

// Individual exports
export const DoodleFileImageIcon = (props: IconProps) => (
  <DoodleIcon3 name="doodle-file-image" {...props} />
)
export const DoodleMoveIcon = (props: IconProps) => <DoodleIcon3 name="doodle-move" {...props} />
export const DoodleGithubIcon = (props: IconProps) => (
  <DoodleIcon3 name="doodle-github" {...props} />
)
export const DoodleFolderIcon = (props: IconProps) => (
  <DoodleIcon3 name="doodle-folder" {...props} />
)
export const DoodleHelpCircleIcon = (props: IconProps) => (
  <DoodleIcon3 name="doodle-help-circle" {...props} />
)
export const DoodleFileCodeIcon = (props: IconProps) => (
  <DoodleIcon3 name="doodle-file-code" {...props} />
)
export const DoodleSaveIcon = (props: IconProps) => <DoodleIcon3 name="doodle-save" {...props} />
export const DoodleFileTextIcon = (props: IconProps) => (
  <DoodleIcon3 name="doodle-file-text" {...props} />
)
export const DoodleMenuIcon = (props: IconProps) => <DoodleIcon3 name="doodle-menu" {...props} />
export const DoodleChevronLeftIcon = (props: IconProps) => (
  <DoodleIcon3 name="doodle-chevron-left" {...props} />
)
