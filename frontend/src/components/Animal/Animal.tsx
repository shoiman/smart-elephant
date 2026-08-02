import "./Animal.css";

interface AnimalProps {
  image: string;
  alt?: string;
  onClick?: () => void;
}

export function Animal({
  image,
  alt = "Animal",
  onClick,
}: AnimalProps) {
  return (
    <div className="animal" onClick={onClick}>
      <img
        src={image}
        alt={alt}
        className="animal-image"
      />
    </div>
  );
}

export default Animal;
