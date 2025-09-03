import type { EmojiData, PrimaryCategory } from "@/types";
import { langForData, type SupportedLanguage } from "@/app/lib/i18n";

import primaryEn from "@/data/category/primary/en.json" assert { type: "json" };
import primaryZh from "@/data/category/primary/zh.json" assert { type: "json" };

// 10 大主分类的 Emoji 列表（按语言拆分）
import A_en from "@/data/emojis/category-A/en.json" assert { type: "json" };
import A_zh from "@/data/emojis/category-A/zh.json" assert { type: "json" };
import B_en from "@/data/emojis/category-B/en.json" assert { type: "json" };
import B_zh from "@/data/emojis/category-B/zh.json" assert { type: "json" };
import C_en from "@/data/emojis/category-C/en.json" assert { type: "json" };
import C_zh from "@/data/emojis/category-C/zh.json" assert { type: "json" };
import D_en from "@/data/emojis/category-D/en.json" assert { type: "json" };
import D_zh from "@/data/emojis/category-D/zh.json" assert { type: "json" };
import E_en from "@/data/emojis/category-E/en.json" assert { type: "json" };
import E_zh from "@/data/emojis/category-E/zh.json" assert { type: "json" };
import F_en from "@/data/emojis/category-F/en.json" assert { type: "json" };
import F_zh from "@/data/emojis/category-F/zh.json" assert { type: "json" };
import G_en from "@/data/emojis/category-G/en.json" assert { type: "json" };
import G_zh from "@/data/emojis/category-G/zh.json" assert { type: "json" };
import H_en from "@/data/emojis/category-H/en.json" assert { type: "json" };
import H_zh from "@/data/emojis/category-H/zh.json" assert { type: "json" };
import I_en from "@/data/emojis/category-I/en.json" assert { type: "json" };
import I_zh from "@/data/emojis/category-I/zh.json" assert { type: "json" };
import J_en from "@/data/emojis/category-J/en.json" assert { type: "json" };
import J_zh from "@/data/emojis/category-J/zh.json" assert { type: "json" };

const primaryMap = {
  en: primaryEn as PrimaryCategory[],
  zh: primaryZh as PrimaryCategory[],
} as const;

export type PrimarySlug = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J";

const emojiMap: Record<"en" | "zh", Record<PrimarySlug, EmojiData[]>> = {
  en: {
    A: A_en as EmojiData[],
    B: B_en as EmojiData[],
    C: C_en as EmojiData[],
    D: D_en as EmojiData[],
    E: E_en as EmojiData[],
    F: F_en as EmojiData[],
    G: G_en as EmojiData[],
    H: H_en as EmojiData[],
    I: I_en as EmojiData[],
    J: J_en as EmojiData[],
  },
  zh: {
    A: A_zh as EmojiData[],
    B: B_zh as EmojiData[],
    C: C_zh as EmojiData[],
    D: D_zh as EmojiData[],
    E: E_zh as EmojiData[],
    F: F_zh as EmojiData[],
    G: G_zh as EmojiData[],
    H: H_zh as EmojiData[],
    I: I_zh as EmojiData[],
    J: J_zh as EmojiData[],
  },
};

export function getPrimaryCategories(lang: SupportedLanguage): PrimaryCategory[] {
  return primaryMap[langForData(lang)];
}

export function getEmojisByPrimarySlug(slug: string, lang: SupportedLanguage): EmojiData[] {
  const S = (slug.toUpperCase() || "A") as PrimarySlug;
  const L = langForData(lang);
  return emojiMap[L][S] ?? [];
}

export function getAllEmojis(lang: SupportedLanguage): EmojiData[] {
  const L = langForData(lang);
  const m = emojiMap[L];
  return [
    ...m.A,
    ...m.B,
    ...m.C,
    ...m.D,
    ...m.E,
    ...m.F,
    ...m.G,
    ...m.H,
    ...m.I,
    ...m.J,
  ];
}

export function getEmojiByUnicode(unicode: string, lang: SupportedLanguage): EmojiData | null {
  const all = getAllEmojis(lang);
  const up = unicode.toUpperCase();
  return all.find((e) => e.base_info?.unicode?.toUpperCase() === up) ?? null;
}

