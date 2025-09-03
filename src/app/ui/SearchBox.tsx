"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SupportedLanguage } from "@/app/lib/i18n";
import { validateSearchQuery } from "@/app/lib/validation";
import { uiText } from "@/app/lib/ui-strings";
import { useEffect, useRef } from "react";
import Link from "next/link";

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
      <input
        id="search-input"
        value={q}
        onChange={(e) => {
          const val = e.target.value;
          setQ(val);
          if (!workerRef.current) return;
          if (debounceRef.current) window.clearTimeout(debounceRef.current);
          debounceRef.current = window.setTimeout(() => {
            workerRef.current?.postMessage({ type: "query", q: val });
          }, 200);
        }}
        placeholder={placeholder}
        className="w-full md:w-96 px-4 py-2 rounded-md bg-white dark:bg-white/5 border border-[color:var(--border)] focus:outline-none focus:ring-2 focus:ring-brand-600"
        aria-label={t.search.title}
        autoComplete="off"
        inputMode="search"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-700"
        aria-label="Search"
      >
        搜索
      </button>

      {q.trim().length >= 2 && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-40">
          <ul role="listbox" className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-md shadow divide-y divide-[color:var(--border)]">
            {suggestions.map((s) => (
              <li key={s.unicode} role="option" aria-selected="false">
                <Link
                  prefetch={false}
                  href={`/${lang}/emoji/${encodeURIComponent(s.unicode)}`}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10"
                  aria-label={`${t.search.view_details_aria(s.name)}`}
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <span className="text-sm">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-[color:var(--muted)] ml-2">{s.unicode}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}

