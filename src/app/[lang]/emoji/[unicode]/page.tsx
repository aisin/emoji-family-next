import type { Metadata } from "next";
import { getEmojiByUnicode, getAllEmojis, getPrimaryCategories, getEmojisByPrimarySlug } from "@/app/lib/data";
import CopyButtons from "@/app/ui/CopyButtons";
import type { SupportedLanguage } from "@/app/lib/i18n";
import Link from "next/link";
import { uiText } from "@/app/lib/ui-strings";

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
  const t = uiText(lang);
  if (!data) {
    return { title: `${t.detail.not_found} - ${t.common.site_name}` };
  }
  const base = data.base_info;
  const title = `${data.emoji} ${base.short_name} - ${t.common.site_name}`;
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
    const t = uiText(lang);
    return <div className="text-center text-[color:var(--muted)]">{t.detail.not_found}</div>;
  }

  const base = data.base_info;
  const t = uiText(lang);

  // 计算所属主分类信息
  const primarySlugs = ["A","B","C","D","E","F","G","H","I","J"] as const;
  let foundSlug: string | null = null;
  for (const s of primarySlugs) {
    const group = getEmojisByPrimarySlug(s, lang);
    if (group.some((e) => e.base_info?.unicode?.toUpperCase() === base.unicode.toUpperCase())) {
      foundSlug = s;
      break;
    }
  }
  const catList = getPrimaryCategories(lang);
  const catInfo = foundSlug ? catList.find((c) => c.slug === foundSlug) : null;

  return (
    <div className="space-y-6 section">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-6xl">{data.emoji}</div>
          <div>
            <h1 className="section-title">{base.short_name}</h1>
            <p className="text-sm text-[color:var(--muted)]">{base.unicode} · {base.short_code ?? ""} · {base.decimal ?? ""}</p>
            {catInfo && (
              <div className="text-sm text-[color:var(--muted)]">
                <Link href={catInfo.url} className="hover:text-brand-600">{catInfo.title}</Link>
                {base.sub_category ? <span> / {base.sub_category}</span> : null}
              </div>
            )}
          </div>
        </div>
        <CopyButtons showLink lang={lang} emoji={data.emoji} unicode={base.unicode} shortcode={base.short_code ?? ""} decimal={base.decimal ?? ""} />
      </div>

      <section className="grid md:grid-cols-2 gap-6 section">
        <div className="card p-5 space-y-2">
          <h2 className="section-title">{t.detail.specs_title}</h2>
          <dl className="text-sm text-[color:var(--muted)] grid grid-cols-[8rem,1fr] gap-y-1">
            {base.unicode_version && <>
              <dt className="font-medium text-[color:var(--foreground)]">{t.detail.labels.unicode_version}</dt>
              <dd>{base.unicode_version}</dd>
            </>}
            {base.emoji_version && <>
              <dt className="font-medium text-[color:var(--foreground)]">{t.detail.labels.emoji_version}</dt>
              <dd>{base.emoji_version}</dd>
            </>}
            {base.category && <>
              <dt className="font-medium text-[color:var(--foreground)]">{t.detail.labels.category}</dt>
              <dd>{base.category}{base.sub_category ? ` / ${base.sub_category}` : ""}</dd>
            </>}
            {Array.isArray(base.known_as) && <>
              <dt className="font-medium text-[color:var(--foreground)]">{t.detail.labels.aliases}</dt>
              <dd>{base.known_as.join(", ")}</dd>
            </>}
            {Array.isArray(base.keywords) && <>
              <dt className="font-medium text-[color:var(--foreground)]">{t.detail.labels.keywords}</dt>
              <dd>{base.keywords.join(", ")}</dd>
            </>}
          </dl>
        </div>
        <div className="card p-5 space-y-2">
          <h2 className="section-title">{t.detail.os_support_title}</h2>
          <dl className="text-sm text-[color:var(--muted)] grid grid-cols-[8rem,1fr] gap-y-1">
            {data.os_support.map((o) => (
              <>
                <dt className="font-medium text-[color:var(--foreground)]">{o.type}</dt>
                <dd>{o.value}</dd>
              </>
            ))}
          </dl>
        </div>
      </section>

      <section className="card p-5 section">
        <h2 className="section-title mb-2">{t.detail.multilingual_title}</h2>
        <ul className="text-sm text-[color:var(--muted)] space-y-1 list-disc pl-5">
          {(data.langs ?? []).map((l) => (
            <li key={l.lang}><span className="font-medium">{l.lang}</span>: {l.name}</li>
          ))}
        </ul>
      </section>

      {/* Prev/Next + Back to Category navigation */}
      {(() => {
        const list = getAllEmojis(lang);
        const currentIndex = list.findIndex((e) => e.base_info?.unicode?.toUpperCase() === base.unicode.toUpperCase());
        const prev = currentIndex > -1 ? list[(currentIndex - 1 + list.length) % list.length] : null;
        const next = currentIndex > -1 ? list[(currentIndex + 1) % list.length] : null;

        return (
          <nav className="flex items-center justify-between section">
            {prev ? (
              <Link
                href={`/${lang}/emoji/${encodeURIComponent(prev.base_info.unicode)}`}
                aria-label={t.detail.prev_aria(prev.base_info.short_name)}
                className="px-3 py-2 rounded-md border border-[color:var(--border)] hover:text-brand-600 inline-flex items-center gap-2"
              >
                <span>←</span>
                <span className="text-2xl">{prev.emoji}</span>
                <span className="text-sm text-[color:var(--muted)]">{prev.base_info.short_name}</span>
              </Link>
            ) : <span />}

            {catInfo ? (
              <Link href={catInfo.url} className="px-3 py-2 rounded-md border border-[color:var(--border)] hover:text-brand-600">
                {t.detail.back_to_category(catInfo.title)}
              </Link>
            ) : <span />}

            {next ? (
              <Link
                href={`/${lang}/emoji/${encodeURIComponent(next.base_info.unicode)}`}
                aria-label={t.detail.next_aria(next.base_info.short_name)}
                className="px-3 py-2 rounded-md border border-[color:var(--border)] hover:text-brand-600 inline-flex items-center gap-2"
              >
                <span className="text-sm text-[color:var(--muted)]">{next.base_info.short_name}</span>
                <span className="text-2xl">{next.emoji}</span>
                <span>→</span>
              </Link>
            ) : <span />}
          </nav>
        );
      })()}

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

