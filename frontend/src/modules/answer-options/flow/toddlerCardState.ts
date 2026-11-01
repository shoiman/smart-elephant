/** Phases of one question on the toddler level (see the design spec, "Сценарий вопроса"). */
export type ToddlerPhase =
  | "ask" //       the host asks the question
  | "present" //   the host names the cards one by one
  | "turn" //      the child's turn: cards "breathe"
  | "press" //     a card is pressed, waiting for the backend
  | "almost" //    first wrong answer
  | "right" //     correct answer
  | "together" //  second wrong answer: "let's say it together"
  | "say" //       "now say the word" — the microphone appears
  | "listen" //    listening to the repeated word
  | "done"; //     praise, then the next question

/** CSS modifier of a card (class "is-<state>"); null — no modifier. */
export type CardState = "dim" | "spot" | "live" | "press" | "busy" | "wobble" | "right" | "gone";

export interface CardIndexes {
  /** Card being named in PRESENT */
  readonly spot: number;
  /** Card the child pressed */
  readonly press: number;
  /** Card of the last wrong answer */
  readonly wrong: number;
  /** The correct card */
  readonly correct: number;
}

/** One visual state per card per phase: "green and breathing = your turn", the rest stays still. */
export function toddlerCardState(phase: ToddlerPhase, index: number, cards: CardIndexes): CardState {
  switch (phase) {
    case "ask":
      return "dim";
    case "present":
      return index === cards.spot ? "spot" : "dim";
    case "turn":
      return "live";
    case "press":
      return index === cards.press ? "press" : "busy";
    case "almost":
      return index === cards.wrong ? "wobble" : "busy";
    case "right":
    case "together":
    case "say":
    case "listen":
    case "done":
      return index === cards.correct ? "right" : "gone";
  }
}

export type MicState = "hidden" | "rise" | "listening";

/** On the toddler level the microphone appears only for "now say the word". */
export function toddlerMicState(phase: ToddlerPhase): MicState {
  if (phase === "say") return "rise";
  if (phase === "listen") return "listening";
  return "hidden";
}
