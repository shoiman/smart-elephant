export type AnimalSpritePosition =
  | "0% 0%"
  | "50% 0%"
  | "100% 0%"
  | "0% 100%"
  | "50% 100%"
  | "100% 100%";

interface AnimalCardProps {
  readonly habitat: string;
  readonly image: string;
  readonly name: string;
  readonly spritePosition: AnimalSpritePosition;
}

export default function AnimalCard({
  habitat,
  image,
  name,
  spritePosition,
}: AnimalCardProps) {
  return (
    <article className="animal-card">
      <div
        aria-label={name}
        className="animal-card__image"
        role="img"
        style={{
          backgroundImage: `url(${image})`,
          backgroundPosition: spritePosition,
          backgroundSize: "300% 200%",
        }}
      />
      <div className="animal-card__content">
        <h3>{name}</h3>
        <p>{habitat}</p>
      </div>
    </article>
  );
}
