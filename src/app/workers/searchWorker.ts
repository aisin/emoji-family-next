import Fuse from "fuse.js";
import { getAllEmojis } from "@/app/lib/data";
import type { EmojiData } from "@/types";
import type { SupportedLanguage } from "@/app/lib/i18n";
import { coalesceShortCode } from "@/app/lib/validation";

// Message protocol
type InitMsg = { type: "init"; lang: SupportedLanguage };
type QueryMsg = { type: "query"; q: string };
type InMsg = InitMsg | QueryMsg;

type OutMsg =
  | { type: "ready" }
  | {
      type: "results";
      results: { emoji: string; name: string; unicode: string; short_code?: string; category?: string }[];
    };

let fuse: Fuse<EmojiData> | null = null;

function buildFuse(lang: SupportedLanguage) {
  const list = getAllEmojis(lang);
  // Light-weight fields only
  const options = {
    includeScore: false,
    threshold: 0.35,
    keys: [
      { name: "base_info.short_name", weight: 0.6 },
      { name: "emoji", weight: 0.4 },
      { name: "base_info.short_code", weight: 0.3 },
      { name: "base_info.unicode", weight: 0.3 },
      { name: "base_info.decimal", weight: 0.2 },
      { name: "base_info.keywords", weight: 0.3 },
      { name: "langs.name", weight: 0.25 },
      { name: "base_info.known_as", weight: 0.25 },
    ],
    shouldSort: true,
    ignoreLocation: true,
  };
  // Normalize short_code values
  type MutationEmoji = { base_info: { short_code?: string } };
  for (const e of list as unknown as MutationEmoji[]) {
    e.base_info.short_code = coalesceShortCode(e.base_info.short_code) ?? undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fuse = new (Fuse as any)(list, options);
}

self.onmessage = (ev: MessageEvent<InMsg>) => {
  const msg = ev.data;
  if (msg.type === "init") {
    buildFuse(msg.lang);
    (self as unknown as Worker).postMessage({ type: "ready" } satisfies OutMsg);
    return;
  }
  if (msg.type === "query") {
    if (!fuse || !msg.q || msg.q.trim().length < 2) {
      (self as unknown as Worker).postMessage({ type: "results", results: [] } satisfies OutMsg);
      return;
    }
    const q = msg.q.trim();
    const hits = fuse.search(q, { limit: 10 });
    const results = hits.map((h) => ({
      emoji: h.item.emoji,
      name: h.item.base_info.short_name,
      unicode: h.item.base_info.unicode,
      short_code: h.item.base_info.short_code,
      category: h.item.base_info.category,
    }));
    (self as unknown as Worker).postMessage({ type: "results", results } satisfies OutMsg);
  }
};

