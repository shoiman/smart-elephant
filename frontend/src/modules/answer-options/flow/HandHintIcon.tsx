import type { Ref } from "react";

/** Pointing hand used as a hint ("press here"); positioned and animated by startHandHint. */
export function HandHintIcon({ ref }: { readonly ref?: Ref<SVGSVGElement> }) {
  return (
    <svg
      aria-hidden="true"
      className="qhand"
      fill="#ffffff"
      ref={ref}
      stroke="var(--color-ink)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15V4a2 2 0 0 1 4 0v5.5V9a2 2 0 0 1 4 0v1a2 2 0 0 1 3 1z" />
      <path d="M11 9.5V9" />
      <path d="M15 10v1" />
    </svg>
  );
}

export default HandHintIcon;
