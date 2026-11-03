import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Link } from "react-router-dom";

import { LockIcon } from "../../shared/icons/Icons";
import { useI18n } from "../../shared/i18n";
import { usePageHeader } from "../../shared/layout/PageHeaderContext";
import "./ParentGate.css";

/** How long the button has to be held. A toddler taps; an adult can hold without reading a riddle. */
export const HOLD_MS = 3000;

interface ParentGateProps {
  /** Called once the button has been held long enough */
  readonly onUnlock: () => void;
}

/**
 * "For parents": press and hold the round button for 3 seconds. The ring fills while it is held and
 * slides back to empty when it is released early (both are CSS transitions of stroke-dashoffset).
 * Works with mouse, touch and keyboard (hold Space or Enter).
 */
export function ParentGate({ onUnlock }: ParentGateProps) {
  const { t } = useI18n();
  usePageHeader({ title: t("parentGate.title") });

  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef<number | null>(null);

  function clearTimer() {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function startHold() {
    if (timerRef.current !== null) return;
    setIsHolding(true);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      onUnlock();
    }, HOLD_MS);
  }

  function stopHold() {
    clearTimer();
    setIsHolding(false);
  }

  // No timer survives the gate (the ref object is captured, its current value is read on cleanup)
  useEffect(() => {
    const timer = timerRef;
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) return;
    // Keep receiving pointerup even if the finger slides off the button
    event.currentTarget.setPointerCapture(event.pointerId);
    startHold();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault(); // no page scroll on Space, no click on Enter
    if (!event.repeat) startHold();
  }

  function handleKeyUp(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === " " || event.key === "Enter") stopHold();
  }

  return (
    <section className="parent-gate">
      <div className="parent-gate__card">
        <LockIcon className="parent-gate__lock" />
        <h1 className="parent-gate__title">{t("parentGate.title")}</h1>
        <p className="parent-gate__hint" id="parent-gate-hint">
          {t("parentGate.hint")}
        </p>

        <button
          aria-describedby="parent-gate-hint"
          aria-label={t("parentGate.hold")}
          className={`parent-gate__hold ${isHolding ? "parent-gate__hold--holding" : ""}`}
          onBlur={stopHold}
          onContextMenu={(event) => event.preventDefault()} // a long touch must not open the context menu
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onPointerCancel={stopHold}
          onPointerDown={handlePointerDown}
          onPointerUp={stopHold}
          type="button"
        >
          <svg aria-hidden="true" className="parent-gate__ring" viewBox="0 0 96 96">
            <circle className="parent-gate__ring-track" cx="48" cy="48" r="44" />
            <circle className="parent-gate__ring-fill" cx="48" cy="48" pathLength={100} r="44" />
          </svg>
          <svg aria-hidden="true" className="parent-gate__hand" viewBox="0 0 24 24">
            <path d="M9 11V5a2 2 0 0 1 4 0v5h3a3 3 0 0 1 3 3v2a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-3l-2-3a1.5 1.5 0 0 1 2.5-1.7L9 15" />
          </svg>
        </button>

        <Link className="btn btn--secondary btn--lg parent-gate__back" to="/stars">
          {t("parentGate.back")}
        </Link>
      </div>
    </section>
  );
}

export default ParentGate;
