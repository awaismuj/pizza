// Soft chimes for prep alerts, generated with the Web Audio API (no audio
// files). Browsers refuse to play sound until the person has interacted with
// the page, so the context is created/resumed on the first click or key press;
// until then playChime() quietly does nothing and the popup is enough.
let ctx = null;

const getCtx = () => {
  if (ctx) return ctx;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  return ctx;
};

export const unlockAudio = () => {
  try {
    const c = getCtx();
    if (c && c.state === "suspended") c.resume();
  } catch {
    /* ignore */
  }
};

if (typeof window !== "undefined") {
  const once = () => {
    unlockAudio();
    window.removeEventListener("pointerdown", once);
    window.removeEventListener("keydown", once);
  };
  window.addEventListener("pointerdown", once);
  window.addEventListener("keydown", once);
}

// Each level has its own short, gentle motif (never harsh or repeating).
const MOTIFS = {
  warn1: [[660, 0], [880, 0.16]],
  warn2: [[740, 0], [880, 0.14], [988, 0.28]],
  warn3: [[880, 0], [988, 0.13], [1175, 0.26]],
  overdue: [[523, 0], [392, 0.2]],
};

export const playChime = (level = "warn1") => {
  try {
    const c = getCtx();
    if (!c || c.state !== "running") return false;
    (MOTIFS[level] || MOTIFS.warn1).forEach(([freq, at]) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = c.currentTime + at;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.18, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(t);
      osc.stop(t + 0.35);
    });
    return true;
  } catch {
    return false;
  }
};
