import type { ReactNode } from "react";

import "./SpeechBubble.css";

interface SpeechBubbleProps {
  readonly children: ReactNode;
  /** Where the tail points: towards the bottom-start corner or straight down. */
  readonly tail?: "bottom-start" | "bottom";
  readonly tone?: "cream" | "white";
  readonly className?: string;
}

/** Soft rounded speech bubble used for the host's lines. */
export function SpeechBubble({ children, tail = "bottom-start", tone = "white", className = "" }: SpeechBubbleProps) {
  return (
    <div className={`speech-bubble speech-bubble--${tone} speech-bubble--tail-${tail} ${className}`} dir="auto">
      {children}
    </div>
  );
}

export default SpeechBubble;
