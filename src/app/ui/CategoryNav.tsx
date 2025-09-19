import Link from "next/link";
import type { PrimaryCategory } from "@/types";
import { extractLeadingEmoji } from "@/app/ui/utils";
import type { SupportedLanguage } from "@/app/lib/i18n";
import { uiText } from "@/app/lib/ui-strings";
import { Button } from "@/app/ui/shadcn/button";

export default function CategoryNav({
  categories,
  currentCategory,
  lang,
}: {
  categories: PrimaryCategory[];
  currentCategory?: string;
  lang: SupportedLanguage;
}) {
  const t = uiText(lang);
  return (
    <nav className="flex flex-wrap gap-2">
      {categories.map((c) => {
        const icon = extractLeadingEmoji(c.category) ?? undefined;
        const active = c.slug === currentCategory;
        return (
          <Button
            asChild
            key={c.slug}
            variant={active ? "default" : "outline"}
            size="sm"
            className="px-3 py-1"
          >
            <Link
              href={c.url}
              aria-current={active ? "page" : undefined}
              aria-label={t.category.go_to_category_aria(c.title)}
              className="inline-flex items-center gap-1"
            >
              {icon && <span className="text-base leading-none">{icon}</span>}
              <span>{c.title}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

