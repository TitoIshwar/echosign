import { useId } from 'react'

interface LogoProps {
  /** Height of the logomark in px. Width scales proportionally. */
  height?: number
  /** If true, renders only the 'O' and the radiating echo rings. */
  iconOnly?: boolean
  /** If true, renders the entire logo in the current text color (no gradients). */
  monochrome?: boolean
  className?: string
  /** @deprecated The logo is now a unified mark. Use iconOnly to show just the symbol. */
  showText?: boolean
}

/**
 * EchoSign unified brand wordmark.
 * 
 * Entirely custom-drawn geometric paths to perfectly match the
 * reference logo concept:
 * - Thin, elegant uppercase typography (E C H O S I G N)
 * - The 'O' is a perfect circle acting as the source of the echo
 * - Echo rings radiate from the right side of the 'O', naturally
 *   sitting between "ECHO" and "SIGN", deeply integrating into
 *   the wordmark itself.
 * 
 * Features:
 * - Pure SVG for perfect scaling and cross-browser consistency
 * - Inherits currentColor for seamless Light/Dark mode transitions
 * - Rings use the brand gradient (#4F46E5 → #06B6D4) unless monochrome is true.
 */
export default function Logo({
  height = 36,
  iconOnly = false,
  monochrome = false,
  showText,
  className = '',
}: LogoProps) {
  // Unique per-instance ID avoids SVG gradient conflicts
  const uid = useId().replace(/:/g, 'x')
  const gradId = `es-grad-${uid}`

  // Support legacy showText=false from Hero.tsx
  const isIcon = iconOnly || showText === false

  const ringStroke = monochrome ? "currentColor" : `url(#${gradId})`

  if (isIcon) {
    return (
      <div className={`flex items-center ${className}`} aria-label="EchoSign Mark">
        <svg height={height} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
          {!monochrome && (
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          )}
          <circle cx="14" cy="20" r="10" stroke="currentColor" strokeWidth="1.6" />
          <g stroke={ringStroke} fill="none" strokeLinecap="round">
            <path d="M 24.6 9.4 A 15 15 0 0 1 24.6 30.6" strokeWidth="1.8" opacity="1" />
            <path d="M 30.4 8.5 A 20 20 0 0 1 30.4 31.5" strokeWidth="1.5" opacity="0.6" />
            <path d="M 36.7 9.4 A 25 25 0 0 1 36.7 30.6" strokeWidth="1.2" opacity="0.3" />
          </g>
        </svg>
      </div>
    )
  }

  return (
    <div className={`flex items-center ${className}`} aria-label="EchoSign">
      <svg height={height} viewBox="0 0 164 40" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
        {!monochrome && (
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="164" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        )}

        {/* Minimalist Geometric Typography */}
        <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          {/* E */}
          <path d="M 12 10 H 2 V 30 H 12 M 2 20 H 10" />
          {/* C */}
          <path d="M 35.1 12.9 A 10 10 0 1 0 35.1 27.1" />
          {/* H */}
          <path d="M 44 10 V 30 M 54 10 V 30 M 44 20 H 54" />
          {/* O */}
          <circle cx="70" cy="20" r="10" />
          
          {/* S */}
          <path d="M 110 13 A 5 5 0 0 0 105 10 A 5 5 0 0 0 100 15 A 5 5 0 0 0 105 20 A 5 5 0 0 1 110 25 A 5 5 0 0 1 105 30 A 5 5 0 0 1 100 27" />
          {/* I */}
          <path d="M 116 10 V 30" />
          {/* G */}
          <path d="M 140 13 A 10 10 0 1 0 142 24 V 20 H 134" />
          {/* N */}
          <path d="M 148 30 V 10 L 160 30 V 10" />
        </g>

        {/* Integrated Echo Rings */}
        <g stroke={ringStroke} fill="none" strokeLinecap="round">
          <path d="M 80.6 9.4 A 15 15 0 0 1 80.6 30.6" strokeWidth="1.8" opacity="1" />
          <path d="M 86.4 8.5 A 20 20 0 0 1 86.4 31.5" strokeWidth="1.5" opacity="0.6" />
          <path d="M 92.7 9.4 A 25 25 0 0 1 92.7 30.6" strokeWidth="1.2" opacity="0.3" />
        </g>
      </svg>
    </div>
  )
}
