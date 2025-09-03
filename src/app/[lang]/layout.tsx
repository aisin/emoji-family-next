import { normalizeLang, SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/app/lib/i18n";
import Header from "@/app/ui/Header";
import Footer from "@/app/ui/Footer";

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string } | Promise<{ lang: string }>;
}) {
  const resolved = await Promise.resolve(params);
  const lang = normalizeLang(resolved.lang);
  return (
    <div className="container" lang={lang}>
      <Header lang={lang as SupportedLanguage} />
      <main className="py-8">{children}</main>
      <Footer lang={lang as SupportedLanguage} />
    </div>
  );
}

