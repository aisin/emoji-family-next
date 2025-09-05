import { normalizeLang, SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/app/lib/i18n";
import Header from "@/app/ui/Header";
import Footer from "@/app/ui/Footer";
import BackToTop from "@/app/ui/BackToTop";
import ToastProvider from "@/app/ui/ToastProvider";

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolved = await Promise.resolve(params);
  const lang = normalizeLang(resolved.lang);
  return (
    <div lang={lang}>
      {/* Full-width header */}
      <Header lang={lang as SupportedLanguage} />
      {/* Constrained content area */}
      <div className="container">
        <main id="main" className="py-8">{children}</main>
        <BackToTop />
        <ToastProvider />
        <Footer lang={lang as SupportedLanguage} />
      </div>
    </div>
  );
}

