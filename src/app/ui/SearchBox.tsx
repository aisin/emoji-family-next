"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";
import type { SupportedLanguage } from "@/app/lib/i18n";
import { validateSearchQuery } from "@/app/lib/validation";
import { uiText } from "@/app/lib/ui-strings";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Input } from "@/app/ui/shadcn/input";
import { Button } from "@/app/ui/shadcn/button";
import { RECENT_SEARCH_LIMIT } from "@/app/lib/search-config";

export default function SearchBox({
  lang,
  placeholder,
  autoFocus = false,
  withSubmitButton = true,
  dropdownStrategy = "absolute",
}: {
  lang: SupportedLanguage;
  placeholder: string;
  autoFocus?: boolean;
  withSubmitButton?: boolean;
  dropdownStrategy?: "absolute" | "fixed" | "portal";
}) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const t = uiText(lang);

  // Web Worker for suggestions (lazy init)
  const workerRef = useRef<Worker | null>(null);
  const debounceRef = useRef<number | null>(null);
  const [suggestions, setSuggestions] = useState<{
    emoji: string;
    name: string;
    unicode: string;
    short_code?: string;
    category?: string;
  }[]>([]);
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const [open, setOpen] = useState<boolean>(false);
  const listboxId = "searchbox-suggestions";
  const formRef = useRef<HTMLFormElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [listMaxHeight, setListMaxHeight] = useState<number | null>(null);
  const [dropdownRect, setDropdownRect] = useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const w = new Worker(new URL("../workers/searchWorker.ts", import.meta.url), { type: "module" });
    workerRef.current = w;
    type WorkerMsg = { type: "ready" } | { type: "results"; results: { emoji: string; name: string; unicode: string }[] };
    w.onmessage = (ev: MessageEvent<WorkerMsg>) => {
      if (ev.data.type === "results") {
        setSuggestions(ev.data.results ?? []);
      }
    };
    w.postMessage({ type: "init", lang });
    return () => {
      w.terminate();
      workerRef.current = null;
    };
  }, [lang]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const root = formRef.current;
      if (!root) return;
      if (e.target && root.contains(e.target as Node)) return;
      setOpen(false);
      setActiveIdx(-1);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Keep suggestion list within viewport height; recompute when open/resize/scroll
  useEffect(() => {
    if (!open) {
      setListMaxHeight(null);
      setDropdownRect(null);
      return;
    }
    const compute = () => {
      try {
        const el = inputRef.current ?? formRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const margin = 12; // px spacing below dropdown
        const space = Math.max(0, window.innerHeight - rect.bottom - margin);
        setListMaxHeight(space);
        if (dropdownStrategy !== "absolute") {
          setDropdownRect({ left: rect.left, top: rect.bottom + 8 /* mt-2 */, width: rect.width });
        }
      } catch {}
    };
    compute();
    const handler = () => compute();
    window.addEventListener("resize", handler);
    window.addEventListener("scroll", handler, true);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("scroll", handler, true);
    };
  }, [open, dropdownStrategy]);

  // Also recompute when suggestions update while open
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      try {
        const el = inputRef.current ?? formRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const margin = 12;
        const space = Math.max(0, window.innerHeight - rect.bottom - margin);
        setListMaxHeight(space);
        if (dropdownStrategy !== "absolute") {
          setDropdownRect({ left: rect.left, top: rect.bottom + 8, width: rect.width });
        }
      } catch {}
    }, 0);
    return () => window.clearTimeout(id);
  }, [open, suggestions.length, dropdownStrategy]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!validateSearchQuery(q)) return;
        // persist recent searches
        try {
          const KEY = "emoji_recent_searches";
          const raw = window.localStorage.getItem(KEY);
          const arr = raw ? (JSON.parse(raw) as string[]) : [];
          const next = [q, ...(Array.isArray(arr) ? arr : [])].filter(Boolean);
          const dedup: string[] = [];
          for (const item of next) {
            const v = item.trim();
            if (!v) continue;
            if (!dedup.includes(v)) dedup.push(v);
            if (dedup.length >= RECENT_SEARCH_LIMIT) break;
          }
          window.localStorage.setItem(KEY, JSON.stringify(dedup));
        } catch {}
        const target = suggestions[activeIdx]?.unicode || suggestions[0]?.unicode;
        if (target) {
          router.push(`/${lang}/emoji/${encodeURIComponent(target)}`);
        } else {
          router.push(`/${lang}`);
        }
        setOpen(false);
      }}
      ref={formRef}
      className="relative flex items-center gap-3 w-full"
      role="search"
    >
      <label htmlFor="search-input" className="sr-only">{t.search.title}</label>
      <Input
        ref={inputRef}
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={open && q.trim().length >= 2 && suggestions.length > 0}
        aria-activedescendant={activeIdx >= 0 ? `suggestion-${activeIdx}` : undefined}
        aria-autocomplete="list"
        id="search-input"
        onBlur={() => {
          // Slight delay to allow click events (e.g., on suggestion links)
          window.setTimeout(() => {
            const root = formRef.current;
            const active = document.activeElement as Element | null;
            if (!root || (active && root.contains(active))) return;
            setOpen(false);
            setActiveIdx(-1);
          }, 120);
        }}
        onFocus={() => setOpen(true)}
        value={q}
        onChange={(e) => {
          const val = e.target.value;
          setQ(val);
          setActiveIdx(-1);
          setOpen(true);
          if (!workerRef.current) return;
          if (debounceRef.current) window.clearTimeout(debounceRef.current);
          debounceRef.current = window.setTimeout(() => {
            workerRef.current?.postMessage({ type: "query", q: val });
          }, 200);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            setOpen(false);
            setActiveIdx(-1);
            return;
          }
          if (!suggestions.length || !open) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIdx((idx) => (idx + 1) % suggestions.length);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIdx((idx) => (idx - 1 + suggestions.length) % suggestions.length);
          } else if (e.key === "Enter" && activeIdx >= 0) {
            e.preventDefault();
            const s = suggestions[activeIdx];
            if (s) router.push(`/${lang}/emoji/${encodeURIComponent(s.unicode)}`);
          }
        }}
        placeholder={placeholder}
        className="w-full"
        aria-label={t.search.title}
        autoComplete="off"
        inputMode="search"
        autoFocus={autoFocus}
      />
      {withSubmitButton && (
        <Button type="submit" aria-label="Search">
          搜索
        </Button>
      )}

      {open && q.trim().length >= 2 && suggestions.length > 0 && (
        dropdownStrategy === "portal" && mounted && dropdownRect ? (
          createPortal(
            <div
              className="fixed z-[9999] max-w-[100vw] pointer-events-auto"
              style={{ left: dropdownRect.left, top: dropdownRect.top, width: dropdownRect.width }}
            >
              <ul
                id={listboxId}
                role="listbox"
                className="bg-popover text-popover-foreground border border-border rounded-md shadow divide-y divide-border overflow-y-auto overflow-x-hidden max-w-full"
                style={listMaxHeight != null ? { maxHeight: `${listMaxHeight}px` } : undefined}
              >
                {suggestions.map((s, i) => {
                  const active = i === activeIdx;
                  return (
                    <li key={s.unicode} role="option" aria-selected={active} id={`suggestion-${i}`}>
                      <Link
                        prefetch={false}
                        href={`/${lang}/emoji/${encodeURIComponent(s.unicode)}`}
className={`flex flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 px-3 py-2 w-full max-w-full overflow-hidden ${active ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
                        aria-label={`${t.search.view_details_aria(s.name)}`}
                        onMouseEnter={() => setActiveIdx(i)}
                        onClick={() => { setOpen(false); setActiveIdx(-1); }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-2xl flex-shrink-0">{s.emoji}</span>
                          <span className="text-sm truncate min-w-0">
                            <span className="font-medium">{s.name}</span>
                            <span className="text-muted-foreground ml-2">{s.unicode}</span>
                          </span>
                        </div>
                        {(s.short_code || s.category) && (
                          <div className="w-full sm:w-auto mt-1 sm:mt-0 sm:ml-4 text-xs text-muted-foreground text-left sm:text-right min-w-0 break-words">
                            {s.short_code && <div className="break-words">{s.short_code}</div>}
                            {s.category && (
<div className="break-words">{s.category.replace(/^\p{Extended_Pictographic}\s*/u, "")}</div>
                            )}
                          </div>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>,
            document.body
          )
        ) : dropdownStrategy === "fixed" ? (
          <div
            className="fixed z-[100] max-w-[100vw] left-0 top-0 pointer-events-auto"
            style={{ left: dropdownRect?.left ?? 0, top: dropdownRect?.top ?? 0, width: dropdownRect?.width ?? undefined }}
          >
            <ul
              id={listboxId}
              role="listbox"
              className="bg-popover text-popover-foreground border border-border rounded-md shadow divide-y divide-border overflow-y-auto overflow-x-hidden max-w-full"
              style={listMaxHeight != null ? { maxHeight: `${listMaxHeight}px` } : undefined}
            >
              {suggestions.map((s, i) => {
                const active = i === activeIdx;
                return (
                  <li key={s.unicode} role="option" aria-selected={active} id={`suggestion-${i}`}>
                    <Link
                      prefetch={false}
                      href={`/${lang}/emoji/${encodeURIComponent(s.unicode)}`}
className={`flex flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 px-3 py-2 w-full max-w-full overflow-hidden ${active ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
                      aria-label={`${t.search.view_details_aria(s.name)}`}
                      onMouseEnter={() => setActiveIdx(i)}
                      onClick={() => { setOpen(false); setActiveIdx(-1); }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl flex-shrink-0">{s.emoji}</span>
                        <span className="text-sm truncate min-w-0">
                          <span className="font-medium">{s.name}</span>
                          <span className="text-muted-foreground ml-2">{s.unicode}</span>
                        </span>
                      </div>
                      {(s.short_code || s.category) && (
                        <div className="w-full sm:w-auto mt-1 sm:mt-0 sm:ml-4 text-xs text-muted-foreground text-left sm:text-right min-w-0 break-words">
                          {s.short_code && <div className="break-words">{s.short_code}</div>}
                          {s.category && (
<div className="break-words">{s.category.replace(/^\p{Extended_Pictographic}\s*/u, "")}</div>
                          )}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="absolute left-0 right-0 top-full mt-2 z-[100] max-w-[100vw]">
            <ul
              id={listboxId}
              role="listbox"
              className="bg-popover text-popover-foreground border border-border rounded-md shadow divide-y divide-border overflow-y-auto overflow-x-hidden max-w-full"
              style={listMaxHeight != null ? { maxHeight: `${listMaxHeight}px` } : undefined}
            >
              {suggestions.map((s, i) => {
                const active = i === activeIdx;
                return (
                  <li key={s.unicode} role="option" aria-selected={active} id={`suggestion-${i}`}>
                    <Link
                      prefetch={false}
                      href={`/${lang}/emoji/${encodeURIComponent(s.unicode)}`}
                      className={`flex flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 px-3 py-2 w-full max-w-full overflow-hidden ${active ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
                      aria-label={`${t.search.view_details_aria(s.name)}`}
                      onMouseEnter={() => setActiveIdx(i)}
                      onClick={() => { setOpen(false); setActiveIdx(-1); }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl flex-shrink-0">{s.emoji}</span>
                        <span className="text-sm truncate min-w-0">
                          <span className="font-medium">{s.name}</span>
                          <span className="text-muted-foreground ml-2">{s.unicode}</span>
                        </span>
                      </div>
                      {(s.short_code || s.category) && (
                        <div className="w-full sm:w-auto mt-1 sm:mt-0 sm:ml-4 text-xs text-muted-foreground text-left sm:text-right min-w-0 break-words">
                          {s.short_code && <div className="break-words">{s.short_code}</div>}
                          {s.category && (
                            <div className="break-words">{s.category.replace(/^\p{Extended_Pictographic}\s*/u, "")}</div>
                          )}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )
      )}
    </form>
  );
}

