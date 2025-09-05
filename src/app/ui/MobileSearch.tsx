"use client";

import { useState } from "react";
import { Button } from "@/app/ui/shadcn/button";
import { Search as SearchIcon, Menu } from "lucide-react";
import SearchBox from "@/app/ui/SearchBox";
import type { SupportedLanguage } from "@/app/lib/i18n";
import { uiText } from "@/app/lib/ui-strings";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/app/ui/shadcn/sheet";
import LanguageSwitcher from "@/app/ui/LanguageSwitcher";

export default function MobileSearch({
  lang,
  placeholder,
}: {
  lang: SupportedLanguage;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const t = uiText(lang);
  return (
    <div className="md:hidden">
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          aria-label={open ? "Close search" : "Open search"}
          onClick={() => setOpen((v) => !v)}
        >
          <SearchIcon className="h-5 w-5" />
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Press Esc to close</SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              <nav className="flex flex-col gap-2" aria-label="Primary">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/${lang}`}>{t.header.home}</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/${lang}/categories`}>{t.header.categories}</Link>
                </Button>
              </nav>
              <div className="pt-2 border-t">
                <LanguageSwitcher currentLang={lang} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      {open && (
<div className="absolute left-0 right-0 top-full z-40 fade-in w-full px-4 py-3">
          <SearchBox lang={lang} placeholder={placeholder} withSubmitButton={false} autoFocus />
        </div>
      )}
    </div>
  );
}

