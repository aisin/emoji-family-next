"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SupportedLanguage } from "@/app/lib/i18n";
import { validateSearchQuery } from "@/app/lib/validation";
import { uiText } from "@/app/lib/ui-strings";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Input } from "@/app/ui/shadcn/input";
import { Button } from "@/app/ui/shadcn/button";

export default function SearchBox({
  lang,
  placeholder,
}: {
  lang: SupportedLanguage;
  placeholder: string;
}) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const t = uiText(lang);

  // Web Worker for suggestions (lazy init)
  const workerRef = useRef<Worker | null>(null);
  const debounceRef = useRef<number | null>(null);
  const [suggestions, setSuggestions] = useState<{ emoji: string; name: string; unicode: string }[]>([]);
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const [open, setOpen] = useState<boolean>(false);
  const listboxId = "searchbox-suggestions";

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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!validateSearchQuery(q)) return;
        const params = new URLSearchParams({ q });
        router.push(`/${lang}/search?${params.toString()}`);
      }}
      className="relative flex items-center gap-3"
      role="search"
    >
      <label htmlFor="search-input" className="sr-only">{t.search.title}</label>
      <Input
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={open && q.trim().length >= 2 && suggestions.length > 0}
        aria-activedescendant={activeIdx >= 0 ? `suggestion-${activeIdx}` : undefined}
        aria-autocomplete="list"
        id="search-input"
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
        className="w-full md:w-96"
        aria-label={t.search.title}
        autoComplete="off"
        inputMode="search"
      />
      <Button type="submit" aria-label="Search">
        搜索
      </Button>

      {open && q.trim().length >= 2 && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-40">
          <ul id={listboxId} role="listbox" className="bg-popover text-popover-foreground border border-border rounded-md shadow divide-y divide-border">
            {suggestions.map((s, i) => {
              const active = i === activeIdx;
              return (
                <li key={s.unicode} role="option" aria-selected={active} id={`suggestion-${i}`}>
                  <Link
                    prefetch={false}
                    href={`/${lang}/emoji/${encodeURIComponent(s.unicode)}`}
                    className={`flex items-center gap-3 px-3 py-2 ${active ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
                    aria-label={`${t.search.view_details_aria(s.name)}`}
                    onMouseEnter={() => setActiveIdx(i)}
                  >
                    <span className="text-2xl">{s.emoji}</span>
                    <span className="text-sm">
                      <span className="font-medium">{s.name}</span>
                      <span className="text-muted-foreground ml-2">{s.unicode}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </form>
  );
}

