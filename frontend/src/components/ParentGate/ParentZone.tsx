import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { ParentGate } from "./ParentGate";
import { parentUnlockRemainingMs, unlockParentZone } from "./parentUnlock";

/**
 * Wraps every /parent/* route: shows the gate until it is passed, then the page.
 * The zone locks again by itself when the 10 minutes are over, even with the page open.
 */
export function ParentZone() {
  const [isUnlocked, setIsUnlocked] = useState(() => parentUnlockRemainingMs() > 0);

  useEffect(() => {
    if (!isUnlocked) return undefined;
    const timer = window.setTimeout(() => setIsUnlocked(false), parentUnlockRemainingMs());
    return () => window.clearTimeout(timer);
  }, [isUnlocked]);

  function unlock() {
    unlockParentZone();
    setIsUnlocked(true);
  }

  return isUnlocked ? <Outlet /> : <ParentGate onUnlock={unlock} />;
}

export default ParentZone;
