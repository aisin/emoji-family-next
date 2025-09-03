import { getPrimaryCategories, getEmojisByPrimarySlug } from "@/app/lib/data";
import EmojiGrid from "@/app/ui/EmojiGrid";
import CategoryNav from "@/app/ui/CategoryNav";
import { extractLeadingEmoji } from "@/app/ui/utils";
import type { SupportedLanguage } from "@/app/lib/i18n";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const langs: SupportedLanguage[] = ["en", "zh-hans", "zh-hant"];
  const primarySlugs = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const params: { lang: SupportedLanguage; slug: string }[] = [];
  for (const lang of langs) {
    for (const s of primarySlugs) {
      params.push({ lang, slug: s });
    }
  }
  return params;
}

export default async function CategoryPage({
  params,
}: {
  params: { lang: SupportedLanguage; slug: string } | Promise<{ lang: SupportedLanguage; slug: string }>;
}) {
  const { lang, slug } = await Promise.resolve(params);
  const emojis = getEmojisByPrimarySlug(slug, lang);
  const categories = getPrimaryCategories(lang);

  const current = categories.find((c) => c.slug === slug);

  if (!current) {
    return <div className="text-center text-[color:var(--muted)]">未找到分类</div>;
  }

  const icon = extractLeadingEmoji(current.category) ?? undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          {icon && <span className="text-3xl leading-none">{icon}</span>}
          <span>{current.title}</span>
        </h1>
      </div>
      <CategoryNav categories={categories} currentCategory={slug} />
      <EmojiGrid emojis={emojis} lang={lang} />
    </div>
  );
}

