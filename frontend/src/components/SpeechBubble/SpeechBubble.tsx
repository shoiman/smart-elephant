import "./SpeechBubble.css";

type SpeechBubbleProps = {
  text: string;
};

export function SpeechBubble({ text }: SpeechBubbleProps) {
  return (
    <div className="speech-bubble" dir="auto">
      <svg aria-hidden="true" className="speech-bubble__shape" viewBox="0 0 360 178" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M61 127C23 126 8 105 19 78 29 54 55 48 82 52 100 24 139 19 165 41 193 15 235 20 254 49 291 43 321 60 326 89 331 118 304 137 274 134 252 159 214 161 188 143 164 163 123 158 108 137 92 143 75 140 61 127Z"
          fill="#fffdfd"
          filter="url(#bubbleShadow)"
          stroke="#b89aff"
          strokeDasharray="7 6"
          strokeWidth="2"
        />
        <path d="M94 130 75 164l43-26" fill="#fffdfd" stroke="#b89aff" strokeDasharray="7 6" strokeLinejoin="round" strokeWidth="2" />
        <defs>
          <filter id="bubbleShadow" height="150%" width="150%" x="-25%" y="-20%">
            <feDropShadow dx="0" dy="8" floodColor="#6f68a0" floodOpacity="0.23" stdDeviation="7" />
          </filter>
        </defs>
      </svg>
      <div className="speech-bubble__content">
        <svg aria-hidden="true" className="speech-bubble__speaker" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 12h6l8-6v20l-8-6H4z" fill="currentColor" />
          <path d="M22 11c2 2 2 8 0 10M26 7c5 5 5 13 0 18" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
        </svg>
        <span>{text}</span>
      </div>
    </div>
  );
}

export default SpeechBubble;
