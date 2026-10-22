// "Chef Pep" - an original cartoon pizza chef drawn as inline SVG (no image
// files, no external assets) and animated with the CSS in index.css.
// mood: "happy" | "excited" | "alarm" | "oops"
const MOODS = {
  happy: { brow: "M40 56 q6 -4 12 0 M68 56 q6 -4 12 0", mouth: "M50 82 q10 10 20 0", open: false, cheeks: 0.55 },
  excited: { brow: "M40 53 q6 -6 12 -1 M68 52 q6 -5 12 1", mouth: "M49 80 q11 16 22 0 z", open: true, cheeks: 0.8 },
  alarm: { brow: "M39 52 q7 -7 13 1 M67 53 q6 -8 13 -1", mouth: "M52 86 q8 -9 16 0 q-8 6 -16 0 z", open: true, cheeks: 0.35 },
  oops: { brow: "M40 54 q6 3 12 -2 M68 52 q6 5 12 2", mouth: "M50 86 q5 -4 10 0 t10 0", open: false, cheeks: 0.7 },
};

const ChefMascot = ({ mood = "happy", size = 96, className = "", animate = true }) => {
  const m = MOODS[mood] || MOODS.happy;
  const wide = mood === "alarm";
  const eyeRy = wide ? 8 : 6.5;
  return (
    <svg
      viewBox="0 0 150 130"
      width={size}
      height={(size * 130) / 150}
      role="img"
      aria-label="GenZ Pizza chef mascot"
      className={`${animate ? (mood === "alarm" || mood === "excited" ? "chef-bob-fast" : "chef-bob") : ""} ${className}`}
    >
      {/* soft shadow */}
      <ellipse cx="62" cy="126" rx="34" ry="4" fill="#000" opacity="0.18" />

      {/* chef coat */}
      <path d="M26 128 q0 -26 20 -31 h32 q20 5 20 31 z" fill="#ef4444" />
      <path d="M46 97 l14 14 l14 -14" fill="#fff" stroke="#e5e7eb" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="60" cy="117" r="2.2" fill="#fff" />
      <circle cx="60" cy="124" r="2.2" fill="#fff" />

      {/* pizza peel + pizza (right hand) */}
      <g className={animate && (mood === "excited" || mood === "oops") ? "chef-wiggle" : ""}>
        <rect x="100" y="62" width="7" height="62" rx="3.5" fill="#b8793a" transform="rotate(14 103 93)" />
        <g transform="rotate(14 120 48)">
          <circle cx="120" cy="40" r="25" fill="#c98d4a" />
          <circle cx="120" cy="40" r="21.5" fill="#f6b100" />
          <circle cx="120" cy="40" r="18" fill="#ef6a3a" opacity="0.9" />
          <circle cx="120" cy="40" r="16" fill="#ffd34d" />
          <circle cx="113" cy="34" r="4.2" fill="#c8312b" />
          <circle cx="127" cy="36" r="4.2" fill="#c8312b" />
          <circle cx="120" cy="48" r="4.2" fill="#c8312b" />
          <circle cx="112" cy="46" r="2" fill="#2f9e44" />
          <circle cx="128" cy="47" r="2" fill="#2f9e44" />
        </g>
        {/* hand */}
        <circle cx="98" cy="96" r="7" fill="#ffd9b0" />
      </g>

      {/* head */}
      <circle cx="60" cy="72" r="32" fill="#ffd9b0" />
      <circle cx="60" cy="72" r="32" fill="none" stroke="#f0b98a" strokeWidth="1.5" />
      {/* ears */}
      <circle cx="28.5" cy="74" r="5" fill="#ffd9b0" stroke="#f0b98a" strokeWidth="1.2" />
      <circle cx="91.5" cy="74" r="5" fill="#ffd9b0" stroke="#f0b98a" strokeWidth="1.2" />

      {/* chef hat */}
      <g>
        <circle cx="40" cy="34" r="14" fill="#fff" />
        <circle cx="60" cy="26" r="17" fill="#fff" />
        <circle cx="80" cy="34" r="14" fill="#fff" />
        <path d="M32 38 q28 -8 56 0" fill="none" stroke="#eef0f3" strokeWidth="2" />
        <rect x="34" y="40" width="52" height="15" rx="5" fill="#fff" />
        <rect x="34" y="49" width="52" height="6" rx="3" fill="#e9ecf1" />
        <path d="M52 22 q3 -5 8 -1 M70 28 q4 -3 7 1" fill="none" stroke="#e5e7eb" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="60" cy="40" r="3.6" fill="#ef4444" />
      </g>

      {/* eyes */}
      <g className={animate ? "chef-blink" : ""}>
        <ellipse cx="46" cy="70" rx="6" ry={eyeRy} fill="#2b2118" />
        <ellipse cx="74" cy="70" rx="6" ry={eyeRy} fill="#2b2118" />
        <circle cx="48" cy="67" r="2.3" fill="#fff" />
        <circle cx="76" cy="67" r="2.3" fill="#fff" />
        <circle cx="44.5" cy="73" r="1.1" fill="#fff" opacity="0.8" />
        <circle cx="72.5" cy="73" r="1.1" fill="#fff" opacity="0.8" />
      </g>
      <path d={m.brow} fill="none" stroke="#6b4a2b" strokeWidth="2.6" strokeLinecap="round" />

      {/* cheeks + nose */}
      <ellipse cx="38" cy="82" rx="6" ry="4" fill="#ff7a8a" opacity={m.cheeks} />
      <ellipse cx="82" cy="82" rx="6" ry="4" fill="#ff7a8a" opacity={m.cheeks} />
      <ellipse cx="60" cy="77" rx="2.6" ry="2" fill="#f0a27a" />

      {/* mouth */}
      {m.open ? (
        <path d={m.mouth} fill="#7a1f1f" stroke="#7a1f1f" strokeWidth="2" strokeLinejoin="round" />
      ) : (
        <path d={m.mouth} fill="none" stroke="#7a1f1f" strokeWidth="2.6" strokeLinecap="round" />
      )}
      {mood === "excited" && <path d="M54 88 q6 5 12 0" fill="#ff8fa0" opacity="0.9" />}

      {/* extras */}
      {(mood === "alarm" || mood === "oops") && (
        <path className={animate ? "chef-sweat" : ""} d="M94 52 q5 8 0 11 q-5 -3 0 -11 z" fill="#7dd3fc" stroke="#38bdf8" strokeWidth="1" />
      )}
      {mood === "excited" && (
        <g fill="#fbbf24">
          <path d="M16 54 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
          <path d="M96 22 l1.5 3.5 3.5 1.5 -3.5 1.5 -1.5 3.5 -1.5 -3.5 -3.5 -1.5 3.5 -1.5z" />
        </g>
      )}
    </svg>
  );
};

export default ChefMascot;
