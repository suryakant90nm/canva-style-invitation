import Link from "next/link";

/**
 * Brand mark: a lotus/mandala bloom inside a soft card shape, gold on maroon.
 * Pure SVG so it stays crisp at every size and recolours with the theme.
 */
export function LogoMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lg-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8E2838" />
          <stop offset="100%" stopColor="#5E1420" />
        </linearGradient>
        <linearGradient id="lg-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2D98B" />
          <stop offset="50%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#A4842E" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="13" fill="url(#lg-bg)" />
      <rect x="2.75" y="2.75" width="42.5" height="42.5" rx="12.3" fill="none" stroke="url(#lg-gold)" strokeWidth="1.2" opacity="0.9" />
      {/* lotus petals */}
      <g fill="url(#lg-gold)">
        <path d="M24 13c3.2 3.4 4.3 7.4 3.2 11.4-1 .9-2.1 1.5-3.2 1.8-1.1-.3-2.2-.9-3.2-1.8-1.1-4 0-8 3.2-11.4z" />
        <path d="M24 26.2c-.9-1.5-1.4-3.1-1.6-4.7-3.1-1.6-6.8-1.7-10.4-.3 1.8 3.5 4.7 5.7 8.1 6.4 1.5-.2 2.9-.7 3.9-1.4z" opacity=".92" />
        <path d="M24 26.2c.9-1.5 1.4-3.1 1.6-4.7 3.1-1.6 6.8-1.7 10.4-.3-1.8 3.5-4.7 5.7-8.1 6.4-1.5-.2-2.9-.7-3.9-1.4z" opacity=".92" />
        <path d="M24 27.6c-1.4.9-3 1.3-4.6 1.4-2 2.6-2.9 5.9-2.4 9.5 3.5-1 6.1-3.2 7-6.3.3-1.6.3-3.1 0-4.6z" opacity=".85" />
        <path d="M24 27.6c1.4.9 3 1.3 4.6 1.4 2 2.6 2.9 5.9 2.4 9.5-3.5-1-6.1-3.2-7-6.3-.3-1.6-.3-3.1 0-4.6z" opacity=".85" />
      </g>
      <circle cx="24" cy="26.4" r="1.7" fill="#FBF0D2" />
    </svg>
  );
}

export function Logo({ light = false, size = "md" }: { light?: boolean; size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? 44 : size === "sm" ? 30 : 36;
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-xl";
  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="ShubhInvite home">
      <LogoMark size={dim} className="transition-transform duration-500 group-hover:rotate-[15deg]" />
      <span className={`${text} font-extrabold tracking-tight ${light ? "text-white" : "text-ink"}`} style={{ fontFamily: "'Playfair Display', serif" }}>
        Shubh<span className="text-gold-600">Invite</span>
      </span>
    </Link>
  );
}
