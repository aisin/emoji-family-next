"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { SupportedLanguage } from "@/app/lib/i18n";
import { SUPPORTED_LANGUAGES } from "@/app/lib/i18n";
import { Button } from "@/app/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
  const router = useRouter();

  const currentName = getLanguageName(currentLang);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Language switcher">
          {currentName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={currentLang}
          onValueChange={(val) => {
            const v = val as SupportedLanguage;
            const href = buildPathForLang(pathname, v);
            router.push(href);
          }}
        >
          {SUPPORTED_LANGUAGES.map((l) => (
            <DropdownMenuRadioItem key={l} value={l}>
              {getLanguageName(l)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

