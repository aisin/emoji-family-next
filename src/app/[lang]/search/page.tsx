import { searchEmojis } from "@/app/lib/search";
import type { SupportedLanguage } from "@/app/lib/i18n";
import Link from "next/link";
import { uiText } from "@/app/lib/ui-strings";
import type { Metadata } from "next";
import { Card } from "@/app/ui/shadcn/card";
import { Button } from "@/app/ui/shadcn/button";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: { lang: SupportedLanguage } | Promise<{ lang: SupportedLanguage }>;
  searchParams: { q?: string } | Promise<{ q?: string }>;
}) {
  const { lang } = await Promise.resolve(params);
  const sp = await Promise.resolve(searchParams);
  const q = (sp.q ?? "").toString();
  const results = q ? searchEmojis(q, lang) : [];
  const t = uiText(lang);

  return (
    <div className="space-y-6 section">
      <h1 className="section-title">{t.search.title}</h1>
      {q ? (
        <p className="text-muted-foreground">{t.search.results_count(results.length, q)}</p>
      ) : (
        <>
          <p className="text-muted-foreground">{t.search.start_typing}</p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">{t.search.try_examples}</span>
            {t.search.examples.map((ex) => (
              <Button asChild key={ex} variant="outline" size="sm">
                <Link href={`/${lang}/search?q=${encodeURIComponent(ex)}`}>{ex}</Link>
              </Button>
            ))}
          </div>
        </>
      )}

      {q && results.length === 0 ? (
        <div className="text-center text-muted-foreground py-12 border border-border rounded-md">
          {t.search.no_results(q)}
          <div className="mt-3 flex items-center justify-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href={`/${lang}/categories`} aria-label={t.common.browse_categories}>{t.common.browse_categories}</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/${lang}`} aria-label={t.common.back_home}>{t.common.back_home}</Link>
            </Button>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm">
            <span>{t.search.try_examples}</span>
            {t.search.examples.slice(0, 3).map((ex) => (
              <Button asChild key={ex} variant="outline" size="sm">
                <Link href={`/${lang}/search?q=${encodeURIComponent(ex)}`}>{ex}</Link>
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {results.map((e) => (
            <Link
              key={e.base_info.unicode}
              href={`/${lang}/emoji/${encodeURIComponent(e.base_info.unicode)}`}
              prefetch={false}
              className="group block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={t.search.view_details_aria(e.base_info.short_name)}
            >
              <Card className="p-5 transition-shadow hover:shadow-md">
                <div className="text-4xl">{e.emoji}</div>
                <div className="text-lg font-semibold">{e.base_info.short_name}</div>
                <div className="text-sm text-muted-foreground">{e.base_info.unicode}</div>
                <span className="sr-only">{t.common.view_details}</span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

