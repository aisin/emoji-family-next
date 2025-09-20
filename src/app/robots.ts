import type { MetadataRoute } from "next";

// Static generate for export
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
    ],
    sitemap: "https://example.com/sitemap.xml",
  };
}

