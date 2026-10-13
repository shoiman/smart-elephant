import "./ProgressDots.css";

interface ProgressDotsProps {
  readonly current: number;
  readonly total: number;
  readonly label: string;
}

/** Segmented progress indicator: completed and current steps are filled. */
export function ProgressDots({ current, total, label }: ProgressDotsProps) {
  return (
    <div aria-label={label} aria-valuemax={total} aria-valuemin={1} aria-valuenow={current} className="progress-dots" role="progressbar">
      {Array.from({ length: total }, (_, index) => (
        <span className={`progress-dots__step${index < current ? " progress-dots__step--done" : ""}`} key={index} />
      ))}
    </div>
  );
}

export default ProgressDots;
