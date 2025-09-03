import Link from "next/link";
import type { PrimaryCategory } from "@/types";
import { extractLeadingEmoji } from "@/app/ui/utils";
import type { SupportedLanguage } from "@/app/lib/i18n";
import { uiText } from "@/app/lib/ui-strings";

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
          <Link
            key={c.slug}
            href={c.url}
            aria-current={active ? "page" : undefined}
            aria-label={t.category.go_to_category_aria(c.title)}
            className={`px-3 py-1 rounded-md text-sm border inline-flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
              active
                ? "bg-brand-600 border-brand-600 text-white"
                : "border-[color:var(--border)] text-[color:var(--muted)] hover:text-brand-600"
            }`}
          >
            {icon && <span className="text-base leading-none">{icon}</span>}
            <span>{c.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}

