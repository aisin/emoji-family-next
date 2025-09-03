"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SupportedLanguage } from "@/app/lib/i18n";
import { SUPPORTED_LANGUAGES } from "@/app/lib/i18n";

function getLanguageName(code: SupportedLanguage) {
  switch (code) {
    case "en":
      return "English";
    case "zh-hans":
      return "简体中文";
    case "zh-hant":
      return "繁體中文";
  }
}

function buildPathForLang(currentPath: string, lang: SupportedLanguage) {
  // 将路径的第一段替换为目标语言
  const parts = currentPath.split("/").filter(Boolean);
  if (parts.length === 0) return `/${lang}`;
  parts[0] = lang;
  return "/" + parts.join("/");
}

export default function LanguageSwitcher({
  currentLang,
}: {
  currentLang: SupportedLanguage;
}) {
  const pathname = usePathname() || "/" + currentLang;

  return (
    <div className="flex items-center gap-2">
      {SUPPORTED_LANGUAGES.map((l) => (
        <Link
          key={l}
          href={buildPathForLang(pathname, l)}
          className={`px-3 py-1 rounded-md text-sm border ${
            l === currentLang
              ? "bg-brand-600 border-brand-600 text-white"
              : "border-[color:var(--border)] text-[color:var(--muted)] hover:text-brand-600"
          }`}
          aria-current={l === currentLang ? "page" : undefined}
        >
          {getLanguageName(l)}
        </Link>
      ))}
    </div>
  );
}

