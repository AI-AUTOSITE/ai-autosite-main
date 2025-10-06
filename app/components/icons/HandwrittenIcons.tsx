// components/icons/HandwrittenIcons.tsx
import { FC } from 'react'

export interface IconProps {
  size?: number
  color?: string
  className?: string
  strokeWidth?: number
}

export type HandwrittenIconName =
  | 'hand-heart'
  | 'hand-star'
  | 'hand-home'
  | 'hand-smile'
  | 'hand-sun'
  | 'hand-flower'
  | 'hand-check'
  | 'hand-arrow'
  | 'hand-cloud'
  | 'hand-mail'

// Handwritten style icons with rough, sketchy paths
const handwrittenIcons = {
  // Hand-drawn Heart
  'hand-heart': (props: IconProps) => (
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
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        style={{ strokeDasharray: '0.5 0.5' }}
      />
      {/* Double line for sketch effect */}
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        opacity="0.3"
        transform="translate(0.2, 0.2)"
      />
    </svg>
  ),

  // Hand-drawn Star
  'hand-star': (props: IconProps) => (
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
      {/* Wobbly star path */}
      <path d="M12 2.5l2.8 8.3h8.7l-7.1 5.2 2.7 8.5-7.1-5.3-7.1 5.3 2.7-8.5-7.1-5.2h8.7z" />
      {/* Add sketch lines */}
      <path d="M12 2.5l2.8 8.3" opacity="0.4" strokeDasharray="1 1" />
      <path d="M20.5 10.8l-7.1 5.2" opacity="0.4" strokeDasharray="1 1" />
    </svg>
  ),

  // Hand-drawn Home
  'hand-home': (props: IconProps) => (
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
      {/* Wobbly house */}
      <path d="M3.2 9.3l8.8-7.1 8.8 7.1v10.9a2 2 0 0 1-2 2H5.2a2 2 0 0 1-2-2z" />
      <path d="M9.2 22.2V12.2h5.6v10" />
      {/* Chimney */}
      <path d="M16 5v3" strokeDasharray="0.5 0.5" />
      {/* Window */}
      <circle cx="7" cy="14" r="1.5" />
      <circle cx="17" cy="14" r="1.5" />
    </svg>
  ),

  // Hand-drawn Smile
  'hand-smile': (props: IconProps) => (
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
      <path d="M12 2.5c5.2 0 9.5 4.3 9.5 9.5s-4.3 9.5-9.5 9.5-9.5-4.3-9.5-9.5 4.3-9.5 9.5-9.5z" />
      {/* Eyes */}
      <circle cx="8.5" cy="10" r="0.5" fill={props.color || 'currentColor'} />
      <circle cx="15.5" cy="10" r="0.5" fill={props.color || 'currentColor'} />
      {/* Smile */}
      <path d="M8 14c0 0 1.5 2.5 4 2.5s4-2.5 4-2.5" />
    </svg>
  ),

  // Hand-drawn Sun
  'hand-sun': (props: IconProps) => (
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
      {/* Center circle */}
      <circle cx="12" cy="12" r="4.5" />
      {/* Wavy rays */}
      <path d="M12 1.5v5" />
      <path d="M12 17.5v5" />
      <path d="M4.2 4.2l3.5 3.5" />
      <path d="M16.3 16.3l3.5 3.5" />
      <path d="M1.5 12h5" />
      <path d="M17.5 12h5" />
      <path d="M4.2 19.8l3.5-3.5" />
      <path d="M16.3 7.7l3.5-3.5" />
    </svg>
  ),

  // Hand-drawn Flower
  'hand-flower': (props: IconProps) => (
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
      {/* Center */}
      <circle cx="12" cy="12" r="2.5" />
      {/* Petals */}
      <ellipse cx="12" cy="5" rx="2.5" ry="3.5" />
      <ellipse cx="12" cy="19" rx="2.5" ry="3.5" />
      <ellipse cx="5" cy="12" rx="3.5" ry="2.5" />
      <ellipse cx="19" cy="12" rx="3.5" ry="2.5" />
      {/* Diagonal petals */}
      <ellipse cx="7" cy="7" rx="2" ry="2.5" transform="rotate(-45 7 7)" />
      <ellipse cx="17" cy="7" rx="2" ry="2.5" transform="rotate(45 17 7)" />
      <ellipse cx="7" cy="17" rx="2" ry="2.5" transform="rotate(45 7 17)" />
      <ellipse cx="17" cy="17" rx="2" ry="2.5" transform="rotate(-45 17 17)" />
    </svg>
  ),

  // Hand-drawn Check
  'hand-check': (props: IconProps) => (
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
      {/* Wobbly checkmark */}
      <path d="M20.5 6.5l-11 11.5-5.5-5.5" />
      {/* Double line effect */}
      <path d="M20.3 6.7l-10.8 11.3-5.3-5.3" opacity="0.3" />
    </svg>
  ),

  // Hand-drawn Arrow
  'hand-arrow': (props: IconProps) => (
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
      {/* Wobbly arrow */}
      <path d="M5.5 12h13" />
      <path d="M13 6.5l5.5 5.5-5.5 5.5" />
      {/* Sketch effect */}
      <path d="M5.7 12.2h12.8" opacity="0.3" strokeDasharray="0.5 0.5" />
    </svg>
  ),

  // Hand-drawn Cloud
  'hand-cloud': (props: IconProps) => (
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
      {/* Wobbly cloud shape */}
      <path d="M18.5 10.5a4 4 0 0 0-7.5-2 3 3 0 0 0-5.8 1.5 2.5 2.5 0 0 0 .3 5h12a3 3 0 0 0 .5-5.5z" />
      {/* Rain drops (optional) */}
      <path d="M8 17l.5 2" strokeDasharray="0.5 1" opacity="0.5" />
      <path d="M12 17l.5 2" strokeDasharray="0.5 1" opacity="0.5" />
      <path d="M16 17l.5 2" strokeDasharray="0.5 1" opacity="0.5" />
    </svg>
  ),

  // Hand-drawn Mail
  'hand-mail': (props: IconProps) => (
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
      {/* Envelope */}
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      {/* Letter flap */}
      <path d="M3.5 5.5l8.5 6.5 8.5-6.5" />
      {/* Sketch lines */}
      <path d="M3.5 18.5l5-4" opacity="0.3" strokeDasharray="0.5 0.5" />
      <path d="M20.5 18.5l-5-4" opacity="0.3" strokeDasharray="0.5 0.5" />
    </svg>
  ),
}

// Main Handwritten Icon component
export const HandwrittenIcon: FC<{ name: HandwrittenIconName } & IconProps> = ({
  name,
  ...props
}) => {
  const IconComponent = handwrittenIcons[name]

  if (!IconComponent) {
    console.warn(`Handwritten icon "${name}" not found`)
    return null
  }

  return <IconComponent {...props} />
}

// Individual exports
export const HandHeartIcon = (props: IconProps) => <HandwrittenIcon name="hand-heart" {...props} />
export const HandStarIcon = (props: IconProps) => <HandwrittenIcon name="hand-star" {...props} />
export const HandHomeIcon = (props: IconProps) => <HandwrittenIcon name="hand-home" {...props} />
export const HandSmileIcon = (props: IconProps) => <HandwrittenIcon name="hand-smile" {...props} />
export const HandSunIcon = (props: IconProps) => <HandwrittenIcon name="hand-sun" {...props} />
export const HandFlowerIcon = (props: IconProps) => (
  <HandwrittenIcon name="hand-flower" {...props} />
)
export const HandCheckIcon = (props: IconProps) => <HandwrittenIcon name="hand-check" {...props} />
export const HandArrowIcon = (props: IconProps) => <HandwrittenIcon name="hand-arrow" {...props} />
export const HandCloudIcon = (props: IconProps) => <HandwrittenIcon name="hand-cloud" {...props} />
export const HandMailIcon = (props: IconProps) => <HandwrittenIcon name="hand-mail" {...props} />
