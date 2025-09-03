export default function Footer({ lang }: { lang: "en" | "zh-hans" | "zh-hant" }) {
  return (
    <footer className="py-10 text-center text-sm text-[color:var(--muted)]">
      <p>
        © {new Date().getFullYear()} Emoji Family · Next.js · {lang}
      </p>
    </footer>
  );
}

