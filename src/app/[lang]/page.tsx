import type { Metadata } from "next";
import { getPrimaryCategories } from "@/app/lib/data";
import CategoryCard from "@/app/ui/CategoryCard";
import CategoryNav from "@/app/ui/CategoryNav";
import SearchBox from "@/app/ui/SearchBox";
import type { SupportedLanguage } from "@/app/lib/i18n";
import { uiText } from "@/app/lib/ui-strings";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: SupportedLanguage }>;
}): Promise<Metadata> {
  const { lang } = await Promise.resolve(params);
  const t = uiText(lang);
  const path = `/${lang}`;
  return {
    title: t.home.meta_title,
    description: t.home.tagline,
    alternates: {
      canonical: path,
      languages: {
        en: `/en`,
        "zh-Hans": `/zh-hans`,
        "zh-Hant": `/zh-hant`,
      },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: SupportedLanguage }>;
}) {
  const { lang } = await Promise.resolve(params);
  const categories = getPrimaryCategories(lang);
  const t = uiText(lang);

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          {t.home.title}
        </h1>
<p className="text-muted-foreground max-w-2xl mx-auto">
          {t.home.tagline}
        </p>
      </section>

      <section className="section space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="section-title">{t.home.all_categories}</h2>
        </div>
        <CategoryNav categories={categories} lang={lang} />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} lang={lang} />
          ))}
        </div>
      </section>
    </div>
  );
}

