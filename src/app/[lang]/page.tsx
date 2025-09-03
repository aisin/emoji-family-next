import type { Metadata } from "next";
import { getPrimaryCategories } from "@/app/lib/data";
import CategoryCard from "@/app/ui/CategoryCard";
import CategoryNav from "@/app/ui/CategoryNav";
import SearchBox from "@/app/ui/SearchBox";
import type { SupportedLanguage } from "@/app/lib/i18n";

export const metadata: Metadata = {
  title: "Emoji Family — 分类浏览",
};

export default async function HomePage({
  params,
}: {
  params: { lang: SupportedLanguage } | Promise<{ lang: SupportedLanguage }>;
}) {
  const { lang } = await Promise.resolve(params);
  const categories = getPrimaryCategories(lang);

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Emoji Family
        </h1>
        <p className="text-[color:var(--muted)] max-w-2xl mx-auto">
          多语言 Emoji 百科全书。按分类浏览、查看技术规格、支持中文与英文。
        </p>
        <div className="flex justify-center">
          <SearchBox lang={lang} placeholder="按名称、关键词或 :short_code: 搜索" />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">全部分类</h2>
        </div>
        <CategoryNav categories={categories} />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>
    </div>
  );
}

