import { getPrimaryCategories, getEmojisByPrimarySlug } from "@/app/lib/data";
import EmojiGrid from "@/app/ui/EmojiGrid";
import CategoryNav from "@/app/ui/CategoryNav";
import { extractLeadingEmoji } from "@/app/ui/utils";
import type { SupportedLanguage } from "@/app/lib/i18n";
import Link from "next/link";
import { uiText } from "@/app/lib/ui-strings";

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

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { lang: SupportedLanguage; slug: string } | Promise<{ lang: SupportedLanguage; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await Promise.resolve(params);
  const path = `/${lang}/categories/${slug}`;
  return {
    alternates: {
      canonical: path,
      languages: {
        en: `/en/categories/${slug}`,
        "zh-Hans": `/zh-hans/categories/${slug}`,
        "zh-Hant": `/zh-hant/categories/${slug}`,
      },
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { lang: SupportedLanguage; slug: string } | Promise<{ lang: SupportedLanguage; slug: string }>;
}) {
  const { lang, slug } = await Promise.resolve(params);
  const emojis = getEmojisByPrimarySlug(slug, lang);
  const categories = getPrimaryCategories(lang);
  const t = uiText(lang);

  const current = categories.find((c) => c.slug === slug);

  if (!current) {
    return <div className="text-center text-[color:var(--muted)]">{t.category.not_found}</div>;
  }

  const icon = extractLeadingEmoji(current.category) ?? undefined;

  return (
    <div className="space-y-6 section">
      <div className="flex items-center justify-between">
        <h1 className="section-title flex items-center gap-2">
          {icon && <span className="text-3xl leading-none">{icon}</span>}
          <span>{current.title}</span>
        </h1>
      </div>
      <CategoryNav categories={categories} currentCategory={slug} lang={lang} />
      {emojis.length > 0 ? (
        <EmojiGrid emojis={emojis} lang={lang} />
      ) : (
        <div className="text-center text-[color:var(--muted)] py-12 border border-[color:var(--border)] rounded-md">
          {t.category.empty}
          <div className="mt-3 flex items-center justify-center gap-3">
            <Link href={`/${lang}/search`} aria-label={t.common.go_search} className="px-3 py-1 rounded-md border border-[color:var(--border)] hover:text-brand-600">{t.common.go_search}</Link>
            <Link href={`/${lang}/categories`} aria-label={t.common.back_categories} className="px-3 py-1 rounded-md border border-[color:var(--border)] hover:text-brand-600">{t.common.back_categories}</Link>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm">
            <span>{t.search.try_examples}</span>
            {t.search.examples.slice(0, 2).map((ex) => (
              <Link key={ex} href={`/${lang}/search?q=${encodeURIComponent(ex)}`} aria-label={`示例搜索 ${ex}`} className="px-2 py-1 rounded-md border border-[color:var(--border)] hover:text-brand-600">{ex}</Link>
            ))}
          </div>
        </div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: uiText(lang).header.categories,
                item: `/${lang}/categories`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: current.title,
                item: `/${lang}/categories/${slug}`,
              },
            ],
          }),
        }}
      />
    </div>
  );
}

