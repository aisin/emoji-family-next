"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SupportedLanguage } from "@/app/lib/i18n";
import { uiText } from "@/app/lib/ui-strings";
import { Button } from "@/app/ui/shadcn/button";

export default function HeaderNav({ lang }: { lang: SupportedLanguage }) {
  const pathname = usePathname();
  const t = uiText(lang);
  const home = `/${lang}`;
  const categories = `/${lang}/categories`;
  const search = `/${lang}/search`;

  const isHome = pathname === home;
  const isCategories = pathname?.startsWith(categories) ?? false;
  const isSearch = pathname?.startsWith(search) ?? false;

  const base = "hover:text-brand-600 transition-colors";
  const active = "text-brand-600 font-medium";

  return (
    <nav aria-label="Primary" className="hidden md:flex items-center gap-3 text-sm text-muted-foreground">
      <Button asChild variant={isHome ? "default" : "ghost"} size="sm">
        <Link href={home} aria-current={isHome ? "page" : undefined}>
          {t.header.home}
        </Link>
      </Button>
      <Button asChild variant={isCategories ? "default" : "ghost"} size="sm">
        <Link href={categories} aria-current={isCategories ? "page" : undefined}>
          {t.header.categories}
        </Link>
      </Button>
      <Button asChild variant={isSearch ? "default" : "ghost"} size="sm">
        <Link href={search} aria-current={isSearch ? "page" : undefined}>
          {t.header.search}
        </Link>
      </Button>
    </nav>
  );
}

