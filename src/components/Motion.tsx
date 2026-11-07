"use client";

import { useEffect } from "react";

/**
 * Activates every `.reveal*` element when it scrolls into view.
 * Drop <RevealObserver/> once per page. Elements keep their CSS-only
 * animation, so there is zero layout cost and it degrades gracefully.
 */
export function RevealObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal, .reveal-left, .reveal-scale, .reveal-stagger"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  return null;
}

/** Slowly falling golden petals — purely decorative, pointer-events none. */
export function Petals({ count = 14, className = "" }: { count?: number; className?: string }) {
  const items = Array.from({ length: count }, (_, i) => {
    // deterministic pseudo-random so SSR === CSR
    const r = (n: number) => ((i * 9301 + 49297 * n) % 233280) / 233280;
    return {
      left: `${Math.round(r(1) * 100)}%`,
      delay: `${(r(2) * 12).toFixed(2)}s`,
      dur: `${(9 + r(3) * 9).toFixed(2)}s`,
      scale: (0.6 + r(4) * 0.9).toFixed(2),
      op: (0.35 + r(5) * 0.5).toFixed(2),
    };
  });
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {items.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{ left: p.left, animationDelay: p.delay, animationDuration: p.dur, transform: `scale(${p.scale})`, opacity: p.op }}
        />
      ))}
    </div>
  );
}

/** Animated counter that counts up when it becomes visible. */
export function CountUp({ to, suffix = "", className = "" }: { to: number; suffix?: string; className?: string }) {
  useEffect(() => {
    const el = document.querySelectorAll<HTMLElement>(`[data-countup="${to}${suffix}"]`);
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        const node = en.target as HTMLElement;
        io.unobserve(node);
        const start = performance.now();
        const dur = 1400;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          const e = 1 - Math.pow(1 - p, 3);
          node.textContent = `${Math.round(to * e)}${suffix}`;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    });
    el.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [to, suffix]);
  return (
    <span data-countup={`${to}${suffix}`} className={className}>
      0{suffix}
    </span>
  );
}
