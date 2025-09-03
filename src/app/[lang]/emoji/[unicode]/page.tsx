import type { Metadata } from "next";
import { getEmojiByUnicode, getAllEmojis } from "@/app/lib/data";
import CopyButtons from "@/app/ui/CopyButtons";
import type { SupportedLanguage } from "@/app/lib/i18n";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const langs: SupportedLanguage[] = ["en", "zh-hans", "zh-hant"];
  // 选取前若干个 Emoji 作为预渲染（也可扩大范围）
  const unicodes = Array.from(
    new Set(
      langs.flatMap((l) => getAllEmojis(l).slice(0, 120).map((e) => e.base_info.unicode))
    )
  );
  const params: { lang: SupportedLanguage; unicode: string }[] = [];
  for (const lang of langs) {
    for (const u of unicodes) {
      params.push({ lang, unicode: u });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { lang: SupportedLanguage; unicode: string } | Promise<{ lang: SupportedLanguage; unicode: string }>;
}): Promise<Metadata> {
  const { lang, unicode } = await Promise.resolve(params);
  const decoded = decodeURIComponent(unicode);
  const data = getEmojiByUnicode(decoded, lang);
  if (!data) {
    return { title: "未找到 Emoji - Emoji Family" };
  }
  const base = data.base_info;
  const title = `${data.emoji} ${base.short_name} - Emoji Family`;
  const description = `${base.short_name} · Unicode: ${base.unicode}`;
  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function EmojiDetailPage({
  params,
}: {
  params: { lang: SupportedLanguage; unicode: string } | Promise<{ lang: SupportedLanguage; unicode: string }>;
}) {
  const { lang, unicode } = await Promise.resolve(params);
  const decoded = decodeURIComponent(unicode);
  const data = getEmojiByUnicode(decoded, lang);
  if (!data) {
    return <div className="text-center text-[color:var(--muted)]">未找到 Emoji</div>;
  }

  const base = data.base_info;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-6xl">{data.emoji}</div>
          <div>
            <h1 className="text-2xl font-semibold">{base.short_name}</h1>
            <p className="text-sm text-[color:var(--muted)]">{base.unicode} · {base.short_code ?? ""} · {base.decimal ?? ""}</p>
          </div>
        </div>
        <CopyButtons emoji={data.emoji} unicode={base.unicode} shortcode={base.short_code ?? ""} decimal={base.decimal ?? ""} />
      </div>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="card p-5 space-y-2">
          <h2 className="text-lg font-semibold">技术规格</h2>
          <ul className="text-sm text-[color:var(--muted)] space-y-1 list-disc pl-5">
            {base.unicode_version && <li>Unicode 版本: {base.unicode_version}</li>}
            {base.emoji_version && <li>Emoji 版本: {base.emoji_version}</li>}
            {base.category && <li>分类: {base.category}{base.sub_category ? ` / ${base.sub_category}` : ""}</li>}
            {Array.isArray(base.known_as) && <li>别名: {base.known_as.join(", ")}</li>}
            {Array.isArray(base.keywords) && <li>关键词: {base.keywords.join(", ")}</li>}
          </ul>
        </div>
        <div className="card p-5 space-y-2">
          <h2 className="text-lg font-semibold">系统支持</h2>
          <ul className="text-sm text-[color:var(--muted)] space-y-1 list-disc pl-5">
            {data.os_support.map((o) => (
              <li key={o.type}>{o.type}: {o.value}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-lg font-semibold mb-2">多语言名称</h2>
        <ul className="text-sm text-[color:var(--muted)] space-y-1 list-disc pl-5">
          {(data.langs ?? []).map((l) => (
            <li key={l.lang}><span className="font-medium">{l.lang}</span>: {l.name}</li>
          ))}
        </ul>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Thing",
            name: `${data.emoji} ${base.short_name}`,
            description: `${base.short_name} (${base.unicode})`,
            identifier: base.unicode,
            category: `${base.category}${base.sub_category ? `/${base.sub_category}` : ""}`,
            keywords: base.keywords ?? [],
          }),
        }}
      />
    </div>
  );
}

