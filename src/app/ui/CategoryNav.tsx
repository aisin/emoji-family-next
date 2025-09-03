import Link from "next/link";
import type { PrimaryCategory } from "@/types";
import { extractLeadingEmoji } from "@/app/ui/utils";

export default function CategoryNav({
  categories,
  currentCategory,
}: {
  categories: PrimaryCategory[];
  currentCategory?: string;
}) {
  return (
    <nav className="flex flex-wrap gap-2">
      {categories.map((c) => {
        const icon = extractLeadingEmoji(c.category) ?? undefined;
        const active = c.slug === currentCategory;
        return (
          <Link
            key={c.slug}
            href={c.url}
            className={`px-3 py-1 rounded-md text-sm border inline-flex items-center gap-1 ${
              active
                ? "bg-brand-600 border-brand-600 text-white"
                : "border-[color:var(--border)] text-[color:var(--muted)] hover:text-brand-600"
            }`}
          >
            {icon && <span className="text-base leading-none">{icon}</span>}
            <span>{c.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}

