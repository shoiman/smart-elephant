/**
 * The parents' zone stays open for a while after the gate, so a parent can move between pages
 * without holding the button again. Kept in sessionStorage: closing the tab locks it at once.
 * When storage is blocked (some private modes) the time is kept in memory for this page load.
 */
const STORAGE_KEY = "smartElephant.parentUnlockedUntil";
export const PARENT_UNLOCK_MS = 10 * 60 * 1000;

let memoryUntil = 0;

function storedUntil(): number {
  try {
    const value = Number(window.sessionStorage.getItem(STORAGE_KEY));
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

/** Milliseconds left until the zone locks again; 0 when it is locked */
export function parentUnlockRemainingMs(now = Date.now()): number {
  return Math.max(0, Math.max(storedUntil(), memoryUntil) - now);
}

export function unlockParentZone(now = Date.now()): void {
  memoryUntil = now + PARENT_UNLOCK_MS;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, String(memoryUntil));
  } catch {
    // Storage blocked: the time in memory is enough for this visit
  }
}
