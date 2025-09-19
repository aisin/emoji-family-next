import type { SupportedLanguage } from "@/app/lib/i18n";
export default function Footer({ lang }: { lang: SupportedLanguage }) {
  return (
    <footer className="py-10 text-center text-sm text-muted-foreground">
      <p>
        © {new Date().getFullYear()} Emoji Family · Next.js · {lang}
      </p>
    </footer>
  );
}

