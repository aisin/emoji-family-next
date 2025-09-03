import Link from "next/link";
import LanguageSwitcher from "@/app/ui/LanguageSwitcher";
import type { SupportedLanguage } from "@/app/lib/i18n";

export default function Header({ lang }: { lang: SupportedLanguage }) {
  return (
    <header className="header-sticky py-6">
      <div className="flex items-center justify-between">
        <Link href={`/${lang}`} className="flex items-center gap-3 text-xl font-semibold">
          <span className="text-3xl">🌐</span>
          <span>Emoji Family</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-[color:var(--muted)]">
          <Link href={`/${lang}`} className="hover:text-brand-600 transition-colors">首页</Link>
          <Link href={`/${lang}/categories`} className="hover:text-brand-600 transition-colors">分类</Link>
          <Link href={`/${lang}/search`} className="hover:text-brand-600 transition-colors">搜索</Link>
        </nav>
        <div className="flex items-center gap-4">
          <LanguageSwitcher currentLang={lang} />
        </div>
      </div>
    </header>
  );
}

