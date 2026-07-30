import "./Animal.css";

interface AnimalProps {
  image: string;
  alt?: string;
}

export function Animal({
  image,
  alt = "Animal",
}: AnimalProps) {
  return (
    <div className="animal">
      <img
        src={image}
        alt={alt}
        className="animal-image"
      />
    </div>
  );
}

export default Animal;
