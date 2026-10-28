import { useEffect, useRef } from "react";

/* ---------------------------------------------------------------------------
   Animated storefront background.

   - A constellation of soft glowing nodes.
   - Tiny, soft food emojis drifting and
     slowly spinning behind the content.
   - Interactive: clicks and taps burst food emojis from
     the touch point.

   It is a single fixed <canvas> behind the page (pointer-events: none), so
   it never blocks a button. It pauses when the tab is hidden, caps its own
   cost on phones, and shows a still frame for people who prefer reduced
   motion.
   --------------------------------------------------------------------------- */

const FOOD_EMOJIS = ["🍔", "🍟", "🍕", "🌮", "🌯", "🥪", "🥤", "🧋", "🍗"];
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (list) => list[Math.floor(Math.random() * list.length)];

export default function BgFx() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let nodes = [];
    let icons = [];
    let raf = 0;
    let running = false;
    const pointer = { x: -9999, y: -9999, active: false };
    const popupLayer = document.createElement("div");
    popupLayer.setAttribute("aria-hidden", "true");
    Object.assign(popupLayer.style, {
      position: "fixed",
      inset: "0",
      zIndex: "1001",
      overflow: "hidden",
      pointerEvents: "none",
    });
    document.body.appendChild(popupLayer);

    const isSmall = () => window.innerWidth < 700;

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, isSmall() ? 1.5 : 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const small = isSmall();
      const nodeCount = Math.min(small ? 34 : 72, Math.round((W * H) / (small ? 15000 : 17000)));
      const iconCount = small ? 9 : 16;

      nodes = Array.from({ length: nodeCount }, () => ({
        x: rand(0, W),
        y: rand(0, H),
        vx: rand(-0.22, 0.22),
        vy: rand(-0.22, 0.22),
        r: rand(1.1, 2.8),
        life: 1, // 1 = permanent, <1 = temporary node fading out
        temp: false,
      }));

      icons = Array.from({ length: iconCount }, (_, i) => ({
        emoji: FOOD_EMOJIS[i % FOOD_EMOJIS.length],
        x: rand(0, W),
        y: rand(0, H),
        vx: rand(-0.35, 0.35) || 0.2,
        vy: rand(-0.3, -0.08), // drift upwards, like steam
        rot: rand(0, Math.PI * 2),
        vr: rand(-0.008, 0.008),
        scale: rand(0.55, 1.05),
        alpha: rand(0.3, 0.55),
        phase: rand(0, 6.28),
      }));
    };

    const showClickFood = (x, y) => {
      if (!reduce) {
        const maxDistance = Math.hypot(W, H) || 1;
        icons.forEach((icon) => {
          const dx = icon.x - x;
          const dy = icon.y - y;
          const distance = Math.hypot(dx, dy);
          const angle = distance > 1 ? Math.atan2(dy, dx) : rand(0, Math.PI * 2);
          const strength = 3 + (1 - Math.min(distance / maxDistance, 1)) * 3;
          icon.vx += Math.cos(angle) * strength + rand(-1, 1);
          icon.vy += Math.sin(angle) * strength + rand(-1, 1);
          icon.vr += rand(-0.08, 0.08);
        });
      }

      const count = 2 + Math.floor(Math.random() * 3);
      const burst = Array.from({ length: count }, () => ({
        emoji: pick(FOOD_EMOJIS),
        size: rand(22, 34),
      }));

      burst.forEach(({ emoji, size }, index) => {
        const angle = (index / burst.length) * Math.PI * 2 + rand(-0.35, 0.35);
        const distance = rand(55, 115);
        const driftX = Math.cos(angle) * distance;
        const driftY = Math.sin(angle) * distance - rand(18, 48);
        const item = document.createElement("span");
        item.textContent = emoji;
        Object.assign(item.style, {
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          fontSize: `${size}px`,
          lineHeight: "1",
          pointerEvents: "none",
          userSelect: "none",
          filter: "drop-shadow(0 2px 5px rgba(30,20,10,0.3))",
          transform: "translate(-50%, -50%) scale(0.3)",
        });
        popupLayer.appendChild(item);

        if (reduce) {
          item.style.transform = `translate(calc(-50% + ${driftX * 0.35}px), calc(-50% + ${driftY * 0.35}px)) scale(1)`;
          window.setTimeout(() => item.remove(), 550);
          return;
        }

        const animation = item.animate(
          [
            { opacity: 0, transform: "translate(-50%, -50%) scale(0.3) rotate(0deg)" },
            { opacity: 1, transform: "translate(-50%, -50%) scale(1.25) rotate(10deg)", offset: 0.18 },
            { opacity: 1, transform: "translate(-50%, -50%) scale(1) rotate(-5deg)", offset: 0.34 },
            {
              opacity: 0,
              transform: `translate(calc(-50% + ${driftX}px), calc(-50% + ${driftY}px)) scale(0.7) rotate(${rand(-55, 55)}deg)`,
            },
          ],
          {
            duration: rand(750, 1050),
            easing: "cubic-bezier(0.2, 0.75, 0.3, 1)",
            fill: "forwards",
          }
        );
        animation.onfinish = () => item.remove();
      });
    };

    const frame = (time) => {
      ctx.clearRect(0, 0, W, H);
      const small = isSmall();
      const pointerDist = small ? 150 : 200;

      // soft glow following the pointer
      if (pointer.active) {
        const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 220);
        g.addColorStop(0, "rgba(255,240,200,0.35)");
        g.addColorStop(1, "rgba(255,240,200,0)");
        ctx.fillStyle = g;
        ctx.fillRect(pointer.x - 220, pointer.y - 220, 440, 440);
      }

      // --- update nodes ---
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        if (n.temp) {
          n.life -= 0.004;
          if (n.life <= 0) {
            nodes.splice(i, 1);
            continue;
          }
        }
        if (pointer.active) {
          const dx = pointer.x - n.x;
          const dy = pointer.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < pointerDist && d > 1) {
            n.vx += (dx / d) * 0.012;
            n.vy += (dy / d) * 0.012;
          }
        }
        // ease back towards a slow drift
        n.vx *= 0.985;
        n.vy *= 0.985;
        const sp = Math.hypot(n.vx, n.vy);
        if (sp < 0.08) {
          n.vx += rand(-0.01, 0.01);
          n.vy += rand(-0.01, 0.01);
        }
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = W + 20;
        else if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20;
        else if (n.y > H + 20) n.y = -20;
      }

      // --- nodes (dots with a little glow) ---
      for (const n of nodes) {
        const a = 0.35 + 0.5 * (n.r / 2.8);
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, a + 0.25) * n.life})`;
        ctx.shadowColor = "rgba(255,255,255,0.8)";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // --- floating fast-food icons ---
      for (const ic of icons) {
        ic.vx *= 0.99;
        ic.vy *= 0.99;
        if (Math.hypot(ic.vx, ic.vy) < 0.12) {
          ic.vx += rand(-0.01, 0.01);
          ic.vy -= 0.004;
        }
        ic.vr *= 0.99;
        if (Math.abs(ic.vr) < 0.004) ic.vr += ic.vr >= 0 ? 0.0004 : -0.0004;
        ic.x += ic.vx;
        ic.y += ic.vy + Math.sin(time / 1500 + ic.phase) * 0.12;
        ic.rot += ic.vr;
        const m = 40;
        if (ic.x < -m) ic.x = W + m;
        else if (ic.x > W + m) ic.x = -m;
        if (ic.y < -m) ic.y = H + m;
        else if (ic.y > H + m) ic.y = -m;

        ctx.save();
        ctx.translate(ic.x, ic.y);
        ctx.rotate(ic.rot);
        ctx.globalAlpha = ic.alpha;
        const fontSize = 28 * ic.scale;
        ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(ic.emoji, 0, 0);
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      if (running) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    build();
    if (reduce) frame(0); // one still frame
    else start();

    let resizeT = 0;
    const onResize = () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        build();
        if (reduce) frame(0);
      }, 150);
    };
    const onMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onDown = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      showClickFood(e.clientX, e.clientY);
      // on touch there is no hover, so let the pointer glow fade shortly after
      if (e.pointerType === "touch") setTimeout(onLeave, 900);
    };
    const onVis = () => (document.hidden ? stop() : start());

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      clearTimeout(resizeT);
      popupLayer.remove();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
