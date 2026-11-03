import { useEffect, useRef } from "react";

import Host from "../../../components/Host/Host";
import { CheckIcon, MicIcon, SpeakerIcon } from "../../../shared/icons/Icons";
import { useI18n } from "../../../shared/i18n";
import { CardArt } from "../AnswerOptions";
import { choiceLabel } from "../optionLabels";
import type { Choice } from "../types";
import { burstSparkles, startHandHint } from "./effects";
import { HandHintIcon } from "./HandHintIcon";
import { toddlerCardState, toddlerMicState } from "./toddlerCardState";
import { useToddlerFlow, type ToddlerFlowSpeech } from "./useToddlerFlow";
import "./ToddlerQuestion.css";

interface ToddlerQuestionProps {
  readonly questionKey: string;
  readonly questionText: string;
  readonly questionAudioUrl?: string | null;
  readonly animalImage?: string;
  readonly animalAlt: string;
  readonly choices: readonly Choice[];
  readonly speech: ToddlerFlowSpeech;
  readonly checkAnswer: (caption: string, attempt: number) => Promise<boolean>;
  readonly checkRepeat: (spoken: string) => Promise<boolean>;
  readonly onDone: (result: { readonly earned: boolean }) => void;
}

/**
 * Question screen of the toddler level: the host asks, names the two cards, the child taps one,
 * then repeats the word into the microphone. All animation lives in CSS; this only sets classes.
 */
export function ToddlerQuestion(props: ToddlerQuestionProps) {
  const { t, language } = useI18n();
  const flow = useToddlerFlow({ ...props, language });

  const screenRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const handRef = useRef<SVGSVGElement>(null);
  const micRef = useRef<HTMLButtonElement>(null);

  const { phase, cards } = flow;
  const micState = toddlerMicState(phase);
  const hostPose = phase === "right" || phase === "done" ? "happy" : "greeting";

  // Sparkles fly out of the correct card on "Right!"
  useEffect(() => {
    const screen = screenRef.current;
    const card = cardRefs.current[cards.correct];
    if (phase === "right" && screen && card) burstSparkles(screen, card);
  }, [phase, cards.correct]);

  // The hand "presses" both cards in turn (TURN) or the microphone (SAY) until the child touches the screen
  useEffect(() => {
    const screen = screenRef.current;
    const hand = handRef.current;
    if (!flow.isHandVisible || !screen || !hand) return undefined;
    const targets =
      phase === "say"
        ? [micRef.current].filter((mic): mic is HTMLButtonElement => mic !== null)
        : cardRefs.current.filter((card): card is HTMLButtonElement => card !== null);
    return startHandHint(screen, hand, targets);
  }, [flow.isHandVisible, phase]);

  const bubbleClass = [
    "qbubble",
    flow.bubble.tone !== "plain" ? `is-${flow.bubble.tone}` : "",
    flow.isTalking ? "is-talking" : "",
  ].join(" ");

  return (
    <div className="qflow" onPointerDown={flow.touch} ref={screenRef}>
      <div className="qflow__stage">
        {props.animalImage ? (
          <img
            alt={props.animalAlt}
            className={`qflow__animal${phase === "done" ? " is-joy" : ""}`}
            draggable={false}
            src={props.animalImage}
          />
        ) : null}
      </div>

      <div className="qflow__host-row">
        <button
          aria-label={t("game.listen")}
          className={`qhost${flow.isTalking ? " is-talk" : ""}`}
          onClick={() => void flow.replay()}
          type="button"
        >
          <Host className="qhost__avatar" pose={hostPose} variant="avatar" />
          <span aria-hidden="true" className="qhost__speaker">
            <SpeakerIcon className="qhost__speaker-icon" />
          </span>
        </button>
        <div aria-live="polite" className={bubbleClass} dir="auto">
          <div className="qbubble__body">
            {flow.bubble.title && <span className="qbubble__title">{flow.bubble.title}</span>}
            <span className="qbubble__text">{flow.bubble.text}</span>
          </div>
          <span aria-hidden="true" className="qbubble__wave">
            <span />
            <span />
            <span />
          </span>
        </div>
      </div>

      <div className="qcards" role="group">
        {props.choices.map((choice, index) => {
          const state = toddlerCardState(phase, index, cards);
          const label = choiceLabel(choice, language);
          return (
            <button
              aria-label={label}
              className={`qcard qcard--${choice.topic} is-${state}`}
              key={choice.id}
              onClick={() => void flow.pick(index)}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              type="button"
            >
              <CardArt choice={choice} />
              <span className={`qcard__label${label.length > 8 ? " qcard__label--long" : ""}`}>{label}</span>
              <span aria-hidden="true" className="qcard__check">
                <CheckIcon className="qcard__check-icon" />
              </span>
            </button>
          );
        })}
      </div>

      <div className={`qflow__action${micState === "listening" ? " is-listening" : ""}`}>
        {micState !== "hidden" && (
          <>
            <span aria-hidden="true" className="qflow__bars">
              <span /><span /><span /><span />
            </span>
            <button
              aria-label={micState === "listening" ? t("game.listening") : t("game.micStart")}
              className={`qmic is-${micState}`}
              onClick={flow.micTap}
              ref={micRef}
              type="button"
            >
              <span aria-hidden="true" className="qmic__ripple" />
              <span aria-hidden="true" className="qmic__ripple qmic__ripple--late" />
              <MicIcon className="qmic__icon" />
            </button>
            <span aria-hidden="true" className="qflow__bars">
              <span /><span /><span /><span />
            </span>
          </>
        )}
      </div>

      <HandHintIcon ref={handRef} />
    </div>
  );
}

export default ToddlerQuestion;
