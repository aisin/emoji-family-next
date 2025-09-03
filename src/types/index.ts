export type Language = "en" | "zh-hans" | "zh-hant";

export interface OSSupport {
  type: "iOS" | "android" | "windows";
  value: string;
}

export interface LanguageData {
  lang: string;
  name: string;
}

export interface EmojiBaseInfo {
  emoji: string;
  short_name: string;
  apple_name?: string;
  known_as?: string[];
  unicode: string;
  short_code?: string; // 注：部分 zh.json 使用了错误 key：undefined
  decimal?: string;
  unicode_version?: string;
  emoji_version?: string;
  category: string; // 源数据中是带图标+名称，如 "😂 Smileys & Emotion"
  sub_category?: string; // 如 "😄 Smiling Face"
  keywords?: string[];
  proposal?: string[];
}

export interface EmojiData {
  emoji: string;
  os_support: OSSupport[];
  images_url?: string;
  base_info: EmojiBaseInfo;
  langs?: LanguageData[];
}

export interface PrimaryCategory {
  category: string; // 带 Emoji 的分类名称
  title: string; // 分类标题
  slug: string; // A-J
  url: string; // 完整 URL
}

