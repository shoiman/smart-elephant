import meadowDesktop from "../../assets/backgrounds/meadow-desktop.png";
import meadowMobile from "../../assets/backgrounds/meadow-mobile.png";
import "./Background.css";

export type BackgroundEnvironment = "meadow";

interface BackgroundProps {
  readonly environment?: BackgroundEnvironment;
}

interface BackgroundArtwork {
  readonly desktop: string;
  readonly mobile: string;
}

const environmentArtwork: Readonly<Record<BackgroundEnvironment, BackgroundArtwork>> = {
  meadow: {
    desktop: meadowDesktop,
    mobile: meadowMobile,
  },
};

/** Decorative artwork layer, kept independent from game content and state. */
export function Background({ environment = "meadow" }: BackgroundProps) {
  const artwork = environmentArtwork[environment];

  return (
    <div aria-hidden="true" className="game-background">
      <picture>
        <source media="(max-width: 640px)" srcSet={artwork.mobile} />
        <img alt="" className="game-background__art" src={artwork.desktop} />
      </picture>
    </div>
  );
}

export default Background;
