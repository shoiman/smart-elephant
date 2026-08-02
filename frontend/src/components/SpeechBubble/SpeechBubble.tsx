import "./SpeechBubble.css"

type SpeechBubbleProps = {
  text: string;
};

export function SpeechBubble({ text }: SpeechBubbleProps) {
  return (
    <div className="speech-bubble">
      {text}
    </div>
  );
}

export default SpeechBubble;