import Link from "next/link";
import type { EmojiData } from "@/types";
import type { SupportedLanguage } from "@/app/lib/i18n";
import { uiText } from "@/app/lib/ui-strings";

export default function EmojiCard({
  emoji,
  lang,
  size = "medium",
}: {
  emoji: EmojiData;
  lang: SupportedLanguage;
  size?: "small" | "medium" | "large";
}) {
  const t = uiText(lang);
  const sizeClass = size === "small" ? "text-3xl" : size === "large" ? "text-6xl" : "text-4xl";
  return (
    <Link
      href={`/${lang}/emoji/${encodeURIComponent(emoji.base_info.unicode)}`}
      prefetch={false}
      aria-label={t.search.view_details_aria(emoji.base_info.short_name)}
      className="card p-5 hover:ring-1 hover:ring-brand-500 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
    >
      <div className="flex items-center gap-4">
        <div className={`${sizeClass}`}>{emoji.emoji}</div>
        <div>
          <div className="text-lg font-semibold">{emoji.base_info.short_name}</div>
          <div className="text-sm text-[color:var(--muted)]">{emoji.base_info.unicode}</div>
          <span className="sr-only">{t.common.view_details}</span>
        </div>
      </div>
    </Link>
  );
}

