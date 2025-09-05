import Link from "next/link";
import LanguageSwitcher from "@/app/ui/LanguageSwitcher";
import type { SupportedLanguage } from "@/app/lib/i18n";
import HeaderNav from "@/app/ui/HeaderNav";
import { uiText } from "@/app/lib/ui-strings";
import { Sheet, SheetContent, SheetTrigger } from "@/app/ui/shadcn/sheet";
import { Button } from "@/app/ui/shadcn/button";
import { Menu } from "lucide-react";

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
        {/* Desktop nav */}
        <HeaderNav lang={lang} />
        {/* Desktop language switcher */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher currentLang={lang} />
        </div>
        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="mt-8 space-y-4">
                <nav className="flex flex-col gap-2" aria-label="Primary">
                  <Link href={`/${lang}`} className="hover:underline">{t.header.home}</Link>
                  <Link href={`/${lang}/categories`} className="hover:underline">{t.header.categories}</Link>
                  <Link href={`/${lang}/search`} className="hover:underline">{t.header.search}</Link>
                </nav>
                <div className="pt-2 border-t">
                  <LanguageSwitcher currentLang={lang} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

