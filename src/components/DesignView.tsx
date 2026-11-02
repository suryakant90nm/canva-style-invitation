import type { CSSProperties, ReactNode } from "react";
import { pagesOf, type Doc, type El, type ImageEl, type Page, type ShapeEl, type TextEl } from "@/lib/design";

export type UFn = (n: number) => string;

export function makeU(mode: "px" | "fit", W: number): UFn {
  return mode === "px" ? (n) => `${n}px` : (n) => `${((n / W) * 100).toFixed(4)}cqw`;
}

export function textStyle(el: TextEl, u: UFn): CSSProperties {
  return {
    fontFamily: `'${el.fontFamily}', serif`,
    fontSize: u(el.fontSize),
    fontWeight: el.fontWeight,
    fontStyle: el.italic ? "italic" : "normal",
    textDecoration: el.underline ? "underline" : "none",
    textAlign: el.align,
    color: el.color,
    letterSpacing: u(el.letterSpacing),
    lineHeight: el.lineHeight,
    textTransform: el.uppercase ? "uppercase" : "none",
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
    margin: 0,
    width: "100%",
  };
}

export function wrapperStyle(el: El, doc: { width: number; height: number }): CSSProperties {
  return {
    position: "absolute",
    left: `${(el.x / doc.width) * 100}%`,
    top: `${(el.y / doc.height) * 100}%`,
    width: `${(el.w / doc.width) * 100}%`,
    height: el.type === "text" ? "auto" : `${(el.h / doc.height) * 100}%`,
    transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
    transformOrigin: "center center",
    opacity: el.opacity,
  };
}

type Grad = { colors: string[]; x1: number; y1: number; x2: number; y2: number };

/** Parse a CSS linear/radial gradient into SVG gradient stops (best effort). */
function parseGradient(fill: string): Grad | null {
  if (!fill.includes("-gradient(")) return null;
  const colors = Array.from(fill.matchAll(/#[0-9a-f]{3,8}|rgba?\([^)]*\)/gi)).map((m) => m[0]);
  if (colors.length < 2) return null;
  const am = fill.match(/(-?\d+(?:\.\d+)?)deg/);
  const angle = am ? parseFloat(am[1]) : 180;
  const rad = ((angle - 90) * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    colors,
    x1: Math.round(50 - cos * 50),
    y1: Math.round(50 - sin * 50),
    x2: Math.round(50 + cos * 50),
    y2: Math.round(50 + sin * 50),
  };
}

function ShapeBody({ el, u }: { el: ShapeEl; u: UFn }) {
  const { w, h, fill, stroke, strokeWidth: sw } = el;
  const grad = parseGradient(fill);
  const fillRef = grad ? `url(#g-${el.id})` : fill;

  if (el.shape === "line") {
    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: u(Math.max(1, sw)),
          marginTop: u(-Math.max(1, sw) / 2),
          background: stroke,
        }}
      />
    );
  }
  if (el.shape === "rect") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          background: fill,
          border: sw > 0 ? `${u(sw)} solid ${stroke}` : "none",
          borderRadius: u(el.radius),
        }}
      />
    );
  }
  const i = sw / 2;
  const X = (n: number) => (n * w) / 100;
  const Y = (n: number) => (n * h) / 100;
  let node: ReactNode = null;
  const common = {
    fill: fillRef,
    stroke: sw > 0 ? stroke : "none",
    strokeWidth: sw,
    strokeLinejoin: "round" as const,
  };
  switch (el.shape) {
    case "circle":
      node = <ellipse cx={w / 2} cy={h / 2} rx={Math.max(0, w / 2 - i)} ry={Math.max(0, h / 2 - i)} {...common} />;
      break;
    case "ring":
      node = (
        <>
          <defs>
            <linearGradient id={`g-${el.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={grad?.colors[0] ?? fill} />
              <stop offset="100%" stopColor={grad?.colors[1] ?? fill} />
            </linearGradient>
          </defs>
          <circle
            cx={w / 2}
            cy={h / 2}
            r={Math.max(1, Math.min(w, h) / 2 - sw / 2 - 1)}
            fill="none"
            stroke={fillRef}
            strokeWidth={Math.max(1, sw || 6)}
          />
        </>
      );
      break;
    case "semi":
      node = <path d={`M${i} ${h - i} A${w / 2 - i} ${h - 2 * i} 0 0 1 ${w - i} ${h - i} Z`} {...common} />;
      break;
    case "quarter":
      node = <path d={`M${i} ${h - i} L${i} ${i} A${w - 2 * i} ${h - 2 * i} 0 0 1 ${w - i} ${h - i} Z`} {...common} />;
      break;
    case "leaf":
      node = <path d={`M${i} ${h / 2} Q${w / 2} ${-h * 0.1} ${w - i} ${h / 2} Q${w / 2} ${h * 1.1} ${i} ${h / 2} Z`} {...common} />;
      break;
    case "wave":
      node = (
        <path
          d={`M${i} ${h / 2} Q${w * 0.25} ${i} ${w / 2} ${h / 2} T${w - i} ${h / 2}`}
          fill="none"
          stroke={fillRef}
          strokeWidth={Math.max(1, sw || 5)}
          strokeLinecap="round"
        />
      );
      break;
    case "triangle":
      node = <polygon points={`${w / 2},${i} ${w - i},${h - i} ${i},${h - i}`} {...common} />;
      break;
    case "diamond":
      node = <polygon points={`${w / 2},${i} ${w - i},${h / 2} ${w / 2},${h - i} ${i},${h / 2}`} {...common} />;
      break;
    case "hexagon":
      node = (
        <polygon
          points={`${w * 0.25},${i} ${w * 0.75},${i} ${w - i},${h / 2} ${w * 0.75},${h - i} ${w * 0.25},${h - i} ${i},${h / 2}`}
          {...common}
        />
      );
      break;
    case "star": {
      const pts: string[] = [];
      for (let k = 0; k < 10; k++) {
        const r = k % 2 === 0 ? 50 : 21;
        const a = (Math.PI / 5) * k - Math.PI / 2;
        pts.push(`${X(50 + r * Math.cos(a))},${Y(50 + r * Math.sin(a))}`);
      }
      node = <polygon points={pts.join(" ")} {...common} />;
      break;
    }
    case "flower": {
      const petals: ReactNode[] = [];
      const rx = w * 0.22;
      const ry = h * 0.34;
      for (let k = 0; k < 6; k++) {
        const a = (Math.PI / 3) * k;
        petals.push(
          <ellipse
            key={k}
            cx={w / 2 + Math.cos(a) * w * 0.22}
            cy={h / 2 + Math.sin(a) * h * 0.22}
            rx={rx}
            ry={ry}
            transform={`rotate(${(a * 180) / Math.PI} ${w / 2 + Math.cos(a) * w * 0.22} ${h / 2 + Math.sin(a) * h * 0.22})`}
            {...common}
          />,
        );
      }
      node = (
        <>
          <defs>
            <linearGradient id={`g-${el.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={grad?.colors[0] ?? fill} />
              <stop offset="100%" stopColor={grad?.colors[1] ?? fill} />
            </linearGradient>
          </defs>
          {petals}
          <circle cx={w / 2} cy={h / 2} r={Math.min(w, h) * 0.13} fill={stroke !== "none" ? stroke : "#ffffff"} />
        </>
      );
      break;
    }
    case "heart":
      node = (
        <path
          d={`M${X(50)} ${Y(92)} C${X(8)} ${Y(60)} ${X(0)} ${Y(34)} ${X(14)} ${Y(17)} C${X(28)} ${Y(2)} ${X(46)} ${Y(9)} ${X(50)} ${Y(24)} C${X(54)} ${Y(9)} ${X(72)} ${Y(2)} ${X(86)} ${Y(17)} C${X(100)} ${Y(34)} ${X(92)} ${Y(60)} ${X(50)} ${Y(92)} Z`}
          {...common}
        />
      );
      break;
    case "arch": {
      const r = Math.max(0, Math.min(w / 2, h) - i);
      node = (
        <path
          d={`M${i} ${h - i} L${i} ${r + i} A${r} ${r} 0 0 1 ${w - i} ${r + i} L${w - i} ${h - i} Z`}
          {...common}
        />
      );
      break;
    }
  }
  const needsDefs = !!grad && el.shape !== "ring" && el.shape !== "flower" && el.shape !== "wave";
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height="100%"
      style={{ display: "block", overflow: "visible" }}
      preserveAspectRatio="none"
    >
      {needsDefs && (
        <defs>
          <linearGradient id={`g-${el.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={grad!.colors[0]} />
            {grad!.colors.slice(1).map((c, k) => (
              <stop key={k} offset={`${((k + 1) / (grad!.colors.length - 1)) * 100}%`} stopColor={c} />
            ))}
          </linearGradient>
        </defs>
      )}
      {node}
    </svg>
  );
}

export function imageRadius(el: ImageEl, u: UFn): string {
  switch (el.frame) {
    case "circle":
      return "50%";
    case "rounded":
      return u(el.radius);
    case "arch":
      return `${u(el.w / 2)} ${u(el.w / 2)} 0 0`;
    default:
      return "0";
  }
}

export function ElementBody({ el, u }: { el: El; u: UFn }) {
  if (el.type === "text") {
    return <div style={textStyle(el, u)}>{el.text || "\u00A0"}</div>;
  }
  if (el.type === "shape") {
    return <ShapeBody el={el} u={u} />;
  }
  if (!el.src) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: imageRadius(el, u),
          background: "rgba(255,255,255,0.7)",
          border: `${u(Math.max(2, el.w * 0.012))} dashed #94a3b8`,
          display: "grid",
          placeItems: "center",
          alignContent: "center",
          gap: u(el.h * 0.03),
          color: "#64748b",
          boxSizing: "border-box",
        }}
      >
        <span style={{ fontSize: u(el.h * 0.28), lineHeight: 1 }}>🖼️</span>
        <span
          style={{
            fontSize: u(Math.max(12, el.w * 0.11)),
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            lineHeight: 1.2,
            padding: `0 ${u(el.w * 0.06)}`,
            textAlign: "center",
          }}
        >
          {el.label || "Add photo"}
        </span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={el.src}
      alt=""
      draggable={false}
      crossOrigin="anonymous"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        borderRadius: imageRadius(el, u),
        userSelect: "none",
        mixBlendMode: el.blend && el.blend !== "normal" ? el.blend : undefined,
        background: el.tile ? `url("${el.src}") center / ${Math.max(el.w / 2, 240)}px auto repeat` : undefined,
        ...(el.tile ? { color: "transparent" } : {}),
      }}
    />
  );
}

export function DesignView({
  doc,
  mode = "fit",
  className,
}: {
  doc: Doc;
  mode?: "px" | "fit";
  className?: string;
}) {
  const u = makeU(mode, doc.width);
  const size: CSSProperties =
    mode === "px"
      ? { width: doc.width, height: doc.height }
      : { width: "100%", aspectRatio: `${doc.width} / ${doc.height}`, containerType: "inline-size" };
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", background: doc.background, ...size }}>
      {doc.elements.map((el) => (
        <div key={el.id} style={wrapperStyle(el, doc)}>
          <ElementBody el={el} u={u} />
        </div>
      ))}
    </div>
  );
}

/** Renders a single page of a (possibly multi-page) doc. */
export function PageView({ doc, page, mode = "fit", className }: { doc: Doc; page: Page; mode?: "px" | "fit"; className?: string }) {
  const u = makeU(mode, doc.width);
  const size: CSSProperties =
    mode === "px"
      ? { width: doc.width, height: doc.height }
      : { width: "100%", aspectRatio: `${doc.width} / ${doc.height}`, containerType: "inline-size" };
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", background: page.background, ...size }}>
      {page.elements.map((el) => (
        <div key={el.id} style={wrapperStyle(el, doc)}>
          <ElementBody el={el} u={u} />
        </div>
      ))}
    </div>
  );
}

/** All pages stacked vertically with a small label — used for previews & share sheet. */
export function PagesStack({ doc, gap = 16, label = true, className }: { doc: Doc; gap?: number; label?: boolean; className?: string }) {
  const pages = pagesOf(doc);
  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", gap }}>
      {pages.map((p, i) => (
        <div key={p.id}>
          {label && (
            <p className="mb-1 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {i + 1}. {p.name}
            </p>
          )}
          <PageView doc={doc} page={p} className="shadow-md" />
        </div>
      ))}
    </div>
  );
}
