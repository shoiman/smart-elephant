/**
 * Inline UI icons. Directional icons carry the "icon--directional" class so
 * they mirror automatically in RTL layouts.
 */
interface IconProps {
  readonly className?: string;
}

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 2.4,
  viewBox: "0 0 24 24",
};

export function ArrowBackIcon({ className = "" }: IconProps) {
  return (
    <svg aria-hidden="true" className={`icon--directional ${className}`} {...strokeProps}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function ArrowForwardIcon({ className = "" }: IconProps) {
  return (
    <svg aria-hidden="true" className={`icon--directional ${className}`} {...strokeProps}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ChevronDownIcon({ className = "" }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...strokeProps} strokeWidth={2.6}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function CheckIcon({ className = "" }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...strokeProps} strokeWidth={2.8}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function SpeakerIcon({ className = "" }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24">
      <path d="M4 9.5h3.5L12.5 5v14l-5-4.5H4z" fill="currentColor" />
      <path d="M16 9a4.5 4.5 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
    </svg>
  );
}

export function MicIcon({ className = "" }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...strokeProps} strokeWidth={2.2}>
      <rect height="12" rx="4" width="8" x="8" y="2.5" fill="currentColor" stroke="none" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3.5" />
    </svg>
  );
}

export function RefreshIcon({ className = "" }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} {...strokeProps}>
      <path d="M20 12a8 8 0 1 1-2.6-5.9M20 4v5h-5" />
    </svg>
  );
}

export function SendIcon({ className = "" }: IconProps) {
  return (
    <svg aria-hidden="true" className={`icon--directional ${className}`} {...strokeProps}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function PawIcon({ className = "" }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <ellipse cx="5.5" cy="10" rx="2.2" ry="2.8" transform="rotate(-18 5.5 10)" />
      <ellipse cx="9.5" cy="5.6" rx="2.3" ry="2.9" transform="rotate(-6 9.5 5.6)" />
      <ellipse cx="14.5" cy="5.6" rx="2.3" ry="2.9" transform="rotate(6 14.5 5.6)" />
      <ellipse cx="18.5" cy="10" rx="2.2" ry="2.8" transform="rotate(18 18.5 10)" />
      <path d="M12 11c-3 0-6.2 3.6-6.2 6.4 0 2 1.6 3 3.4 2.7 1-.2 1.8-.6 2.8-.6s1.8.4 2.8.6c1.8.3 3.4-.7 3.4-2.7C18.2 14.6 15 11 12 11z" />
    </svg>
  );
}

export function GamepadIcon({ className = "" }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24">
      <path d="M7.2 6.5h9.6c2.6 0 4.4 2 4.9 5l.6 3.6c.4 2.4-1.1 4.4-3.1 4.4-1.3 0-2.2-.8-3-2l-.6-.9H8.4l-.6.9c-.8 1.2-1.7 2-3 2-2 0-3.5-2-3.1-4.4l.6-3.6c.5-3 2.3-5 4.9-5z" fill="currentColor" />
      <path d="M7.5 10v4M5.5 12h4" stroke="#fff" strokeLinecap="round" strokeWidth="1.8" />
      <circle cx="16" cy="10.6" r="1.1" fill="#fff" />
      <circle cx="18" cy="13" r="1.1" fill="#fff" />
    </svg>
  );
}

export function StarIcon({ className = "" }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24">
      <path
        d="M12 2.8c.5 0 .9.3 1.1.7l2.2 4.6 5 .7c1 .1 1.3 1.3.6 2l-3.6 3.5.9 5c.2 1-.8 1.7-1.7 1.2L12 18.2l-4.5 2.4c-.9.5-1.9-.3-1.7-1.2l.9-5-3.6-3.5c-.7-.7-.3-1.9.6-2l5-.7 2.2-4.6c.2-.4.6-.7 1.1-.7z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1"
      />
    </svg>
  );
}
