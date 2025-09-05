"use client";

import type { SupportedLanguage } from "@/app/lib/i18n";
import { uiText } from "@/app/lib/ui-strings";
import { toast } from "sonner";
import { Button } from "@/app/ui/shadcn/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/app/ui/shadcn/tooltip";

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
    <TooltipProvider>
      <div className="flex flex-wrap gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button aria-label={t.copy.copy_emoji} variant="outline" size="sm" onClick={() => onCopy(emoji, "emoji")}>
              {t.copy.copy_emoji}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t.copy.copy_emoji}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button aria-label={t.copy.copy_unicode} variant="outline" size="sm" onClick={() => onCopy(unicode, "unicode")}>
              {t.copy.copy_unicode}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t.copy.copy_unicode}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button aria-label={t.copy.copy_shortcode} variant="outline" size="sm" onClick={() => onCopy(shortcode, "shortcode")}>
              {t.copy.copy_shortcode}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t.copy.copy_shortcode}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button aria-label={t.copy.copy_decimal} variant="outline" size="sm" onClick={() => onCopy(decimal, "decimal")}>
              {t.copy.copy_decimal}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t.copy.copy_decimal}</TooltipContent>
        </Tooltip>
        {showLink && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button aria-label={t.copy.copy_link} variant="outline" size="sm" onClick={() => onCopy(window.location.href, "link")}>
                {t.copy.copy_link}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t.copy.copy_link}</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}

