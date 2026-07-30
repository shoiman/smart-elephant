interface BackgroundProps {
  title?: string;
  description?: string;
}

export function Background({
  title = "Savanna",
  description = "A bright and friendly scene for playful lessons.",
}: BackgroundProps) {
  return (
    <section
      aria-label="game background"
      style={{
        padding: "1.25rem",
        borderRadius: "1rem",
        background: "linear-gradient(135deg, #fef3c7 0%, #bbf7d0 100%)",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
        textAlign: "center",
      }}
    >
      <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.2rem" }}>{title}</h2>
      <p style={{ margin: 0, color: "#4b5563" }}>{description}</p>
    </section>
  );
}

export default Background;
