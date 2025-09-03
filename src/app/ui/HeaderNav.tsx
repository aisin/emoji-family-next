"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SupportedLanguage } from "@/app/lib/i18n";
import { uiText } from "@/app/lib/ui-strings";

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
    <nav aria-label="Primary" className="hidden md:flex items-center gap-6 text-sm text-[color:var(--muted)]">
      <Link href={home} aria-current={isHome ? "page" : undefined} className={`${base} ${isHome ? active : ""}`}>
        {t.header.home}
      </Link>
      <Link href={categories} aria-current={isCategories ? "page" : undefined} className={`${base} ${isCategories ? active : ""}`}>
        {t.header.categories}
      </Link>
      <Link href={search} aria-current={isSearch ? "page" : undefined} className={`${base} ${isSearch ? active : ""}`}>
        {t.header.search}
      </Link>
    </nav>
  );
}

