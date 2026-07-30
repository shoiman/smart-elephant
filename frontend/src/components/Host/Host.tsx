import "./Host.css";

interface HostProps {
  image: string;
  alt?: string;
}

export function Host({ image, alt = "Host" }: HostProps) {
  return (
    <div className="host">
      <img src={image} alt={alt} className="host-image" />
    </div>
  );
}

export default Host;