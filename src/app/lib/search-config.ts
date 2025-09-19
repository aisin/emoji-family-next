import type { SupportedLanguage } from "@/app/lib/i18n";

// Configurable popular queries per language. Adjust as needed.
export const POPULAR_QUERIES: Record<SupportedLanguage, string[]> = {
  en: ["OK", "U+1F44C", ":ok_hand:", "grinning"],
  "zh-hans": ["OK", "U+1F44C", ":ok_hand:", "笑脸"],
};

// Configurable recent searches limit (change to any positive integer)
export const RECENT_SEARCH_LIMIT = 10;

