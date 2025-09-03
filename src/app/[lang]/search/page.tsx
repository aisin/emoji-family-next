import { searchEmojis } from "@/app/lib/search";
import type { SupportedLanguage } from "@/app/lib/i18n";
import Link from "next/link";
import { uiText } from "@/app/lib/ui-strings";

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
        <p className="text-[color:var(--muted)]">{t.search.results_count(results.length, q)}</p>
      ) : (
        <>
          <p className="text-[color:var(--muted)]">{t.search.start_typing}</p>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-[color:var(--muted)]">{t.search.try_examples}</span>
            {t.search.examples.map((ex) => (
              <Link key={ex} href={`/${lang}/search?q=${encodeURIComponent(ex)}`} className="px-2 py-1 rounded-md border border-[color:var(--border)] hover:text-brand-600">{ex}</Link>
            ))}
          </div>
        </>
      )}

      {q && results.length === 0 ? (
        <div className="text-center text-[color:var(--muted)] py-12 border border-[color:var(--border)] rounded-md">
          {t.search.no_results(q)}
          <div className="mt-3 flex items-center justify-center gap-3">
            <Link href={`/${lang}/categories`} aria-label={t.common.browse_categories} className="px-3 py-1 rounded-md border border-[color:var(--border)] hover:text-brand-600">{t.common.browse_categories}</Link>
            <Link href={`/${lang}`} aria-label={t.common.back_home} className="px-3 py-1 rounded-md border border-[color:var(--border)] hover:text-brand-600">{t.common.back_home}</Link>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm">
            <span>{t.search.try_examples}</span>
            {t.search.examples.slice(0, 3).map((ex) => (
              <Link key={ex} href={`/${lang}/search?q=${encodeURIComponent(ex)}`} className="px-2 py-1 rounded-md border border-[color:var(--border)] hover:text-brand-600">{ex}</Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {results.map((e) => (
            <Link
              key={e.base_info.unicode}
              href={`/${lang}/emoji/${encodeURIComponent(e.base_info.unicode)}`}
              className="card p-5 block hover:ring-1 hover:ring-brand-500 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
              aria-label={t.search.view_details_aria(e.base_info.short_name)}
            >
              <div className="text-4xl">{e.emoji}</div>
              <div className="text-lg font-semibold">{e.base_info.short_name}</div>
              <div className="text-sm text-[color:var(--muted)]">{e.base_info.unicode}</div>
              <span className="sr-only">{t.common.view_details}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

