import EmojiCard from "@/app/ui/EmojiCard";
import type { EmojiData } from "@/types";
import type { SupportedLanguage } from "@/app/lib/i18n";

export default function EmojiGrid({
  emojis,
  lang,
  columns = 3,
}: {
  emojis: EmojiData[];
  lang: SupportedLanguage;
  columns?: number;
}) {
  const colClass =
    columns === 2
      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      : columns === 4
      ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
      : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <div className={`grid gap-4 ${colClass}`}>
      {emojis.map((e) => (
        <EmojiCard key={e.base_info.unicode} emoji={e} lang={lang} />
      ))}
    </div>
  );
}

