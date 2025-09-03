"use client";

import { useState } from "react";

export default function CopyButtons({
  emoji,
  unicode,
  shortcode,
  decimal,
}: {
  emoji: string;
  unicode: string;
  shortcode: string;
  decimal: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  async function onCopy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // ignore
    }
  }

  const baseCls =
    "px-3 py-1 rounded-md border border-[color:var(--border)] hover:bg-black/5 dark:hover:bg-white/10 text-sm transition-colors";

  return (
    <div className="flex flex-wrap gap-2">
      <button className={baseCls} onClick={() => onCopy(emoji, "emoji")}>复制 Emoji</button>
      <button className={baseCls} onClick={() => onCopy(unicode, "unicode")}>
        复制 Unicode
      </button>
      <button className={baseCls} onClick={() => onCopy(shortcode, "shortcode")}>
        复制 Short Code
      </button>
      <button className={baseCls} onClick={() => onCopy(decimal, "decimal")}>
        复制十进制
      </button>
      {copied && (
        <span className="text-xs text-[color:var(--muted)]">已复制 {copied} ✔</span>
      )}
    </div>
  );
}

