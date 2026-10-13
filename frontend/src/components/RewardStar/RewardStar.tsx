import { StarIcon } from "../../shared/icons/Icons";
import "./RewardStar.css";

interface RewardStarProps {
  readonly size?: "md" | "lg";
  readonly className?: string;
}

/** Decorative golden reward star with a few small sparkles around it. */
export default function RewardStar({ size = "lg", className = "" }: RewardStarProps) {
  return (
    <div aria-hidden="true" className={`reward-star reward-star--${size} ${className}`}>
      <span className="reward-star__glow" />
      <StarIcon className="reward-star__main" />
      <StarIcon className="reward-star__spark reward-star__spark--1" />
      <StarIcon className="reward-star__spark reward-star__spark--2" />
      <StarIcon className="reward-star__spark reward-star__spark--3" />
      <StarIcon className="reward-star__spark reward-star__spark--4" />
      <span className="reward-star__dot reward-star__dot--1" />
      <span className="reward-star__dot reward-star__dot--2" />
      <span className="reward-star__dot reward-star__dot--3" />
    </div>
  );
}
