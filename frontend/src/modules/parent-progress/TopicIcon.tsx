import type { QuestionTopic } from "../../services/api-types";

/** Line icons of the question topics, in the header icons' style (no emoji in the UI). */
const PATHS: Readonly<Record<QuestionTopic, readonly string[]>> = {
  NAME: ["M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  HABITAT: ["M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"],
  COLOR: [
    "M12 3a9 9 0 1 0 0 18c1.1 0 1.5-.8 1.5-1.5 0-.9-.7-1.3-.7-2.2 0-.8.7-1.3 1.5-1.3H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8z",
    "M7.5 11h.01M10 7.5h.01M14.5 7.5h.01",
  ],
  SOUND: ["M9 18V5l11-2v13", "M6 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM17 13a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  DIET: ["M13.5 8.5 4.6 18a1.4 1.4 0 0 0 1.9 1.9L16 11", "M13.5 8.5c1.6-1.6 3.4-1.6 4.4-.6s1 2.8-.6 4.4", "M17 7l3-3M16 5l.5-2.5M19 8l2.5-.5"],
  SIZE: ["M4.5 8h15a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 14.5v-5A1.5 1.5 0 0 1 4.5 8z", "M7 8v3M11 8v4M15 8v3M19 8v2"],
  UNIQUE: ["M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z", "M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z"],
};

export function TopicIcon({ topic, className = "" }: { readonly topic: QuestionTopic; readonly className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      {PATHS[topic].map((path) => (
        <path d={path} key={path} />
      ))}
    </svg>
  );
}
