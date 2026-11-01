/** Visual effects of the answer cards that CSS alone cannot do (positions depend on the layout). */

const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

/** Center of an element relative to the container (works the same in RTL and on any screen size). */
function centerIn(container: HTMLElement, element: HTMLElement) {
  const box = container.getBoundingClientRect();
  const rect = element.getBoundingClientRect();
  return { x: rect.left - box.left + rect.width / 2, y: rect.top - box.top + rect.height / 2 };
}

const SPARK_COLORS = ["var(--color-gold)", "var(--color-green)", "var(--color-rose)", "#9cc3b1"];

/** "Right!": 12 dots fly 80–120 px out of the card's center in 800 ms and fade. */
export function burstSparkles(container: HTMLElement, target: HTMLElement) {
  if (prefersReducedMotion()) return;
  const origin = centerIn(container, target);
  for (let i = 0; i < 12; i++) {
    const spark = document.createElement("span");
    spark.className = "qspark";
    spark.style.left = `${origin.x - 6}px`;
    spark.style.top = `${origin.y - 6}px`;
    spark.style.background = SPARK_COLORS[i % SPARK_COLORS.length];
    container.appendChild(spark);
    const angle = (Math.PI * 2 * i) / 12;
    const distance = 80 + Math.random() * 40;
    const animation = spark.animate(
      [
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0.3)`, opacity: 0 },
      ],
      { duration: 800, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
    animation.onfinish = () => spark.remove();
  }
}

/** Pointer hotspot inside the 72 px hand icon (the fingertip). */
const HAND_TIP_X = 24;
const HAND_TIP_Y = 6;
/** One cycle per target: fly in, press (scale 0.82), release. */
const HAND_CYCLE_MS = 1700;

/**
 * Hand hint: "presses" the targets one by one, forever, until stopped.
 * Returns a stop function. Reduced motion: the hand just stands at the first target.
 */
export function startHandHint(container: HTMLElement, hand: HTMLElement | SVGElement, targets: readonly HTMLElement[]) {
  const points = targets.map((target) => {
    const center = centerIn(container, target);
    return { x: center.x - HAND_TIP_X, y: center.y - HAND_TIP_Y };
  });
  if (points.length === 0) return () => undefined;

  hand.style.display = "block";
  if (prefersReducedMotion() || !hand.animate) {
    hand.style.transform = `translate(${points[0].x}px, ${points[0].y}px)`;
    return () => {
      hand.style.display = "none";
    };
  }

  const keyframes: Keyframe[] = [];
  const step = 1 / points.length;
  points.forEach((point, k) => {
    const base = k * step;
    const at = (scale: number) => `translate(${point.x}px, ${point.y}px) scale(${scale})`;
    keyframes.push({ offset: base, transform: `translate(${point.x}px, ${point.y + 26}px) scale(1)`, opacity: k === 0 ? 0 : 1 });
    keyframes.push({ offset: base + step * 0.3, transform: at(1), opacity: 1 });
    keyframes.push({ offset: base + step * 0.5, transform: at(0.82), opacity: 1 });
    keyframes.push({ offset: base + step * 0.7, transform: at(1), opacity: 1 });
  });
  const last = points[points.length - 1];
  keyframes.push({ offset: 1, transform: `translate(${last.x}px, ${last.y + 26}px) scale(1)`, opacity: 0 });

  const animation = hand.animate(keyframes, { duration: HAND_CYCLE_MS * points.length, iterations: Infinity, easing: "ease-in-out" });
  return () => {
    animation.cancel();
    hand.style.display = "none";
  };
}
