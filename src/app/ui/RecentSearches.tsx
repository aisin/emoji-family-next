"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SupportedLanguage } from "@/app/lib/i18n";
import { uiText } from "@/app/lib/ui-strings";
import { Button } from "@/app/ui/shadcn/button";
import { RECENT_SEARCH_LIMIT } from "@/app/lib/search-config";

const STORAGE_KEY = "emoji_recent_searches";

function readRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr.filter((x) => typeof x === "string") as string[]) : [];
  } catch {
    return [];
  }
}

function clearRecent() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export default function RecentSearches({ lang }: { lang: SupportedLanguage }) {
  const [items, setItems] = useState<string[]>([]);
  const t = uiText(lang);

  useEffect(() => {
    setItems(readRecent());
  }, []);

  if (!items.length) return null;

  const top = items.slice(0, RECENT_SEARCH_LIMIT);

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{t.search.recent_label}</div>
        <button
          className="text-xs text-muted-foreground hover:underline"
          onClick={() => {
            clearRecent();
            setItems([]);
          }}
          aria-label={t.search.clear_recent}
        >
          {t.search.clear_recent}
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {top.map((q) => (
          <Button asChild key={q} variant="outline" size="sm">
            <Link href={`/${lang}/search?q=${encodeURIComponent(q)}`}>{q}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
}

