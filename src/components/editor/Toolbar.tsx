"use client";

import type { Doc, El, ImageFrame } from "@/lib/design";
import { Btn, ColorPicker, FontPicker, NumField, Popover, Sep, Slider } from "./ui";

export type ToolbarProps = {
  doc: Doc;
  sel: El | null;
  update: (patch: Record<string, unknown>, key?: string) => void;
  setBackground: (css: string) => void;
  reorder: (dir: "up" | "down" | "front" | "back") => void;
  duplicate: () => void;
  remove: () => void;
  replaceImage: () => void;
  startEdit: () => void;
};

function Common({ sel, update, reorder, duplicate, remove }: ToolbarProps & { sel: El }) {
  return (
    <>
      <Sep />
      <Popover title="Transparency" trigger={<span>◐ Opacity</span>} width={220}>
        <Slider label="Opacity" value={Math.round(sel.opacity * 100)} min={0} max={100} onChange={(v) => update({ opacity: v / 100 }, "opacity")} />
        <Slider label="Rotation" value={Math.round(sel.rotation)} min={-180} max={180} onChange={(v) => update({ rotation: v }, "rot")} />
      </Popover>
      <Popover title="Arrange" trigger={<span>⧉ Arrange</span>} width={190}>
        <div className="grid gap-1">
          {(
            [
              ["front", "Bring to front"],
              ["up", "Bring forward"],
              ["down", "Send backward"],
              ["back", "Send to back"],
            ] as const
          ).map(([d, l]) => (
            <button key={d} onClick={() => reorder(d)} className="rounded-lg px-3 py-2 text-left text-sm hover:bg-violet-50">
              {l}
            </button>
          ))}
        </div>
      </Popover>
      <Btn title="Duplicate (Ctrl+D)" onClick={duplicate}>
        ⎘
      </Btn>
      <Btn title={sel.locked ? "Unlock" : "Lock"} active={sel.locked} onClick={() => update({ locked: !sel.locked })}>
        {sel.locked ? "🔒" : "🔓"}
      </Btn>
      <Btn title="Delete (Del)" onClick={remove} className="hover:!bg-rose-50 hover:!text-rose-600">
        🗑
      </Btn>
    </>
  );
}

const FRAMES: { f: ImageFrame; label: string }[] = [
  { f: "rect", label: "▭" },
  { f: "rounded", label: "▢" },
  { f: "circle", label: "◯" },
  { f: "arch", label: "⌓" },
];

export default function Toolbar(props: ToolbarProps) {
  const { sel, update, doc, setBackground, replaceImage, startEdit } = props;

  if (!sel) {
    return (
      <div className="flex min-h-12 flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-600">
        <span>Page</span>
        <ColorPicker
          label="Background"
          value={/^#/.test(doc.background) ? doc.background : "#ffffff"}
          onChange={setBackground}
          title="Background colour"
        />
        <Sep />
        <span className="text-slate-400">
          {doc.width} × {doc.height}px · Click any element to edit it, double-click text to type.
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-h-12 flex-wrap items-center gap-1 border-b border-slate-200 bg-white px-3 py-1.5">
      {sel.type === "text" && (
        <>
          <FontPicker value={sel.fontFamily} onChange={(v) => update({ fontFamily: v })} />
          <Sep />
          <Btn title="Smaller" onClick={() => update({ fontSize: Math.max(6, Math.round(sel.fontSize) - 2) }, "fs")}>
            −
          </Btn>
          <NumField title="Font size" value={sel.fontSize} min={6} max={600} onChange={(v) => update({ fontSize: v }, "fs")} />
          <Btn title="Larger" onClick={() => update({ fontSize: Math.min(600, Math.round(sel.fontSize) + 2) }, "fs")}>
            +
          </Btn>
          <ColorPicker title="Text colour" value={sel.color} onChange={(v) => update({ color: v }, "color")} />
          <Sep />
          <Btn title="Bold" active={sel.fontWeight >= 600} onClick={() => update({ fontWeight: sel.fontWeight >= 600 ? 400 : 700 })}>
            <b>B</b>
          </Btn>
          <Btn title="Italic" active={sel.italic} onClick={() => update({ italic: !sel.italic })}>
            <i>I</i>
          </Btn>
          <Btn title="Underline" active={sel.underline} onClick={() => update({ underline: !sel.underline })}>
            <u>U</u>
          </Btn>
          <Btn title="UPPERCASE" active={sel.uppercase} onClick={() => update({ uppercase: !sel.uppercase })}>
            Aa
          </Btn>
          <Sep />
          {(
            [
              ["left", "⇤"],
              ["center", "↔"],
              ["right", "⇥"],
            ] as const
          ).map(([a, l]) => (
            <Btn key={a} title={`Align ${a}`} active={sel.align === a} onClick={() => update({ align: a })}>
              {l}
            </Btn>
          ))}
          <Popover title="Spacing" trigger={<span>⇕ Spacing</span>} width={230}>
            <Slider label="Letter spacing" value={sel.letterSpacing} min={-5} max={40} step={0.5} onChange={(v) => update({ letterSpacing: v }, "ls")} />
            <Slider label="Line height" value={sel.lineHeight} min={0.8} max={2.6} step={0.05} onChange={(v) => update({ lineHeight: v }, "lh")} />
          </Popover>
          <Btn title="Edit text (Enter / double-click)" onClick={startEdit}>
            ✎ Edit
          </Btn>
        </>
      )}

      {sel.type === "shape" && sel.shape !== "line" && (
        <>
          <ColorPicker label="Fill" title="Fill colour" allowNone value={sel.fill} onChange={(v) => update({ fill: v }, "fill")} />
          <ColorPicker label="Border" title="Border colour" value={sel.stroke} onChange={(v) => update({ stroke: v, strokeWidth: sel.strokeWidth || 3 }, "stroke")} />
          <span className="ml-1 text-xs text-slate-500">Width</span>
          <NumField title="Border width" value={sel.strokeWidth} min={0} max={80} onChange={(v) => update({ strokeWidth: v }, "sw")} width={52} />
          {sel.shape === "rect" && (
            <Popover title="Corner radius" trigger={<span>◜ Corners</span>} width={210}>
              <Slider label="Corner radius" value={sel.radius} min={0} max={200} onChange={(v) => update({ radius: v }, "rad")} />
            </Popover>
          )}
        </>
      )}

      {sel.type === "shape" && sel.shape === "line" && (
        <>
          <ColorPicker label="Colour" title="Line colour" value={sel.stroke} onChange={(v) => update({ stroke: v }, "stroke")} />
          <span className="ml-1 text-xs text-slate-500">Thickness</span>
          <NumField
            title="Thickness"
            value={sel.strokeWidth}
            min={1}
            max={40}
            width={52}
            onChange={(v) => update({ strokeWidth: v, h: v }, "sw")}
          />
        </>
      )}

      {sel.type === "image" && (
        <>
          {FRAMES.map((f) => (
            <Btn key={f.f} title={`Frame: ${f.f}`} active={sel.frame === f.f} onClick={() => update({ frame: f.f })}>
              <span className="text-lg leading-none">{f.label}</span>
            </Btn>
          ))}
          {sel.frame === "rounded" && (
            <Popover title="Corner radius" trigger={<span>◜ Radius</span>} width={210}>
              <Slider label="Corner radius" value={sel.radius} min={0} max={200} onChange={(v) => update({ radius: v }, "rad")} />
            </Popover>
          )}
          <Btn title="Replace photo" onClick={replaceImage}>
            ⇄ Replace
          </Btn>
        </>
      )}

      <Common {...props} sel={sel} />
    </div>
  );
}
