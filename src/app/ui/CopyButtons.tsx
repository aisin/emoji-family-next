"use client";

import type { SupportedLanguage } from "@/app/lib/i18n";
import { uiText } from "@/app/lib/ui-strings";
import { toast } from "sonner";
import { Button } from "@/app/ui/shadcn/button";

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

  return (
    <div className="flex flex-wrap gap-2">
      <Button title={t.copy.copy_emoji} variant="outline" size="sm" onClick={() => onCopy(emoji, "emoji")}>
        {t.copy.copy_emoji}
      </Button>
      <Button title={t.copy.copy_unicode} variant="outline" size="sm" onClick={() => onCopy(unicode, "unicode")}>
        {t.copy.copy_unicode}
      </Button>
      <Button title={t.copy.copy_shortcode} variant="outline" size="sm" onClick={() => onCopy(shortcode, "shortcode")}>
        {t.copy.copy_shortcode}
      </Button>
      <Button title={t.copy.copy_decimal} variant="outline" size="sm" onClick={() => onCopy(decimal, "decimal")}>
        {t.copy.copy_decimal}
      </Button>
      {showLink && (
        <Button title={t.copy.copy_link} variant="outline" size="sm" onClick={() => onCopy(window.location.href, "link")}>
          {t.copy.copy_link}
        </Button>
      )}
    </div>
  );
}

