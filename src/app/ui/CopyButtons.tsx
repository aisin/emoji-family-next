"use client";

import type { SupportedLanguage } from "@/app/lib/i18n";
import { uiText } from "@/app/lib/ui-strings";
import { toast } from "sonner";

export default function CopyButtons({
  emoji,
  unicode,
  shortcode,
  decimal,
  showLink = false,
  lang = "en",
}: {
  emoji: string;
  unicode: string;
  shortcode: string;
  decimal: string;
  showLink?: boolean;
  lang?: SupportedLanguage;
}) {
  const t = uiText(lang);

  async function onCopy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t.copy.copied(label));
    } catch {
      // ignore
    }
  }

  const baseCls =
    "px-3 py-1 rounded-md border border-[color:var(--border)] hover:bg-black/5 dark:hover:bg-white/10 text-sm transition-colors transition-transform active:scale-95 select-none";

  return (
    <div className="flex flex-wrap gap-2">
      <button title={t.copy.copy_emoji} className={baseCls} onClick={() => onCopy(emoji, "emoji")}>
        {t.copy.copy_emoji}
      </button>
      <button title={t.copy.copy_unicode} className={baseCls} onClick={() => onCopy(unicode, "unicode")}>
        {t.copy.copy_unicode}
      </button>
      <button title={t.copy.copy_shortcode} className={baseCls} onClick={() => onCopy(shortcode, "shortcode")}>
        {t.copy.copy_shortcode}
      </button>
      <button title={t.copy.copy_decimal} className={baseCls} onClick={() => onCopy(decimal, "decimal")}>
        {t.copy.copy_decimal}
      </button>
      {showLink && (
        <button
          title={t.copy.copy_link}
          className={baseCls}
          onClick={() => onCopy(window.location.href, "link")}
        >
          {t.copy.copy_link}
        </button>
      )}
    </div>
  );
}

