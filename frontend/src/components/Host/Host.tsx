import greetingImage from "../../assets/characters/elephant-greeting.png";
import happyImage from "../../assets/characters/elephant-happy.png";
import "./Host.css";

export type HostPose = "greeting" | "happy";

const poseImages: Readonly<Record<HostPose, string>> = {
  greeting: greetingImage,
  happy: happyImage,
};

interface HostProps {
  /** "full" shows the whole character, "avatar" a round head crop. */
  readonly variant?: "full" | "avatar";
  /** greeting — waving (welcome, questions); happy — cheering (correct answers, rewards). */
  readonly pose?: HostPose;
  readonly alt?: string;
  readonly className?: string;
}

/** The game's host character — the little elephant. */
export function Host({ variant = "full", pose = "greeting", alt = "", className = "" }: HostProps) {
  return (
    <div className={`host host--${variant} host--${pose} ${className}`}>
      <img alt={alt} className="host__image" draggable={false} src={poseImages[pose]} />
    </div>
  );
}

export default Host;
