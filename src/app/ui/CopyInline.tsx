"use client";

import { toast } from "sonner";
import { Copy as CopyIcon } from "lucide-react";
import { Button } from "@/app/ui/shadcn/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/ui/shadcn/tooltip";
import { uiText } from "@/app/lib/ui-strings";
import type { SupportedLanguage } from "@/app/lib/i18n";

export default function CopyInline({
  value,
  label,
  lang = "en",
}: {
  value?: string;
  label: "emoji" | "unicode" | "shortcode" | "decimal" | "link";
  lang?: SupportedLanguage;
}) {
  const t = uiText(lang);

  async function onCopy() {
    try {
      const text = label === "link" ? window.location.href : (value ?? "");
      if (!text) return;
      await navigator.clipboard.writeText(text);
      // Map label to a readable token for the toast message
      const labelToken =
        label === "emoji"
          ? "emoji"
          : label === "unicode"
          ? "unicode"
          : label === "shortcode"
          ? "shortcode"
          : label === "decimal"
          ? "decimal"
          : "link";
      toast.success(t.copy.copied(labelToken));
    } catch {
      // ignore
    }
  }

  const aria =
    label === "emoji"
      ? t.copy.copy_emoji
      : label === "unicode"
      ? t.copy.copy_unicode
      : label === "shortcode"
      ? t.copy.copy_shortcode
      : label === "decimal"
      ? t.copy.copy_decimal
      : t.copy.copy_link;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            aria-label={aria}
            title={aria}
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={onCopy}
          >
            <CopyIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{aria}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

