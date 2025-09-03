import { searchEmojis } from "@/app/lib/search";
import type { SupportedLanguage } from "@/app/lib/i18n";

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">搜索</h1>
      {q ? (
        <p className="text-[color:var(--muted)]">{results.length} 条结果，关键词 “{q}”</p>
      ) : (
        <p className="text-[color:var(--muted)]">输入关键词开始搜索 Emoji。</p>
      )}

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {results.map((e) => (
          <div key={e.base_info.unicode} className="card p-5">
            <div className="text-4xl">{e.emoji}</div>
            <div className="text-lg font-semibold">{e.base_info.short_name}</div>
            <div className="text-sm text-[color:var(--muted)]">{e.base_info.unicode}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

