import type { MetadataRoute } from "next";
import { getPrimaryCategories, getAllEmojis } from "@/app/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
const langs = ["en", "zh-hans"] as const;
  const base = "https://example.com"; // 可根据部署环境调整

  const entries: MetadataRoute.Sitemap = [];

  for (const lang of langs) {
    entries.push({ url: `${base}/${lang}` });

    const categories = getPrimaryCategories(lang);
    for (const c of categories) {
      entries.push({ url: `${base}/${lang}/categories/${c.slug}` });
    }

    // 仅生成一部分 Emoji 的 sitemap（可扩展）
    const emojis = getAllEmojis(lang).slice(0, 200);
    for (const e of emojis) {
      entries.push({ url: `${base}/${lang}/emoji/${encodeURIComponent(e.base_info.unicode)}` });
    }
  }

  return entries;
}

