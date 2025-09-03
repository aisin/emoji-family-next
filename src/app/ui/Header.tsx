import Link from "next/link";
import LanguageSwitcher from "@/app/ui/LanguageSwitcher";
import type { SupportedLanguage } from "@/app/lib/i18n";
import HeaderNav from "@/app/ui/HeaderNav";
import { uiText } from "@/app/lib/ui-strings";

export default function Header({ lang }: { lang: SupportedLanguage }) {
  const t = uiText(lang);
  return (
    <header className="header-sticky py-6">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-brand-600 focus:text-white focus:px-3 focus:py-2 focus:rounded-md">{t.header.skip_to_content}</a>
      <div className="flex items-center justify-between">
        <Link href={`/${lang}`} className="flex items-center gap-3 text-xl font-semibold">
          <span className="text-3xl">🌐</span>
          <span>Emoji Family</span>
        </Link>
        <HeaderNav lang={lang} />
        <div className="flex items-center gap-4">
          <LanguageSwitcher currentLang={lang} />
        </div>
      </div>
    </header>
  );
}

