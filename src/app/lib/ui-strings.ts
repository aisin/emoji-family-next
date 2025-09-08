import type { SupportedLanguage } from "@/app/lib/i18n";

export type UIText = {
  header: {
    home: string;
    categories: string;
    search: string;
    skip_to_content: string;
  };
  home: {
    title: string;
    tagline: string;
    all_categories: string;
    search_placeholder: string;
    meta_title: string;
  };
  search: {
    title: string;
    start_typing: string;
    results_count: (n: number, q: string) => string;
    no_results: (q: string) => string;
    try_examples: string;
    popular_label: string;
    recent_label: string;
    clear_recent: string;
    examples: string[]; // example query terms to render
    view_details_aria: (name: string) => string;
  };
  common: {
    site_name: string;
    browse_categories: string;
    back_home: string;
    go_search: string;
    back_categories: string;
    view_details: string;
  };
  category: {
    empty: string;
    not_found: string;
    go_to_category_aria: (name: string) => string;
    view_more_sr: string;
  };
  detail: {
    back_to_category: (name: string) => string;
    specs_title: string;
    os_support_title: string;
    multilingual_title: string;
    labels: {
      emoji: string;
      unicode: string;
      shortcode: string;
      decimal: string;
      link: string;
      unicode_version: string;
      emoji_version: string;
      category: string;
      aliases: string;
      keywords: string;
    };
    not_found: string;
    prev_aria: (name: string) => string;
    next_aria: (name: string) => string;
  };
  copy: {
    copy_emoji: string;
    copy_unicode: string;
    copy_shortcode: string;
    copy_decimal: string;
    copy_link: string;
    copied: (label: string) => string;
  };
};

const zhHans: UIText = {
  header: {
    home: "首页",
    categories: "分类",
    search: "搜索",
    skip_to_content: "跳到主要内容",
  },
  home: {
    title: "Emoji Family",
    tagline: "多语言 Emoji 百科全书。按分类浏览、查看技术规格、支持中文与英文。",
    all_categories: "全部分类",
    search_placeholder: "按名称、关键词或 :short_code: 搜索",
    meta_title: "Emoji Family — 分类浏览",
  },
  search: {
    title: "搜索",
    start_typing: "输入关键词开始搜索 Emoji。",
    results_count: (n, q) => `${n} 条结果，关键词 “${q}”`,
    no_results: (q) => `未找到与 “${q}” 匹配的结果。`,
    try_examples: "试试：",
    popular_label: "热门搜索",
    recent_label: "最近搜索",
    clear_recent: "清空",
    examples: ["OK", "U+1F44C", ":ok_hand:", "grinning"],
    view_details_aria: (name) => `查看 ${name} 详情`,
  },
  common: {
    site_name: "Emoji Family",
    browse_categories: "浏览分类",
    back_home: "返回首页",
    go_search: "去搜索",
    back_categories: "返回分类索引",
    view_details: "查看详情",
  },
  category: {
    empty: "该分类暂无内容。",
    not_found: "未找到分类",
    go_to_category_aria: (name) => `跳转到分类 ${name}`,
    view_more_sr: "查看更多",
  },
  detail: {
    back_to_category: (name) => `返回 ${name}`,
    specs_title: "技术规格",
    os_support_title: "系统支持",
    multilingual_title: "多语言名称",
    labels: {
      emoji: "Emoji",
      unicode: "Unicode",
      shortcode: "Short Code",
      decimal: "十进制",
      link: "链接",
      unicode_version: "Unicode 版本",
      emoji_version: "Emoji 版本",
      category: "分类",
      aliases: "别名",
      keywords: "关键词",
    },
    not_found: "未找到 Emoji",
    prev_aria: (name) => `上一条：${name}`,
    next_aria: (name) => `下一条：${name}`,
  },
  copy: {
    copy_emoji: "复制 Emoji",
    copy_unicode: "复制 Unicode",
    copy_shortcode: "复制 Short Code",
    copy_decimal: "复制十进制",
    copy_link: "复制链接",
    copied: (label) => `已复制 ${label}`,
  },
};

const zhHant: UIText = {
  header: {
    home: "首頁",
    categories: "分類",
    search: "搜尋",
    skip_to_content: "跳到主要內容",
  },
  home: {
    title: "Emoji Family",
    tagline: "多語言 Emoji 百科全書。依分類瀏覽、查看技術規格，支援中英文。",
    all_categories: "全部分類",
    search_placeholder: "以名稱、關鍵詞或 :short_code: 搜尋",
    meta_title: "Emoji Family — 分類瀏覽",
  },
  search: {
    title: "搜尋",
    start_typing: "輸入關鍵詞開始搜尋 Emoji。",
    results_count: (n, q) => `${n} 條結果，關鍵詞 “${q}”`,
    no_results: (q) => `未找到與 “${q}” 相符的結果。`,
    try_examples: "試試：",
    popular_label: "熱門搜尋",
    recent_label: "最近搜尋",
    clear_recent: "清除",
    examples: ["OK", "U+1F44C", ":ok_hand:", "grinning"],
    view_details_aria: (name) => `查看 ${name} 詳情`,
  },
  common: {
    site_name: "Emoji Family",
    browse_categories: "瀏覽分類",
    back_home: "返回首頁",
    go_search: "去搜尋",
    back_categories: "返回分類索引",
    view_details: "查看詳情",
  },
  category: {
    empty: "此分類暫無內容。",
    not_found: "未找到分類",
    go_to_category_aria: (name) => `前往分類 ${name}`,
    view_more_sr: "查看更多",
  },
  detail: {
    back_to_category: (name) => `返回 ${name}`,
    specs_title: "技術規格",
    os_support_title: "系統支援",
    multilingual_title: "多語言名稱",
    labels: {
      emoji: "Emoji",
      unicode: "Unicode",
      shortcode: "Short Code",
      decimal: "十進制",
      link: "連結",
      unicode_version: "Unicode 版本",
      emoji_version: "Emoji 版本",
      category: "分類",
      aliases: "別名",
      keywords: "關鍵詞",
    },
    not_found: "找不到 Emoji",
    prev_aria: (name) => `上一個：${name}`,
    next_aria: (name) => `下一個：${name}`,
  },
  copy: {
    copy_emoji: "複製 Emoji",
    copy_unicode: "複製 Unicode",
    copy_shortcode: "複製 Short Code",
    copy_decimal: "複製十進制",
    copy_link: "複製連結",
    copied: (label) => `已複製 ${label}`,
  },
};

const enUS: UIText = {
  header: {
    home: "Home",
    categories: "Categories",
    search: "Search",
    skip_to_content: "Skip to main content",
  },
  home: {
    title: "Emoji Family",
    tagline: "A multilingual emoji encyclopedia. Browse by category, see technical specs, English and Chinese supported.",
    all_categories: "All categories",
    search_placeholder: "Search by name, keyword or :short_code:",
    meta_title: "Emoji Family — Browse categories",
  },
  search: {
    title: "Search",
    start_typing: "Start typing to search for emojis.",
    results_count: (n, q) => `${n} results for “${q}”`,
    no_results: (q) => `No results for “${q}”.`,
    try_examples: "Try:",
    popular_label: "Popular searches",
    recent_label: "Recent searches",
    clear_recent: "Clear",
    examples: ["OK", "U+1F44C", ":ok_hand:", "grinning"],
    view_details_aria: (name) => `View details for ${name}`,
  },
  common: {
    site_name: "Emoji Family",
    browse_categories: "Browse categories",
    back_home: "Back to home",
    go_search: "Go to search",
    back_categories: "Back to categories",
    view_details: "View details",
  },
  category: {
    empty: "No emojis in this category yet.",
    not_found: "Category not found",
    go_to_category_aria: (name) => `Go to category ${name}`,
    view_more_sr: "View more",
  },
  detail: {
    back_to_category: (name) => `Back to ${name}`,
    specs_title: "Technical Specifications",
    os_support_title: "System Support",
    multilingual_title: "Multilingual Names",
    labels: {
      emoji: "Emoji",
      unicode: "Unicode",
      shortcode: "Short code",
      decimal: "Decimal",
      link: "Link",
      unicode_version: "Unicode version",
      emoji_version: "Emoji version",
      category: "Category",
      aliases: "Aliases",
      keywords: "Keywords",
    },
    not_found: "Emoji not found",
    prev_aria: (name) => `Previous: ${name}`,
    next_aria: (name) => `Next: ${name}`,
  },
  copy: {
    copy_emoji: "Copy emoji",
    copy_unicode: "Copy Unicode",
    copy_shortcode: "Copy short code",
    copy_decimal: "Copy decimal",
    copy_link: "Copy link",
    copied: (label) => `Copied ${label}`,
  },
};

export function uiText(lang: SupportedLanguage): UIText {
  switch (lang) {
    case "zh-hans":
      return zhHans;
    case "zh-hant":
      return zhHant;
    case "en":
    default:
      return enUS;
  }
}

