"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as RPointerEvent,
} from "react";
import { DesignView, ElementBody, PageView, makeU, textStyle, wrapperStyle } from "@/components/DesignView";
import { CATEGORIES } from "@/lib/categories";
import { cloneDoc, makeImage, pagesOf, resizeDoc, uid, type Doc, type El, type Page, type TextEl } from "@/lib/design";
import { patchLocalDesign } from "@/lib/local-designs";
import { getOwnerId } from "@/lib/owner";
import { renderToImage, renderToImageElement } from "./export";
import VideoStudio from "@/components/VideoStudio";
import AnimatePanel from "./AnimatePanel";
import type { AnimateSettings } from "@/lib/animate";
import type { VideoSettings } from "@/lib/video-effects";
import { FONTS } from "@/lib/fonts";
import {
  BackgroundPanel,
  ElementsPanel,
  ArtPanel,
  LayersPanel,
  PhotosPanel,
  ResizePanel,
  TemplatesPanel,
  TextPanel,
  readImage,
  type PanelApi,
} from "./panels";
import Toolbar from "./Toolbar";
import { Btn, Popover } from "./ui";

type Props = { id: string; initialTitle: string; category: string; initialDoc: Doc };
type Tab = "templates" | "art" | "elements" | "text" | "photos" | "background" | "layers" | "resize";
type Status = "saved" | "saving" | "unsaved" | "error";

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: "templates", icon: "🗂️", label: "Templates" },
  { id: "art", icon: "🎨", label: "Art" },
  { id: "elements", icon: "◆", label: "Elements" },
  { id: "text", icon: "T", label: "Text" },
  { id: "photos", icon: "🖼️", label: "Photos" },
  { id: "background", icon: "▦", label: "Background" },
  { id: "layers", icon: "☰", label: "Layers" },
  { id: "resize", icon: "⤢", label: "Resize" },
];

const HANDLES = [
  { dx: -1, dy: -1, cursor: "nwse-resize" },
  { dx: 0, dy: -1, cursor: "ns-resize" },
  { dx: 1, dy: -1, cursor: "nesw-resize" },
  { dx: 1, dy: 0, cursor: "ew-resize" },
  { dx: 1, dy: 1, cursor: "nwse-resize" },
  { dx: 0, dy: 1, cursor: "ns-resize" },
  { dx: -1, dy: 1, cursor: "nesw-resize" },
  { dx: -1, dy: 0, cursor: "ew-resize" },
];

function snapAxis(pos: number, size: number, targets: number[], thr: number) {
  let best: { d: number; t: number } | null = null;
  for (const c of [pos, pos + size / 2, pos + size]) {
    for (const t of targets) {
      const d = t - c;
      if (Math.abs(d) <= thr && (!best || Math.abs(d) < Math.abs(best.d))) best = { d, t };
    }
  }
  return best;
}

const getH = (el: El) =>
  el.type === "text" ? (document.getElementById(`el-${el.id}`)?.offsetHeight ?? el.fontSize * 1.3) : el.h;

/** Make sure a doc carries a pages[] array and that elements/background mirror page[idx]. */
function normalizeDoc(d: Doc, idx = 0): Doc {
  const pages = pagesOf(d).map((p) => ({ ...p }));
  const i = Math.min(Math.max(0, idx), pages.length - 1);
  return { ...d, pages, elements: pages[i].elements, background: pages[i].background };
}

/** Write the currently-edited elements/background back into pages[idx]. */
function syncActivePage(d: Doc, idx: number): Doc {
  const pages = pagesOf(d).map((p, k) => (k === idx ? { ...p, elements: d.elements, background: d.background } : p));
  return { ...d, pages };
}

export default function Editor({ id, initialTitle, category, initialDoc }: Props) {
  const [doc, setDoc] = useState<Doc>(() => normalizeDoc(initialDoc));
  const docRef = useRef<Doc>(normalizeDoc(initialDoc));
  const [activePage, setActivePage] = useState(0);
  const activePageRef = useRef(0);
  const [showAddPage, setShowAddPage] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const titleRef = useRef(initialTitle);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  // server + first client render must match (no window access here); on
  // phones we close the panel right after mount so the canvas is visible.
  const [tab, setTab] = useState<Tab | null>("templates");
  useEffect(() => {
    if (window.innerWidth < 768) setTab(null);
  }, []);
  const [zoom, setZoom] = useState(1);
  const [areaSize, setAreaSize] = useState({ w: 900, h: 700 });
  const [selH, setSelH] = useState(0);
  const [guides, setGuides] = useState<{ v: number[]; h: number[] }>({ v: [], h: [] });
  const [status, setStatus] = useState<Status>("saved");
  const [uploads, setUploads] = useState<string[]>([]);
  const [exporting, setExporting] = useState<string | null>(null);
  const [showPublish, setShowPublish] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [adminTpl, setAdminTpl] = useState<{ slug: string; title: string; category: string; tags: string[]; featured: boolean } | null>(null);

  // admin session + "editing template X" context (set by the admin panel via ?tpl=)
  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((j: { admin: boolean }) => setIsAdminUser(!!j.admin))
      .catch(() => undefined);
    try {
      const raw = sessionStorage.getItem(`admin-tpl-${id}`);
      if (raw) setAdminTpl(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [id]);
  const [, setTick] = useState(0);

  const pastRef = useRef<Doc[]>([]);
  const futureRef = useRef<Doc[]>([]);
  const lastKey = useRef<{ key: string; t: number } | null>(null);
  const clipRef = useRef<El | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirtyRef = useRef(false);
  const areaRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const u = makeU("px", 1);

  /* ───────── persistence ───────── */
  const save = useCallback(async () => {
    if (!dirtyRef.current) return;
    dirtyRef.current = false;
    setStatus("saving");
    // local mirror first — instant and survives serverless restarts
    try {
      patchLocalDesign(id, { title: titleRef.current, data: docRef.current, category });
    } catch {
      /* ignore quota errors */
    }
    try {
      const r = await fetch(`/api/designs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: titleRef.current, data: docRef.current, category, ownerId: getOwnerId() }),
      });
      if (!r.ok) throw new Error("save failed");
      setStatus(dirtyRef.current ? "unsaved" : "saved");
    } catch {
      dirtyRef.current = true;
      setStatus("error");
    }
  }, [id]);

  const markDirty = useCallback(() => {
    dirtyRef.current = true;
    setStatus("unsaved");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => void save(), 1200);
  }, [save]);

  const apply = useCallback(
    (next: Doc) => {
      const synced = syncActivePage(next, activePageRef.current);
      docRef.current = synced;
      setDoc(synced);
      markDirty();
    },
    [markDirty],
  );

  const pushHistory = useCallback(() => {
    pastRef.current.push(docRef.current);
    if (pastRef.current.length > 100) pastRef.current.shift();
    futureRef.current = [];
    setTick((v) => v + 1);
  }, []);

  const commit = useCallback(
    (fn: (d: Doc) => Doc, key?: string) => {
      const now = Date.now();
      const coalesce = !!key && lastKey.current?.key === key && now - lastKey.current.t < 900;
      lastKey.current = key ? { key, t: now } : null;
      if (!coalesce) pushHistory();
      apply(fn(docRef.current));
    },
    [apply, pushHistory],
  );

  const liveUpdate = useCallback(
    (elId: string, patch: Record<string, unknown>) => {
      const d = docRef.current;
      apply({ ...d, elements: d.elements.map((e) => (e.id === elId ? ({ ...e, ...patch } as El) : e)) });
    },
    [apply],
  );

  const restore = useCallback(
    (snapshot: Doc) => {
      const all = pagesOf(snapshot);
      const i = Math.min(activePageRef.current, all.length - 1);
      activePageRef.current = i;
      setActivePage(i);
      const next = { ...snapshot, pages: all, elements: all[i].elements, background: all[i].background };
      docRef.current = next;
      setDoc(next);
      markDirty();
    },
    [markDirty],
  );

  const undo = useCallback(() => {
    const p = pastRef.current.pop();
    if (!p) return;
    futureRef.current.push(docRef.current);
    lastKey.current = null;
    restore(p);
    setTick((v) => v + 1);
  }, [restore]);

  const redo = useCallback(() => {
    const n = futureRef.current.pop();
    if (!n) return;
    pastRef.current.push(docRef.current);
    lastKey.current = null;
    restore(n);
    setTick((v) => v + 1);
  }, [restore]);

  /* ───────── pages (Canva-style "+ add page") ───────── */
  const pages = pagesOf(doc);

  const goToPage = useCallback((idx: number) => {
    const d = docRef.current;
    const all = pagesOf(d);
    const i = Math.min(Math.max(0, idx), all.length - 1);
    activePageRef.current = i;
    setActivePage(i);
    const next = { ...d, elements: all[i].elements, background: all[i].background };
    docRef.current = next;
    setDoc(next);
    setSelectedId(null);
    setEditingId(null);
  }, []);

  const addPage = useCallback(
    (source?: Doc) => {
      pushHistory();
      lastKey.current = null;
      const d = docRef.current;
      const all = pagesOf(d);
      const n = all.length + 1;
      let page: Page;
      if (source) {
        const fitted = resizeDoc(cloneDoc(source), d.width, d.height);
        const src = pagesOf(fitted)[0];
        page = { id: `pg-${uid()}`, name: `Page ${n}`, background: src.background, elements: src.elements };
      } else {
        page = { id: `pg-${uid()}`, name: `Page ${n}`, background: "#ffffff", elements: [] };
      }
      const insertAt = activePageRef.current + 1;
      const pagesNext = [...all.slice(0, insertAt), page, ...all.slice(insertAt)];
      const next: Doc = { ...d, pages: pagesNext, elements: page.elements, background: page.background };
      activePageRef.current = insertAt;
      setActivePage(insertAt);
      docRef.current = next;
      setDoc(next);
      markDirty();
      setSelectedId(null);
      setEditingId(null);
      setShowAddPage(false);
    },
    [markDirty, pushHistory],
  );

  const duplicatePage = useCallback(() => {
    const d = docRef.current;
    const cur = pagesOf(d)[activePageRef.current];
    addPage({ ...d, pages: undefined, elements: cur.elements.map((e) => ({ ...e, id: uid() })), background: cur.background });
  }, [addPage]);

  const deletePage = useCallback(
    (idx: number) => {
      const d = docRef.current;
      const all = pagesOf(d);
      if (all.length <= 1) return;
      pushHistory();
      lastKey.current = null;
      const pagesNext = all.filter((_, k) => k !== idx);
      const cur = activePageRef.current;
      const i = Math.min(cur > idx ? cur - 1 : cur, pagesNext.length - 1);
      activePageRef.current = i;
      setActivePage(i);
      const next: Doc = { ...d, pages: pagesNext, elements: pagesNext[i].elements, background: pagesNext[i].background };
      docRef.current = next;
      setDoc(next);
      markDirty();
      setSelectedId(null);
    },
    [markDirty, pushHistory],
  );

  const movePage = useCallback(
    (idx: number, dir: -1 | 1) => {
      const d = docRef.current;
      const all = [...pagesOf(d)];
      const j = idx + dir;
      if (j < 0 || j >= all.length) return;
      pushHistory();
      [all[idx], all[j]] = [all[j], all[idx]];
      activePageRef.current = j;
      setActivePage(j);
      const next: Doc = { ...d, pages: all };
      docRef.current = next;
      setDoc(next);
      markDirty();
    },
    [markDirty, pushHistory],
  );

  /* ───────── element operations ───────── */
  const updateEl = useCallback(
    (elId: string, patch: Record<string, unknown>, key?: string) => {
      commit(
        (d) => ({ ...d, elements: d.elements.map((e) => (e.id === elId ? ({ ...e, ...patch } as El) : e)) }),
        key ? `${key}-${elId}` : undefined,
      );
    },
    [commit],
  );

  const addEl = useCallback(
    (el: El, center = true) => {
      const d = docRef.current;
      let e = el;
      if (center) {
        const hh = el.type === "text" ? el.fontSize * el.lineHeight * el.text.split("\n").length : el.h;
        e = { ...el, x: (d.width - el.w) / 2, y: (d.height - hh) / 2 };
      }
      commit((dd) => ({ ...dd, elements: [...dd.elements, e] }));
      setSelectedId(e.id);
      setEditingId(null);
    },
    [commit],
  );

  const deleteEl = useCallback(
    (elId: string) => {
      commit((d) => ({ ...d, elements: d.elements.filter((e) => e.id !== elId) }));
      setSelectedId((s) => (s === elId ? null : s));
      setEditingId((s) => (s === elId ? null : s));
    },
    [commit],
  );

  const duplicateEl = useCallback(
    (el: El) => {
      const copy = { ...el, id: uid(), x: el.x + 24, y: el.y + 24, locked: false } as El;
      commit((d) => ({ ...d, elements: [...d.elements, copy] }));
      setSelectedId(copy.id);
    },
    [commit],
  );

  const reorder = useCallback(
    (elId: string, dir: "up" | "down" | "front" | "back") => {
      commit((d) => {
        const arr = [...d.elements];
        const i = arr.findIndex((e) => e.id === elId);
        if (i < 0) return d;
        const [it] = arr.splice(i, 1);
        const j =
          dir === "front" ? arr.length : dir === "back" ? 0 : dir === "up" ? Math.min(arr.length, i + 1) : Math.max(0, i - 1);
        arr.splice(j, 0, it);
        return { ...d, elements: arr };
      });
    },
    [commit],
  );

  const addImage = useCallback(
    (src: string) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const d = docRef.current;
        const s = Math.min((d.width * 0.7) / img.naturalWidth, (d.height * 0.6) / img.naturalHeight);
        addEl(makeImage(src, { w: img.naturalWidth * s, h: img.naturalHeight * s }));
      };
      img.onerror = () => addEl(makeImage(src, { w: fallbackSize(docRef.current), h: fallbackSize(docRef.current) }));
      img.src = src;
    },
    [addEl],
  );

  const setBackground = useCallback(
    (css: string) => {
      commit((d) => ({ ...d, background: css }), css.startsWith("#") ? "bg" : undefined);
    },
    [commit],
  );

  const onUpload = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      for (const f of Array.from(files)) {
        if (!f.type.startsWith("image/")) continue;
        try {
          const src = await readImage(f);
          setUploads((x) => [src, ...x]);
          addImage(src);
        } catch {
          alert(`Could not read ${f.name}`);
        }
      }
    },
    [addImage],
  );

  const startEdit = useCallback(
    (elId: string) => {
      pushHistory();
      lastKey.current = null;
      setSelectedId(elId);
      setEditingId(elId);
    },
    [pushHistory],
  );

  /* ───────── derived ───────── */
  const sel = doc.elements.find((e) => e.id === selectedId) ?? null;
  const fit = Math.min((areaSize.w - 80) / doc.width, (areaSize.h - 80) / doc.height);
  const scale = Math.max(0.05, Math.min(1, fit)) * zoom;

  useEffect(() => {
    if (selectedId && !doc.elements.some((e) => e.id === selectedId)) setSelectedId(null);
  }, [doc, selectedId]);

  useLayoutEffect(() => {
    if (sel?.type === "text") {
      const h = document.getElementById(`el-${sel.id}`)?.offsetHeight ?? 0;
      if (Math.abs(h - selH) > 0.5) setSelH(h);
    }
  });

  useLayoutEffect(() => {
    if (editingId && taRef.current) {
      const ta = taRef.current;
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    }
  });

  // Story Invite hands over its multi-page doc through sessionStorage (?story=1)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("story") !== "1") return;
      const raw = sessionStorage.getItem(`story-${id}`);
      if (!raw) return;
      const incoming = normalizeDoc(JSON.parse(raw) as Doc);
      sessionStorage.removeItem(`story-${id}`);
      activePageRef.current = 0;
      setActivePage(0);
      docRef.current = incoming;
      setDoc(incoming);
      markDirty();
      window.history.replaceState(null, "", window.location.pathname);
    } catch {
      /* ignore malformed handoff */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setAreaSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setAreaSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const f = () => setTick((v) => v + 1);
    document.fonts?.addEventListener?.("loadingdone", f);
    return () => document.fonts?.removeEventListener?.("loadingdone", f);
  }, []);

  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) e.preventDefault();
    };
    const vis = () => {
      if (document.visibilityState === "hidden") void save();
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("visibilitychange", vis);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("visibilitychange", vis);
      if (dirtyRef.current) {
        try {
          patchLocalDesign(id, { title: titleRef.current, data: docRef.current, category });
        } catch {
          /* ignore */
        }
        void fetch(`/api/designs/${id}`, {
          method: "PUT",
          keepalive: true,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: titleRef.current, data: docRef.current, category, ownerId: getOwnerId() }),
        });
      }
    };
  }, [id, save]);

  /* ───────── keyboard shortcuts ───────── */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName) || t.isContentEditable)) return;
      const mod = e.ctrlKey || e.metaKey;
      const k = e.key.toLowerCase();
      if (mod && k === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (mod && k === "y") {
        e.preventDefault();
        redo();
      } else if (mod && k === "s") {
        e.preventDefault();
        void save();
      } else if (!sel) {
        if (mod && k === "v" && clipRef.current) {
          e.preventDefault();
          const c = clipRef.current;
          const copy = { ...c, id: uid(), x: c.x + 24, y: c.y + 24 } as El;
          clipRef.current = copy;
          commit((d) => ({ ...d, elements: [...d.elements, copy] }));
          setSelectedId(copy.id);
        }
      } else {
        if (e.key === "Delete" || e.key === "Backspace") {
          e.preventDefault();
          if (!sel.locked) deleteEl(sel.id);
        } else if (mod && k === "d") {
          e.preventDefault();
          duplicateEl(sel);
        } else if (mod && k === "c") {
          clipRef.current = sel;
        } else if (mod && k === "v" && clipRef.current) {
          e.preventDefault();
          const c = clipRef.current;
          const copy = { ...c, id: uid(), x: c.x + 24, y: c.y + 24 } as El;
          clipRef.current = copy;
          commit((d) => ({ ...d, elements: [...d.elements, copy] }));
          setSelectedId(copy.id);
        } else if (e.key === "Escape") {
          setSelectedId(null);
        } else if (e.key === "Enter" && sel.type === "text" && !sel.locked) {
          e.preventDefault();
          startEdit(sel.id);
        } else if (e.key.startsWith("Arrow") && !sel.locked) {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 1;
          const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
          const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
          updateEl(sel.id, { x: sel.x + dx, y: sel.y + dy }, "nudge");
        }
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  /* ───────── pointer interactions ───────── */
  function startMove(e: RPointerEvent, el: El) {
    const sx = e.clientX;
    const sy = e.clientY;
    const h = getH(el);
    const d0 = docRef.current;
    const tx = [0, d0.width / 2, d0.width];
    const ty = [0, d0.height / 2, d0.height];
    d0.elements
      .filter((o) => o.id !== el.id)
      .forEach((o) => {
        const oh = getH(o);
        tx.push(o.x, o.x + o.w / 2, o.x + o.w);
        ty.push(o.y, o.y + oh / 2, o.y + oh);
      });
    let started = false;
    const move = (ev: PointerEvent) => {
      const dx = (ev.clientX - sx) / scale;
      const dy = (ev.clientY - sy) / scale;
      if (!started) {
        if (Math.hypot(dx, dy) * scale < 3) return;
        started = true;
        pushHistory();
        lastKey.current = null;
      }
      let nx = el.x + dx;
      let ny = el.y + dy;
      const gv: number[] = [];
      const gh: number[] = [];
      if (!ev.altKey) {
        const thr = 6 / scale;
        const bx = snapAxis(nx, el.w, tx, thr);
        if (bx) {
          nx += bx.d;
          gv.push(bx.t);
        }
        const by = snapAxis(ny, h, ty, thr);
        if (by) {
          ny += by.d;
          gh.push(by.t);
        }
      }
      liveUpdate(el.id, { x: nx, y: ny });
      setGuides({ v: gv, h: gh });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      setGuides({ v: [], h: [] });
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function startResize(e: RPointerEvent, el: El, dx: number, dy: number) {
    e.stopPropagation();
    e.preventDefault();
    const rot = (el.rotation * Math.PI) / 180;
    const cos = Math.cos(rot);
    const sin = Math.sin(rot);
    const h0 = getH(el);
    const s0 = { px: e.clientX, py: e.clientY, x: el.x, y: el.y, w: el.w, h: h0, fs: el.type === "text" ? el.fontSize : 0, ls: el.type === "text" ? el.letterSpacing : 0 };
    const corner = dx !== 0 && dy !== 0;
    let started = false;
    const move = (ev: PointerEvent) => {
      const ddx = (ev.clientX - s0.px) / scale;
      const ddy = (ev.clientY - s0.py) / scale;
      if (!started) {
        if (Math.hypot(ddx, ddy) * scale < 2) return;
        started = true;
        pushHistory();
        lastKey.current = null;
      }
      const lx = ddx * cos + ddy * sin;
      const ly = -ddx * sin + ddy * cos;
      let nw = s0.w + dx * lx;
      let nh = s0.h + dy * ly;
      const patch: Record<string, unknown> = {};
      if (el.type === "text") {
        if (corner) {
          const k = Math.max(0.1, nw / s0.w);
          nw = s0.w * k;
          nh = s0.h * k;
          patch.fontSize = Math.max(6, s0.fs * k);
          patch.letterSpacing = s0.ls * k;
        } else {
          nh = s0.h;
        }
      } else if (el.type === "image" && corner) {
        nw = Math.max(20, nw);
        nh = nw / (s0.w / s0.h);
      }
      nw = Math.max(el.type === "text" ? 30 : 12, nw);
      if (el.type === "shape" && el.shape === "line") nh = s0.h;
      else nh = Math.max(12, nh);
      if (el.type === "text") nh = corner ? s0.h * (nw / s0.w) : s0.h;
      const cdx = (dx * (nw - s0.w)) / 2;
      const cdy = (dy * (nh - s0.h)) / 2;
      const wx = cdx * cos - cdy * sin;
      const wy = cdx * sin + cdy * cos;
      const cx = s0.x + s0.w / 2 + wx;
      const cy = s0.y + s0.h / 2 + wy;
      patch.x = cx - nw / 2;
      patch.y = cy - nh / 2;
      patch.w = nw;
      if (el.type !== "text") patch.h = nh;
      liveUpdate(el.id, patch);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function startRotate(e: RPointerEvent, el: El) {
    e.stopPropagation();
    e.preventDefault();
    const node = document.getElementById(`el-${el.id}`);
    if (!node) return;
    const r = node.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    let started = false;
    const move = (ev: PointerEvent) => {
      if (!started) {
        started = true;
        pushHistory();
        lastKey.current = null;
      }
      let a = (Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180) / Math.PI + 90;
      if (a > 180) a -= 360;
      if (ev.shiftKey) a = Math.round(a / 15) * 15;
      else {
        const near = Math.round(a / 45) * 45;
        if (Math.abs(a - near) < 4) a = near;
      }
      liveUpdate(el.id, { rotation: Math.round(a * 10) / 10 });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  /* ───────── export & publish ───────── */
  const [videoPct, setVideoPct] = useState(0);
  const [studio, setStudio] = useState<{ images: HTMLImageElement[]; ids: string[]; names: string[] } | null>(null);
  const [animate, setAnimate] = useState(false);

  /** Render all pages to images, then open the Video Studio (effects + preview + export). */
  async function openVideoStudio() {
    setSelectedId(null);
    setEditingId(null);
    setExporting("VIDEO");
    setVideoPct(0);
    await new Promise((r) => setTimeout(r, 200));
    try {
      if (typeof MediaRecorder === "undefined") throw new Error("Video export needs Chrome, Edge or Safari 17+.");
      await document.fonts?.ready;
      const container = exportRef.current;
      if (!container) throw new Error("no node");
      const nodes = Array.from(container.querySelectorAll<HTMLElement>("[data-export-page]"));
      if (!nodes.length) throw new Error("no pages");
      const families = FONTS.map((f) => f.name);
      const imgs: HTMLImageElement[] = [];
      for (let i = 0; i < nodes.length; i++) {
        setVideoPct(Math.round(((i + 1) / nodes.length) * 100));
        imgs.push(await renderToImageElement(nodes[i], families, 1.6));
      }
      const pgs = pagesOf(docRef.current);
      setStudio({ images: imgs, ids: pgs.map((p) => p.id), names: pgs.map((p) => p.name) });
    } catch (err) {
      alert("Could not prepare video: " + (err as Error).message);
    } finally {
      setExporting(null);
      setVideoPct(0);
    }
  }

  async function download(fmt: "png" | "jpg" | "pdf") {
    setSelectedId(null);
    setEditingId(null);
    const win = fmt === "pdf" ? window.open("", "_blank") : null;
    setExporting(fmt.toUpperCase());
    await new Promise((r) => setTimeout(r, 200));
    try {
      await document.fonts?.ready;
      const d = docRef.current;
      const allPages = pagesOf(d);
      const families = Array.from(
        new Set(
          allPages
            .flatMap((pg) => pg.elements)
            .filter((x): x is TextEl => x.type === "text")
            .map((x) => x.fontFamily),
        ),
      );
      const ratio = Math.min(4, Math.max(1, 2400 / Math.max(d.width, d.height)));
      const container = exportRef.current;
      if (!container) throw new Error("no node");
      // one offscreen node per page (rendered below)
      const nodes = Array.from(container.querySelectorAll<HTMLElement>("[data-export-page]"));
      if (!nodes.length) throw new Error("no pages");
      const urls: string[] = [];
      for (const n of nodes) {
        urls.push(await renderToImage(n, fmt === "jpg" ? "jpg" : "png", families, ratio));
      }
      const safe = (titleRef.current || "design").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "design";

      if (fmt === "pdf") {
        if (!win) throw new Error("popup blocked");
        win.document.open();
        win.document.write(
          `<!doctype html><html><head><title>${safe}</title><style>@page{size:${d.width}px ${d.height}px;margin:0}html,body{margin:0;background:#fff}img{width:100%;display:block;page-break-after:always}img:last-child{page-break-after:auto}</style></head><body>${urls
            .map((u) => `<img src="${u}"/>`)
            .join("")}<script>window.addEventListener('load',function(){setTimeout(function(){window.print()},400)})</script></body></html>`,
        );
        win.document.close();
      } else if (urls.length === 1) {
        const a = document.createElement("a");
        a.href = urls[0];
        a.download = `${safe}.${fmt}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        // multiple pages → download each as page-1, page-2 … (WhatsApp shares them as an album)
        for (let i = 0; i < urls.length; i++) {
          const a = document.createElement("a");
          a.href = urls[i];
          a.download = `${safe}-page-${i + 1}.${fmt}`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          await new Promise((r) => setTimeout(r, 350));
        }
      }
    } catch (err) {
      win?.close();
      alert(
        "Could not export the design. If you used an online photo that blocks downloads, try uploading it instead.\n" +
          (err as Error).message,
      );
    } finally {
      setExporting(null);
    }
  }

  /* ───────── panel api ───────── */
  const api: PanelApi = {
    doc,
    category,
    selectedId,
    addEl,
    addImage,
    setBackground,
    applyDoc: (nd) => {
      // replace only the active page with the chosen template (scaled to fit)
      commit((d) => {
        const fitted = resizeDoc(cloneDoc(nd), d.width, d.height);
        const src = pagesOf(fitted)[0];
        return { ...d, elements: src.elements, background: src.background };
      });
      setSelectedId(null);
      setEditingId(null);
    },
    resizeTo: (w, h) => commit((d) => resizeDoc(d, w, h)),
    select: (x) => setSelectedId(x),
    updateEl: (elId, patch) => updateEl(elId, patch),
    deleteEl,
    reorder,
    uploads,
    onUpload,
  };

  const statusLabel =
    status === "saved" ? "✓ All changes saved" : status === "saving" ? "Saving…" : status === "unsaved" ? "Unsaved changes…" : "⚠ Save failed";

  const hs = 12 / scale;
  const bw = 1.5 / scale;
  const selHeight = sel ? (sel.type === "text" ? selH : sel.h) : 0;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100 text-slate-900">
      {/* top bar */}
      <header className="z-30 flex h-14 shrink-0 items-center gap-2 bg-gradient-to-r from-maroon-800 via-maroon-700 to-maroon-800 px-3 text-white shadow-[0_1px_0_rgba(201,168,76,0.35)] sm:gap-3 sm:px-4">
        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight" title="Back to home">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gold-400/20 ring-1 ring-gold-400/40">✉</span>
          <span className="hidden sm:inline">ShubhInvite</span>
        </Link>
        <Link href="/my-designs" className="hidden rounded-lg px-3 py-1.5 text-sm text-white/90 hover:bg-white/15 md:block">
          My designs
        </Link>
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            titleRef.current = e.target.value;
            markDirty();
          }}
          className="mx-1 min-w-0 flex-1 rounded-lg border border-transparent bg-white/10 px-3 py-1.5 text-sm font-medium outline-none placeholder:text-white/60 hover:bg-white/20 focus:border-white/40 focus:bg-white/20 sm:mx-2 sm:w-64 sm:flex-none"
          placeholder="Untitled design"
        />
        <div className="flex items-center gap-1">
          <button
            title="Undo (Ctrl+Z)"
            onClick={undo}
            disabled={pastRef.current.length === 0}
            className="grid h-9 w-9 place-items-center rounded-lg text-lg hover:bg-white/15 disabled:opacity-30"
          >
            ↶
          </button>
          <button
            title="Redo (Ctrl+Shift+Z)"
            onClick={redo}
            disabled={futureRef.current.length === 0}
            className="grid h-9 w-9 place-items-center rounded-lg text-lg hover:bg-white/15 disabled:opacity-30"
          >
            ↷
          </button>
        </div>
        <button
          onClick={() => void save()}
          className={`hidden text-xs lg:block ${status === "error" ? "font-bold text-amber-200 underline" : "text-white/80"}`}
        >
          {statusLabel}
        </button>
        <div className="ml-auto flex items-center gap-2">
          {isAdminUser ? (
            <button
              onClick={() => setShowPublish(true)}
              className="rounded-full bg-gold-400 px-3 py-1.5 text-sm font-bold text-maroon-900 shadow hover:bg-gold-300 sm:px-4"
              title="Super admin: save into the official template library"
            >
              <span className="sm:hidden">★</span>
              <span className="hidden sm:inline">★ {adminTpl ? `Save template “${adminTpl.title.slice(0, 18)}”` : "Save as official template"}</span>
            </button>
          ) : (
            <button
              onClick={() => setShowPublish(true)}
              className="hidden rounded-full border border-white/40 px-4 py-1.5 text-sm font-semibold hover:bg-white/15 md:block"
            >
              ★ Publish as template
            </button>
          )}
          <button
            onClick={() => {
              setSelectedId(null);
              setEditingId(null);
              setAnimate(true);
            }}
            className="btn-shine rounded-full bg-white/10 px-3 py-1.5 text-sm font-bold text-gold-100 ring-1 ring-gold-400/50 transition hover:bg-white/20 sm:px-4"
            title="Animate this card into a short clip"
          >
            <span className="sm:hidden">✨</span>
            <span className="hidden sm:inline">✨ Animate</span>
          </button>
          <Popover
            alignRight
            width={220}
            className="!h-9 !bg-gold-400 !px-3 !font-semibold !text-maroon-900 hover:!bg-gold-300 sm:!px-4"
            trigger={<span><span className="sm:hidden">⬇</span><span className="hidden sm:inline">⬇ Download</span></span>}
          >
            <div className="grid gap-1">
              {(
                [
                  ["png", "PNG – best quality", "Transparent-safe, HD"],
                  ["jpg", "JPG – smaller file", "Great for WhatsApp"],
                  ["pdf", "PDF – for printing", "Opens print dialog"],
                ] as const
              ).map(([f, l, s]) => (
                <button key={f} onClick={() => void download(f)} className="rounded-lg px-3 py-2 text-left hover:bg-violet-50">
                  <span className="block text-sm font-semibold text-slate-800">{l}</span>
                  <span className="block text-xs text-slate-500">{s}</span>
                </button>
              ))}
              <button
                onClick={() => {
                  setSelectedId(null);
                  setAnimate(true);
                }}
                className="rounded-lg bg-gold-50 px-3 py-2 text-left ring-1 ring-gold-200 hover:bg-gold-100"
              >
                <span className="block text-sm font-semibold text-maroon-800">✨ Animate this card – 6–30 s clip</span>
                <span className="block text-xs text-slate-500">Elements appear one by one · WhatsApp status</span>
              </button>
              <button
                onClick={() => void openVideoStudio()}
                className="rounded-lg bg-gradient-to-r from-rose-50 to-orange-50 px-3 py-2 text-left ring-1 ring-rose-200 hover:from-rose-100 hover:to-orange-100"
              >
                <span className="block text-sm font-semibold text-rose-700">🎬 Video Studio – effects & motion</span>
                <span className="block text-xs text-slate-500">
                  {pages.length > 1 ? `${pages.length} pages → slideshow` : "Animated card, ~5 sec"}
                </span>
              </button>
            </div>
          </Popover>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* rail (desktop) */}
        <nav className="z-20 hidden w-[72px] shrink-0 flex-col items-stretch gap-1 bg-maroon-900 py-2 md:flex">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab((cur) => (cur === t.id ? null : t.id))}
              className={`mx-1.5 flex flex-col items-center gap-0.5 rounded-xl py-2 text-[11px] font-medium transition ${
                tab === t.id ? "bg-gold-400/20 text-gold-100" : "text-maroon-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-lg leading-none">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        {/* panel: sidebar on desktop, bottom-sheet on mobile */}
        {tab && (
          <aside
            className="fixed inset-x-0 bottom-[60px] z-30 flex max-h-[62vh] flex-col rounded-t-2xl border-t border-slate-200 bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.18)] md:static md:z-10 md:max-h-none md:w-[320px] md:shrink-0 md:rounded-none md:border-r md:border-t-0 md:shadow-none"
          >
            <div className="flex h-12 items-center justify-between border-b border-slate-100 px-4">
              <div className="mx-auto h-1 w-10 rounded-full bg-slate-300 md:hidden" aria-hidden />
              <h2 className="text-sm font-bold">{TABS.find((t) => t.id === tab)?.label}</h2>
              <button onClick={() => setTab(null)} className="rounded-md px-2 py-1 text-slate-400 hover:bg-slate-100" title="Close panel">
                <span className="hidden md:inline">‹</span>
                <span className="md:hidden">✕</span>
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {tab === "templates" && <TemplatesPanel api={api} />}
              {tab === "art" && <ArtPanel api={api} />}
              {tab === "elements" && <ElementsPanel api={api} />}
              {tab === "text" && <TextPanel api={api} />}
              {tab === "photos" && <PhotosPanel api={api} />}
              {tab === "background" && <BackgroundPanel api={api} />}
              {tab === "layers" && <LayersPanel api={api} />}
              {tab === "resize" && <ResizePanel api={api} />}
            </div>
          </aside>
        )}

        {/* canvas column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Toolbar
            doc={doc}
            sel={sel}
            update={(patch, key) => sel && updateEl(sel.id, patch, key)}
            setBackground={setBackground}
            reorder={(dir) => sel && reorder(sel.id, dir)}
            duplicate={() => sel && duplicateEl(sel)}
            remove={() => sel && deleteEl(sel.id)}
            replaceImage={() => replaceRef.current?.click()}
            startEdit={() => sel && startEdit(sel.id)}
          />
          <input
            ref={replaceRef}
            type="file"
            accept="image/*"
            hidden
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f && sel?.type === "image") updateEl(sel.id, { src: await readImage(f) });
              e.target.value = "";
            }}
          />

          <div
            ref={areaRef}
            className="relative min-h-0 flex-1 overflow-auto bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:22px_22px]"
            onPointerDown={(e) => {
              if (!(e.target as HTMLElement).closest("[data-stage]")) {
                setSelectedId(null);
                setEditingId(null);
              }
            }}
          >
            <div className="flex min-h-full min-w-full flex-col items-center p-4 pb-24 md:p-10">
              <div className="m-auto" style={{ width: doc.width * scale, height: doc.height * scale }}>
                <div
                  data-stage
                  className="relative shadow-2xl"
                  style={{
                    width: doc.width * scale,
                    height: doc.height * scale,
                    ...({ "--s": scale } as CSSProperties),
                  }}
                >
                  <div
                    style={{
                      width: doc.width,
                      height: doc.height,
                      transform: `scale(${scale})`,
                      transformOrigin: "0 0",
                      position: "absolute",
                      left: 0,
                      top: 0,
                    }}
                  >
                    {/* design layer */}
                    <div
                      style={{ position: "absolute", inset: 0, overflow: "hidden", background: doc.background }}
                      onPointerDown={(e) => {
                        if (e.target === e.currentTarget) {
                          setSelectedId(null);
                          setEditingId(null);
                        }
                      }}
                    >
                      {doc.elements.map((el) => {
                        const editing = editingId === el.id && el.type === "text";
                        return (
                          <div
                            key={el.id}
                            id={`el-${el.id}`}
                            className="cc-el"
                            style={{
                              ...wrapperStyle(el, doc),
                              cursor: editing ? "text" : el.locked ? "default" : "move",
                              touchAction: "none",
                            }}
                            onPointerDown={(e) => {
                              if (e.button !== 0 || editing) return;
                              e.stopPropagation();
                              setSelectedId(el.id);
                              if (editingId) setEditingId(null);
                              // empty photo frame → immediately let the user pick a picture
                              if (el.type === "image" && !el.src && !el.locked) {
                                replaceRef.current?.click();
                                return;
                              }
                              if (!el.locked) startMove(e, el);
                            }}
                            onDoubleClick={() => {
                              if (el.type === "image" && !el.locked) replaceRef.current?.click();
                              else if (el.type === "text" && !el.locked) startEdit(el.id);
                            }}
                          >
                            {editing && el.type === "text" ? (
                              <textarea
                                ref={taRef}
                                autoFocus
                                rows={1}
                                value={el.text}
                                onFocus={(e) => e.currentTarget.select()}
                                onChange={(e) => liveUpdate(el.id, { text: e.target.value })}
                                onBlur={() => {
                                  setEditingId(null);
                                  if (!el.text.trim()) deleteEl(el.id);
                                }}
                                onKeyDown={(e) => {
                                  e.stopPropagation();
                                  if (e.key === "Escape") e.currentTarget.blur();
                                }}
                                onPointerDown={(e) => e.stopPropagation()}
                                style={{
                                  ...textStyle(el, u),
                                  background: "transparent",
                                  border: 0,
                                  outline: 0,
                                  resize: "none",
                                  overflow: "hidden",
                                  padding: 0,
                                  display: "block",
                                  height: "auto",
                                }}
                              />
                            ) : (
                              <ElementBody el={el} u={u} />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* overlay layer */}
                    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                      {guides.v.map((x) => (
                        <div key={`v${x}`} style={{ position: "absolute", left: x, top: 0, bottom: 0, width: 1 / scale, background: "#ec4899" }} />
                      ))}
                      {guides.h.map((y) => (
                        <div key={`h${y}`} style={{ position: "absolute", top: y, left: 0, right: 0, height: 1 / scale, background: "#ec4899" }} />
                      ))}
                      {sel && (
                        <div
                          style={{
                            position: "absolute",
                            left: sel.x,
                            top: sel.y,
                            width: sel.w,
                            height: selHeight,
                            transform: sel.rotation ? `rotate(${sel.rotation}deg)` : undefined,
                            transformOrigin: "center center",
                            outline: `${2 / scale}px ${sel.locked ? "dashed" : "solid"} #7c3aed`,
                            pointerEvents: "none",
                          }}
                        >
                          {!sel.locked && !editingId && (
                            <>
                              {HANDLES.filter((hd) => {
                                if (sel.type === "text") return hd.dy === 0 || (hd.dx !== 0 && hd.dy !== 0);
                                if (sel.type === "shape" && sel.shape === "line") return hd.dy === 0;
                                return true;
                              }).map((hd) => (
                                <div
                                  key={`${hd.dx}${hd.dy}`}
                                  onPointerDown={(e) => startResize(e, sel, hd.dx, hd.dy)}
                                  style={{
                                    position: "absolute",
                                    left: `${50 + hd.dx * 50}%`,
                                    top: `${50 + hd.dy * 50}%`,
                                    width: hd.dx === 0 ? hs * 1.8 : hs,
                                    height: hd.dy === 0 ? hs * 1.8 : hs,
                                    transform: "translate(-50%,-50%)",
                                    background: "#fff",
                                    border: `${bw}px solid #7c3aed`,
                                    borderRadius: (hd.dx !== 0 && hd.dy !== 0 ? 3 : hs) / scale / 2.2,
                                    pointerEvents: "auto",
                                    cursor: hd.cursor,
                                    touchAction: "none",
                                  }}
                                />
                              ))}
                              <div
                                onPointerDown={(e) => startRotate(e, sel)}
                                title="Rotate (hold Shift to snap)"
                                style={{
                                  position: "absolute",
                                  left: "50%",
                                  top: -38 / scale,
                                  width: hs * 1.3,
                                  height: hs * 1.3,
                                  transform: "translate(-50%,-50%)",
                                  background: "#fff",
                                  border: `${bw}px solid #7c3aed`,
                                  borderRadius: "50%",
                                  pointerEvents: "auto",
                                  cursor: "grab",
                                  display: "grid",
                                  placeItems: "center",
                                  fontSize: hs * 0.9,
                                  lineHeight: 1,
                                  color: "#7c3aed",
                                  touchAction: "none",
                                }}
                              >
                                ↻
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Canva-style page strip: thumbnails + add-page button ── */}
              <div className="mt-5 flex w-full max-w-4xl flex-col items-center gap-3" onPointerDown={(e) => e.stopPropagation()}>
                {pages.length > 1 && (
                  <div className="flex max-w-full items-center gap-2 overflow-x-auto rounded-2xl bg-white/90 p-2 ring-1 ring-slate-200">
                    {pages.map((pg, i) => (
                      <div key={pg.id} className="group relative shrink-0">
                        <button
                          type="button"
                          onClick={() => goToPage(i)}
                          className={`block overflow-hidden rounded-lg ring-2 transition ${
                            i === activePage ? "ring-violet-600" : "ring-slate-200 hover:ring-violet-300"
                          }`}
                          style={{ width: 56 }}
                          title={`Page ${i + 1}`}
                        >
                          <PageView doc={doc} page={i === activePage ? { ...pg, elements: doc.elements, background: doc.background } : pg} />
                        </button>
                        <span className="pointer-events-none absolute left-1 top-1 rounded bg-black/60 px-1 text-[10px] font-bold text-white">
                          {i + 1}
                        </span>
                        <div className="absolute -bottom-1 left-1/2 hidden -translate-x-1/2 items-center gap-0.5 rounded-md bg-slate-900 px-1 py-0.5 shadow group-hover:flex">
                          <button onClick={() => movePage(i, -1)} disabled={i === 0} className="px-1 text-[11px] text-white disabled:opacity-30" title="Move left">◀</button>
                          <button onClick={() => { goToPage(i); duplicatePage(); }} className="px-1 text-[11px] text-white" title="Duplicate">⧉</button>
                          <button onClick={() => deletePage(i)} disabled={pages.length <= 1} className="px-1 text-[11px] text-rose-300 disabled:opacity-30" title="Delete">✕</button>
                          <button onClick={() => movePage(i, 1)} disabled={i === pages.length - 1} className="px-1 text-[11px] text-white disabled:opacity-30" title="Move right">▶</button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setShowAddPage(true)}
                      className="grid h-[72px] w-14 shrink-0 place-items-center rounded-lg border-2 border-dashed border-violet-300 text-2xl text-violet-600 transition hover:border-violet-500 hover:bg-violet-50"
                      title="Add page"
                    >
                      +
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowAddPage(true)}
                  className="group flex items-center gap-2 rounded-full border-2 border-dashed border-gold-400 bg-white px-5 py-2.5 text-sm font-semibold text-maroon-700 shadow-sm transition hover:border-gold-500 hover:bg-gold-50"
                  title="Add a page below this one"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-maroon-700 text-base leading-none text-white transition group-hover:scale-110">
                    +
                  </span>
                  Add page
                  <span className="text-xs font-normal text-slate-400">· blank or another template</span>
                </button>
              </div>
            </div>
          </div>

          {/* bottom bar (desktop) */}
          <div className="hidden h-11 shrink-0 items-center gap-3 border-t border-slate-200 bg-white px-4 text-xs text-slate-600 md:flex">
            <span className="hidden md:inline">
              {doc.width} × {doc.height}px · {doc.elements.length} layers
            </span>
            {pages.length > 1 && (
              <span className="flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 font-semibold text-violet-700">
                <button onClick={() => goToPage(activePage - 1)} disabled={activePage === 0} className="px-1 disabled:opacity-30">‹</button>
                Page {activePage + 1} / {pages.length}
                <button onClick={() => goToPage(activePage + 1)} disabled={activePage === pages.length - 1} className="px-1 disabled:opacity-30">›</button>
              </span>
            )}
            <span className="hidden text-slate-400 lg:inline">Tips: double-click text to type · Shift+arrows nudge · Alt disables snapping</span>
            <div className="ml-auto flex items-center gap-2">
              <Btn title="Zoom out" onClick={() => setZoom((z) => Math.max(0.25, +(z - 0.15).toFixed(2)))}>
                −
              </Btn>
              <input
                type="range"
                min={0.25}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-32 accent-violet-600"
              />
              <Btn title="Zoom in" onClick={() => setZoom((z) => Math.min(3, +(z + 0.15).toFixed(2)))}>
                +
              </Btn>
              <span className="w-10 text-right tabular-nums">{Math.round(scale * 100)}%</span>
              <Btn title="Fit to screen" onClick={() => setZoom(1)}>
                Fit
              </Btn>
            </div>
          </div>
        </div>
      </div>

      {/* mobile bottom tab bar (Canva-app style) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-[60px] items-stretch border-t border-slate-200 bg-white md:hidden">
        <div className="flex w-full items-stretch overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab((cur) => (cur === t.id ? null : t.id))}
              className={`flex min-w-[72px] flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition ${
                tab === t.id ? "text-maroon-700" : "text-ink-muted"
              }`}
            >
              <span className={`grid h-7 w-7 place-items-center rounded-lg text-base leading-none ${tab === t.id ? "bg-gold-100" : ""}`}>
                {t.icon}
              </span>
              <span className="whitespace-nowrap">{t.label === "Background" ? "Backdrop" : t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* offscreen export render */}
      {exporting && (
        <div ref={exportRef} style={{ position: "fixed", left: -30000, top: 0, pointerEvents: "none" }}>
          {pagesOf(docRef.current).map((pg) => (
            <div key={pg.id} data-export-page style={{ marginBottom: 20 }}>
              <PageView doc={doc} page={pg} mode="px" />
            </div>
          ))}
        </div>
      )}
      {exporting && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-900/50 backdrop-blur-sm">
          <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-2xl">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
            <p className="font-semibold">{exporting === "VIDEO" ? `🎬 Preparing pages… ${videoPct}%` : `Preparing your ${exporting}${pages.length > 1 ? ` · ${pages.length} pages` : ""}…`}</p>
            <p className="text-xs text-slate-500">Rendering in high quality</p>
          </div>
        </div>
      )}

      {showAddPage && (
        <AddPageModal
          category={category}
          onBlank={() => addPage()}
          onDuplicate={duplicatePage}
          onTemplate={(d) => addPage(d)}
          onClose={() => setShowAddPage(false)}
        />
      )}

      {animate && (
        <AnimatePanel
          doc={doc}
          page={{ ...pages[activePage], elements: doc.elements, background: doc.background }}
          fileName={`${(titleRef.current || "card").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "card"}-animated`}
          initial={(docRef.current.animate as AnimateSettings | undefined) ?? undefined}
          onChange={(a) => {
            const next = { ...docRef.current, animate: a };
            docRef.current = next;
            setDoc(next);
            markDirty();
          }}
          onClose={() => setAnimate(false)}
        />
      )}

      {studio && (
        <VideoStudio
          images={studio.images}
          pageIds={studio.ids}
          pageNames={studio.names}
          fileName={(titleRef.current || "design").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "design"}
          shareText={titleRef.current}
          initial={(docRef.current.video as VideoSettings | undefined) ?? undefined}
          onChange={(vs) => {
            // persist effect choices with the design (no history entry)
            const next = { ...docRef.current, video: vs };
            docRef.current = next;
            setDoc(next);
            markDirty();
          }}
          onClose={() => setStudio(null)}
        />
      )}

      {showPublish && (
        <PublishModal
          initialTitle={adminTpl?.title ?? title}
          category={adminTpl?.category ?? category}
          getDoc={() => docRef.current}
          onClose={() => setShowPublish(false)}
          admin={isAdminUser}
          existing={adminTpl}
        />
      )}
    </div>
  );
}

function fallbackSize(d: Doc) {
  return Math.min(d.width, d.height) * 0.5;
}


/* ───────── "+ Add page" picker (Canva-style) ───────── */
function AddPageModal({
  category,
  onBlank,
  onDuplicate,
  onTemplate,
  onClose,
}: {
  category: string;
  onBlank: () => void;
  onDuplicate: () => void;
  onTemplate: (d: Doc) => void;
  onClose: () => void;
}) {
  const [cat, setCat] = useState<string>(category);
  const [rows, setRows] = useState<{ slug: string; title: string; data: Doc }[] | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    let alive = true;
    setRows(null);
    const params = new URLSearchParams();
    if (cat) params.set("category", cat);
    if (q.trim()) params.set("q", q.trim());
    fetch(`/api/templates?${params.toString()}`)
      .then((r) => r.json())
      .then((j: { templates: { slug: string; title: string; data: Doc }[] }) => alive && setRows(j.templates))
      .catch(() => alive && setRows([]));
    return () => {
      alive = false;
    };
  }, [cat, q]);

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-900/50 p-4 backdrop-blur-sm" onPointerDown={onClose}>
      <div
        className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-extrabold">Add a page</h3>
            <p className="text-xs text-slate-500">New page will be added right after the current one.</p>
          </div>
          <button onClick={onClose} className="rounded-lg px-3 py-1.5 text-slate-500 hover:bg-slate-100">✕</button>
        </div>

        <div className="grid gap-3 border-b border-slate-100 bg-slate-50 px-6 py-4 sm:grid-cols-2">
          <button
            onClick={onBlank}
            className="flex items-center gap-3 rounded-xl border-2 border-dashed border-violet-300 bg-white p-4 text-left transition hover:border-violet-500 hover:bg-violet-50"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-violet-100 text-2xl text-violet-700">＋</span>
            <span>
              <span className="block text-sm font-bold text-slate-900">Blank page</span>
              <span className="block text-xs text-slate-500">Start empty, same size as this design</span>
            </span>
          </button>
          <button
            onClick={onDuplicate}
            className="flex items-center gap-3 rounded-xl border-2 border-slate-200 bg-white p-4 text-left transition hover:border-violet-400 hover:bg-violet-50"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber-100 text-2xl text-amber-700">⧉</span>
            <span>
              <span className="block text-sm font-bold text-slate-900">Duplicate this page</span>
              <span className="block text-xs text-slate-500">Copy, then just change the event details</span>
            </span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-6 pt-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Or pick a template</span>
          <div className="ml-auto flex flex-wrap gap-1.5">
            {[{ slug: "", name: "All" }, ...CATEGORIES].map((c) => (
              <button
                key={c.slug}
                onClick={() => setCat(c.slug)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  cat === c.slug ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-violet-400 sm:w-48"
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {!rows && <p className="text-sm text-slate-400">Loading templates…</p>}
          {rows && rows.length === 0 && <p className="text-sm text-slate-400">No templates found.</p>}
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
            {rows?.map((t) => (
              <button key={t.slug} onClick={() => onTemplate(t.data)} className="group text-left" title={t.title}>
                <div className="overflow-hidden rounded-xl bg-slate-100 p-1.5 ring-1 ring-slate-200 transition group-hover:ring-violet-500">
                  <div className="flex aspect-[4/5] items-center justify-center">
                    <div style={{ width: `${Math.min(100, (t.data.width / t.data.height / 0.8) * 100)}%` }}>
                      <DesignView doc={t.data} />
                    </div>
                  </div>
                </div>
                <p className="mt-1 truncate text-[11px] text-slate-600">{t.title}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PublishModal({
  initialTitle,
  category,
  getDoc,
  onClose,
  admin = false,
  existing = null,
}: {
  initialTitle: string;
  category: string;
  getDoc: () => Doc;
  onClose: () => void;
  admin?: boolean;
  existing?: { slug: string; title: string; category: string; tags: string[]; featured: boolean } | null;
}) {
  const [name, setName] = useState(initialTitle === "Untitled design" ? "" : initialTitle);
  const [cat, setCat] = useState(category);
  const [tags, setTags] = useState(existing?.tags.join(", ") ?? "");
  const [featured, setFeatured] = useState(existing?.featured ?? true);
  const [saveMode, setSaveMode] = useState<"overwrite" | "new">(existing ? "overwrite" : "new");
  const [busy, setBusy] = useState(false);
  const [slug, setSlug] = useState<string | null>(null);
  const [err, setErr] = useState("");

  async function publish() {
    if (!name.trim()) {
      setErr("Please give your template a name.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const payload = {
        title: name,
        category: cat,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        data: getDoc(),
      };
      const r = admin
        ? await fetch("/api/admin/templates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...payload,
              featured,
              slug: saveMode === "overwrite" && existing ? existing.slug : undefined,
            }),
          })
        : await fetch("/api/templates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      const j = (await r.json()) as { template?: { slug: string }; error?: string };
      if (!r.ok || !j.template) throw new Error(j.error ?? "Failed");
      setSlug(j.template.slug);
    } catch (e) {
      setErr((e as Error).message);
    }
    setBusy(false);
  }

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-900/50 p-4 backdrop-blur-sm" onPointerDown={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onPointerDown={(e) => e.stopPropagation()}>
        {slug ? (
          <div className="text-center">
            <div className="text-5xl">🎉</div>
            <h3 className="mt-3 text-xl font-extrabold">{admin ? "Template saved to the library!" : "Template published!"}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {admin ? "It is live on the site now (official template)." : "Anyone can now find and customize your design."}
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <a href={`/templates/${slug}`} target="_blank" className="rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white">
                View template
              </a>
              <button onClick={onClose} className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold">
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-extrabold">{admin ? "★ Save as official template" : "Publish as template"}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {admin ? "Super admin — this goes straight into the public library." : "Share this design in the template library."}
            </p>
            {admin && existing && (
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-1 text-sm">
                <button
                  type="button"
                  onClick={() => setSaveMode("overwrite")}
                  className={`rounded-lg px-3 py-2 font-semibold ${saveMode === "overwrite" ? "bg-slate-900 text-white" : "text-slate-600"}`}
                >
                  Overwrite “{existing.title.slice(0, 16)}”
                </button>
                <button
                  type="button"
                  onClick={() => setSaveMode("new")}
                  className={`rounded-lg px-3 py-2 font-semibold ${saveMode === "new" ? "bg-slate-900 text-white" : "text-slate-600"}`}
                >
                  Save as new
                </button>
              </div>
            )}
            <label className="mt-4 block text-sm font-medium">
              Template name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-violet-400"
                placeholder="e.g. Royal Blue Shaadi Card"
              />
            </label>
            <label className="mt-3 block text-sm font-medium">
              Category
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-violet-400"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-3 block text-sm font-medium">
              Tags <span className="font-normal text-slate-400">(comma separated)</span>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-violet-400"
                placeholder="Modern, Gold, Floral"
              />
            </label>
            {admin && (
              <label className="mt-3 flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-violet-600" />
                ⭐ Featured (show on home page)
              </label>
            )}
            {err && <p className="mt-3 text-sm text-rose-600">{err}</p>}
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={onClose} className="rounded-full px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button
                disabled={busy}
                onClick={() => void publish()}
                className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {busy ? "Publishing…" : "Publish"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
