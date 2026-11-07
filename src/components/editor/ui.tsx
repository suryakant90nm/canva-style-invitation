"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { FONTS } from "@/lib/fonts";

export const PALETTE = [
  "#000000", "#1f2937", "#6b7280", "#d1d5db", "#ffffff", "#7a2e3b",
  "#5a0f1d", "#8c1c2e", "#dc2626", "#ff5e7e", "#f08aa5", "#ffd1e0",
  "#c2410c", "#ff8a3d", "#f4b942", "#ffd54a", "#fff1b8", "#fbf3ee",
  "#0f3d2e", "#2e7d32", "#6b8f3a", "#3ec5c1", "#9ad8c0", "#cdeedd",
  "#0b1d3a", "#13294b", "#2d6cdf", "#3b82f6", "#a9d8ff", "#d8efff",
  "#4a3b78", "#7b61ff", "#b8a5e8", "#c9a24b", "#e6c36a", "#d6b98f",
];

export function Btn({
  active,
  onClick,
  title,
  children,
  disabled,
  className = "",
}: {
  active?: boolean;
  onClick?: () => void;
  title?: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`grid h-9 min-w-9 place-items-center rounded-lg px-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-35 ${
        active ? "bg-violet-100 text-violet-700" : "text-slate-700 hover:bg-slate-100"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function Sep() {
  return <span className="mx-1 h-6 w-px bg-slate-200" />;
}

type PopoverCtx = { close: () => void };
const PopoverContext = createContext<PopoverCtx>({ close: () => undefined });
/** Call inside popover content to close it (e.g. after picking a colour). */
export const usePopoverClose = () => useContext(PopoverContext).close;

export function Popover({
  trigger,
  children,
  title,
  width = 250,
  className = "",
  alignRight = false,
  closeOnSelect = false,
}: {
  trigger: ReactNode;
  children: ReactNode;
  title?: string;
  width?: number;
  className?: string;
  alignRight?: boolean;
  /** close when any button inside the panel is clicked (menus, swatches) */
  closeOnSelect?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    // close on outside click — but ignore the trigger itself (its onClick toggles)
    const h = (e: PointerEvent) => {
      const t = e.target as Node;
      if (ref.current && !ref.current.contains(t)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", h);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", h);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  // keep the panel on-screen: flip to the right edge if it would overflow
  const [flip, setFlip] = useState(false);
  useLayoutEffect(() => {
    if (!open || !panelRef.current) return;
    const r = panelRef.current.getBoundingClientRect();
    setFlip(r.right > window.innerWidth - 8);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        title={title}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`flex h-9 min-w-9 items-center justify-center gap-1 rounded-lg px-2 text-sm font-medium transition ${
          open ? "bg-gold-100 text-maroon-800" : "text-slate-700 hover:bg-slate-100"
        } ${className}`}
      >
        {trigger}
      </button>
      {open && (
        <div
          ref={panelRef}
          onClick={(e) => {
            if (!closeOnSelect) return;
            const btn = (e.target as HTMLElement).closest("button");
            if (btn && panelRef.current?.contains(btn)) setOpen(false);
          }}
          className={`absolute top-full z-[70] mt-2 rounded-xl border border-slate-200 bg-white p-3 shadow-2xl ${
            alignRight || flip ? "right-0" : "left-0"
          }`}
          style={{ width }}
        >
          <PopoverContext.Provider value={{ close }}>{children}</PopoverContext.Provider>
        </div>
      )}
    </div>
  );
}

const isHex = (v: string) => /^#[0-9a-f]{6}$/i.test(v);

export function ColorPicker({
  value,
  onChange,
  title,
  allowNone,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  title?: string;
  allowNone?: boolean;
  label?: string;
}) {
  const none = !value || value === "transparent" || value === "none";
  return (
    <Popover
      title={title}
      width={232}
      closeOnSelect
      trigger={
        <>
          {label && <span className="text-xs text-slate-500">{label}</span>}
          <span
            className="block h-6 w-6 rounded-md border border-slate-300"
            style={
              none
                ? { backgroundImage: "linear-gradient(135deg,#fff 45%,#ef4444 45%,#ef4444 55%,#fff 55%)" }
                : { background: value }
            }
          />
        </>
      }
    >
      <div className="grid grid-cols-6 gap-1.5">
        {PALETTE.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className="h-7 w-7 rounded-md border border-slate-200 transition hover:scale-110"
            style={{ background: c }}
            aria-label={c}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <label className="flex flex-1 items-center gap-2 text-xs text-slate-600">
          Custom
          <input
            type="color"
            value={isHex(value) ? value : "#ffffff"}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 w-full cursor-pointer rounded border border-slate-200"
          />
        </label>
        {allowNone && (
          <button
            type="button"
            onClick={() => onChange("transparent")}
            className="rounded-md border border-slate-200 px-2 py-1.5 text-xs hover:bg-slate-50"
          >
            None
          </button>
        )}
      </div>
    </Popover>
  );
}

export function FontPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const groups = Array.from(new Set(FONTS.map((f) => f.group)));
  return (
    <Popover
      title="Font"
      width={260}
      className="w-40 justify-between border border-slate-200"
      trigger={
        <>
          <span className="truncate" style={{ fontFamily: `'${value}'` }}>
            {value}
          </span>
          <span className="text-xs text-slate-400">▾</span>
        </>
      }
    >
      <div className="max-h-80 overflow-y-auto pr-1">
        {groups.map((g) => (
          <div key={g}>
            <p className="px-2 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">{g}</p>
            {FONTS.filter((f) => f.group === g).map((f) => (
              <button
                key={f.name}
                type="button"
                onClick={() => onChange(f.name)}
                className={`block w-full rounded-lg px-2 py-1.5 text-left text-xl hover:bg-violet-50 ${
                  f.name === value ? "bg-violet-100 text-violet-700" : "text-slate-800"
                }`}
                style={{ fontFamily: `'${f.name}'` }}
              >
                {f.group === "Hindi" ? `${f.name} · शुभ` : f.name}
              </button>
            ))}
          </div>
        ))}
      </div>
    </Popover>
  );
}

export function NumField({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  width = 56,
  title,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  width?: number;
  title?: string;
}) {
  return (
    <input
      type="number"
      title={title}
      value={Math.round(value * 10) / 10}
      min={min}
      max={max}
      step={step}
      onChange={(e) => {
        const n = parseFloat(e.target.value);
        if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
      }}
      style={{ width }}
      className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-center text-sm outline-none focus:border-violet-400"
    />
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="mb-3 block last:mb-0">
      <span className="mb-1 flex justify-between text-xs text-slate-600">
        {label}
        <span className="tabular-nums text-slate-400">{Math.round(value * 100) / 100}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-violet-600"
      />
    </label>
  );
}
