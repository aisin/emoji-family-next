import Link from "next/link";
import type { PrimaryCategory } from "@/types";
import { extractLeadingEmoji } from "@/app/ui/utils";
import type { SupportedLanguage } from "@/app/lib/i18n";
import { uiText } from "@/app/lib/ui-strings";

export default function CategoryCard({
  category,
  lang,
}: {
  category: PrimaryCategory;
  lang: SupportedLanguage;
}) {
  const icon = extractLeadingEmoji(category.category) ?? undefined;
  const t = uiText(lang);
  return (
    <Link
      href={category.url}
      className="card p-5 block hover:ring-1 hover:ring-brand-500 hover:border-brand-400 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
      aria-label={t.category.go_to_category_aria(category.title)}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold flex items-center gap-2">
            {icon && <span className="text-2xl leading-none">{icon}</span>}
            <span>{category.title}</span>
          </div>
          <div className="text-sm text-[color:var(--muted)]">/{category.slug}</div>
          <span className="sr-only">{t.category.view_more_sr}</span>
        </div>
      </div>
    </Link>
  );
}

