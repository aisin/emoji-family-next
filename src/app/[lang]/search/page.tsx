import { redirect } from "next/navigation";
import type { SupportedLanguage } from "@/app/lib/i18n";

// Search page removed — keep the file minimal and redirect to home
export default async function RemovedSearchPage({
  params,
}: {
  params: Promise<{ lang: SupportedLanguage }>;
}) {
  const { lang } = await Promise.resolve(params);
  redirect(`/${lang}`);
}

