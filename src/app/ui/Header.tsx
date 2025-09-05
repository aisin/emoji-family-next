import Link from "next/link";
import LanguageSwitcher from "@/app/ui/LanguageSwitcher";
import type { SupportedLanguage } from "@/app/lib/i18n";
import HeaderNav from "@/app/ui/HeaderNav";
import { uiText } from "@/app/lib/ui-strings";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/app/ui/shadcn/sheet";
import { Button } from "@/app/ui/shadcn/button";
import { Menu } from "lucide-react";
import SearchBox from "@/app/ui/SearchBox";
import MobileSearch from "@/app/ui/MobileSearch";

export default function Header({ lang }: { lang: SupportedLanguage }) {
  const t = uiText(lang);
  return (
    <header className="header-sticky py-6">
<a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-2 focus:rounded-md">{t.header.skip_to_content}</a>
      <div className="container relative">
        <div className="flex items-center justify-between gap-4">
          {/* Left: logo + nav */}
          <div className="flex items-center gap-4 md:gap-20 lg:gap-24">
            <Link href={`/${lang}`} className="flex items-center gap-3 text-xl font-semibold">
              <span className="text-3xl">🌐</span>
              <span>Emoji Family</span>
            </Link>
            {/* Desktop nav */}
            <HeaderNav lang={lang} />
          </div>
          {/* Right: search + language */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-72">
              <SearchBox lang={lang} placeholder={t.home.search_placeholder} withSubmitButton={false} />
            </div>
            <LanguageSwitcher currentLang={lang} />
          </div>
          {/* Mobile search toggle + menu in same row */}
          <MobileSearch lang={lang} placeholder={t.home.search_placeholder} />
        </div>
      </div>
    </header>
  );
}

