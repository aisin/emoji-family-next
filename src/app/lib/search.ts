import type { EmojiData } from "@/types";
import type { SupportedLanguage } from "@/app/lib/i18n";
import { getAllEmojis } from "@/app/lib/data";
import { coalesceShortCode } from "@/app/lib/validation";

export function searchEmojis(query: string, lang: SupportedLanguage): EmojiData[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const emojis = getAllEmojis(lang);

  return emojis.filter((e) => {
    const b = e.base_info;
    const names = [b.short_name, ...(e.langs?.map((l) => l.name) ?? [])].filter(Boolean);
    const sc = coalesceShortCode(b.short_code);
    const haystack = [
      e.emoji,
      sc,
      b.unicode,
      b.decimal,
      ...(b.keywords ?? []),
      ...names,
      ...(b.known_as ?? []),
    ]
      .filter((x): x is string => Boolean(x))
      .map((s) => s.toLowerCase());

    return haystack.some((v) => v.includes(q));
  });
}

