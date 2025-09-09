export const SUPPORTED_LANGUAGES = ["en", "zh-hans"] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];
export const DEFAULT_LANG: SupportedLanguage = "en";

export function isSupportedLang(lang: string): lang is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}

export function normalizeLang(lang: string | undefined): SupportedLanguage {
  if (!lang) return DEFAULT_LANG;
  const lower = lang.toLowerCase();
  if (lower === "zh" || lower === "zh-cn") return "zh-hans";
  if (lower === "zh-tw" || lower === "zh-hk" || lower === "zh-hant") return "zh-hans";
  return isSupportedLang(lower) ? (lower as SupportedLanguage) : DEFAULT_LANG;
}

export function langForData(lang: SupportedLanguage): "en" | "zh" {
  // 数据目录只有 en 和 zh（简体/繁体均落到 zh 数据）
  if (lang === "en") return "en";
  return "zh";
}

