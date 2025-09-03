import { getPrimaryCategories } from "@/app/lib/data";
import CategoryCard from "@/app/ui/CategoryCard";
import type { SupportedLanguage } from "@/app/lib/i18n";

export default async function CategoriesIndex({ params }: { params: { lang: SupportedLanguage } | Promise<{ lang: SupportedLanguage }> }) {
  const { lang } = await Promise.resolve(params);
  const categories = getPrimaryCategories(lang);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Categories</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <CategoryCard key={c.slug} category={c} />
        ))}
      </div>
    </div>
  );
}

