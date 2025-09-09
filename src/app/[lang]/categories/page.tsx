import { getPrimaryCategories } from "@/app/lib/data";
import CategoryCard from "@/app/ui/CategoryCard";
import type { SupportedLanguage } from "@/app/lib/i18n";
import { uiText } from "@/app/lib/ui-strings";

export async function generateMetadata({ params }: { params: Promise<{ lang: SupportedLanguage }> }) {
  const { lang } = await Promise.resolve(params);
  const path = `/${lang}/categories`;
  return {
    alternates: {
      canonical: path,
      languages: {
        en: `/en/categories`,
        "zh-Hans": `/zh-hans/categories`,
      },
    },
  };
}

export default async function CategoriesIndex({ params }: { params: Promise<{ lang: SupportedLanguage }> }) {
  const { lang } = await Promise.resolve(params);
  const categories = getPrimaryCategories(lang);
  const t = uiText(lang);
  return (
    <div className="space-y-6 section">
      <h1 className="section-title">{t.header.categories}</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <CategoryCard key={c.slug} category={c} lang={lang} />
        ))}
      </div>
    </div>
  );
}

