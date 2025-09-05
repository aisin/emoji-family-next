"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SupportedLanguage } from "@/app/lib/i18n";
import { SUPPORTED_LANGUAGES } from "@/app/lib/i18n";
import { Button } from "@/app/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/app/ui/shadcn/dropdown-menu";

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

  const currentName = getLanguageName(currentLang);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Language switcher">
          {currentName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SUPPORTED_LANGUAGES.map((l) => {
          const href = buildPathForLang(pathname, l);
          const isActive = l === currentLang;
          return (
            <DropdownMenuItem key={l} asChild className={isActive ? "font-medium text-primary" : undefined}>
              <Link href={href} aria-current={isActive ? "page" : undefined}>
                {getLanguageName(l)}
                {isActive && <DropdownMenuShortcut aria-hidden>✓</DropdownMenuShortcut>}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

