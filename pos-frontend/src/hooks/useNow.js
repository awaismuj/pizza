import { useSyncExternalStore } from "react";

// ONE shared 1-second ticker for the whole app (every countdown badge reads
// from it), instead of a setInterval per badge. It only runs while at least
// one component is subscribed, and it never makes a network request.
const listeners = new Set();
let timer = null;
let current = Date.now();

const tick = () => {
  current = Date.now();
  listeners.forEach((l) => l());
};

const subscribe = (listener) => {
  listeners.add(listener);
  if (!timer) {
    current = Date.now();
    timer = setInterval(tick, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
};

const useNow = () => useSyncExternalStore(subscribe, () => current, () => current);

export default useNow;
