"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SupportedLanguage } from "@/app/lib/i18n";
import { validateSearchQuery } from "@/app/lib/validation";

export default function SearchBox({
  lang,
  placeholder,
}: {
  lang: SupportedLanguage;
  placeholder: string;
}) {
  const [q, setQ] = useState("");
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!validateSearchQuery(q)) return;
        const params = new URLSearchParams({ q });
        router.push(`/${lang}/search?${params.toString()}`);
      }}
      className="flex items-center gap-3"
      role="search"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
className="w-full md:w-96 px-4 py-2 rounded-md bg-white dark:bg-white/5 border border-[color:var(--border)] focus:outline-none focus:ring-2 focus:ring-brand-600"
        aria-label="Search emojis"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-700"
        aria-label="Search"
      >
        搜索
      </button>
    </form>
  );
}

