import { ImageResponse } from "next/og";
import { getEmojiByUnicode } from "@/app/lib/data";
import type { SupportedLanguage } from "@/app/lib/i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { lang: SupportedLanguage; unicode: string } }) {
  const { lang, unicode } = params;
  const decoded = decodeURIComponent(unicode);
  const data = getEmojiByUnicode(decoded, lang);

  const title = data?.base_info.short_name ?? decoded.toUpperCase();
  const emoji = data?.emoji ?? "❓";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ fontSize: 220, lineHeight: 1 }}>{emoji}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 64, fontWeight: 800 }}>{title}</div>
            <div style={{ fontSize: 28, opacity: 0.85 }}>{decoded.toUpperCase()}</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

